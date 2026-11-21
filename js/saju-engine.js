/*!
 * 운명나침반 명리 엔진 (saju-engine.js)
 * - 사주 원국(년·월·일·시), 지장간, 십성, 12운성, 신살·귀인, 대운·세운·월운
 * - 양력/음력 변환(한국천문연구원 음양력 데이터 1936~2030 기반)
 * - index.html·order-status.html·manse.html에서 동일한 계산 결과를 쓰기 위한 공용 모듈
 */
(function (global) {
  'use strict';

  var GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  var JI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  var HANGUL_GAN = { '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무', '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계' };
  var HANGUL_JI = { '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사', '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해' };

  var ELEM_OF_GAN = {
    '甲': 'wood', '乙': 'wood', '丙': 'fire', '丁': 'fire', '戊': 'earth',
    '己': 'earth', '庚': 'metal', '辛': 'metal', '壬': 'water', '癸': 'water'
  };
  var ELEM_OF_JI = {
    '寅': 'wood', '卯': 'wood', '巳': 'fire', '午': 'fire', '辰': 'earth', '戌': 'earth',
    '丑': 'earth', '未': 'earth', '申': 'metal', '酉': 'metal', '亥': 'water', '子': 'water'
  };
  var ELEM_KR = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  var ELEM_ICON = { wood: '🌳', fire: '🔥', earth: '⛰️', metal: '⚔️', water: '🌊' };
  var ELEM_ORDER = ['wood', 'fire', 'earth', 'metal', 'water'];

  var MOTHER_OF = { wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal' };
  var DRAIN_OF = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
  var WEALTH_OF = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
  var OFFICER_OF = { wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth' };

  // 지장간 (여기 → 중기 → 정기)
  var JIGANGAN = {
    '子': ['壬', '癸'], '丑': ['癸', '辛', '己'], '寅': ['戊', '丙', '甲'], '卯': ['甲', '乙'],
    '辰': ['乙', '癸', '戊'], '巳': ['戊', '庚', '丙'], '午': ['丙', '己', '丁'], '未': ['丁', '乙', '己'],
    '申': ['戊', '壬', '庚'], '酉': ['庚', '辛'], '戌': ['辛', '丁', '戊'], '亥': ['戊', '甲', '壬']
  };
  var MAIN_STEM_OF_JI = {
    '子': '癸', '丑': '己', '寅': '甲', '卯': '乙', '辰': '戊', '巳': '丙',
    '午': '丁', '未': '己', '申': '庚', '酉': '辛', '戌': '戊', '亥': '壬'
  };

  // 12운성 (일간 기준, 12지지 순)
  var WOONSUNG = {
    '甲': ['목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생'],
    '乙': ['병', '쇠', '제왕', '건록', '관대', '목욕', '장생', '양', '태', '절', '묘', '사'],
    '丙': ['태', '양', '장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절'],
    '丁': ['절', '묘', '사', '병', '쇠', '제왕', '건록', '관대', '목욕', '장생', '양', '태'],
    '戊': ['태', '양', '장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절'],
    '己': ['절', '묘', '사', '병', '쇠', '제왕', '건록', '관대', '목욕', '장생', '양', '태'],
    '庚': ['사', '묘', '절', '태', '양', '장생', '목욕', '관대', '건록', '제왕', '쇠', '병'],
    '辛': ['장생', '양', '태', '절', '묘', '사', '병', '쇠', '제왕', '건록', '관대', '목욕'],
    '壬': ['제왕', '쇠', '병', '사', '묘', '절', '태', '양', '장생', '목욕', '관대', '건록'],
    '癸': ['건록', '관대', '목욕', '장생', '양', '태', '절', '묘', '사', '병', '쇠', '제왕']
  };

  var NABEUM = {
    '甲子': '해중금', '乙丑': '해중금', '丙寅': '노중화', '丁卯': '노중화', '戊辰': '대림목', '己巳': '대림목',
    '庚午': '노방토', '辛未': '노방토', '壬申': '검봉금', '癸酉': '검봉금', '甲戌': '산두화', '乙亥': '산두화',
    '丙子': '간하수', '丁丑': '간하수', '戊寅': '성두토', '己卯': '성두토', '庚辰': '백납금', '辛巳': '백납금',
    '壬午': '양류목', '癸未': '양류목', '甲申': '천중수', '乙酉': '천중수', '丙戌': '옥상토', '丁亥': '옥상토',
    '戊子': '벽력화', '己丑': '벽력화', '庚寅': '송백목', '辛卯': '송백목', '壬辰': '장류수', '癸巳': '장류수',
    '甲午': '사중금', '乙未': '사중금', '丙申': '산하화', '丁酉': '산하화', '戊戌': '평지목', '己亥': '평지목',
    '庚子': '벽상토', '辛丑': '벽상토', '壬寅': '금박금', '癸卯': '금박금', '甲辰': '복등화', '乙巳': '복등화',
    '丙午': '천하수', '丁未': '천하수', '戊申': '대역토', '己酉': '대역토', '庚戌': '채천금', '辛亥': '채천금',
    '壬子': '상자목', '癸丑': '상자목', '甲寅': '대계수', '乙卯': '대계수', '丙辰': '사중토', '丁巳': '사중토',
    '戊午': '천상화', '己未': '천상화', '庚申': '석류목', '辛酉': '석류목', '壬戌': '대해수', '癸亥': '대해수'
  };

  var SINSAL_ORDER = ['지살', '년살', '월살', '망신살', '장성살', '반안살', '역마살', '육해살', '화개살', '겁살', '재살', '천살'];

  var CHEONEUL = {
    '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['丑', '未'],
    '乙': ['子', '申'], '己': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
    '辛': ['寅', '午'], '壬': ['卯', '巳'], '癸': ['卯', '巳']
  };
  var CHEONDEOK = { '子': '巳', '丑': '庚', '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛', '午': '亥', '未': '甲', '申': '癸', '酉': '寅', '戌': '丙', '亥': '乙' };
  var WOLDEOK = { '寅': '丙', '午': '丙', '戌': '丙', '申': '壬', '子': '壬', '辰': '壬', '巳': '庚', '酉': '庚', '丑': '庚', '亥': '甲', '卯': '甲', '未': '甲' };
  var MUNCHANG = { '甲': '巳', '乙': '午', '丙': '申', '丁': '酉', '戊': '申', '己': '酉', '庚': '亥', '辛': '子', '壬': '寅', '癸': '卯' };
  var HYEONCHIM = ['甲', '辛', '壬', '癸', '申', '卯', '午'];

  // ── 음양력 변환 테이블 (1936~2030) ──────────────────────────────
  // 각 값 = (음력 1월 1일의 양력 월 << 25) | (일 << 20) | (윤달 월 << 16) | 월 길이 비트
  var LUNAR_START_YEAR = 1936;
  // [음력 1월 1일의 양력 월, 일, 윤달 월, 윤달이 30일인지, 1~12월 길이(1=30일)]
  // 출처: 한국천문연구원 음양력 데이터(1936~2030)
  var LUNAR_TABLE = [
    [1, 24, 3, 1, '100010101110'], // 1936
    [2, 11, 0, 0, '100100101110'], // 1937
    [1, 31, 7, 1, '110010001101'], // 1938
    [2, 19, 0, 0, '110010010101'], // 1939
    [2, 8, 0, 0, '110101001010'], // 1940
    [1, 27, 6, 1, '110110001010'], // 1941
    [2, 15, 0, 0, '101101101001'], // 1942
    [2, 5, 0, 0, '010101101101'], // 1943
    [1, 26, 4, 1, '001001011011'], // 1944
    [2, 13, 0, 0, '001001011101'], // 1945
    [2, 2, 0, 0, '100100101101'], // 1946
    [1, 22, 2, 0, '110100101011'], // 1947
    [2, 10, 0, 0, '101010010101'], // 1948
    [1, 29, 7, 0, '110101010101'], // 1949
    [2, 17, 0, 0, '101101001010'], // 1950
    [2, 6, 0, 0, '101101010101'], // 1951
    [1, 27, 5, 1, '010101010101'], // 1952
    [2, 14, 0, 0, '010011011011'], // 1953
    [2, 4, 0, 0, '001001011011'], // 1954
    [1, 24, 3, 1, '100001010111'], // 1955
    [2, 12, 0, 0, '010100101011'], // 1956
    [1, 31, 8, 0, '101010011011'], // 1957
    [2, 19, 0, 0, '011010010101'], // 1958
    [2, 8, 0, 0, '011010101010'], // 1959
    [1, 28, 6, 0, '101011101010'], // 1960
    [2, 15, 0, 0, '101010110101'], // 1961
    [2, 5, 0, 0, '010010110110'], // 1962
    [1, 25, 4, 0, '101010101110'], // 1963
    [2, 13, 0, 0, '101001010111'], // 1964
    [2, 2, 0, 0, '010100100111'], // 1965
    [1, 22, 3, 0, '011100100110'], // 1966
    [2, 9, 0, 0, '110110010101'], // 1967
    [1, 30, 7, 0, '011010110101'], // 1968
    [2, 17, 0, 0, '010101101010'], // 1969
    [2, 6, 0, 0, '100110101101'], // 1970
    [1, 27, 5, 0, '010011011101'], // 1971
    [2, 15, 0, 0, '010010101110'], // 1972
    [2, 3, 0, 0, '101001001110'], // 1973
    [1, 23, 4, 0, '110101001101'], // 1974
    [2, 11, 0, 0, '110100100101'], // 1975
    [1, 31, 8, 0, '110101011001'], // 1976
    [2, 18, 0, 0, '101101010100'], // 1977
    [2, 7, 0, 0, '110101101010'], // 1978
    [1, 28, 6, 1, '100101011010'], // 1979
    [2, 16, 0, 0, '100101011011'], // 1980
    [2, 5, 0, 0, '010010011011'], // 1981
    [1, 25, 4, 0, '101010011011'], // 1982
    [2, 13, 0, 0, '101001001011'], // 1983
    [2, 2, 10, 0, '101100100111'], // 1984
    [2, 20, 0, 0, '011010100101'], // 1985
    [2, 9, 0, 0, '011011010100'], // 1986
    [1, 29, 6, 0, '101101110101'], // 1987
    [2, 18, 0, 0, '001010110110'], // 1988
    [2, 6, 0, 0, '100101011011'], // 1989
    [1, 27, 5, 0, '010010110111'], // 1990
    [2, 15, 0, 0, '010010010111'], // 1991
    [2, 4, 0, 0, '011001001011'], // 1992
    [1, 23, 3, 0, '011101001010'], // 1993
    [2, 10, 0, 0, '111010100101'], // 1994
    [1, 31, 8, 0, '011011011001'], // 1995
    [2, 19, 0, 0, '010110101101'], // 1996
    [2, 8, 0, 0, '001010110110'], // 1997
    [1, 28, 5, 0, '100101101110'], // 1998
    [2, 16, 0, 0, '100100101110'], // 1999
    [2, 5, 0, 0, '110010010110'], // 2000
    [1, 24, 4, 0, '111010010101'], // 2001
    [2, 12, 0, 0, '110101001010'], // 2002
    [2, 1, 0, 0, '110110100101'], // 2003
    [1, 22, 2, 0, '011101010101'], // 2004
    [2, 9, 0, 0, '010101101100'], // 2005
    [1, 29, 7, 0, '101010111011'], // 2006
    [2, 18, 0, 0, '001001011101'], // 2007
    [2, 7, 0, 0, '100100101101'], // 2008
    [1, 26, 5, 0, '110010101011'], // 2009
    [2, 14, 0, 0, '101010010101'], // 2010
    [2, 3, 0, 0, '101101001010'], // 2011
    [1, 23, 3, 1, '101101001010'], // 2012
    [2, 10, 0, 0, '101101010101'], // 2013
    [1, 31, 9, 0, '010101011101'], // 2014
    [2, 19, 0, 0, '010010111010'], // 2015
    [2, 8, 0, 0, '101001011011'], // 2016
    [1, 28, 5, 0, '010101010111'], // 2017
    [2, 16, 0, 0, '010100101011'], // 2018
    [2, 5, 0, 0, '101010010101'], // 2019
    [1, 25, 4, 0, '101110010101'], // 2020
    [2, 12, 0, 0, '011010101010'], // 2021
    [2, 1, 0, 0, '101011010101'], // 2022
    [1, 22, 2, 0, '011010110101'], // 2023
    [2, 10, 0, 0, '010010110110'], // 2024
    [1, 29, 6, 0, '101001101110'], // 2025
    [2, 17, 0, 0, '101001010111'], // 2026
    [2, 7, 0, 0, '010100100111'], // 2027
    [1, 27, 5, 0, '011010100110'], // 2028
    [2, 13, 0, 0, '110110010011'], // 2029
    [2, 3, 0, 0, '010110101010'], // 2030
  ];

  function decodeLunarYear(year) {
    var idx = year - LUNAR_START_YEAR;
    if (idx < 0 || idx >= LUNAR_TABLE.length) return null;
    var row = LUNAR_TABLE[idx];
    var monthDays = [];
    for (var i = 0; i < 12; i++) monthDays.push(row[4].charAt(i) === '1' ? 30 : 29);
    return { newMonth: row[0], newDay: row[1], leapMonth: row[2], leapDays: row[3] ? 30 : 29, monthDays: monthDays };
  }

  function lunarMonthLength(year, month, isLeap) {
    var info = decodeLunarYear(year);
    if (!info) return 0;
    if (isLeap) return (info.leapMonth === month) ? info.leapDays : 0;
    return info.monthDays[month - 1] || 0;
  }

  function lunarToSolar(y, m, d, isLeap) {
    y = parseInt(y, 10); m = parseInt(m, 10); d = parseInt(d, 10);
    var info = decodeLunarYear(y);
    if (!info) return null;
    if (isLeap && info.leapMonth !== m) return null;
    if (m < 1 || m > 12 || d < 1) return null;
    var len = isLeap ? info.leapDays : info.monthDays[m - 1];
    if (d > len) return null;

    var offset = 0;
    for (var mm = 1; mm < m; mm++) {
      offset += info.monthDays[mm - 1];
      if (info.leapMonth === mm) offset += info.leapDays;
    }
    if (isLeap) offset += info.monthDays[m - 1];
    offset += d - 1;

    var base = new Date(Date.UTC(y, info.newMonth - 1, info.newDay));
    base.setUTCDate(base.getUTCDate() + offset);
    return { y: base.getUTCFullYear(), m: base.getUTCMonth() + 1, d: base.getUTCDate() };
  }

  // ── 천문 계산 ─────────────────────────────────────────────────
  function getJulianDay(y, m, d) {
    var a = Math.floor((14 - m) / 12);
    var yr = y + 4800 - a;
    var mo = m + 12 * a - 3;
    return d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045;
  }

  function getSolarLongitude(y, m, d, hr, mn) {
    var jdn = getJulianDay(y, m, d);
    var jd = jdn + (hr - 12) / 24.0 + (mn || 0) / 1440.0 - 9.0 / 24.0;
    var T = (jd - 2451545.0) / 36525.0;
    var L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    var M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    var Mr = M * Math.PI / 180.0;
    var C = (1.914602 - 0.004817 * T) * Math.sin(Mr) + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) + 0.000289 * Math.sin(3 * Mr);
    var trueLong = (L0 + C) % 360;
    var appLong = (trueLong - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * T) * Math.PI / 180.0)) % 360;
    return (appLong + 360) % 360;
  }

  // ── 명리 보조 ──────────────────────────────────────────────────
  function getShipshin(meGan, otherGan) {
    var meElem = ELEM_OF_GAN[meGan];
    var otherElem = ELEM_OF_GAN[otherGan];
    if (!meElem || !otherElem) return '-';
    var meIdx = GAN.indexOf(meGan);
    var otherIdx = GAN.indexOf(otherGan);
    var same = (meIdx % 2) === (otherIdx % 2);
    if (meElem === otherElem) return same ? '비견' : '겁재';
    if (DRAIN_OF[meElem] === otherElem) return same ? '식신' : '상관';
    if (WEALTH_OF[meElem] === otherElem) return same ? '편재' : '정재';
    if (OFFICER_OF[meElem] === otherElem) return same ? '편관' : '정관';
    return same ? '편인' : '정인';
  }

  var SIPSIN_GROUP = {
    '비견': '비겁', '겁재': '비겁', '식신': '식상', '상관': '식상',
    '편재': '재성', '정재': '재성', '편관': '관성', '정관': '관성', '편인': '인성', '정인': '인성'
  };

  function getSinsal(baseJi, targetJi) {
    var startIdx;
    if (['寅', '午', '戌'].indexOf(baseJi) >= 0) startIdx = 2;
    else if (['申', '子', '辰'].indexOf(baseJi) >= 0) startIdx = 8;
    else if (['巳', '酉', '丑'].indexOf(baseJi) >= 0) startIdx = 5;
    else startIdx = 11;
    var diff = (JI.indexOf(targetJi) - startIdx + 12) % 12;
    return SINSAL_ORDER[diff];
  }

  function getGongmang(ganChar, jiChar) {
    var gI = GAN.indexOf(ganChar);
    var jI = JI.indexOf(jiChar);
    if (gI < 0 || jI < 0) return '-';
    var startJi = (jI - gI + 12) % 12;
    var XUN_ORDER = [0, 10, 8, 6, 4, 2];
    var PAIRS = ['戌亥', '申酉', '午未', '辰巳', '寅卯', '子丑'];
    var idx = XUN_ORDER.indexOf(startJi);
    return idx !== -1 ? PAIRS[idx] : '-';
  }

  // 천간합 · 지지합 · 충
  var GAN_HAP = { '甲己': '토(土)', '乙庚': '금(金)', '丙辛': '수(水)', '丁壬': '목(木)', '戊癸': '화(火)' };
  var JI_CHUNG = ['子午', '丑未', '寅申', '卯酉', '辰戌', '巳亥'];
  var JI_YUKHAP = { '子丑': '토', '寅亥': '목', '卯戌': '화', '辰酉': '금', '巳申': '수', '午未': '토' };
  var JI_SAMHAP = ['申子辰', '亥卯未', '寅午戌', '巳酉丑'];

  function pairKey(a, b) {
    return [a, b].sort().join('');
  }

  function relationOf(a, b) {
    var rel = [];
    if (!a || !b || a === b) return rel;
    var pk = pairKey(a, b);
    if (JI_CHUNG.indexOf(pk) >= 0) rel.push('충(沖)');
    if (JI_YUKHAP[pk]) rel.push('육합(' + JI_YUKHAP[pk] + ')');
    if (JI_SAMHAP.some(function (s) { return s.indexOf(a) >= 0 && s.indexOf(b) >= 0; })) rel.push('삼합 인연');
    return rel;
  }

  // ── 대운 기산수 ────────────────────────────────────────────────
  function calculateDaeunNumber(y, m, d, forward) {
    var step = forward ? 1 : -1;
    var baseSl = getSolarLongitude(y, m, d, 12, 0);
    var baseTerm = Math.floor(((baseSl - 315 + 360) % 360) / 30);
    var days = 3;
    for (var i = 1; i <= 35; i++) {
      var cur = new Date(y, m - 1, d + i * step);
      var sl = getSolarLongitude(cur.getFullYear(), cur.getMonth() + 1, cur.getDate(), 12, 0);
      var term = Math.floor(((sl - 315 + 360) % 360) / 30);
      if (term !== baseTerm) { days = i; break; }
    }
    var n = Math.round(days / 3);
    if (n < 1) n = 1;
    if (n > 10) n = 10;
    return n;
  }

  // ── 본 계산 ───────────────────────────────────────────────────
  function compute(input) {
    input = input || {};
    var calendar = input.calendar === 'lunar' ? 'lunar' : 'solar';
    var rawY = parseInt(input.year, 10);
    var rawM = parseInt(input.month, 10);
    var rawD = parseInt(input.day, 10);
    if (!rawY || !rawM || !rawD) return { error: 'birth_missing' };

    var solar = { y: rawY, m: rawM, d: rawD };
    var converted = false;
    if (calendar === 'lunar') {
      var s = lunarToSolar(rawY, rawM, rawD, !!input.leap);
      if (!s) return { error: 'lunar_out_of_range' };
      solar = s;
      converted = true;
    }

    var year = solar.y, month = solar.m, day = solar.d;
    var hourVal = (input.hour === undefined || input.hour === null || input.hour === '' || input.hour === 'unknown') ? 'unknown' : String(input.hour);
    var isHourKnown = hourVal !== 'unknown';
    var hrInt = isHourKnown ? parseInt(hourVal, 10) : 12;
    var gender = input.gender === 'male' ? 'male' : 'female';

    var sl = getSolarLongitude(year, month, day, hrInt, 0);

    // 년주
    var sYear = (month <= 2 && sl < 315) ? year - 1 : year;
    var yearIdx = ((sYear - 4) % 60 + 60) % 60;
    var yGan = GAN[yearIdx % 10];
    var yJi = JI[yearIdx % 12];

    // 월주
    var shifted = (sl - 315 + 360) % 360;
    var mOffset = Math.floor(shifted / 30);
    var monthBranches = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
    var mJi = monthBranches[mOffset];
    var yStemIdx = yearIdx % 10;
    var startMStem = ((yStemIdx % 5) * 2 + 2) % 10;
    var mGan = GAN[(startMStem + mOffset) % 10];

    // 일주
    var jdn = getJulianDay(year, month, day);
    var dayIdx = ((jdn + 49) % 60 + 60) % 60;
    var dGan = GAN[dayIdx % 10];
    var dJi = JI[dayIdx % 12];

    // 시주
    var hGan = null, hJi = null;
    if (isHourKnown) {
      var hBranchIdx = Math.floor(((parseInt(hourVal, 10) + 1) % 24) / 2);
      hJi = JI[hBranchIdx % 12];
      var dStemIdx = dayIdx % 10;
      var startHStem = (dStemIdx % 5) * 2;
      hGan = GAN[(startHStem + (hBranchIdx % 12)) % 10];
    }

    var pillars = [
      { pos: '년', key: 'year', gan: yGan, ji: yJi },
      { pos: '월', key: 'month', gan: mGan, ji: mJi },
      { pos: '일', key: 'day', gan: dGan, ji: dJi },
      { pos: '시', key: 'hour', gan: hGan, ji: hJi }
    ];

    // 오행 개수
    var chars = [yGan, yJi, mGan, mJi, dGan, dJi];
    if (hGan) chars.push(hGan, hJi);
    var counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    chars.forEach(function (c) {
      var e = ELEM_OF_GAN[c] || ELEM_OF_JI[c];
      if (e && counts[e] !== undefined) counts[e]++;
    });
    var totalChars = chars.length;
    var percents = {};
    ELEM_ORDER.forEach(function (e) { percents[e] = Math.round(counts[e] / totalChars * 100); });

    // 강약 (득령·득지·득세 가중치)
    var myElem = ELEM_OF_GAN[dGan];
    var motherElem = MOTHER_OF[myElem];
    var drainElem = DRAIN_OF[myElem];
    var wealthElem = WEALTH_OF[myElem];
    var officerElem = OFFICER_OF[myElem];

    var weights = {
      mJi: 35, dJi: 15, hJi: isHourKnown ? 15 : 0, yJi: 10,
      mGan: 10, hGan: isHourKnown ? 10 : 0, yGan: 10
    };
    var totalWeight = weights.mJi + weights.dJi + weights.hJi + weights.yJi + weights.mGan + weights.hGan + weights.yGan;
    var supportScore = 0;
    [
      { char: mJi, elem: ELEM_OF_JI[mJi], w: weights.mJi, isJi: true },
      { char: dJi, elem: ELEM_OF_JI[dJi], w: weights.dJi, isJi: true },
      { char: hJi, elem: isHourKnown ? ELEM_OF_JI[hJi] : null, w: weights.hJi, isJi: true },
      { char: yJi, elem: ELEM_OF_JI[yJi], w: weights.yJi, isJi: true },
      { char: mGan, elem: ELEM_OF_GAN[mGan], w: weights.mGan },
      { char: hGan, elem: hGan ? ELEM_OF_GAN[hGan] : null, w: weights.hGan },
      { char: yGan, elem: ELEM_OF_GAN[yGan], w: weights.yGan }
    ].forEach(function (p) {
      if (!p.w || !p.elem) return;
      if (p.elem === myElem) supportScore += p.w;
      else if (p.elem === motherElem) {
        if (myElem === 'metal' && (p.char === '戌' || p.char === '未')) supportScore += p.w * 0.4;
        else supportScore += p.w * 0.85;
      }
    });
    var supportPct = Math.round(supportScore / totalWeight * 100);
    var strengthLabel = supportPct >= 55 ? '신강(身强)' : (supportPct >= 45 ? '중화(中和)' : '신약(身弱)');

    // 십성 (일간 기준)
    var sipsin = {
      year: { gan: getShipshin(dGan, yGan), ji: getShipshin(dGan, MAIN_STEM_OF_JI[yJi]) },
      month: { gan: getShipshin(dGan, mGan), ji: getShipshin(dGan, MAIN_STEM_OF_JI[mJi]) },
      day: { gan: '일간', ji: getShipshin(dGan, MAIN_STEM_OF_JI[dJi]) },
      hour: hGan ? { gan: getShipshin(dGan, hGan), ji: getShipshin(dGan, MAIN_STEM_OF_JI[hJi]) } : { gan: '-', ji: '-' }
    };
    var sipsinCounts = { '비겁': 0, '식상': 0, '재성': 0, '관성': 0, '인성': 0 };
    ['year', 'month', 'day', 'hour'].forEach(function (k) {
      ['gan', 'ji'].forEach(function (t) {
        var v = sipsin[k][t];
        if (SIPSIN_GROUP[v]) sipsinCounts[SIPSIN_GROUP[v]]++;
      });
    });

    // 지장간 · 12운성 · 신살 · 납음
    var wTable = WOONSUNG[dGan];
    pillars.forEach(function (p) {
      p.sipsin = sipsin[p.key];
      p.jigangan = p.ji ? JIGANGAN[p.ji].map(function (c) {
        return { char: c, sipsin: getShipshin(dGan, c), elem: ELEM_OF_GAN[c] };
      }) : [];
      p.woonsung = p.ji ? wTable[JI.indexOf(p.ji)] : '-';
      p.nabeum = (p.gan && p.ji) ? (NABEUM[p.gan + p.ji] || '-') : '-';
      p.sinsal = [];
      if (p.ji) {
        var s1 = getSinsal(yJi, p.ji);
        var s2 = getSinsal(dJi, p.ji);
        p.sinsal.push(s1);
        if (s2 !== s1) p.sinsal.push(s2);
        if (CHEONEUL[dGan] && CHEONEUL[dGan].indexOf(p.ji) >= 0) p.sinsal.push('천을귀인');
        var cDeok = CHEONDEOK[mJi];
        if (cDeok && (p.gan === cDeok || p.ji === cDeok)) p.sinsal.push('천덕귀인');
        var wDeok = WOLDEOK[mJi];
        if (wDeok && p.gan === wDeok) p.sinsal.push('월덕귀인');
        if (MUNCHANG[dGan] === p.ji) p.sinsal.push('문창귀인');
        if (HYEONCHIM.indexOf(p.gan) >= 0 || HYEONCHIM.indexOf(p.ji) >= 0) p.sinsal.push('현침살');
      }
    });

    // 지지 관계
    var jiList = [{ pos: '년', ji: yJi }, { pos: '월', ji: mJi }, { pos: '일', ji: dJi }];
    if (hJi) jiList.push({ pos: '시', ji: hJi });
    var relations = [];
    for (var i = 0; i < jiList.length; i++) {
      for (var j = i + 1; j < jiList.length; j++) {
        var rel = relationOf(jiList[i].ji, jiList[j].ji);
        if (rel.length) relations.push(jiList[i].pos + jiList[i].ji + '·' + jiList[j].pos + jiList[j].ji + ' ' + rel.join('·'));
      }
    }

    // 일간·월간 천간합
    var ganHap = '';
    var ganPairs = [['년', yGan], ['월', mGan], ['일', dGan]];
    for (var a = 0; a < ganPairs.length; a++) {
      for (var b = a + 1; b < ganPairs.length; b++) {
        var gk = ganPairs[a][1] + ganPairs[b][1];
        var gk2 = ganPairs[b][1] + ganPairs[a][1];
        if (GAN_HAP[gk] || GAN_HAP[gk2]) {
          ganHap = ganPairs[a][0] + '간 ' + ganPairs[a][1] + '·' + ganPairs[b][0] + '간 ' + ganPairs[b][1] + ' → ' + (GAN_HAP[gk] || GAN_HAP[gk2]) + ' 합';
        }
      }
    }

    // 12운성 대표
    var woonsungDay = wTable[JI.indexOf(dJi)];

    // 대운
    var isYangGan = (GAN.indexOf(yGan) % 2 === 0);
    var isForward = (gender === 'male' && isYangGan) || (gender === 'female' && !isYangGan);
    var daeunNum = calculateDaeunNumber(year, month, day, isForward);
    var daeun = [];
    var curMStem = GAN.indexOf(mGan);
    var curMBranch = JI.indexOf(mJi);
    var nowYear = new Date().getFullYear();
    var koreanAge = nowYear - year + 1;
    for (var k = 0; k < 10; k++) {
      if (isForward) { curMStem = (curMStem + 1) % 10; curMBranch = (curMBranch + 1) % 12; }
      else { curMStem = (curMStem - 1 + 10) % 10; curMBranch = (curMBranch - 1 + 12) % 12; }
      var dg = GAN[curMStem], dj = JI[curMBranch];
      var startAge = daeunNum + k * 10;
      daeun.push({
        order: k + 1,
        startAge: startAge,
        endAge: startAge + 9,
        startYear: year + startAge - 1,
        endYear: year + startAge + 8,
        gan: dg, ji: dj,
        ganElem: ELEM_OF_GAN[dg],
        jiElem: ELEM_OF_JI[dj],
        ganSipsin: getShipshin(dGan, dg),
        jiSipsin: getShipshin(dGan, MAIN_STEM_OF_JI[dj]),
        woonsung: wTable[JI.indexOf(dj)],
        sinsal: getSinsal(yJi, dj),
        current: (koreanAge >= startAge && koreanAge < startAge + 10)
      });
    }
    if (!daeun.some(function (d) { return d.current; })) {
      // 아직 대운 시작 전이면 첫 대운을 예정으로 표시
      if (koreanAge < daeun[0].startAge) daeun[0].upcoming = true;
    }

    // 세운 (2025~2031)
    var seun = [];
    for (var yy = 2025; yy <= 2031; yy++) {
      var yi = ((yy - 4) % 60 + 60) % 60;
      var sg = GAN[yi % 10], sj = JI[yi % 12];
      seun.push({
        year: yy,
        gan: sg, ji: sj,
        ganSipsin: getShipshin(dGan, sg),
        jiSipsin: getShipshin(dGan, MAIN_STEM_OF_JI[sj]),
        relDay: relationOf(dJi, sj),
        relYear: relationOf(yJi, sj),
        age: yy - year + 1
      });
    }

    // 2027 월운 (절기 기준 월지, 1월은 2026년 계열)
    var monthly2027 = [];
    for (var mo = 1; mo <= 12; mo++) {
      var sajuYear = (mo === 1) ? 2026 : 2027;
      var mOff = (mo === 1) ? 11 : (mo - 2);
      var yIdx = ((sajuYear - 4) % 60 + 60) % 60;
      var yStem = yIdx % 10;
      var startStem = ((yStem % 5) * 2 + 2) % 10;
      var wg = GAN[(startStem + mOff) % 10];
      var wj = monthBranches[mOff];
      monthly2027.push({
        month: mo,
        gan: wg, ji: wj,
        ganSipsin: getShipshin(dGan, wg),
        jiSipsin: getShipshin(dGan, MAIN_STEM_OF_JI[wj]),
        relDay: relationOf(dJi, wj),
        yElem: ELEM_OF_GAN[wg]
      });
    }

    // 8대 운 점수 (index.html 결과 화면과 동일한 산식)
    var cntSelf = counts[myElem] || 0;
    var cntOutput = counts[drainElem] || 0;
    var cntWealth = counts[wealthElem] || 0;
    var cntPower = counts[officerElem] || 0;
    var cntResource = counts[motherElem] || 0;

    var sMoney = 50;
    if (cntWealth === 1 || cntWealth === 2) {
      sMoney += 18;
      if (supportPct >= 40) sMoney += 12;
      if (cntOutput >= 1) sMoney += 8;
    } else if (cntWealth >= 3) {
      sMoney += (supportPct >= 45 ? 12 : -6);
      if (cntSelf >= 3) sMoney -= 8;
    } else {
      sMoney += (cntOutput >= 2 ? 6 : -10);
    }
    sMoney = Math.max(35, Math.min(94, Math.round(sMoney + ((year * 3 + month * 7 + day) % 9) - 4)));

    var sJob = 50;
    if (cntPower >= 1 && cntResource >= 1) sJob += 24;
    else if (cntPower >= 1) sJob += (supportPct >= 40 ? 14 : -4);
    else if (cntResource >= 2) sJob += 10;
    else sJob -= 8;
    if (cntOutput >= 3 && cntPower >= 1) sJob -= 12;
    sJob = Math.max(36, Math.min(93, Math.round(sJob + ((month * 5 + day * 3) % 9) - 4)));

    var sBiz = 48;
    if (cntOutput >= 1) sBiz += cntOutput * 8;
    if (cntWealth >= 1) sBiz += cntWealth * 7;
    if (supportPct >= 40) sBiz += 8;
    if (cntPower >= 2 && cntOutput === 0) sBiz -= 14;
    sBiz = Math.max(34, Math.min(95, Math.round(sBiz + ((day * 7 + year) % 9) - 4)));

    var dohwaChars = ['子', '午', '卯', '酉'];
    var dohwaCount = jiList.filter(function (b) { return dohwaChars.indexOf(b.ji) >= 0; }).length;
    var sLove = 42 + dohwaCount * 14;
    if (cntOutput >= 1) sLove += 8;
    if (cntWealth >= 2) sLove += 6;
    sLove = Math.max(38, Math.min(96, Math.round(sLove + ((month * 2 + day) % 7) - 3)));

    var clashWithDay = relationOf(dJi, JI[(JI.indexOf(dJi) + 6) % 12]).indexOf('충(沖)') >= 0;
    var sMarriage = 58;
    if (clashWithDay) sMarriage -= 18; else sMarriage += 12;
    if (cntSelf >= 3) sMarriage -= 8;
    sMarriage = Math.max(32, Math.min(91, Math.round(sMarriage + ((year + day * 4) % 9) - 4)));

    var zeroCount = ELEM_ORDER.filter(function (e) { return counts[e] === 0; }).length;
    var overCount = ELEM_ORDER.filter(function (e) { return counts[e] >= 3; }).length;
    var sHealth = 65 - zeroCount * 9 - overCount * 8;
    if (supportPct >= 35 && supportPct <= 65) sHealth += 10;
    sHealth = Math.max(35, Math.min(92, Math.round(sHealth + ((month * 4 + day) % 7) - 3)));

    var s2027 = 55;
    if (dGan === '壬') s2027 += 16;
    else if (dGan === '癸') s2027 -= 16;
    else if (dGan === '庚' || dGan === '辛') s2027 += 10;
    if (jiList.some(function (b) { return b.ji === '丑'; })) s2027 -= 14;
    if (jiList.some(function (b) { return b.ji === '午'; })) s2027 += 12;
    if (counts.fire >= 3 || counts.earth >= 3) s2027 -= 12;
    else if (counts.water >= 3 || counts.metal >= 3) s2027 += 15;
    s2027 = Math.max(30, Math.min(92, Math.round(s2027 + ((day * 2) % 7) - 3)));

    var scores = {
      money: sMoney, job: sJob, biz: sBiz, love: sLove,
      marriage: sMarriage, health: sHealth, y2027: s2027
    };

    // 오행 과다·결핍
    var zeroElems = ELEM_ORDER.filter(function (e) { return counts[e] === 0; });
    var overElems = ELEM_ORDER.filter(function (e) { return counts[e] >= 3; });
    var missingElems = ELEM_ORDER.filter(function (e) { return counts[e] <= 1; });

    // 조후 (월지 계절)
    var season = ({ '寅': '봄', '卯': '봄', '辰': '봄', '巳': '여름', '午': '여름', '未': '여름', '申': '가을', '酉': '가을', '戌': '가을', '亥': '겨울', '子': '겨울', '丑': '겨울' })[mJi];
    var isCold = ['亥', '子', '丑'].indexOf(mJi) >= 0;
    var isHot = ['巳', '午', '未'].indexOf(mJi) >= 0;

    return {
      ok: true,
      input: {
        name: (input.name || '').trim(),
        gender: gender,
        calendar: calendar,
        leap: !!input.leap,
        raw: { y: rawY, m: rawM, d: rawD },
        solar: solar,
        converted: converted,
        hour: isHourKnown ? hrInt : 'unknown',
        isHourKnown: isHourKnown
      },
      years: { now: nowYear, koreanAge: koreanAge, sYear: sYear },
      pillars: pillars,
      ilgan: dGan,
      ilji: dJi,
      ilju: dGan + dJi,
      ilganHangul: HANGUL_GAN[dGan] + HANGUL_JI[dJi],
      hanglePillars: {
        year: HANGUL_GAN[yGan] + HANGUL_JI[yJi],
        month: HANGUL_GAN[mGan] + HANGUL_JI[mJi],
        day: HANGUL_GAN[dGan] + HANGUL_JI[dJi],
        hour: hGan ? HANGUL_GAN[hGan] + HANGUL_JI[hJi] : '시주 미상'
      },
      counts: counts,
      percents: percents,
      totalChars: totalChars,
      strength: { supportPct: supportPct, label: strengthLabel },
      elements: {
        myElem: myElem, motherElem: motherElem, drainElem: drainElem,
        wealthElem: wealthElem, officerElem: officerElem,
        zero: zeroElems, over: overElems, missing: missingElems
      },
      sipsin: sipsin,
      sipsinCounts: sipsinCounts,
      woonsungDay: woonsungDay,
      relations: relations,
      ganHap: ganHap,
      gongmang: getGongmang(dGan, dJi),
      guiin: CHEONEUL[dGan] ? CHEONEUL[dGan].join(', ') : '-',
      season: season,
      isCold: isCold,
      isHot: isHot,
      daeun: { forward: isForward, number: daeunNum, list: daeun },
      seun: seun,
      monthly2027: monthly2027,
      scores: scores,
      meta: { engine: 'nachimbansaju-saju-engine', version: '1.0.0' }
    };
  }

  global.SajuEngine = {
    compute: compute,
    lunarToSolar: lunarToSolar,
    lunarMonthLength: lunarMonthLength,
    getSolarLongitude: getSolarLongitude,
    getJulianDay: getJulianDay,
    getShipshin: getShipshin,
    GAN: GAN, JI: JI,
    ELEM_OF_GAN: ELEM_OF_GAN, ELEM_OF_JI: ELEM_OF_JI,
    ELEM_KR: ELEM_KR, ELEM_ICON: ELEM_ICON, ELEM_ORDER: ELEM_ORDER,
    JIGANGAN: JIGANGAN,
    LUNAR_RANGE: [LUNAR_START_YEAR, LUNAR_START_YEAR + LUNAR_TABLE.length - 1]
  };
})(typeof window !== 'undefined' ? window : this);
