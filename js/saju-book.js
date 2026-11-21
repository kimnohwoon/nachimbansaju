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
        esc(this.headName || (this.calc.input.name ? this.calc.input.name + ' 님' : '')) + '</span>';
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

  Book.prototype.chapter = function (num, title, sub, unit) {
    return this.block((num ? '<div class="ch-num">제 ' + num + ' ' + (unit || '장') + '</div>' : '') +
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
    var order = orderIn || {};
    // 39,900원 '2인 사주 & 평생 궁합 완전판': 상대방 사주가 함께 넘어오면 2인 책으로 분기한다.
    if (order.partnerCalc && order.partnerCalc.ok !== false && order.partnerCalc.pillars) {
      return buildCouple(calc, order);
    }
    var b = new Book(calc, orderIn);
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
    b.para('<b>파일 오류 시</b> — 파일이 열리지 않거나 내용이 누락된 경우, 결제일로부터 30일 안에 같은 주문 페이지에서 다시 내려받으실 수 있습니다. 그래도 열리지 않으면 카카오톡 1:1 상담실에 <b>결제번호 ' + esc(order.paymentId || '-') + '</b>를 남겨주세요.');
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


    b.para('궁합은 두 사람의 일지 관계(합·충)와 오행의 보완을 함께 봐야 정확합니다. 이 장은 입력하신 ' + (calc.input.name || '본인') + ' 님의 사주를 기준으로, 어떤 사람에게 끌리고 누구와 오래 가는지, 어디서 부딪히는지를 담았습니다.', 'small');
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

  // ══════════════════════════════════════════════════════════════
  //  2인 궁합 책 (39,900원 '2인 사주 & 평생 궁합 완전판')
  //  - 두 사람의 원국을 각각 계산한 결과(SajuEngine.compute)를 받아
  //    오행 보완·일간/일지 합충형파해·세운 교차·화해 날짜를 실제로 계산해
  //    상품 목차(제1부~제7부)와 같은 순서로 책을 만든다.
  // ══════════════════════════════════════════════════════════════
  var NEXT_ELEM = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' };
  var CTRL_ELEM = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };

  function elemRelOf(a, b) {
    if (!a || !b) return '';
    if (a === b) return 'same';
    if (NEXT_ELEM[a] === b) return 'a2b';       // 내 기운이 상대를 살림
    if (NEXT_ELEM[b] === a) return 'b2a';       // 상대 기운이 나를 살림
    if (CTRL_ELEM[a] === b) return 'aWin';      // 내 기운이 상대를 누름
    return 'bWin';
  }

  function hasKw(list, kw) {
    return !!list && list.some(function (x) { return String(x).indexOf(kw) >= 0; });
  }

  function clampScore(v, lo, hi) {
    return Math.max(lo || 25, Math.min(hi || 97, Math.round(v)));
  }

  var SPOUSE_TRAIT = {
    wood: '배우자 자리에 나무의 기운이 있어, 곧고 성실하며 자기 기준이 뚜렷한 사람과 인연이 깊습니다. 서로의 방식을 존중하지 않으면 자존심 대결이 됩니다.',
    fire: '배우자 자리에 불의 기운이 있어, 밝고 표현이 분명한 사람에게 끌립니다. 관계가 뜨거운 만큼 식는 속도도 빠르니 일상을 함께 만드는 노력이 필요합니다.',
    earth: '배우자 자리에 흙의 기운이 있어, 듬직하고 생활을 챙기는 사람과 인연이 깊습니다. 안정적이지만 변화를 싫어하는 점이 답답하게 느껴질 수 있습니다.',
    metal: '배우자 자리에 쇠의 기운이 있어, 단정하고 원칙이 분명한 사람에게 끌립니다. 서로의 기준이 부딪히면 말이 날카로워지니 표현을 다스려야 합니다.',
    water: '배우자 자리에 물의 기운이 있어, 생각이 깊고 감정이 섬세한 사람과 인연이 깊습니다. 조용한 만큼 속을 알기 어려워 오해가 쌓이기 쉽습니다.'
  };

  // A(나)의 일간이 B(상대)의 일간을 어떤 십성으로 보는가 → 관계의 태도
  var SIPSIN_TO_PARTNER = {
    '비견': '동지이자 경쟁자로 봅니다. 말이 통하고 편안하지만, 결정 앞에서는 서로 양보하지 않습니다.',
    '겁재': '강하게 끌리면서도 주도권을 빼앗길까 경계합니다. 함께 있으면 속도가 붙지만 지출도 함께 늘어납니다.',
    '식신': '편안하게 돌봐주고 싶은 사람으로 봅니다. 함께 있으면 말이 많아지고 생활이 느슨해지기 쉽습니다.',
    '상관': '내가 키워낸 결과물처럼 느껴 자랑하고 싶고, 동시에 잔소리가 늘어납니다. 애정이 간섭으로 보이기 쉬운 자리입니다.',
    '편재': '바깥에서 만난 인연처럼 설레고 챙겨주고 싶은 마음이 큽니다. 다만 구속받는 것을 싫어합니다.',
    '정재': '내 사람, 내 살림으로 여깁니다. 책임을 지려 하고, 그 책임이 무거워지면 서운함으로 남습니다.',
    '편관': '나를 긴장시키는 사람입니다. 존경과 부담이 함께 있고, 가까워질수록 말투가 딱딱해집니다.',
    '정관': '나를 바르게 세워주는 사람으로 봅니다. 신뢰가 크고, 그만큼 기대도 커져 실망도 커집니다.',
    '편인': '나를 말 없이 알아줄 것 같은 사람으로 봅니다. 그래서 확인을 생략하고 혼자 결론을 내리기 쉽습니다.',
    '정인': '나를 감싸주는 사람으로 봅니다. 의지하고 싶어지고, 그 의지가 상대를 지치게 만듭니다.'
  };

  var REL_MEAN = {
    '육합': '육합(六合)은 서로 다른 두 기운이 하나로 묶이는 합입니다. 처음 만났을 때의 "이 사람이다" 싶은 느낌이 오래가는 자리이고, 함께 있을 때 생활의 리듬이 자연스럽게 맞물립니다. 대신 한쪽이 다른 쪽의 기운에 흡수되기 쉬워, 시간이 지나면 한 사람만 참는 구조가 될 수 있습니다.',
    '삼합': '삼합(半合)은 같은 목적을 가진 사람들이 힘을 모으는 합입니다. 취미·일·돈처럼 바깥의 목표를 함께할 때 시너지가 크고, 둘이 있으면 실제로 일이 굴러갑니다. 목표가 사라지면 관계의 온도도 함께 내려가는 것이 약점입니다.',
    '충': '충(沖)은 정면으로 마주 보는 자리입니다. 서로에게 없는 것을 정확히 건드려 강하게 끌리지만, 그 자극이 곧 부딪힘으로 바뀝니다. 이 관계의 과제는 "맞는 사람을 만나기"가 아니라 "부딪히는 방식을 정하기"입니다.',
    '형': '형(刑)은 서로의 방식을 강하게 되묻는 자리입니다. 예의·태도·말투가 자주 문제가 되고, 사소한 서운함이 오래 남습니다. 감정이 올라오기 전에 사실만 말하는 훈련이 이 자리를 눅여줍니다.',
    '파': '파(破)는 겉으로는 맞는 듯하다가 결정적인 순간에 어긋나는 자리입니다. 큰 싸움은 없는데 중요한 고비마다 타이밍이 어긋나, 서로 "운이 없다"고 느끼게 됩니다.',
    '해': '해(害)는 직접 부딪히지 않고 곁에서 서운함을 만드는 자리입니다. 가족·친구·직장처럼 두 사람 바깥의 사람이 자주 문제의 원인이 됩니다.',
    '자형': '자형(自刑)은 같은 글자가 겹쳐 스스로를 옥죄는 자리입니다. 상대를 탓하기 전에 두 사람 모두 혼자 결론을 내리고 혼자 상처받는 습관을 봐야 합니다.'
  };

  var ELEM_CLASH_PAIR = {
    wood: ['명분과 자존심 싸움', '두 사람 모두 목(木) 기운이 강해 옳고 그름을 따지는 대화가 길어집니다. 한 번 시작된 논쟁은 "누가 맞는가"로 흘러가고, 지고 나서도 마음이 남습니다.', '대화를 시작할 때 결론을 정해두지 말고, 30분이 지나면 그날은 접는 규칙을 정하세요.'],
    fire: ['감정의 온도가 먼저 오르는 집', '두 사람 모두 화(火) 기운이 강해 말이 감정보다 먼저 나갑니다. 싸움의 시작은 사소한데, 끝은 늘 상처로 남습니다.', '"지금 화가 났어"까지만 말하고 10분을 멈추는 약속 하나가 이 집의 절반을 구합니다.'],
    earth: ['걱정과 책임이 겹겹이 쌓이는 집', '두 사람 모두 토(土) 기운이 강해 서로를 위해 참는 일이 많습니다. 그 참음이 말로 나오지 않아 서운함으로 굳습니다.', '참은 일을 그날 한 문장으로 말하는 규칙이 필요합니다. "괜찮아"는 금지어로 정해두세요.'],
    metal: ['기준과 원칙이 날카로운 집', '두 사람 모두 금(金) 기운이 강해 작은 실수도 정확히 짚어냅니다. 서로가 평가받는 느낌을 받고, 말수가 줄어듭니다.', '하루에 한 번은 고칠 점 대신 고마운 점을 말하는 시간을 두세요.'],
    water: ['생각이 깊어 마음이 먼저 멀어지는 집', '두 사람 모두 수(水) 기운이 강해 싸우지 않습니다. 대신 말이 줄고 각자 정리하는 시간이 길어지며, 어느 날 갑자기 거리가 벌어져 있습니다.', '일주일에 한 번, 결론 없는 대화 30분을 정해두세요. 정리가 아니라 말을 꺼내는 시간입니다.']
  };

  var DEFICIT = {
    wood: {
      lack: '자기 계획을 세우고 밀고 나가는 뼈대',
      now: '무엇을 원하는지 먼저 꺼내지 않고, 주어진 일정과 상대의 계획에 몸을 맡깁니다. 결정을 미루는 것이 배려처럼 보이지만, 속으로는 계속 계산하고 있습니다.',
      need: '"나는 이렇게 하고 싶다"를 먼저 말해주는 사람',
      fill: '물어보는 방식이 아니라 함께 표를 그려보세요. 다음 달 계획을 같이 적고, 그가 고른 항목에 표시를 해주면 말보다 빨리 채워집니다.'
    },
    fire: {
      lack: '좋아한다는 것을 드러내는 표현과 열기',
      now: '마음이 있어도 먼저 말하지 않고, 상대가 알아주기를 기다립니다. 서운해도 "왜 몰라"로 끝나고, 정작 필요한 말은 하지 못합니다.',
      need: '자기 감정을 말로 먼저 꺼내는 사람',
      fill: '먼저 표현하고, 그가 작게라도 따라오면 크게 반응해 주세요. 표현이 안전하다는 경험이 쌓여야 그도 말을 꺼냅니다.'
    },
    earth: {
      lack: '약속과 생활을 지탱하는 기반, 안정',
      now: '흔들려도 괜찮은 척하고, 불안하다는 말을 하지 않습니다. 생활의 규칙을 먼저 요구하지 못해 늘 상대의 리듬에 맞춰 삽니다.',
      need: '정해진 시간과 반복되는 약속을 지켜주는 사람',
      fill: '거창한 이벤트보다 같은 시간의 식사·산책이 효과적입니다. 지키는 모습을 보이면 그가 처음으로 자기 요구를 꺼냅니다.'
    },
    metal: {
      lack: '끊고 마무리하는 결단',
      now: '끊어야 할 것을 끊지 못하고 미룹니다. 싫은 일도 일단 받아들이고, 관계가 상해도 정리를 못 해 오래 끌고 갑니다.',
      need: '선을 그어도 관계가 끊기지 않는다는 것을 보여주는 사람',
      fill: '"그건 어려워"라고 말해도 다음 날 평소처럼 대하는 것이 핵심입니다. 거절이 안전하다는 경험이 그의 결단을 대신 자라게 합니다.'
    },
    water: {
      lack: '쉬고 흘려보내는 유연함',
      now: '지쳐도 멈추지 못하고, 감정을 밖으로 흘리지 못해 안에 쌓습니다. 힘들다는 말 대신 갑자기 무기력해지는 방식으로 신호를 보냅니다.',
      need: '멈춰도 괜찮다고 말해주고, 실제로 쉬게 해주는 사람',
      fill: '쉬는 시간을 함께 정하고 그 시간에는 일 이야기를 꺼내지 마세요. 그가 아무것도 안 하는 날을 지켜봐 주는 것이 가장 큰 보충입니다.'
    }
  };

  function num2(n) { return Number(n).toLocaleString('ko-KR'); }

  // 받침 유무에 따라 목적격 조사를 고른다. (예: '뼈대를' / '안정을')
  function josaEul(word) {
    var s = String(word || '').trim();
    var last = s.slice(-1);
    var code = last.charCodeAt(0);
    if (!(code >= 0xAC00 && code <= 0xD7A3)) return '을(를)';
    return ((code - 0xAC00) % 28 !== 0) ? '을' : '를';
  }

  function koDate(d) {
    var wd = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일(' + wd + ')';
  }

  // ── 두 사람 관계 분석 ───────────────────────────────────────────
  function coupleAnalysis(A, B) {
    var eng = global.SajuEngine;
    var EO = ['wood', 'fire', 'earth', 'metal', 'water'];
    var r = {
      ganRel: eng.ganRelation(A.ilgan, B.ilgan),
      jiRel: eng.compatOf(A.ilji, B.ilji),
      ganElemRel: elemRelOf(eng.ELEM_OF_GAN[A.ilgan], eng.ELEM_OF_GAN[B.ilgan]),
      aSeesB: eng.getShipshin(A.ilgan, B.ilgan),
      bSeesA: eng.getShipshin(B.ilgan, A.ilgan),
      cross: [],
      byElem: []
    };

    // 일지 이외의 지지 교차 (년·월·시)
    A.pillars.forEach(function (pa) {
      if (pa.key === 'day' || !pa.ji) return;
      B.pillars.forEach(function (pb) {
        if (pb.key === 'day' || !pb.ji) return;
        var rel = eng.compatOf(pa.ji, pb.ji);
        if (!rel.length) return;
        r.cross.push({
          a: pa.pos + '주 ' + pa.ji,
          b: pb.pos + '주 ' + pb.ji,
          rel: rel,
          text: rel.join('·')
        });
      });
    });

    // 천간 교차 (일간 이외)
    r.crossGan = [];
    A.pillars.forEach(function (pa) {
      if (pa.key === 'day' || !pa.gan) return;
      B.pillars.forEach(function (pb) {
        if (pb.key === 'day' || !pb.gan) return;
        var rel = eng.ganRelation(pa.gan, pb.gan);
        if (!rel.length || rel[0] === '같은 천간') return;
        r.crossGan.push({ a: pa.pos + '간 ' + pa.gan, b: pb.pos + '간 ' + pb.gan, text: rel.join('·') });
      });
    });

    EO.forEach(function (e) {
      var a = A.counts[e] || 0;
      var b = B.counts[e] || 0;
      var state = 'ok';
      if (a === 0 && b === 0) state = 'bothZero';
      else if (a <= 1 && b >= 2) state = 'bFillsA';
      else if (b <= 1 && a >= 2) state = 'aFillsB';
      else if (a >= 3 && b >= 3) state = 'heavyOverlap';
      else if (a >= 2 && b >= 2) state = 'overlap';
      r.byElem.push({ e: e, a: a, b: b, state: state });
    });
    r.fillA = r.byElem.filter(function (x) { return x.state === 'bFillsA'; }).map(function (x) { return x.e; });   // B가 A를 채움
    r.fillB = r.byElem.filter(function (x) { return x.state === 'aFillsB'; }).map(function (x) { return x.e; });   // A가 B를 채움
    r.overlap = r.byElem.filter(function (x) { return x.state === 'overlap' || x.state === 'heavyOverlap'; }).map(function (x) { return x.e; });
    r.bothZero = r.byElem.filter(function (x) { return x.state === 'bothZero'; }).map(function (x) { return x.e; });
    r.commonMissing = EO.filter(function (e) { return (A.counts[e] || 0) <= 1 && (B.counts[e] || 0) <= 1; });

    // ── 점수 ──
    var attr = 58;
    if (hasKw(r.ganRel, '천간합')) attr += 20;
    else if (hasKw(r.ganRel, '같은 천간')) attr += 8;
    else if (r.ganElemRel === 'a2b' || r.ganElemRel === 'b2a') attr += 10;
    else if (r.ganElemRel === 'aWin' || r.ganElemRel === 'bWin') attr += 4;
    if (hasKw(r.ganRel, '천간충')) attr += 7;
    if (hasKw(r.jiRel, '육합')) attr += 16;
    if (hasKw(r.jiRel, '삼합')) attr += 10;
    if (hasKw(r.jiRel, '충')) attr += 5;
    if (hasKw(r.jiRel, '형')) attr += 2;
    if (hasKw(r.jiRel, '파')) attr -= 3;
    if (hasKw(r.jiRel, '해')) attr -= 1;
    if (['식신', '상관', '편재', '정재'].indexOf(r.aSeesB) >= 0) attr += 4;
    if (['식신', '상관', '편재', '정재'].indexOf(r.bSeesA) >= 0) attr += 4;

    var stab = 62;
    if (hasKw(r.jiRel, '충')) stab -= 16;
    if (hasKw(r.jiRel, '형')) stab -= 7;
    if (hasKw(r.jiRel, '파')) stab -= 6;
    if (hasKw(r.jiRel, '해')) stab -= 5;
    if (hasKw(r.jiRel, '육합')) stab += 14;
    if (hasKw(r.jiRel, '삼합')) stab += 8;
    var bothStrong = A.strength.supportPct >= 55 && B.strength.supportPct >= 55;
    var bothWeak = A.strength.supportPct < 45 && B.strength.supportPct < 45;
    var gap = Math.abs(A.strength.supportPct - B.strength.supportPct);
    if (bothStrong) stab -= 8;
    if (bothWeak) stab -= 4;
    if (!bothStrong && !bothWeak && gap >= 10) stab += 7;
    if (gap >= 25) stab -= 7;
    if (A.sipsinCounts['비겁'] >= 3 && B.sipsinCounts['비겁'] >= 3) stab -= 7;
    var crossChung = r.cross.filter(function (c) { return c.text.indexOf('충') >= 0; }).length;
    var crossHap = r.cross.filter(function (c) { return c.text.indexOf('합') >= 0; }).length;
    stab -= Math.min(8, crossChung * 4);
    stab += Math.min(6, crossHap * 3);

    var bal = 54;
    bal += r.fillA.length * 6 + r.fillB.length * 6;
    bal -= r.overlap.length * 5;
    bal -= r.bothZero.length * 7;
    if (A.elements.missing.indexOf(eng.ELEM_OF_GAN[B.ilgan]) >= 0) bal += 6;
    if (B.elements.missing.indexOf(eng.ELEM_OF_GAN[A.ilgan]) >= 0) bal += 6;
    if (A.elements.over.indexOf(eng.ELEM_OF_GAN[B.ilgan]) >= 0) bal -= 4;
    if (B.elements.over.indexOf(eng.ELEM_OF_GAN[A.ilgan]) >= 0) bal -= 4;

    var daily = 58;
    var jaeA = A.sipsinCounts['재성'], jaeB = B.sipsinCounts['재성'];
    daily -= Math.min(9, Math.abs(jaeA - jaeB) * 3);
    if (jaeA === 0 && jaeB === 0) daily -= 6;
    var sikA = A.sipsinCounts['식상'], sikB = B.sipsinCounts['식상'];
    var gwanA = A.sipsinCounts['관성'], gwanB = B.sipsinCounts['관성'];
    if (sikA >= 3 && sikB >= 3) daily -= 6;
    if ((sikA >= 3 && gwanB >= 3) || (sikB >= 3 && gwanA >= 3)) daily -= 6;
    if ((A.sipsinCounts['인성'] >= 3 && sikB >= 3) || (B.sipsinCounts['인성'] >= 3 && sikA >= 3)) daily += 4;
    var inA = A.sipsinCounts['인성'], inB = B.sipsinCounts['인성'];
    if (inA >= 3 && inB >= 3) daily -= 4;

    var timing = 58;
    var crossYears = yearCross(A, B);
    crossYears.forEach(function (y) {
      if (y.bad >= 2) timing -= 6;
      else if (y.good >= 2) timing += 5;
      if (y.daeunShift) timing -= 3;
    });
    [A, B].forEach(function (C, i) {
      var other = i === 0 ? B : A;
      var cur = C.daeun.list.filter(function (d) { return d.current; })[0];
      if (!cur) return;
      if (other.elements.missing.indexOf(cur.ganElem) >= 0) timing += 4;
      if (other.elements.over.indexOf(cur.jiElem) >= 0) timing -= 3;
    });

    r.score = {
      attraction: clampScore(attr, 25, 98),
      stability: clampScore(stab, 25, 96),
      balance: clampScore(bal, 20, 97),
      daily: clampScore(daily, 25, 92),
      timing: clampScore(timing, 25, 92)
    };
    r.score.total = clampScore(
      r.score.attraction * 0.24 + r.score.stability * 0.30 + r.score.balance * 0.24 +
      r.score.daily * 0.11 + r.score.timing * 0.11, 20, 97
    );
    r.verdict = verdictOf(r.score.total);
    r.yearCross = crossYears;
    return r;
  }

  function verdictOf(t) {
    if (t >= 82) return { head: '천생연분형 — 잘 맞는 것을 넘어 서로를 키우는 인연', body: '다섯 항목이 고르게 높습니다. 이 관계의 위험은 어긋남이 아니라 안심입니다. 서로가 알아서 해줄 것이라 믿고 표현을 줄이는 순간, 좋은 궁합이 조용히 식습니다.' };
    if (t >= 72) return { head: '상생형 — 노력한 만큼 정확히 돌아오는 인연', body: '끌림과 안정이 함께 있고, 부족한 곳은 서로 채워집니다. 다만 한 항목이 눈에 띄게 낮다면 그 자리가 반복되는 싸움의 통로가 됩니다. 아래 진단에서 낮은 항목을 먼저 보세요.' };
    if (t >= 62) return { head: '보완형 — 다르기에 오래 가는 인연', body: '두 사람의 기운이 겹치기보다 어긋나게 짜여 있습니다. 그래서 처음엔 서로가 낯설고, 시간이 지나면 상대에게 없는 것을 자기 것으로 만듭니다. 이해보다 합의가 빠른 커플입니다.' };
    if (t >= 52) return { head: '조율형 — 습관을 정하면 편해지는 인연', body: '끌림은 분명하지만 생활의 리듬과 감정의 속도가 다릅니다. 이 관계는 사랑의 크기보다 규칙의 수가 결과를 바꿉니다. 아래 갈등 촉발 버튼과 화해 날짜를 달력처럼 쓰세요.' };
    return { head: '거리 조절형 — 가까울수록 다치는 인연', body: '두 사람의 강한 기운이 정면에서 부딪히는 구조입니다. 관계를 끊으라는 뜻이 아니라, 간격과 규칙을 먼저 정해야 오래 갈 수 있다는 뜻입니다. 돈·생활·가족의 경계를 문서로 남기는 것이 이 궁합의 핵심입니다.' };
  }

  var SCORE_LABEL = {
    attraction: '끌림', stability: '안정', balance: '보완', daily: '생활', timing: '시기'
  };

  function yearCross(A, B) {
    var eng = global.SajuEngine;
    var out = [];
    for (var y = 2026; y <= 2031; y++) {
      var sa = A.seun.filter(function (x) { return x.year === y; })[0];
      var sb = B.seun.filter(function (x) { return x.year === y; })[0];
      if (!sa || !sb) continue;
      var ra = eng.compatOf(A.ilji, sa.ji);
      var rb = eng.compatOf(B.ilji, sb.ji);
      var ga = eng.ganRelation(A.ilgan, sa.gan);
      var gb = eng.ganRelation(B.ilgan, sb.gan);
      var bad = 0, good = 0;
      if (hasKw(ra, '충')) bad++;
      if (hasKw(rb, '충')) bad++;
      if (hasKw(ga, '천간충')) bad++;
      if (hasKw(gb, '천간충')) bad++;
      if (hasKw(ra, '육합') || hasKw(ra, '삼합')) good++;
      if (hasKw(rb, '육합') || hasKw(rb, '삼합')) good++;
      if (hasKw(ga, '천간합')) good++;
      if (hasKw(gb, '천간합')) good++;
      var shiftA = A.daeun.list.some(function (d) { return d.startYear === y; });
      var shiftB = B.daeun.list.some(function (d) { return d.startYear === y; });
      var verdict = bad >= 2 ? '양쪽 흔들' : (bad === 1 ? '한쪽 흔들' : (good >= 2 ? '관계 결속' : (good === 1 ? '완만한 해' : '평이한 해')));
      out.push({
        year: y, gan: sa.gan, ji: sa.ji,
        relA: ra.length ? ra.join('·') : '-', relB: rb.length ? rb.join('·') : '-',
        ganA: ga.length ? ga.join('·') : '-', ganB: gb.length ? gb.join('·') : '-',
        bad: bad, good: good, verdict: verdict,
        daeunShift: (shiftA || shiftB), shiftWho: shiftA && shiftB ? '두 사람 모두' : (shiftA ? A.input.name || '첫 번째 분' : (shiftB ? B.input.name || '두 번째 분' : ''))
      });
    }
    return out;
  }

  // ── 화해 날짜 계산 ─────────────────────────────────────────────
  function reconcileDates(A, B, from, span) {
    var eng = global.SajuEngine;
    var out = [];
    var base = from ? new Date(from.getFullYear(), from.getMonth(), from.getDate()) : new Date();
    var days = span || 60;
    for (var i = 1; i <= days; i++) {
      var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      var dp = eng.dayPillar(d.getFullYear(), d.getMonth() + 1, d.getDate());
      var sc = 50, plus = [], minus = [];
      [[A, 'A'], [B, 'B']].forEach(function (pair) {
        var C = pair[0];
        var rel = eng.compatOf(C.ilji, dp.ji);
        var grel = eng.ganRelation(C.ilgan, dp.gan);
        if (hasKw(rel, '육합')) { sc += 14; plus.push('일지 육합'); }
        if (hasKw(rel, '삼합')) { sc += 8; plus.push('삼합'); }
        if (hasKw(rel, '충')) { sc -= 18; minus.push('일지 충'); }
        if (hasKw(rel, '형')) { sc -= 9; minus.push('형'); }
        if (hasKw(rel, '파')) { sc -= 7; minus.push('파'); }
        if (hasKw(rel, '해')) { sc -= 4; minus.push('해'); }
        if (hasKw(grel, '천간합')) { sc += 6; plus.push('천간합'); }
        if (hasKw(grel, '천간충')) { sc -= 8; minus.push('천간충'); }
        if (C.elements.missing.indexOf(dp.jiElem) >= 0) { sc += 3; }
      });
      if (A.elements.missing.indexOf(dp.jiElem) >= 0 && B.elements.missing.indexOf(dp.jiElem) >= 0) sc += 5;
      if (A.elements.over.indexOf(dp.jiElem) >= 0 && B.elements.over.indexOf(dp.jiElem) >= 0) sc -= 4;
      out.push({ date: d, dp: dp, score: clampScore(sc, 5, 99), plus: plus, minus: minus });
    }
    return out;
  }

  function pickDates(all, n, minGap, diversify) {
    var sorted = all.slice().sort(function (a, b) { return b.score - a.score; });
    var picked = [];
    function farEnough(x) {
      return picked.every(function (p) { return Math.abs(p.date - x.date) / 86400000 >= (minGap || 5); });
    }
    if (diversify) {
      // 같은 관계(삼합만 세 개)로 몰리지 않도록 관계 종류별 최고점을 먼저 고른다.
      var seen = {};
      sorted.forEach(function (x) {
        if (picked.length >= n) return;
        var t = (x.plus && x.plus[0]) || 'none';
        if (seen[t]) return;
        if (!farEnough(x)) return;
        seen[t] = 1;
        picked.push(x);
      });
    }
    sorted.forEach(function (x) {
      if (picked.length >= n) return;
      if (picked.indexOf(x) >= 0) return;
      if (!farEnough(x)) return;
      picked.push(x);
    });
    return picked.sort(function (a, b) { return a.date - b.date; });
  }

  // ── 표 만들기 ──────────────────────────────────────────────────
  function coupleCompareTable(A, B, nA, nB) {
    var eng = global.SajuEngine;
    function p4(C) {
      return C.pillars.map(function (p) { return (p.gan || '·') + (p.ji || '·'); }).join('  ');
    }
    function elNames(list) {
      return list.length ? list.map(function (e) { return ELEM_KR[e]; }).join(', ') : '없음';
    }
    var rows = [
      ['사주 원국', p4(A), p4(B)],
      ['일주', A.ilju + ' · ' + (ILGAN[A.ilgan] || {}).title.split(' (')[0], B.ilju + ' · ' + (ILGAN[B.ilgan] || {}).title.split(' (')[0]],
      ['일간', A.ilgan + ' — ' + ELEM_KR[eng.ELEM_OF_GAN[A.ilgan]], B.ilgan + ' — ' + ELEM_KR[eng.ELEM_OF_GAN[B.ilgan]]],
      ['일지(배우자궁)', A.ilji + ' · ' + A.sipsin.day.ji, B.ilji + ' · ' + B.sipsin.day.ji],
      ['강약', A.strength.label + ' (내 편 ' + A.strength.supportPct + '%)', B.strength.label + ' (내 편 ' + B.strength.supportPct + '%)'],
      ['많은 기운', elNames(A.elements.over), elNames(B.elements.over)],
      ['비어 있는 기운', elNames(A.elements.zero), elNames(B.elements.zero)],
      ['공망', A.gongmang, B.gongmang]
    ];
    return '<table class="mini-table wide couple-table"><thead><tr><th>구분</th><th>' + esc(nA) + '</th><th>' + esc(nB) + '</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td class="row-head">' + r[0] + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>'; }).join('') +
      '</tbody></table>';
  }

  function pairElementBar(A, B) {
    var rows = '';
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(function (e) {
      var pa = A.percents[e] || 0, pb = B.percents[e] || 0;
      rows += '<div class="bar-row dual">' +
        '<div class="bar-name">' + ELEM_KR[e] + '</div>' +
        '<div class="bar-stack">' +
        '<div class="bar-track"><div class="bar-fill ' + ELEM_CLASS[e] + '" style="width:' + (pa > 0 ? Math.max(pa, 3) : 0) + '%"></div></div>' +
        '<div class="bar-track"><div class="bar-fill ' + ELEM_CLASS[e] + '" style="width:' + (pb > 0 ? Math.max(pb, 3) : 0) + '%"></div></div>' +
        '</div>' +
        '<div class="bar-val">' + A.counts[e] + ' · ' + B.counts[e] + '</div>' +
        '</div>';
    });
    return rows;
  }

  function scoreTable(r) {
    var rows = ['attraction', 'stability', 'balance', 'daily', 'timing'].map(function (k) {
      var v = r.score[k];
      return '<tr><td>' + SCORE_LABEL[k] + '</td><td class="center"><b>' + v + '</b></td><td class="score-mean">' + scoreComment(r, k) + '</td></tr>';
    }).join('');
    rows += '<tr class="cur"><td><b>종합 궁합</b></td><td class="center"><b>' + r.score.total + '</b></td><td class="score-mean">' + esc(r.verdict.head.split(' — ')[0]) + '</td></tr>';
    return '<table class="grid-table score-table2"><thead><tr><th>항목</th><th>점수</th><th>이 관계에서의 의미</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function scoreComment(r, key) {
    var v = r.score[key];
    if (key === 'attraction') {
      if (v >= 72) return '말하지 않아도 통하는 부분이 있고, 처음부터 강하게 끌리는 구조입니다.';
      if (v >= 58) return '끌림은 충분하지만 먼저 표현하는 쪽이 있어야 관계가 움직입니다.';
      return '서로에게 쉽게 끌리는 편이 아닙니다. 시간과 반복된 만남이 관계를 만듭니다.';
    }
    if (key === 'stability') {
      if (v >= 72) return '큰 마찰 없이 생활이 자리잡는 구조입니다. 안심하고 표현을 줄이지 마세요.';
      if (v >= 55) return '영역을 나누는 규칙이 있으면 오래 갑니다.';
      return '같은 문제가 반복되는 구조입니다. 감정보다 규칙을 먼저 정해야 합니다.';
    }
    if (key === 'balance') {
      if (v >= 72) return '서로에게 없는 기운을 채워주는 자리가 많아, 오래 갈수록 편안해집니다.';
      if (v >= 55) return '한쪽이 주로 채워주는 구조입니다. 받는 쪽의 표현이 필요합니다.';
      return '둘 다 비어 있는 기운이 많습니다. 상대에게 기대하지 말고 함께 메워야 합니다.';
    }
    if (key === 'daily') {
      if (v >= 72) return '돈과 말, 생활의 리듬이 잘 맞습니다.';
      if (v >= 55) return '생활 규칙을 한두 개 정하면 크게 어긋나지 않습니다.';
      return '돈과 생활 방식의 기준이 다릅니다. 계좌와 역할을 미리 나누세요.';
    }
    if (v >= 72) return '앞으로의 세운이 두 사람에게 함께 힘을 보탭니다.';
    if (v >= 55) return '흔들리는 해에 큰 결정을 겹치지 않으면 무난합니다.';
    return '앞으로 몇 년 안에 두 사람이 함께 흔들리는 해가 있습니다. 큰 결정을 분산하세요.';
  }

  // ── 2인 책 본문 ────────────────────────────────────────────────
  function buildCouple(calcA, orderIn) {
    var B = orderIn.partnerCalc;
    var A = calcA;
    var eng = global.SajuEngine;
    var order = orderIn || {};
    var nameA = A.input.name || '첫 번째 분';
    var nameB = B.input.name || '두 번째 분';
    var ilA = ILGAN[A.ilgan] || ILGAN['甲'];
    var ilB = ILGAN[B.ilgan] || ILGAN['甲'];
    var r = coupleAnalysis(A, B);
    var today = new Date();
    var todayStr = today.getFullYear() + '년 ' + (today.getMonth() + 1) + '월 ' + today.getDate() + '일';
    var productName = order.productName || '2인 사주 & 평생 궁합 완전판 PDF 책';

    var b = new Book(A, order);
    b.headName = nameA + ' · ' + nameB;

    // ── 표지 ──
    var cover = b.addPage({ noFrame: true, cls: 'cover' });
    cover.innerHTML =
      '<div class="cover-wrap">' +
      '<div class="cover-brand">運命羅針盤</div>' +
      '<div class="cover-line"></div>' +
      '<div class="cover-kicker">2인 사주 · 평생 궁합 정밀 리포트</div>' +
      '<div class="cover-title">' + esc(nameA) + ' 님 × ' + esc(nameB) + ' 님<br>두 사람의 여덟 글자</div>' +
      '<div class="cover-ilju">' + A.ilju + '일주 · ' + ilA.title + ' &nbsp;/&nbsp; ' + B.ilju + '일주 · ' + ilB.title + '</div>' +
      '<div class="strip-pair">' +
      '<div class="strip-person"><div class="strip-label">' + esc(nameA) + '</div>' + stripTable(A) + '</div>' +
      '<div class="strip-person"><div class="strip-label">' + esc(nameB) + '</div>' + stripTable(B) + '</div>' +
      '</div>' +
      '<div class="cover-badge">' + esc(productName) + '</div>' +
      '<div class="cover-quote">궁합은 두 사람이 맞는지 보는 일이 아니라,<br>어디서 부딪히고 어떻게 풀어야 하는지를 아는 일입니다.</div>' +
      '<div class="cover-info">' +
      '<div><span>' + esc(nameA) + '</span>' + esc(birthLabel(A)) + '</div>' +
      '<div><span>' + esc(nameB) + '</span>' + esc(birthLabel(B)) + '</div>' +
      '<div><span>종합 궁합</span>' + r.score.total + '점 · ' + esc(r.verdict.head.split(' — ')[0]) + '</div>' +
      '<div><span>발행</span>' + todayStr + '</div>' +
      '</div>' +
      '<div class="cover-foot">운명나침반 · nachimbansaju.com<br>이 책은 결제하신 주문에 한해 발행된 맞춤 리포트입니다.</div>' +
      '</div>';

    // ── 목차 ──
    var toc = b.addPage();
    toc.innerHTML =
      '<h2 class="page-title">목차</h2>' +
      '<div class="toc">' +
      '<div class="toc-row"><span>제1부</span>첫 번째 분의 타고난 본질과 숨겨진 속마음 분석</div>' +
      '<div class="toc-row"><span>제2부</span>두 번째 분의 타고난 본질과 숨겨진 속마음 분석</div>' +
      '<div class="toc-row"><span>제3부</span>두 사람의 오행 합(合)과 충(沖) 분석 (끌림의 진짜 이유)</div>' +
      '<div class="toc-row"><span>제4부</span>왜 항상 같은 문제로 부딪힐까 (서로의 갈등 촉발 버튼)</div>' +
      '<div class="toc-row"><span>제5부</span>상대방이 절대 먼저 털어놓지 않는 무의식적 결핍</div>' +
      '<div class="toc-row"><span>제6부</span>돈 관리와 집안일, 미래를 합칠 때 터지는 위기 시기</div>' +
      '<div class="toc-row"><span>제7부</span>평생 백년해로하기 위한 1:1 맞춤 화해·소통 개운 비책</div>' +
      '</div>' +
      '<div class="summary-card">' +
      '<div class="summary-title">두 사람의 궁합을 한눈에</div>' +
      '<div class="summary-grid">' +
      '<div><span>일간</span>' + A.ilgan + '(' + esc(nameA) + ') × ' + B.ilgan + '(' + esc(nameB) + ') · ' + (r.ganRel.length ? esc(r.ganRel.join('·')) : '특별한 합충 없음') + '</div>' +
      '<div><span>일지</span>' + A.ilji + ' × ' + B.ilji + ' · ' + (r.jiRel.length ? esc(r.jiRel.join('·')) : '특별한 합충 없음') + '</div>' +
      '<div><span>종합 궁합</span>' + r.score.total + '점 · ' + esc(r.verdict.head.split(' — ')[0]) + '</div>' +
      '<div><span>서로 채우는 기운</span>' + esc(elemListKr(r.fillA.concat(r.fillB))) + '</div>' +
      '<div><span>겹쳐 과해지는 기운</span>' + esc(elemListKr(r.overlap)) + '</div>' +
      '<div><span>둘 다 비어 있는 기운</span>' + esc(elemListKr(r.bothZero)) + '</div>' +
      '</div></div>' +
      '<div class="read-guide">' +
      '<h3 class="sec-title">이 책을 읽는 법</h3>' +
      '<p>1~2부는 각자의 사주를 따로 읽습니다. 상대를 이해하려면 먼저 각자의 재료를 알아야 하기 때문입니다.</p>' +
      '<p>3부가 이 책의 중심입니다. 두 사람의 여덟 글자를 맞세워 <b>어디서 끌리고 어디서 부딪히는지</b>를 계산한 결과입니다.</p>' +
      '<p>4~6부는 그 결과를 생활로 옮긴 것입니다. 갈등이 시작되는 지점, 서로 말하지 않는 결핍, 돈과 미래를 합칠 때의 시기를 다룹니다.</p>' +
      '<p>7부는 결론입니다. <b>말 꺼내기 좋은 화해 날짜</b>와 이 관계에서 실제로 바꿀 세 가지를 날짜와 함께 적었습니다.</p>' +
      '</div>';

    // ── 제1부·2부: 각자 분석 ──
    couplePersonChapters(b, A, nameA, 1, '첫 번째 분');
    couplePersonChapters(b, B, nameB, 2, '두 번째 분');

    // ── 제3부: 오행 합충 ──
    b.addPage();
    b.chapter(3, '두 사람의 오행 합(合)과 충(沖)', '두 사람의 여덟 글자를 맞세워 끌림과 마찰의 진짜 원인을 계산했습니다.', '부');
    b.section('두 사람 원국 나란히');
    b.block(coupleCompareTable(A, B, nameA, nameB));
    b.para('위 표는 두 사람의 원국을 같은 기준으로 나란히 놓은 것입니다. 사주 원국의 네 기둥은 왼쪽부터 년·월·일·시이며, 시주가 비어 있으면 태어난 시간을 몰라 삼주로 계산한 것입니다.', 'small');

    b.section('오행 분포 비교');
    b.block('<div class="bar-legend"><span>위 ' + esc(nameA) + ' · 아래 ' + esc(nameB) + '</span></div>' + pairElementBar(A, B));
    b.para(elemBalanceText(A, B, r, nameA, nameB));

    b.section('서로 채워주는 기운과 겹쳐서 과해지는 기운');
    b.block(elemStateTable(r, nameA, nameB));

    b.addPage();
    b.section('일간 ' + A.ilgan + ' × ' + B.ilgan + ' — 두 사람의 중심이 만나는 방식');
    b.para(ganPairText(A, B, r, nameA, nameB));
    b.para('<b>' + esc(nameB) + ' 님이 보는 ' + esc(nameA) + ' 님</b> — ' + esc(nameA) + ' 님의 일간(' + A.ilgan + ')은 ' + esc(nameB) + ' 님에게 <b>' + r.bSeesA + '</b>의 자리입니다. ' + (SIPSIN_TO_PARTNER[r.bSeesA] || ''));

    b.section('일지 ' + A.ilji + ' × ' + B.ilji + ' — 배우자궁이 만나는 방식');
    b.para(jiPairText(A, B, r));
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>' + esc(nameA) + ' 배우자궁</th><td>' + A.ilji + ' · ' + A.sipsin.day.ji + ' — ' + (SPOUSE_TRAIT[eng.ELEM_OF_JI[A.ilji]] || '') + '</td></tr>' +
      '<tr><th>' + esc(nameB) + ' 배우자궁</th><td>' + B.ilji + ' · ' + B.sipsin.day.ji + ' — ' + (SPOUSE_TRAIT[eng.ELEM_OF_JI[B.ilji]] || '') + '</td></tr>' +
      '</tbody></table>');

    b.section('두 사주 사이의 다른 지지 관계');
    if (r.cross.length) {
      b.block('<table class="mini-table wide cross-table"><tbody>' + r.cross.slice(0, 6).map(function (c) {
        return '<tr><th>' + esc(c.a.split(' ')[1]) + ' × ' + esc(c.b.split(' ')[1]) + '</th><td><span class="muted">' + esc(c.a.split(' ')[0]) + ' × ' + esc(c.b.split(' ')[0]) + '</span> · ' + esc(c.text) + '</td></tr>';
      }).join('') + '</tbody></table>');
    } else {
      b.para('일지 이외의 지지에서는 두드러진 합이나 충이 없습니다. 관계의 성격은 일지와 오행의 보완에서 결정되는 구조입니다.', 'small');
    }
    if (r.crossGan.length) {
      b.para('천간에서도 <b>' + esc(r.crossGan.slice(0, 3).map(function (g) { return g.a + '×' + g.b + ' ' + g.text; }).join(', ')) + '</b>이 성립합니다. 겉으로 드러나는 태도와 말투에 이 관계가 배어납니다.', 'small');
    }

    b.section('궁합 점수 — 다섯 가지로 나눠 본 결과');
    b.para('아래 점수는 두 사람의 원국을 같은 기준으로 계산한 상대값입니다. 100점 만점의 절대 평가가 아니라, 이 관계 안에서 어느 부분이 강하고 어느 부분을 손봐야 하는지를 보여주는 지표입니다.', 'small');
    b.block(scoreTable(r));
    b.para('다섯 항목은 각각 <b>끌림</b>(일간·일지의 합과 충, 서로에게 보이는 십성), <b>안정</b>(충·형·파·해의 개수와 강약 차이), <b>보완</b>(한쪽에 없고 다른 쪽에 있는 오행), <b>생활</b>(재성·식상·관성의 구조), <b>시기</b>(6년의 세운과 현재 대운)를 따로 계산한 값입니다. 점수가 높다고 좋은 것만은 아니며, 낮은 항목이 앞으로 손볼 자리입니다.', 'small');
    b.section('이 궁합을 한 줄로');
    b.para('<b>' + esc(r.verdict.head) + '</b>');
    b.para(esc(r.verdict.body));
    b.section('가장 먼저 손볼 것');
    b.block('<table class="mini-table wide"><tbody>' + priorityRows(r).map(function (x) {
      return '<tr><th>' + x[0] + ' ' + x[1] + '점</th><td>' + x[2] + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.para('다섯 항목을 모두 고치려 하면 오래 가지 않습니다. 가장 낮은 두 항목만 3개월간 의식하면 나머지는 따라옵니다.', 'small');
    b.section('이 관계가 강한 곳');
    b.block('<table class="mini-table wide"><tbody>' + strongRows(r).map(function (x) {
      return '<tr><th>' + x[0] + ' ' + x[1] + '점</th><td>' + x[2] + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.block('<div class="summary-card chapter-summary">' +
      '<div class="summary-title">제3부 요약 — 이 관계의 세 줄</div>' +
      '<div class="summary-grid">' + chapterThreeSummary(A, B, r, nameA, nameB) + '</div>' +
      '</div>');

    // ── 제4부: 갈등 촉발 버튼 ──
    b.addPage();
    b.chapter(4, '왜 항상 같은 문제로 부딪힐까', '서로의 갈등 촉발 버튼은 사주에 정해져 있습니다. 버튼을 없앨 수는 없지만, 누르는 순서는 바꿀 수 있습니다.', '부');
    var trig = conflictTriggers(A, B, r, nameA, nameB);
    b.para(conflictIntro(A, B, r, nameA, nameB, trig.length));
    trig.forEach(function (t, i) {
      b.section((i + 1) + '. ' + t.title);
      b.para(t.body);
      b.para('<b>멈추는 방법</b> — ' + t.fix);
    });
    b.section('싸움이 커지는 순서');
    b.para(fightSequence(A, B, r, nameA, nameB));
    b.section('두 사람이 지킬 규칙 세 가지');
    b.block('<table class="mini-table wide"><tbody>' + rulesFor(A, B, r, nameA, nameB).map(function (x, i) {
      return '<tr><th>규칙 ' + (i + 1) + '</th><td>' + x + '</td></tr>';
    }).join('') + '</tbody></table>');

    // ── 제5부: 무의식적 결핍 ──
    b.addPage();
    b.chapter(5, '상대방이 절대 먼저 털어놓지 않는 무의식적 결핍', '사주에서 비어 있는 오행은 그 사람이 평생 말하지 않는 자리입니다.', '부');
    b.para('사람은 자신에게 없는 것을 요구하지 않습니다. 그래서 사주에서 비어 있거나 약한 오행은 "이 사람이 먼저 말하지 않는 것"과 정확히 겹칩니다. 이 장은 두 사람의 빈자리를 각각 짚고, 그 자리를 채우는 방법을 적었습니다.');
    var dA = pickDeficit(A, B, []);
    var dB = pickDeficit(B, A, [dA]);
    b.section(esc(nameB) + ' 님 — ' + DEFICIT[dB].lack);
    b.para('빈자리 — ' + ELEM_KR[dB] + ' 기운이 ' + (B.counts[dB] === 0 ? '아예 없습니다' : '한 글자뿐입니다') + '. ' + DEFICIT[dB].now);
    b.para('<b>' + esc(nameA) + ' 님이 해줄 수 있는 것</b> — ' + esc(nameB) + ' 님이 곁에서 기다리는 것은 ' + DEFICIT[dB].need + '입니다. ' + DEFICIT[dB].fill);
    b.section(esc(nameA) + ' 님 — ' + DEFICIT[dA].lack);
    b.para('빈자리 — ' + ELEM_KR[dA] + ' 기운이 ' + (A.counts[dA] === 0 ? '아예 없습니다' : '한 글자뿐입니다') + '. ' + DEFICIT[dA].now);
    b.para('<b>' + esc(nameB) + ' 님이 해줄 수 있는 것</b> — ' + esc(nameA) + ' 님이 곁에서 기다리는 것은 ' + DEFICIT[dA].need + '입니다. ' + DEFICIT[dA].fill);
    b.section('서로를 오해하는 지점');
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>' + esc(nameA) + '</th><td>' + missReadText(A, dA, B, nameA, nameB) + '</td></tr>' +
      '<tr><th>' + esc(nameB) + '</th><td>' + missReadText(B, dB, A, nameB, nameA) + '</td></tr>' +
      '</tbody></table>');
    b.section('서로의 빈자리를 채우는 순서');
    b.para(fillOrderText(A, B, r, nameA, nameB));

    // ── 제6부: 돈·집안일·위기 시기 ──
    b.addPage();
    b.chapter(6, '돈 관리와 집안일, 미래를 합칠 때 터지는 위기 시기', '생활의 문제는 성격이 아니라 구조에서 옵니다. 두 사람의 재물·생활 구조를 나란히 봅니다.', '부');
    b.section('두 사람의 돈 다루는 방식');
    b.block(moneyCompareTable(A, B, nameA, nameB));
    b.para(moneyPairText(A, B, r, nameA, nameB));
    b.section('집안일과 생활 리듬');
    b.para(choreText(A, B, r, nameA, nameB));
    b.section('미래를 합칠 때 터지는 시기 — 2026~2031');
    b.block(yearCrossTable(r, nameA, nameB));
    b.para(yearCrossText(r, nameA, nameB));
    b.addPage();
    b.section('2027년 두 사람의 월별 기운');
    b.para('2027년 한 해를 달 단위로 나눠, 두 사람의 일지에 각각 어떤 기운이 들어오는지 계산한 표입니다. 같은 달이라도 두 사람에게 다르게 작용하므로, 두 칸을 함께 보고 판단하세요.', 'small');
    b.block(coupleMonthTable(A, B, nameA, nameB));
    b.para(coupleMonthText(A, B, nameA, nameB), 'small');
    b.section('2027년, 이 일은 이 달에');
    b.block('<table class="mini-table wide event-table"><tbody>' + eventPlan(A, B).map(function (x) {
      return '<tr><th>' + x[0] + '</th><td><b>좋은 달</b> ' + x[1] + '<br><b>피할 달</b> ' + x[2] + '<br><span class="muted">' + x[3] + '</span></td></tr>';
    }).join('') + '</tbody></table>');
    b.addPage();
    b.section('대운의 교차점');
    b.para(daeunCrossText(A, B, nameA, nameB));
    b.block(daeunPairTable(A, B, nameA, nameB));
    b.section('대운이 바뀌는 해에 두 사람이 할 일');
    b.block('<table class="mini-table wide"><tbody>' + daeunShiftAdvice(A, B, nameA, nameB).map(function (x, i) {
      return '<tr><th>' + (i + 1) + '</th><td>' + x + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.section('위기 시기를 넘기는 3단계');
    b.para('흔들리는 해에는 감정보다 <b>순서</b>가 중요합니다. 아래 순서를 미리 정해두면 그해에 같은 일로 두 번 싸우지 않습니다.');
    b.block('<table class="mini-table wide"><tbody>' +
      '<tr><th>1. 사실 확인</th><td>서로의 수면·일·돈 상태를 먼저 말로 확인합니다. 흔들릴 때는 대개 생활 기반이 먼저 무너져 있습니다.</td></tr>' +
      '<tr><th>2. 결정 미루기</th><td>이사·투자·사업 확장처럼 되돌리기 어려운 결정은 2주 뒤로 미룹니다. 그 사이 감정이 가라앉습니다.</td></tr>' +
      '<tr><th>3. 기록 남기기</th><td>돈이 오가는 일과 가족과의 약속은 그날 문자로 남깁니다. 기억이 아니라 기록이 이 관계의 안전장치입니다.</td></tr>' +
      '</tbody></table>');
    b.section('이 시기에 미리 정해둘 것');
    b.para(moneyPairText(A, B, r, nameA, nameB) && '돈의 구조는 위기 시기에 가장 먼저 흔들립니다. 두 사람이 함께 정해둘 세 가지는 다음과 같습니다. ' +
      '하나는 <b>고정지출의 한도</b>, 둘째는 <b>양가에 드리는 금액의 기준</b>, 셋째는 <b>큰 지출을 상의하는 금액선</b>입니다. ' +
      '이 세 가지를 정해두면 흔들리는 해에도 다툼의 재료가 줄어듭니다.', 'small');

    // ── 제7부: 화해·소통 ──
    b.addPage();
    b.chapter(7, '평생 백년해로를 위한 1:1 맞춤 화해·소통 개운 비책', '이 관계에서 실제로 바꿀 수 있는 것은 대화의 방식과 날짜입니다.', '부');
    var dates = reconcileDates(A, B, today, 60);
    var good = pickDates(dates, 3, 5, true);
    var bad = pickDates(dates.filter(function (x) { return x.score <= 44; }).map(function (x) { return { date: x.date, dp: x.dp, score: x.score, plus: x.plus, minus: x.minus }; }), 3, 4);
    if (!bad.length) {
      bad = dates.slice().sort(function (a, b2) { return a.score - b2.score; }).slice(0, 2);
    }
    b.section('말 꺼내기 좋은 화해 날짜');
    b.para('아래 날짜는 앞으로 60일 가운데 두 사람의 일지·일간과 가장 편하게 맞물리는 날을 계산한 것입니다. 미뤄둔 이야기를 꺼내거나, 사과를 하거나, 앞으로의 계획을 꺼내기 좋은 날입니다.');
    b.block('<table class="mini-table wide date-table"><tbody>' + good.map(function (g) {
      return '<tr><th>' + koDate(g.date) + '</th><td>' + g.dp.gan + g.dp.ji + '일 · ' + g.score + '점' +
        (g.plus.length ? ' — ' + esc(Array.from(new Set(g.plus)).join('·')) : '') + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.para('화해는 결론을 내는 자리가 아니라 <b>다시 말을 시작하는 자리</b>입니다. 이 날짜에는 "그때 내가 이렇게 느꼈어"까지만 말하고, 상대의 답을 재촉하지 마세요.', 'small');
    b.section('피하는 것이 좋은 날');
    b.block('<table class="mini-table wide date-table"><tbody>' + bad.map(function (g) {
      return '<tr><th>' + koDate(g.date) + '</th><td>' + g.dp.gan + g.dp.ji + '일 · ' + g.score + '점' +
        (g.minus.length ? ' — ' + esc(Array.from(new Set(g.minus)).join('·')) : '') + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.para('이 날은 두 사람의 일지에 충·형·파가 걸리는 날입니다. 중요한 대화, 돈 이야기, 가족 문제는 하루만 미루면 훨씬 부드럽게 풀립니다.', 'small');
    b.section('화해 대화 3단계');
    b.block('<table class="mini-table wide"><tbody>' + reconcileScript(A, B, r, nameA, nameB).map(function (x, i) {
      return '<tr><th>' + (i + 1) + '단계</th><td>' + x + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.section('이 두 사람이 피해야 할 말');
    b.block('<table class="mini-table wide phrase-table"><tbody>' + avoidPhrases(A, B, r, nameA, nameB).map(function (x) {
      return '<tr><th>“' + x[0] + '”</th><td>' + x[1] + '</td></tr>';
    }).join('') + '</tbody></table>');

    b.addPage();
    b.section(esc(nameB) + ' 님에게 말을 거는 법');
    b.para('<b>' + B.ilgan + ' 일간</b> — ' + ilB.advice + ' ' + (SIPSIN_TO_PARTNER[r.aSeesB] || ''));
    b.para(speakStyleText(B, nameB));
    b.section(esc(nameA) + ' 님에게 말을 거는 법');
    b.para('<b>' + A.ilgan + ' 일간</b> — ' + ilA.advice + ' ' + (SIPSIN_TO_PARTNER[r.bSeesA] || ''));
    b.para(speakStyleText(A, nameA));
    b.section('두 사람에게 없는 기운 채우기 — 함께하는 개운법');
    b.para(pairBoostText(A, B, r, nameA, nameB));
    b.section('3개월 실천 계획');
    b.block('<table class="mini-table wide plan-table"><tbody>' + threeMonthPlan(A, B, r, nameA, nameB).map(function (row, i) {
      return '<tr><th>' + (i + 1) + '개월</th><td>' + row + '</td></tr>';
    }).join('') + '</tbody></table>');
    b.para('궁합은 읽는 것으로 끝나지 않습니다. 위 세 가지 중 <b>가장 쉬운 하나</b>를 이번 주에 시작하면, 그 한 번이 다음 싸움의 방향을 바꿉니다.', 'small');
    b.section('자주 묻는 질문');
    b.block('<table class="mini-table wide faq-table"><tbody>' + coupleFaq(A, B, r, nameA, nameB).map(function (x) {
      return '<tr><th>' + x[0] + '</th><td>' + x[1] + '</td></tr>';
    }).join('') + '</tbody></table>');

    // ── 마지막: 편지 + 이용 안내 ──
    b.addPage();
    b.chapter('', '마지막으로 드리는 말씀', '');
    b.para(esc(nameA) + ' 님, ' + esc(nameB) + ' 님, 여기까지 읽어주셔서 고맙습니다.');
    b.para(coupleLetter(A, B, r, ilA, ilB, nameA, nameB));
    b.section('이용 안내');
    b.para('<b>다운로드·열람 기간</b> — 이 책은 결제일로부터 30일 이내에 다시 내려받으실 수 있습니다. 기기에 저장하신 파일은 기간과 관계없이 보관하실 수 있습니다.');
    b.para('<b>파일 오류 시</b> — 파일이 열리지 않거나 내용이 누락된 경우, 결제일로부터 30일 안에 같은 주문 페이지에서 다시 내려받으실 수 있습니다. 그래도 열리지 않으면 카카오톡 1:1 상담실에 <b>결제번호 ' + esc(order.paymentId || '-') + '</b>를 남겨주세요.');
    b.para('<b>환불</b> — 다운로드 전에는 결제일로부터 7일 이내 전액 환불이 가능합니다. 다운로드가 시작된 디지털 콘텐츠는 단순 변심에 의한 환불이 제한됩니다(전자상거래법 제17조 제2항 제5호).');
    b.para('<b>저작권</b> — 이 책의 분석 문구와 구성에 대한 저작권은 운명나침반에 있습니다. 구매자 본인의 열람·보관 목적 외 복제·배포는 삼가 주세요.', 'small');
    b.para('<b>고지</b> — 본 리포트는 전통 명리학 이론에 근거한 해석 자료이며, 의료·법률·투자 판단을 대신하지 않습니다.', 'small');
    b.para('<span class="brand-end">運命羅針盤 · nachimbansaju.com</span>', 'center');

    return b.build();
  }

  function priorityRows(r) {
    var keys = ['attraction', 'stability', 'balance', 'daily', 'timing'].slice().sort(function (a, b) { return r.score[a] - r.score[b]; });
    var actions = {
      attraction: '먼저 표현하는 쪽이 되기 — 하루 한 번, 고마운 점을 말로 꺼냅니다. 끌림은 말할수록 커집니다.',
      stability: '생활의 경계를 정하기 — 잠드는 시간, 한 달 지출 한도, 주말 하루를 각자 영역으로 나눕니다.',
      balance: '부족한 오행을 함께 채우기 — 이 책 7부의 개운법에서 두 사람에게 없는 기운을 주 1회 함께 합니다.',
      daily: '돈의 구조를 나누기 — 고정지출·저축·여유자금 계좌를 분리하고 월 1회 함께 확인합니다.',
      timing: '큰 결정을 분산하기 — 두 사람이 함께 흔들리는 해에는 이사·투자·사업 확장을 겹치지 않게 둡니다.'
    };
    return keys.slice(0, 2).map(function (k) { return [SCORE_LABEL[k], r.score[k], actions[k]]; });
  }

  function strongRows(r) {
    var keys = ['attraction', 'stability', 'balance', 'daily', 'timing'].slice().sort(function (a, b) { return r.score[b] - r.score[a]; });
    var strs = {
      attraction: '끌림이 두 사람을 다시 만나게 합니다. 이 힘은 시간이 지나도 사라지지 않으니, 다툰 뒤에 먼저 다가가기 좋은 관계입니다.',
      stability: '생활이 크게 흔들리지 않는 힘입니다. 이 안정 위에서만 어려운 이야기를 꺼내는 것이 좋습니다.',
      balance: '상대에게 없는 것을 채워주는 자리입니다. 한 사람이 지칠 때 다른 사람이 자연스럽게 힘을 보탭니다.',
      daily: '돈과 생활의 리듬이 맞는 편입니다. 두 사람이 함께 계획을 세울 때 가장 현실적인 결과가 나옵니다.',
      timing: '앞으로의 세운이 두 사람에게 함께 힘을 보탭니다. 미뤄둔 계획을 시작하기 좋은 시기입니다.'
    };
    return keys.slice(0, 2).map(function (k) { return [SCORE_LABEL[k], r.score[k], strs[k]]; });
  }

  function coupleFaq(A, B, r, nA, nB) {
    var out = [];
    var q1 = '애초에 안 맞는 사주인가요?';
    var a1 = '궁합 점수는 ' + r.score.total + '점, 그중 안정 ' + r.score.stability + '점입니다. ';
    if (r.score.stability < 55) {
      a1 += '안정 점수가 낮은 것은 두 사람이 비슷하지 않다는 뜻이지, 함께 살 수 없다는 뜻이 아닙니다. 충·형이 있는 커플은 규칙을 정할 때 오히려 오래 갑니다.';
    } else if (r.score.stability >= 72) {
      a1 += '안정 점수가 높아, 생활에서 크게 부딪히지 않는 구조입니다. 다만 편안함에 기대어 표현을 줄이면 조용히 멀어질 수 있습니다.';
    } else {
      a1 += '큰 충돌은 없고, 생활 규칙을 조금만 정하면 무난합니다.';
    }
    out.push([q1, a1]);

    var q2 = '돈을 한 통장으로 합쳐도 되나요?';
    var a2 = '';
    var a = A.sipsinCounts['재성'], bb = B.sipsinCounts['재성'];
    if (a === 0 || bb === 0) a2 += '한쪽의 재성이 비어 있어, 돈을 합치면 관리가 그쪽으로 몰립니다. ';
    if (a >= 3 || bb >= 3) a2 += '또 재성이 과한 쪽은 들어오고 나가는 폭이 큽니다. ';
    if (A.sipsinCounts['비겁'] >= 3 || B.sipsinCounts['비겁'] >= 3) a2 += '비겁이 강해 지인·가족 문제로 돈이 나가기 쉽습니다. ';
    a2 += '결론적으로 하나로 합치기보다 <b>생활비·저축·각자 용돈</b> 세 계좌로 나누는 편이 이 궁합에 맞습니다.';
    out.push([q2, a2]);

    var q3 = '결혼·동거 시기는 언제가 좋나요?';
    var goodYears = r.yearCross.filter(function (y) { return y.good >= 2 || y.verdict === '관계 결속'; }).map(function (y) { return y.year + '년'; });
    var a3 = '';
    if (goodYears.length) {
      a3 += goodYears.join('·') + '은 두 사람의 일지에 합이 걸리는 해입니다. 관계를 제도로 굳히는 결정은 이 해에 두면 자연스럽게 진행됩니다. ';
    } else {
      a3 += '앞으로 6년 안에는 두 사람의 일지에 합이 동시에 걸리는 해가 뚜렷하지 않습니다. 이 경우 해보다 <b>두 사람 모두에게 기운이 실린 달</b>을 골라 진행하세요. ';
    }
    var ms = A.monthly2027.map(function (ma, i) { return { m: ma.month, s: coupleMonthScore(A, B, ma, B.monthly2027[i]).score }; });
    var topM = ms.slice().sort(function (x, y) { return y.s - x.s; }).slice(0, 2).map(function (x) { return x.m + '월'; });
    a3 += '2027년 안에서 고른다면 ' + topM.join('·') + '이 좋습니다.';
    out.push([q3, a3]);
    return out;
  }

  function chapterThreeSummary(A, B, r, nA, nB) {
    var keys = ['attraction', 'stability', 'balance', 'daily', 'timing'].slice().sort(function (a, b) { return r.score[a] - r.score[b]; });
    var low = keys[0];
    var center = (r.ganRel.length ? '일간은 ' + r.ganRel.join('·') : '일간은 특별한 합충이 없고') + ', 일지는 ' + (r.jiRel.length ? r.jiRel.join('·') : '특별한 관계가 없습니다') + '.';
    var need = '지금 가장 필요한 것은 ' + SCORE_LABEL[low] + '(' + r.score[low] + '점)을 올리는 일입니다.';
    var watch = r.overlap.length ? '조심할 것은 ' + elemListKr(r.overlap) + ' 기운이 겹치는 자리 — 같은 장점이 두 배, 같은 단점도 두 배가 됩니다.' :
      (r.bothZero.length ? '조심할 것은 ' + elemListKr(r.bothZero) + ' 기운이 둘 다 비어 있다는 점 — 이 자리는 함께 만들어야 합니다.' : '두 사람 사이에 유난히 과한 기운은 없습니다. 생활의 규칙이 관계의 안전장치입니다.');
    return '<div><span>중심</span>' + center + '</div>' +
      '<div><span>필요</span>' + need + '</div>' +
      '<div><span>주의</span>' + watch + '</div>';
  }

  function elemListKr(list) {
    if (!list || !list.length) return '없음';
    return list.map(function (e) { return ELEM_KR[e]; }).join(', ');
  }

  function deficitElem(C) {
    return C.elements.zero[0] || C.elements.missing[0] || C.elements.motherElem;
  }

  // 두 사람의 결핍이 같은 오행으로 겹치지 않도록 고르다.
  // 1순위: 그 사람에게 아예 없거나 1자인 오행 중, 상대가 넉넉히(2자 이상) 가진 것
  function pickDeficit(C, other, used) {
    var list = [];
    C.elements.zero.concat(C.elements.missing).forEach(function (e) {
      if (list.indexOf(e) < 0) list.push(e);
    });
    var avail = list.filter(function (e) { return used.indexOf(e) < 0; });
    if (!avail.length) avail = list.slice();
    var fillable = avail.filter(function (e) { return (other.counts[e] || 0) >= 2; });
    return fillable[0] || avail[0] || deficitElem(C);
  }

  function missReadText(C, d, other, name, otherName) {
    var lack = DEFICIT[d].lack;
    var t = name + ' 님은 ' + ELEM_KR[d] + ' 기운이 약해, ' + lack + josaEul(lack) + ' 먼저 요구하지 않습니다. ';
    if ((other.counts[d] || 0) >= 3) {
      t += '그런데 ' + otherName + ' 님은 이 기운이 넉넉해, ' + name + ' 님이 말하지 않아도 알아서 해줄 것이라 기대합니다. 기대가 어긋나는 순간 ' + name + ' 님은 서운함을, ' + otherName + ' 님은 억울함을 느낍니다.';
    } else if ((other.counts[d] || 0) <= 1) {
      t += otherName + ' 님도 이 기운이 넉넉하지 않아, 두 사람 모두 이 자리에서 서로를 기다립니다. 누가 먼저 말을 꺼내지 않으면 오래 비어 있는 채로 남습니다.';
    } else {
      t += otherName + ' 님은 이 기운을 적당히 가지고 있어, ' + name + ' 님이 기대하는 만큼은 아닐 수 있습니다. 기대치를 말로 맞춰야 합니다.';
    }
    return t;
  }

  // 각자 2쪽: 원국·일간 / 오행·배우자궁·생활
  function couplePersonChapters(b, C, name, num, label) {
    var il = ILGAN[C.ilgan] || ILGAN['甲'];
    b.addPage();
    b.chapter(num, label + ' — ' + name + ' 님의 타고난 본질', '먼저 이 사람이 어떤 재료로 만들어졌는지 봅니다.', '부');
    b.para('사주는 네 기둥과 여덟 글자로 이루어집니다. 특히 <b>일간</b>(' + C.ilgan + ')이 이 사람 자신이고, 나머지 일곱 글자가 그를 돕는지 누르는지를 봅니다.');
    b.block(pillarTable(C));
    b.para('한글 표기로는 <b>' + C.hanglePillars.year + ' · ' + C.hanglePillars.month + ' · ' + C.hanglePillars.day + ' · ' + C.hanglePillars.hour + '</b>입니다. ' +
      (C.input.isHourKnown ? '' : '태어난 시간을 모르시므로 시주를 제외한 삼주(三柱)로 해석했습니다. '), 'small');
    b.section('일간 ' + C.ilgan + ' — ' + il.title);
    b.para(il.essence);
    b.para('<b>강점</b> — ' + il.strength);
    b.para('<b>그림자</b> — ' + il.shadow);
    b.para('<b>한 줄 처방</b> — ' + il.advice);
    b.section('강약 — ' + C.strength.label + ' (내 편 ' + C.strength.supportPct + '%)');
    b.para(strengthParagraph(C));

    b.section('오행의 분포');
    b.block(elementBar(C));
    b.para(elemOneText(C), 'small');
    if (C.elements.over.length) {
      b.section('넘치는 기운 — ' + elemListKr(C.elements.over));
      b.para(OVER_TEXT[C.elements.over[0]]);
    }
    if (C.elements.zero.length) {
      b.section('비어 있는 기운 — ' + elemListKr(C.elements.zero));
      b.para(ZERO_TEXT[C.elements.zero[0]]);
    } else {
      b.section('비어 있는 기운 — 없음');
      b.para('다섯 기운이 모두 자리하고 있습니다. 큰 기복이 적은 대신, 스스로 판을 키우지 않으면 무난함에 머물 수 있습니다. 지금 가진 균형을 무기로 한 분야를 깊게 파는 것이 좋습니다.');
    }
    b.section('십성의 구조');
    b.block(sipsinMiniTable(C));
    b.para(sipsinOneText(C), 'small');
    b.section('배우자궁(일지) — ' + C.ilji + ' · ' + C.sipsin.day.ji);
    b.para('일지 ' + C.ilji + '는 배우자 자리이자 이 사람이 가까운 사람과 부딪히는 방식입니다. ' + (SIPSIN[C.sipsin.day.ji] ? SIPSIN[C.sipsin.day.ji].line : '') + ' ' + (SPOUSE_TRAIT[global.SajuEngine.ELEM_OF_JI[C.ilji]] || ''));
    b.section('사랑에서 반복하는 패턴');
    b.para(relationStages(C));
    b.section('이 사람에게 통하는 말투');
    b.para(speakStyleText(C, name));
    b.section('재물과 일의 구조');
    b.para(moneyStructure(C));
    b.para(workStructure(C), 'small');
  }

  function sipsinMiniTable(C) {
    var rows = ['비겁', '식상', '재성', '관성', '인성'].map(function (g) {
      var n = C.sipsinCounts[g];
      var st = n >= 3 ? '과다' : (n === 0 ? '없음' : '보통');
      var cls = n >= 3 ? 'mid' : (n === 0 ? 'bad' : '');
      return '<tr><td>' + g + '</td><td class="center">' + n + '개</td><td class="' + cls + '">' + st + '</td></tr>';
    }).join('');
    return '<table class="grid-table sipsin-mini"><thead><tr><th>구분</th><th>개수</th><th>상태</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function sipsinOneText(C) {
    var groups = ['비겁', '식상', '재성', '관성', '인성'];
    var over = groups.filter(function (g) { return C.sipsinCounts[g] >= 3; });
    var zero = groups.filter(function (g) { return C.sipsinCounts[g] === 0; });
    var t = '';
    if (over.length) t += '<b>' + over.join('·') + '</b>이 과하게 자리해 이 사주의 성격을 주도합니다. ' + GROUP_TEXT[over[0]].over + ' ';
    if (zero.length) t += '<b>' + zero.join('·') + '</b>은 비어 있어, 그 자리를 상대에게 기대거나 생활로 메워야 합니다. ' + GROUP_TEXT[zero[0]].under + ' ';
    if (!over.length && !zero.length) t += '다섯 십성이 모두 한두 개로 고르게 자리합니다. 어느 한 곳이 튀지 않아 관계에서도 큰 굴곡이 적습니다.';
    return t;
  }

  function elemOneText(C) {
    var many = C.elements.over.length ? elemListKr(C.elements.over) + ' 기운이 과하고' : '오행이 크게 치우치지 않았고';
    var zero = C.elements.zero.length ? elemListKr(C.elements.zero) + ' 기운이 비어 있습니다.' : '비어 있는 오행은 없습니다.';
    return '이 사주는 ' + many + ' ' + zero + ' 같은 사주끼리 만나면 서로의 과한 기운을 눌러주거나, 반대로 부족한 기운을 함께 갖게 됩니다. 다음 장에서 두 사람을 맞세워 봅니다.';
  }

  function elemBalanceText(A, B, r, nA, nB) {
    var t = '';
    if (r.fillA.length && r.fillB.length) {
      t = '두 사람은 <b>서로 다른 방향으로</b> 비어 있습니다. ' + esc(nB) + ' 님은 ' + esc(nA) + ' 님에게 ' + elemListKr(r.fillA) + ' 기운을 채워주고, ' + esc(nA) + ' 님은 ' + esc(nB) + ' 님에게 ' + elemListKr(r.fillB) + ' 기운을 채워줍니다. 이 구조는 처음엔 서로가 낯설지만, 시간이 지날수록 상대에게 없는 것을 자기 것으로 만드는 관계입니다.';
    } else if (r.fillA.length) {
      t = esc(nB) + ' 님의 사주가 ' + esc(nA) + ' 님에게 없는 ' + elemListKr(r.fillA) + ' 기운을 넉넉히 가지고 있습니다. ' + esc(nA) + ' 님이 이 사람 곁에서 편안함을 느끼는 이유가 여기 있습니다. 다만 한쪽이 계속 채워주는 구조이므로, ' + esc(nA) + ' 님도 상대의 빈자리를 살펴야 균형이 유지됩니다.';
    } else if (r.fillB.length) {
      t = esc(nA) + ' 님의 사주가 ' + esc(nB) + ' 님에게 없는 ' + elemListKr(r.fillB) + ' 기운을 채워줍니다. ' + esc(nB) + ' 님이 이 관계에서 안정을 느끼는 이유입니다. 반대로 ' + esc(nA) + ' 님이 받는 것이 적다고 느낀다면, 그 서운함을 말로 꺼내야 합니다.';
    } else {
      t = '두 사람의 오행 분포가 비슷합니다. 서로를 채워주는 힘은 크지 않지만, 같은 언어로 이야기할 수 있다는 장점이 있습니다. 대신 둘 다 비어 있는 기운은 이 관계 안에서 채워지지 않으므로, 생활 습관과 외부 사람의 도움으로 따로 메워야 합니다.';
    }
    if (r.overlap.length) {
      t += ' 한편 <b>' + elemListKr(r.overlap) + '</b> 기운은 두 사람 모두에게 과합니다. 같은 기운이 겹치면 그 자리의 장점이 두 배가 되지만, 단점도 두 배가 됩니다.';
    }
    if (r.bothZero.length) {
      t += ' <b>' + elemListKr(r.bothZero) + '</b> 기운은 두 사람 모두에게 없습니다. 이 부분은 상대에게 기대할 수 없으니, 두 사람이 함께 의식적으로 만들어야 합니다.';
    }
    return t;
  }

  function elemStateTable(r, nA, nB) {
    var rows = '';
    r.byElem.forEach(function (x) {
      var label = '', note = '';
      if (x.state === 'bFillsA') { label = nB + ' → ' + nA; note = nA + '에게 없는 기운'; }
      else if (x.state === 'aFillsB') { label = nA + ' → ' + nB; note = nB + '에게 없는 기운'; }
      else if (x.state === 'heavyOverlap') { label = '겹쳐 과함'; note = '둘 다 3자 이상'; }
      else if (x.state === 'overlap') { label = '겹침'; note = '둘 다 2자 이상'; }
      else if (x.state === 'bothZero') { label = '둘 다 없음'; note = '함께 메워야 함'; }
      else { label = '무난'; note = '한쪽만 있음'; }
      var cls = x.state === 'bothZero' ? 'bad' : (x.state.indexOf('Fills') >= 0 ? 'good' : (x.state.indexOf('verlap') >= 0 ? 'mid' : ''));
      rows += '<tr><td>' + ELEM_KR[x.e] + '</td><td class="center">' + x.a + '</td><td class="center">' + x.b + '</td><td class="' + cls + '">' + esc(label) + ' <span class="muted">(' + note + ')</span></td></tr>';
    });
    return '<table class="grid-table elem-state"><thead><tr><th>오행</th><th>' + esc(nA) + '</th><th>' + esc(nB) + '</th><th>관계</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function ganPairText(A, B, r, nA, nB) {
    var t = nA + ' 님의 일간 <b>' + A.ilgan + '</b>과 ' + nB + ' 님의 일간 <b>' + B.ilgan + '</b>은 ';
    if (hasKw(r.ganRel, '천간합')) {
      t += '<b>' + r.ganRel.join('·') + '</b>을 이룹니다. 천간합은 두 사람의 중심이 하나로 묶이는 자리로, 궁합에서 가장 강한 끌림 중 하나입니다. 설명하지 않아도 통하는 부분이 있고, 함께 있을 때 각자의 기운이 오히려 안정됩니다. 다만 합은 서로에게 흡수되는 관계이기도 해서, 한쪽이 자기 중심을 잃지 않도록 주의해야 합니다.';
    } else if (r.ganRel.indexOf('같은 천간') >= 0) {
      t += '같은 <b>' + A.ilgan + '</b>입니다. 같은 기운끼리 만나면 말이 빠르게 통하고 취향도 비슷합니다. 대신 둘 다 물러서지 않아 사소한 일이 자존심 싸움으로 번지고, 서로를 자기 거울로 보기 때문에 상대의 단점이 유난히 거슬립니다.';
    } else if (hasKw(r.ganRel, '천간충')) {
      t += '<b>천간충(沖)</b>의 자리입니다. 서로에게 없는 것을 정확히 건드려 강하게 끌리지만, 그 자극이 곧 부딪힘으로 바뀝니다. 이 관계는 편안함보다 긴장감으로 이어지는 구조라, 안정을 원할수록 더 피곤해질 수 있습니다.';
    } else if (r.ganElemRel === 'a2b') {
      t += A.ilgan + '의 기운이 ' + B.ilgan + '의 기운을 <b>살리는(相生)</b> 자리입니다. ' + nA + ' 님이 먼저 다가가고 먼저 챙기는 구도가 자연스럽습니다. 다만 주는 쪽이 지치지 않도록 중간에 멈추는 연습이 필요합니다.';
    } else if (r.ganElemRel === 'b2a') {
      t += B.ilgan + '의 기운이 ' + A.ilgan + '의 기운을 <b>살리는(相生)</b> 자리입니다. ' + nB + ' 님이 ' + nA + ' 님을 편안하게 해주는 구도이고, ' + nA + ' 님은 그 곁에서 힘을 얻습니다. 받는 쪽이 고마움을 표현하지 않으면 관계가 조용히 기웁니다.';
    } else if (r.ganElemRel === 'aWin') {
      t += A.ilgan + '의 기운이 ' + B.ilgan + '의 기운을 <b>누르는(相剋)</b> 자리입니다. ' + nA + ' 님이 관계의 속도를 쥐고 있고, ' + nB + ' 님은 그 속도에 맞추다 지칠 수 있습니다.';
    } else {
      t += B.ilgan + '의 기운이 ' + A.ilgan + '의 기운을 <b>누르는(相剋)</b> 자리입니다. ' + nB + ' 님이 기준을 세우고 ' + nA + ' 님이 맞추는 구도가 되기 쉽습니다. ' + nA + ' 님이 말을 아끼면 서운함이 쌓입니다.';
    }
    return t + ' ' + nA + ' 님이 보는 ' + nB + ' 님은 <b>' + r.aSeesB + '</b>의 자리입니다. ' + (SIPSIN_TO_PARTNER[r.aSeesB] || '');
  }

  function jiPairText(A, B, r) {
    if (!r.jiRel.length) {
      return '두 사람의 일지 ' + A.ilji + '와 ' + B.ilji + ' 사이에는 두드러진 합이나 충이 없습니다. 이 경우 관계의 결은 일지가 아니라 오행의 보완과 일간의 관계에서 결정됩니다. 좋게 말하면 서로 간섭이 적고, 아쉽게 말하면 관계를 묶어주는 힘이 약합니다. 생활의 규칙과 함께하는 목표가 이 관계를 붙잡아 줍니다.';
    }
    var parts = r.jiRel.map(function (rel) {
      var key = rel.indexOf('육합') >= 0 ? '육합' : (rel.indexOf('삼합') >= 0 ? '삼합' : (rel.indexOf('자형') >= 0 ? '자형' : (rel.indexOf('충') >= 0 ? '충' : (rel.indexOf('형') >= 0 ? '형' : (rel.indexOf('파') >= 0 ? '파' : '해')))));
      return REL_MEAN[key] || '';
    }).filter(Boolean);
    var head = '두 사람의 일지 <b>' + A.ilji + '</b>와 <b>' + B.ilji + '</b>는 <b>' + esc(r.jiRel.join('·')) + '</b>의 관계입니다. ';
    if (r.jiRel.length > 1) {
      head += '여러 관계가 겹쳐 있다는 것은, 이 자리에서 끌림과 마찰이 동시에 일어난다는 뜻입니다. 한쪽만 보지 말고 두 관계를 함께 읽어야 합니다. ';
    }
    return head + parts.join(' ');
  }

  function conflictIntro(A, B, r, nA, nB, count) {
    var t = '두 사람이 싸우는 방식은 성격이 아니라 <b>사주에서 서로 부딪히는 자리</b>에서 나옵니다. ';
    if (hasKw(r.jiRel, '충')) {
      t += '이 관계는 일지에 충(沖)이 있어, 생활의 리듬과 가치관이 정면으로 다릅니다. 그래서 사소한 결정 하나도 "왜 그렇게 생각해?"에서 시작됩니다. ';
    } else if (hasKw(r.jiRel, '형') || hasKw(r.jiRel, '파') || hasKw(r.jiRel, '해')) {
      t += '이 관계는 일지에 ' + esc(r.jiRel.join('·')) + '이 있어, 큰 사건보다 말투와 태도에서 상처가 생깁니다. ';
    } else {
      t += '이 관계는 일지에 큰 충이 없어, 싸움의 원인이 사주보다 생활 습관과 피로에서 옵니다. ';
    }
    t += '아래 ' + count + '가지는 두 사람의 계산 결과에서 실제로 나온 촉발 지점입니다. 전부 없애려 하지 말고, 가장 자주 눌리는 것 하나만 먼저 다루세요.';
    return t;
  }

  function conflictTriggers(A, B, r, nA, nB) {
    var out = [];
    if (hasKw(r.jiRel, '충')) {
      out.push({
        title: '생활 리듬의 정면 충돌',
        body: nA + ' 님의 일지 ' + A.ilji + '와 ' + nB + ' 님의 일지 ' + B.ilji + '가 충(沖)을 이룹니다. 충은 서로의 생활 방식이 정반대라는 뜻입니다. 잠드는 시간, 돈을 쓰는 기준, 주말을 보내는 방식처럼 매일 반복되는 것에서 부딪힙니다. 감정이 상해서가 아니라 구조가 달라서 생기는 싸움입니다.',
        fix: '생활의 규칙을 "각자 영역"으로 나누세요. 잠드는 시간, 지출 한도, 주말 하루는 서로 간섭하지 않기로 정하면 충의 절반이 사라집니다.'
      });
    }
    if (hasKw(r.jiRel, '형')) {
      out.push({
        title: '말과 태도 — 서운함이 서운함으로 돌아오는 구조',
        body: '일지에 형(刑)이 있어, 예의와 말투가 자주 문제가 됩니다. 한쪽은 사실을 말했다고 생각하는데 다른 쪽은 무시당했다고 느낍니다. 이 자리는 시간이 지나도 기억에 남아, 다음 싸움의 재료로 다시 나옵니다.',
        fix: '감정이 올라오면 사실만 말하고, 판단은 하루 뒤에 하세요. "너는 항상"으로 시작하는 문장을 금지어로 정하는 것만으로도 크게 줄어듭니다.'
      });
    }
    if (hasKw(r.jiRel, '파')) {
      out.push({
        title: '중요한 순간에 어긋나는 타이밍',
        body: '일지에 파(破)가 있어, 평소에는 잘 맞다가 결정적인 순간에 방향이 갈립니다. 이사·이직·투자처럼 큰 결정에서 특히 그렇습니다. 서로 운이 없다고 느끼지만, 실제로는 결정을 내리는 속도가 다르기 때문입니다.',
        fix: '큰 결정은 최소 일주일 전에 꺼내고, 결정일을 미리 정하세요. 즉석에서 결론을 내리는 대화를 피하는 것이 핵심입니다.'
      });
    }
    if (hasKw(r.jiRel, '해')) {
      out.push({
        title: '두 사람 바깥의 사람이 끼어드는 문제',
        body: '일지에 해(害)가 있어, 두 사람 사이보다 가족·친구·직장 사람이 문제의 원인이 되는 경우가 많습니다. 서로를 탓하기 전에 그 사람과의 경계를 먼저 봐야 합니다.',
        fix: '양가 가족과 공통 지인에 대한 경계를 두 사람끼리 먼저 합의하세요. 밖에서 온 이야기는 두 사람이 확인한 뒤에 받아들이는 규칙이 필요합니다.'
      });
    }
    if (A.strength.supportPct >= 55 && B.strength.supportPct >= 55) {
      out.push({
        title: '주도권 다툼',
        body: '두 사람 모두 신강(身强)한 사주입니다. 각자 자기 방식이 확실하고, 상대의 방식을 존중하는 데 시간이 걸립니다. 결정권을 두고 다투면 사소한 일이 자존심 싸움으로 번집니다.',
        fix: '결정권을 영역으로 나누세요. 돈, 아이, 집안일, 여행처럼 항목별로 최종 결정자를 정하면 다툼의 절반이 사라집니다.'
      });
    } else if (Math.abs(A.strength.supportPct - B.strength.supportPct) >= 25) {
      var strongOne = A.strength.supportPct > B.strength.supportPct ? nA : nB;
      var weakOne = A.strength.supportPct > B.strength.supportPct ? nB : nA;
      out.push({
        title: '한 사람만 짐을 지는 구조',
        body: strongOne + ' 님의 사주가 더 강하고, ' + weakOne + ' 님은 상대의 속도에 맞추는 자리에 있습니다. 겉으로는 원만하지만 ' + weakOne + ' 님의 서운함이 말로 나오지 않아 쌓입니다.',
        fix: weakOne + ' 님이 "괜찮다"고 말할 때 한 번 더 물어보세요. 결정을 미루고 상대의 선택을 기다리는 시간을 의식적으로 만드는 것이 필요합니다.'
      });
    }
    r.overlap.forEach(function (e) {
      if (out.length >= 4) return;
      var c = ELEM_CLASH_PAIR[e];
      if (!c) return;
      out.push({ title: c[0], body: c[1], fix: c[2] });
    });
    if (out.length < 2) {
      var sA = Math.max.apply(null, ['비겁', '식상', '재성', '관성', '인성'].map(function (g) { return A.sipsinCounts[g]; }));
      out.push({
        title: '무던함이 만드는 거리',
        body: '두 사람의 사주에 강한 충돌이 없습니다. 이 경우 싸움이 없는 대신 서운함이 말로 나오지 않아, 어느 날 갑자기 거리가 벌어져 있습니다. 싸우지 않는 것이 잘 맞는 것과 같지는 않습니다.',
        fix: '한 달에 한 번, 결론 없는 대화 30분을 정하세요. 해결하려 하지 말고 그냥 듣는 시간이 필요합니다.'
      });
    }
    return out.slice(0, 4);
  }

  function fightSequence(A, B, r, nA, nB) {
    var first = '말이 앞서는 쪽';
    if (A.sipsinCounts['식상'] > B.sipsinCounts['식상']) first = nA;
    else if (B.sipsinCounts['식상'] > A.sipsinCounts['식상']) first = nB;
    var silent = '침묵하는 쪽';
    if (A.sipsinCounts['인성'] > B.sipsinCounts['인성']) silent = nA;
    else if (B.sipsinCounts['인성'] > A.sipsinCounts['인성']) silent = nB;
    var t = '이 관계의 싸움은 보통 이렇게 흐릅니다. ';
    t += '<b>1단계</b> — ' + (first === '말이 앞서는 쪽' ? '한 사람' : first + ' 님') + '이 감정을 말로 먼저 꺼냅니다. ';
    t += '<b>2단계</b> — ' + (silent === '침묵하는 쪽' ? '상대' : silent + ' 님') + '은 그 자리에서 정리하려 하고 말수가 줄어듭니다. ';
    t += '<b>3단계</b> — 말이 줄어든 것을 무관심으로 받아들여, 먼저 꺼낸 쪽이 더 크게 화를 냅니다. ';
    t += '<b>4단계</b> — 결론 없이 끝나고, 같은 장면이 두 달 뒤에 반복됩니다. ';
    if (hasKw(r.jiRel, '충')) t += '충의 관계에서는 3단계에서 감정이 두 배로 커지기 쉬우니, 2단계에서 멈추는 것이 유일한 방법입니다.';
    else t += '이 순서를 끊으려면 2단계에서 "지금은 정리할 시간이 필요해"라고 말해주는 것만으로 충분합니다.';
    return t;
  }

  function rulesFor(A, B, r, nA, nB) {
    var out = [];
    if (hasKw(r.jiRel, '충')) out.push('매일 반복되는 생활(잠·식사·지출)은 항목별로 담당자를 정하고, 서로 간섭하지 않습니다.');
    else out.push('고민이 생기면 결론을 내기 전에 "지금 이야기해도 될까"를 먼저 묻습니다.');
    if (hasKw(r.jiRel, '형') || hasKw(r.jiRel, '파')) out.push('큰 결정은 일주일 전에 꺼내고, 결정일을 미리 정합니다. 즉석 결정을 피합니다.');
    else out.push('돈이 오가는 결정은 그 자리에서 정하지 않고 하루를 둡니다.');
    if (r.overlap.length) out.push(elemListKr(r.overlap) + ' 기운이 겹치는 자리(감정·명분·책임)에서는 한 사람이 말할 때 다른 사람은 끊지 않습니다.');
    else out.push('한 사람이 말하는 동안 끊지 않고, 끝까지 듣고 나서 한 문장으로 요약해 줍니다.');
    return out;
  }

  function fillOrderText(A, B, r, nA, nB) {
    var t = '';
    if (r.commonMissing.length) {
      t += '두 사람 모두에게 없는 <b>' + elemListKr(r.commonMissing) + '</b> 기운은 상대에게 기대할 수 없습니다. ';
      var bo = BOOST[r.commonMissing[0]];
      t += '대신 생활에서 함께 채울 수 있습니다. ' + bo.color + ' 계열의 소품, ' + bo.dir + ' 방향의 산책, ' + bo.act + ' 같은 활동이 여기에 해당합니다. 두 사람이 함께할 때 이 요소를 하나 넣어보세요. ';
    }
    if (r.fillB.length) {
      t += nA + ' 님이 ' + nB + ' 님에게 ' + elemListKr(r.fillB) + ' 기운을 채워줄 수 있습니다. ' + nB + ' 님이 무기력해 보이는 날은 이 기운이 필요한 날입니다. ';
    }
    if (r.fillA.length) {
      t += nB + ' 님이 ' + nA + ' 님에게 ' + elemListKr(r.fillA) + ' 기운을 채워줄 수 있습니다. ' + nA + ' 님이 조급해지는 날은 이 기운이 비어 있는 날입니다. ';
    }
    if (!r.fillA.length && !r.fillB.length) {
      t += '두 사람이 서로에게 없는 기운을 직접 채워주는 구조는 아닙니다. 그래서 이 관계는 상대를 바꾸려 하기보다, 각자 자기 빈자리를 생활 습관으로 메우는 것이 오래 갑니다.';
    }
    return t;
  }

  function moneyCompareTable(A, B, nA, nB) {
    function c(C, g) { return C.sipsinCounts[g]; }
    var rows = [
      ['재성(재물)', c(A, '재성') + '개 — ' + moneyStyle(A), c(B, '재성') + '개 — ' + moneyStyle(B)],
      ['비겁(지출·경쟁)', c(A, '비겁') + '개', c(B, '비겁') + '개'],
      ['식상(벌이·표현)', c(A, '식상') + '개', c(B, '식상') + '개'],
      ['관성(책임·규율)', c(A, '관성') + '개', c(B, '관성') + '개'],
      ['재물 점수', A.scores.money + '점', B.scores.money + '점']
    ];
    return '<table class="mini-table wide couple-table"><thead><tr><th>구분</th><th>' + esc(nA) + '</th><th>' + esc(nB) + '</th></tr></thead><tbody>' +
      rows.map(function (r2) { return '<tr><td class="row-head">' + r2[0] + '</td><td>' + esc(r2[1]) + '</td><td>' + esc(r2[2]) + '</td></tr>'; }).join('') +
      '</tbody></table>';
  }

  function moneyStyle(C) {
    var n = C.sipsinCounts['재성'];
    if (n >= 3) return '들어오는 돈도 많지만 나가는 길도 넓음';
    if (n === 0) return '돈이 눈에 잘 보이지 않는 구조';
    if (C.sipsinCounts['비겁'] >= 3) return '벌어도 지인·경쟁에서 새기 쉬움';
    return '성실하게 모으는 구조';
  }

  function moneyPairText(A, B, r, nA, nB) {
    var a = A.sipsinCounts['재성'], bb = B.sipsinCounts['재성'];
    var t = '';
    if (a >= 2 && bb >= 2) {
      t += '두 사람 모두 재성이 있어 돈이 오가는 일에 익숙합니다. 문제는 벌이가 아니라 <b>속도</b>입니다. 한쪽은 크게 벌고 크게 쓰고, 다른 쪽은 작게 벌어도 남기려 합니다. 이 차이는 아껴서가 아니라 기준이 달라서 생깁니다. ';
    } else if (a === 0 && bb === 0) {
      t += '두 사람 모두 재성이 비어 있습니다. 벌이가 없어서가 아니라, 돈을 관리하는 자리가 약하다는 뜻입니다. 통장을 하나로 두면 지출이 보이지 않으니, <b>고정지출·저축·여유자금</b> 계좌를 처음부터 나눠 두는 것이 이 관계에서 가장 현실적인 처방입니다. ';
    } else if (a === 0 || bb === 0) {
      var noJae = a === 0 ? nA : nB;
      var hasJae = a === 0 ? nB : nA;
      t += noJae + ' 님은 재성이 비어 있고 ' + hasJae + ' 님은 재성이 있습니다. 돈을 관리하는 역할은 자연스럽게 ' + hasJae + ' 님에게 몰립니다. 이것이 불만으로 굳지 않도록, ' + noJae + ' 님도 월 1회 가계를 함께 확인하는 자리를 만드세요. ';
    } else {
      t += '두 사람 모두 재성이 한두 개로 알맞습니다. 큰 위험 없이 모으는 구조이니, 한 사람이 관리하고 한 사람이 확인하는 방식이 잘 맞습니다. ';
    }
    if (A.sipsinCounts['비겁'] >= 3 && B.sipsinCounts['비겁'] >= 3) {
      t += '다만 두 사람 모두 비겁이 강해, 지인 거래·보증·동업에서 돈이 새기 쉽습니다. 돈이 오가는 일은 반드시 문서로 남기세요.';
    } else if (A.sipsinCounts['비겁'] >= 3 || B.sipsinCounts['비겁'] >= 3) {
      t += '한쪽의 비겁이 강해 지인·가족 문제로 돈이 나갈 수 있습니다. 두 사람이 함께 정한 금액을 넘는 지출은 상의하기로 정하세요.';
    } else {
      t += '비겁이 과하지 않아 지인 문제로 돈이 새는 일은 적은 편입니다.';
    }
    return t;
  }

  function choreText(A, B, r, nA, nB) {
    var t = '';
    var gA = A.sipsinCounts, gB = B.sipsinCounts;
    var who = [];
    if (gA['인성'] >= 2 || gA['관성'] >= 2) who.push(nA);
    if (gB['인성'] >= 2 || gB['관성'] >= 2) who.push(nB);
    if (who.length === 1) {
      t += who[0] + ' 님은 계획과 정리를 맡을 때 편안함을 느낍니다. 집안일을 "누가 더 많이 하느냐"로 세지 말고, ' + who[0] + ' 님이 기준과 순서를 정하고 다른 한 사람이 실행하는 방식으로 나누면 갈등이 줄어듭니다. ';
    } else if (who.length === 2) {
      t += '두 사람 모두 기준과 순서를 세우는 힘이 있습니다. 그래서 집안일의 "방식"을 두고 다투기 쉽습니다. 역할을 나누되 각자의 방식은 건드리지 않는 것이 핵심입니다. ';
    } else {
      t += '두 사람 모두 규칙에 묶이는 것을 답답해합니다. 집안일은 계획표보다 그때그때 처리하는 방식이 잘 맞습니다. 다만 미루는 일이 쌓이면 한쪽에 몰리므로, 최소한의 담당만 정해두세요. ';
    }
    if (hasKw(r.jiRel, '충')) {
      t += '일지에 충이 있어 생활 시간대(아침·저녁)가 다를 가능성이 큽니다. 같은 시간에 함께 있어야 한다는 기대를 내려놓으면 훨씬 편해집니다.';
    } else if (hasKw(r.jiRel, '육합')) {
      t += '일지에 육합이 있어 함께 있을 때 생활이 자연스럽게 맞물립니다. 같은 공간에서 각자 할 일을 하는 방식이 이 커플에게 잘 맞습니다.';
    } else {
      t += '생활 리듬은 크게 부딪히지 않습니다. 대신 서로가 알아서 해줄 것이라 기대하다 서운해지는 지점을 말로 확인하는 것이 필요합니다.';
    }
    return t;
  }

  function yearCrossTable(r, nA, nB) {
    var rows = r.yearCross.map(function (y) {
      var cls = y.bad >= 2 ? 'bad' : (y.good >= 2 ? 'good' : (y.bad === 1 ? 'mid' : ''));
      return '<tr><td>' + y.year + '년</td><td class="hanja-sm">' + y.gan + y.ji + '</td>' +
        '<td class="small">' + esc(y.relA) + '</td><td class="small">' + esc(y.relB) + '</td>' +
        '<td class="' + cls + '"><b>' + esc(y.verdict) + '</b>' + (y.daeunShift ? '<br><span class="muted small">' + esc(y.shiftWho) + ' 대운 전환</span>' : '') + '</td></tr>';
    }).join('');
    return '<table class="grid-table year-cross"><thead><tr><th>연도</th><th>간지</th><th>' + esc(nA) + ' 일지</th><th>' + esc(nB) + ' 일지</th><th>판정</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function yearCrossText(r, nA, nB) {
    var bad2 = r.yearCross.filter(function (y) { return y.bad >= 2; }).map(function (y) { return y.year + '년'; });
    var bad1 = r.yearCross.filter(function (y) { return y.bad === 1; }).map(function (y) { return y.year + '년'; });
    var good2 = r.yearCross.filter(function (y) { return y.good >= 2; }).map(function (y) { return y.year + '년'; });
    var t = '';
    if (bad2.length) {
      t += '<b>' + bad2.join('·') + '</b>은 두 사람의 일지에 동시에 충이 걸리거나 천간충이 겹치는 해입니다. 이 해에는 이사·이직·투자·양가 문제처럼 판을 바꾸는 결정을 겹쳐서 하지 마세요. 한 사람이 흔들릴 때 다른 사람이 중심을 잡아야 하는 해입니다. ';
    }
    if (bad1.length) {
      t += '<b>' + bad1.join('·') + '</b>은 한쪽만 흔들리는 해입니다. 흔들리는 쪽의 말을 "예민하다"고 넘기지 말고, 그 사람의 생활 기반(수면·일·돈)을 먼저 확인하세요. ';
    }
    if (good2.length) {
      t += '<b>' + good2.join('·') + '</b>은 두 사람의 일지에 합이 걸리는 해입니다. 결혼·동거·이사처럼 관계를 제도로 굳히는 결정은 이 해에 두면 훨씬 자연스럽게 진행됩니다. ';
    }
    if (!bad2.length && !bad1.length) {
      t += '앞으로 6년은 두 사람에게 동시에 큰 충이 걸리지 않습니다. 이 시기에 생활의 규칙과 돈의 구조를 정해두면, 나중에 흔들리는 해를 훨씬 수월하게 넘깁니다.';
    }
    return t;
  }

  function coupleMonthScore(A, B, ma, mb) {
    var eng = global.SajuEngine;
    var ra = eng.compatOf(A.ilji, ma.ji);
    var rb = eng.compatOf(B.ilji, mb.ji);
    var ga = eng.ganRelation(A.ilgan, ma.gan);
    var gb = eng.ganRelation(B.ilgan, mb.gan);
    var sc = 55;
    [[ra, ga, A, ma], [rb, gb, B, mb]].forEach(function (p) {
      var rel = p[0], grel = p[1], C = p[2], m = p[3];
      if (hasKw(rel, '육합')) sc += 12;
      if (hasKw(rel, '삼합')) sc += 7;
      if (hasKw(rel, '충')) sc -= 15;
      if (hasKw(rel, '형')) sc -= 7;
      if (hasKw(rel, '파')) sc -= 6;
      if (hasKw(rel, '해')) sc -= 4;
      if (hasKw(grel, '천간합')) sc += 5;
      if (hasKw(grel, '천간충')) sc -= 7;
      if (C.elements.missing.indexOf(m.yElem) >= 0) sc += 2;
    });
    if (A.elements.missing.indexOf(ma.yElem) >= 0 && B.elements.missing.indexOf(mb.yElem) >= 0) sc += 4;
    sc = clampScore(sc, 10, 96);
    return {
      score: sc,
      relA: ra, relB: rb,
      verdict: sc >= 74 ? '좋음' : (sc >= 62 ? '순조' : (sc >= 48 ? '평이' : '주의')),
      cls: sc >= 74 ? 'good' : (sc >= 62 ? 'ok' : (sc >= 48 ? 'mid' : 'bad')),
      use: sc >= 74 ? '결정·여행·양가 인사' : (sc >= 62 ? '대화·계획 세우기' : (sc >= 48 ? '평소대로' : '큰 지출·큰 대화는 다음 달로'))
    };
  }

  function coupleMonthTable(A, B, nA, nB) {
    var rows = '';
    A.monthly2027.forEach(function (ma, i) {
      var mb = B.monthly2027[i];
      var s = coupleMonthScore(A, B, ma, mb);
      rows += '<tr><td class="mon">' + String(ma.month) + '월</td>' +
        '<td class="small">' + (s.relA.length ? s.relA.join('·') : '-') + '</td>' +
        '<td class="small">' + (s.relB.length ? s.relB.join('·') : '-') + '</td>' +
        '<td class="' + s.cls + '"><b>' + s.score + '</b> ' + s.verdict + '</td>' +
        '<td class="small use">' + s.use + '</td></tr>';
    });
    return '<table class="grid-table month-couple"><thead><tr><th>월</th><th>' + esc(nA) + '</th><th>' + esc(nB) + '</th><th>기운</th><th>이 달에 할 일</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function monthList(list) {
    if (!list.length) return '없음';
    return list.map(function (x) { return x.m + '월'; }).join('·');
  }

  function eventPlan(A, B) {
    var ms = A.monthly2027.map(function (ma, i) {
      var mb = B.monthly2027[i];
      var s = coupleMonthScore(A, B, ma, mb);
      return { m: ma.month, s: s.score, relA: s.relA, relB: s.relB };
    });
    var byScore = ms.slice().sort(function (a, b) { return b.s - a.s; });
    var top = byScore.slice(0, 3).sort(function (a, b) { return a.m - b.m; });
    var bottom = byScore.slice(-2).sort(function (a, b) { return a.m - b.m; });
    var haeMonths = ms.filter(function (x) { return hasKw(x.relA, '해') || hasKw(x.relB, '해'); });
    var calmFamily = ms.filter(function (x) { return !hasKw(x.relA, '해') && !hasKw(x.relB, '해'); }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3).sort(function (a, b) { return a.m - b.m; });
    var dealMonths = byScore.filter(function (x) { return x.s >= 64; }).slice(0, 3).sort(function (a, b) { return a.m - b.m; });
    var weakDeal = byScore.filter(function (x) { return x.s < 50; }).sort(function (a, b) { return a.m - b.m; });
    return [
      ['함께 여행·휴식', monthList(top), monthList(bottom), '두 사람 일지에 합이 걸리는 달에 움직이면 같은 비용으로 관계가 더 편해집니다.'],
      ['가족 모임·양가 인사', monthList(calmFamily), monthList(haeMonths.length ? haeMonths : bottom), '해(害)가 걸리는 달은 두 사람 사이보다 바깥 사람이 문제를 만드는 달입니다.'],
      ['큰 지출·계약', monthList(dealMonths.length ? dealMonths : top), monthList(weakDeal.length ? weakDeal : bottom), '돈이 오가는 결정은 기운이 실린 달에 두고, 흔들리는 달에는 서명하지 마세요.']
    ];
  }

  function coupleMonthText(A, B, nA, nB) {
    var list = A.monthly2027.map(function (ma, i) {
      var s = coupleMonthScore(A, B, ma, B.monthly2027[i]);
      return { m: ma.month, s: s.score };
    });
    var sorted = list.slice().sort(function (a, b) { return b.s - a.s; });
    var best = sorted.slice(0, 3).sort(function (a, b) { return a.m - b.m; });
    var worst = sorted.slice(-2).sort(function (a, b) { return a.m - b.m; });
    return '두 사람 모두에게 기운이 실리는 달은 <b>' + best.map(function (x) { return x.m + '월(' + x.s + '점)'; }).join(', ') + '</b>입니다. 이 달에는 여행·이사·양가 인사처럼 두 사람이 함께 결정해야 하는 일을 두세요. 반대로 <b>' + worst.map(function (x) { return x.m + '월(' + x.s + '점)'; }).join(', ') + '</b>은 두 사람의 일지에 충이나 해가 걸리는 달입니다. 이 달에는 큰 지출과 큰 대화를 다음 달로 미루면 다툼의 절반이 줄어듭니다.';
  }

  function daeunCrossText(A, B, nA, nB) {    var curA = A.daeun.list.filter(function (d) { return d.current; })[0];
    var curB = B.daeun.list.filter(function (d) { return d.current; })[0];
    var t = '';
    if (curA) t += nA + ' 님은 지금 <b>' + curA.gan + curA.ji + '(' + curA.ganSipsin + ')</b> 대운, ' + curA.startAge + '~' + curA.endAge + '세(' + curA.startYear + '~' + curA.endYear + ')입니다. ';
    else t += nA + ' 님은 아직 첫 대운 전입니다. ';
    if (curB) t += nB + ' 님은 지금 <b>' + curB.gan + curB.ji + '(' + curB.ganSipsin + ')</b> 대운, ' + curB.startAge + '~' + curB.endAge + '세(' + curB.startYear + '~' + curB.endYear + ')입니다. ';
    else t += nB + ' 님은 아직 첫 대운 전입니다. ';

    if (curA && curB) {
      if (curA.endYear === curB.endYear) {
        t += '두 사람의 대운이 <b>' + curA.endYear + '년</b>에 함께 바뀝니다. 같은 해에 두 사람의 판이 동시에 바뀌면 생활 전체가 흔들리므로, 그 전후 1년은 이사·사업·큰 지출을 겹치지 않게 두는 것이 좋습니다. ';
      } else {
        t += '두 사람의 대운이 바뀌는 해가 서로 다릅니다(' + curA.endYear + '년, ' + curB.endYear + '년). 한 사람이 판을 바꾸는 동안 다른 사람은 그 변화를 받아주는 역할을 하게 됩니다. ';
      }
      var eA = elemListKr([curA.jiElem]);
      t += '지금 ' + nA + ' 님의 대운 지지가 ' + eA + ' 기운인데, 이 기운이 ' + nB + ' 님의 사주에서 ' + (B.elements.missing.indexOf(curA.jiElem) >= 0 ? '비어 있는 자리입니다. 이 대운 동안 ' + nA + ' 님이 ' + nB + ' 님에게 없던 것을 채워주는 역할을 하게 됩니다.' : '이미 강한 자리입니다. 이 대운 동안 ' + nA + ' 님의 그 기운이 ' + nB + ' 님에게는 부담으로 느껴질 수 있습니다.');
    }
    return t;
  }

  function daeunPairTable(A, B, nA, nB) {
    function row(label, d) {
      if (!d) return '';
      return '<tr><td>' + label + '</td><td class="small">' + d.startAge + '~' + d.endAge + '세<br>' + d.startYear + '~' + d.endYear + '</td>' +
        '<td class="hanja-sm">' + d.gan + d.ji + '</td><td class="small">' + d.ganSipsin + '/' + d.jiSipsin + '</td></tr>';
    }
    function slice(C) {
      var list = C.daeun.list;
      var idx = list.map(function (d) { return d.current; }).indexOf(true);
      if (idx < 0) idx = 0;
      return list.slice(idx, idx + 3);
    }
    var sa = slice(A), sb = slice(B);
    var rows = '';
    for (var i = 0; i < Math.max(sa.length, sb.length); i++) {
      var da = sa[i], db = sb[i];
      rows += '<tr><td class="row-head">' + (i === 0 ? '지금' : (i === 1 ? '다음' : '그다음')) + '</td>' +
        '<td class="small">' + (da ? da.gan + da.ji + ' · ' + da.startYear + '~' + da.endYear + ' (' + da.ganSipsin + ')' : '-') + '</td>' +
        '<td class="small">' + (db ? db.gan + db.ji + ' · ' + db.startYear + '~' + db.endYear + ' (' + db.ganSipsin + ')' : '-') + '</td></tr>';
    }
    return '<table class="mini-table wide couple-table"><thead><tr><th>시기</th><th>' + esc(nA) + '</th><th>' + esc(nB) + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
  }

  function daeunShiftAdvice(A, B, nA, nB) {
    var out = [];
    var listA = A.daeun.list, listB = B.daeun.list;
    var shiftA = listA.filter(function (d) { return d.startYear >= 2026 && d.startYear <= 2033; });
    var shiftB = listB.filter(function (d) { return d.startYear >= 2026 && d.startYear <= 2033; });
    if (shiftA.length) {
      out.push(nA + ' 님의 대운 전환(' + shiftA.map(function (d) { return d.startYear + '년 ' + d.gan + d.ji + ' ' + d.ganSipsin; }).join(', ') + ') — 전환 전후 6개월은 새 일을 벌이기보다 지금 하는 일을 정리하는 시기로 두세요.');
    } else {
      out.push(nA + ' 님은 앞으로 7년 안에 대운 전환이 없습니다. 지금의 판을 깊게 파는 데 집중하기 좋습니다.');
    }
    if (shiftB.length) {
      out.push(nB + ' 님의 대운 전환(' + shiftB.map(function (d) { return d.startYear + '년 ' + d.gan + d.ji + ' ' + d.ganSipsin; }).join(', ') + ') — 이 시기에 ' + nB + ' 님의 일과 돈의 구조가 바뀝니다. 두 사람의 생활비 구조를 미리 점검해 두세요.');
    } else {
      out.push(nB + ' 님은 앞으로 7년 안에 대운 전환이 없습니다. 관계의 리듬을 다듬기에 적합한 시기입니다.');
    }
    out.push('두 사람의 대운 전환이 같은 해에 겹치면 이사·사업·큰 지출을 그 해에 몰아두지 마세요. 한 해씩 나누는 것만으로도 흔들림이 크게 줄어듭니다.');
    return out;
  }

  function reconcileScript(A, B, r, nA, nB) {
    return [
      '<b>시작</b> — “지금 10분만 얘기해도 될까?” 시간을 먼저 정하면 상대는 공격이 아니라 대화로 받아들입니다.',
      '<b>사실과 감정</b> — “그때 네가 ' + (hasKw(r.jiRel, '충') ? '내 계획을 먼저 정했을 때' : '말을 그렇게 했을 때') + ' 나는 서운했어.” 평가가 아니라 그때의 내 감정만 말합니다.',
      '<b>요청</b> — “다음엔 ' + (A.sipsinCounts['인성'] >= 2 && B.sipsinCounts['인성'] >= 2 ? '정하기 전에 한 번만 물어봐 줘' : '내 말 끝까지 듣고 대답해 줘') + '.” 한 가지만 부탁합니다. 여러 개를 꺼내면 결론이 나지 않습니다.'
    ];
  }

  function avoidPhrases(A, B, r, nA, nB) {
    var out = [];
    if (hasKw(r.jiRel, '형') || hasKw(r.jiRel, '파')) {
      out.push(['그거 전에도 그랬잖아', '형·파의 관계에서는 과거를 소환할수록 대화가 재판이 됩니다. 지금 일만 다룰 때 풀립니다.']);
    }
    if (hasKw(r.jiRel, '충')) {
      out.push(['우린 애초에 안 맞아', '충의 관계에서 가장 위험한 말입니다. 다름을 확인하는 말이 아니라 관계를 부정하는 말이 됩니다.']);
    }
    if (A.sipsinCounts['비겁'] >= 3 || B.sipsinCounts['비겁'] >= 3) {
      out.push(['너는 항상 네 방식만 고집해', '주도권이 강한 사주에게는 가장 예민한 말입니다. “나는 이렇게 하고 싶어”로 바꿔 말하세요.']);
    }
    if (A.sipsinCounts['인성'] >= 3 || B.sipsinCounts['인성'] >= 3) {
      out.push(['말해도 뭐가 달라져', '생각이 많은 사주는 이 한마디에 말을 닫습니다. 대화를 끝내는 말이라 가장 오래 남습니다.']);
    }
    if (out.length < 2) {
      out.push(['괜찮아 (서운한데)', '괜찮다는 말로 넘기면 상대는 정말 괜찮은 줄 압니다. 이 관계는 참는 대신 말하는 쪽이 오래 갑니다.']);
    }
    if (out.length < 2) {
      out.push(['너도 그랬잖아', '상대의 잘못을 맞받아치는 순간 대화는 교환으로 바뀝니다. 한 번에 한 사람만 말하도록 정하세요.']);
    }
    return out.slice(0, 3);
  }

  function speakStyleText(C, name) {
    var g = C.sipsinCounts;
    var t = '';
    if (g['식상'] >= 3) t += name + ' 님은 말로 생각을 정리하는 사람입니다. 그래서 침묵이 무관심으로 보입니다. 말이 많다는 것을 이해한다는 신호로 받아들여 주세요. ';
    if (g['인성'] >= 3) t += name + ' 님은 혼자 정리하는 시간이 필요합니다. 대화를 요구하기 전에 "언제 이야기할 수 있어?"라고 시간을 물으면 훨씬 부드럽게 열립니다. ';
    if (g['관성'] >= 3) t += name + ' 님은 기준이 분명합니다. 기대를 말하지 않고 평가하면 상처가 됩니다. 원하는 것을 먼저 문장으로 말해 주세요. ';
    if (g['비겁'] >= 3) t += name + ' 님은 자기 방식이 확실합니다. 지적보다 제안으로 말할 때 훨씬 잘 듣습니다. ';
    if (g['재성'] >= 3) t += name + ' 님은 현실적인 결과로 애정을 확인합니다. 말보다 함께 해결해 주는 것이 마음을 여는 길입니다. ';
    if (!t) t += name + ' 님은 오행과 십성이 비교적 고른 편이라, 대화의 방식에 크게 예민하지 않습니다. 다만 편안함에 기대어 표현을 아끼면 서운함이 쌓입니다. ';
    return t;
  }

  function pairBoostText(A, B, r, nA, nB) {
    var target = r.commonMissing.length ? r.commonMissing[0] : (r.fillA[0] || r.fillB[0] || A.elements.motherElem);
    var bo = BOOST[target];
    var t = '두 사람이 함께 채워야 할 기운은 <b>' + ELEM_KR[target] + '</b>입니다. ';
    t += '색은 ' + bo.color + ', 방위는 ' + bo.dir + ', 숫자는 ' + bo.num + '입니다. ';
    t += '두 사람이 함께하는 활동에 ' + bo.act + '을 넣고, ' + bo.food + ' 쪽 식사를 한 달에 두 번은 함께 해보세요. ';
    t += '<b>생활 처방</b> — ' + bo.habit + ' 이 습관을 두 사람이 같이 하면 한 사람만 애쓰는 구조를 피할 수 있습니다. ';
    if (hasKw(r.jiRel, '충')) {
      t += '충의 관계에서는 같은 공간에서 각자 하는 시간이 필요합니다. 붙어 있는 시간을 늘리는 것보다, 각자의 방·시간을 보장하는 것이 관계를 오래 갑니다.';
    } else if (hasKw(r.jiRel, '육합')) {
      t += '육합의 관계에서는 함께하는 시간이 곧 개운입니다. 같은 목표를 하나 정해 함께 진행해 보세요.';
    } else {
      t += '관계를 묶어주는 힘이 약한 구조이니, 함께하는 정기적인 일정(주 1회 식사, 월 1회 나들이)을 달력에 먼저 넣어두는 것이 좋습니다.';
    }
    return t;
  }

  function threeMonthPlan(A, B, r, nA, nB) {
    var first = hasKw(r.jiRel, '충') ? '생활 리듬의 경계를 정하기 — 잠드는 시간, 지출 한도, 주말 하루를 각자 영역으로 합의합니다.' :
      (hasKw(r.jiRel, '형') ? '말투 규칙 정하기 — "너는 항상"을 금지어로 정하고, 판단은 하루 뒤로 미룹니다.' :
        '서운함을 그날 한 문장으로 말하는 연습 — 쌓아두지 않는 것이 이 관계의 핵심입니다.');
    var second = r.commonMissing.length
      ? ELEM_KR[r.commonMissing[0]] + ' 기운을 함께 채우기 — ' + BOOST[r.commonMissing[0]].act + '을 주 1회 함께 합니다.'
      : '돈의 구조를 나누기 — 고정지출·저축·여유자금 계좌를 분리하고 월 1회 함께 확인합니다.';
    var third = '화해 날짜를 달력에 미리 넣기 — 이 책 7부에 적힌 날짜에 미뤄둔 이야기를 꺼냅니다.';
    return [first, second, third];
  }

  function coupleLetter(A, B, r, ilA, ilB, nA, nB) {
    return '두 사람의 사주를 나란히 놓고 보면, 잘 맞는 부분보다 <b>어긋나는 부분</b>이 먼저 눈에 들어옵니다. 그래서 궁합을 본 사람들은 종종 실망합니다. 하지만 어긋남은 헤어질 이유가 아니라, 어디를 조율해야 하는지 알려주는 지도입니다. ' +
      nA + ' 님은 ' + ilA.title.split(' (')[0] + ', ' + nB + ' 님은 ' + ilB.title.split(' (')[0] + '의 기운을 타고났습니다. 두 재료는 다르지만, 다른 재료이기 때문에 서로에게 없는 것을 채울 수 있습니다. ' +
      '이 책에서 확인한 갈등 촉발 버튼과 화해 날짜는, 두 사람이 같은 자리에서 같은 방식으로 다투지 않기 위한 장치입니다. ' +
      '운은 한 번에 바뀌지 않습니다. 다만 같은 상황에서 한 번만 다르게 말해도 10년 뒤의 관계는 달라집니다. ' +
      '마지막 장에 적어둔 세 가지 중 하나만 이번 달에 해보시면, 그 한 번이 다음 계절의 씨앗이 됩니다.';
  }

  global.SajuBook = {
    build: build,
    finish: finish,
    escape: esc,
    birthLabel: birthLabel,
    hourLabel: hourLabel
  };
})(typeof window !== 'undefined' ? window : this);
