import fs from 'fs';

const newData: any = {
  '甲辰': {
    id: 'gap-jin',
    metadata: {
      kr_name: '갑진(甲辰)',
      en_name: 'Gap-jin (Wood-Dragon)',
      element: 'Wood-Earth',
      animal: 'Dragon',
      nature_symbol: { ko: "비옥한 대지를 뚫고 솟아오르는 청룡", en: "Azure Dragon Rising from Fertile Earth" }
    },
    core_identity: {
      persona: { ko: "거침없는 개척자", en: "Relentless Pioneer" },
      goth_punk_vibe: { ko: "고난을 씹어삼키며 진흙 속에서 당당히 하늘로 치솟는 자존감의 결정체", en: "An unyielding force of nature that devours hardships to fuel a magnificent ascent." },
      shadow_side: { ko: "자신의 이상이 너무 완벽한 나머지 주변의 사소한 현실을 무자비하게 짓밟고 지나가는 오만함", en: "An arrogance so blinded by a grand vision that it carelessly tramples over minor realities." }
    },
    behavior_metrics: { drive: 85, empathy: 55, stability: 60, unpredictability: 50 },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Su-saeng-mok"],
      caution_partner: ["Jin-sul-chung"]
    },
    narrative_blocks: {
      default: { ko: "탁월한 리더십과 끈덕진 생명력으로 척박한 환경조차 풍요롭게 탈바꿈시키는 마이더스의 손입니다.", en: "Blessed with stellar leadership and stubborn vitality, you have the golden touch to transform even the most barren environment into prosperity." },
      relationship: { ko: "스케일이 큰 포용력을 보여주지만, 스스로 정한 선을 넘는 순간 여의주를 빼앗긴 용처럼 차갑게 돌아섭니다.", en: "You show generous, wide-reaching love, but the moment your core boundaries are crossed, you turn as cold as a dragon stripped of its pearl." },
      timing_modifiers: {
        wood: { ko: "당신의 거대한 스케일이 마침내 날개를 달고 폭발적으로 확장하는 시기입니다.", en: "Your grand scale finally sprouts wings, leading to explosive expansion." },
        fire: { ko: "넘치는 생명력을 찬란하게 태워내며 사방에 당신의 매력과 능력을 뽐냅니다.", en: "You burn your overflowing vitality radiantly, broadcasting your charm and capability in all directions." },
        earth: { ko: "현실적인 영토가 넓어지는 시기지만, 지나친 욕심으로 인해 내면이 답답해질 수 있습니다.", en: "Your realistic territories expand, but excessive greed might lead to inner stagnation." },
        metal: { ko: "불필요한 가지가 잘려나가며 오히려 이상을 향한 목표가 날카롭게 벼려집니다.", en: "Unnecessary branches are pruned away, sharpening your focus toward your true ideals." },
        water: { ko: "충분한 영양을 머금고 더 높은 곳으로 치솟기 위한 심연의 휴식을 취합니다.", en: "You absorb immense nourishment, taking a restful retreat into the depths before soaring even higher." }
      }
    }
  },
  '乙巳': {
    id: 'eul-sa',
    metadata: {
      kr_name: '을사(乙巳)',
      en_name: 'Eul-sa (Wood-Snake)',
      element: 'Wood-Fire',
      animal: 'Snake',
      nature_symbol: { ko: "찬란한 불꽃을 품은 매혹적인 화초", en: "Enchanting Flower Embracing a Brilliant Flame" }
    },
    core_identity: {
      persona: { ko: "우아한 유혹자", en: "Elegant Seducer" },
      goth_punk_vibe: { ko: "불을 입에 머금고 유유히 춤을 추는, 기막힌 눈치와 화려한 퍼포먼스를 지닌 치명적 엔터테이너", en: "A fatal entertainer dancing gracefully with fire in their mouth, possessing striking intuition and flamboyant performance." },
      shadow_side: { ko: "속으로는 끊임없이 불안해하며 외부의 시선에 목말라 자신을 태워버리고 마는 치명적 허영심", en: "A fatal vanity driven by inner anxiety, burning oneself out in a constant thirst for external validation." }
    },
    behavior_metrics: { drive: 70, empathy: 75, stability: 40, unpredictability: 65 },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa"],
      caution_partner: ["Sa-hae-chung"]
    },
    narrative_blocks: {
      default: { ko: "순간적인 통찰력과 화려한 언변으로 대중을 사로잡지만, 그 이면에는 극도의 쓸쓸함이 숨어있습니다.", en: "You captivate crowds with flashes of brilliant insight and eloquent speech, yet conceal a profound sense of loneliness beneath." },
      relationship: { ko: "상대의 모든 것을 알면서도 모른 척 넘어가 주는 고단수 밀당의 귀재입니다.", en: "A master of push-and-pull, playing the coy game flawlessly while actually knowing every secret of your partner." },
      timing_modifiers: {
        wood: { ko: "나를 지지해주는 든든한 숲을 만나 불꽃이 들불처럼 맹렬하게 번져갑니다.", en: "Meeting a supportive forest, your inner flame spreads fiercely like a wildfire." },
        fire: { ko: "화려함의 극치. 다만 브레이크 없는 과도한 연소로 인한 탈진을 조심해야 합니다.", en: "The peak of flamboyance. Beware of exhaustion from unchecked, excessive combustion." },
        earth: { ko: "타고 남은 화려한 재가 마침내 실질적이고 단단한 결과물로 응결됩니다.", en: "The gorgeous ashes of your performance finally condense into solid, practical results." },
        metal: { ko: "날카로운 칼날이 다가오지만, 유연함과 재치로 위기를 보란 듯이 녹여버립니다.", en: "Sharp challenges approach, but you effortlessly melt the crisis away with your flexibility and wit." },
        water: { ko: "화려한 불꽃이 잠시 억눌리며 내면의 철학적 통찰이 비로소 성숙해지는 시기입니다.", en: "Your flamboyant flame is temporarily suppressed, allowing an inner philosophical maturity to fully blossom." }
      }
    }
  },
  '丙午': {
    id: 'byeong-o',
    metadata: {
      kr_name: '병오(丙午)',
      en_name: 'Byeong-o (Fire-Horse)',
      element: 'Fire-Fire',
      animal: 'Horse',
      nature_symbol: { ko: "타오르는 만물의 지배자, 태양", en: "Blazing Zenith Sun" }
    },
    core_identity: {
      persona: { ko: "맹렬한 폭군", en: "Fierce Sovereign" },
      goth_punk_vibe: { ko: "모든 것을 녹여버릴 듯한 양인의 에너지를 품고 거침없이 돌진하는 불의 화신", en: "An incarnation of absolute fire plunging forward with the melting momentum of a solar flare." },
      shadow_side: { ko: "브레이크가 고장 난 전차처럼 분노가 터지면 주변의 모든 관계마저 잿더미로 만들어버리는 폭력성", en: "An explosive temper like a runaway chariot, reducing every relationship to ashes when the anger boils over." }
    },
    behavior_metrics: { drive: 100, empathy: 50, stability: 30, unpredictability: 80 },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum"],
      caution_partner: ["Ja-o-chung"]
    },
    narrative_blocks: {
      default: { ko: "투명하고 솔직한 순수함으로 세상을 호령하지만, 그 강렬함이 가끔은 타인을 숨 막히게 만듭니다.", en: "You command the world with a transparent, honest purity, but your sheer intensity can sometimes suffocate others." },
      relationship: { ko: "사랑할 때도, 이별할 때도 100%의 에너지로 폭발하며 뒤끝 없이 쿨한 매력을 보여줍니다.", en: "Exploding with 100% energy in both loving and leaving, radiating a fiercely clean and untangled charm." },
      timing_modifiers: {
        wood: { ko: "기름을 들이부은 듯 열정이 한계를 모르고 폭주하는 위험하고도 찬란한 시기입니다.", en: "A glorious yet dangerous period where passion runs completely wild, like pouring gasoline on an open flame." },
        fire: { ko: "태양 두 개가 뜬 형국. 스스로를 통제하지 못하면 내가 불타버리는 치명적 순간이 옵니다.", en: "Two suns in the sky. If you cannot control yourself, a fatal moment of self-immolation approaches." },
        earth: { ko: "맹렬한 열기를 대지로 뿜어내며 한 템포 쉬어가는 생산적인 휴식기입니다.", en: "Exhaling your intense heat onto the earth, entering a productive phase of much-needed cooldown." },
        metal: { ko: "강력한 화력으로 커다란 철쇠를 녹여 엄청난 규모의 실질적 부(富)를 제련해냅니다.", en: "Using your immense firepower to melt heavy iron, forging a massive scale of tangible wealth." },
        water: { ko: "용광로에 물을 붓듯 치명적인 충돌과 텐션이 일어나며 삶의 극적인 변곡점을 맞이합니다.", en: "A dramatic inflection point arises with intense clashes, like throwing cold water directly into a blast furnace." }
      }
    }
  },
  '丁未': {
    id: 'jeong-mi',
    metadata: {
      kr_name: '정미(丁未)',
      en_name: 'Jeong-mi (Fire-Sheep)',
      element: 'Fire-Earth',
      animal: 'Sheep',
      nature_symbol: { ko: "열기를 품은 사막의 붉은 촛불", en: "Crimson Candle in a Parched Desert" }
    },
    core_identity: {
      persona: { ko: "고집스러운 장인", en: "Obstinate Artisan" },
      goth_punk_vibe: { ko: "모래바람 속에서도 꺼지지 않으려는 독기 어린 집념과 은근한 뜨거움을 숨긴 인내의 표상", en: "A beacon of unyielding endurance hiding a malicious grit, refusing to be extinguished even in the harshest sandstorms." },
      shadow_side: { ko: "겉으로는 온순해 보이지만 속은 용암처럼 끓고 있어 한 번 폭발하면 무섭게 돌변하는 극단성", en: "Appearing docile on the outside while boiling like magma within, capable of terrifying extremity when finally erupting." }
    },
    behavior_metrics: { drive: 75, empathy: 60, stability: 65, unpredictability: 60 },
    compatibility_tags: {
      ideal_partner: ["Hwa-saeng-to", "Mok-saeng-hwa"],
      caution_partner: ["Chuk-mi-chung"]
    },
    narrative_blocks: {
      default: { ko: "말수는 적지만 뼈를 때리는 촌철살인의 한마디를 지녔으며, 자신의 영역에서는 절대 밀리지 않습니다.", en: "Usually quiet, you possess a repertoire of bone-chilling, razor-sharp remarks and will absolutely never back down in your own territory." },
      relationship: { ko: "내 사람에게는 한없이 따뜻한 빛을 내어주지만, 배신당하면 사막의 태양처럼 상대를 말려 죽입니다.", en: "Emanating boundless warmth to those you love, but mercilessly drying out onto those who betray you like a desert sun." },
      timing_modifiers: {
        wood: { ko: "꺼져가던 촛불에 장작이 공급되며 마침내 오랫동안 갈고닦은 재능이 폭발합니다.", en: "Fresh firewood is supplied to a flickering candle, ultimately detonating the talents you've polished for so long." },
        fire: { ko: "내면의 고집과 열기가 극단으로 치달으며, 타인과의 날 선 텐션을 견뎌내야 합니다.", en: "Inner stubbornness and heat rush to the extreme, forcing you to endure sharp tensions with others." },
        earth: { ko: "메마르기 쉬운 환경에서 고군분투하며 무에서 유를 창조하는 혹독한 조율의 시기입니다.", en: "A period of grueling attunement as you struggle in a dry environment, creating something from absolutely nothing." },
        metal: { ko: "어둠 속에서 집중력을 발휘해 은밀하고도 정교하게 원하는 목적을 달성해냅니다.", en: "Harnessing intense concentration in the dark to covertly and exquisitely achieve your desired material goals." },
        water: { ko: "건조한 대지에 마침내 단비가 내리며 숨어있던 위기들이 씻겨 내려갑니다.", en: "A long-awaited rain finally falls upon the parched earth, washing away the hidden lingering crises." }
      }
    }
  },
  '戊申': {
    id: 'mu-sin',
    metadata: {
      kr_name: '무신(戊申)',
      en_name: 'Mu-sin (Earth-Monkey)',
      element: 'Earth-Metal',
      animal: 'Monkey',
      nature_symbol: { ko: "광맥을 품은 거대한 기암괴석", en: "Massive Crag Harboring an Ore Vein" }
    },
    core_identity: {
      persona: { ko: "철저한 기획자", en: "Calculated Architect" },
      goth_punk_vibe: { ko: "태산의 묵직함 속에 원숭이의 날카로운 재치를 숨기고, 조용히 판을 짜는 실리주의자", en: "A pragmatist quietly drafting the grand scheme, hiding a monkey's razor-sharp wit beneath the colossal weight of a mountain." },
      shadow_side: { ko: "이익이 되지 않는 관계와 감정을 얼음장처럼 차갑게 잘라내는 무명(無名)의 계산기", en: "A ruthless calculator that instantly and coldly severs any relationship or emotion deemed unprofitable." }
    },
    behavior_metrics: { drive: 80, empathy: 40, stability: 70, unpredictability: 55 },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum"],
      caution_partner: ["In-sin-chung"]
    },
    narrative_blocks: {
      default: { ko: "느긋해 보이지만 머릿속은 이미 세 수 앞을 내다보며 리스크를 헤징(Hedging)하고 있는 완벽주의자입니다.", en: "Although appearing relaxed, you are a perfectionist whose mind is already three steps ahead, hedging every possible risk." },
      relationship: { ko: "감정에 휘둘리지 않고 철저히 현실을 따지는 파트너지만, 한 번 품은 사람에게는 통 큰 의리를 보여줍니다.", en: "A highly pragmatic partner not swayed by sheer emotion, yet fiercely loyal and generous once someone enters your inner circle." },
      timing_modifiers: {
        wood: { ko: "안정적인 바위산을 뚫고 들어오는 변화의 묘목들로 인해 일상에 격렬한 텐션이 생깁니다.", en: "Intense tension shakes up your daily life as seedlings of change brutally drill through your stable bedrock." },
        fire: { ko: "내부의 철광석을 뜨겁게 제련해 마침내 빛나는 보석이라는 강력한 라이센스를 얻어냅니다.", en: "Hotly refining your internal iron ore to finally obtain a powerful license acting as a shining jewel." },
        earth: { ko: "흔들림 없는 절대적 멘탈을 장착하고 세상의 중심에서 굳건히 버티는 형국입니다.", en: "Equipped with an absolute, unshakable mentality, you stand firmly in the dead center of the world." },
        metal: { ko: "번뜩이는 아이디어와 엄청난 활동력이 폭발해 실질적인 수확을 강하게 거둬들입니다.", en: "Flashing ideas and immense activity explode, resulting in a fierce harvest of practical gains." },
        water: { ko: "숨겨둔 기량과 재치를 부드럽게 방출하며 커다란 재물의 흐름을 유연하게 타게 됩니다.", en: "Smoothly releasing your hidden skills and wit, seamlessly riding the flow of massive wealth distribution." }
      }
    }
  },
  '己酉': {
    id: 'gi-yu',
    metadata: {
      kr_name: '기유(己酉)',
      en_name: 'Gi-yu (Earth-Rooster)',
      element: 'Earth-Metal',
      animal: 'Rooster',
      nature_symbol: { ko: "가을 들판에 빛나는 황금 알", en: "Gleaming Golden Egg in an Autumn Field" }
    },
    core_identity: {
      persona: { ko: "예리한 실속파", en: "Astute Realist" },
      goth_punk_vibe: { ko: "부드러운 진흙 속에 날카로운 칼들을 촘촘히 숨겨둔 채, 결코 손해 보지 않는 섬세한 방어기제", en: "A meticulously delicate defense mechanism perfectly concealing rows of razor-sharp blades beneath soft clay, never playing a losing hand." },
      shadow_side: { ko: "자신의 안전과 결벽을 지키기 위해 타인의 작은 실수조차 바늘로 찌르듯 파고드는 지독한 예민함", en: "A virulent sensitivity that relentlessly nitpicks others' minor flaws like needles to protect your own safety and purity." }
    },
    behavior_metrics: { drive: 70, empathy: 65, stability: 75, unpredictability: 40 },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum"],
      caution_partner: ["Myo-yu-chung"]
    },
    narrative_blocks: {
      default: { ko: "어떤 상황에서도 부드럽게 처신하지만, 속으로는 이미 가치 판단을 끝내놓은 무서운 통찰력의 소유자입니다.", en: "You navigate any situation softly, but you possess a terrifying insight, having already finalized your judgments of value internally." },
      relationship: { ko: "섬세하게 챙겨주면서도 자신의 바운더리를 침범하면 가차 없이 팩트폭력으로 상대를 제압합니다.", en: "Taking delicate care of your partner, but instantly deploying ruthless, fact-based barrages the moment your boundary is violated." },
      timing_modifiers: {
        wood: { ko: "작은 텃밭에 억눌린 가시덤불이 자라며, 심리적으로 강한 긴장감과 압박을 느낄 수 있습니다.", en: "Intense psychological tension and pressure arise as thorny bushes push aggressively into your small, manicured garden." },
        fire: { ko: "날카로운 까칠함이 따뜻하게 보호받으며 마침내 안정적이고 권위 있는 지위를 성취합니다.", en: "Your sharp edges receive warm protection, finally elevating you to a stable and authoritative status." },
        earth: { ko: "비슷한 에너지가 뭉쳐 스파크가 튀지만, 끝내 나의 영역을 지켜내는 굳건함이 강조됩니다.", en: "Similar energies group up and spark conflicts, but an emphasis falls on the resilience to ultimately protect your turf." },
        metal: { ko: "뛰어난 두뇌와 손재주가 절정에 달해 미학적이면서도 정교한 결과물을 쏟아냅니다.", en: "Exceptional brains and dexterity reach their pinnacle, churning out precise, aesthetically pleasing outputs." },
        water: { ko: "결벽증적인 고집을 잠시 내려놓고 커다란 흐름에 몸을 맡김으로써 윤택한 보상을 얻습니다.", en: "Setting aside your fastidious stubbornness and yielding to the larger current heavily rewards you with abundance." }
      }
    }
  },
  '庚戌': {
    id: 'gyeong-sul',
    metadata: {
      kr_name: '경술(庚戌)',
      en_name: 'Gyeong-sul (Metal-Dog)',
      element: 'Metal-Earth',
      animal: 'Dog',
      nature_symbol: { ko: "전장을 지키는 하얀 늑대", en: "White Wolf Guarding the Battlefield" }
    },
    core_identity: {
      persona: { ko: "고독한 수호자", en: "Lone Guardian" },
      goth_punk_vibe: { ko: "괴강의 맹렬한 투쟁심으로 철갑을 두른 채, 홀로 적진에 서 있는 늑대 같은 카리스마", en: "The lone wolf charisma of standing fully armored on the enemy lines, radiating a fierce, combative spirit." },
      shadow_side: { ko: "끝까지 꺾이지 않으려는 아집이 결국 스스로와 주변을 지치게 만드는 파괴적 명예욕", en: "A destructive thirst for honor and a stubborn refusal to bend that ultimately exhausts both yourself and everyone around you." }
    },
    behavior_metrics: { drive: 95, empathy: 45, stability: 55, unpredictability: 60 },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Geum-saeng-su"],
      caution_partner: ["Jin-sul-chung"]
    },
    narrative_blocks: {
      default: { ko: "타협을 모르는 강직함으로 거센 풍파를 정면돌파하며 마침내 절대적 권위를 쥐는 타입입니다.", en: "An uncompromising rigidity that forces you to breach harsh storms head-on, eventually seizing absolute authority." },
      relationship: { ko: "한 번 맹세하면 죽을 때까지 지키는 순정을 가졌으나, 그 압도적인 무게감이 상대에겐 상처를 줄 수 있습니다.", en: "Bearing a devotion sworn unto death, though the overwhelming weight of that solemn promise can sometimes wound your partner." },
      timing_modifiers: {
        wood: { ko: "목표를 향해 검을 빼들고 거칠게 질주하며, 엄청난 재물과 권력을 두고 사투를 벌입니다.", en: "Drawing your sword and galloping wildly toward your target, waging a battle for immense wealth and power." },
        fire: { ko: "딱딱한 무쇠가 용광로를 만나 비로소 진짜 쓸모있는 명검으로 맹렬하게 담금질 되는 시간입니다.", en: "Hard iron finally meets the blast furnace, fiercely quenching into a truly spectacular and legendary blade." },
        earth: { ko: "철갑이 두꺼워져 자기 과신에 빠질 위험이 큽니다. 유연함을 잃으면 스스로 고립됩니다.", en: "The armor grows too thick, posing a risk of severe overconfidence. Losing flexibility means total isolation." },
        metal: { ko: "주변의 날 선 에너지들과 부딪히며 주도권을 장악하기 위한 생존 게임에 돌입합니다.", en: "Clashing with the sharp energies around you, diving into a ruthless game of survival to seize dominance." },
        water: { ko: "날카로운 투지가 차분하게 가라앉으며, 상처받은 마음을 씻어내어 맑고 기민한 두뇌를 되찾습니다.", en: "Your sharp fighting spirit settles calmly, washing away bruised emotions to recover a clear, nimble mind." }
      }
    }
  },
  '辛亥': {
    id: 'sin-hae',
    metadata: {
      kr_name: '신해(辛亥)',
      en_name: 'Sin-hae (Metal-Pig)',
      element: 'Metal-Water',
      animal: 'Pig',
      nature_symbol: { ko: "깊은 바다에 씻겨진 서늘한 보석", en: "Chilly Jewel Washed by the Deep Sea" }
    },
    core_identity: {
      persona: { ko: "서늘한 탐미주의자", en: "Chilly Aesthete" },
      goth_punk_vibe: { ko: "결백할 만큼 투명하고 맑지만, 타인의 위선을 단숨에 꿰뚫어 보는 얼음 송곳 같은 지성", en: "An intellect like an ice pick, flawlessly clear to the point of innocence, yet instantly piercing through the hypocrisy of others." },
      shadow_side: { ko: "티 하나 없는 고고함을 유지하려다 결국 세상과 섞이지 못하고 스스로를 가두는 차가운 단절", en: "A cold severance born of locking oneself away, forever unable to mix with the world to preserve a flawless, untainted solitude." }
    },
    behavior_metrics: { drive: 60, empathy: 55, stability: 50, unpredictability: 70 },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su"],
      caution_partner: ["Sa-hae-chung"]
    },
    narrative_blocks: {
      default: { ko: "비상한 두뇌와 뛰어난 직관력을 지녔으며, 감정을 낭비하지 않는 도도하고 세련된 매력을 발산합니다.", en: "Possessing an extraordinary brain and brilliant intuition, you exude a haughty, sophisticated charm without wasting any emotion." },
      relationship: { ko: "언제나 마음의 거리를 두며, 상대방이 내면의 선을 침범하는 순간 그 누구보다 매몰차게 차단합니다.", en: "Always keeping an emotional distance, you will shut your partner out more coldly than anyone the second they cross your inner boundary." },
      timing_modifiers: {
        wood: { ko: "깊은 바다를 헤쳐 귀중한 진주를 건져 올리듯, 번뜩이는 지능으로 거대한 성과를 만들어냅니다.", en: "Using flashing intellect to haul massive accomplishments out of the deep, just like diving for precious pearls." },
        fire: { ko: "얼음 같은 성향이 비로소 따뜻하게 녹아내리며 주변과 온화한 소통과 타협을 시작합니다.", en: "The icy disposition finally melts warmly, initiating gentle communication and compromise with the surroundings." },
        earth: { ko: "반짝이는 보석에 흙탕물이 튀는 격으로, 예민함이 폭발하고 정신적 답답함을 느낍니다.", en: "Mud splashes onto the shining jewel; your sensitivity explodes, plunging you into mental suffocation." },
        metal: { ko: "유사한 에너지들과 조우하며 보석의 광채를 다투는 치열하고 피곤한 라이벌리를 형성합니다.", en: "Encountering similar energies sets off a fierce, exhausting rivalry to see whose jewel shines the brightest." },
        water: { ko: "타고난 총명함과 깊은 예술성이 투명한 렌즈를 통해 필터 없이 쏟아져 나오는 절정기입니다.", en: "A peak phase where innate brilliance and profound artistry pour out entirely unstifled through a perfectly transparent lens." }
      }
    }
  },
  '壬子': {
    id: 'im-ja',
    metadata: {
      kr_name: '임자(壬子)',
      en_name: 'Im-ja (Water-Rat)',
      element: 'Water-Water',
      animal: 'Rat',
      nature_symbol: { ko: "모든 것을 집어삼키는 북풍한설의 겨울 바다", en: "Winter Ocean Swallowing the North Wind" }
    },
    core_identity: {
      persona: { ko: "심연의 제왕", en: "Lord of the Abyss" },
      goth_punk_vibe: { ko: "양인의 파도와도 같은 포스로 음지에서 거대한 판을 통제하는 절대적 지배자", en: "An absolute mastermind controlling massive structures from the shadows, boasting the unstoppable tidal force of a winter sea." },
      shadow_side: { ko: "생각이 너무 깊고 어두워, 스스로 만든 의심의 바다에 빠져 모든 것을 휩쓸어버리는 파괴적 성향", en: "Thoughts so deep and dark that you plunge into a self-made abyss of doubt, triggering a destructive nihilism that sweeps everything away." }
    },
    behavior_metrics: { drive: 90, empathy: 70, stability: 30, unpredictability: 85 },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "Geum-saeng-su"],
      caution_partner: ["Ja-o-chung"]
    },
    narrative_blocks: {
      default: { ko: "속을 알 수 없는 강력한 카리스마로 사람들을 이끌지만, 내면에는 끝모를 파도가 칩니다.", en: "Leading people with an unfathomable, powerful charisma, while an endless wave of deep solitude crashes within." },
      relationship: { ko: "한 번 마음을 열면 바다처럼 품어주나, 감정의 변덕이 해일처럼 덮칠 수 있습니다.", en: "Embracing someone like the ocean once opened, yet emotional whims can crash like a tidal wave." },
      timing_modifiers: {
        wood: { ko: "넘치는 지성을 창조적으로 발산하며 역동적인 에너지를 건설적인 방향으로 풉니다.", en: "Overflowing intelligence is creatively discharged, funneling dynamic energy into highly constructive paths." },
        fire: { ko: "엄청난 수압 속에서 불빛을 만나듯, 목숨을 건 재물과 권력의 텐션을 마주합니다.", en: "Encountering a flame within immense water pressure, colliding with colossal wealth amidst high-stakes tension." },
        earth: { ko: "범람하는 폭우를 커다란 제방이 수용해주며 혼란스럽던 삶이 강력한 통제력을 얻습니다.", en: "A massive dam finally contains the overflowing storm; your chaotic life gains formidable control." },
        metal: { ko: "수심이 끝도 없이 깊어지며 생각의 속도는 빨라지지만 고립감이 심화될 수 있습니다.", en: "The ocean depth drops infinitely and the speed of thought becomes dazzling, though the sense of isolation may deepen." },
        water: { ko: "제어할 수 없는 쓰나미. 폭주하는 감정과 주도권을 쥐기 위한 싸움이 격렬해지는 구간입니다.", en: "An uncontrollable tsunami. A treacherous period where run-away emotions and power struggles escalate violently." }
      }
    }
  },
  '癸丑': {
    id: 'gye-chuk',
    metadata: {
      kr_name: '계축(癸丑)',
      en_name: 'Gye-chuk (Water-Ox)',
      element: 'Water-Earth',
      animal: 'Ox',
      nature_symbol: { ko: "얼어붙은 동토를 짓밟고 나아가는 검은 황소", en: "Black Ox Trampling the Frozen Tundra" }
    },
    core_identity: {
      persona: { ko: "잔혹한 인내자", en: "Grim Endurer" },
      goth_punk_vibe: { ko: "백호대살의 기운을 서린 눈빛으로 밑바닥부터 묵묵히 끓어올라 판을 엎는 아웃사이더", en: "A ruthless outsider rising silently from the absolute bottom, eyes gleaming with a fierce intensity, ready to flip the world." },
      shadow_side: { ko: "얼어붙은 진흙 속에서 참아온 세월의 한(恨)이 터져 나오면 걷잡을 수 없는 복수심으로 발현됨", en: "A destructive thirst for vengeance when the years of resentment violently erupt from the frozen mud." }
    },
    behavior_metrics: { drive: 85, empathy: 50, stability: 60, unpredictability: 65 },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum"],
      caution_partner: ["Chuk-mi-chung"]
    },
    narrative_blocks: {
      default: { ko: "극한의 환경에서도 절대 포기하지 않는 집요함과, 눈에 보이지 않는 진실을 캐내는 독종입니다.", en: "Armed with a tenacity that absolutely never surrenders to extreme conditions, you are a powerhouse mining truths others miss." },
      relationship: { ko: "차갑게 보이지만 속으론 상대를 강박적으로 옭아매려는 강렬한 소유욕을 가진 매혹적인 결속입니다.", en: "Appearing cold on the surface, yet harboring an obsessive, possessive urge that creates a dangerously alluring bond." },
      timing_modifiers: {
        wood: { ko: "동토가 단단한 뿌리에 의해 깨지며, 억눌린 창의성과 돌파력이 맹렬히 터져 나옵니다.", en: "The permafrost cracks under strong roots, violently unleashing previously suppressed creativity and drive." },
        fire: { ko: "기나긴 겨울에 따뜻한 볕이 들며 얼어붙은 관계와 재물이 한순간에 녹아 흐릅니다.", en: "Warm sunlight finally grazes the long winter; deeply frozen relationships and wealth melt and flow explosively." },
        earth: { ko: "사방이 압박하는 칠흑 같은 상황 속에서 목숨을 건 인내력과 생존을 시험받습니다.", en: "A period of pitch-black patience where your life-or-death breakthrough ability is tested within suffocating pressure." },
        metal: { ko: "차가운 칼끝이 곧바로 실질적인 성과로 직결되며 고도로 치밀한 계산 위에서 목표를 얻어냅니다.", en: "Cold intensity connects directly with practical results; you achieve your targets based on highly scrupulous calculation." },
        water: { ko: "얼음물이 강물로 불어나듯, 강력한 추진력으로 장애물을 전부 휩쓸어버리고 목적지에 당도합니다.", en: "Like ice water swelling into a river, a dominant driving force sweeps away every obstacle and stubbornly reaches the destination." }
      }
    }
  }
};

let d = fs.readFileSync('src/data/ilju-dataset.ts', 'utf8');

for (const key of Object.keys(newData)) {
  const objStr = JSON.stringify(newData[key], null, 2);
  const formattedObj = objStr.split('\n').map((l, i) => i === 0 ? l : '    ' + l).join('\n');
  
  if (d.includes("'" + key + "':")) {
      console.log(key, "already exists, replacing...");
      const start = d.indexOf("'" + key + "':");
      const nextBrace = d.indexOf("},\n  '", start);
      if (nextBrace > -1) {
          d = d.substring(0, start) + "'" + key + "': " + formattedObj + d.substring(nextBrace);
      }
  } else {
      console.log(key, "new, injecting at the end");
      const lastBrace = d.lastIndexOf('};');
      d = d.substring(0, lastBrace) + ",\n  '" + key + "': " + formattedObj + "\n" + d.substring(lastBrace);
  }
}

fs.writeFileSync('src/data/ilju-dataset.ts', d, 'utf8');
