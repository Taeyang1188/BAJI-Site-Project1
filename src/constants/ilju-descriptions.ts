export interface IljuDescription {
  ko: string;
  en: string;
  impression: string;
  cardBg?: string;
  detailImg?: string;
}

export const ILJU_DESCRIPTIONS: Record<string, IljuDescription> = {
  "甲子": { 
    ko: "갑자일주는 지혜롭고 자존심이 강한 편이야. 새로운 시작을 두려워하지 않는 선구자적 기질이 있지.", 
    en: "Gap-ja is wise and quite proud. You have a pioneering spirit that doesn't fear new beginnings.",
    impression: "지적인 분위기가 풍기네. 왠지 남들보다 한 발 앞서서 세상을 관찰하는 느낌이랄까?"
  },
  "甲戌": { 
    ko: "갑술일주는 책임감이 강하고 현실적인 안목이 뛰어나. 주변 사람들을 챙기는 포용력도 있고.", 
    en: "Gap-sul has a strong sense of responsibility and practical vision. You're good at taking care of people.",
    impression: "현실 감각이 꽤 예리하네. 헛된 꿈보다는 확실한 실속을 챙기는 타입이지?",
    cardBg: "https://i.imgur.com/75bkukE.jpeg",
    detailImg: "https://i.imgur.com/YGYRHxl.jpeg"
  },
  "甲申": { 
    ko: "갑신일주는 재치가 넘치고 임기응변에 강해. 변화무쌍한 환경에서도 자신만의 길을 찾아내지.", 
    en: "Gap-sin is witty and great at thinking on your feet. You find your own way even in chaos.",
    impression: "눈치가 빠르네. 어떤 상황에서도 살아남을 것 같은 영리함이 보여."
  },
  "甲午": { 
    ko: "갑오일주는 열정적이고 표현력이 풍부해. 화려한 재능으로 시선을 사로잡는 매력이 있지.", 
    en: "Gap-o is passionate and expressive. You have that charm that naturally grabs attention.",
    impression: "자기표현이 확실하네. 굳이 애쓰지 않아도 존재감이 드러나는 스타일이야."
  },
  "甲辰": { 
    ko: "갑진일주는 끈기 있고 내면의 힘이 강해. 목표를 향해 묵묵히 나아가는 뚝심이 있지.", 
    en: "Gap-jin is persistent with inner strength. Your determination to reach goals is impressive.",
    impression: "속이 꽤 깊고 단단하네. 한 번 마음먹으면 끝까지 밀어붙이는 고집이 느껴져."
  },
  "甲寅": { 
    ko: "갑인일주는 독립심이 매우 강하고 리더십이 있어. 자신의 신념을 굽히지 않는 당당함이 특징이야.", 
    en: "Gap-in is super independent and a natural leader. Your confidence in your beliefs is clear.",
    impression: "자기 주관이 뚜렷하네. 남의 눈치 안 보고 제 갈 길 가는 모습이 꽤 시크해 보여."
  },
  "乙丑": { 
    ko: "을축일주는 성실하고 인내심이 강해. 어려운 환경에서도 결국 꽃을 피워내는 강인함이 있지.", 
    en: "Eul-chuk is diligent and patient. You have that resilience to bloom even in tough spots.",
    impression: "겉으론 유해 보여도 속은 꽤 독종이네. 조용히 자기 실속 다 챙기는 타입이지?"
  },
  "乙亥": { 
    ko: "을해일주는 감수성이 풍부하고 지혜로워. 타인과 공감하고 소통하는 능력이 탁월하지.", 
    en: "Eul-hae is sensitive and wise. You're amazing at empathizing and connecting with others.",
    impression: "생각이 많고 섬세하네. 왠지 남들이 못 보는 디테일을 읽어내는 눈이 있을 것 같아."
  },
  "乙酉": { 
    ko: "을유일주는 섬세하고 예리한 감각을 지녔어. 자신만의 기준이 확고하고 깔끔한 성격이지.", 
    en: "Eul-yu has delicate and sharp senses. You have firm standards and a neat personality.",
    impression: "감각이 꽤 예민하네. 너만의 선이 확실해서 남들이 함부로 넘기 힘들 것 같아.",
    cardBg: "https://i.imgur.com/t3rEtJa.jpeg",
    detailImg: "https://i.imgur.com/ZM8nKXL.jpeg"
  },
  "乙未": { 
    ko: "을미일주는 온화해 보이지만 내면은 단단해. 현실적인 실속을 차리는 능력도 뛰어나고.", 
    en: "Eul-mi looks gentle but is firm inside. You're great at securing practical benefits too.",
    impression: "부드러운 척하면서도 실속은 다 챙기는구나? 꽤 영리한 생존 전략이야."
  },
  "乙巳": { 
    ko: "을사일주는 사교적이고 재능이 많아. 화려한 언변과 매력으로 주변을 밝게 만들지.", 
    en: "Eul-sa is social and multi-talented. You brighten up the room with your wit and charm.",
    impression: "사람 다루는 솜씨가 보통이 아니네. 겉으론 웃고 있어도 속으론 다 계산하고 있지?"
  },
  "乙卯": { 
    ko: "을묘일주는 순수하고 생동감이 넘쳐. 자신의 영역을 확고히 지키는 고집과 주관이 있지.", 
    en: "Eul-myo is pure and vibrant. You have the subjectivity to firmly protect your own space.",
    impression: "자기 세계가 꽤 견고하네. 남들이 뭐라든 너만의 속도로 걸어가는 모습이 보여."
  },
  "丙寅": { 
    ko: "병인일주는 열정적이고 진취적이야. 밝은 에너지로 주변에 희망을 주는 태양 같은 존재지.", 
    en: "Byeong-in is passionate and enterprising. You're like a sun giving hope with your bright energy.",
    impression: "에너지가 꽤 뜨겁네. 가만히 있어도 열기가 느껴지는 타입이야."
  },
  "丙子": { 
    ko: "병자일주는 예의 바르고 단정해. 내면의 열정을 절제된 행동으로 보여주는 품격이 있지.", 
    en: "Byeong-ja is polite and neat. You have that dignity to show passion through restrained actions.",
    impression: "겉으론 차분해 보여도 속엔 불꽃을 품고 있네. 꽤 절제된 카리스마가 느껴져."
  },
  "丙戌": { 
    ko: "병술일주는 의리가 있고 활동적이야. 한 번 시작한 일은 끝까지 책임지는 열정이 돋보이지.", 
    en: "Byeong-sul is loyal and active. Your passion to finish what you start is impressive.",
    impression: "한 번 꽂히면 끝장을 보는구나. 그 집요함이 꽤 무섭기도 하고 대단하기도 해."
  },
  "丙申": { 
    ko: "병신일주는 다재다능하고 두뇌 회전이 빨라. 현실적인 이익을 창출하는 감각이 탁월하지.", 
    en: "Byeong-sin is versatile and quick-witted. You're amazing at sensing practical opportunities.",
    impression: "머리가 꽤 비상하네. 세상 돌아가는 판을 읽는 눈이 남다른 것 같아."
  },
  "丙午": { 
    ko: "병오일주는 에너지가 넘치고 당당해. 압도적인 카리스마로 좌중을 압도하는 힘이 있지.", 
    en: "Byeong-o is high-energy and confident. You have the power to command attention.",
    impression: "존재감이 장난 아니네. 굳이 말하지 않아도 다들 널 의식하게 될 거야."
  },
  "丙辰": { 
    ko: "병진일주는 포용력이 넓고 지혜로워. 타인을 배려하면서도 자신의 목표를 잃지 않지.", 
    en: "Byeong-jin is broad-minded and wise. You're considerate but never lose sight of your goals.",
    impression: "속이 꽤 깊네. 겉으론 허허실실해도 안으론 다 꿰뚫어 보고 있는 거 다 알아."
  },
  "丁卯": { 
    ko: "정묘일주는 섬세하고 예술적 감각이 뛰어나. 따뜻한 마음씨로 주변을 챙기는 다정함이 있지.", 
    en: "Jeong-myo is delicate with great artistic sense. You're kind and care for everyone around you.",
    impression: "감수성이 꽤 예민하네. 남들이 못 느끼는 미묘한 분위기를 잘 잡아내는 것 같아."
  },
  "丁丑": { 
    ko: "정축일주는 차분하고 내실이 있어. 겉으로 드러내지 않아도 실속을 챙기는 지혜가 있지.", 
    en: "Jeong-chuk is calm and substantial. You have the wisdom to secure benefits without showing off.",
    impression: "조용히 자기 몫은 다 챙기는구나. 꽤 영리하고 실속 있는 타입이야."
  },
  "丁亥": { 
    ko: "정해일주는 영감이 뛰어나고 예의가 발라. 맑고 깨끗한 심성으로 타인의 신뢰를 얻지.", 
    en: "Jeong-hae is highly inspired and polite. You gain trust with your clear and pure mind.",
    impression: "분위기가 꽤 맑네. 왠지 너랑 있으면 복잡한 생각들이 정리될 것 같은 기분이야."
  },
  "丁酉": { 
    ko: "정유일주는 세련된 감각과 예리한 판단력을 지녔어. 귀족적인 품위와 깔끔함이 매력이지.", 
    en: "Jeong-yu has sophisticated senses and sharp judgment. Your dignity is charming.",
    impression: "취향이 꽤 까다롭네. 너만의 미적 기준이 확실해서 웬만한 건 눈에 안 차겠어."
  },
  "丁未": { 
    ko: "정미일주는 끈기 있고 열정적이야. 한결같은 모습으로 자신의 자리를 지키는 성실함이 있지.", 
    en: "Jeong-mi is persistent and passionate. You're diligent and consistent in your place.",
    impression: "한 우물만 파는 고집이 있네. 그 끈기가 결국 널 특별하게 만들 거야."
  },
  "丁巳": { 
    ko: "정사일주는 화끈하고 활동적이야. 강한 독립심과 추진력으로 목표를 달성하는 힘이 있지.", 
    en: "Jeong-sa is hot and active. You have the power to reach goals with strong drive.",
    impression: "열기가 꽤 대단하네. 한 번 타오르면 아무도 못 말릴 것 같은 기세야."
  },
  "戊辰": { 
    ko: "무진일주는 듬직하고 포용력이 넓어. 거대한 산처럼 흔들리지 않는 묵직한 존재감이 있지.", 
    en: "Mu-jin is reliable and broad-minded. You have a heavy presence that doesn't shake like a mountain.",
    impression: "무게감이 꽤 있네. 웬만한 일에는 눈 하나 깜짝 안 할 것 같은 든든함이 보여."
  },
  "戊寅": { 
    ko: "무인일주는 명예를 중시하고 리더십이 있어. 위엄 있는 모습으로 조직을 이끄는 힘이 있지.", 
    en: "Mu-in values honor and has leadership. You have the power to lead with a dignified appearance.",
    impression: "명예나 체면을 꽤 따지는 편이지? 겉으론 덤덤해 보여도 속으론 리더가 되고 싶어 하는 욕망이 다 보여.",
    cardBg: "https://i.imgur.com/vHMiQDc.jpeg",
    detailImg: "https://i.imgur.com/0OvKa5I.jpeg"
  },
  "戊子": { 
    ko: "무자일주는 신중하고 실속이 있어. 현실적인 경제 관념이 뛰어나서 자수성가하는 타입이지.", 
    en: "Mu-ja is cautious and substantial. You're a self-made type with great economic sense.",
    impression: "현실 감각이 꽤 철저하네. 헛돈 안 쓰고 차곡차곡 네 성을 쌓아가는 모습이 보여."
  },
  "戊戌": { 
    ko: "무술일주는 고집이 있고 주관이 뚜렷해. 한 번 믿은 사람이나 가치를 끝까지 지키는 의리가 있지.", 
    en: "Mu-sul is stubborn with clear subjectivity. You're loyal to protecting people or values you trust.",
    impression: "고집이 꽤 세네. 네가 옳다고 믿는 건 세상이 뒤집혀도 안 바꿀 것 같아."
  },
  "戊申": { 
    ko: "무신일주는 재능이 많고 사교적이야. 주변 사람들과 조화를 이루며 실익을 챙기는 능력이 좋지.", 
    en: "Mu-sin is multi-talented and social. You're good at harmonizing while securing benefits.",
    impression: "사람들 사이에서 꽤 유연하네. 겉으론 맞춰주는 척해도 실속은 네가 다 챙기고 있지?"
  },
  "戊午": { 
    ko: "무오일주는 자존심이 강하고 열정적이야. 강한 자기 확신으로 목표를 향해 돌진하는 힘이 있지.", 
    en: "Mu-o is proud and passionate. You have the power to rush toward goals with self-confidence.",
    impression: "자기 확신이 꽤 강하네. 남들이 뭐라든 네가 맞다고 생각하면 밀어붙이는 파워가 느껴져.",
    cardBg: "https://i.imgur.com/4bLoA4v.jpeg",
    detailImg: "https://i.imgur.com/MxI7A8b.jpeg"
  },
  "己巳": { 
    ko: "기사일주는 지혜롭고 활동적이야. 따뜻한 대지처럼 주변을 품어주는 포용력이 매력적이지.", 
    en: "Gi-sa is wise and active. Your capacity to embrace others like warm earth is charming.",
    impression: "포용력이 꽤 넓네. 겉으론 조용해 보여도 속으론 주변 상황을 다 컨트롤하고 있는 거 알아."
  },
  "己卯": { 
    ko: "기묘일주는 섬세하고 예민한 감각을 지녔어. 자신만의 원칙을 지키며 성실하게 살아가는 타입이지.", 
    en: "Gi-myo has delicate and sensitive senses. You live diligently while keeping your own principles.",
    impression: "신경이 꽤 날카롭네. 남들은 그냥 지나칠 작은 균열도 너한텐 크게 보일 것 같아."
  },
  "己丑": { 
    ko: "기축일주는 끈기 있고 고집이 있어. 묵묵히 자신의 길을 걸어가 결국 결실을 맺는 뚝심이 있지.", 
    en: "Gi-chuk is persistent and stubborn. You have the determination to walk your path and bear fruit.",
    impression: "끈기가 꽤 지독하네. 한 번 물면 절대 안 놓을 것 같은 집요함이 느껴져."
  },
  "己亥": { 
    ko: "기해일주는 다정다감하고 지혜로워. 타인과 원만한 관계를 유지하며 실속을 챙기는 능력이 탁월하지.", 
    en: "Gi-hae is affectionate and wise. You're excellent at maintaining relationships while securing benefits.",
    impression: "사람 다루는 게 꽤 능숙하네. 부드럽게 웃으면서 네가 원하는 걸 다 얻어내는 타입이야.",
    cardBg: "https://i.imgur.com/4lC6HXU.jpeg",
    detailImg: "https://i.imgur.com/uXjraLd.jpeg"
  },
  "己酉": { 
    ko: "기유일주는 깔끔하고 재능이 많아. 예리한 감각으로 완성도 높은 결과물을 만들어내는 능력이 있지.", 
    en: "Gi-yu is neat and multi-talented. You create high-quality results with sharp senses.",
    impression: "완벽주의 기질이 꽤 있네. 네 손을 거친 건 결함이 없어야 직성이 풀리는 스타일이지?",
    cardBg: "https://i.imgur.com/adjJhgH.jpeg",
    detailImg: "https://i.imgur.com/ERZMTWT.jpeg"
  },
  "己未": { 
    ko: "기미일주는 주관이 뚜렷하고 생활력이 강해. 어떤 환경에서도 살아남는 강인한 생명력이 돋보이지.", 
    en: "Gi-mi has clear subjectivity and strong vitality. Your resilience to survive anywhere is impressive.",
    impression: "생활력이 꽤 강하네. 세상이 아무리 흉흉해도 넌 어떻게든 살아남을 것 같아."
  },
  "庚午": { 
    ko: "경오일주는 정의롭고 예의가 발라. 세련된 매너와 위엄으로 사람들의 존경을 받는 리더 타입이지.", 
    en: "Gyeong-o is just and polite. You're a leader type respected for sophisticated manners.",
    impression: "매너가 꽤 깔끔하네. 겉으론 젠틀해도 속으론 엄격한 기준을 세워두고 있을 것 같아."
  },
  "庚辰": { 
    ko: "경진일주는 두뇌가 명석하고 카리스마가 있어. 비범한 재능으로 큰 일을 도모하는 힘이 있지.", 
    en: "Gyeong-jin is bright-witted and charismatic. You have the power to plan big things with talent.",
    impression: "스케일이 꽤 크네. 자잘한 일보다는 굵직한 한 방을 노리는 타입이지?",
    cardBg: "https://i.imgur.com/gFb1bUJ.jpeg",
    detailImg: "https://i.imgur.com/LweIWrN.jpeg"
  },
  "庚寅": { 
    ko: "경인일주는 활동적이고 진취적이야. 강한 추진력으로 새로운 영역을 개척하는 용기가 돋보이지.", 
    en: "Gyeong-in is active and enterprising. Your courage to pioneer new areas is impressive.",
    impression: "실행력이 꽤 빠르네. 생각보다 몸이 먼저 나가는 타입이라 가끔은 위험해 보이기도 해."
  },
  "庚子": { 
    ko: "경자일주는 총명하고 표현력이 뛰어나. 예리한 통찰력으로 사물의 본질을 꿰뚫어 보는 능력이 있지.", 
    en: "Gyeong-ja is intelligent and expressive. You see through the essence of things with sharp insight.",
    impression: "말투가 꽤 날카롭네. 팩트로 사람 때리는 데 소질이 있을 것 같아."
  },
  "庚戌": { 
    ko: "경술일주는 의리가 있고 강직해. 한 번 결심한 일은 어떤 난관이 있어도 끝까지 밀어붙이지.", 
    en: "Gyeong-sul is loyal and upright. You push through any obstacles once you decide.",
    impression: "강직함이 꽤 고지식해 보일 정도네. 네가 믿는 정의를 위해선 타협 안 할 것 같아.",
    cardBg: "https://i.imgur.com/JXNFMrM.jpeg",
    detailImg: "https://i.imgur.com/uzFVs39.jpeg"
  },
  "庚申": { 
    ko: "경신일주는 독립심이 강하고 단단해. 자신의 신념을 지키는 굳건함과 리더십이 매력적이지.", 
    en: "Gyeong-sin is independent and firm. Your steadfastness and leadership are charming.",
    impression: "멘탈이 꽤 강철 같네. 웬만한 충격에는 흠집도 안 날 것 같은 단단함이 느껴져."
  },
  "辛未": { 
    ko: "신미일주는 겉은 부드러워 보이지만 속은 날카로운 칼날을 품고 있어. 현실적인 실속을 차리는 지혜가 있지.", 
    en: "Sin-mi looks soft outside but holds a sharp blade inside. You have the wisdom to secure benefits.",
    impression: "속내를 꽤 잘 숨기네. 웃는 얼굴 뒤에 예리한 칼날을 숨기고 있는 거 다 알아."
  },
  "辛巳": { 
    ko: "신사일주는 예의 바르고 세련된 감각을 지녔어. 합리적인 사고와 깔끔한 일 처리 능력이 돋보이지.", 
    en: "Sin-sa is polite and sophisticated. Your rational thinking and neat work are impressive.",
    impression: "일 처리가 꽤 완벽하네. 감정보다는 논리로 세상을 대하는 모습이 꽤 시크해 보여."
  },
  "辛卯": { 
    ko: "신묘일주는 예민하고 섬세해. 예술적 감각과 재치가 넘쳐서 주변 사람들을 즐겁게 만들지.", 
    en: "Sin-myo is sensitive and delicate. You entertain others with artistic sense and wit.",
    impression: "신경이 꽤 예민하네. 너만의 미적 기준에 안 맞는 건 절대 못 참는 스타일이지?"
  },
  "辛丑": { 
    ko: "신축일주는 끈기 있고 내실이 있어. 어려운 상황에서도 자신만의 가치를 지켜내는 강인함이 있지.", 
    en: "Sin-chuk is persistent and substantial. You protect your values even in tough situations.",
    impression: "고집이 꽤 은근하네. 겉으론 네네 해도 속으론 절대 네 생각을 안 굽힐 거잖아."
  },
  "辛亥": { 
    ko: "신해일주는 총명하고 감수성이 풍부해. 맑고 깨끗한 지혜로 세상을 바라보는 통찰력이 뛰어나지.", 
    en: "Sin-hae is intelligent and sensitive. You see the world with clear and pure wisdom.",
    impression: "생각이 꽤 맑고 예리하네. 가끔은 너무 투명해서 남들이 못 보는 진실을 봐버리는 것 같아."
  },
  "辛酉": { 
    ko: "신유일주는 고결하고 자존심이 매우 강해. 자신만의 완벽한 세계를 추구하는 장인 정신이 있지.", 
    en: "Sin-yu is noble and very proud. You have a craftsmanship spirit pursuing perfection.",
    impression: "자기 관리가 꽤 철저하네. 너 스스로한테 가장 엄격한 잣대를 들이대고 있는 거 아니야?"
  },
  "壬申": { 
    ko: "임신일주는 지혜롭고 다재다능해. 넓은 바다처럼 모든 것을 수용하고 변화에 대응하는 능력이 좋지.", 
    en: "Im-sin is wise and versatile. You're great at accepting everything and responding to changes.",
    impression: "머리 회전이 꽤 빠르네. 어떤 상황에 던져놔도 금방 적응해서 네 몫을 챙길 것 같아."
  },
  "壬午": { 
    ko: "임오일주는 재치 있고 사교적이야. 현실적인 감각과 따뜻한 마음씨를 동시에 지닌 타입이지.", 
    en: "Im-o is witty and social. A type with both practical sense and a warm heart.",
    impression: "사람 다루는 센스가 꽤 좋네. 적당히 거리를 두면서도 호감을 사는 법을 아는 것 같아."
  },
  "壬辰": { 
    ko: "임진일주는 카리스마가 있고 포부가 커. 거대한 파도처럼 세상을 뒤흔드는 강한 에너지가 있지.", 
    en: "Im-jin is charismatic and ambitious. You have strong energy that shakes the world like a wave.",
    impression: "야망이 꽤 크네. 평범한 삶보다는 뭔가 큰 흔적을 남기고 싶어 하는 욕망이 보여."
  },
  "壬寅": { 
    ko: "임인일주는 진취적이고 활동적이야. 밝은 미래를 향해 나아가는 긍정적인 에너지와 리더십이 돋보이지.", 
    en: "Im-in is enterprising and active. Your positive energy and leadership are impressive.",
    impression: "추진력이 꽤 시원시원하네. 복잡하게 생각 안 하고 일단 저지르고 보는 타입이지?"
  },
  "壬子": { 
    ko: "임자일주는 주관이 매우 강하고 총명해. 깊은 바다처럼 속을 알 수 없는 신비로움과 강한 뚝심이 있지.", 
    en: "Im-ja is very subjective and intelligent. You have a mystery like the deep sea and strong determination.",
    impression: "속을 꽤 알 수가 없네. 웃고 있어도 그 너머에 뭐가 있는지 짐작조차 안 가."
  },
  "壬戌": { 
    ko: "임술일주는 책임감이 강하고 영감이 뛰어나. 조직을 위해 헌신하면서도 자신의 자리를 지키는 힘이 있지.", 
    en: "Im-sul is responsible and highly inspired. You dedicate to organizations while keeping your place.",
    impression: "책임감이 꽤 무겁네. 남들의 기대를 저버리지 않으려고 스스로를 너무 몰아세우는 거 아냐?"
  },
  "癸酉": { 
    ko: "계유일주는 총명하고 섬세해. 맑은 샘물처럼 깨끗한 심성과 예리한 통찰력을 지닌 지혜로운 타입이지.", 
    en: "Gye-yu is intelligent and delicate. A wise type with a clean mind and sharp insight.",
    impression: "생각이 꽤 예리하네. 겉으론 조용해도 속으론 남들의 약점까지 다 파악하고 있을 것 같아."
  },
  "癸未": { 
    ko: "계미일주는 온화해 보이지만 생활력이 강해. 현실적인 어려움을 지혜롭게 극복해 나가는 인내심이 있지.", 
    en: "Gye-mi looks gentle but has strong vitality. You have the patience to overcome difficulties wisely.",
    impression: "인내심이 꽤 지독하네. 겉으론 져주는 척해도 결국 네가 원하는 대로 상황을 끌고 가잖아.",
    cardBg: "https://i.imgur.com/zb1kkNo.jpeg",
    detailImg: "https://i.imgur.com/PyXWWeO.jpeg"
  },
  "癸巳": { 
    ko: "계사일주는 재치 있고 사교적이야. 현실적인 이익을 포착하는 감각과 타인과 소통하는 능력이 뛰어나지.", 
    en: "Gye-sa is witty and social. Excellent at sensing profits and communicating with others.",
    impression: "눈치가 꽤 빠르네. 어디에 줄을 서야 실속을 챙길 수 있는지 본능적으로 아는 타입이야."
  },
  "癸卯": { 
    ko: "계묘일주는 다정다감하고 예술적 감각이 풍부해. 주변 사람들에게 편안함과 즐거움을 주는 매력이 있지.", 
    en: "Gye-myo is affectionate and rich in artistic sense. You give comfort and joy to everyone.",
    impression: "분위기가 꽤 유연하네. 굳이 애쓰지 않아도 사람들이 너한테 마음을 열게 만드는 묘한 힘이 있어."
  },
  "癸丑": { 
    ko: "계축일주는 끈기 있고 내면의 힘이 강해. 묵묵히 노력하여 결국 자신의 목표를 달성하는 뚝심이 돋보이지.", 
    en: "Gye-chuk is persistent with strong inner strength. Your determination to reach goals is impressive.",
    impression: "고집이 꽤 단단하네. 한 번 아니라고 생각하면 절대 안 바꿀 것 같은 차가운 뚝심이 느껴져."
  },
  "癸亥": { 
    ko: "계해일주는 지혜롭고 포용력이 넓어. 넓은 바다처럼 모든 것을 품어주는 넉넉한 마음씨와 강한 주관이 있지.", 
    en: "Gye-hae is wise and broad-minded. You have a generous heart and strong subjectivity.",
    impression: "생각의 깊이가 꽤 깊네. 겉으론 맞춰주는 것 같아도 속으론 너만의 거대한 바다를 품고 있구나."
  }
};
