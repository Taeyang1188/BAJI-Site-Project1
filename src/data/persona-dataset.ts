export type PersonaClusterId = 
  | 'sharp_blade' 
  | 'dynamic_volcano' 
  | 'deep_labyrinth' 
  | 'silent_monolith' 
  | 'sensitive_antenna' 
  | 'flexible_bridge';

export interface PersonaPhase {
  question: string;
  routeAYes: { text: string };
  routeBNo: { text: string };
  routeCUnk: { text: string };
}

export interface PersonaClusterDef {
  id: PersonaClusterId;
  title: string;
  shadow: string;
  phases: PersonaPhase[];
  report: {
    trueNature: string;
    socialMask: string;
    advice: string;
  };
}

export const ILJU_TO_CLUSTER: Record<string, PersonaClusterId> = {
  // Sharp Blades
  "壬申": "sharp_blade", "癸酉": "sharp_blade", "庚申": "sharp_blade", "辛酉": "sharp_blade", "辛未": "sharp_blade", "庚戌": "sharp_blade", "辛丑": "sharp_blade", "庚子": "sharp_blade", "辛亥": "sharp_blade", "壬子": "sharp_blade",
  
  // Dynamic Volcanos
  "丙午": "dynamic_volcano", "丁巳": "dynamic_volcano", "戊午": "dynamic_volcano", "壬辰": "dynamic_volcano", "甲辰": "dynamic_volcano", "丙寅": "dynamic_volcano", "庚寅": "dynamic_volcano", "壬寅": "dynamic_volcano", "丙辰": "dynamic_volcano", "戊申": "dynamic_volcano",
  
  // Deep Labyrinths
  "己亥": "deep_labyrinth", "癸亥": "deep_labyrinth", "丁丑": "deep_labyrinth", "癸丑": "deep_labyrinth", "戊子": "deep_labyrinth", "己丑": "deep_labyrinth", "乙亥": "deep_labyrinth", "丁亥": "deep_labyrinth", "己巳": "deep_labyrinth", "癸巳": "deep_labyrinth",
  
  // Silent Monoliths
  "戊辰": "silent_monolith", "戊戌": "silent_monolith", "己未": "silent_monolith", "庚辰": "silent_monolith", "壬戌": "silent_monolith", "甲戌": "silent_monolith", "丙戌": "silent_monolith", "乙未": "silent_monolith", "丁未": "silent_monolith", "辛巳": "silent_monolith",
  
  // Sensitive Antennas
  "乙卯": "sensitive_antenna", "丁卯": "sensitive_antenna", "己卯": "sensitive_antenna", "癸卯": "sensitive_antenna", "乙巳": "sensitive_antenna", "己酉": "sensitive_antenna", "辛卯": "sensitive_antenna", "乙酉": "sensitive_antenna", "丁酉": "sensitive_antenna", "癸未": "sensitive_antenna",
  
  // Flexible Bridges
  "甲子": "flexible_bridge", "乙丑": "flexible_bridge", "丙子": "flexible_bridge", "戊寅": "flexible_bridge", "庚午": "flexible_bridge", "壬午": "flexible_bridge", "甲申": "flexible_bridge", "甲午": "flexible_bridge", "丙申": "flexible_bridge", "丁申": "flexible_bridge", 
};

export const PERSONA_DATASET: Record<PersonaClusterId, PersonaClusterDef> = {
  sharp_blade: {
    id: "sharp_blade",
    title: "냉철한 고지능형 포식자",
    shadow: "지적 오만함, 냉소적 태도",
    phases: [
      {
        question: "{{target은는}} 남들이 못 보고 지나치는 사물의 좋고 나쁨을 진짜 빠르게 파악하는 편이지? 솔직히 감성보다는 논리가 앞서는 'T' 성향에 가까운 타입 아냐?",
        routeAYes: { text: "역시 그럴 줄 알았어. 그 예리한 안목 때문에 가끔 사람들이 너한테 '차갑다'고 할 때도 있지? 그래서 무난한 사람인 척 필터링해서 말하느라 꽤나 에너지 쓰고 있잖아." },
        routeBNo: { text: "아니라고? 하긴 {{target은는}} 그걸 '냉소'라기보다는 불필요한 군더더기를 쳐내는 '정확한 효율'이라고 부르고 싶겠지. 쓸데없는 감정 소모 피하려는 그 스탠스, 그거부터가 논리적이라는 증거야." },
        routeCUnk: { text: "감이 잘 안 와? 그럼 단톡방에서 누가 진짜 말도 안 되는 헛소리를 길게 할 때 넌 속으로 '어휴 또 저러네' 하면서 무시하거나 '팩트'로 박살내고 싶지 않아?" }
      },
      {
        question: "그럼 이건 어때? 어떤 모임이나 회의에 갔을 때, 전체 프로세스의 '비효율적인 부분'이나 '상태 안 좋은 사람'이 레이더망에 1초 만에 포착되지 않아?",
        routeAYes: { text: "속으로는 혼자 하는 게 100배 빠르다고 생각하면서, 겉으로는 어쩔 수 없이 맞춰주는 척 에너지 쓰고 있는 거 다 알아. 피곤하지?" },
        routeBNo: { text: "진짜? 흠.. 넌 굳이 답답한 걸 나서서 고쳐주기보단, 그냥 네 몫만 완벽하게 끝내고 칼같이 선을 긋는 쪽에 가깝겠네. 에너지를 이상한 데 쓰기 싫은 거지." },
        routeCUnk: { text: "친구들이 맛집이라고 우르르 갈 때, 너 혼자만의 속마음으로 '리뷰 다 광고고 여긴 별로인데...' 하면서도 그냥 입 꾹 닫고 따라가며 이너피스 찾는 적 있지?" }
      },
      {
        question: "마지막으로 물어볼게. 그렇게 차갑게 모든 걸 통제하는 척해도, 가끔은 그 '높은 기준'과 '완벽주의' 때문에 스스로 제일 피곤하고 고립된 기분이 들 때 있지 않아?",
        routeAYes: { text: "역시는 역시. 남들보다 눈이 높고 너무 많은 게 보이니까 결국 네가 다 짊어져야만 직성이 풀리잖아. 그 치열함이 스스로를 외롭게 만들기도 하지." },
        routeBNo: { text: "안 피곤하다고? 하긴, 넌 피곤함을 느끼기 전에 남들이 네 기준에 못 미치면 가차 없이 잘라내는 '자발적 고립'을 심플하게 즐기는 편인지도 모르겠다." },
        routeCUnk: { text: "만약 누가 네 마음에 쏙 들게 일처리하는 걸 본 기억이 잘 안 난다면, 바로 그게 널 피곤하게 만드는 그 높은 안목의 반증이야." }
      }
    ],
    report: {
      trueNature: "얼음처럼 차가운 이성과 날카로운 메스 같은 분석력",
      socialMask: "상대의 감정에 공감하는 척하는 고성능 사회화 리액션 봇",
      advice: "그 날카로운 통찰력을 둥글게 포장하는 법만 마스터해봐. 넌 어느 조직에서든 제일 먼저 상황을 끝내는 '대체 불가 전략가'가 될 거야. 똑똑한 머리를 감추는 게 진짜 고능지야."
    }
  },
  dynamic_volcano: {
    id: "dynamic_volcano",
    title: "폭발적 에너지의 추진가",
    shadow: "독단적 결정, 분노 조절, 주변을 태움",
    phases: [
      {
        question: "{{target은는}} 가만히 있는 꼴을 못 보지? 하나에 꽂히면 일단 지르고 보는 브레이크 없는 불도저 스타일이잖아. 주변에서 가끔 버거워하기도 하고?",
        routeAYes: { text: "내 말이 맞네. 그래서 '너 혼자 너무 앞서간다'는 말 듣잖아? 속으로는 '답답한 애들 챙기느라 내가 고생이지' 하면서 꾹 참고, 호탕한 리더 코스프레 하는 거 아니야?" },
        routeBNo: { text: "아니라고? 그럼 넌 무작정 달리는 게 아니라 에너지 분배를 엄청 '전투적'으로 할 뿐인 거지. 평소엔 여유로운 척하지만 스위치 켜지면 무섭게 치고 나가는 거잖아." },
        routeCUnk: { text: "단톡방에서 다들 일주일째 메뉴 하나 못 정하고 질질 끌 때, 결국 네가 총대 메고 '야, 그냥 여기로 모여'라고 마침표 찍어버린 적 엄청 많지?" }
      },
      {
        question: "근데 그런 에너지 넘치는 모습 뒤로, 내심 누가 나처럼 빠릿빠릿하게 안 움직여주면 가슴에서 천불이 나지 않아? 속에서 화끈하게 열불이 차오르잖아.",
        routeAYes: { text: "그럴 줄 알았어. 다들 네 속도를 못 따라오니까 결국엔 '아오, 차라리 내가 하고 말지' 하면서 혼자 일 폭탄 다 떠안은 적 꽤 있지?" },
        routeBNo: { text: "화가 안 난다고? 에버리지 깎아먹는 상황에 화가 안 나는 게 아니라, 그냥 분노를 에너지로 치환해버리는 엄청난 추진력을 가진 거겠지." },
        routeCUnk: { text: "앞에서 얼쩡거리면서 길 막고 늦게 걷는 사람들 보면 속으로 '아 좀 빨리 좀 가자' 하면서 무의식중에 추월하는 너의 모습을 상상해봐." }
      },
      {
        question: "솔직히 그 폭발적인 추진력이 멋있긴 한데, 가끔은 그 불길이 남들뿐만 아니라 {{target}} 스스로까지 남김없이 다 태워버리고 잿더미가 될 것 같은 공허함 느끼지 않아?",
        routeAYes: { text: "알아. 워낙 강하게 불타오르다 보니 불 꺼진 후의 그 휑한 공백감이 남들 배로 다가오지. '내가 도대체 뭘 위해 이렇게 달렸나' 싶고." },
        routeBNo: { text: "공허하지 않다고? 하긴 넌 한 불꽃이 꺼지기 전에 이미 다음 장작을 찾아서 태워버리니까 공허함이 파고들 틈을 안 주는 강심장이네." },
        routeCUnk: { text: "혼자 밤에 누워있을 때 불현듯 낮 동안 끓어오르던 열기가 식으면서 훅 치고 들어오는 정적, 그거 진짜 아무나 견디는 거 아니야." }
      }
    ],
    report: {
      trueNature: "주변을 다 태워버릴 듯한 압도적인 불길과 맹렬한 추진력",
      socialMask: "주변 템포 맞추려 인내하며 이끄는 '호탕하고 너그러운 리더' 코스프레",
      advice: "치고 나가는 그 화끈한 에너지는 네 최고의 무기야. 다만 옆 사람 페이스 한 번씩만 체크해. '진도율'보다 '동행'에 가중치를 두면 넌 진짜 폭발적인 캡틴이 될 수 있어."
    }
  },
  deep_labyrinth: {
    id: "deep_labyrinth",
    title: "전략적인 심연의 사냥꾼",
    shadow: "본심 숨기기, 은밀한 통제광",
    phases: [
      {
        question: "{{target은는}} 진짜 속을 알 수가 없어. 유들유들하게 잘 웃고 있지만, 머릿속으로는 이미 사람들 견적 다 뽑고 상황 쥐고 흔들 계산하고 있지?",
        routeAYes: { text: "역시는 역시구만. 사람들한테는 '좋은 게 좋은 거지'라면서 사실 다 네가 원하는 방향으로 부드럽게 유도해버리잖아. 아주 스윗한 통제광이지." },
        routeBNo: { text: "아니라고? 에이.. 넌 나쁜 의도가 아니라 그냥 분란 일으키기 싫어서 대화의 '흐름'만 부드럽게 타는 거지? 근데 그 흐름을 누가 주도하는지는 네가 제일 잘 알걸." },
        routeCUnk: { text: "모임에서 자리 앉을 때, 벌써 '누가 누구랑 사이 별로고, 오늘 분위기 어떻다' 혼자 스캔 싹 끝내고서 아무것도 모르는 척 빙그레 웃고 앉아있지 않아?" }
      },
      {
        question: "그렇게 물 흐르듯 유연해 보여도, 사실 누군가 네 진짜 바닥(본심)을 들여다보려고 하면 무의식중에 견고한 방어벽을 딱 치고 선 긋지 않아?",
        routeAYes: { text: "맞아. 진짜 내 모습을 다 보여줬다가 다치기 싫으니까. 웃으면서 거절하고, 친한 척하면서 곁을 안 주는 그 고도의 스킬, 피곤하지?" },
        routeBNo: { text: "방어벽 안 친다고? 넌 방어벽을 안 치는 게 아니라 방어벽이 있는 줄도 모르게 미로를 설계해 두는 천재적인 회피기동을 하는 거야." },
        routeCUnk: { text: "사람들이 '너 진짜 친해지긴 쉬운데, 막상 깊이 들어가려니까 되게 어렵다'라는 말 한 적 있지? 그게 바로 네 심연의 문이야." }
      },
      {
        question: "결국 그 은밀한 지배력과 속을 감추는 미로 때문에, 정작 힘들 땐 아무한테도 완전히 의지하지 못하고 스스로 깊은 바다로 침잠해버리지 않아?",
        routeAYes: { text: "그치? 나를 온전히 다 받아줄 사람은 없다고 미리 결론 내리고 혼자 삭히잖아. 너무 유연해서 오히려 얽매이지 못하는 거지." },
        routeBNo: { text: "안 그렇다고? 하긴, 넌 바닥까지 가라앉기 전에 이미 수많은 멀티 페르소나들을 이용해 스스로 산소 호흡기를 달 줄 아는 무서운 생존력이니까." },
        routeCUnk: { text: "혼자만의 동굴에 들어갔을 때 휴대폰 알림 다 꺼두고 세상과 완전히 로그아웃해버리는 그 짜릿하면서도 우울한 기분, 그거 알아?" }
      }
    ],
    report: {
      trueNature: "무저갱처럼 끝을 알 수 없는 치밀함과 조용히 판을 짜는 은밀성",
      socialMask: "모든 걸 수용하고 받아주는 물같이 부드럽고 다정한 '예스맨'",
      advice: "사람들이 너의 그런 은밀한 통제력을 모를 거라고 생각하지 마. 오히려 한 번쯤은 네 본심을 시원하고 솔직하게 꺼내 보이는 게 더 거대한 신뢰의 덫이 될 거야."
    }
  },
  silent_monolith: {
    id: "silent_monolith",
    title: "흔들리지 않는 원칙의 성채",
    shadow: "변화를 거부하는 철벽과 의심",
    phases: [
      {
        question: "{{target은는}} 은근히 융통성 없다는 말 자주 듣지? 예의 바르고 묵직해 보이지만, 자기만의 룰을 누가 넘으려 하면 단호하게 철벽 쳐버리는 타입 아니야?",
        routeAYes: { text: "그래서 가끔 유연하다는 느낌 주려고 짐짓 관심 있는 척 '오 그렇구나~' 하면서 남의 의견 들어주는 시늉만 할 때 꽤 있지? 근데 결국 안 바뀌지?" },
        routeBNo: { text: "아니라고? 넌 고집스러운 게 아니라 '검증 안 된 쓸데없는 리스크'를 혐오할 뿐이잖아. 안정감과 확신만 입증되면 또 누구보다 강하게 엑셀을 밟지." },
        routeCUnk: { text: "갑자기 누가 오늘 당장 약속 장소랑 시간 자기 맘대로 바꾸면 속으로 짜증 확 올라오지 않아? 겉으론 '알았어' 해도 맘속 룰 북은 찢어버린 느낌." }
      },
      {
        question: "그 뚝심 이면에는 사실 '나 말고는 아무도 온전히 믿지 못한다'는 깊은 의심과 철저한 방어 기제가 숨어있지 않아?",
        routeAYes: { text: "맞지. 믿고 맡겼다가 스트레스받느니 차라리 조금 고생해도 내 손으로 완벽하게 끝마쳐야 직성이 풀리잖아. 남들이 널 어려워하는 진짜 이유야." },
        routeBNo: { text: "의심 안 한다고? 넌 남을 의심한다기보다는 애초에 '상대방에게 큰 기대 자체를 안 하는' 최강의 멘탈 방어 시스템을 풀가동 중인 거겠지." },
        routeCUnk: { text: "누군가 호의를 베풀어도 '이 사람이 왜 나한테 이러지? 밑지는 장사 안 할 텐데' 하고 0.1초라도 머리 굴려본 기억, 한 번쯤은 무조건 있을걸?" }
      },
      {
        question: "그 견고한 룰이 세상을 편하게 막아주기도 하지만, 가끔은 {{target}}(을)를 가두는 숨 막히는 감옥처럼 느껴져서 다 던져버리고 일탈하고 싶진 않아?",
        routeAYes: { text: "있을 거야. 다들 네가 흔들림 없이 감당해주길 바라지만, 너도 가끔은 룰 같은 거 냅다 던지고 그냥 무책임하게 훌쩍 떠나버리고 싶잖아." },
        routeBNo: { text: "답답하지 않다고? 하긴, 그 단단한 요새 안에서 자기 템포대로 사는 게 타인의 간섭보다 100배는 아늑하다면 그게 너한텐 완벽한 천국이지." },
        routeCUnk: { text: "나 혼자만 세상의 짐을 다 지고 있는 듯 무기력해질 때, 혹시라도 내가 무너지면 다 끝날 것 같은 강박에 밤잠 설치는 그 책임감 말이야." }
      }
    ],
    report: {
      trueNature: "태산도 움직일 수 없는 거대한 뚝심과 철벽 같은 자기방어 고집",
      socialMask: "조금 융통성 있는 척 무던하게 남들 말도 잘 들어주는 진중한 코스프레",
      advice: "그 든든함과 일관성이 네 최고의 매력이지만, 과도한 철벽은 기회마저 튕겨내. 10번에 1번쯤은 아무 생각 없이 남의 무계획에 휩쓸려보는 것도 괜찮다."
    }
  },
  sensitive_antenna: {
    id: "sensitive_antenna",
    title: "섬세한 감각의 예술가",
    shadow: "유리 멘탈, 변덕스럽고 엄청난 예민함",
    phases: [
      {
        question: "{{target의}} 그 과도한 센서는 진짜 소름 끼칠 때가 있어. 남들 절대 못 보는 미세한 표정 변화나 공기 흐름까지 다 읽어버려서 피곤해 죽을 것 같지 않아?",
        routeAYes: { text: "그치? 맨날 남들 말 못할 감정까지 스캔당해서 에너지 빨리고, 결국 혼자만의 방에 숨고 싶으면서도 밖에 나오면 상처받지 않은 척 강한 척 텐션 유지하잖아." },
        routeBNo: { text: "아니라고? 넌 예민한 게 아니라 '퀄리티와 디테일에 미친 사람'이니까. 미감이나 스탠다드에 있어서 쓰레기 같은 타협을 절대 못 하는 완벽주의일 뿐이지." },
        routeCUnk: { text: "친구 눈빛이 살짝 흔들렸는데 '나 때문인가? 나 아까 뭐 잘못했나?' 하고 하루 종일 되감기 하면서 멘탈 자가 타격한 적, 너무 많지?" }
      },
      {
        question: "센서가 워낙 예민하니까 {{target은는}} 감정 기복도 엄청난 롤러코스터 아냐? 아침엔 우주 정복할 것 같다가 저녁엔 지구 평화에 환멸을 느끼잖아.",
        routeAYes: { text: "맞아. 너 스스로도 그 변덕이 피곤한데 남들 시선은 1순위로 신경 쓰여서, 꾸역꾸역 안 그런 척 차분하게 이성적으로 감정 누른 적 엄청 많지?" },
        routeBNo: { text: "기분파라고? 에이, 넌 기분이 변질되는 게 아니라 매 순간 쏟아지는 외부 자극에 따라 시시각각 모드를 스왑(Swap)하는 '생존형 카멜레온'일 확률이 높지." },
        routeCUnk: { text: "남이 '너 오늘 왜 이렇게 우울해 보여?' 물어보는데 사실 진짜 아무 일도 없고 그냥 약간 에너지 방전돼서 말할 입술 근육조차 쓰기 싫었던 적 있지?" }
      },
      {
        question: "그 예민함을 남 눈치 보는 데만 쓰다 보면, 불현듯 가슴 깊숙한 곳에서 '결국 날 조금도 이해해 주는 사람은 없다'는 지독한 피해의식에 휩싸일 때 없었어?",
        routeAYes: { text: "응, 그럴 땐 억울하지. 그 누구도 네 미세한 파장의 상처까지 헤아려줄 순 없으니까. 그럴 땐 진짜 세상과 단절된 섬에 영원히 갇힌 기분일 거야." },
        routeBNo: { text: "안 그렇다고? 대단하네. 남들 눈치 안 보고 그 압도적인 영감과 예민함을 오로지 너만의 무기나 창작의 땔감으로 무관심 속에 싹 갈아 넣고 있나 보구나." },
        routeCUnk: { text: "가끔 이유 모를 분노가 훅 올라오는데, 그게 세상의 무심함에 대한 섭섭함인지 아니면 그냥 날카로워진 나 자신에 대한 혐오인지 헷갈릴 때 말이야." }
      }
    ],
    report: {
      trueNature: "보이지 않는 공기의 밀도까지 맡아내는 레이더급 초예민 직관력",
      socialMask: "상처받지 않은 척 이성적이고 쿨한 타블로이드 기자 모드",
      advice: "너의 그 예민함과 미친 디테일은 어느 분야에서든 치명적인 무기야. 타인의 감정 쓰레기통 역할을 과감히 차단하고, 널 증명하는 일에만 온전히 쏟아부어."
    }
  },
  flexible_bridge: {
    id: "flexible_bridge",
    title: "사회적 공감의 적응가",
    shadow: "주관 부재, 거절 못 하는 피로감",
    phases: [
      {
        question: "솔직히 {{target은는}} 눈치 100단이잖아? 어디 가든 튀지 않고 카멜레온처럼 상황에 스며들어서 불편한 사람 1명도 없게 만드는 생존형 에이스 아니야?",
        routeAYes: { text: "그래서 가끔 현타 오지? 겉으론 하하 웃고 격하게 공감해 주면서, 속으론 '아, 내가 여기서 왜 이런 가짜 리액션 영혼 없이 치고 있나' 싶으면서 계속 연기하잖아." },
        routeBNo: { text: "아니라고? 하긴 넌 네 주관이 없는 게 아니라, 어차피 피곤하게 기싸움해서 적 만들어봤자 '내가 양보하는 게 시간적/감정적 이득'이라는 차가운 손익 계산을 끝낸 거잖아." },
        routeCUnk: { text: "단톡방에서 A랑 B가 별것도 아닌 걸로 논쟁할 때, 속으론 '둘 다 한심하네' 생각하면서 겉으로는 'A도 일리 있고 B도 맞네~' 하고 중재자 빙의한 적, 진짜 없다고?" }
      },
      {
        question: "그렇게 이 사람 저 사람 불편하지 않게 밸런스 맞추다 보면, 결국 내가 진짜 하고 싶은 말은 꾹꾹 삼키고 나중에 이불킥하며 호구 잡힌 포지션에 놓이는 적 많지?",
        routeAYes: { text: "맞아. 거절하면 뭔가 꺼림칙하고 욕먹을까 봐 애매하게 오케이 해놓고, 밤에 잠들기 전에 '아씨, 왜 한다고 그랬지' 하면서 후회의 눈물 훔치는 게 다반사지." },
        routeBNo: { text: "호구 안 잡힌다고? 그럼 넌 무해하게 스마일하고 있지만 정작 진짜 내 에너지가 털리는 중요한 순간에는 요리조리 칼같이 빠져나가는 극강의 은둔 고수였구나." },
        routeCUnk: { text: "남 기분 상할까 봐 싫은 소리는 돌리고 돌려서 포장하다가, 결국 네가 챙겨야 할 실속은커녕 상대방이 제대로 못 알아먹어서 혼자 속 터진 적 있지?" }
      },
      {
        question: "마지막으로 물어볼게. 끝없이 남들한테 맞춰주다 보니, 가끔은 정작 '진짜 {{target}}'가 뭘 좋아하고 어떤 성격인지 스스로 정체성이 텅 빈 껍데기처럼 느껴질 때 없었어?",
        routeAYes: { text: "그게 가장 치명적인 그림자야. 모두에게 다정한 무해한 캐릭터가 되고 싶었지만, 결국 그 모든 색을 다 섞어버리면 결국 칙칙한 회색빛의 내가 되어버리거든." },
        routeBNo: { text: "안 텅 비었다고? 주변 분위기에 나를 자유롭게 녹이는 것 자체가 타인들 속에서 나의 입김을 전파하는, 그 자체로 고도의 '인간 네트워크 지배자'인 지도 모르지." },
        routeCUnk: { text: "문득 거울 쳐다보면서 '내가 원래 이렇게 내 주장 없이 남 눈치만 보는 애였나?' 벼락맞은 듯 상실감이 찾아오던 그날 밤을 애써 지우려 하지 마." }
      }
    ],
    report: {
      trueNature: "내가 상처 입는 것을 극도로 회피하며 최소의 저항을 찾아내는 은밀한 꼼수",
      socialMask: "모두에게 다정하고 둥글게 맞춰주며 부탁을 거절하지 못하는 '착한 척 봇'",
      advice: "모두의 친구가 되려다 보면 정작 중요한 '진정한 내 편'을 놓치게 돼. 가끔은 미움받을 용기로 냅다 '싫어'라고 해봐. 까칠한 너의 진짜 매력에 이끌리는 사람들이 남을 거다."
    }
  }
};

export function getPersonaCluster(ilju: string): PersonaClusterDef {
  const clusterId = ILJU_TO_CLUSTER[ilju] || 'flexible_bridge'; // fallback
  return PERSONA_DATASET[clusterId];
}
