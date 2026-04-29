import * as fs from 'fs';

const newIljus = {
  '甲午': {
    id: 'gap-o',
    metadata: {
      kr_name: '갑오(甲午)',
      element: 'Wood-Fire',
      animal: 'Horse',
      nature_symbol: '불타는 유목'
    },
    core_identity: {
      persona: '소멸하는 자유주의자',
      goth_punk_vibe: '맹렬한 속도로 자신을 태워버리며 달리다 재가 되어 흩어지는 사막의 아웃로',
      shadow_side: '멈추는 순간 죽는다는 강박과 그로 인해 모든 에너지를 조기에 소진시켜 버리는 치명적 공허'
    },
    behavior_metrics: { drive: 95, empathy: 60, stability: 20, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ['Mok-saeng-hwa'], caution_partner: ['Ja-o-chung'] },
    narrative_blocks: {
      default: '브레이크 없는 엔진처럼 자신을 불태워 비극적이고도 눈부신 미학을 완성해 내는 영혼입니다.',
      relationship: '나를 구속하는 모든 것을 불태웁니다. 하지만 전부 타버린 후의 텅 빈 재투성이 곁엔 아무도 남아있지 않을 수 있습니다.',
      timing_modifiers: {
        wood: '자신을 태울 땔감을 아낌없이 얻어 광란의 질주를 벌이지만, 브레이크 고장으로 인한 탈선의 위기도 도사립니다.',
        fire: '내면의 불길이 폭발적으로 터져 나와 주변을 불살라 거대한 무대를 만듭니다. 가장 눈부시나 가장 빨리 타들어 갑니다.',
        earth: '속도를 늦추고 자신이 불태운 자리에 드디어 무언가(성과)를 남기기 시작합니다. 화려한 쇼가 현실적 이득으로 변환됩니다.',
        metal: '자신을 제어하려는 강압적 시스템과 거칠게 충돌하며 파열음을 냅니다. 상처받는 만큼 투쟁심도 극에 달합니다.',
        water: '미쳐 날뛰던 불길에 차가운 구속구가 채워집니다. 극심한 우울과 현타가 오지만 비로소 내면을 들여다볼 이성을 되찾습니다.'
      }
    }
  },
  '乙未': {
    id: 'eul-mi',
    metadata: {
      kr_name: '을미(乙未)',
      element: 'Wood-Earth',
      animal: 'Sheep',
      nature_symbol: '사막의 백호 가시덤굴'
    },
    core_identity: {
      persona: '지독한 개척자',
      goth_punk_vibe: '모래폭풍이 몰아치는 폐허 속에서도 피를 빨아들이듯 양분을 흡수해 기어코 가시를 세워내는 불사신',
      shadow_side: '살아남았다는 과시욕 뒤에 꼬리표처럼 붙어 있는 극심한 메마름과 타인을 향한 지독한 신경질'
    },
    behavior_metrics: { drive: 88, empathy: 40, stability: 55, unpredictability: 75 },
    compatibility_tags: { ideal_partner: ['Mok-geuk-to', 'Mok-saeng-hwa'], caution_partner: ['Chuk-mi-chung', 'Sul-mi-hyeong'] },
    narrative_blocks: {
      default: '가장 척박한 땅에서 살아남은 대가로 누구보다 날카로운 가시를 자라나게 만든 강인하고 예민한 서바이버입니다.',
      relationship: '곁에 오는 이를 가시로 찌르면서도 내심 사막의 비가 되어주길 바라는 결핍의 애증을 보여줍니다.',
      timing_modifiers: {
        wood: '매마른 가시덤굴에 동족들이 뒤엉켜 흡수 경쟁을 벌이는 피 튀기는 영토전쟁이 폭발합니다.',
        fire: '억눌려있던 열정(백호)이 가시덤굴을 타고 불타오르며 판을 뒤엎어버리는 파괴적인 쇼맨십을 터트립니다.',
        earth: '지독하게 일궈낸 사막의 파편들이 마침내 자신만의 요새로 단단히 굳어지며 집요한 소유욕이 극에 달합니다.',
        metal: '강철 같은 제재구들이 당신의 가지를 사정없이 쳐내며, 고통 속에서 불굴의 야성이 잔혹하게 제련받습니다.',
        water: '사막에 마침내 오아시스가 스며들어 살의를 거두고 지식과 영감에 몸을 적시며 치유의 휴식을 취합니다.'
      }
    }
  },
  '丙申': {
    id: 'byeong-sin',
    metadata: {
      kr_name: '병신(丙申)',
      element: 'Fire-Metal',
      animal: 'Monkey',
      nature_symbol: '석양에 불타는 샹들리에'
    },
    core_identity: {
      persona: '환멸의 다이아몬드',
      goth_punk_vibe: '눈부시게 화려하게 타오르는 빛 한가운데 덩그러니 놓인 공허하고 차가운 보석의 파편',
      shadow_side: '모든 것을 꿰뚫어 보는 빠른 눈치와 화려한 재능 이면에 도사리는 극악의 변덕과 냉정한 환멸'
    },
    behavior_metrics: { drive: 80, empathy: 50, stability: 40, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ['Hwa-geuk-geum', 'Sik-sang-saeng-jae'], caution_partner: ['In-sin-chung'] },
    narrative_blocks: {
      default: '누구보다 화려한 연출로 사람들을 홀리지만, 정작 성과물이 가장 빛나는 순간 흥미를 잃고 돌아서 버리는 냉혈한입니다.',
      relationship: '매혹적인 빛으로 단숨에 상대를 유혹하지만, 상대가 진짜 맨얼굴을 드러내는 순간 가차 없이 조명을 꺼버립니다.',
      timing_modifiers: {
        wood: '당신의 화려한 무대를 위한 든든한 뒷배(인성)가 등장해 내면의 빛이 더 강렬하게 뻗어 나가는 도약의 시기입니다.',
        fire: '폭주하는 자의식과 경쟁심이 샹들리에를 아예 녹여버릴 듯 타오르며, 브레이크 없는 소모전을 펼치게 됩니다.',
        earth: '어지러운 빛의 조각들이 차분한 현실의 틀(식상) 안에 안착하며, 비로소 구체적인 성과물과 자아 파악이 가능해집니다.',
        metal: '차가운 현실(재성)이라는 거대한 먹잇감이 떨어져, 당신의 화려한 능력이 차가운 자본주의 게임을 폭식하기 시작합니다.',
        water: '어두운 늪이 불을 꺼버리려 압박해옵니다. 권위율에 대한 반항 속에서 당신만의 차갑고 시니컬한 가치가 돋보입니다.'
      }
    }
  },
  '丁酉': {
    id: 'jeong-yu',
    metadata: {
      kr_name: '정유(丁酉)',
      element: 'Fire-Metal',
      animal: 'Rooster',
      nature_symbol: '작은 촛불로 세공하는 다이아몬드'
    },
    core_identity: {
      persona: '심야의 세공사',
      goth_punk_vibe: '피 한 방울 묻히지 않고 보석을 깎아내는, 병적일 정도로 섬세한 완벽주의와 차가운 미학의 덩어리',
      shadow_side: '미세한 흠집 하나조차 견디지 못하고 모든 것을 리셋해 버리려는 강박증적 예민함과 자해적 피로도'
    },
    behavior_metrics: { drive: 70, empathy: 60, stability: 50, unpredictability: 60 },
    compatibility_tags: { ideal_partner: ['Hwa-geuk-geum'], caution_partner: ['Myo-yu-chung'] },
    narrative_blocks: {
      default: '가장 순도 높고 고결한 결과를 만들어 내기 위해, 불면의 밤을 새우며 스스로를 깎아내는 장인 기질을 가졌습니다.',
      relationship: '나의 다이아몬드에 지문을 묻히는 것을 극도로 혐오합니다. 상대방은 철저히 내 기준에 맞게 세공되어야만 합니다.',
      timing_modifiers: {
        wood: '아낌없이 주어지는 땔감 덕분에 당신의 작업실이 환해지며, 억눌렀던 강박적 완벽주의가 찬란한 영감으로 만개합니다.',
        fire: '동족들이 불나방처럼 몰려와 다이아몬드의 파이를 뺏으려 하는 피비린내 나는 생존 경쟁의 난투극이 벌어집니다.',
        earth: '작업실의 열기를 식히고 창의적 파편(식상)들을 모아, 비로소 세상밖에 내놓을 강력한 한 방을 조직화합니다.',
        metal: '세상 도처에 널린 거친 원석(재성)들을 모조리 깎아내려는 극한의 물욕이 폭발하며 수면마저 잊은 채 노동합니다.',
        water: '어둠의 압력(관성)이 다가옵니다. 치명적인 불안과 초조함에 떠밀려 불씨가 꺼지기 전 결사적으로 작품을 완성하려 듭니다.'
      }
    }
  },
  '戊戌': {
    id: 'mu-sul',
    metadata: {
      kr_name: '무술(戊戌)',
      element: 'Earth-Earth',
      animal: 'Dog',
      nature_symbol: '적막한 황야의 철옹성'
    },
    core_identity: {
      persona: '고립된 독재자',
      goth_punk_vibe: '괴강살의 압도적 위압감으로 무장한 채, 피바람 부는 황야에서 자신의 제국을 한 치의 양보도 없이 수호하는 군주',
      shadow_side: '어떤 외부의 에너지도 차단해버린 탓에 성벽 안에 쌓여만 가는 극도의 숨막힘과 편집증적 쇄국주의'
    },
    behavior_metrics: { drive: 95, empathy: 20, stability: 85, unpredictability: 60 },
    compatibility_tags: { ideal_partner: ['To-saeng-geum'], caution_partner: ['Jin-sul-chung'] },
    narrative_blocks: {
      default: '한 번 내린 결정은 천지가 개벽해도 바꾸지 않는 괴강살 특유의 타협 없는 고집과 압도적인 장악력을 가졌습니다.',
      relationship: '당신의 요새 안으로 들어오려면 완전한 복종을 맹세해야 합니다. 룰을 어긴 영혼은 사막 너머로 가차 없이 처형당합니다.',
      timing_modifiers: {
        wood: '콘크리트를 뚫고 들어오는 가시덩굴처럼, 당신의 오만한 독재를 흔드는 충격적인 외압과 마찰을 정면으로 맞붙습니다.',
        fire: '강력한 신념(인성)이 무기에 부여되어 철옹성은 더욱 거대해지고, 세상에 군림하기 위한 이론적 무장까지 마칩니다.',
        earth: '거대한 황야에 태풍이 일듯, 걷잡을 수 없는 자기 확신과 배타성이 폭주해 스스로를 거대한 모래무덤에 가둬버립니다.',
        metal: '드디어 굳게 다문 성문을 열고 폭력적인 아웃풋(식상)을 뿜어내며 주변을 강압적으로 다스리고 통제합니다.',
        water: '메마른 사막을 쩍쩍 갈라지게 하던 갈증 뒤에 거대한 재물(재성)의 단비가 내리며, 얼어붙은 독재자가 유흥에 눈을 뜹니다.'
      }
    }
  },
  '己亥': {
    id: 'gi-hae',
    metadata: {
      kr_name: '기해(己亥)',
      element: 'Earth-Water',
      animal: 'Pig',
      nature_symbol: '오염된 늪에 숨겨진 비밀 데이터'
    },
    core_identity: {
      persona: '음지의 설계자',
      goth_punk_vibe: '세상의 탁류를 말없이 품고 진흙 속에 가라앉은 기묘한 지식들을 은밀하게 빨아들이는 다크웹의 관리자',
      shadow_side: '모든 비밀주의와 현실주의가 교차하며 생기는 만성적인 내적 분열과 끝없는 표류에 대한 공포'
    },
    behavior_metrics: { drive: 60, empathy: 85, stability: 40, unpredictability: 70 },
    compatibility_tags: { ideal_partner: ['To-geuk-su'], caution_partner: ['Sa-hae-chung'] },
    narrative_blocks: {
      default: '흙탕물 속에서도 치명적인 비밀 자산과 지능을 조용히 장악하여 뒤에서 판을 흔드는 실리주의 끝판왕입니다.',
      relationship: '나 자신의 치부는 두꺼운 진흙 속에 숨기지만, 상대방의 영혼은 밑바닥까지 빨아들이려 하는 기묘한 이중성을 지닙니다.',
      timing_modifiers: {
        wood: '늪 위로 독을 품은 나무가 뻗어나가는 형국. 당신을 위협하는 강압적 규율 속에 가시 돋친 신경전이 터집니다.',
        fire: '음침했던 늪지에 기묘한 조명(인성)이 내리쬐며, 숨겨왔던 당신의 딥웹 자산이 세상에 비범한 가치로 인정받습니다.',
        earth: '동족들이 늪지로 몰려와 나의 비밀 캐시를 나눠 가지려 하는, 불신과 연대가 뒤죽박죽된 생존 게임이 열립니다.',
        metal: '숨겨진 탁류가 표면화되며 당신의 창의적이고 자극적인 영감(식상)이 잔인한 팩트 폭력으로 세상에 터져 나옵니다.',
        water: '거대한 해일이 진흙을 완전히 삼키려 합니다. 속수무책으로 거대한 재물의 폭포수 속에 휩쓸리는 아노미를 조심하십시오.'
      }
    }
  },
  '庚子': {
    id: 'gyeong-ja',
    metadata: {
      kr_name: '경자(庚子)',
      element: 'Metal-Water',
      animal: 'Rat',
      nature_symbol: '차가운 해저에서 맴도는 날카로운 소음'
    },
    core_identity: {
      persona: '빙해의 칼날',
      goth_punk_vibe: '심해의 차가운 정적 속을 단칼에 베어버리는, 냉혹할 만큼 이성적이고 예리한 디스토피아의 사수',
      shadow_side: '스스로의 지나친 예리함에 찔려 얼어붙는 허무주의. 타인의 미세한 온도조차 혐오하게 되는 극한의 결벽'
    },
    behavior_metrics: { drive: 80, empathy: 20, stability: 40, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ['Geum-saeng-su'], caution_partner: ['Ja-o-chung'] },
    narrative_blocks: {
      default: '가장 깊고 어두운 물속에서도 절대 녹슬지 않는 지성으로 모순투성이 현실을 예리하게 난도질하는 저격수입니다.',
      relationship: '바닥 모를 심연까지 나의 이성을 복종시키려 합니다. 상대방의 감정적 나약함이 드러나면 해저 지진처럼 차갑게 뒤집어 엎어버립니다.',
      timing_modifiers: {
        wood: '얼어붙은 물길이 강제로 뚫리고 날 선 칼날이 거대한 탐욕(재성)의 숲을 짓이기며 잔혹한 사냥을 감행합니다.',
        fire: '극강의 한기에 뜨거운 용광로(관성)가 부딪혀 치명적 굉음과 폭발을 냅니다. 타협 없는 반항이 파장을 일으키는 고위험 페이즈입니다.',
        earth: '심해의 칼끝이 잠시 흑진주를 품듯, 당신을 지지하는 온기어린 철학(인성)이 개입하여 날카로움이 묵직한 카리스마로 바뀝니다.',
        metal: '빙해를 가르는 쌍동선처럼, 당신과 닮은 냉혈한들과의 동맹과 파이 다툼으로 치열한 금속 마찰음이 서식지에 울려 펴집니다.',
        water: '당신의 비판성이 거대한 우울의 해일에 휩쓸립니다. 세상에 대한 날 선 조소가 주체할 수 없는 극단의 허무주의(식상)로 가라앉습니다.'
      }
    }
  },
  '辛丑': {
    id: 'sin-chuk',
    metadata: {
      kr_name: '신축(辛丑)',
      element: 'Metal-Earth',
      animal: 'Ox',
      nature_symbol: '얼어붙은 수술용 칼'
    },
    core_identity: {
      persona: '설원의 외과의사',
      goth_punk_vibe: '지독한 인내(축토) 속에 가장 뾰족하고 정밀한 칼날(신금)을 묻어둔 신경질적인 완벽주의자',
      shadow_side: '모든 것을 낱낱이 해부하지 않고는 베길 수 없는 자폐적 분석벽. 흠집 난 자신을 용서하지 못하는 자기 혐오'
    },
    behavior_metrics: { drive: 75, empathy: 30, stability: 70, unpredictability: 60 },
    compatibility_tags: { ideal_partner: ['To-saeng-geum'], caution_partner: ['Chuk-mi-chung', 'Chuk-sul-hyeong'] },
    narrative_blocks: {
      default: '영구동토 속에서도 부패하지 않는 극강의 이성으로 세상의 병든 부위를 예리하게 도려내는 독한 감각을 가졌습니다.',
      relationship: '상대방 속에 묻힌 본질을 집요할 정도로 캐내고 분석합니다. 관계조차 당신에겐 무균실에 올려둔 수술대 같습니다.',
      timing_modifiers: {
        wood: '꽁꽁 언 동토 위에 서릿발 같은 당신의 칼이 박히며, 마침내 숨겨진 전리품(재성)을 가차 없이 적출해 내는 타이밍입니다.',
        fire: '가장 무서워하던 화염(관성)이 수술실을 덮칩니다. 극도의 신경전 속에서 내 칼이 녹을까, 적을 찌를까 아찔한 생존게임이 전개됩니다.',
        earth: '견고한 흙무덤이 더욱 굳어져, 외부와 완벽히 단절된 나만의 철옹성에서 집요하게 은밀한 성장에 몰두합니다.',
        metal: '차가운 동족들이 메스를 들고 모여들어 난도질에 합세합니다. 동업과 배신의 경계에서 날카로운 신경전이 핏물을 부릅니다.',
        water: '얼어붙었던 사고방식이 녹아내리며, 당신의 뾰족한 칼날이 비로소 섬뜩하고 직관적인 창의력(식상)으로 변모 발산됩니다.'
      }
    }
  },
  '壬寅': {
    id: 'im-in',
    metadata: {
      kr_name: '임인(壬寅)',
      element: 'Water-Wood',
      animal: 'Tiger',
      nature_symbol: '검은 숲에 내리는 장대비'
    },
    core_identity: {
      persona: '우울한 창조수',
      goth_punk_vibe: '거대한 어둠과 포식자의 본능이 교차하는 밀림 속, 우울하지만 생명력 넘치는 비를 뿌리는 몽상가',
      shadow_side: '넓게 번지려는 호기심과 모든 것을 집어삼키는 충동성, 그 간극에서 겪는 끝없는 표류와 내면의 공허함'
    },
    behavior_metrics: { drive: 85, empathy: 70, stability: 30, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ['Su-saeng-mok'], caution_partner: ['In-sin-chung'] },
    narrative_blocks: {
      default: '어둠 속을 누비는 맹수의 파괴력과 비를 머금은 지배적 직관이 섞여, 속을 알 수 없는 매혹적인 돌연변이적 에너지를 냅니다.',
      relationship: '상대에게 조건 없이 쏟아지는 소나기처럼 관대하다가도, 한순간 맹수처럼 변해 통제할 수 없는 야성으로 판을 부숴버립니다.',
      timing_modifiers: {
        wood: '검은 숲의 나무들이 미친 듯이 뿌리를 뻗으며 자라납니다. 폭발적인 끼와 호기심(식상)이 모든 판도를 뒤흔드는 과잉기입니다.',
        fire: '내리던 비가 거대한 산불(재성)과 만나 맹렬한 증기를 풉니다. 통제 불능의 탐욕과 치명적인 카리스마가 뿜어져 나옵니다.',
        earth: '야만적인 숲에 댐이 세워지며, 강압적 책임감(관성)이 당신의 자유로운 충동을 매섭게 통제하고 재단하는 인고의 시간입니다.',
        metal: '강철 같은 제약이 당신의 영감을 구체적인 로직(인성)으로 벼려, 맹수의 발톱 안에 지독한 계산과 예리한 철학을 박아넣습니다.',
        water: '끝없이 비가 내려 숲이 바다에 잠깁니다. 통제할 수 없는 자의식 폭주와 쓰나미 같은 고위험 자립이 파멸 혹은 혁명을 부릅니다.'
      }
    }
  },
  '癸卯': {
    id: 'gye-myo',
    metadata: {
      kr_name: '계묘(癸卯)',
      element: 'Water-Wood',
      animal: 'Rabbit',
      nature_symbol: '어스름 숲의 밤비'
    },
    core_identity: {
      persona: '신비주의 뱀파이어',
      goth_punk_vibe: '아무도 모르게 스며들어 연약한 초목을 키워내지만, 동시에 상대방의 빛을 천천히 앗아가는 서늘한 치명성',
      shadow_side: '모든 곳에 스며야 한다는 구원자 콤플렉스와, 정작 자신은 아무것도 잡지 못하고 증발해 버린다는 신경증'
    },
    behavior_metrics: { drive: 60, empathy: 95, stability: 40, unpredictability: 80 },
    compatibility_tags: { ideal_partner: ['Su-saeng-mok'], caution_partner: ['Myo-yu-chung'] },
    narrative_blocks: {
      default: '보이지 않는 곳에서 미세하게 세상을 적시며, 기괴하고도 아름다운 영감을 가장 섬세하게 퍼뜨리는 예술적 영혼입니다.',
      relationship: '온몸을 바쳐 상대방의 상처를 적셔주지만, 스스로의 텐션이 붕괴될 땐 가차 없이 한순간 수증기처럼 날아가 흔적을 지웁니다.',
      timing_modifiers: {
        wood: '어스름 숲의 식생이 무섭게 번식합니다. 극도의 예민한 자의식과 창의력(식상)이 신경망처럼 현실을 점령합니다.',
        fire: '밤비가 거대한 불가마(재성) 속으로 투신하듯, 불나방 같은 재물욕망을 쫓으며 자아가 치명적으로 증발하는 위기가 도래합니다.',
        earth: '진흙탕에 발이 묶인 빗방울. 잔혹한 현실의 압력(관성)이 당신의 몽환극을 깨고 짓밟아, 심연의 바닥을 맛보게 합니다.',
        metal: '소름 돋을 만큼 정확한 데이터 베이스(인성)가 당신의 촉을 지지하며, 유약함 뒤에 숨겨진 차가운 분석의 신검을 뽑아 듭니다.',
        water: '작은 비가 거대한 범람이 되어 자의식의 홍수를 일으킵니다. 유연하던 태도가 집요한 물웅덩이가 되어 타인을 집어삼키는 광기로 번집니다.'
      }
    }
  }
};

let content = fs.readFileSync('./src/data/ilju-dataset.ts', 'utf8');

for (const [key, value] of Object.entries(newIljus)) {
    const isExisting = content.includes(`'${key}': {`) || content.includes(`"${key}": {`);
    
    const block = `  '${key}': {
    id: '${value.id}',
    metadata: {
      kr_name: '${value.metadata.kr_name}',
      element: '${value.metadata.element}',
      animal: '${value.metadata.animal}',
      nature_symbol: '${value.metadata.nature_symbol}'
    },
    core_identity: {
      persona: '${value.core_identity.persona}',
      goth_punk_vibe: '${value.core_identity.goth_punk_vibe}',
      shadow_side: '${value.core_identity.shadow_side}'
    },
    behavior_metrics: { drive: ${value.behavior_metrics.drive}, empathy: ${value.behavior_metrics.empathy}, stability: ${value.behavior_metrics.stability}, unpredictability: ${value.behavior_metrics.unpredictability} },
    compatibility_tags: { ideal_partner: ${JSON.stringify(value.compatibility_tags.ideal_partner)}, caution_partner: ${JSON.stringify(value.compatibility_tags.caution_partner)} },
    narrative_blocks: {
      default: '${value.narrative_blocks.default}',
      relationship: '${value.narrative_blocks.relationship}',
      timing_modifiers: {
        wood: '${value.narrative_blocks.timing_modifiers.wood}',
        fire: '${value.narrative_blocks.timing_modifiers.fire}',
        earth: '${value.narrative_blocks.timing_modifiers.earth}',
        metal: '${value.narrative_blocks.timing_modifiers.metal}',
        water: '${value.narrative_blocks.timing_modifiers.water}'
      }
    }
  },`;

    if (isExisting) {
        // Regex to replace from the key up to the end of narrative_blocks
        const rx = new RegExp(`('${key}'|"${key}"): \\{[\\s\\S]*?narrative_blocks: \\{[\\s\\S]*?\\}\\n\\s{4}\\},?`);
        content = content.replace(rx, block);
    } else {
        content = content.replace('export const ILJU_DATASET: Record<string, IljuData> = {', `export const ILJU_DATASET: Record<string, IljuData> = {\n${block}`);
    }
}

fs.writeFileSync('./src/data/ilju-dataset.ts', content, 'utf8');
console.log('Update Phase 4 complete.');
