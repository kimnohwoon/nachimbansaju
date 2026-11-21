/*!
 * 운명나침반 맞춤 사주 책 생성기 (saju-book.js)
 * SajuEngine.compute() 결과 + 주문 정보 → A4 인쇄용 책 DOM(.pdf-page)
 */
(function (global) {
  'use strict';

  var ELEM_KR = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
  var ELEM_NAME = { wood: '나무', fire: '불', earth: '흙', metal: '쇠', water: '물' };
  var ELEM_CLASS = { wood: 'c-wood', fire: 'c-fire', earth: 'c-earth', metal: 'c-metal', water: 'c-water' };

  var ILGAN = {
    '甲': {
      title: '아름드리나무 (甲木)',
      essence: '갑목은 겨울을 이겨내고 곧게 하늘로 뻗는 큰 나무입니다. 한번 세운 뜻은 쉽게 굽히지 않고, 남이 알아주지 않아도 묵묵히 자기 자리를 지켜내는 뿌리의 힘이 있습니다.',
      strength: '리더십과 책임감이 강하고, 시작한 일은 끝까지 끌고 가는 추진력이 있습니다. 위기 앞에서 오히려 중심을 잡는 사람입니다.',
      shadow: '혼자 짊어지려는 습관 때문에 속이 먼저 상합니다. 도움을 청하는 일을 패배로 여기지 않으셔도 됩니다.',
      advice: '나무는 옆으로 가지를 뻗어야 더 크게 자랍니다. 내 일을 나눠 맡기는 연습이 운을 키웁니다.'
    },
    '乙': {
      title: '들풀과 덩굴 (乙木)',
      essence: '을목은 바위틈에서도 방향을 찾아 뻗어 나가는 유연한 생명력입니다. 부드러워 보이지만 어떤 환경에서도 살아남는 끈질김이 이 사주의 바탕입니다.',
      strength: '눈치와 적응력이 빠르고, 사람들 사이에서 관계를 부드럽게 잇는 재주가 있습니다. 현실적인 감각으로 실속을 챙깁니다.',
      shadow: '부탁을 거절하지 못해 남의 일을 떠안기 쉽고, 그만큼 속앓이가 쌓입니다.',
      advice: '휘어지는 것과 휩쓸리는 것은 다릅니다. 내 기준을 한 줄 적어두고 그것만은 지켜보세요.'
    },
    '丙': {
      title: '한낮의 태양 (丙火)',
      essence: '병화는 세상을 환하게 비추는 태양입니다. 숨기는 것 없이 밝고 시원시원하며, 사람들 앞에 서면 분위기를 밝히는 힘이 있습니다.',
      strength: '표현력과 열정이 좋고, 어려운 상황에서도 사람들을 끌고 가는 추진력이 있습니다. 한번 결심하면 빠르게 움직입니다.',
      shadow: '속이 타들어가도 겉으로는 웃으며 넘기기 때문에, 정작 자기 열을 식힐 시간을 놓칩니다. 감정 기복이 클 수 있습니다.',
      advice: '해는 스스로를 태우지 않아도 뜹니다. 하루 한 번은 아무에게도 쓰이지 않는 시간을 남겨두세요.'
    },
    '丁': {
      title: '등잔불 (丁火)',
      essence: '정화는 어둠 속을 밝히는 등불입니다. 크게 타오르지는 않지만 가까이 있는 사람의 얼굴과 마음까지 비추는 섬세한 빛입니다.',
      strength: '직관과 공감 능력이 뛰어나고, 사람의 마음을 읽는 데 탁월합니다. 한 사람을 오래 아끼는 깊이가 있습니다.',
      shadow: '남의 감정을 먼저 살피다 정작 자기 심지가 다 타들어갑니다. 혼자 삭이는 시간이 길어지면 화병으로 남습니다.',
      advice: '등불은 기름이 있어야 탑니다. 나를 채우는 일을 사치라고 생각하지 마세요.'
    },
    '戊': {
      title: '태산 (戊土)',
      essence: '무토는 흔들리지 않는 산입니다. 크고 묵직하며, 사람과 일을 품어내는 그릇이 넓습니다. 급하게 움직이기보다 때를 기다릴 줄 압니다.',
      strength: '신용과 안정감이 있어 사람들이 기대고, 한 번 맺은 인연을 오래 갑니다. 위기에서 버티는 힘이 특히 강합니다.',
      shadow: '무거운 짐을 먼저 떠안고, 도움을 청하는 데 인색합니다. 변화의 시기를 놓치면 고집으로 남을 수 있습니다.',
      advice: '산도 길을 내줘야 사람이 오릅니다. 내 기준을 조금만 낮추면 들어오는 사람과 돈의 길이 넓어집니다.'
    },
    '己': {
      title: '논밭 (己土)',
      essence: '기토는 만물을 길러내는 기름진 땅입니다. 티 없이 낮은 자리에서 사람과 일을 실하게 키워내는 힘이 있습니다.',
      strength: '꼼꼼하고 현실적이며, 맡은 일을 조용히 끝내는 성실함이 있습니다. 사람을 편안하게 만드는 온도가 있습니다.',
      shadow: '남의 실속을 챙기다 내 몫을 뒤로 미룹니다. 그렇게 비워둔 자리가 쌓이면 서운함으로 남습니다.',
      advice: '땅도 쉬어야 다음 해에 열매가 많습니다. 받는 연습, 청구하는 연습이 필요합니다.'
    },
    '庚': {
      title: '원석과 칼 (庚金)',
      essence: '경금은 단단한 원석을 깎아 만든 칼입니다. 옳고 그름이 분명하고, 결단이 빠르며, 말과 행동에 군더더기가 없습니다.',
      strength: '추진력과 결단력이 강해 어려운 일을 정면으로 돌파합니다. 위선을 싫어해 신뢰를 얻는 편입니다.',
      shadow: '직선적인 표현이 사람을 베는 경우가 있습니다. 정작 자기 속살이 먼저 상하는 것도 이 칼날 때문입니다.',
      advice: '좋은 칼은 칼집이 있습니다. 말을 반 박자 늦추는 것만으로 관계의 결이 달라집니다.'
    },
    '辛': {
      title: '보석과 바늘 (辛金)',
      essence: '신금은 정교하게 다듬어진 보석입니다. 예리한 감각과 높은 기준을 지녔고, 디테일을 놓치지 않는 사람입니다.',
      strength: '심미안과 완성도가 높아, 남들이 그냥 넘기는 부분에서 품질을 끌어올립니다. 섬세한 판단이 강점입니다.',
      shadow: '기준이 높아 나와 남을 함께 긁습니다. 서운함을 표현하지 않고 쌓아두다 관계가 끊깁니다.',
      advice: '보석은 빛을 받아야 빛납니다. 나를 알아봐 주는 사람 곁에 오래 머무는 것이 개운법입니다.'
    },
    '壬': {
      title: '바다 (壬水)',
      essence: '임수는 깊고 넓은 바다입니다. 속을 쉽게 보이지 않고, 많은 것을 품으면서도 겉으로는 태연합니다. 흐름을 읽는 눈이 있습니다.',
      strength: '사고가 넓고 임기응변이 좋습니다. 큰 판을 보는 안목과 사람을 담아내는 그릇이 있습니다.',
      shadow: '혼자 삼키는 습관이 강해, 겉은 잔잔한데 속은 늘 파도가 칩니다. 번아웃이 오면 갑자기 깊이 가라앉습니다.',
      advice: '바다는 강물을 받아야 짠물이 되지 않습니다. 도움과 정보를 받아들이는 통로를 열어두세요.'
    },
    '癸': {
      title: '단비와 이슬 (癸水)',
      essence: '계수는 메마른 땅을 적시는 단비입니다. 조용히 스며들어 사람과 일을 살리는 힘이 있고, 눈치와 배려가 깊습니다.',
      strength: '감수성이 풍부하고 통찰이 빠릅니다. 상대의 필요를 먼저 알아채는 재주가 있습니다.',
      shadow: '남의 감정을 다 받아주느라 스스로가 축축해집니다. 생각이 많아 시작을 미루는 경향이 있습니다.',
      advice: '비도 그쳐야 땅이 마릅니다. 하루의 감정을 어딘가에 흘려보내는 의식이 꼭 필요합니다.'
    }
  };

  var OVER_TEXT = {
    wood: '나무 기운이 과하면 자존심과 명분이 앞섭니다. 옳은 일이라도 방식이 강경해지면 사람이 떠나고, 그 상처가 다시 나에게 돌아옵니다. 새 일을 벌이는 속도보다 매듭짓는 힘을 기르는 것이 관건입니다.',
    fire: '불 기운이 과하면 열정이 앞서 조급해집니다. 벌여놓은 일이 몸보다 많아져 잠과 마음이 함께 타들어갑니다. 성과를 내는 힘은 크지만, 쉬는 것을 게을리하면 그 열이 병으로 바뀝니다.',
    earth: '흙 기운이 과하면 책임과 걱정이 무겁게 쌓입니다. 남의 일까지 떠안고, 결정을 미루며 제자리에서 체력만 소모되기 쉽습니다. 내려놓는 연습이 곧 재물과 관계의 통로를 여는 일입니다.',
    metal: '쇠 기운이 과하면 원칙과 기준이 날카로워집니다. 옳고 그름을 따지다 관계가 끊기고, 완벽을 기다리다 때를 놓칩니다. 조금 흐릿하게 넘어가는 여유가 운을 부드럽게 만듭니다.',
    water: '물 기운이 과하면 생각이 깊어지는 만큼 행동이 늦어집니다. 감정이 가라앉는 시간이 길고, 시작보다 망설임이 많아집니다. 몸을 먼저 움직이면 마음의 물길도 함께 트입니다.'
  };

  var ZERO_TEXT = {
    wood: '나무(목) 기운이 비어 있어, 계획을 세우고 밀고 나가는 뼈대가 약합니다. 시작은 하는데 키워내는 힘이 부족해 결실이 새어나가기 쉽습니다. 배움·기록·새로운 시도를 의식적으로 늘리면 이 구멍이 메워집니다.',
    fire: '불(화) 기운이 비어 있어, 표현과 열정이 안으로만 맴돕니다. 속으로는 뜨거운데 겉으로 드러나지 않아 사람들이 내 진심을 모릅니다. 말과 표정으로 드러내는 연습이 관계와 재물의 문을 엽니다.',
    earth: '흙(토) 기운이 비어 있어, 기반과 안정이 약합니다. 일이 벌어지면 중심을 잡아줄 토대가 없어 흔들리고, 돈이 들어와도 남는 자리가 없습니다. 규칙적인 생활과 저축 습관이 곧 개운법입니다.',
    metal: '쇠(금) 기운이 비어 있어, 결단과 마무리가 약합니다. 벌여놓은 일을 정리하지 못해 몸이 여러 곳에 걸쳐 있고, 관계에서 선을 긋지 못해 소모됩니다. 정리·청소·기한 정하기가 약을 이깁니다.',
    water: '물(수) 기운이 비어 있어, 쉼과 유연함이 부족합니다. 쉽게 지치고 감정의 배수구가 없어 화가 쌓입니다. 잠·물·여행·음악처럼 흘려보내는 시간이 반드시 필요합니다.'
  };

  var BOOST = {
    wood: { color: '청색·초록', dir: '동쪽', num: '3, 8', food: '나물·채소·신맛', act: '산책·등산·스트레칭', job: '교육·기획·출판·원예', habit: '아침에 창문 열고 10분 햇빛·바람 쐬기, 계획 노트 쓰기' },
    fire: { color: '붉은색·주황', dir: '남쪽', num: '2, 7', food: '따뜻한 차·매콤한 양념', act: '유산소·춤·노래', job: '방송·마케팅·요식·에너지', habit: '햇빛 아래 20분 걷기, 감사한 일 세 가지 말로 꺼내기' },
    earth: { color: '노란색·베이지', dir: '중앙·남서', num: '5, 10', food: '곡물·단호박·고구마', act: '근력운동·흙길 걷기', job: '부동산·유통·농업·중개', habit: '정해진 시간에 밥 먹기, 한 달 저축액 먼저 떼어두기' },
    metal: { color: '흰색·은색', dir: '서쪽', num: '4, 9', food: '무·배·매운맛', act: '정리정돈·호흡운동', job: '금융·법·기술·제조', habit: '주 1회 책상·서랍 비우기, 결정해야 할 일은 24시간 안에 결론' },
    water: { color: '검정·남색', dir: '북쪽', num: '1, 6', food: '해조류·수분·짠맛(과하지 않게)', act: '수영·반신욕·명상', job: '무역·상담·IT·연구', habit: '잠 7시간 지키기, 하루 1.5L 물 마시기' }
  };

  var SIPSIN = {
    '비견': { g: '비겁', line: '나와 같은 기운. 자존심·동료·경쟁을 뜻하며, 내 힘으로 서려는 마음입니다.' },
    '겁재': { g: '비겁', line: '나와 같은 기운이되 더 거친 힘. 추진력과 승부욕, 그리고 지출의 통로이기도 합니다.' },
    '식신': { g: '식상', line: '내가 낳은 기운. 먹고사는 재주, 표현, 편안한 생산성을 뜻합니다.' },
    '상관': { g: '식상', line: '내가 낳았으나 기존 질서를 흔드는 기운. 재능과 말솜씨, 때로는 조직과의 마찰입니다.' },
    '편재': { g: '재성', line: '내가 다스리는 바깥 재물. 사업·투자·인맥에서 오는 큰돈의 흐름입니다.' },
    '정재': { g: '재성', line: '내가 다스리는 안정된 재물. 월급·저축처럼 꾸준히 쌓이는 돈의 흐름입니다.' },
    '편관': { g: '관성', line: '나를 누르는 강한 힘. 책임·압박·위기이며, 극복하면 권한이 됩니다.' },
    '정관': { g: '관성', line: '나를 바르게 세우는 힘. 직장·명예·규율과 안정된 사회적 위치입니다.' },
    '편인': { g: '인성', line: '나를 살리는 뜻밖의 기운. 직관·비정형 학습·귀인과의 인연입니다.' },
    '정인': { g: '인성', line: '나를 감싸는 기운. 배움·보호·후원, 그리고 생각이 많은 성향입니다.' }
  };

  var GROUP_TEXT = {
    '비겁': {
      name: '비겁(比劫) — 나와 같은 기운',
      over: '내 힘으로 다 해결하려는 성향이 강합니다. 경쟁과 동업에서 힘을 쓰지만, 돈이 새는 통로도 이 자리에서 열립니다. 동업·보증·지인 거래는 문서로 남기세요.',
      under: '혼자 버티는 힘이 약해, 사람과 손잡아야 일이 굴러갑니다. 다만 의지할 사람을 고를 때 신중해야 합니다. 동료·친구와의 관계가 곧 자산입니다.'
    },
    '식상': {
      name: '식상(食傷) — 내가 낳는 기운',
      over: '재능과 표현이 넘칩니다. 말이 앞서 오해를 사거나, 벌여놓은 일이 많아 마무리가 흐려집니다. 하나를 골라 끝내는 연습이 재물로 이어집니다.',
      under: '하고 싶은 것을 꾹 눌러왔습니다. 표현의 통로가 막혀 있으면 속이 먼저 상합니다. 글·말·취미로 배출구를 만들어야 재물의 물꼬도 함께 트입니다.'
    },
    '재성': {
      name: '재성(財星) — 내가 다스리는 기운',
      over: '돈과 사람에 대한 욕심이 몸보다 앞섭니다. 벌이는 크지만 지키는 힘이 약해 손재수가 생깁니다. 재물은 나를 지탱할 힘(비겁·인성)과 함께 있어야 남습니다.',
      under: '돈을 다루는 감각이 늦게 트이거나, 애써도 결실이 얇습니다. 기술·자격·전문성처럼 몸에 남는 재산을 먼저 쌓으면 재물이 따라옵니다.'
    },
    '관성': {
      name: '관성(官星) — 나를 세우는 기운',
      over: '책임과 압박이 과해 스스로를 옥죕니다. 남의 기준에 맞추다 지치고, 건강이 먼저 신호를 보냅니다. 거절도 업무의 일부입니다.',
      under: '조직의 규율이나 사회적 틀에 묶이는 것을 답답해합니다. 자유롭게 일할수록 성과가 나지만, 마감과 규칙은 스스로에게 부여해야 무너지지 않습니다.'
    },
    '인성': {
      name: '인성(印星) — 나를 살리는 기운',
      over: '생각이 많아 결정이 늦고, 보호받으려는 마음이 커집니다. 배움에 머물지 말고 밖으로 꺼내 써야 합니다.',
      under: '도움을 청하는 데 서툴고, 쉬는 법을 모릅니다. 귀인을 만나도 알아보지 못할 수 있으니, 조언을 구하는 일을 일부러 연습하세요.'
    }
  };

  var DAEUN_TEXT = {
    '비견': '내 힘이 서는 10년입니다. 스스로 일을 벌이고 이름을 세우기 좋으나, 동업·보증·지인 거래에서 재물이 새기 쉽습니다. 문서와 경계가 이 시기의 재산입니다.',
    '겁재': '경쟁과 변동이 큰 10년입니다. 남과 부딪히며 성장하지만, 돈이 나가는 통로도 함께 열립니다. 큰 지출은 한 박자 늦추고, 몸을 아끼세요.',
    '식신': '내가 낳은 것이 세상에 나오는 10년입니다. 기술·콘텐츠·요식·교육 등 표현하는 일에서 결실이 큽니다. 편안한 마음으로 오래 하는 일이 답입니다.',
    '상관': '재능이 터지고 말이 힘을 갖는 10년입니다. 조직보다 자기 방식이 통하는 무대에서 크게 빛납니다. 다만 윗사람·규칙과의 마찰이 생기니 언행을 다스려야 합니다.',
    '편재': '바깥에서 돈이 오가는 10년입니다. 사업·영업·투자에서 기회가 많지만 들어온 만큼 나가기도 합니다. 지출 구조를 먼저 정리하면 남는 것이 커집니다.',
    '정재': '안정된 재물이 쌓이는 10년입니다. 월급·저축·부동산처럼 꾸준한 것이 힘을 발휘합니다. 성실함이 곧 재산이 되는 시기입니다.',
    '편관': '압박과 책임이 커지는 10년입니다. 버티면 권한과 자리가 따르지만, 몸이 먼저 지칠 수 있습니다. 잠과 검진을 일정에 먼저 넣으세요.',
    '정관': '직장·명예·자리가 안정되는 10년입니다. 조직에서 인정받고 신뢰를 쌓기에 좋습니다. 다만 규율에 갇히지 않도록 자기 시간을 확보해야 합니다.',
    '편인': '뜻밖의 배움과 귀인이 오는 10년입니다. 공부·자격·전문 분야에 투자하면 크게 남습니다. 생각이 많아 실행이 늦어지는 것만 경계하세요.',
    '정인': '보호와 후원이 따르는 10년입니다. 배움과 연구, 가족과의 인연이 힘이 됩니다. 편안함에 머물지 말고 배운 것을 밖으로 꺼내야 결실이 됩니다.'
  };

  var SINSAL_TEXT = {
    '지살': '지살(地殺)은 이동과 자리 변동을 뜻합니다. 이사·이직처럼 판을 옮길 때 힘이 실립니다.',
    '년살': '년살(年殺)은 도화의 기운입니다. 인기가 따르지만 감정 소모도 함께 옵니다.',
    '월살': '월살(月殺)은 고독과 내면의 시간을 뜻합니다. 혼자만의 몫이 생기지만 그 안에서 깊어집니다.',
    '망신살': '망신살은 말과 행동이 드러나기 쉬운 자리입니다. 언행을 다스리면 오히려 이름이 오릅니다.',
    '장성살': '장성살은 장수의 기운입니다. 책임을 맡고 사람을 이끄는 자리에서 힘을 발휘합니다.',
    '반안살': '반안살은 안정과 귀함의 자리입니다. 몸을 편히 두고 실속을 챙기는 흐름입니다.',
    '역마살': '역마살은 이동과 바깥 활동의 기운입니다. 한자리에 묶이기보다 움직일 때 기회가 열립니다.',
    '육해살': '육해살은 관계의 마찰을 뜻합니다. 가까운 사이일수록 말을 아끼는 것이 좋습니다.',
    '화개살': '화개살은 예술·종교·학문의 기운입니다. 혼자 몰입하는 일에서 재능이 드러납니다.',
    '겁살': '겁살은 뜻밖의 변수를 뜻합니다. 큰 결정 앞에서 한 번 더 확인하는 습관이 필요합니다.',
    '재살': '재살은 재물과 관계의 급체를 뜻합니다. 급한 투자와 보증은 피하는 것이 좋습니다.',
    '천살': '천살은 하늘의 시험을 뜻합니다. 버티는 힘이 곧 복으로 바뀌는 자리입니다.',
    '천을귀인': '천을귀인은 가장 힘이 큰 길신입니다. 어려울 때 사람이 나타나 길을 열어줍니다.',
    '천덕귀인': '천덕귀인은 덕으로 위기를 넘기는 힘입니다. 베푼 것이 돌아오는 자리입니다.',
    '월덕귀인': '월덕귀인은 사람을 살리는 인덕입니다. 주변의 도움과 신뢰가 재산이 됩니다.',
    '문창귀인': '문창귀인은 글과 말의 재능입니다. 배움과 기록이 곧 재물이 됩니다.',
    '현침살': '현침살은 예리한 감각을 뜻합니다. 의료·기술·정밀한 일에서 재능이 살아납니다.'
  };

  var PILLAR_MEANING = [
    ['년주', '조상·뿌리와 초년(0~15세)', '집안에서 물려받은 기질과 어린 시절의 환경'],
    ['월주', '부모·사회와 청년(16~30세)', '직장과 사회에서 쓰는 나의 방식, 부모와의 인연'],
    ['일주', '나 자신과 배우자', '내 중심과 배우자 자리, 결혼 생활의 결'],
    ['시주', '자녀·후배와 말년(50세 이후)', '자식 인연과 말년의 환경, 남는 것']
  ];

  var GLOSSARY = [
    ['지장간', '지지 속에 숨은 천간. 겉으로 드러나지 않은 속마음과 잠재력을 보여줍니다.'],
    ['십성', '일간과 다른 글자의 관계를 열 가지로 나눈 것. 재물·직업·관계의 결을 읽는 틀입니다.'],
    ['12운성', '일간이 각 지지에서 갖는 기운의 세기. 왕·상·휴·수·사의 흐름으로 봅니다.'],
    ['신살', '특정 글자가 만나 생기는 기운. 길신은 도움, 흉살은 주의할 자리입니다.'],
    ['귀인', '어려울 때 사람과 기회를 연결해주는 길한 자리. 천을귀인이 대표적입니다.'],
    ['공망', '짝이 비어 있는 글자. 그 기운이 들어오는 시기에는 결실이 늦어질 수 있습니다.'],
    ['납음', '간지에 붙은 다섯 기운의 이름. 사주의 결을 보조적으로 읽는 데 씁니다.'],
    ['대운', '10년 단위의 큰 계절. 인생의 판이 바뀌는 가장 큰 흐름입니다.'],
    ['세운', '해마다 바뀌는 1년의 기운. 그해 무엇을 시작하고 미룰지 정하는 기준입니다.'],
    ['월운', '달마다 돌아오는 기운. 절기(節氣)를 기준으로 나눕니다.']
  ];

  var SCORE_DEF = [
    { key: 'money', name: '재물·돈 모으기', good: '일한 만큼 통장에 남는 구조입니다. 저축과 관리에 힘을 주면 결실이 큽니다.', bad: '돈이 새는 구멍이 있습니다. 지출 구조를 먼저 손보고 큰 지출은 미루세요.' },
    { key: 'job', name: '직장·명예', good: '조직에서 인정받고 자리가 안정되는 흐름입니다. 신뢰를 쌓기에 좋습니다.', bad: '상사·동료와의 마찰이 생기기 쉽습니다. 말을 줄이고 기록을 남기세요.' },
    { key: 'biz', name: '사업·창업', good: '내 판을 깔았을 때 결실이 커지는 구조입니다. 준비된 확장은 성공 확률이 높습니다.', bad: '무리한 확장과 동업에서 위험이 큽니다. 검증 없이 뛰어들지 마세요.' },
    { key: 'love', name: '연애·인기', good: '매력과 인기가 살아 있는 흐름입니다. 만남이 넓어집니다.', bad: '감정 소모가 큰 시기입니다. 관계를 서두르지 마세요.' },
    { key: 'marriage', name: '결혼·배우자', good: '배우자 자리가 평온합니다. 든든한 내 편을 만나기 좋습니다.', bad: '일지의 충으로 부부 사이 마찰이 생기기 쉽습니다. 말투를 먼저 다스리세요.' },
    { key: 'health', name: '건강·체력', good: '회복력이 좋은 편입니다. 무리해도 버티는 힘이 있습니다.', bad: '오행 불균형으로 만성 피로가 오기 쉽습니다. 잠과 식사를 먼저 챙기세요.' }
  ];

  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtDate(d) {
    if (!d) return '';
    return d.y + '년 ' + d.m + '월 ' + d.d + '일';
  }

  function hourLabel(calc) {
    if (!calc.input.isHourKnown) return '시간 미상(삼주 해석)';
    var h = calc.input.hour;
    var names = ['자시', '축시', '인시', '묘시', '진시', '사시', '오시', '미시', '신시', '유시', '술시', '해시'];
    var idx = Math.floor(((h + 1) % 24) / 2);
    return names[idx] + ' (' + String(h).padStart(2, '0') + '시경)';
  }

  function birthLabel(calc) {
    var i = calc.input;
    if (i.calendar === 'lunar') {
      return '음력 ' + i.raw.y + '년 ' + i.raw.m + '월 ' + i.raw.d + '일' + (i.leap ? ' (윤달)' : '') +
        ' → 양력 ' + fmtDate(i.solar) + ' ' + hourLabel(calc);
    }
    return '양력 ' + fmtDate(i.solar) + ' ' + hourLabel(calc);
  }

  function elementBar(calc) {
    var rows = '';
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(function (e) {
      var pct = calc.percents[e];
      var w = pct > 0 ? Math.max(pct, 4) : 0;
      rows += '<div class="bar-row">' +
        '<div class="bar-name">' + ELEM_KR[e] + '</div>' +
        '<div class="bar-track"><div class="bar-fill ' + ELEM_CLASS[e] + '" style="width:' + w + '%"></div></div>' +
        '<div class="bar-val">' + calc.counts[e] + '자 (' + pct + '%)</div>' +
        '</div>';
    });
    return rows;
  }

  function pillarTable(calc) {
    var ps = calc.pillars;
    var head = '<tr><th class="ph">구분</th>' + ps.map(function (p) { return '<th>' + p.pos + '주</th>'; }).join('') + '</tr>';

    var r1 = '<tr><td class="ph">십성</td>' + ps.map(function (p) {
      return '<td class="small">' + (p.key === 'day' ? '<b>일간</b>' : esc(p.sipsin.gan)) + '</td>';
    }).join('') + '</tr>';

    var r2 = '<tr><td class="ph">천간</td>' + ps.map(function (p) {
      if (!p.gan) return '<td class="hanja muted">-</td>';
      return '<td class="hanja ' + ELEM_CLASS[global.SajuEngine.ELEM_OF_GAN[p.gan]] + '">' + p.gan + '</td>';
    }).join('') + '</tr>';

    var r3 = '<tr><td class="ph">지지</td>' + ps.map(function (p) {
      if (!p.ji) return '<td class="hanja muted">-</td>';
      return '<td class="hanja ' + ELEM_CLASS[global.SajuEngine.ELEM_OF_JI[p.ji]] + '">' + p.ji + '</td>';
    }).join('') + '</tr>';

    var r4 = '<tr><td class="ph">지장간</td>' + ps.map(function (p) {
      if (!p.jigangan.length) return '<td class="small muted">-</td>';
      return '<td class="small">' + p.jigangan.map(function (j) { return j.char + '<span class="muted">(' + j.sipsin + ')</span>'; }).join(' ') + '</td>';
    }).join('') + '</tr>';

    var r5 = '<tr><td class="ph">12운성</td>' + ps.map(function (p) {
      return '<td class="small">' + esc(p.woonsung) + '</td>';
    }).join('') + '</tr>';

    var r6 = '<tr><td class="ph">신살</td>' + ps.map(function (p) {
      if (!p.sinsal.length) return '<td class="small muted">-</td>';
      return '<td class="small">' + p.sinsal.map(esc).join(', ') + '</td>';
    }).join('') + '</tr>';

    var r7 = '<tr><td class="ph">납음</td>' + ps.map(function (p) {
      return '<td class="small">' + esc(p.nabeum) + '</td>';
    }).join('') + '</tr>';

    return '<table class="saju-table"><thead>' + head + '</thead><tbody>' +
      r1 + r2 + r3 + r4 + r5 + r6 + r7 + '</tbody></table>';
  }

  function stripTable(calc) {
    var ps = calc.pillars;
    var cells = ps.map(function (p) {
      return '<div class="strip-col">' +
        '<div class="strip-pos">' + p.pos + '</div>' +
        '<div class="strip-gan ' + (p.gan ? ELEM_CLASS[global.SajuEngine.ELEM_OF_GAN[p.gan]] : 'muted') + '">' + (p.gan || '·') + '</div>' +
        '<div class="strip-ji ' + (p.ji ? ELEM_CLASS[global.SajuEngine.ELEM_OF_JI[p.ji]] : 'muted') + '">' + (p.ji || '·') + '</div>' +
        '</div>';
    }).join('');
    return '<div class="strip">' + cells + '</div>';
  }

  function daeunTable(calc) {
    var rows = '';
    calc.daeun.list.forEach(function (d, i) {
      var cls = d.current ? ' class="cur"' : '';
      rows += '<tr' + cls + '>' +
        '<td>' + (i + 1) + '운</td>' +
        '<td>' + d.startAge + '~' + d.endAge + '세</td>' +
        '<td>' + d.startYear + '~' + d.endYear + '</td>' +
        '<td class="hanja-sm ' + ELEM_CLASS[d.ganElem] + '">' + d.gan + '</td>' +
        '<td class="hanja-sm ' + ELEM_CLASS[d.jiElem] + '">' + d.ji + '</td>' +
        '<td class="small">' + d.ganSipsin + '/' + d.jiSipsin + '</td>' +
        '<td class="small">' + d.woonsung + '</td>' +
        '</tr>';
    });
    return '<table class="grid-table"><thead><tr><th>대운</th><th>나이</th><th>연도</th><th>천간</th><th>지지</th><th>십성</th><th>12운성</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function seunTable(calc) {
    var rows = '';
    calc.seun.forEach(function (s) {
      var cls = s.year === 2027 ? ' class="cur"' : '';
      rows += '<tr' + cls + '><td>' + s.year + '년</td><td class="hanja-sm">' + s.gan + s.ji + '</td>' +
        '<td class="small">' + s.ganSipsin + '</td><td class="small">' + s.jiSipsin + '</td>' +
        '<td class="small">' + (s.relDay.length ? s.relDay.join('·') : '-') + '</td></tr>';
    });
    return '<table class="grid-table"><thead><tr><th>연도</th><th>간지</th><th>천간 십성</th><th>지지 십성</th><th>일지와의 관계</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function monthScore(calc, m) {
    var boost = calc.elements.missing;
    var harm = calc.elements.over;
    var score = 55;
    var ge = global.SajuEngine.ELEM_OF_GAN[m.gan];
    var je = global.SajuEngine.ELEM_OF_JI[m.ji];
    if (boost.indexOf(ge) >= 0) score += 14;
    if (boost.indexOf(je) >= 0) score += 10;
    if (harm.indexOf(ge) >= 0) score -= 12;
    if (harm.indexOf(je) >= 0) score -= 8;
    if (m.relDay.indexOf('충(沖)') >= 0) score -= 9;
    if (m.relDay.indexOf('육합') >= 0) score += 7;
    score += ((m.month * 7 + calc.counts.fire * 3) % 9) - 4;
    return Math.max(28, Math.min(93, Math.round(score)));
  }

  function monthTable(calc) {
    var rows = '';
    calc.monthly2027.forEach(function (m) {
      var sc = monthScore(calc, m);
      var label = sc >= 75 ? '대길' : (sc >= 60 ? '순조' : (sc >= 45 ? '평이' : '주의'));
      var cls = sc >= 75 ? 'good' : (sc >= 60 ? 'ok' : (sc >= 45 ? 'mid' : 'bad'));
      rows += '<tr><td class="mon"><span>' + String(m.month).split('').map(function (ch) { return '<span>' + ch + '</span>'; }).join('') + '<span>월</span></span></td>' +
        '<td class="hanja-sm">' + m.gan + m.ji + '</td>' +
        '<td class="small">' + m.ganSipsin + '/' + m.jiSipsin + '</td>' +
        '<td class="small">' + (m.relDay.length ? m.relDay.join('·') : '-') + '</td>' +
        '<td class="' + cls + '"><b>' + sc + '</b> ' + label + '</td></tr>';
    });
    return '<table class="grid-table month-table"><thead><tr><th>월</th><th>간지</th><th>십성</th><th>일지 관계</th><th>기운 지수</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function monthAdvice(calc) {
    var scored = calc.monthly2027.map(function (m) { return { m: m.month, s: monthScore(calc, m) }; });
    var sorted = scored.slice().sort(function (a, b) { return b.s - a.s; });
    var best = sorted.slice(0, 3).sort(function (a, b) { return a.m - b.m; });
    var worst = sorted.slice(-3).sort(function (a, b) { return a.m - b.m; });
    return { best: best, worst: worst };
  }

  // ── 페이지 빌더 ────────────────────────────────────────────────
  function Book(calc, order) {
    this.calc = calc;
    this.order = order || {};
    this.root = document.createElement('div');
    this.root.className = 'pdf-book';
    this.pages = [];
  }

  Book.prototype.addPage = function (opts) {
    opts = opts || {};
    var page = document.createElement('div');
    page.className = 'pdf-page' + (opts.cls ? ' ' + opts.cls : '');
    if (!opts.noFrame) {
      var head = document.createElement('div');
      head.className = 'page-head';
      head.innerHTML = '<span class="ph-brand">운명나침반 · 정밀 사주 책</span><span class="ph-name">' +
        esc(this.calc.input.name ? this.calc.input.name + ' 님' : '') + '</span>';
      page.appendChild(head);
      var foot = document.createElement('div');
      foot.className = 'page-foot';
      foot.innerHTML = '<span>運命羅針盤 · nachimbansaju.com</span><span class="ph-num">' + (this.pages.length + 1) + '</span>';
      page.appendChild(foot);
    }
    var body = document.createElement('div');
    body.className = 'page-body';
    page.appendChild(body);
    this.root.appendChild(page);
    this.pages.push({ el: page, body: body });
    return body;
  };

  Book.prototype.insertPageAfter = function (index) {
    var ref = this.pages[index];
    var body = this.addPage({});
    var created = this.pages[this.pages.length - 1];
    this.pages.pop();
    if (ref) this.root.insertBefore(created.el, ref.el.nextSibling);
    this.pages.splice(index + 1, 0, created);
    return body;
  };

  Book.prototype.renumber = function () {
    this.pages.forEach(function (p, i) {
      var n = p.el.querySelector('.ph-num');
      if (n) n.textContent = i + 1;
    });
  };

  Book.prototype.cur = function () {
    return this.pages[this.pages.length - 1].body;
  };

  Book.prototype.block = function (html, cls) {
    var d = document.createElement('div');
    d.className = 'blk' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    this.cur().appendChild(d);
    return d;
  };

  Book.prototype.chapter = function (num, title, sub) {
    return this.block((num ? '<div class="ch-num">제 ' + num + ' 장</div>' : '') +
      '<h2 class="ch-title">' + title + '</h2>' +
      (sub ? '<div class="ch-sub">' + sub + '</div>' : '<div class="ch-sub"></div>'), 'ch-head');
  };

  Book.prototype.para = function (text, cls) {
    return this.block('<p class="' + (cls || '') + '">' + text + '</p>');
  };

  Book.prototype.section = function (title) {
    return this.block('<h3 class="sec-title">' + title + '</h3>');
  };

  Book.prototype.fit = function () {
    // 넘치는 페이지의 마지막 블록을 다음 페이지로 옮긴다.
    // 다음 페이지가 새 장의 첫 머리라면, 장이 섞이지 않도록 빈 페이지를 끼워 넣는다.
    var self = this;
    function isHeading(el) {
      return !!(el && el.classList && el.classList.contains('blk') &&
        el.firstElementChild && el.firstElementChild.tagName === 'H3');
    }
    function moveLast(p, i) {
      var last = p.body.lastElementChild;
      p.body.removeChild(last);
      var next = self.pages[i + 1];
      var nextHead = next && next.body.firstElementChild;
      if (!next || (nextHead && nextHead.classList.contains('ch-head'))) {
        self.insertPageAfter(i);
        next = self.pages[i + 1];
      }
      next.body.insertBefore(last, next.body.firstElementChild);
      return last;
    }

    for (var i = 0; i < this.pages.length; i++) {
      var p = this.pages[i];
      var guard = 0;
      while (p.body.scrollHeight > p.body.clientHeight + 1 && p.body.children.length > 1 && guard < 80) {
        guard++;
        moveLast(p, i);
      }
      // 제목만 페이지 끝에 남는 경우(고아 제목)를 막는다.
      var orphanGuard = 0;
      while (isHeading(p.body.lastElementChild) && p.body.children.length > 1 && orphanGuard < 5) {
        orphanGuard++;
        moveLast(p, i);
      }
    }
    this.renumber();
  };

  Book.prototype.build = function () {
    this.root.__bookInstance = this;
    return this.root;
  };

  // ── 책 본문 ───────────────────────────────────────────────────
  function build(calc, orderIn) {
    var b = new Book(calc, orderIn);
    var order = orderIn || {};
    var name = calc.input.name || '회원';
    var il = ILGAN[calc.ilgan] || ILGAN['甲'];
    var productName = order.productName || '맞춤 사주 PDF 책';
    var today = new Date();
    var todayStr = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' + today.getDate() + '일';

    // ── 표지 ──
    var cover = b.addPage({ noFrame: true, cls: 'cover' });
    cover.innerHTML =
      '<div class="cover-wrap">' +
      '<div class="cover-brand">運命羅針盤</div>' +
      '<div class="cover-line"></div>' +
      '<div class="cover-kicker">맞춤 사주 정밀 리포트</div>' +
      '<div class="cover-title">' + esc(name) + ' 님의<br>여덟 글자</div>' +
      '<div class="cover-ilju">' + calc.ilju + '일주 · ' + il.title + '</div>' +
      stripTable(calc) +
      '<div class="cover-badge">' + esc(productName) + '</div>' +
      '<div class="cover-quote">여덟 글자는 정해진 운명이 아니라,<br>어디에 힘을 쓸지 알려주는 지도입니다.</div>' +
      '<div class="cover-info">' +
      '<div><span>생년월일</span>' + esc(birthLabel(calc)) + '</div>' +
      '<div><span>성별</span>' + (calc.input.gender === 'female' ? '여성' : '남성') + '</div>' +
      '<div><span>일간</span>' + calc.ilgan + ' (' + il.title.split(' ')[0] + ')</div>' +
      '<div><span>강약</span>' + calc.strength.label + ' · 내 편 ' + calc.strength.supportPct + '%</div>' +
      '<div><span>발행</span>' + todayStr + '</div>' +
      '</div>' +
      '<div class="cover-foot">운명나침반 · nachimbansaju.com<br>이 책은 결제하신 주문에 한해 발행된 맞춤 리포트입니다.</div>' +
      '</div>';

    // ── 목차 + 요약 ──
    var toc = b.addPage();
    toc.innerHTML =
      '<h2 class="page-title">목차</h2>' +
      '<div class="toc">' +
      '<div class="toc-row"><span>제1장</span>사주 원국 — 여덟 글자의 지도</div>' +
      '<div class="toc-row"><span>제2장</span>일간의 본질 — 타고난 그릇</div>' +
      '<div class="toc-row"><span>제3장</span>오행의 균형 — 넘치고 비어 있는 것</div>' +
      '<div class="toc-row"><span>제4장</span>십성의 구조 — 재물·일·관계의 뼈대</div>' +
      '<div class="toc-row"><span>제5장</span>여섯 가지 운의 점수</div>' +
      '<div class="toc-row"><span>제6장</span>대운의 흐름 — 10년마다 바뀌는 판</div>' +
      '<div class="toc-row"><span>제7장</span>세운 — 2027년 정미년의 의미</div>' +
      '<div class="toc-row"><span>제8장</span>' + (order.product === 'child' ? '공부머리와 진로 적성' : (order.product === 'couple' ? '관계의 패턴과 궁합의 조건' : (order.product === 'life' ? '평생 대운의 네 국면' : '2027년 월별 운세 달력'))) + '</div>' +
      '<div class="toc-row"><span>제9장</span>조심할 시기와 나를 살리는 귀인</div>' +
      '<div class="toc-row"><span>제10장</span>개운 비책 — 오늘부터 바꿀 것</div>' +
      '</div>' +
      '<div class="summary-card">' +
      '<div class="summary-title">이 사주를 한 줄로</div>' +
      '<div class="summary-grid">' +
      '<div><span>일주</span>' + calc.ilju + ' · ' + il.title + '</div>' +
      '<div><span>강약</span>' + calc.strength.label + ' (내 편 ' + calc.strength.supportPct + '%)</div>' +
      '<div><span>많은 기운</span>' + (calc.elements.over.length ? calc.elements.over.map(function (e) { return ELEM_KR[e]; }).join(', ') : '고른 편') + '</div>' +
      '<div><span>비어 있는 기운</span>' + (calc.elements.zero.length ? calc.elements.zero.map(function (e) { return ELEM_KR[e]; }).join(', ') : '없음') + '</div>' +
      '<div><span>현재 대운</span>' + (function () {
        var c = calc.daeun.list.filter(function (d) { return d.current; })[0];
        return c ? c.gan + c.ji + ' (' + c.startAge + '~' + c.endAge + '세)' : '대운 시작 전';
      })() + '</div>' +
      '<div><span>가장 강한 운</span>' + SCORE_DEF.slice().sort(function (a, b2) { return calc.scores[b2.key] - calc.scores[a.key]; })[0].name + '</div>' +
      '</div></div>' +
      '<div class="read-guide">' +
      '<h3 class="sec-title">이 책을 읽는 법</h3>' +
      '<p>사주는 정해진 결말이 아니라 <b>타고난 재료</b>입니다. 같은 재료로 무엇을 짓느냐는 그다음 선택에 달려 있습니다. 세 가지 순서로 읽으시면 가장 쓸모가 있습니다.</p>' +
      '<p><b>첫째</b>, 제1~3장에서 내 여덟 글자와 오행의 균형을 먼저 확인하세요. 지금 겪는 일의 절반은 여기서 설명됩니다.</p>' +
      '<p><b>둘째</b>, 제4~5장에서 재물과 일의 구조를 보세요. 어디서 돈이 들어오고 어디로 새는지가 드러납니다.</p>' +
      '<p><b>셋째</b>, 제6~8장의 대운·세운·월운은 달력처럼 쓰세요. 중요한 결정은 기운이 실린 달에, 위험한 결정은 피하는 달에 두면 됩니다.</p>' +
      '</div>';

    // ── 제1장 원국 ──
    b.addPage();
    b.chapter(1, '사주 원국 — 여덟 글자의 지도', '태어난 해·달·날·시를 간지로 옮긴 것이 사주입니다.');
    b.para('사주는 네 기둥(四柱)과 여덟 글자(八字)로 이루어집니다. 특히 <b>일간</b>(' + calc.ilgan + ')이 나 자신이고, 나머지 일곱 글자가 나를 돕는지 누르는지를 봅니다.');
    b.block(pillarTable(calc));
    b.para('한글 표기로는 <b>' + calc.hanglePillars.year + ' · ' + calc.hanglePillars.month + ' · ' + calc.hanglePillars.day + ' · ' + calc.hanglePillars.hour + '</b>입니다. ' +
      (calc.input.isHourKnown ? '' : '태어난 시간을 모르시므로 시주를 제외한 삼주(三柱)로 해석했습니다. 시간을 아시게 되면 결과가 조금 더 정밀해집니다. '), 'small');

    b.section('네 기둥이 말하는 것');
    b.block('<table class="mini-table wide"><tbody>' + PILLAR_MEANING.map(function (r) {
      return '<tr><th>' + r[0] + '</th><td>' + r[1] + '</td></tr><tr class="note-row"><td></td><td class="muted">' + r[2] + '</td></tr>';
    }).join('') + '</tbody></table>');

    b.section('지지의 관계와 반복');
    b.para(calc.relations.length
      ? '내 사주 안의 지지끼리 맺는 관계입니다. <b>' + esc(calc.relations.join(' / ')) + '</b>. ' +
        (calc.relations.some(function (r) { return r.indexOf('충') >= 0; }) ? '충(沖)은 움직임과 변화를 뜻합니다. 이사·이직·이별처럼 판이 바뀌는 일이 생기기 쉬운 대신, 그만큼 새 국면이 열립니다. ' : '') +
        (calc.relations.some(function (r) { return r.indexOf('합') >= 0; }) ? '합(合)은 사람과 기운이 묶이는 자리입니다. 인연이 오래가고 협력에서 이득이 납니다. ' : '')
      : '지지 사이에 두드러진 충·합이 없어 비교적 담백한 흐름입니다. 극단적인 변동보다 꾸준함에서 성과가 나는 구조입니다.');
    var repeated = repeatedBranches(calc);
    if (repeated.length) {
      b.para('다만 <b>' + repeated.map(function (r) { return r.ji + '가 ' + r.n + '개'; }).join(', ') + '</b> 겹쳐 있습니다. 같은 글자가 반복되면 그 기운이 한쪽으로 크게 쏠립니다. ' +
        '겹친 기운은 나의 무기가 되지만, 지나치면 같은 문제로 되돌아오는 지점이 됩니다. ' + (repeatedText(calc, repeated)));
    }
    if (calc.ganHap) b.para('천간에서는 <b>' + esc(calc.ganHap) + '</b>이 성립합니다. 서로 다른 기운이 하나로 묶이며, 그 자리의 인연과 일이 오래 이어집니다.');
    b.para('공망(空亡)은 <b>' + calc.gongmang + '</b>입니다. 이 글자가 들어온 해에는 애써도 결실이 늦어질 수 있으니, 큰 결정은 한 박자 늦추는 것이 좋습니다. 다만 공망은 "비어 있음"이 아니라 "다른 곳에서 채워짐"을 뜻하기도 합니다.');

    b.section('초년의 흔적 — 년주(年柱)');
    b.para(yearPillarNote(calc));

    b.section('내 사주에 있는 신살');
    var sinsalSet = [];
    calc.pillars.forEach(function (p) {
      p.sinsal.forEach(function (s) { if (sinsalSet.indexOf(s) < 0) sinsalSet.push(s); });
    });
    if (sinsalSet.length) {
      b.block('<table class="mini-table wide"><tbody>' + sinsalSet.map(function (s) {
        return '<tr><th>' + s + '</th><td>' + (SINSAL_TEXT[s] || '이 사주의 흐름을 거드는 자리입니다.') + '</td></tr>';
      }).join('') + '</tbody></table>');
    } else {
      b.para('두드러진 신살이 사주 안에 자리하지 않아, 특정 사건보다 매일의 선택이 결과를 만드는 구조입니다.');
    }

    b.section('이 책에 나오는 명리 용어');
    b.block('<table class="mini-table wide glossary"><tbody>' + GLOSSARY.map(function (g) {
      return '<tr><th>' + g[0] + '</th><td>' + g[1] + '</td></tr>';
    }).join('') + '</tbody></table>');

    // ── 제2장 일간 ──
    b.addPage();
    b.chapter(2, '일간의 본질 — 타고난 그릇', '일간 ' + calc.ilgan + '(' + il.title + ')이 나의 중심입니다.');
    b.section(il.title);
    b.para(il.essence);
    b.para('<b>강점</b> — ' + il.strength);
    b.para('<b>그림자</b> — ' + il.shadow);
    b.para('<b>한 줄 처방</b> — ' + il.advice);

    b.section('일간의 계절 — ' + calc.season + '의 ' + calc.ilgan + '(' + woonsungState(calc).name + ')');
    b.para(woonsungState(calc).text);

    b.section('일주 ' + calc.ilju + ' — 나와 배우자의 자리');
    var dayJiSip = calc.sipsin.day.ji;
    b.para('일지 ' + calc.ilji + '는 배우자 자리이자 내가 세상과 부딪히는 방식입니다. 이 자리에 <b>' + dayJiSip + '</b>이 앉아 있습니다. ' + (SIPSIN[dayJiSip] ? SIPSIN[dayJiSip].line : '') +
      ' 일지의 기운은 <b>' + calc.woonsungDay + '</b>으로, ' + woonsungLine(calc.woonsungDay));

    b.section('사주의 강약 — ' + calc.strength.label);
    b.para(strengthParagraph(calc));
    b.para('<b>내 편</b>은 일간과 같은 오행(비겁)과 나를 생해주는 오행(인성)' + (calc.input.isHourKnown ? ', <b>반대편</b>은 내가 쓰거나 눌리는 오행(식상·재성·관성)' : '') + '입니다. 이 비율이 ' + calc.strength.supportPct + '%라는 것은, ' +
      (calc.strength.supportPct < 45 ? '쓸 에너지에 비해 채워주는 에너지가 적다는 뜻입니다. 그래서 이 사주는 "얼마나 버티느냐"보다 "무엇을 덜어내느냐"가 운의 열쇠입니다.' : (calc.strength.supportPct >= 55 ? '내 힘이 충분하다는 뜻입니다. 그 힘을 어디에 쏟느냐가 성패를 가릅니다.' : '스스로 서는 힘과 쓰는 힘이 균형을 이룬다는 뜻입니다. 무리하지 않으면 오래 갑니다.')));

    b.section('겉으로 보이는 나 — 월간(月干)');
    b.para(monthGanImpression(calc));

    // ── 제3장 오행 ──
    b.addPage();
    b.chapter(3, '오행의 균형 — 넘치고 비어 있는 것', '여덟 글자의 기운을 세어보면 내 인생의 반복 패턴이 보입니다.');
    b.block(elementBar(calc));
    b.para('오행은 서로 살리고(相生) 누르는(相剋) 관계로 움직입니다. 물은 나무를 살리고, 나무는 불을 피우고, 불은 흙을 만들고, 흙은 쇠를 품고, 쇠는 물을 낳습니다. 반대로 물은 불을 끄고, 불은 쇠를 녹입니다. 내 사주에서 <b>많은 기운은 지나치게 쓰이고, 없는 기운은 채워지지 않아</b> 삶의 기복이 생깁니다.');

    if (calc.elements.over.length) {
      b.section('넘치는 기운 — ' + calc.elements.over.map(function (e) { return ELEM_KR[e]; }).join(', '));
      calc.elements.over.forEach(function (e) {
        b.para('<b>' + ELEM_KR[e] + '</b> — ' + OVER_TEXT[e]);
      });
    }
    if (calc.elements.zero.length) {
      b.section('비어 있는 기운 — ' + calc.elements.zero.map(function (e) { return ELEM_KR[e]; }).join(', '));
      calc.elements.zero.forEach(function (e) {
        b.para('<b>' + ELEM_KR[e] + '</b> — ' + ZERO_TEXT[e]);
      });
    }
    if (!calc.elements.over.length && !calc.elements.zero.length) {
      b.section('오행의 균형');
      b.para('다섯 기운이 고르게 분포한 보기 드문 구조입니다. 큰 기복이 적은 대신, 스스로 판을 키우지 않으면 무난함에 머물 수 있습니다. 지금 가진 균형을 무기로 한 분야를 깊게 파는 것이 좋습니다.');
    }

    b.section('조후 — ' + calc.season + '에 태어난 사주');
    b.para(calc.isCold
      ? '겨울(亥·子·丑)에 태어나 사주가 차갑습니다. 몸과 마음이 쉽게 움츠러들고, 결정을 미루는 경향이 있습니다. 햇빛·온기·활동적인 사람과의 만남이 곧 약이 됩니다.'
      : (calc.isHot
        ? '여름(巳·午·未)에 태어나 사주가 뜨겁습니다. 의욕이 앞서고 열이 쉽게 오릅니다. 물·그늘·휴식으로 열을 식히는 것이 오래 가는 비결입니다.'
        : '봄·가을의 중간 기운으로 태어나 조후가 비교적 온화합니다. 계절의 변화에 맞춰 생활 리듬을 잡으면 컨디션이 안정됩니다.'));

    b.section('보완할 기운 — ' + (calc.elements.missing.length ? calc.elements.missing.map(function (e) { return ELEM_KR[e]; }).join(', ') : '균형 유지'));
    b.para(yongsinText(calc));

    // ── 제4장 십성 ──
    b.addPage();
    b.chapter(4, '십성의 구조 — 재물·일·관계의 뼈대', '여덟 글자가 나와 어떤 관계를 맺고 있는지 봅니다.');
    b.para('십성은 일간을 기준으로 다른 글자가 나와 어떤 관계인지를 열 가지로 나눈 것입니다. <b>비겁</b>은 나와 같은 힘, <b>식상</b>은 내가 낳는 재능, <b>재성</b>은 내가 다스리는 재물, <b>관성</b>은 나를 누르는 책임, <b>인성</b>은 나를 살리는 배움입니다.');
    var groupRows = '';
    ['비겁', '식상', '재성', '관성', '인성'].forEach(function (g) {
      groupRows += '<tr><td><b>' + g + '</b></td><td class="center">' + calc.sipsinCounts[g] + '개</td><td class="small">' + (calc.sipsinCounts[g] >= 3 ? '과다' : (calc.sipsinCounts[g] === 0 ? '없음' : '보통')) + '</td></tr>';
    });
    b.block('<table class="grid-table"><thead><tr><th>구분</th><th>개수</th><th>상태</th></tr></thead><tbody>' + groupRows + '</tbody></table>');

    ['비겁', '식상', '재성', '관성', '인성'].forEach(function (g) {
      var n = calc.sipsinCounts[g];
      var info = GROUP_TEXT[g];
      var body = n >= 3 ? info.over : (n === 0 ? info.under : null);
      if (!body) return;
      b.section(info.name + (n >= 3 ? ' — 과다' : ' — 없음'));
      b.para(body);
    });
    var balanced = ['비겁', '식상', '재성', '관성', '인성'].filter(function (g) { return calc.sipsinCounts[g] > 0 && calc.sipsinCounts[g] < 3; });
    if (balanced.length) {
      b.para('한편 <b>' + balanced.join('·') + '</b>은 고르게 자리하고 있습니다. 이 부분은 크게 흔들리지 않으니, 과다하거나 비어 있는 곳을 보완하는 데 힘을 쓰시면 됩니다.', 'small');
    }
    b.section('이 사주의 재물 구조');
    b.para(moneyStructure(calc));
    b.section('이 사주의 일 구조');
    b.para(workStructure(calc));

    // ── 제5장 점수 ──
    b.addPage();
    b.chapter(5, '여섯 가지 운의 점수', '같은 사주라도 영역마다 힘의 세기가 다릅니다.');
    b.para(answerFor(calc));
    var scoreRows = SCORE_DEF.map(function (s) {
      var v = calc.scores[s.key];
      return '<tr><td>' + s.name + '</td><td class="center"><b>' + v + '</b></td><td class="small">' + (v >= 70 ? '강함' : (v >= 50 ? '보통' : '주의')) + '</td></tr>';
    }).join('');
    b.block('<table class="grid-table"><thead><tr><th>영역</th><th>점수</th><th>상태</th></tr></thead><tbody>' + scoreRows + '</tbody></table>');
    b.para('점수는 일간을 기준으로 한 오행의 분포, 십성의 자리, 일지와의 관계를 함께 계산한 값입니다. 100점 만점의 절대 평가가 아니라 <b>내 사주 안에서의 상대적인 세기</b>로 읽으시면 됩니다.', 'small');

    b.section('영역별 진단');
    b.block('<table class="mini-table wide score-table"><tbody>' + SCORE_DEF.map(function (s) {
      var v = calc.scores[s.key];
      return '<tr><th>' + s.name + '<span class="score-chip">' + v + '</span></th><td>' + (v >= 60 ? s.good : s.bad) + '</td></tr>';
    }).join('') + '</tbody></table>');

    b.section('가장 강한 곳과 가장 약한 곳');
    var sorted = SCORE_DEF.slice().sort(function (x, y) { return calc.scores[y.key] - calc.scores[x.key]; });
    var top = sorted[0], low = sorted[sorted.length - 1];
    b.para('<b>' + top.name + ' ' + calc.scores[top.key] + '점</b>이 가장 강합니다. ' + top.good + ' 이 힘을 다른 영역의 보수에 쓰시면 훨씬 효율적입니다.');
    b.para('<b>' + low.name + ' ' + calc.scores[low.key] + '점</b>이 가장 약합니다. ' + low.bad);
    b.para('<b>2027년 한 해</b>의 기운은 ' + calc.scores.y2027 + '점으로 계산됩니다. ' +
      (calc.scores.y2027 >= 70 ? '흐름이 좋은 해입니다. 미뤄둔 일을 이 해에 시작하면 결실이 빨리 옵니다.' :
        (calc.scores.y2027 >= 50 ? '무난하게 지나가는 해입니다. 크게 벌이기보다 지키면서 준비하기에 좋습니다.' :
          '변동이 큰 해입니다. 큰 투자·보증·동업은 한 해 미루고, 몸과 생활의 기반을 다지는 데 집중하세요.')));

    // ── 제6장 대운 ──
    b.addPage();
    b.chapter(6, '대운의 흐름 — 10년마다 바뀌는 판', '대운수 ' + calc.daeun.number + ', ' + (calc.daeun.forward ? '순행' : '역행') + '으로 흐릅니다.');
    b.para('대운은 10년 단위로 바뀌는 큰 계절입니다. 지금의 노력이 결실을 맺는 시기와, 버텨야 하는 시기가 여기서 갈립니다. ' +
      (calc.daeun.forward ? '순행 대운은 월주에서 다음 간지로 나아가며, 시간이 흐를수록 기운이 확장되는 구조입니다.' : '역행 대운은 월주에서 이전 간지로 거슬러 가며, 안으로 깊어지고 정리되는 구조입니다.'));
    b.block(daeunTable(calc));
    b.para('대운의 나이는 한국식 나이 기준이며, 출생 시각과 절기 경계에 따라 1~2년 차이가 날 수 있습니다.', 'small');

    var curD = calc.daeun.list.filter(function (d) { return d.current; })[0];
    if (curD) {
      b.section('지금의 대운 — ' + curD.startAge + '~' + curD.endAge + '세 (' + curD.gan + curD.ji + ')');
      b.para('<b>' + curD.gan + curD.ji + '</b> 대운은 천간 ' + curD.ganSipsin + ', 지지 ' + curD.jiSipsin + '의 성격을 함께 씁니다. ' + (DAEUN_TEXT[curD.ganSipsin] || ''));
      b.para('여기에 지지의 <b>' + curD.jiSipsin + '</b> 기운이 겹칩니다. ' + (DAEUN_TEXT[curD.jiSipsin] || '') +
        ' 이 흐름이 ' + curD.startYear + '년부터 ' + curD.endYear + '년까지 이어집니다.');
      var idx = calc.daeun.list.indexOf(curD);
      var next = calc.daeun.list[idx + 1];
      if (next) {
        b.section('다음 대운 — ' + next.startYear + '년(' + next.startAge + '세)부터 ' + next.gan + next.ji);
        b.para((DAEUN_TEXT[next.ganSipsin] || '') + ' 지금부터 2~3년은 이 다음 계절의 씨앗을 심는 기간으로 보시면 좋습니다. 지금의 선택이 그때의 출발점이 됩니다.');
      }
      var prev = calc.daeun.list[idx - 1];
      if (prev) {
        b.para('<b>지난 대운(' + prev.startYear + '~' + prev.endYear + ')</b>은 ' + prev.gan + prev.ji + ' ' + prev.ganSipsin + '의 흐름이었습니다. 그 시절 반복되던 문제가 지금도 남아 있다면, 그것은 사람의 문제가 아니라 계절의 문제였을 수 있습니다.', 'small');
      }
    } else {
      var first = calc.daeun.list[0];
      b.para('아직 첫 대운이 시작되기 전입니다. ' + first.startYear + '년(' + first.startAge + '세)부터 ' + first.gan + first.ji + ' 대운이 열립니다. 그 전까지는 월주의 기운을 중심으로 보시면 됩니다.');
    }

    // ── 제7장 세운 ──
    b.addPage();
    b.chapter(7, '세운 — 2027년 정미년의 의미', '해마다 바뀌는 1년의 기운을 봅니다.');
    b.para('세운은 그해의 간지가 내 사주에 어떤 작용을 하는지 보는 것입니다. 같은 대운 안에서도 해마다 기운의 결이 달라지므로, 큰 결정은 세운이 받쳐주는 해에 두는 것이 좋습니다.');
    b.block(seunTable(calc));

    var s27 = calc.seun.filter(function (s) { return s.year === 2027; })[0];
    if (s27) {
      b.section('2027년 정미(丁未)년 — ' + s27.ganSipsin + ' / ' + s27.jiSipsin);
      b.para(seun2027Text(calc, s27));
    }
    b.section('앞뒤 해를 함께 보기');
    [2026, 2028, 2029].forEach(function (yy) {
      var s = calc.seun.filter(function (x) { return x.year === yy; })[0];
      if (!s) return;
      b.para('<b>' + yy + '년(' + s.gan + s.ji + ')</b> — ' + s.ganSipsin + '의 해입니다. ' + seunBrief(calc, s), 'small');
    });
    b.section('2027년에 시작할 일과 미룰 일');
    b.para(seun2027Action(calc, s27));

    // ── 제8장 상품별 ──
    b.addPage();
    if (order.product === 'child') {
      b.chapter(8, '공부머리와 진로 적성', '아이의 사주에서 드러나는 학습 방식과 재능의 방향입니다.');
      childChapter(b, calc, il);
    } else if (order.product === 'couple') {
      b.chapter(8, '관계의 패턴과 궁합의 조건', '이 사주가 사람을 만나고 헤어지는 방식입니다.');
      coupleChapter(b, calc);
    } else if (order.product === 'life') {
      b.chapter(8, '평생 대운의 네 국면', '초년·청년·중년·말년의 판을 한 번에 봅니다.');
      lifeChapter(b, calc);
    } else {
      b.chapter(8, '2027년 월별 운세 달력', '1월부터 12월까지, 어느 달에 밀고 어느 달에 쉬어야 하는지.');
      b.para('아래 표의 <b>기운 지수</b>는 그달의 간지가 내 사주에 보태는 기운과 눌리는 기운을 계산한 값입니다. 75 이상은 밀어붙이기 좋은 달, 60~74는 순조로운 달, 45~59는 평이한 달, 45 미만은 쉬어가야 하는 달입니다. 절기(節氣) 경계에 따라 며칠 차이가 있을 수 있습니다.');
      b.block(monthTable(calc));
      var ma = monthAdvice(calc);
      b.section('2027년, 밀어붙일 달과 쉬어갈 달');
      b.para('<b>좋은 달 — </b>' + ma.best.map(function (x) { return x.m + '월(' + x.s + '점)'; }).join(', ') + '. 이 달에는 미뤄둔 계약·이직·큰 지출처럼 결단이 필요한 일을 두세요. 기운이 받쳐주면 같은 노력에도 결과가 빨리 옵니다.');
      b.para('<b>조심할 달 — </b>' + ma.worst.map(function (x) { return x.m + '월(' + x.s + '점)'; }).join(', ') + '. 이 달에는 새로 시작하는 일, 보증, 큰 투자를 피하세요. 대신 정리·점검·건강 관리에 시간을 쓰면 오히려 손실을 막습니다.');
      b.para('한 해의 큰 결정은 <b>' + ma.best.map(function (x) { return x.m + '월'; }).join('·') + '</b>처럼 기운이 실린 달에 두고, <b>' + ma.worst.map(function (x) { return x.m + '월'; }).join('·') + '</b>처럼 눌리는 달에는 몸과 마음을 먼저 챙기시면 좋습니다.', 'small');
    }

    // ── 제9장 조심할 시기·귀인 ──
    b.addPage();
    b.chapter(9, '조심할 시기와 나를 살리는 귀인', '언제 조심하고, 누구를 곁에 두어야 하는지.');
    b.section('조심할 시기');
    cautionPeriods(calc).forEach(function (c) { b.para(c); });
    b.section('세운별 짧은 지침');
    b.block('<table class="mini-table wide"><tbody>' + calc.seun.map(function (s) {
      return '<tr><th>' + s.year + ' ' + s.gan + s.ji + '</th><td>' + seunBrief(calc, s) + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.section('몸에서 먼저 오는 신호');
    b.para(elementHealth(calc));
    b.section('나를 살리는 귀인');
    b.para(guiinText(calc));

    // ── 제10장 개운 ──
    b.addPage();
    b.chapter(10, '개운 비책 — 오늘부터 바꿀 것', '부족한 기운을 일상에서 채우는 가장 현실적인 방법입니다.');
    var boostTargets = (calc.elements.zero.length ? calc.elements.zero : calc.elements.missing).slice(0, 2);
    if (!boostTargets.length) boostTargets = [calc.elements.motherElem];
    boostTargets.forEach(function (e) {
      var bo = BOOST[e];
      b.section(ELEM_KR[e] + ' 보충 — ' + ELEM_NAME[e] + '의 기운을 채우는 법');
      b.block('<table class="mini-table"><tbody>' +
        '<tr><th>색</th><td>' + bo.color + '</td><th>방위</th><td>' + bo.dir + '</td></tr>' +
        '<tr><th>숫자</th><td>' + bo.num + '</td><th>맛</th><td>' + bo.food + '</td></tr>' +
        '<tr><th>활동</th><td>' + bo.act + '</td><th>분야</th><td>' + bo.job + '</td></tr>' +
        '</tbody></table>');
      b.para('<b>생활 처방</b> — ' + bo.habit);
    });
    b.section('관계에서의 개운');
    b.para(relationAdvice(calc));
    b.section('돈에서의 개운');
    b.para(moneyAdvice(calc));
    b.section('3개월 실천 계획');
    b.block('<table class="mini-table wide plan-table"><tbody>' + practicePlan(calc).map(function (r, i) {
      return '<tr><th>' + (i + 1) + '개월</th><td>' + r + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.para('사주는 한 번 읽고 덮는 것이 아니라, 한 가지를 실제로 바꿀 때 힘이 생깁니다. 위 세 가지 중 <b>가장 쉬운 하나</b>만 이번 주에 시작해 보세요.', 'small');

    // ── 마지막: 편지 + 이용 안내 ──
    b.addPage();
    b.chapter('', '마지막으로 드리는 말씀', '');
    b.para(esc(name) + ' 님, 여기까지 읽어주셔서 고맙습니다.');
    b.para(closingLetter(calc, il));
    b.section('이용 안내');
    b.para('<b>다운로드·열람 기간</b> — 이 책은 결제일로부터 30일 이내에 다시 내려받으실 수 있습니다. 기기에 저장하신 파일은 기간과 관계없이 보관하실 수 있습니다.');
    b.para('<b>1회 무료 질문 AS</b> — 책을 읽으시다 이해가 어려운 부분이 있으면 카카오톡 1:1 상담실에 <b>결제번호 ' + esc(order.paymentId || '-') + '</b>와 함께 남겨주세요. 1회 무료로 보완 설명을 드립니다.');
    b.para('<b>오류·재발급</b> — 파일이 열리지 않거나 내용이 누락된 경우, 같은 상담실로 알려주시면 즉시 재발급해 드립니다.');
    b.para('<b>환불</b> — 다운로드 전에는 결제일로부터 7일 이내 전액 환불이 가능합니다. 다운로드가 시작된 디지털 콘텐츠는 단순 변심에 의한 환불이 제한됩니다(전자상거래법 제17조 제2항 제5호).');
    b.para('<b>저작권</b> — 이 책의 분석 문구와 구성에 대한 저작권은 운명나침반에 있습니다. 구매자 본인의 열람·보관 목적 외 복제·배포는 삼가 주세요.', 'small');
    b.para('<b>고지</b> — 본 리포트는 전통 명리학 이론에 근거한 해석 자료이며, 의료·법률·투자 판단을 대신하지 않습니다.', 'small');
    b.para('<span class="brand-end">運命羅針盤 · nachimbansaju.com</span>', 'center');

    return b.build();
  }

  // 문서에 붙인 뒤에 호출해야 페이지 넘침을 정확히 잴 수 있습니다.
  function finish(root) {
    if (root && root.__bookInstance) root.__bookInstance.fit();
  }

  // ── 문단 생성 도우미 ──────────────────────────────────────────
  function repeatedBranches(calc) {
    var map = {};
    [{ p: '년', j: calc.pillars[0].ji }, { p: '월', j: calc.pillars[1].ji }, { p: '일', j: calc.pillars[2].ji }, { p: '시', j: calc.pillars[3].ji }]
      .forEach(function (x) { if (x.j) map[x.j] = (map[x.j] || 0) + 1; });
    return Object.keys(map).filter(function (k) { return map[k] >= 2; }).map(function (k) { return { ji: k, n: map[k] }; });
  }

  function repeatedText(calc, repeated) {
    return '그 기운이 나의 강점이자 반복되는 숙제가 됩니다. 같은 글자가 겹친 자리는 힘이 세게 몰리는 곳이라, 잘 쓰면 무기가 되고 잘못 쓰면 같은 문제로 되돌아옵니다. 자세한 진단은 제3장에서 이어집니다.';
  }

  function woonsungState(calc) {
    var se = { '寅': 'wood', '卯': 'wood', '辰': 'earth', '巳': 'fire', '午': 'fire', '未': 'earth', '申': 'metal', '酉': 'metal', '戌': 'earth', '亥': 'water', '子': 'water', '丑': 'earth' }[calc.pillars[1].ji];
    var my = calc.elements.myElem;
    var E = global.SajuEngine;
    var name, text;
    if (se === my) {
      name = '왕(旺)';
      text = '태어난 달이 내 오행과 같습니다. 일간이 가장 힘찬 계절에 나왔다고 보는 자리로, 몸에 힘이 붙고 밀고 나가는 추진력이 살아 있습니다. 다만 힘이 넘쳐 주변을 밀어내지 않도록 속도를 조절하는 것이 관건입니다.';
    } else if (se === ({ wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal' })[my]) {
      name = '상(相)';
      text = '태어난 달이 나를 생해주는 기운입니다. 일간이 자라나는 계절에 나와, 배우고 흡수하는 힘이 좋습니다. 기회가 왔을 때 붙잡는 감각이 뛰어나지만, 스스로 결정하는 연습이 필요합니다.';
    } else if (se === ({ wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' })[my]) {
      name = '휴(休)';
      text = '태어난 달이 내가 낳아주는 기운입니다. 일간이 열심히 쓰이는 계절에 나와, 베풀고 표현하는 일이 많습니다. 그만큼 소모가 크니, 쉬는 시간을 일정에 먼저 넣어야 오래 갑니다.';
    } else if (se === ({ wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' })[my]) {
      name = '수(囚)';
      text = '태어난 달이 내가 다스리는 기운입니다. 재물과 사람을 챙기는 일이 많은 계절에 나왔습니다. 책임이 앞서고 몸이 뒤로 밀리기 쉬우니, 내 몫을 청구하는 연습이 필요합니다.';
    } else {
      name = '사(死)';
      text = '태어난 달이 나를 누르는 기운입니다. 규율과 책임이 강한 계절에 나와, 남의 기준에 맞추다 지치기 쉽습니다. 다만 이 압박을 견디는 힘이 곧 사회에서의 자리가 되므로, 버티는 것만으로도 성과입니다.';
    }
    return { name: name, text: text };
  }

  function monthGanImpression(calc) {
    var g = calc.sipsinCounts, mg = calc.sipsin.month.gan;
    var group = (SIPSIN[mg] || {}).g || '비겁';
    var line = (SIPSIN[mg] ? SIPSIN[mg].line : '');
    var face = {
      '비겁': '겉으로는 자기 주관이 또렷하고 밀어붙이는 사람으로 보입니다. 쉽게 휘둘리지 않는다는 인상을 주지만, 고집으로 읽힐 때도 있습니다.',
      '식상': '말과 표정이 살아 있는 사람으로 보입니다. 재미있고 표현이 분명해 사람을 끌지만, 말이 앞서 실수가 되기도 합니다.',
      '재성': '현실적이고 챙길 것을 챙기는 사람으로 보입니다. 믿고 맡길 수 있다는 인상을 줍니다.',
      '관성': '단정하고 책임감 있는 사람으로 보입니다. 자리를 지키고 규칙을 지키는 태도가 신뢰를 만듭니다.',
      '인성': '차분하고 생각이 깊은 사람으로 보입니다. 쉽게 다가가기 어렵지만, 알면 따뜻하다는 평을 듣습니다.'
    }[group];
    return '내 사주에서 월간(月干)은 사회에서 보이는 나의 첫인상입니다. 이 자리에 <b>' + mg + '</b>이 앉아 <b>' + mg + '</b>(' + group + ')의 얼굴로 비칩니다. ' + line +
      ' ' + face + ' 실제 내면의 일간(' + calc.ilgan + ')과 이 첫인상 사이에 차이가 있을 수 있는데, 이 간극이 사람들이 나를 오해하는 지점이기도 합니다.';
  }

  function yearPillarNote(calc) {
    var yg = calc.sipsin.year.gan, yj = calc.sipsin.year.ji;
    var group = (SIPSIN[yg] || {}).g || '비겁';
    var env = {
      '비겁': '집안에 자기 주장이 강한 사람이 있거나, 어릴 때 또래와 부대끼며 자란 환경이었을 가능성이 큽니다',
      '식상': '집안 분위기가 자유롭고 표현이 잦았을 가능성이 큽니다',
      '재성': '어른들이 실무와 돈을 챙기는 모습을 일찍부터 보며 자란 환경일 수 있습니다',
      '관성': '규칙과 책임을 강조하는 집안이라 자녀의 자유가 제한되었을 수 있습니다',
      '인성': '배움과 보살핌을 중시하는 집안이었고, 기대와 보호가 함께 컸을 수 있습니다'
    }[group];
    return '년주는 조상과 초년의 환경입니다. 천간 <b>' + yg + '</b>(' + yg + '·' + group + '), 지지 <b>' + calc.pillars[0].ji + '</b>(' + yj + ')의 결로 보면, ' + env +
      '. 이 환경은 지금의 선택에는 관여하지 않지만, 사람에게 기대고 베푸는 방식에 오래 남아 있습니다. 지금 반복되는 관계의 습관이 어릴 때의 바탕에서 왔다면, 그것을 알아차리는 것만으로도 같은 실수를 줄일 수 있습니다.';
  }

  function elementHealth(calc) {
    var body = {
      wood: '간·눈·근육과 힘줄, 불면과 화병',
      fire: '심장·혈압·수면, 얼굴이 달아오르는 증상과 울화',
      earth: '소화기·위장·체중, 붓기와 만성 피로',
      metal: '폐·호흡기·피부·대장, 알레르기와 건조증',
      water: '신장·방광·허리, 수족냉증과 만성적인 무기력'
    };
    var over = calc.elements.over, zero = calc.elements.zero;
    var t = '';
    if (over.length) {
      t += '전통 명리에서는 기운이 과한 곳에 몸의 부담이 먼저 쏠린다고 봅니다. 이 사주는 <b>' + over.map(function (e) { return ELEM_KR[e]; }).join('·') + '</b>이 과해, ' +
        over.map(function (e) { return ELEM_NAME[e] + '의 자리인 ' + body[e]; }).join(' / ') + ' 쪽이 예민할 수 있습니다. ';
    }
    if (zero.length) {
      t += '반대로 <b>' + zero.map(function (e) { return ELEM_KR[e]; }).join('·') + '</b>이 비어 있어 ' +
        zero.map(function (e) { return body[e]; }).join(' / ') + ' 쪽으로 회복이 더딜 수 있습니다. ';
    }
    if (!t) t += '오행이 고르게 자리해 특정 부위에 부담이 쏠리는 편은 아닙니다. ';
    t += '이것은 진단이 아니라 전통 명리에서 보는 참고 신호입니다. 잠·식사·운동을 규칙적으로 두는 것이 가장 확실한 약이며, 증상이 이어지면 병원 진료를 먼저 받으세요.';
    return t;
  }

  function seun2027Action(calc, s27) {
    if (!s27) return '';
    var start = [], hold = [];
    if (s27.ganSipsin === '정재' || s27.ganSipsin === '편재') {
      start.push('수입 구조를 정리하고 저축·적립 비중을 늘리기');
      hold.push('새로운 빛·보증·동업 확장');
    } else if (s27.ganSipsin === '정관') {
      start.push('직장·자격·계약처럼 자리를 굳히는 일');
      hold.push('말로 인한 구설이 생길 만한 공개적인 다툼');
    } else if (s27.ganSipsin === '식신' || s27.ganSipsin === '상관') {
      start.push('내 재능을 기록·콘텐츠·기술로 남기는 일');
      hold.push('윗사람·규칙과 정면으로 부딪히는 일');
    } else {
      start.push('배움·자격·기술 습득처럼 몸에 남는 투자');
      hold.push('검증되지 않은 큰 지출과 보증');
    }
    if (s27.relDay.indexOf('충(沖)') >= 0) hold.push('감정이 앞선 상태의 이사·이직 결정');
    if (s27.relDay.indexOf('육합') >= 0) start.push('오래된 인연과 관계를 깊게 하는 만남');
    return '<b>시작하기 좋은 일</b> — ' + start.join(', ') + '. 기운이 받쳐줄 때 해두면 같은 노력에도 결과가 빨리 남습니다.<br>' +
      '<b>미루는 것이 좋은 일</b> — ' + hold.join(', ') + '. 이 해에 벌인 일은 다음 계절까지 끌고 가게 됩니다.';
  }

  function woonsungLine(w) {
    var map = {
      '장생': '새로 시작하는 힘이 살아 있는 자리입니다.',
      '목욕': '감정의 기복이 있지만 사람을 끄는 힘이 있습니다.',
      '관대': '예의와 체면을 중시하며 자리를 넓혀갑니다.',
      '건록': '자립의 힘이 강해 스스로 먹고사는 능력이 좋습니다.',
      '제왕': '기운이 정점에 이르러 추진력이 매우 강합니다.',
      '쇠': '힘이 빠지는 자리라 무리보다 관리가 필요합니다.',
      '병': '몸과 마음이 예민해지니 휴식이 약입니다.',
      '사': '안으로 정리하는 시기이며, 새 일보다 마무리가 맞습니다.',
      '묘': '축적과 저장의 자리로, 실속을 챙기기에 좋습니다.',
      '절': '끊어짐과 재출발이 함께 있는 자리입니다.',
      '태': '잉태의 자리로, 아직 드러나지 않은 가능성이 큽니다.',
      '양': '길러지는 자리로, 배움과 준비가 힘이 됩니다.'
    };
    return map[w] || '';
  }

  function strengthParagraph(calc) {
    var s = calc.strength;
    var base = '내 편(비겁·인성)의 힘이 ' + s.supportPct + '%로 계산되어 <b>' + s.label + '</b> 구조입니다. ';
    if (s.supportPct >= 55) {
      return base + '스스로를 지탱하는 힘이 충분합니다. 밀어붙이는 힘이 세니, 그 힘을 어디에 쓸지가 관건입니다. 재물과 성과를 향해 쓰면 크게 얻지만, 사람을 향해 쓰면 관계가 상합니다.';
    }
    if (s.supportPct >= 45) {
      return base + '균형이 잡힌 구조입니다. 무리하지 않으면 버티고, 때를 만나면 나아갑니다. 결정을 내릴 때 혼자보다 한 사람의 조언을 더하면 실수가 크게 줄어듭니다.';
    }
    return base + '나를 도와주는 힘이 적어, 혼자 다 짊어지면 몸이 먼저 지칩니다. 이 구조의 핵심은 <b>내려놓기와 나눠 맡기기</b>입니다. 일을 줄이고, 사람을 곁에 두고, 잠을 지키는 것만으로도 운의 체감이 달라집니다.';
  }

  function yongsinText(calc) {
    var m = calc.elements.missing;
    if (!m.length) return '다섯 기운이 비교적 고르게 자리해 특정 오행을 급하게 보충할 필요는 없습니다. 대신 지금 가장 강한 기운이 지나치게 쓰이지 않도록 생활의 속도를 조절하는 것이 곧 개운입니다.';
    var e = m[0];
    var txt = '전통 명리에서는 이렇게 비어 있는 기운을 <b>용신(用神)</b> 후보로 봅니다. ' + ELEM_KR[e] + '의 기운을 일상에서 조금씩 보태면 사주의 균형이 덜 기웁니다. ';
    txt += '색·방위·음식 같은 상징보다 확실한 것은 <b>행동</b>입니다. ' + BOOST[e].act + '처럼 그 기운에 해당하는 활동을 주 3회, 15분이라도 반복해 보세요. ';
    if (m.length > 1) txt += '함께 비어 있는 ' + m.slice(1).map(function (x) { return ELEM_KR[x]; }).join(', ') + '도 같은 방식으로 채우시면 좋습니다. ';
    txt += '다만 실제 해석에서는 사주 전체의 균형과 계절을 함께 보므로, 이 책은 "부족한 기운을 의식하고 채운다" 정도로 받아들이시면 충분합니다.';
    return txt;
  }

  function moneyStructure(calc) {
    var g = calc.sipsinCounts;
    var t = '이 사주에서 재물은 <b>재성 ' + g['재성'] + '개, 식상 ' + g['식상'] + '개, 비겁 ' + g['비겁'] + '개</b>로 짜여 있습니다. ';
    if (g['재성'] >= 3) t += '재성이 많다는 것은 돈이 오가는 일이 많다는 뜻입니다. 문제는 벌이가 아니라 <b>새는 곳</b>입니다. ';
    else if (g['재성'] === 0) t += '재성이 없다는 것은 돈이 눈에 보이지 않는 구조라는 뜻입니다. 월급만으로는 결실이 얇으니 몸에 남는 기술을 하나 만드는 것이 답입니다. ';
    else t += '재성이 알맞게 자리해 성실하게 모으면 쌓이는 구조입니다. ';
    if (g['식상'] >= 1) t += '식상이 있어 내 재능이 재물로 이어지는 통로가 열려 있습니다. ';
    else t += '식상이 비어 있어 재능이 재물로 바뀌는 통로가 막혀 있습니다. 만들고 팔고 말하는 일을 의식적으로 늘려야 합니다. ';
    if (g['비겁'] === 0) t += '비겁이 없어 지출을 통제하는 힘이 약한 대신, 혼자 벌어 혼자 쓰는 구조입니다.';
    else if (g['비겁'] >= 3) t += '비겁이 강해 지인·동업으로 돈이 나가기 쉽습니다. 돈이 오가는 관계는 반드시 문서로 남기세요.';
    else t += '비겁이 적당해 스스로 벌고 지키는 힘이 균형을 이룹니다.';
    return t;
  }

  function workStructure(calc) {
    var g = calc.sipsinCounts;
    var t = '관성 <b>' + g['관성'] + '개</b>, 인성 <b>' + g['인성'] + '개</b>, 식상 <b>' + g['식상'] + '개</b>입니다. ';
    if (g['관성'] >= 2 && g['인성'] >= 1) t += '관인상생(官印相生)의 구조로, 조직 안에서 인정받고 자리를 올리는 흐름이 좋습니다. 직장·공공·전문직에서 강점이 살아납니다.';
    else if (g['관성'] === 0) t += '관성이 비어 있어 규율에 묶이는 일이 답답합니다. 프리랜서·자영업·전문직처럼 스스로 판을 짜는 일에서 성과가 나옵니다.';
    else if (g['인성'] === 0) t += '인성이 비어 있어 배움보다 실전에서 빨리 배웁니다. 다만 자격·기술을 하나 붙잡아 두면 오래 든든합니다.';
    else t += '조직과 개인의 힘이 균형을 이뤄, 소속과 독립 사이에서 선택의 폭이 넓습니다.';
    if (g['식상'] >= 2) t += ' 식상이 강해 내 손으로 만들고 표현하는 일에서 재능이 드러납니다.';
    return t;
  }

  function answerFor(calc) {
    var s = calc.scores;
    var strongest = SCORE_DEF.slice().sort(function (a, b) { return s[b.key] - s[a.key]; })[0];
    var weakest = SCORE_DEF.slice().sort(function (a, b) { return s[a.key] - s[b.key]; })[0];
    return '먼저 결론부터 말씀드리면, ' + (calc.input.name || '회원') + ' 님의 사주에서 가장 힘이 실린 곳은 <b>' + strongest.name + ' ' + s[strongest.key] + '점</b>입니다. ' +
      '반대로 가장 약한 곳은 <b>' + weakest.name + ' ' + s[weakest.key] + '점</b>입니다. ' +
      '사주는 모든 문이 함께 열리지 않습니다. 강한 문으로 들어가 약한 문을 보수하는 것이 가장 현실적인 전략입니다.';
  }

  function seun2027Text(calc, s27) {
    var t = '<b>2027년은 정미(丁未)년</b>입니다. 천간 정화(丁火)는 ' + (calc.input.name || '본인') + ' 님에게 <b>' + s27.ganSipsin + '</b>의 작용을 하고, 지지 미토(未土)는 <b>' + s27.jiSipsin + '</b>의 작용을 합니다. ';
    t += (SIPSIN[s27.ganSipsin] ? SIPSIN[s27.ganSipsin].line + ' ' : '');
    if (s27.relDay.length) {
      t += '일지와는 <b>' + s27.relDay.join('·') + '</b>의 관계를 맺습니다. ' +
        (s27.relDay.join('').indexOf('충') >= 0
          ? '일지가 흔들리는 해라 이사·이직·관계의 변화가 찾아오기 쉽습니다. 변동 자체는 나쁘지 않지만, 감정이 앞설 때 결정하지 마세요.'
          : '일지가 안정적으로 붙는 해라 사람과의 인연이 오래가고, 약속이 지켜집니다. 새로운 만남보다 기존의 인연을 깊게 하는 것이 유리합니다.');
    } else {
      t += '일지와 특별한 충·합이 없어 담백하게 지나가는 해입니다. 큰 변화보다 꾸준한 준비가 결실을 만듭니다.';
    }
    t += ' 같은 해라도 흐름을 타는 달과 그렇지 않은 달이 있으니, 큰 결정은 제8장의 달력을 함께 보시면 좋습니다.';
    return t;
  }

  function seunBrief(calc, s) {
    var t = '';
    if (s.relDay.indexOf('충(沖)') >= 0) t += '일지가 흔들리는 해로 이동·변동이 잦습니다. ';
    if (s.relDay.indexOf('육합') >= 0) t += '일지와 합을 이뤄 인연과 협력이 좋습니다. ';
    if (s.ganSipsin === '정관' || s.ganSipsin === '정재') t += '안정과 신뢰가 힘을 발휘하는 해, 계약과 자리를 굳히기 좋습니다.';
    else if (s.ganSipsin === '편관') t += '압박과 책임이 커지는 해, 무리한 확장보다 버티는 것이 이득입니다.';
    else if (s.ganSipsin === '편재' || s.ganSipsin === '정재') t += '돈이 오가는 해, 벌이보다 관리가 성패를 가릅니다.';
    else if (s.ganSipsin === '식신' || s.ganSipsin === '상관') t += '재능과 표현이 살아나는 해, 만들고 알리는 일이 결실을 냅니다.';
    else if (s.ganSipsin === '비견' || s.ganSipsin === '겁재') t += '내 힘으로 서는 해, 동업과 지출은 문서로 남기세요.';
    else if (s.ganSipsin === '정인' || s.ganSipsin === '편인') t += '배움과 귀인이 오는 해, 공부와 자격에 투자하면 남습니다.';
    return t || '담백하게 지나가는 해, 꾸준함이 답입니다.';
  }

  function childChapter(b, calc, il) {
    var my = calc.elements.myElem;
    var study = {
      wood: '나무 기운이 중심인 아이는 <b>스스로 목표를 세울 때</b> 가장 잘 배웁니다. 강요하면 줄기가 굽지만, 스스로 정한 목표에는 놀랄 만큼 집중합니다.',
      fire: '불 기운이 중심인 아이는 <b>재미와 경쟁</b>이 있어야 움직입니다. 짧고 굵게, 시간을 정해 몰입하는 방식이 효과적입니다.',
      earth: '흙 기운이 중심인 아이는 <b>반복과 안정</b>에서 힘을 냅니다. 매일 같은 시간에 조금씩 쌓는 방식이 가장 잘 맞습니다.',
      metal: '쇠 기운이 중심인 아이는 <b>정확함과 규칙</b>에서 만족을 느낍니다. 원리를 이해하면 오래 기억합니다.',
      water: '물 기운이 중심인 아이는 <b>궁금증과 탐구</b>가 원동력입니다. 왜 그런지 스스로 파고들 때 가장 깊이 배웁니다.'
    };
    var method = {
      wood: ['읽고 정리하기, 노트 필기, 주제 하나를 깊게 파기', '결과를 자주 확인하지 않으면 흐지부지되기 쉬움'],
      fire: ['짧은 시간 집중, 퀴즈·발표·토론, 경쟁 요소 넣기', '흥미가 식으면 시작 자체를 미룸'],
      earth: ['매일 같은 시간·같은 분량, 반복 학습, 오답 노트', '급하게 몰아붙이면 속도가 급격히 떨어짐'],
      metal: ['원리 이해 후 문제 풀이, 규칙 세우기, 스스로 채점', '완벽하지 않으면 시작을 미루는 경향'],
      water: ['궁금한 것을 스스로 찾아보게 두기, 독서·탐구', '시작이 느리고 생각이 길어져 마무리가 밀림']
    };
    var talent = {
      wood: '교육·기획·글쓰기·식물·환경처럼 <b>키우고 세우는 일</b>',
      fire: '방송·발표·디자인·요리·마케팅처럼 <b>드러내고 열기를 쓰는 일</b>',
      earth: '부동산·유통·요리·돌봄·건축처럼 <b>쌓고 품는 일</b>',
      metal: '기술·금융·법·의료기기·정밀 제작처럼 <b>정확함이 무기인 일</b>',
      water: '연구·상담·IT·무역·기획처럼 <b>흐름을 읽고 연결하는 일</b>'
    };
    b.para('아이의 사주는 ' + calc.ilju + '일주, ' + il.title + '의 기운을 타고났습니다. ' + il.essence);
    b.section('아이의 학습 유형 — ' + ELEM_KR[my]);
    b.para(study[my]);
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>잘 맞는 방식</th><td>' + method[my][0] + '</td></tr>' +
      '<tr><th>조심할 것</th><td>' + method[my][1] + '</td></tr>' +
      '<tr><th>공부 환경</th><td>' + (calc.isCold ? '따뜻하고 밝은 자리, 창가보다 안쪽의 조용한 책상' : (calc.isHot ? '서늘하고 환기되는 자리, 물을 곁에 두기' : '정돈된 자기 자리, 소음이 적은 공간')) + '</td></tr>' +
      '</tbody></table>');
    b.section('재능의 방향');
    b.para(talent[my] + ' 쪽에서 아이의 강점이 편하게 드러납니다. 이 분야로 못 박기보다, 아이가 힘들이지 않고 오래 집중하는 순간을 관찰해 보세요. 그것이 사주가 가리키는 방향입니다.');
    b.section('진로 적성 후보');
    var g = calc.sipsinCounts;
    var bySipsin = g['식상'] >= 2 ? '만들고 표현하는 일(콘텐츠·요리·디자인·발표)'
      : (g['재성'] >= 2 ? '사람과 돈을 다루는 일(영업·유통·경영)'
        : (g['관성'] >= 2 ? '조직과 규칙 안에서 인정받는 일(공직·전문직·관리)'
          : (g['인성'] >= 2 ? '배우고 가르치는 일(연구·교육·상담)' : '현장에서 손으로 익히는 일(기술·제작)')));
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>1순위</th><td>' + talent[my] + '</td></tr>' +
      '<tr><th>2순위</th><td>' + bySipsin + ' — 사주의 십성 구조가 가리키는 방향입니다.</td></tr>' +
      '<tr><th>3순위</th><td>' + (calc.elements.zero.length ? BOOST[calc.elements.zero[0]].job + ' — 비어 있는 ' + ELEM_KR[calc.elements.zero[0]] + ' 기운을 채워주는 분야입니다.' : BOOST[calc.elements.motherElem].job + ' — 나를 살리는 기운의 분야입니다.') + '</td></tr>' +
      '</tbody></table>');
    b.para('세 후보 중 아이가 스스로 오래 붙잡고 있는 것을 보세요. 사주가 알려주는 것은 "이 길만 맞다"가 아니라 "이 결에서 힘이 덜 든다"입니다.', 'small');

    b.section('훈육 — 이 기질을 문제로 보지 않기');
    b.para(il.shadow + ' 이 기질을 문제로 보지 말고, 그 아래 있는 마음을 먼저 읽어주세요. 아이는 혼날 때보다 이해받았다고 느낄 때 훨씬 빨리 바뀝니다.');
    var cur = calc.daeun.list.filter(function (d) { return d.current; })[0] || calc.daeun.list[0];
    b.section('입시·시험 시기');
    b.para('중요한 시험은 대운과 세운이 받쳐주는 해에 두는 것이 좋습니다. 지금은 <b>' + cur.startAge + '~' + cur.endAge + '세, ' + cur.gan + cur.ji + '(' + cur.ganSipsin + ')</b> 대운입니다. ' +
      (cur.ganSipsin === '정관' || cur.ganSipsin === '정인' || cur.ganSipsin === '편인'
        ? '배움과 규율이 힘을 받는 흐름이라, 이 시기에 기초를 단단히 잡아두면 오래 갑니다.'
        : '학습 리듬을 스스로 만드는 것이 관건인 흐름입니다. 시험이 몰린 해에는 무리한 과외보다 수면과 체력을 먼저 챙기세요.'));
    b.para('아이의 사주에서 ' + (calc.elements.zero.length ? ELEM_KR[calc.elements.zero[0]] + ' 기운이 비어 있다는 점' : '오행이 비교적 고르다는 점') + '도 기억해 두세요. ' +
      (calc.elements.zero.length ? '그 기운에 해당하는 활동(' + BOOST[calc.elements.zero[0]].act + ')을 주 2~3회 함께 해주면 학습 집중도가 달라집니다.' : '특정 과목에 치우치지 않게 균형 있게 다루면 아이의 강점이 더 선명해집니다.'), 'small');
  }

  function coupleChapter(b, calc) {
    var dJiSip = calc.sipsin.day.ji;
    var love = calc.scores.love;
    var marr = calc.scores.marriage;
    var spouseElem = global.SajuEngine.ELEM_OF_JI[calc.ilji];
    var spouseTrait = {
      wood: '배우자 자리에 나무의 기운이 있어, 곧고 성실하며 자기 기준이 뚜렷한 사람과 인연이 깊습니다. 다만 서로의 방식을 존중하지 않으면 자존심 대결이 됩니다.',
      fire: '배우자 자리에 불의 기운이 있어, 밝고 표현이 분명한 사람에게 끌립니다. 관계가 뜨거운 만큼 식는 속도도 빠르니, 일상을 함께 만드는 노력이 필요합니다.',
      earth: '배우자 자리에 흙의 기운이 있어, 듬직하고 생활을 챙기는 사람과 인연이 깊습니다. 안정적이지만 변화를 싫어하는 점이 답답하게 느껴질 수 있습니다.',
      metal: '배우자 자리에 쇠의 기운이 있어, 단정하고 원칙이 분명한 사람에게 끌립니다. 서로의 기준이 부딪히면 말이 날카로워지니 표현을 다스려야 합니다.',
      water: '배우자 자리에 물의 기운이 있어, 생각이 깊고 감정이 섬세한 사람과 인연이 깊습니다. 조용한 만큼 속을 알기 어려워 오해가 쌓이기 쉽습니다.'
    }[spouseElem];

    b.para('이 사주의 배우자 자리(일지)에는 <b>' + dJiSip + '</b>이 앉아 있습니다. ' + (SIPSIN[dJiSip] ? SIPSIN[dJiSip].line : ''));
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>연애·인기</th><td><b>' + love + '점</b> — ' + (love >= 70 ? '사람을 끄는 힘이 좋아 만남이 자연스럽게 이어집니다.' : '감정을 드러내는 데 시간이 걸리는 편입니다. 먼저 한 번 표현하는 것이 관계의 속도를 바꿉니다.') + '</td></tr>' +
      '<tr><th>결혼·배우자</th><td><b>' + marr + '점</b> — ' + (marr >= 65 ? '배우자 자리가 안정적이라 오래 가는 인연에 강합니다.' : '같은 문제로 반복해서 부딪히기 쉬우니, 다툼이 생기면 하루를 두고 이야기하세요.') + '</td></tr>' +
      '<tr><th>배우자상</th><td>' + spouseTrait + '</td></tr>' +
      '</tbody></table>');

    b.section('궁합의 조건');
    b.para('이 사주는 ' + (calc.elements.zero.length ? ELEM_KR[calc.elements.zero[0]] + ' 기운이 비어 있어, 그 기운을 가진 사람과 만날 때 편안함을 느낍니다' : '오행이 비교적 고른 편이라, 상대의 부족한 기운을 채워주는 관계에서 오래 갑니다') +
      '. 반대로 ' + (calc.elements.over.length ? ELEM_KR[calc.elements.over[0]] + ' 기운이 과한 상대' : '나와 같은 기운만 가득한 상대') + '와는 처음엔 끌리지만 시간이 지나면 부딪힙니다.');

    b.section('반복되는 갈등과 해법');
    var g = calc.sipsinCounts;
    var patterns = [];
    if (g['비겁'] >= 3) patterns.push(['주도권 다툼', '둘 다 물러서지 않아 사소한 일이 자존심 싸움이 됩니다. 결정권을 영역으로 나누면 크게 줄어듭니다.']);
    if (g['식상'] >= 3) patterns.push(['말이 앞서는 싸움', '감정이 올라오면 말이 먼저 나갑니다. 화가 나면 10분을 멈추는 규칙 하나로 절반이 해결됩니다.']);
    if (g['관성'] >= 3) patterns.push(['기대와 압박', '상대에게 기준을 많이 두게 됩니다. 기준을 말로 미리 알려주지 않으면 상대는 평가받는다고 느낍니다.']);
    if (g['인성'] >= 3) patterns.push(['말하지 않는 서운함', '혼자 정리하려다 상대는 영문을 모릅니다. 서운함을 그 자리에서 한 문장으로 말하는 연습이 필요합니다.']);
    if (!patterns.length) patterns.push(['무던함이 만드는 거리', '크게 싸우지 않는 대신 마음이 먼저 멀어질 수 있습니다. 한 달에 한 번은 진짜 속마음을 나누는 시간을 두세요.']);
    b.block('<table class="mini-table wide"><tbody>' + patterns.map(function (p2) {
      return '<tr><th>' + p2[0] + '</th><td>' + p2[1] + '</td></tr>';
    }).join('') + '</tbody></table>');

    b.section('끌리는 사람과 오래 가는 사람은 다릅니다');
    var attr = calc.elements.over.length ? ELEM_KR[calc.elements.over[0]] : ELEM_KR[my2(calc)];
    var keep = calc.elements.zero.length ? ELEM_KR[calc.elements.zero[0]] : ELEM_KR[calc.elements.motherElem];
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>끌리는 사람</th><td>' + attr + ' 기운이 강한 사람. 처음에 강하게 끌리지만, 둘 다 같은 방식으로 밀어붙여 오래 부딪히기 쉽습니다.</td></tr>' +
      '<tr><th>오래 가는 사람</th><td>' + keep + ' 기운을 가진 사람. 내게 없는 것을 채워주어 함께 있을 때 덜 지칩니다.</td></tr>' +
      '</tbody></table>');

    b.section('관계의 세 국면');
    b.para(relationStages(calc));

    var curD = calc.daeun.list.filter(function (d) { return d.current; })[0];
    if (curD) {
      b.section('지금 대운의 관계 흐름 — ' + curD.gan + curD.ji + '(' + curD.ganSipsin + ')');
      b.para('지금은 <b>' + curD.startAge + '~' + curD.endAge + '세</b> 대운입니다. ' + daeunRelation(calc, curD) +
        ' 이 흐름이 ' + curD.startYear + '년부터 ' + curD.endYear + '년까지 이어집니다.');
    }


    b.section('2인 궁합을 정확히 보려면');
    b.para('궁합은 두 사람의 일지 관계(합·충)와 오행의 보완을 함께 봐야 정확합니다. 이 책에는 ' + (calc.input.name || '본인') + ' 님의 사주만 담겨 있어 상대방의 생년월일시가 있어야 합·충을 계산할 수 있습니다. 카카오톡 1:1 상담실에 <b>결제번호와 상대방 생년월일시</b>를 남겨주시면 궁합 장을 추가로 제작해 드립니다.', 'small');
  }

  function lifeChapter(b, calc) {
    var list = calc.daeun.list;
    var cur = list.filter(function (d) { return d.current; })[0];
    b.para('평생의 판은 네 번의 큰 계절로 나뉩니다. 지금 어느 계절에 서 있는지 알면, 무엇을 준비하고 무엇을 내려놓아야 하는지가 분명해집니다.');
    var quarters = [
      { name: '초년', idx: 0, task: '환경을 흡수하고 기질의 뿌리를 만드는 시기' },
      { name: '청년', idx: 2, task: '실력을 쌓고 사회에서 내 자리를 찾는 시기' },
      { name: '중년', idx: 4, task: '판을 키우고 지키는 시기. 건강과 관계의 기반이 드러납니다' },
      { name: '말년', idx: 6, task: '쌓은 것을 나누고 정리하는 시기' }
    ];
    b.block('<table class="grid-table"><thead><tr><th>국면</th><th>나이</th><th>대운</th><th>과제</th></tr></thead><tbody>' +
      quarters.map(function (q) {
        var a = list[q.idx], c = list[q.idx + 1];
        if (!a) return '';
        var cls = (cur && (a === cur || c === cur)) ? ' class="cur"' : '';
        return '<tr' + cls + '><td>' + q.name + '</td><td class="small">' + a.startAge + '~' + (c ? c.startAge - 1 : a.endAge) + '세</td>' +
          '<td class="hanja-sm">' + a.gan + a.ji + (c ? ' · ' + c.gan + c.ji : '') + '</td><td class="small">' + q.task + '</td></tr>';
      }).join('') + '</tbody></table>');

    quarters.forEach(function (q) {
      var a = list[q.idx], c = list[q.idx + 1];
      if (!a) return;
      b.section(q.name + ' — ' + a.startYear + '년부터');
      b.para('<b>' + a.gan + a.ji + '(' + a.ganSipsin + ')</b> ' + (c ? '· <b>' + c.gan + c.ji + '(' + c.ganSipsin + ')</b> ' : '') + '의 흐름입니다. ' + shortDaeun(a.ganSipsin) + ' ' + shortDaeun(c ? c.ganSipsin : ''));
    });

    if (cur) {
      b.section('지금 서 있는 자리');
      b.para('지금은 <b>' + cur.startAge + '~' + cur.endAge + '세, ' + cur.gan + cur.ji + ' 대운</b>에 있습니다. ' + shortDaeun(cur.ganSipsin) +
        ' 이 10년이 끝나기 전에 다음 계절의 씨앗을 심어두는 것이 평생 운을 크게 바꿉니다.');
    }
    b.section('다음 계절을 준비하는 세 가지');
    var ni = cur ? list.indexOf(cur) + 1 : 0;
    var nextD = list[ni];
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>1. 실력</th><td>' + (nextD && (nextD.ganSipsin === '정관' || nextD.ganSipsin === '편관') ? '다음 대운은 책임과 자리가 커지는 흐름입니다. 자격·경력처럼 증명되는 실력을 지금 쌓아두세요.' : '다음 대운에 쓸 기술 하나를 지금부터 다듬어 두면, 판이 바뀔 때 바로 꺼내 쓸 수 있습니다.') + '</td></tr>' +
      '<tr><th>2. 몸</th><td>' + (calc.scores.health < 55 ? '건강 점수가 낮은 편입니다. 수면 시간을 먼저 고정하고, 연 1회 검진 일정을 미리 잡아두세요.' : '체력이 받쳐주는 편이지만, 대운이 바뀌는 해에는 무리하게 벌이지 않는 것이 좋습니다.') + '</td></tr>' +
      '<tr><th>3. 사람</th><td>' + (calc.elements.zero.length ? ELEM_KR[calc.elements.zero[0]] + ' 기운을 가진 사람과의 인연이 오래 남습니다. 그런 사람과의 관계를 지금 넓혀두세요.' : '지금 곁에 있는 사람 중 한두 명을 깊게 만드는 것이 새 인연 열 명보다 낫습니다.') + '</td></tr>' +
      '</tbody></table>');
    b.para('대운의 나이는 한국식 나이 기준이며, 출생 시각과 절기 경계에 따라 1~2년 차이가 날 수 있습니다.', 'small');
  }

  function my2(calc) {
    return calc.elements.myElem;
  }

  function relationStages(calc) {
    var g = (SIPSIN[calc.sipsin.day.ji] || {}).g || '비겁';
    var map = {
      '비겁': '만남이 빠르고 관계의 주도권을 잡으려는 마음이 강합니다. 유지 단계에서는 서로의 영역을 나누는 것이 관건이고, 정리할 때는 미련이 오래 남습니다. 결론을 서두르지 말고 한 달을 두고 보세요.',
      '식상': '재미와 표현으로 시작해 관계가 자연스럽게 이어집니다. 다만 권태가 오면 말수가 줄고, 그때 상대를 가장 외롭게 만듭니다. 정리는 비교적 깔끔한 편입니다.',
      '재성': '처음부터 현실 조건을 봅니다. 가치관과 생활 리듬이 맞으면 오래 가고, 돈 문제가 드러나는 순간 관계의 온도가 급격히 빠집니다.',
      '관성': '신중하게 시작하지만, 한번 정하면 책임을 끝까지 집니다. 기대가 커져 상대를 평가하게 되는 것이 유일한 위험입니다.',
      '인성': '관찰이 길고 시작이 느립니다. 한번 마음을 열면 정서적으로 깊게 연결되지만, 서운함을 말하지 않아 조용히 멀어지는 방식으로 끝나기 쉽습니다.'
    };
    return map[g];
  }

  function daeunRelation(calc, d) {
    var map = {
      '정관': '관계에서 책임과 자리가 중요해집니다. 결혼·동거처럼 관계를 제도로 굳히는 결정이 자연스럽게 나오는 시기입니다.',
      '편관': '관계가 시험대에 오릅니다. 견디면 단단해지고, 회피하면 같은 문제가 반복됩니다.',
      '정재': '생활과 돈이 관계의 중심에 놓입니다. 함께 사는 현실이 곧 시험대가 됩니다.',
      '편재': '만남의 폭이 넓어지고 사람을 많이 만나는 시기입니다. 다만 선택의 기준을 비워두면 피로만 남습니다.',
      '식신': '표현과 즐거움이 살아나 만남이 자연스럽습니다. 편안함이 관계의 힘이 됩니다.',
      '상관': '감정 표현이 거칠어질 수 있는 시기입니다. 말이 앞서 상처를 주지 않도록 한 박자 늦추세요.',
      '비견': '경쟁과 주도권이 부딪히기 쉽습니다. 상대와의 역할을 나누면 크게 줄어듭니다.',
      '겁재': '지출과 갈등의 통로가 함께 열립니다. 돈이 오가는 일은 문서로 남기세요.',
      '정인': '정서적 안정과 가족의 도움이 있는 시기입니다. 다만 생각이 많아 표현이 줄면 상대는 서운해합니다.',
      '편인': '뜻밖의 인연이 찾아오는 시기입니다. 다만 마음이 견고해 다른 사람을 밀어낼 수 있습니다.'
    };
    var t = map[d.ganSipsin] || '';
    if (t) var t2 = map[d.jiSipsin] || '';
    if (!t) t = '관계의 흐름이 크게 흔들리지 않는 시기입니다.';
    if (t2 && t2 !== t) t += ' 지지의 ' + d.jiSipsin + ' 기운이 더해져 ' + t2;
    return t;
  }

  function shortDaeun(sipsin) {
    if (!sipsin) return '';
    var t = DAEUN_TEXT[sipsin] || '';
    return t.split('. ')[0] + '.';
  }

  function cautionPeriods(calc) {
    var out = [];
    var clashSeun = calc.seun.filter(function (s) { return s.relDay.indexOf('충(沖)') >= 0; });
    if (clashSeun.length) {
      out.push('<b>일지가 흔들리는 해 — ' + clashSeun.map(function (s) { return s.year + '년'; }).join(', ') + '</b><br>이 해에는 이사·이직·이별처럼 판이 바뀌는 일이 생기기 쉽습니다. 변동을 피하기보다, 감정이 앞선 상태에서 결정하지 않는 것이 핵심입니다.');
    }
    var weakDaeun = calc.daeun.list.filter(function (d) { return d.ganSipsin === '편관' || d.jiSipsin === '편관'; });
    if (weakDaeun.length) {
      out.push('<b>압박이 커지는 대운 — ' + weakDaeun.map(function (d) { return d.startAge + '세(' + d.gan + d.ji + ')'; }).join(', ') + '</b><br>책임과 압박이 몸보다 먼저 커지는 시기입니다. 이때는 버티는 것만으로도 성과입니다. 잠과 검진을 일정에 먼저 넣어두세요.');
    }
    if (calc.elements.over.length) {
      out.push('<b>' + calc.elements.over.map(function (e) { return ELEM_KR[e]; }).join('·') + ' 기운이 과한 해</b><br>그 기운이 들어오는 해(제7장 세운 표 참고)에는 같은 문제가 반복됩니다. 그해에는 새로 벌이지 말고 이미 벌인 일을 정리하는 데 집중하세요.');
    }
    if (!out.length) {
      out.push('두드러진 흉살이 겹치는 해는 없습니다. 다만 ' + calc.gongmang + ' 공망이 들어오는 해에는 큰 결정을 한 박자 늦추시면 좋습니다.');
    }
    return out;
  }

  function guiinText(calc) {
    var t = '이 사주의 천을귀인은 <b>' + calc.guiin + '</b>입니다. 천을귀인은 어려울 때 사람이 나타나 길을 열어주는 가장 힘 큰 길신입니다. ';
    var guiinPos = calc.pillars.filter(function (p) { return p.sinsal.indexOf('천을귀인') >= 0; });
    if (guiinPos.length) {
      t += '특히 <b>' + guiinPos.map(function (p) { return p.pos + '주'; }).join('·') + '</b>에 자리하고 있어, ' +
        (guiinPos.some(function (p) { return p.pos === '월'; }) ? '직장·사회에서 만나는 윗사람과 동료가 귀인이 됩니다. ' : '') +
        (guiinPos.some(function (p) { return p.pos === '일'; }) ? '배우자나 가장 가까운 사람이 결정적인 도움을 줍니다. ' : '') +
        (guiinPos.some(function (p) { return p.pos === '년'; }) ? '집안 어른이나 오래된 인연이 힘이 됩니다. ' : '') +
        (guiinPos.some(function (p) { return p.pos === '시'; }) ? '후배·자녀 세대에서 뜻밖의 도움이 옵니다. ' : '');
    } else {
      t += '천을귀인이 사주 안에 직접 앉아 있지는 않지만, 세운·대운에서 천을귀인이 들어오는 해에 큰 도움을 받습니다. ';
    }
    var helpers = calc.pillars.filter(function (p) { return p.sinsal.indexOf('천덕귀인') >= 0 || p.sinsal.indexOf('월덕귀인') >= 0 || p.sinsal.indexOf('문창귀인') >= 0; });
    if (helpers.length) {
      t += '또 <b>' + helpers.map(function (p) { return p.pos + '주'; }).join('·') + '</b>에 덕을 베푸는 길신이 함께 있어, 사람을 살린 일이 결국 나에게 돌아옵니다. ';
    }
    t += '\n\n귀인은 찾아가야 만납니다. 도움을 청하는 일을 미루지 마세요. 이 사주는 혼자 해결하려는 힘이 강해 귀인이 와도 지나치는 경우가 많습니다.';
    return t;
  }

  function relationAdvice(calc) {
    var g = calc.sipsinCounts;
    var t = '';
    if (g['비겁'] >= 3) t += '비겁이 강해 사람에게 잘 베풀지만, 그만큼 실망도 큽니다. 돈이 오가는 관계는 문서로 남기세요. ';
    if (g['식상'] >= 3) t += '말과 표현이 앞서 오해를 사기 쉽습니다. 중요한 대화는 한 번 더 확인하고 마무리하세요. ';
    if (g['관성'] >= 3) t += '남의 기준에 맞추다 지칩니다. 한 달에 한 번은 거절하는 연습을 하세요. ';
    if (g['인성'] >= 3) t += '생각이 많아 표현이 늦습니다. 느낌을 그 자리에서 한 문장으로 말하는 것이 관계를 살립니다. ';
    if (g['재성'] >= 3) t += '사람을 볼 때 실속을 먼저 계산하게 됩니다. 그 계산이 틀리지는 않지만, 표현하지 않으면 차갑게 보입니다. ';
    if (!t) t = '오행과 십성이 비교적 고른 편이라 관계에서 큰 굴곡은 적습니다. 다만 편안함에 기대어 표현을 아끼면 상대는 서운함을 쌓습니다.';
    return t + ' 이 사주에서 관계의 핵심은 <b>받는 연습</b>입니다. 베푸는 데는 익숙하지만 받는 데는 어색한 구조이니, 도움을 받으면 바로 갚으려 하지 말고 고맙다고 말해 두세요.';
  }

  function moneyAdvice(calc) {
    var s = calc.scores.money;
    var t = '';
    if (calc.sipsinCounts['재성'] >= 3) {
      t += '재성이 많아 돈이 오가는 일이 잦습니다. 문제는 들어오는 양이 아니라 <b>나가는 통로</b>입니다. 고정지출을 먼저 정리하고, 남는 돈은 손대기 어려운 곳(적금·연금)에 두세요. ';
    } else if (calc.sipsinCounts['재성'] === 0) {
      t += '재성이 비어 있어 돈이 눈에 잘 보이지 않는 구조입니다. 월급만으로는 결실이 얇으니, <b>기술·자격·콘텐츠</b>처럼 반복해서 팔리는 것을 하나 만드는 것이 답입니다. ';
    } else {
      t += '재성이 한두 개로 알맞게 자리해, 성실하게 모으면 쌓이는 구조입니다. 급한 투자보다 꾸준한 적립이 훨씬 유리합니다. ';
    }
    t += s >= 70 ? '재물 점수가 높은 편이니, 지금의 저축 습관을 그대로 유지하면 5년 뒤 차이가 크게 벌어집니다.'
      : (s >= 50 ? '재물 점수는 보통입니다. 수입의 10%를 먼저 떼어두는 규칙 하나면 충분합니다.'
        : '재물 점수가 낮은 편입니다. 큰 지출은 3일을 두고 결정하고, 보증·동업·지인 대출은 정중히 거절하세요.');
    return t;
  }

  function practicePlan(calc) {
    var e = (calc.elements.zero[0] || calc.elements.missing[0] || calc.elements.motherElem);
    var bo = BOOST[e];
    var low = SCORE_DEF.slice().sort(function (a, b) { return calc.scores[a.key] - calc.scores[b.key]; })[0];
    return [
      bo.habit + ' — 하루 10분이면 되는 것부터.',
      low.name + ' 보완 — ' + low.bad.replace(/^[^.]+\.\s*/, '') + ' 한 가지만 골라 실천.',
      ELEM_KR[e] + ' 기운이 실린 달(제8장 참고)에 미뤄둔 결단 하나를 실행.'
    ];
  }

  function closingLetter(calc, il) {
    return '사주를 본다는 것은 내게 없는 것을 한탄하는 일이 아닙니다. ' + calc.ilju + '일주, ' + il.title + '의 기운을 타고난 ' +
      (calc.input.name || '당신') + ' 님에게는 이미 ' + il.strength.split('.')[0] + '이라는 재료가 있습니다. ' +
      '이 책에서 확인한 부족한 기운과 조심할 시기는, 그 재료를 어디에 쓸지 알려주는 지도일 뿐입니다.\n\n' +
      '운은 하루아침에 뒤집히지 않습니다. 다만 같은 자리에서 같은 선택을 반복하느냐, 한 번만 다르게 선택하느냐가 10년 뒤를 가릅니다. ' +
      '이 책의 마지막 장에 적어둔 세 가지 중 하나만 이번 주에 해보시면, 그 한 번이 다음 계절의 씨앗이 됩니다.\n\n' +
      '어려운 시기가 오면 이 책을 다시 펼쳐 제6장의 대운과 제9장의 조심할 시기를 보세요. 계절은 반드시 바뀝니다. ' +
      '그때까지 몸과 마음을 잘 챙기시길 바랍니다.';
  }

  global.SajuBook = {
    build: build,
    finish: finish,
    escape: esc,
    birthLabel: birthLabel,
    hourLabel: hourLabel
  };
})(typeof window !== 'undefined' ? window : this);
