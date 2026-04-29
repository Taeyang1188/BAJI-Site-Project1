export interface LocalizedString {
  ko: string;
  en: string;
}

export interface IljuData {
  id: string;
  metadata: {
    kr_name: string;
    en_name: string;
    element: string;
    animal: string;
    nature_symbol: LocalizedString;
  };
  core_identity: {
    persona: LocalizedString;
    goth_punk_vibe: LocalizedString;
    shadow_side: LocalizedString;
  };
  behavior_metrics: {
    drive: number;
    empathy: number;
    stability: number;
    unpredictability: number;
  };
  compatibility_tags: {
    ideal_partner: string[];
    caution_partner: string[];
  };
  narrative_blocks: {
    default: LocalizedString;
    relationship: LocalizedString;
    timing_modifiers?: {
      wood: LocalizedString;
      fire: LocalizedString;
      earth: LocalizedString;
      metal: LocalizedString;
      water: LocalizedString;
    };
    timing_modifier?: LocalizedString;
  };
}

export const ILJU_DATASET: Record<string, any> = {
  甲子: {
    id: "gap-ja",
    metadata: {
      kr_name: "갑자(甲子)",
      en_name: "Gap-ja (Wood-Rat)",
      element: "Wood-Water",
      animal: "Rat",
      nature_symbol: {
        ko: "검은 호수 위로 피어난 푸른 독",
        en: "Blue Toxin over the Black Lake",
      },
    },
    core_identity: {
      persona: {
        ko: "심연을 유영하는 몽상가",
        en: "Dreamer of the Abyss",
      },
      goth_punk_vibe: {
        ko: "햇빛 하나 들지 않는 차가운 칠흑의 바다 아래서, 아랑곳하지 않고 하늘을 향해 기괴하게 생장하는 거대한 식물입니다. 철저한 고독 속에서 가장 치명적인 영감을 길어올립니다.",
        en: "A massive plant growing bizarrely toward the sky beneath a cold, pitch-black sea completely devoid of sunlight. Draws up the most lethal inspirations from absolute isolation.",
      },
      shadow_side: {
        ko: "우울한 자기연민을 먹고 자라며, 불완전 현실을 경멸하고 허구의 이상세계에 모든 것을 내던지려는 극단적인 도피성",
        en: "Feeds on depressive self-pity, despising incomplete reality and exhibiting an extreme escapism willing to throw everything into a fictional utopia.",
      },
    },
    behavior_metrics: { drive: 50, empathy: 80, stability: 30, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ["Mok-saeng-hwa", "Su-saeng-mok"], caution_partner: ["Ja-o-chung"] },
    narrative_blocks: {
      default: {
        ko: "우주적인 감수성과 차가운 이성을 동시에 가졌습니다. 타인의 상처에는 쉽게 공명하지만, 자신의 영역을 침범하면 순식간에 차가운 독수로 돌변합니다.",
        en: "Possesses cosmic sensitivity and cold rationality simultaneously. Resonates easily with others' wounds, but morphs into a cold, toxic water instantly if anyone invades.",
      },
      relationship: {
        ko: "연인과 정신적으로 완전히 융합되기를 원합니다. 조건 없이 다 내어주는 듯하지만, 환상이 깨지면 얼음장처럼 식어버립니다.",
        en: "Desires absolute psychological fusion with the lover. Appears to give everything unconditionally, but cools instantly like ice if the illusion shatters.",
      },
      timing_modifiers: {
        wood: {
          ko: "거대한 독초가 끝없이 팽창하며 수면을 완전히 장악합니다. 배타적인 지적 우월감과 왜곡된 과시욕이 스스로를 질식시킵니다.",
          en: "A massive toxic herb endlessly expands, entirely taking over the water's surface. Exclusive intellectual superiority suffocates the entity itself."
        },
        fire: {
          ko: "검은 물꽃이 거대한 불꽃과 만나 맹렬한 증기를 뿜어냅니다. 파괴적인 표현욕과 천재성이 폭발하여 세상을 위태롭게 매혹시킵니다.",
          en: "Black water-flowers meet colossal flames, violently spewing steam. Destructive expression-lust and genius explode to dangerously seduce the world."
        },
        earth: {
          ko: "무거운 진흙이 호수를 덮어 숨막히는 독살 지대를 만듭니다. 사회적 억압과 고착화된 편집증이 자아를 무너뜨려 수몰시킵니다.",
          en: "Heavy mud blankets the lake, forging a suffocating zone of toxic execution. Social oppression collapses the ego into an eternal submerge."
        },
        metal: {
          ko: "얼음 조각 같은 수만 개의 은빛 바늘이 바다 위로 쏟아집니다. 결백에 대한 광신과 서늘한 단절이 끝없는 살육의 심연을 만듭니다.",
          en: "Tens of thousands of silver needles pour over the sea. Fanatical obsession with purity and an icy severance forge an endless abyss of slaughter."
        },
        water: {
          ko: "검은 바다가 끝없이 깊어져 단 하나의 빛조차 허용하지 않습니다. 타락한 영성과 출구 없는 우울이 자아를 지워버립니다.",
          en: "The black sea deepens infinitely, denying even a single ray of light. Corrupted spirituality and exitless depression erase its existence."
        }
      }
    }
  },
  乙丑: {
    id: "eul-chuk",
    metadata: {
      kr_name: "을축(乙丑)",
      en_name: "Eul-chuk (Wood-Ox)",
      element: "Wood-Earth",
      animal: "Ox",
      nature_symbol: {
        ko: "동토를 가르는 핏빛 질경이",
        en: "Crimson Vine through Permafrost",
      },
    },
    core_identity: {
      persona: {
        ko: "침묵 속의 도살자",
        en: "The Silent Butcher",
      },
      goth_punk_vibe: {
        ko: "살을 에는 듯한 무자비한 겨울의 동토 속에서, 뿌리가 피범벅이 되는 것을 감수하며 기어코 바위를 뚫고 올라오는 덩굴입니다. 지독한 인내가 만들어낸 가장 고통스러운 생존입니다.",
        en: "A vine relentlessly breaking through boulders in the merciless, flesh-tearing permafrost of winter, willing to let its roots bleed. Painful survival born from toxic endurance.",
      },
      shadow_side: {
        ko: "자신이 겪은 모진 고통만큼 타인에게도 동일한 인내와 기준을 강요하며, 약자를 벌레처럼 경멸하는 파괴적 보상 의심리",
        en: "Forces the exact same endurance onto others that it suffered, harboring a destructive compensation psychology that despises the weak like insects.",
      },
    },
    behavior_metrics: { drive: 75, empathy: 25, stability: 85, unpredictability: 30 },
    compatibility_tags: { ideal_partner: ["Mok-geuk-to", "Su-saeng-mok"], caution_partner: ["Chuk-mi-chung"] },
    narrative_blocks: {
      default: {
        ko: "어떤 열악한 환경에도 불평 없이 살아남는 악바리. 하지만 억압받던 시기가 지나면 권력을 쥐고 폭군처럼 주변을 통제하기 시작합니다.",
        en: "A stubborn survivor making it through any abysmal environment. Once the oppression passes, it seizes power and controls its surroundings like a tyrant.",
      },
      relationship: {
        ko: "연인에게 자신의 방식대로 살 것을 은밀하게 세뇌시킵니다. 사랑이라는 명목 아래 상대가 상대할 수 있는 인내의 한계를 수술하듯 끝없이 시험합니다.",
        en: "Covertly brainwashes the lover into living by its methods. Relentlessly tests the limits of the partner's endurance like a clinical surgeon under the guise of love.",
      },
      timing_modifiers: {
        wood: {
          ko: "얼어붙은 흙 속에서 넝쿨이 기형적으로 꼬여 올릅니다. 뒤틀린 자아도취와 배타성이 결합되어 모두의 피를 빨아먹습니다.",
          en: "Vines grotesquely twist upward from frozen dirt. Twisted narcissism and xenophobia combine to suck the blood out of everyone."
        },
        fire: {
          ko: "숲을 통째로 불태우는 맹렬한 지옥불이 됩니다. 억압받던 욕망이 미친 듯이 분출하며 모든 것을 잿더미로 갈아버립니다.",
          en: "Becomes a blazing hellfire executing the entire forest. Suppressed desires erupt insanely, grinding everything to ashes."
        },
        earth: {
          ko: "엄청난 무게의 진흙더미가 생명력을 짓누릅니다. 극심한 물질적 강박과 통제욕이 자아를 감옥에 가둬 굶어 죽게 합니다.",
          en: "An immense weight of mud crushes vitality. Extreme material obsession and control-lust lock the ego in a prison, starving it to death."
        },
        metal: {
          ko: "꽁언 땅속에서 은빛 도끼들이 솟구쳐 오릅니다. 철저히 계산된 가학적 공격성과 신경증이 생명력을 도륙합니다.",
          en: "Silver axes thrust upward from frozen earth. Calculated sadistic aggression and neurosis butcher all vitality."
        },
        water: {
          ko: "핏빛 뿌리가 검은 물을 빨아들여 모두를 독살합니다. 심연에서 기어오르는 망상이 관계를 썩게 만듭니다.",
          en: "Crimson roots suck up contaminated black water, poisoning everyone. Destructive delusions cause relationships to rot thoroughly."
        }
      }
    }
  },
  丙寅: {
    id: "byeong-in",
    metadata: {
      kr_name: "병인(丙寅)",
      en_name: "Byeong-in (Fire-Tiger)",
      element: "Fire-Wood",
      animal: "Tiger",
      nature_symbol: {
        ko: "태양을 삼킨 야수",
        en: "The Beast that Swallowed the Sun",
      },
    },
    core_identity: {
      persona: {
        ko: "세상을 불태우는 예언자",
        en: "World-Burning Prophet",
      },
      goth_punk_vibe: {
        ko: "거대한 숲을 통째로 장작 삼아 터질 듯이 불타오르는 붉은 태양. 브레이크가 파괴된 진취성과 자신에 대한 광신적 믿음이 내뿜는 광기입니다.",
        en: "A red sun exploding in flames, using a massive forest as firewood. Madness emitted by extreme progressiveness with destroyed brakes and fanatical self-belief.",
      },
      shadow_side: {
        ko: "자신이 뿜는 빛으로 인해 주변이 잿더미가 되어가는 것을 찬양하는 기형적인 자기애와 오만불손",
        en: "A deformed narcissism that actively praises its own emitted light as it reduces its surroundings to sheer ash.",
      },
    },
    behavior_metrics: { drive: 95, empathy: 20, stability: 30, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"], caution_partner: ["In-shin-chung"] },
    narrative_blocks: {
      default: {
        ko: "태생부터 오만하며 세상을 리드하는 것이 당연하다 여깁니다. 직관력으로 문제를 돌파하지만, 거슬리는 의견은 불태워버립니다.",
        en: "Arrogant by birth, deeming it an absolute given to lead. Breaches problems via genius intuition, but burns down any dissenting opinions.",
      },
      relationship: {
        ko: "상대의 마음을 완전히 압도하여 자신만을 우러러보게 만드는 교주 같은 사랑. 연인이 그늘로 숨는 것을 용락하지 않습니다.",
        en: "A cult-leader-esque love that crushes the partner's heart to make them worship it strictly. Never permits the lover to hide in shadows.",
      },
      timing_modifiers: {
        wood: {
          ko: "거대한 숲이 불꽃에 멱혀 세상을 마비시킵니다. 광신적 학구열이나 자아 확신이 불바다를 만듭니다.",
          en: "A massive forest is violently devoured by flames, paralyzing the world. Obsessive zeal or warped self-assurance triggers a sea of fire."
        },
        fire: {
          ko: "두 개의 태양이 충돌해 모든 것을 증발시킵니다. 양인의 폭력성과 극단적 엘리트주의가 제왕의 제단을 피로 적십니다.",
          en: "Two suns collide, evaporating all life. Bloody Yangin violence and extreme elitism soak the Emperor's altar in blood."
        },
        earth: {
          ko: "불꽃이 용암 무덤에 갇혀 질식합니다. 과만과 결과에 대한 맹목성이 세상을 돌무덤 지옥으로 창조합니다.",
          en: "Flames get trapped in a lava-tomb and suffocate. Blind focus on outcomes forges the world into an obsidian crypt."
        },
        metal: {
          ko: "비늘 위에 은빛 가시가 박혀 피를 토합니다. 끝없는 승리욕과 자본 집착이 타락한 전쟁을 벌입니다.",
          en: "Silver thorns pierce the scales, coughing blood. Blind lust for victory and ruthless obsession toward capital wage a corrupted war."
        },
        water: {
          ko: "폭풍우가 태양마저 냉혹하게 식힙니다. 가혹한 시선과 억압된 신경쇠약이 자아의 심장을 얼음 속에 가둡니다.",
          en: "A dark storm coldly extinguishes the sun. Harsh societal gaze and suppressed breakdowns encage the ego's heart in ice."
        }
      }
    }
  },
  丁卯: {
    id: "jeong-myo",
    metadata: {
      kr_name: "정묘(丁卯)",
      en_name: "Jeong-myo (Fire-Rabbit)",
      element: "Fire-Wood",
      animal: "Rabbit",
      nature_symbol: {
        ko: "형광빛으로 타오르는 독초",
        en: "The Burning Venom-Weed",
      },
    },
    core_identity: {
      persona: {
        ko: "불안한 달빛의 광대",
        en: "Clown of the Anxious Moonlight",
      },
      goth_punk_vibe: {
        ko: "어두운 밤 타들어가는 형광색의 잡초. 끊임없이 흔들리며 미혹적 환각을 일으키되 속으로는 뼛속 깊은 공허에 시달립니다.",
        en: "A glamorous neon weed scorching the skin. Continuously sways to induce captivating hallucinations while suffering bone-deep emptiness internally.",
      },
      shadow_side: {
        ko: "타인의 온기를 갈취하지 않으면 금세 꺼져버리는 치명적인 의존성과 가스라이팅",
        en: "A lethal dependency and gaslighting that extinguishes rapidly unless it forcibly extorts others' warmth.",
      },
    },
    behavior_metrics: { drive: 55, empathy: 85, stability: 15, unpredictability: 95 },
    compatibility_tags: { ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"], caution_partner: ["Myo-yu-chung"] },
    narrative_blocks: {
      default: {
        ko: "아름답고 예민해 호감을 사지만, 감정의 기복이 극단적. 순간의 변덕으로 자기 자신마저 태워버리는 영섬한 미학입니다.",
        en: "Beautiful and sensitive but riding extreme emotional shifts. A dangerous aesthetic that burns even itself out of momentary capriciousness.",
      },
      relationship: {
        ko: "불안감을 연인에게 전이시킵니다. 위로를 요구하며, 조금이라도 외롭게 하면 자해적 방식으로 영구적 죄책감을 새깁니다.",
        en: "Transfers its own anxiety directly onto the lover. Demands flawless appeasement, permanently carving guilt into the partner via self-destructive methods.",
      },
      timing_modifiers: {
        wood: {
          ko: "독초들이 엉겨붙어 달빛마저 치단합니다. 심해처럼 깊은 자폐적 우울이 자아를 가라앉힙니다.",
          en: "Toxic weeds tangle madly, blocking out moonlight. Autistic depression deep as the abyss sinks the soul forever."
        },
        fire: {
          ko: "형광빛 독초가 발화하며 기괴한 춤을 춥니다. 통제력을 잃은 광기가 스스로를 매혹적인 매로 만듭니다.",
          en: "Neon toxic weeds spontaneously ignite. Madness outside control turns it into ashes in the most glamorous manner."
        },
        earth: {
          ko: "흙더미가 여린 불꽃을 비참히 이매장합니다. 질식할 듯한 현실주의와 소모적 탐닉이 영혼을 찌그러뜨립니다.",
          en: "Suffocating soil mounds bury the fragile flame alive. Asphyxiating realism and consuming indulgence crumple the soul."
        },
        metal: {
          ko: "은빛 메스가 다가와 독초의 심장부를 난도질합니다. 신경과민과 파괴가 피투성이 예술을 창조합니다.",
          en: "A silver scalpel completely mutilates the toxic weed. Hypersensitivity and sharp self-destruction design blood-soaked art."
        },
        water: {
          ko: "맹독수가 불꽃을 삼키며 악취를 뿜어냅니다. 공상에 지배된 영혼이 지독한 허무로 영원히 침몰합니다.",
          en: "Pitch-black toxic water swallows the flame. A soul dominated by toxic anxiety sinks into permanent nihilism."
        }
      }
    }
  },
  戊辰: {
    id: "mu-jin",
    metadata: {
      kr_name: "무진(戊辰)",
      en_name: "Mu-jin (Earth-Dragon)",
      element: "Earth-Earth",
      animal: "Dragon",
      nature_symbol: {
        ko: "대지를 뚫고 솟아오른 잿빛 성채",
        en: "The Ash-Gray Citadel",
      },
    },
    core_identity: {
      persona: {
        ko: "무덤 위에 군림하는 황제",
        en: "Emperor Over the Tombs",
      },
      goth_punk_vibe: {
        ko: "메마른 대지 위에 기괴하게 솟아난 거대한 바위 용. 그 난공불락의 성채이자 묵직한 힘으로 모든 것을 찍어 누르는 억압적 지배력입니다.",
        en: "A massive rock dragon bizarrely rising from a desolate earth. It is an impregnable citadel, an oppressive dominance crushing everything via sheer mass.",
      },
      shadow_side: {
        ko: "누구의 말도 듣지 않고 세상을 독자적 돌방에 생매장하려는 독재적 아집(백호괴강)",
        en: "Deaf to all other voices, harboring a dictatorial stubborness (Baekho/Gwaegang) that intends to bury the world alive into its own stone crypt.",
      },
    },
    behavior_metrics: { drive: 80, empathy: 10, stability: 95, unpredictability: 35 },
    compatibility_tags: { ideal_partner: ["To-saeng-geum", "Geum-saeng-su"], caution_partner: ["Jin-sul-chung"] },
    narrative_blocks: {
      default: {
        ko: "한번 마음먹은 것을 절대로 돌리지 않는 고집. 복종하지 않으면 사회적 입지를 통째로 산산조각냅니다.",
        en: "Rock-solid stubbornness that never bends. If one does not submit to its doctrine, it shatters their social standing to pieces.",
      },
      relationship: {
        ko: "가장 지독한 감시자. 연인을 성 안에 가두고 미동하는 것도 용납지 않는 헤비한 소유욕입니다.",
        en: "The most toxic surveillant. Heavy possessiveness that locks the lover inside its colossal castle with absolutely zero tolerance for deviation.",
      },
      timing_modifiers: {
        wood: {
          ko: "돌 성벽 사이에 검은 뿌리가 성채를 박살내려 합니다. 권력욕과 억압이 자아의 목을 조릅니다.",
          en: "Black roots wedged into stone break the citadel. Thirst for power and paranoid suppression choke the ego's neck."
        },
        fire: {
          ko: "거대한 화염 폭뭉이 모든 것을 용암으로 만듭니다. 뒤틀린 광신주의와 지식 턈욕이 자아를 독재화합니다.",
          en: "A massive firestorm turns everything to lava. Twisted fanaticism and abnormal knowledge-lust dictatorialy warp the ego."
        },
        earth: {
          ko: "진흙이 하늘마저 덮어 매장합니다. 고립무원의 아집과 광적 배타성이 존재를 생매장시킵니다.",
          en: "Mud blots out the sky. Absolute isolated obsession and lunatic xenophobia bury the existence alive."
        },
        metal: {
          ko: "바위 용의 입에서 은빛 가시가 쏟아져 도륙합니다. 자를 잰 듯한 파괴 본능이 접근하는 자를 참살합니다.",
          en: "Silver thorns surge from the dragon's maw. Calculated destructive instinct executes anyone approaching."
        },
        water: {
          ko: "오수와 진흙의 대홍수가 성채를 서서히 무너뜨립니다. 자본에 대한 타락한 집착이 견고한 자아를 부매킵니다.",
          en: "A great flood of mixed toxic sewage crumbles the citadel. Corrupted obsession with capital rots away the most solid ego."
        }
      }
    }
  },
  己巳: {
    id: "gi-sa",
    metadata: {
      kr_name: "기사(己巳)",
      en_name: "Gi-sa (Earth-Snake)",
      element: "Earth-Fire",
      animal: "Snake",
      nature_symbol: {
        ko: "마그마를 품은 황야",
        en: "Wasteland Embryoing Magma",
      },
    },
    core_identity: {
      persona: {
        ko: "불타는 대지의 파충류",
        en: "Reptile of the Burning Earth",
      },
      goth_punk_vibe: {
        ko: "척박한 황무지 밑에서 마그마를 조용히 똬리 틀듯 품고 있는 은밀한 열성. 겉으로는 차분하지만 속으론 모든 것을 삼킬 맹독성 집념이 꿈틀거립니다.",
        en: "A secret fervor silently coiling magma beneath a barren wasteland. Calm on the surface, but a highly toxic obsession to swallow everything squirms within.",
      },
      shadow_side: {
        ko: "자신의 야심을 결코 드러내지 않으면서 타인을 교묘히 독안에 가두려는 음흉한 소유욕",
        en: "A sly possessiveness that traps others in its venom without ever revealing its own ambition.",
      },
    },
    behavior_metrics: { drive: 75, empathy: 60, stability: 50, unpredictability: 70 },
    compatibility_tags: { ideal_partner: ["Hwa-saeng-to", "Mok-geuk-to"], caution_partner: ["Sae-hae-chung"] },
    narrative_blocks: {
      default: {
        ko: "눈빛 하나 안 변하고 상황을 주시하다가 결정적인 순간에 먹잇감을 낚아채는 매서운 생존 본질을 지녔습니다.",
        en: "Watches the matrix without blinking an eye, possessing a fierce survival nature that snatches the prey at the exact critical moment.",
      },
      relationship: {
        ko: "상대에게 온기를 제공하는 척하며 그 이면에 치밀한 집착을 숨깁니다. 한 번 엮이면 질식할 때까지 놓아주지 않는 달콤한 독입니다.",
        en: "Hides a meticulous obsession under the guise of providing warmth. A sweet poison that never lets go until asphyxiation once entangled.",
      },
      timing_modifiers: {
        wood: {
          ko: "메마른 풀 위로 피비린내 나는 신경망이 확장됩니다. 타인의 강요(관성)조차 교활한 권력욕으로 역이용하며 세력을 삼킵니다.",
          en: "A blood-scented neural net expands over dead grass. Even external coercions are slyly manipulated into power-lust, swallowing opposition."
        },
        fire: {
          ko: "지면이 갈라지며 마그마가 솟구쳐 오릅니다. 통제력을 잃은 집념과 지식(인성)이 끔찍한 오만함으로 분출됩니다.",
          en: "The ground cracks wide open, erupting magma. Obsession and arcane knowledge beyond control spew out as terrifying arrogance."
        },
        earth: {
          ko: "모래 폭풍이 몰아치며 적들을 맹목적으로 매장합니다. 고립된 투쟁심(비겁)이 자아를 비대한 성채로 만듭니다.",
          en: "Sandstorms rage, burying enemies blindly. Isolated combativeness swells the ego into an obese, fortified citadel."
        },
        metal: {
          ko: "모래 속에서 시퍼런 은장도가 뱀처럼 미끄러져 나옵니다. 무자비한 창조성(식상)이 잔혹하고 치명적인 결과들을 베어냅니다.",
          en: "A sapphire-tinged silver dagger slithers out from the sand like a snake. Ruthless creativity slices out cruel, lethal outcomes."
        },
        water: {
          ko: "은밀한 독이 검은 물줄기를 타고 거칠게 퍼져나갑니다. 탐욕(재성)에 제어당한 야심이 돌이킬 수 없는 타락의 바다를 만듭니다.",
          en: "Secret venom violently disperses through black currents. Ambition controlled by greed creates an irreversible ocean of corruption."
        }
      }
    }
  },
  庚午: {
    id: "gyeong-o",
    metadata: {
      kr_name: "경오(庚午)",
      en_name: "Gyeong-o (Metal-Horse)",
      element: "Metal-Fire",
      animal: "Horse",
      nature_symbol: {
        ko: "용광로를 뚫고 나온 은빛 전차",
        en: "Silver Chariot From the Forge",
      },
    },
    core_identity: {
      persona: {
        ko: "불타는 검을 쥔 기사",
        en: "Knight of the Flaming Blade",
      },
      goth_punk_vibe: {
        ko: "맹렬한 용광로의 열기를 견디며 제련된 날카로운 쇳덩어리. 피부가 타들어가는 고통을 스릴로 즐기며 가장 눈부신 파괴를 향해 오만한 질주를 시작합니다.",
        en: "A sharp chunk of metal forged through the fierce heat of a blast furnace. It enjoys the pain of roasting flesh as a thrill, beginning an arrogant dash towards the most blinding destruction.",
      },
      shadow_side: {
        ko: "피를 묻히며 전진하는 오만함을 당연한 승리의 대가라고 맹신하는 타락한 엘리트주의",
        en: "A corrupted elitism that blindly believes trampling over others with blood-soaked arrogance is a justified price of victory.",
      },
    },
    behavior_metrics: { drive: 90, empathy: 20, stability: 30, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ["To-saeng-geum", "Geum-saeng-su"], caution_partner: ["Ja-o-chung"] },
    narrative_blocks: {
      default: {
        ko: "가장 가혹한 규율 속에서 스스로를 담금질합니다. 두려움을 모르는 추진력이 세상을 잔혹하고도 아름답게 벱니다.",
        en: "Tempers itself within the most severe disciplines. A fearless momentum slashes the world both cruelly and beautifully.",
      },
      relationship: {
        ko: "연인마저 지배하고 조각하려 듭니다. 사랑이라는 명목 아래 자신의 완벽한 규격에 상대를 억지로 끼워 넣는 지독한 강박입니다.",
        en: "Dictates and sculpts even the lover. A severe compulsion forcing the partner into its flawless standards under the namesake of love.",
      },
      timing_modifiers: {
        wood: {
          ko: "마차 바퀴에 불붙은 가시나무들이 감깁니다. 치명적인 소유욕(재성)이 전차를 폭주하게 파멸로 이끕니다.",
          en: "Burning thorns entangle the chariot wheels. Lethal possessiveness drives the chariot into an accelerating rampage toward ruin."
        },
        fire: {
          ko: "용광로가 폭발하며 제련되던 갑옷마저 녹아내립니다. 극단적인 통제(관성)와 명예욕이 영혼을 질식사시킵니다.",
          en: "The furnace explodes, melting even the forged armor. Extreme draconian control and vanity asphyxiate the soul."
        },
        earth: {
          ko: "잿빛 대지가 갈라지며 전차의 궤도를 어지럽힙니다. 고집스러운 철학(인성)이 오히려 오만한 질주를 방해하며 자아를 땅에 처박습니다.",
          en: "The ash-gray earth splits, derailing the chariot's track. Stubborn archaic philosophy disrupts the arrogant sprint, slamming the ego into the mud."
        },
        metal: {
          ko: "수천 자루의 날 선 검들이 허공에서 쏟아집니다. 통제 불능의 경쟁심(비겁)이 세상을 피바다로 만드는 살육전을 엽니다.",
          en: "Thousands of edged swords pour from the air. Uncontrollable competitiveness launches a slaughterfest, turning the world into a blood sea."
        },
        water: {
          ko: "검은 물안개가 용광로를 식히며 서늘한 검광을 흩뿌립니다. 가혹한 지성(식상)이 타인의 모순을 잔혹하게 해부하여 동사시킵니다.",
          en: "A dark mist chills the forge, scattering a cold gleam. Ruthless intellect sadistically dissects others' hypocrisies, freezing them to death."
        }
      }
    }
  },
  辛未: {
    id: "sin-mi",
    metadata: {
      kr_name: "신미(辛未)",
      en_name: "Sin-mi (Metal-Sheep)",
      element: "Metal-Earth",
      animal: "Sheep",
      nature_symbol: {
        ko: "사막 구릉에 흩뿌려진 메스",
        en: "Scalpels Sown in the Dune",
      },
    },
    core_identity: {
      persona: {
        ko: "모래폭풍 속의 은장도",
        en: "Silver Dagger in the Sandstorm",
      },
      goth_punk_vibe: {
        ko: "조각나 갈라진 사막 한가운데 박혀 있는 서늘하고 정교한 은빛 메스. 건조한 모래바람에 깎이면서도 타협 없이 자신의 날을 더 예리하게 벼려내는 신경질적인 완벽주의입니다.",
        en: "A chilling, precise silver scalpel stuck in the middle of a parched desert. Even while eroded by dry sandstorms, it neurotically hones its blade sharper without compromise.",
      },
      shadow_side: {
        ko: "결백과 기준에 대한 히스테릭한 강박으로 타인의 아주 작은 흠집조차 잔혹하게 도려내려는 파괴적 결벽증",
        en: "A destructive mysophobia that brutally excises even the smallest flaws in others out of a hysterical obsession with purity and standards.",
      },
    },
    behavior_metrics: { drive: 60, empathy: 40, stability: 65, unpredictability: 55 },
    compatibility_tags: { ideal_partner: ["To-saeng-geum", "Su-saeng-mok"], caution_partner: ["Chuk-mi-chung"] },
    narrative_blocks: {
      default: {
        ko: "매마르고 고독한 겉모습 뒤에 가장 예리한 분별력을 감추고 있습니다. 거슬리는 것은 가차 없이 베어버리는 까칠한 감각의 소유자.",
        en: "Conceals the sharpest discernment behind a barren, lonely exterior. An owner of highly abrasive senses that ruthlessly cuts out anything offensive.",
      },
      relationship: {
        ko: "자신만의 엄격한 결계 안에서만 타인을 허락합니다. 하지만 그 선을 조금이라도 넘으면 미련 없이 관계의 숨통을 끊어버립니다.",
        en: "Only permits others inside its own strictly regulated barrier. But the absolute second they cross the line, it cuts the relation's windpipe without regret.",
      },
      timing_modifiers: {
        wood: {
          ko: "마른 모래 무덤 위로 뒤틀린 선인장이 신경질적으로 자라납니다. 치명적인 변덕(재성)이 스스로의 결백함을 찔러 피 흘리게 합니다.",
          en: "A twisted cactus grows neurotically over the dry sand tomb. Lethal whims fatally pierce its own purity, causing bleedout."
        },
        fire: {
          ko: "사막에 지옥불이 내리꽂히며 은빛 칼날을 맹렬히 지집니다. 가학적인 억압(관성)이 자아를 억누르며 신경분열을 초래합니다.",
          en: "Hellfire strikes the desert, mercilessly searing the silver blade. Sadistic repressions suppress the ego, resulting in severe schizophrenia."
        },
        earth: {
          ko: "뜨거운 흙이 모든 것을 생매장하며 질식시킵니다. 편집증적인 지식 탐구(인성)가 영혼을 영원한 미라로 만듭니다.",
          en: "Scorching earth buries everything alive, causing asphyxiation. Paranoiac knowledge-hoarding turns the soul into an eternal mummy."
        },
        metal: {
          ko: "수십 개의 면도날이 쏟아져 대기를 찢습니다. 날 선 배타성(비겁)이 주변의 숨소리마저 도륙내는 피의 장막을 칩니다.",
          en: "Dozens of razor blades shower down, shredding reality. A jagged xenophobia erects a blood curtain that butchering even the sound of breathing."
        },
        water: {
          ko: "사막 위에 차가운 독수를 뿌려 모든 생명을 얼려 죽입니다. 한 치의 오차도 없는 차가운 계산력(식상)이 세상을 얼음 감옥으로 변이시킵니다.",
          en: "Cold acidic water sprays over the desert, freezing all life to death. Zero-margin cold calculation algorithm mutates the world into an ice penitentiary."
        }
      }
    }
  },
  壬申: {
    id: "im-sin",
    metadata: {
      kr_name: "임신(壬申)",
      en_name: "Im-sin (Water-Monkey)",
      element: "Water-Metal",
      animal: "Monkey",
      nature_symbol: {
        ko: "심해로 가라앉는 은빛 암초",
        en: "Silver Reef Sinking into the Abyss",
      },
    },
    core_identity: {
      persona: {
        ko: "수은으로 덮인 유인원",
        en: "Ape Covered in Mercury",
      },
      goth_punk_vibe: {
        ko: "거대한 심해 저 밑바닥에서 끝없이 시리게 반짝이며 맹수를 품고 있는 은빛 암초. 질식할 듯한 지적 오만함을 무장한 가장 차가운 포식자입니다.",
        en: "A silver reef endlessly gleaming and cold, harboring beasts in the extreme bottom of the deep sea. The coldest predator armed with suffocating intellectual arrogance.",
      },
      shadow_side: {
        ko: "이성과 흐름 모두를 완벽하게 조종할 수 있다는 확신 속에서, 기만과 권모술수마저 지적 유희로 여기는 사이코패시",
        en: "A psychopathia that views even deception and machination as mere intellectual amusement, born from absolute conviction that logic and flow can be perfectly puppeted.",
      },
    },
    behavior_metrics: { drive: 70, empathy: 50, stability: 40, unpredictability: 80 },
    compatibility_tags: { ideal_partner: ["Geum-saeng-su", "Mok-saeng-hwa"], caution_partner: ["In-shin-chung"] },
    narrative_blocks: {
      default: {
        ko: "수은처럼 미끄러우며 범접할 수 없는 비상함을 감추고 있습니다. 언제든 형태를 바꿔 타인의 맹점을 잔혹하게 뚫고 파고듭니다.",
        en: "Slippery as mercury, concealing an untouchable brilliance. Re-shapes at will to ruthlessly breach right into others' blind spots.",
      },
      relationship: {
        ko: "상대방의 머리 위에서 완벽히 통제하길 즐깁니다. 유희가 끝나면 물거품처럼 실체 없이 사라져 영원한 환각으로 남습니다.",
        en: "Enjoys dictating entirely from above the partner's head. When the amusement ends, it vanishes intangibly like sea foam, remaining a permanent hallucination.",
      },
      timing_modifiers: {
        wood: {
          ko: "해저로 미역과 촉수들이 끝없이 뒤엉킵니다. 과다한 호기심(식상)이 오만을 증폭시켜 치명적인 독을 생산합니다.",
          en: "Kelp and tentacles endlessly tangle at the seabed. Lethal overexpression of curiosity heavily amplifies arrogance, producing terminal neurotoxins."
        },
        fire: {
          ko: "검은 바다 한가운데 불꽃이 튀며 대폭발이 일어납니다. 지배욕(재성)에 잠식된 천재성이 세상을 기괴한 잿더미로 뒤덮습니다.",
          en: "Sparks in the dark sea trigger a huge explosion. Genius corrupted by dominance-lust blankets the world in bizarre ash."
        },
        earth: {
          ko: "거대한 해저 지진이 탁류를 일으켜 은광석을 묻어버립니다. 꽉 막힌 규제(관성)가 자유로운 수은의 영혼을 미치게 합니다.",
          en: "A colossal submarine earthquake buries the silver ore under turbidity. Rigidly suffocating regulations drive the free mercury soul insane."
        },
        metal: {
          ko: "암초에서 뻗어나온 수천 개의 창날이 사방을 난도질합니다. 비틀린 편견(인성)이 심연의 망상을 진실로 믿게 만들어 학살을 자행합니다.",
          en: "Thousands of spearheads thrust from the reef, butchering the periphery. Twisted prejudices enforce abyssal delusions as absolute truth, sparking massacres."
        },
        water: {
          ko: "해일이 모든 것을 쓸어가 해양의 완전한 지배를 선언합니다. 통제할 수 없는 충동성(비겁)이 자기 자신조차 익사시키는 궤멸을 초래합니다.",
          en: "A massive tsunami wipes everything, declaring absolute marine dominion. Uncontrollable impulses drag even itself completely into an annihilating underwater death."
        }
      }
    }
  },
  癸酉: {
    id: "gye-yu",
    metadata: {
      kr_name: "계유(癸酉)",
      en_name: "Gye-yu (Water-Rooster)",
      element: "Water-Metal",
      animal: "Rooster",
      nature_symbol: {
        ko: "은잔에 담긴 검은 독주",
        en: "Black Poison in a Silver Chalice",
      },
    },
    core_identity: {
      persona: {
        ko: "결빙된 시간의 파수꾼",
        en: "Warden of Frozen Time",
      },
      goth_punk_vibe: {
        ko: "가장 정교하게 세공된 차가운 은잔에 담겨, 한 모금만으로 영혼을 마비시키는 흑수(黑水). 오물 하나 섞이지 않기 위해 스스로를 고립시킨 극단적 서늘함입니다.",
        en: "Black water paralyzing the soul with just a sip, served in an exquisitely crafted cold silver chalice. An extreme chill explicitly isolating itself to prevent a single drop of filth.",
      },
      shadow_side: {
        ko: "세상의 불순함을 저주하며, 자신마저 온전히 견디지 못하고 얼음 감옥에 가두어 영원히 몽상하려는 자멸적 결벽증",
        en: "Cursing the world's impurity, a self-destructive mysophobia that locks itself in an ice prison to eternally hallucinate, unable to even tolerate its own breath.",
      },
    },
    behavior_metrics: { drive: 55, empathy: 30, stability: 50, unpredictability: 85 },
    compatibility_tags: { ideal_partner: ["Geum-saeng-su", "Mok-saeng-hwa"], caution_partner: ["Myo-yu-chung"] },
    narrative_blocks: {
      default: {
        ko: "투명하고 시린 이성으로 세상을 조각냅니다. 곁에 가면 그 한기에 피부가 찢길 듯한 단절의 미학을 풍깁니다.",
        en: "Fragments the world via a transparent, chilling logic. Emits an aesthetic of severance that feels like your skin is slicing if you go near its frigid aura.",
      },
      relationship: {
        ko: "사랑할 때조차 무결점의 도마 위에 상대를 올리고 해부합니다. 혐오감이 드는 즉시 잔을 깨버리고 상대의 혀를 마비시킵니다.",
        en: "Places the lover on a flawless surgical table to strictly dissect them even during romance. Shows disgust, it shatters the chalice and paralyzes the partner's tongue instantly.",
      },
      timing_modifiers: {
        wood: {
          ko: "맹독을 머금은 검은 식물이 은잔을 깨고 번식합니다. 억눌려 있던 자기표현(식상)이 잔혹한 나르시시즘과 독설로 터져 나옵니다.",
          en: "A dark plant laced with venom breaks the silver chalice and propagates. Suppressed self-expression violently erupts as savage narcissism and toxic tongues."
        },
        fire: {
          ko: "끓어오른 독주가 펄펄 끓으며 유독 가스를 내뿜습니다. 물질에 대한 뒤틀린 집착(재성)이 가장 깨끗한 영혼마저 아스팔트처럼 더럽힙니다.",
          en: "The boiling toxic liquor spews neurotoxic gases. A warped obsession for materialism smears even the cleanest soul like street asphalt."
        },
        earth: {
          ko: "진흙이 은잔 표면을 더럽혀 그 존엄을 산산조각냅니다. 강제된 현실적 억압(관성)에 미치도록 오염되며 피폐해지는 정신 착란을 맞습니다.",
          en: "Mud stains the silver chalice's surface, shattering its dignity. Madly corrupted by forced systemic repression, inviting severe mental degradation."
        },
        metal: {
          ko: "은잔이 날카로운 수천 개의 파편으로 분열되어 세상을 찌릅니다. 과도하게 비틀린 결벽증(인성)이 타인의 사소한 허점조차 살육합니다.",
          en: "The silver chalice fractures into thousands of lethal shards, piercing reality. Excessively twisted paranoia massacres others over microscopic flaws."
        },
        water: {
          ko: "독주가 얼어붙어 검은 얼음 바늘이 됩니다. 외부와 완전히 차단된 극강의 자기연민(비겁)이 자아를 심연에 수장시킵니다.",
          en: "The poison freezes into a black ice needle. Extremely isolated narcissistic pity completely drowns the ego within the abyss."
        }
      }
    }
  },
  甲戌: {
    id: "gap-sul",
    metadata: {
      kr_name: "갑술(甲戌)",
      en_name: "Gap-sul (Wood-Dog)",
      element: "Wood-Earth",
      animal: "Dog",
      nature_symbol: {
        ko: "화산재 위에 뿌리내린 고독한 거목",
        en: "Giant Oak on the Ashen Hill",
      },
    },
    core_identity: {
      persona: {
        ko: "잿빛 대지의 고독한 패자",
        en: "Titan of the Ash",
      },
      goth_punk_vibe: {
        ko: "황량하고 메마른 암석지대에서 홀로 맹렬하게 잎을 틔워내는 파괴적인 생명력. 태워질 각오로 스스로 진흙 없는 둔덕에 뿌리를 내립니다.",
        en: "A destructive vitality violently sprouting leaves alone in a desolate, rocky wasteland. It roots itself in mudless hills, fully prepared to burn.",
      },
      shadow_side: {
        ko: "부러질지언정 결코 휘어지지 않으려는 강박과 타인에 대한 방어적인 배타성",
        en: "A rigid dogmatism that violently rejects all elements, preferring self-destruction over bending to the wind.",
      },
    },
    behavior_metrics: {
      drive: 90,
      empathy: 30,
      stability: 45,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-geuk-to", "Hwa-saeng-to"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "지옥 같은 환경에서도 기어코 자신의 숲을 일궈내고야 마는 파괴적인 잠재력을 가졌습니다.",
        en: "You possess the devastating potential to architect your own vast forest even in hellish environments.",
      },
      relationship: {
        ko: "가장 메마른 영토를 함께 버텨줄 온기를 원하지만, 누군가 뿌리를 침범하면 가차 없이 잎을 날카로운 무기로 바꿉니다.",
        en: "You crave warmth to endure the arid turf, but the second someone invades your roots, your leaves mutate into lethal blades.",
      },
      timing_modifiers: {
        wood: {
          ko: "빽빽한 가시나무들이 영토를 독식하며 미친 듯이 확산됩니다. 오만불손한 경쟁심(비겁)이 생태계를 무자비하게 삼켜버립니다.",
          en: "Dense thorn trees greedily monopolize the territory. Arrogant rivalry ruthlessly devours the entire ecosystem.",
        },
        fire: {
          ko: "뿌리까지 태워버릴 듯한 극단의 불꽃이 발산됩니다. 발현된 천재성(식상)이 잔혹한 불길이 되어 모든 섭리를 태웁니다.",
          en: "An extreme flame erupts, threatening to burn the roots. Erupting genius mutates into a cruel wildfire, incinerating all logic.",
        },
        earth: {
          ko: "메마른 영토가 광활하게 부풀어 오르며 산맥을 이룹니다. 결과와 영토(재성)에 대한 파멸적 탐욕이 대지를 장악합니다.",
          en: "The barren turf violently swells into a mountain range. Apocalyptic greed for territory absolutely dominates the land.",
        },
        metal: {
          ko: "차가운 은도끼가 나무의 껍질을 예리하게 벗겨냅니다. 가혹한 억지력(관성) 속에서 자아가 치명적이고 매끄러운 형태로 제련됩니다.",
          en: "A cold silver axe sharply peels the bark. Under severe systemic restraint, your ego is intensely refined into a lethal, sleek weapon.",
        },
        water: {
          ko: "차갑고 묵직한 안개비가 내려 고독한 뿌리를 위로합니다. 깊은 통찰력(인성)이 메마른 허기를 채우며 거대한 그늘을 형성합니다.",
          en: "A cold, heavy mist descends to console the lonely roots. Deep insight quenches the arid hunger, forming a colossal protective shadow.",
        },
      },
    },
  },

  乙亥: {
    id: "eul-hae",
    metadata: {
      kr_name: "을해(乙亥)",
      en_name: "Eul-hae (Wood-Pig)",
      element: "Wood-Water",
      animal: "Pig",
      nature_symbol: {
        ko: "차가운 심연 위에 핀 달빛 연꽃",
        en: "The Moonlight Lotus on Cold Waters",
      },
    },
    core_identity: {
      persona: {
        ko: "심해를 유랑하는 이끼",
        en: "Phantom of the Deep",
      },
      goth_punk_vibe: {
        ko: "뿌리 내릴 흙 한 줌 없이 검은 늪을 떠도는 서늘한 유랑. 세상의 탁류에 휩쓸리는 듯 보이지만, 그 무엇에게도 정복당하지 않는 부유하는 생명력입니다.",
        en: "A chilled wandering across black swamps without an inch of soil. You appear swept by turbulent tides, yet possess a floating vitality that defies conquest.",
      },
      shadow_side: {
        ko: "가장 깊은 바닥에 질식할 것 같은 우울을 감춰둔 채 끊임없이 도망치는 회피성",
        en: "Fleeing endlessly while concealing a suffocating melancholia within the deepest abyssal trenches.",
      },
    },
    behavior_metrics: {
      drive: 35,
      empathy: 90,
      stability: 20,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "Hwa-saeng-to"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "소리 없이 사람들을 끌어당기는 심해의 마력을 지녔습니다. 차갑고 깊은 어둠 속에서도 유연하게 살아남습니다.",
        en: "Possesses the silent, magnetic gravity of the deep sea. You survive fluidly even in the coldest, pitch-black darkness.",
      },
      relationship: {
        ko: "자신의 차가운 수면 아래로 누군가를 기꺼이 끌어안지만, 닻을 내리려고 강요하면 즉시 물안개로 피어오르며 흩어집니다.",
        en: "Willingly embraces partners beneath your freezing surface, but the instant they demand to drop an anchor, you evaporate into cold mist.",
      },
      timing_modifiers: {
        wood: {
          ko: "연꽃의 잔뿌리가 엮여 거대한 뗏목을 이룹니다. 기생과 공생이 뒤섞인 연대(비겁)가 거센 해류를 타며 세력을 확장합니다.",
          en: "Lotus roots entangle into a giant raft. A mix of parasitism and symbiosis aggressively rides the turbulent current to expand its reach.",
        },
        fire: {
          ko: "태양빛이 늪을 직격하여 형형색색의 독초를 피워냅니다. 압눌려 있던 광기(식상)가 세상 밖으로 찬란하고 위태롭게 만개합니다.",
          en: "Sunbeams strike the swamp, forcefully blooming neon toxic flora. Repressed madness gloriously and dangerously blossoms into reality.",
        },
        earth: {
          ko: "물 위로 흙탕물이 거칠게 침범해 들어옵니다. 현실의 육지(재성)에 발을 들이려다 영혼이 진흙투성이가 되는 혼돈을 맞습니다.",
          en: "Muddy water violently invades the clear surface. Attempting to step onto reality's soil leaves the soul covered in chaotic mud.",
        },
        metal: {
          ko: "차가운 은날이 연꽃의 줄기를 자비 없이 끊어버립니다. 숨 막히는 체제의 규율(관성)이 우아한 유랑을 고통스럽게 마비시킵니다.",
          en: "A cold silver blade ruthlessly severs the lotus stem. Suffocating systemic laws paralyze your elegant vagabondage in agony.",
        },
        water: {
          ko: "끝없는 폭우가 쏟아져 연꽃을 덮쳐버립니다. 과장된 피해망상과 심연의 생각(인성)이 오히려 자아를 깊게 익사시킵니다.",
          en: "Endless torrential rain entirely submerses the lotus. Hyper-magnified paranoia and abyssal thoughts fatally drown the ego.",
        },
      },
    },
  },

  丙子: {
    id: "byeong-ja",
    metadata: {
      kr_name: "병자(丙子)",
      en_name: "Byeong-ja (Fire-Rat)",
      element: "Fire-Water",
      animal: "Rat",
      nature_symbol: {
        ko: "심연을 가르는 칠흑 속의 붉은 등대",
        en: "Crimson Glow over the Abyss",
      },
    },
    core_identity: {
      persona: {
        ko: "경계선의 감시자",
        en: "Watcher of the Boundary",
      },
      goth_punk_vibe: {
        ko: "차디찬 얼음 호수 한가운데서 타오르는 기형적인 불꽃. 자신이 언제 꺼질지 모른다는 극도의 신경증 속에서 세상을 가장 섬세하게 투시합니다.",
        en: "A grotesque flame burning furiously in the center of a freezing lake. It sees through the world with razor precision entirely out of paranoid fear of extinction.",
      },
      shadow_side: {
        ko: "타인을 따뜻하게 데워주려는 의도와 달리, 자신의 빛을 온전히 주지 않고 한 발짝 물러나 지배하려는 교만",
        en: "An arrogant instinct to neurotically withhold the full flame, stepping back to dominate rather than to warm.",
      },
    },
    behavior_metrics: {
      drive: 65,
      empathy: 55,
      stability: 35,
      unpredictability: 75,
    },
    compatibility_tags: {
      ideal_partner: ["Su-geuk-hwa", "Mok-saeng-hwa"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "어둠이 짙어질수록 당신의 가치는 폭발합니다. 위태로운 균형 속에서 가장 예리한 파괴력과 시야를 선점합니다.",
        en: "Your value detonates as the darkness thickens. Balancing on a razor's edge, you monopolize the sharpest destructive vision.",
      },
      relationship: {
        ko: "상대방의 그림자를 누구보다 밝게 비춰 해부하지만, 당신의 본질을 캐려 들면 뜨거운 스파크를 튀기며 상대의 시야를 멀게 합니다.",
        en: "You brightly illuminate and dissect their shadows. But if they dig into your core, you detonate sparks that blind their vision.",
      },
      timing_modifiers: {
        wood: {
          ko: "검은 물 위로 거대한 맹그로브 숲이 솟아나 불을 키웁니다. 지식과 탐구(인성)가 영혼을 고양시키고 불꽃의 존엄을 지킵니다.",
          en: "Colossal mangroves breach the black water to feed the fire. Arcane inquiry violently elevates your soul and guards the flame’s dignity.",
        },
        fire: {
          ko: "수증기가 증발하며 온 호수가 시뻘겋게 타오릅니다. 나르시시즘(비겁)이 극에 달해 자신이 태양임을 강요하는 독선이 폭발합니다.",
          en: "The lake boils and glows red. Peak narcissism erupts into a dogmatic mandate, violently enforcing your status as the absolute sun.",
        },
        earth: {
          ko: "거대한 토사가 호수를 덮어 불꽃을 안착시킵니다. 끝없는 반항(식상) 속에서 치명적인 창작물이 세상의 질서를 거스르며 태어납니다.",
          en: "Massive debris buries the lake, anchoring the fire. Endless rebellion spawns a lethal creation that actively defies world order.",
        },
        metal: {
          ko: "호수 밑에서 막대한 황금이 반사되어 불빛을 어지럽힙니다. 현실적 목표와 탐욕(재성)이 시야를 멀게 하며 본질을 어지럽힙니다.",
          en: "Massive gold from the lakebed distorts the light. Hypnotic greed for outcomes severely blinds your vision and scrambles reality.",
        },
        water: {
          ko: "심해의 탁류가 거칠게 몰아치며 등대를 포위합니다. 살인적인 억압(관성)이 빛을 삼키려 들자 절망 속에 날 선 생존 본능이 깨어납니다.",
          en: "A torrential deep-sea current besieges the lighthouse. Murderous systemic smothering violently awakens a jagged, terrifying survival instinct.",
        },
      },
    },
  },

  丁丑: {
    id: "jeong-chuk",
    metadata: {
      kr_name: "정축(丁丑)",
      en_name: "Jeong-chuk (Fire-Ox)",
      element: "Fire-Earth",
      animal: "Ox",
      nature_symbol: {
        ko: "동토 아래 타오르는 마그마",
        en: "Magma Beneath the Tundra",
      },
    },
    core_identity: {
      persona: {
        ko: "은폐된 용광로",
        en: "Dormant Volcano",
      },
      goth_punk_vibe: {
        ko: "겉보기엔 차갑게 굳어버린 잿빛 얼음덩어리. 그러나 그 내부는 타는 듯한 맹독과 언제 터질지 모르는 치명적인 열망이 미친 듯이 끓고 있습니다.",
        en: "An ash-gray ice block heavily crusted on the outside. But inside, it violently boils with searing toxins and lethally repressed desires, ready to detonate.",
      },
      shadow_side: {
        ko: "결코 드러내지 않는 지독한 앙심과, 상대방에 대한 결벽적인 의심을 내면에 욱여넣는 병적인 인내",
        en: "A pathological endurance that forces a toxic, silent grudge and absolute paranoid suspicion down into the subterranean dark.",
      },
    },
    behavior_metrics: {
      drive: 45,
      empathy: 70,
      stability: 80,
      unpredictability: 50,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Hwa-saeng-to"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "조용하고 차갑게 인내하지만, 임계점을 넘는 순간 그동안의 모든 빙하를 피비린내 나는 마그마로 덮어버립니다.",
        en: "Quietly and coldly enduring. But the millisecond the threshold breaks, all glaciers are instantly vaporized by blood-red magma.",
      },
      relationship: {
        ko: "상대방의 상처를 무심하게 안아주는 넓은 품을 가졌습니다. 그러나 배신의 징후가 발견되면 단 한 번의 경고 없이 용암 속으로 당신을 함께 추락시킵니다.",
        en: "Offers a vast, indifferent embrace for their scars. But at the first sign of treason, you drag them mercilessly into the caldera without a single warning.",
      },
      timing_modifiers: {
        wood: {
          ko: "마그마 속으로 거대한 통나무들이 던져집니다. 기이할 정도의 학문적 탐욕(인성)이 지저를 비집고 세상에 검은 연기를 내뿜습니다.",
          en: "Massive logs are hurled into the magma. A grotesque academic obsession forces black smoke violently upward from the subterranean.",
        },
        fire: {
          ko: "분화구가 찢어지며 시뻘건 화염이 대기를 덮습니다. 통제 불능의 교만과 경쟁심(비겁)이 억압을 뚫고 지옥의 파티를 엽니다.",
          en: "The crater shreds open as crimson fire blankets the sky. Uncontrollable arrogance completely shreds repression, launching a hellish festival.",
        },
        earth: {
          ko: "마그마 층위로 수백 겹의 흙이 덧세워져 완전히 동면합니다. 병적인 고독과 창의력(식상)이 지하실의 미궁 속으로 끝없이 파고듭니다.",
          en: "Hundreds of soil layers trap the magma in deep hibernation. Pathological isolation forces creativity into an endless, subterranean labyrinth.",
        },
        metal: {
          ko: "마그마가 차가운 은광석을 맹렬히 집어삼킵니다. 결과에 굶주린 잔인한 야심(재성)이 가장 치명적인 무기를 암흑 속에서 담금질합니다.",
          en: "Magma fiercely swallows cold silver ore. A ruthless starvation for material triumph tempers the deadliest weapons in total darkness.",
        },
        water: {
          ko: "지하수에 마그마가 직격하며 치명적인 수증기가 폭발합니다. 거대한 통제 체제(관성)에 갇히더라도 수단과 방법을 가리지 않고 틈새를 부수고 나갑니다.",
          en: "Groundwater strikes the magma, triggering a toxic steam explosion. Trapped by a massive regime, it violently shatters every crack to escape.",
        },
      },
    },
  },

  戊寅: {
    id: "mu-in",
    metadata: {
      kr_name: "무인(戊寅)",
      en_name: "Mu-in (Earth-Tiger)",
      element: "Earth-Wood",
      animal: "Tiger",
      nature_symbol: {
        ko: "태풍이 몰아치는 험준한 바위산",
        en: "Rugged Mountain in a Typhoon",
      },
    },
    core_identity: {
      persona: {
        ko: "폭풍 속의 성채",
        en: "Citadel in the Storm",
      },
      goth_punk_vibe: {
        ko: "거대한 산맥 위를 폭주하는 날 선 비바람. 자신이 통제할 수 없는 잔혹한 환경 속에서도 결코 흔들리지 않으려 바위에 손톱을 박아 넣는 장엄한 아집입니다.",
        en: "A razor-sharp tempest raging over a titan mountain range. A majestic, terrifying stubbornness digging its claws into the rock to remain unbroken in chaos.",
      },
      shadow_side: {
        ko: "모든 것을 포용하는 듯하지만 실제론 통제 불능의 타인을 혐오하며, 고립 속으로 자아를 격리하려는 강권적인 독선",
        en: "An authoritarian dogma that simulates total embrace, while secretly loathing uncontrollable elements and forcibly quarantining the ego.",
      },
    },
    behavior_metrics: {
      drive: 80,
      empathy: 40,
      stability: 60,
      unpredictability: 55,
    },
    compatibility_tags: {
      ideal_partner: ["Hwa-saeng-to", "Mok-geuk-to"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "내부의 맹수를 산맥의 장엄함으로 숨기고 있습니다. 시련이 닥치면 도망치기보다 판 자체를 부숴버리는 호전성이 드러납니다.",
        en: "Conceals an inner beast beneath the mountain's grandeur. When trials hit, a raw belligerence chooses to smash the entire board rather than retreat.",
      },
      relationship: {
        ko: "상대에게 기꺼이 그늘이 되어 주지만, 산의 규율을 어기고 기어오르려는 순간 바위 벼랑 밖으로 가차 없이 밀어버립니다.",
        en: "Willingly offers shade to partners, but the exact moment they violate the mountain's law and attempt to climb you, you hurl them off the cliff.",
      },
      timing_modifiers: {
        wood: {
          ko: "산맥 전체가 나무 검들에 찔려 무너질 듯 파고듭니다. 끔찍할 정도의 강박적 억압(관성)이 심연의 분노를 깨워 최후의 전쟁을 유발합니다.",
          en: "The mountain is viciously impaled by an armada of wood swords. Horrific systemic repression awakens abyssal rage, triggering the final war.",
        },
        fire: {
          ko: "태풍이 물러가고 산맥 전체가 시뻘겋게 달궈집니다. 마비된 영감과 자의식(인성)이 눈을 뜨며 잔혹한 현실을 불태우는 대각성을 이룹니다.",
          en: "The typhoon clears, and the entire mountain is branded red. Paralyzed ego and profound inspiration violently awaken to scorch reality.",
        },
        earth: {
          ko: "산맥이 지진을 뚫고 무자비하게 확장합니다. 절대적인 영토 방어와 투쟁심(비겁)이 모든 경쟁 생태계를 강제로 평정해 버립니다.",
          en: "The mountains brutally expand through a massive earthquake. Absolute territorial defense violently suppresses all rival ecosystems into silence.",
        },
        metal: {
          ko: "거대한 산에서 날카로운 은맥이 미친 듯이 솟아오릅니다. 모든 것을 찢어발기는 잔혹한 비판력(식상)이 세상을 서늘하게 평가합니다.",
          en: "Sharp silver veins erupt madly from the grand mountain. A ruthless, system-tearing critique algorithm coldly evaluates the world.",
        },
        water: {
          ko: "산맥의 계곡을 침수시키는 끔찍한 해일이 덮칩니다. 끝을 모르는 허기와 탐욕(재성)이 통제력을 상실하고 거대한 사상누각을 쌓습니다.",
          en: "A lethal tsunami floods the mountain valleys. Bottomless hunger and greed shatter control, constructing a massive, doomed house of cards.",
        },
      },
    },
  },

  己卯: {
    id: "gi-myo",
    metadata: {
      kr_name: "기묘(己卯)",
      en_name: "Gi-myo (Earth-Rabbit)",
      element: "Earth-Wood",
      animal: "Rabbit",
      nature_symbol: {
        ko: "미궁이 된 붉은 이끼",
        en: "Labyrinth of Crimson Moss",
      },
    },
    core_identity: {
      persona: {
        ko: "함정을 품은 안식처",
        en: "Oasis with a Trap",
      },
      goth_punk_vibe: {
        ko: "습하고 어두운 흙길 밑으로 보이지 않는 가시뿌리들이 신경망처럼 뻗어 있습니다. 포근히 안기는 듯하지만, 언제든 상대를 옭아매어 피를 빨아먹을 치명적인 함정입니다.",
        en: "Invisible thorny roots spread like a neural net beneath a damp, dark soil path. It feels comforting, but is a lethal trap ready to entangle and siphon blood at any second.",
      },
      shadow_side: {
        ko: "타인의 신경질적인 반응을 즐기며 파괴를 유도하는 병적인 예민함과, 벗어나지 못하게 조종하려는 소유욕",
        en: "A pathological sensitivity that sadistically enjoys inducing nervous reactions in others, coupled with a deep urge to tightly puppet them.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 60,
      stability: 35,
      unpredictability: 75,
    },
    compatibility_tags: {
      ideal_partner: ["Hwa-saeng-to", "Mok-geuk-to"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "상황을 재빨리 스캔하고 가장 안전한 틈새로 파고듭니다. 여린 듯하지만 등 뒤에 치명적인 신경독을 감추고 있습니다.",
        en: "Quickly scans the matrix and perfectly infiltrates the safest gaps. Appears delicate but harbors a lethal neurotoxin right behind its back.",
      },
      relationship: {
        ko: "상대방의 마음을 미궁처럼 에둘러 시험합니다. 나의 예민함을 견디지 못하고 지치는 자는 조용히 뿌리의 거름으로 전락시킵니다.",
        en: "Tests the partner via a labyrinth of indirect mind-games. Those who exhaust from your sensitivity quietly become fertilizer for your hidden roots.",
      },
      timing_modifiers: {
        wood: {
          ko: "미로를 메우는 가시덤불이 피비린내를 풍기며 군락을 넓힙니다. 숨 막히는 환경적 박해(관성) 속에서 지옥 같은 신경전이 발발합니다.",
          en: "Thorny vines reeking of blood expand the colony, filling the maze. Under suffocating systemic persecution, a hellish psychological warfare ignites.",
        },
        fire: {
          ko: "햇살이 진흙에 스며 붉은 이끼꽃을 만개시킵니다. 불안과 공포를 연료로 천재적인 직관력(인성)이 타오르며 지배자로 거듭납니다.",
          en: "Sunlight bleeds into the mud, making crimson moss bloom wildly. Using anxiety as jet fuel, genius-level intuition violently crowns you the ruler.",
        },
        earth: {
          ko: "무너진 영토가 거대한 고분으로 뒤덮입니다. 지독한 고집과 뺏기지 않으려는 발악(비겁)이 수면 위로 피어오릅니다.",
          en: "Broken terrain is entirely covered by massive burial mounds. A brutal stubbornness and frantic fight against being stripped bare breaches the surface.",
        },
        metal: {
          ko: "은빛 낫이 이끼를 도려내어 길을 냅니다. 기형적인 불만과 날 선 예리함(식상)이 기존의 질서를 잔혹하게 가위질합니다.",
          en: "A silver scythe hollows out the moss to forge a path. Grotesque discontent and razor-edge critique mercilessly scissor down the existing order.",
        },
        water: {
          ko: "늪지대에 핏빛 장대비가 내려 미궁을 익사시킵니다. 결과에 집착하는 광기(재성)가 이성을 파괴하며 위태로운 블랙 스완을 잉태합니다.",
          en: "Crimson rain forces the labyrinth to drown under the swamp. Outcome-obsessed madness radically corrupts logic, conceiving a precarious black swan.",
        },
      },
    },
  },

  庚辰: {
    id: "gyeong-jin",
    metadata: {
      kr_name: "경진(庚辰)",
      en_name: "Gyeong-jin (Metal-Dragon)",
      element: "Metal-Earth",
      animal: "Dragon",
      nature_symbol: {
        ko: "안개를 찢는 은빛 용",
        en: "Silver Dragon of the Mist",
      },
    },
    core_identity: {
      persona: {
        ko: "무자비한 심판관",
        en: "Ruthless Inquisitor",
      },
      goth_punk_vibe: {
        ko: "거대한 화강암 협곡을 부수며 직진하는 차가운 금속 덩어리. 자신의 신념이 세상의 유일한 질서라고 믿는 폭력적일 만큼 숭고한 영혼입니다.",
        en: "A cold, massive metal titan crushing directly through a granite gorge. An extremely sublime soul, violently believing its dogma is the world's only law.",
      },
      shadow_side: {
        ko: "나약함과 동정을 극도로 혐오하며, 타인을 검문하고 단죄하지 않으면 직성이 풀리지 않는 강박",
        en: "A deep visceral hate for weakness and pity, paired with a manic compulsion to checkpoint and brutally punish everyone.",
      },
    },
    behavior_metrics: {
      drive: 95,
      empathy: 20,
      stability: 75,
      unpredictability: 50,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Hwa-geuk-geum"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "상대가 누구든 눈치를 보지 않으며 잔인한 돌파력으로 질서를 억압합니다. 무소의 뿔처럼 모든 장애물을 은빛 비늘로 베어버립니다.",
        en: "Suppresses existing orders with brutal breakthrough force, caring zero for optics. Slashes every obstacle down with cold silver scales.",
      },
      relationship: {
        ko: "가장 든든한 방벽이 되지만, 애교나 투정 같은 나약함을 보이면 멸시의 시선을 보내며 단칼에 숨통을 막아버립니다.",
        en: "Will be the ultimate fortress, but show a sliver of weak whining, and you'll receive a gaze of pure contempt followed by a cold, instant cutoff.",
      },
      timing_modifiers: {
        wood: {
          ko: "은빛 용이 거대한 숲을 피비린내 나게 학살합니다. 돈과 영토(재성)에 대한 무자비한 집착이 폭주하며 모든 것을 발아래 둡니다.",
          en: "The silver dragon executes a blood-drenched massacre on the titan forest. Ruthless addiction to turf and capital crushes everything beneath its claws.",
        },
        fire: {
          ko: "강철 비늘이 시뻘건 화염에 고통스럽게 불탐니다. 피 말리는 명예의 무게(관성) 속에서 지옥의 제련 과정을 거쳐 한계치를 부숩니다.",
          en: "Steel scales scream as they burn in sheer red flame. Enduring the lethal weight of honor forces a hellish tempering that shatters human limits.",
        },
        earth: {
          ko: "화강암 감옥에 갇혀 질식상태에 빠집니다. 과도한 고집과 망상(인성)이 영혼의 산소공급을 차단하여 자아를 기괴하게 봉인합니다.",
          en: "Trapped and suffocating inside a granite prison. Lethal stubbornness and delusion completely cut off the soul's oxygen, grotesquely sealing the ego.",
        },
        metal: {
          ko: "협곡에 똑같은 은빛 용들이 쏟아져 나와 살육전을 엽니다. 양보 따위 없는 경쟁심(비겁)이 세상을 서늘한 빙하기로 얼려버립니다.",
          en: "Identical silver dragons pour into the gorge, opening a bloodbath. Absolute zero-concession rivalry violently freezes the world into a new ice age.",
        },
        water: {
          ko: "은빛 용이 무자비한 해일을 끌어모아 계곡을 박살냅니다. 타협 없는 반항심과 천재성(식상)이 사회의 룰을 조롱하며 질서를 침몰시킵니다.",
          en: "The dragon summons a merciless tsunami to obliterate the valley. Uncompromising defiance and raw genius sadistically mock societal rules and sink the order.",
        },
      },
    },
  },

  辛巳: {
    id: "shin-sa",
    metadata: {
      kr_name: "신사(辛巳)",
      en_name: "Shin-sa (Metal-Snake)",
      element: "Metal-Fire",
      animal: "Snake",
      nature_symbol: {
        ko: "독을 머금은 백사",
        en: "Venomous White Snake",
      },
    },
    core_identity: {
      persona: {
        ko: "아름다운 단두대",
        en: "Beautiful Guillotine",
      },
      goth_punk_vibe: {
        ko: "붉은 용광로 속에서 스스로 벼려낸 차갑고 섬세한 투명 은장도. 숨 막히는 제어 속에서 가장 아름다운 칼집에 자신의 치명성을 숨기고 있습니다.",
        en: "A cold, ultra-fine transparent silver dagger self-forged in a red furnace. Hidden inside the most beautiful sheath, it operates under suffocating self-control.",
      },
      shadow_side: {
        ko: "완벽함에 대한 신경증적 집착과, 조금의 결여도 허락하지 못해 전부를 폐기물로 취급하는 가학적 완벽주의",
        en: "A neurotic obsession with flawlessness, and a sadistic perfectionism that violently labels anything with a single missing pixel as trash.",
      },
    },
    behavior_metrics: {
      drive: 70,
      empathy: 45,
      stability: 55,
      unpredictability: 65,
    },
    compatibility_tags: {
      ideal_partner: ["Hwa-geuk-geum", "To-saeng-geum"],
      caution_partner: ["Sa-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "가장 우아한 자태로 위장하지만, 한 번 타겟으로 락온(Lock-on)되면 머뭇거림 없이 약점의 가장 깊숙한 곳을 찔러 도려냅니다.",
        en: "Camouflaged in ultimate elegance, but once locked onto a target, it pierces the absolute deepest nerve without a microsecond of hesitation.",
      },
      relationship: {
        ko: "현미경으로 보듯 섬세한 애정을 주지만, 기준치에 도달하지 못하거나 거짓을 들키는 순간 얼음처럼 서늘하게 웃으며 폐기 처분합니다.",
        en: "Micro-manages affection with pinpoint precision. But the exact moment you fail the baseline or glitch, you are disposed of with an icy smile.",
      },
      timing_modifiers: {
        wood: {
          ko: "가시덤불을 은장도로 미친 듯이 난도질합니다. 성취와 돈(재성)에 대한 병리학적 갈구로 인해 스스로의 칼날마저 뭉개놓을 위험이 큽니다.",
          en: "The silver dagger frantically hacks the thicket to shreds. A pathological craving for success heavily risks grinding down its own lethal blade.",
        },
        fire: {
          ko: "가장 뜨거운 용광로에 처박혀 형태가 녹아내립니다. 거대한 억압과 고문(관성) 속에서 미칠 듯한 히스테리가 서늘한 증오로 세공됩니다.",
          en: "Forced into the hottest furnace, the form begins to melt. Horrific repression brutally refines manic hysteria into an ice-cold, crystalline hate.",
        },
        earth: {
          ko: "두꺼운 흙구덩이에 은장도가 생매장 당합니다. 은폐된 자의식과 학구열(인성)이 지하실에서 악마적인 교리로 체계화됩니다.",
          en: "The silver dagger is buried alive in a thick dirt mound. Concealed ego and dark study systematically assemble into a demonic ideology in the basement.",
        },
        metal: {
          ko: "수천 개의 은빛 바늘이 요동치며 떨어집니다. 한치의 오차 없는 편집증과 동족살해의 생존 본능(비겁)이 자비의 여백을 완전히 삭제합니다.",
          en: "Thousands of silver needles crash down wildly. Zero-error paranoia and fratricidal survival instinct perfectly delete all margins of mercy.",
        },
        water: {
          ko: "차가운 맹독이 강물과 섞여 생태계를 산화시킵니다. 천재적인 두뇌회전과 신경독(식상)이 세상의 위선자들을 조롱하며 부식시켜 버립니다.",
          en: "Cold venom mixes with the river, oxidizing the ecosystem. Genius processing cores and neurotoxins sadistically mock and corrode all hypocrites.",
        },
      },
    },
  },

  壬午: {
    id: "im-o",
    metadata: {
      kr_name: "임오(壬午)",
      en_name: "Im-o (Water-Horse)",
      element: "Water-Fire",
      animal: "Horse",
      nature_symbol: {
        ko: "용암을 덮치는 해일",
        en: "Lava-devouring Tsunami",
      },
    },
    core_identity: {
      persona: {
        ko: "충돌하는 검은 파도",
        en: "Colliding Tides",
      },
      goth_punk_vibe: {
        ko: "절대 섞이지 않는 불지옥과 한랭한 해일이 내부에서 끝없이 화학 폭발을 일으킵니다. 치명적인 변덕과 파도 치는 열망이 영혼을 뒤흔듭니다.",
        en: "Hellfire and freezing tsunami endlessly trigger chemical detonations inside. Lethal volatility and crashing desires violently shake the core.",
      },
      shadow_side: {
        ko: "목표를 손에 넣기 위해서라면 가장 사랑하는 것마저 한순간에 포기할 수 있는 소름 돋는 이중성과 비정함",
        en: "A spine-chilling duality that will instantly abandon what it loves most in the blink of an eye to capture a targeted outcome.",
      },
    },
    behavior_metrics: {
      drive: 80,
      empathy: 50,
      stability: 25,
      unpredictability: 95,
    },
    compatibility_tags: {
      ideal_partner: ["Hwa-saeng-to", "Su-geuk-hwa"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "어둠 속 깊은 심계를 감춘 채 불꽃처럼 사교적으로 세상을 휩씁니다. 도저히 예측할 수 없는 역동성이 당신의 무기입니다.",
        en: "Sweeps the world with seemingly warm, sociable fire, while hiding a deep, dark oceanic scheme. Your totally unpredictable trajectory is your primary weapon.",
      },
      relationship: {
        ko: "가장 매혹적인 파도로 상대를 집어 삼키지만, 온도가 최고조에 닿는 순간 뒤돌아보지도 않고 증발해 서늘한 바다로 떠납니다.",
        en: "Swallows partners with a mesmerizing wave. But the absolute second the temperature peaks, you evaporate without looking back, leaving only a cold ocean.",
      },
      timing_modifiers: {
        wood: {
          ko: "해안가에 야만적인 열대우림이 치솟습니다. 폭발적인 반항심과 매혹(식상)이 통제를 부수고 잔혹한 유혹의 축제를 엽니다.",
          en: "A savage rainforest pierces the shoreline. Explosive rebellion and seduction violently crack control, initiating a ruthless festival of temptation.",
        },
        fire: {
          ko: "바닷물이 증발하며 해저의 활화산이 뻘겋게 열립니다. 극단적인 물질주의와 광기 어린 집착(재성)이 이성을 파괴하며 폭주합니다.",
          en: "The sea boils away, revealing a red-hot underwater volcano. Extreme materialism and psychotic obsession entirely destroy rationality, going absolutely rogue.",
        },
        earth: {
          ko: "거대한 토사가 쓰나미를 억지로 막아 세웁니다. 질식할 듯한 통제망(관성) 속에서 위태로운 암투와 정치적 생존 본능이 가동됩니다.",
          en: "Massive debris forcibly barricades the tsunami. Under a suffocating control matrix, hyper-precarious political survival instincts and hidden wars activate.",
        },
        metal: {
          ko: "은빛 빙하가 떨어져 내려 불꽃을 즉시 동결시킵니다. 차가운 이성과 결벽증(인성)이 파괴적 본능을 얼려버려 무서운 위선자로 거듭납니다.",
          en: "Silver glaciers crash and instantly freeze the flame. Cold logic and OCD violently crystallize the destructive drive, forging a terrifying hypocrite.",
        },
        water: {
          ko: "검은 해일이 수백 배로 불어나 용암을 모조리 덮어버립니다. 나르시시즘과 이기심(비겁)이 수몰의 에너지가 되어 모든 타자를 익사시킵니다.",
          en: "A black tsunami multiplies a hundredfold to wholly drown the magma. Absolute narcissism and selfishness mutate into a flood energy, drowning all others.",
        },
      },
    },
  },

  癸未: {
    id: "gye-mi",
    metadata: {
      kr_name: "계미(癸未)",
      en_name: "Gye-mi (Water-Sheep)",
      element: "Water-Earth",
      animal: "Sheep",
      nature_symbol: {
        ko: "사막에 내리는 검은 비",
        en: "Black Rain on the Dunes",
      },
    },
    core_identity: {
      persona: {
        ko: "환영을 품은 방랑자",
        en: "Mirage Wanderer",
      },
      goth_punk_vibe: {
        ko: "물 한 방울 없는 작열하는 사구(砂丘)를 칠흑 같은 빗방울로 어떻게든 잠재우려는 병적인 투쟁. 영원한 갈증 속에서도 끝내 마르지 않습니다.",
        en: "A pathological struggle to violently quench a scorching, bone-dry sand dune using pitch-black raindrops. Even within infinite thirst, it refuses to evaporate.",
      },
      shadow_side: {
        ko: "겉으로는 다 안다는 듯 평온하게 순응하지만, 내면에 지독한 한(恨)과 타인을 구속하려는 집요한 올가미를 엮는 그림자",
        en: "Displays a calm, knowing compliance on the surface, but internally weaves a deeply toxic sorrow and a relentless noose to strangle targets.",
      },
    },
    behavior_metrics: {
      drive: 40,
      empathy: 80,
      stability: 50,
      unpredictability: 70,
    },
    compatibility_tags: {
      ideal_partner: ["Su-geuk-hwa", "To-geuk-su"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "황폐한 지옥에서도 조용히 파고드는 적응력을 보입니다. 아무도 거들떠보지 않는 버려진 것들 속에서 치명적인 가치를 추출합니다.",
        en: "Shows silent, creeping adaptability even in an apocalyptic wasteland. Excisely extracts lethal value from abandoned ruins nobody glances at.",
      },
      relationship: {
        ko: "절대 채워지지 않는 내면의 사막을 적셔줄 온기를 은밀하게 갈취하지만, 내가 베푼 희생을 인정하지 않으면 그들의 오아시스를 독으로 오염시킵니다.",
        en: "Stealthily extorts warmth to hydrate an unfillable internal desert. But if you fail to validate my sacrifice, I will fatally toxify your oasis.",
      },
      timing_modifiers: {
        wood: {
          ko: "모래사막을 뚫고 지독한 덩굴이 기어 나옵니다. 억눌려 있던 기괴한 오컬트적 창의력(식상)이 기어이 현실의 틈새를 장악합니다.",
          en: "Toxic vines furiously breach the desert sand. Severely suppressed, grotesque occult creativity violently seizes control of reality’s glitches.",
        },
        fire: {
          ko: "태양이 빗물을 완전히 말려버려 갈라진 사막만 남습니다. 극우적인 물질적 집착(재성)이 피를 말리며 극도의 신경 쇠약을 초래합니다.",
          en: "The sun perfectly sterilizes the rain, leaving severely cracked dunes. Radical obsession with material wealth drains all blood, invoking horrific anxiety.",
        },
        earth: {
          ko: "무자비한 모래폭풍이 안개비를 모조리 갈기갈기 찢어버립니다. 살인적인 사회적 책임(관성)이 자아를 짓이기자 섬뜩한 자해적 희생이 가동됩니다.",
          en: "A ruthless sandstorm shreds the mist. Murderous societal burdens crush the inner ego, triggering a terrifying, self-harming sacrificial mechanism.",
        },
        metal: {
          ko: "은빛 바위틈으로 깊은 샘물이 터져 나와 사막을 침수시킵니다. 차디찬 광증을 동반한 결벽적 지식(인성)이 세상을 서늘하게 비웃습니다.",
          en: "Deep aquifers violently explode from silver rocks to drown the desert. Cold, manic, OCD-driven intellect sadistically mocks the ignorant world.",
        },
        water: {
          ko: "사막을 완전히 검은 비로 덮어버리는 끔찍한 이상기후가 발생합니다. 주체할 수 없는 우울감과 피아식별이 안 되는 배타성(비겁)이 맹위를 떨칩니다.",
          en: "A calamitous black storm completely floods the wasteland. Uncontrollable depression and indiscriminate hostility rage forward, wiping out friend and foe alike.",
        },
      },
    },
  },
  甲申: {
    id: "gap-shin",
    metadata: {
      kr_name: "갑신(甲申)",
      en_name: "Gap-shin (Wood-Monkey)",
      element: "Wood-Metal",
      animal: "Monkey",
      nature_symbol: {
        ko: "은빛 바위산에 박힌 가시나무",
        en: "Silver Thorns on the Crag",
      },
    },
    core_identity: {
      persona: {
        ko: "피 흘리는 정복자",
        en: "The Bleeding Conqueror",
      },
      goth_punk_vibe: {
        ko: "날카로운 쇠붙이들이 난무하는 강철의 영토 위에 굳센 뿌리를 내리려 피를 철철 흘리며 발악하는 파괴적 생명력입니다.",
        en: "A destructive vitality desperately bleeding to embed its roots into an iron territory where razor-sharp blades dance wildly.",
      },
      shadow_side: {
        ko: "육체가 난도질당할지언정 결코 무릎 꿇지 않으려는 강박적 허세와, 자신을 베는 환경에 대한 끔찍한 원망",
        en: "An obsessive bravado refusing to kneel even as the flesh is mangled, coupled with horrific resentment toward the environment that slashes it.",
      },
    },
    behavior_metrics: {
      drive: 90,
      empathy: 20,
      stability: 30,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "To-saeng-geum"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "도저히 자라날 수 없는 강철의 기저 위에서도 기어코 자신의 영토를 주장합니다. 상처가 많을수록 더욱 거칠고 강해집니다.",
        en: "Stakes its territorial claim on top of a steel foundation where growth is impossible. The more scarred you are, the more vicious and resilient you become.",
      },
      relationship: {
        ko: "방어기제로 인해 상대의 호의조차 검열하며, 자신을 길들이려는 순간 가시를 바짝 세워 상대의 품을 난도질합니다.",
        en: "Defensive mechanisms censor even pure goodwill. The second someone tries to tame you, your thorns violently erect to shred their embrace.",
      },
      timing_modifiers: {
        wood: {
          ko: "부서지던 뿌리가 기괴하게 팽창하며 강철산을 뒤덮어 지배력을 역전시킵니다. 살벌한 생존주의(비겁)가 경쟁자들을 압살합니다.",
          en: "Mangled roots grotesquely inflate to engulf the steel mountain, reversing the dominance. Cutthroat survivalism brutally crushes all rivals."
        },
        fire: {
          ko: "끓어오르는 화염이 옥죄어오는 금속을 녹여버립니다. 억눌렸던 야성과 분노(식상)가 판을 엎고 반역의 깃발을 꽂습니다.",
          en: "Boiling flames melt the constricting metal. Suppressed wildness and raw fury upend the entire board, violently planting the flag of treason."
        },
        earth: {
          ko: "강철 틈새로 한 줌의 부패한 진흙이 스며듭니다. 오직 결과를 쟁취하려는 잔혹한 물욕(재성)이 전신을 지배합니다.",
          en: "A handful of decayed mud seeps into the steel cracks. Ruthless material greed fiercely dominates the entire hyper-vigilant system."
        },
        metal: {
          ko: "수백 개의 은빛 단두대가 떨어져 내리며 영혼을 도륙합니다. 숨 막히는 권력과 강박(관성)에 짓눌려 자아가 서늘하게 해체됩니다.",
          en: "Hundreds of silver guillotines crash down to butcher the soul. Under suffocating systemic power, the ego is coldly and lethally dismantled."
        },
        water: {
          ko: "얼어붙은 철판 위로 차가운 물줄기가 흘러 상처를 봉합합니다. 깊은 음모와 직관력(인성)이 치명적인 도약의 발판을 치밀하게 설계합니다.",
          en: "Cold water flows over frozen steel to violently suture the wounds. Dark schemes and sharp intuition meticulously engineer the next lethal strike."
        }
      }
    }
  },
  乙酉: {
    id: "eul-yu",
    metadata: {
      kr_name: "을유(乙酉)",
      en_name: "Eul-yu (Wood-Rooster)",
      element: "Wood-Metal",
      animal: "Rooster",
      nature_symbol: {
        ko: "서슬 퍼런 달빛 아래 핀 가시꽃",
        en: "The Moonlit Blade",
      },
    },
    core_identity: {
      persona: {
        ko: "단두대에 바쳐진 수선화",
        en: "Narcissus on the Guillotine",
      },
      goth_punk_vibe: {
        ko: "살을 에는 듯한 은장도의 칼날 위에서 위태롭게 피어난 한 송이 독초. 극단의 예민함이 수려하고 치명적인 아름다움으로 변모한 절망의 미학입니다.",
        en: "A single toxic bloom delicately sprouting on the lethally sharp edge of a silver dagger. Extreme hypersensitivity beautifully mutates into a fatal, despairing aesthetic.",
      },
      shadow_side: {
        ko: "자신을 옭아매는 고통조차 아름다움으로 정당화하려는 피학성과, 결벽증에 가까운 날 선 신경질",
        en: "A masochistic urge to justify even suffocating pain as art, paired with an OCD-driven, razor-sharp neuroticism.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 40,
      stability: 15,
      unpredictability: 90,
    },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "Hwa-geuk-geum"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "금방이라도 베일 듯 아슬아슬한 긴장감으로 사람들을 매혹시킵니다. 불안 그 자체가 당신이 그리는 치명적인 마스터피스입니다.",
        en: "Mesmerizes everyone with an agonizing suspense, as if you could be sliced at any second. Pure anxiety is the lethal masterpiece you paint.",
      },
      relationship: {
        ko: "가장 예쁜 꽃잎으로 상대를 유혹하지만, 당신을 소유하려 손을 뻗는 순간 가시에 찔려 치명적인 상처를 입게 만듭니다.",
        en: "Seduces partners with the most exquisite petals. But the exact split-second they reach to claim you, they are fatally pierced by venomous thorns.",
      },
      timing_modifiers: {
        wood: {
          ko: "잘려 나간 단면에서 수백 개의 복제된 가시가 피어오릅니다. 지독한 군집과 집착(비겁)이 단두대의 칼날을 기괴하게 덮어버립니다.",
          en: "Hundreds of cloned thorns violently sprout from the severed stem. Toxic swarming and obsession grotesquely smother the guillotine's blade."
        },
        fire: {
          ko: "달빛을 찢고 타오르는 횃불이 차가운 칼날을 융해시킵니다. 파멸적인 자기표현(식상)이 잔혹한 족쇄를 녹이고 미친 듯이 만개합니다.",
          en: "A blazing torch shreds the moonlight and melts the cold blade. Ruinous self-expression violently liquidates the cruel shackles into full bloom."
        },
        earth: {
          ko: "칼날 밑에서 딱딱하게 굳은 진흙이 떨어져 내립니다. 위태로운 현실 감각과 재물에 대한 환상(재성)이 신경망을 무너뜨립니다.",
          en: "Rigid mud violently crumbles from beneath the blade. Precarious reality checks and illusions of wealth completely crash the neural network."
        },
        metal: {
          ko: "수십 개의 면도날이 꽃잎을 자비 없이 해체합니다. 파시즘적인 규칙과 억압(관성)이 숨 막히는 감옥이 되어 자아를 마비시킵니다.",
          en: "Dozens of razor blades ruthlessly dissect the petals. Fascistic rules and total systemic repression freeze the ego in a suffocating prison."
        },
        water: {
          ko: "칼날 위로 소름 끼치도록 차가운 응결수가 맺힙니다. 극단으로 치달은 우울과 예술적 직관(인성)이 영혼의 깊은 파멸 속으로 침잠합니다.",
          en: "Chilling condensation violently forms on the blade. Maximized depression and morbid artistic intuition furiously dive into the soul's profound ruin."
        }
      }
    }
  },
  丙戌: {
    id: "byeong-sul",
    metadata: {
      kr_name: "병술(丙戌)",
      en_name: "Byeong-sul (Fire-Dog)",
      element: "Fire-Earth",
      animal: "Dog",
      nature_symbol: {
        ko: "꺼지지 않는 노을 아래 잠든 화산의 침묵",
        en: "The Crimson Mausoleum",
      },
    },
    core_identity: {
      persona: {
        ko: "고독한 묘지기",
        en: "The Solitary Gravekeeper",
      },
      goth_punk_vibe: {
        ko: "백호살(白虎)의 피비린내를 숨긴 채, 붉은 노을이 끝없이 타오르는 황량한 사막의 무덤. 그 밑에는 모든 것을 태워버릴 폭발력이 침묵 속에 응축되어 있습니다.",
        en: "A desolate desert grave beneath an eternal red sunset, hiding the blood-scent of the White Tiger star. Beneath it, apocalyptic explosives silently compress.",
      },
      shadow_side: {
        ko: "스스로를 가장 비치광이 처단자라고 여기는 선민의식과, 분노가 촉발되면 피를 보아야만 끝을 맺는 광폭함",
        en: "An elitist complex viewing oneself as the ultimate lunatic executioner, coupled with a frenzy that demands blood once anger is triggered.",
      },
    },
    behavior_metrics: {
      drive: 85,
      empathy: 30,
      stability: 40,
      unpredictability: 80,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Hwa-saeng-to"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "압도적인 카리스마를 뿜어내지만 기묘할 정도로 적막합니다. 고독을 에너지원으로 삼아 언제든 지옥문을 열 준비를 마쳤습니다.",
        en: "Radiates overwhelming charisma while remaining grotesquely silent. Feeding off isolation, you are fully armed to kick open the gates of hell.",
      },
      relationship: {
        ko: "당신의 영역을 철저히 통제하려 하며, 사랑이라는 이름 앞에서도 감히 누군가 통제선을 넘으면 화산재를 쏟아내어 생매장합니다.",
        en: "Totalitarian control over your turf. Even under the guise of love, if someone crosses the line, you bury them alive in scalding volcanic ash.",
      },
      timing_modifiers: {
        wood: {
          ko: "사막 한가운데 붉은 가시덩굴이 군락을 이룹니다. 종교적 광기와 편집증적인 집착(인성)이 영혼의 묘지를 뒤덮어 버립니다.",
          en: "Red thorny vines colonize the wasteland. Religious fanaticism and paranoid obsessions violently consume the graveyard of the soul."
        },
        fire: {
          ko: "태양이 추락하며 사막 전체가 대화재의 지옥으로 변합니다. 제어 불가한 파괴적 나르시시즘(비겁)이 세상의 모든 위선을 불태웁니다.",
          en: "The sun violently plummets, turning the desert into an inferno. Uncontrollable, destructive narcissism scorches every hypocrite in reality."
        },
        earth: {
          ko: "무덤 위에 거대한 묘비가 떨어져 내리며 봉쇄됩니다. 지독한 아집과 독창적인 도그마(식상)가 아무도 범접할 수 없는 세계를 조각합니다.",
          en: "Giant tombstones violently crash down, sealing the graves. Vicious dogma and eccentric stubbornness carve out an untouchable, hostile dimension."
        },
        metal: {
          ko: "화산재 속에서 차갑게 빛나는 은맥이 찢어지듯 노출됩니다. 무자비한 자본과 결과에 대한 탐욕(재성)이 피로 물든 계약을 강제합니다.",
          en: "Cold silver veins morbidly tear through the volcanic ash. Merciless greed for capital violently enforces blood-soaked contracts."
        },
        water: {
          ko: "핏빛 노을 위로 거무튀튀한 폭우가 쏟아집니다. 잔혹한 사회적 억압(관성)이 묘지기의 분노를 깨워 최후의 돌연변이적 저항을 유발합니다.",
          en: "A putrid black rain crashes upon the blood-red sunset. Brutal systemic suppression wakes the gravekeeper's wrath, sparking the final mutated resistance."
        }
      }
    }
  },
  丁亥: {
    id: "jeong-hae",
    metadata: {
      kr_name: "정해(丁亥)",
      en_name: "Jeong-hae (Fire-Pig)",
      element: "Fire-Water",
      animal: "Pig",
      nature_symbol: {
        ko: "심연 속에 잠긴 별빛",
        en: "Star Submerged in the Abyss",
      },
    },
    core_identity: {
      persona: {
        ko: "익사하는 마녀",
        en: "Drowning Witch",
      },
      goth_punk_vibe: {
        ko: "천라지망(天羅地網)의 검은 바다 한가운데로 가라앉으면서도 끝끝내 불씨를 잃지 않는 기형적인 촛불. 영적인 직관과 기묘한 감수성이 한데 엉켜 있습니다.",
        en: "A deformed candle refusing to lose its spark while violently sinking into the black ocean of the Heavenly Net. Spiritual intuition and bizarre sensitivity are hopelessly entangled.",
      },
      shadow_side: {
        ko: "피란처 없이 떠도는 영혼의 불안감과, 스스로를 비극적 존재로 세뇌하며 타인의 기를 빨아먹는 감정적 거머리",
        en: "Soul-crushing anxiety without sanctuary, heavily coupled with brainwashing oneself into a tragic myth while acting as a total emotional leech.",
      },
    },
    behavior_metrics: {
      drive: 30,
      empathy: 95,
      stability: 15,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Su-saeng-mok"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "누구보다 상대의 본심을 섬세하게 투시합니다. 잔인한 현실 속에서도 신비로운 아우라로 주변 사람들을 정신적으로 지배합니다.",
        en: "Radiographically reads intentions with disturbing microscopic detail. Even in a brutal matrix, you mentally dominate subjects via occult aura.",
      },
      relationship: {
        ko: "끝없는 갈증을 해소해줄 구원자를 찾아 심해를 유랑합니다. 하지만 상대가 당신의 바닥을 보는 순간 불안감에 미쳐 신기루처럼 증발해버립니다.",
        en: "Wanders the abyss demanding a savior for infinite thirst. But the microsecond they glimpse your exact rock-bottom, you manic-evaporate like a mirage.",
      },
      timing_modifiers: {
        wood: {
          ko: "물속에서 기괴하게 발광하는 부유식물이 촛불을 건져 올립니다. 주술적인 직관과 사상(인성)이 이성을 삼키고 초월적 세계관을 엽니다.",
          en: "Bioluminescent mutant flora resurrect the candle. Shamanic intuition and insane data perfectly devour logic, unlocking a hyper-transcendent realm."
        },
        fire: {
          ko: "바닷물이 증발하며 수면 위로 불기둥이 치솟습니다. 광신적인 동질감과 집단적 최면(비겁)이 자아를 비장한 전사로 돌변시킵니다.",
          en: "The ocean boils and a fire column breaches the surface. Cultish group-sync and mass hypnosis ruthlessly mutate the ego into a tragic gladiator."
        },
        earth: {
          ko: "검은 바다로 수만 톤의 진흙이 쏟아져 촛불이 질식합니다. 과장된 피해망상과 반항 범죄(식상)가 질서를 무너뜨리는 기폭제가 됩니다.",
          en: "Thousands of tons of toxic mud suffocate the star. Megalomaniac paranoia and rogue rebellion detonate as the absolute catalyst destroying reality."
        },
        metal: {
          ko: "심해에서 거대한 은화폐가 쏟아져 내려와 혼란을 가중합니다. 치명적인 재물에 대한 환각(재성)이 어둠 속으로 영혼을 완전히 침몰시킵니다.",
          en: "Massive silver coins crash through the abyss, worsening the chaos. Lethal hallucinations of cash violently drown the soul into absolute blackout."
        },
        water: {
          ko: "천라지망의 어둠이 극에 달해 블랙홀이 됩니다. 살인적인 시스템적 포위망(관성) 속에서 촛불은 오히려 기괴한 검은 염력을 발현합니다.",
          en: "The Heavenly Net hits peak blackout into a black hole. Surrounded by murderous systemic grids, the candle weirdly channels grotesque telekinesis."
        }
      }
    }
  },
  戊子: {
    id: "mu-ja",
    metadata: {
      kr_name: "무자(戊子)",
      en_name: "Mu-ja (Earth-Rat)",
      element: "Earth-Water",
      animal: "Rat",
      nature_symbol: {
        ko: "암흑 호수를 품은 요새",
        en: "Fortress Embracing a Dark Lake",
      },
    },
    core_identity: {
      persona: {
        ko: "위선의 성주",
        en: "Lord of the Hypocrites",
      },
      goth_punk_vibe: {
        ko: "겉으로는 태산처럼 든든하고 견고한 방벽이지만, 그 밑바닥에는 끝을 알 수 없는 욕망의 늪과 차가운 음모가 가라앉아 있습니다.",
        en: "Displays an impregnable, titan mountain fortress on the outside. But buried below is a bottomless bog of pure obsession and cold, serpentine schemes.",
      },
      shadow_side: {
        ko: "절대 손해 보지 않으려는 철저한 계산기와, 겉보기에만 대의를 외치는 소금기 가득한 이기주의",
        en: "A flawless internal spreadsheet that instantly zeros out any loss, masked by a salty, hypocritical egoism screaming fake righteousness.",
      },
    },
    behavior_metrics: {
      drive: 75,
      empathy: 30,
      stability: 85,
      unpredictability: 35,
    },
    compatibility_tags: {
      ideal_partner: ["Hwa-saeng-to", "To-geuk-su"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "상황을 거시적으로 통제하면서도 뒤로는 보이지 않는 실속을 모두 챙겨갑니다. 조용하게 뇌관을 장악하는 절대 권력자입니다.",
        en: "Macros the entire system while secretly mining every hidden asset. A silent dictator cleanly hijacking the detonator before anyone notices.",
      },
      relationship: {
        ko: "상대에게 기꺼이 그늘을 제공하며 보호자를 자처하지만, 그 대가로 영혼의 소유권 이전을 요구하는 피의 계약서를 내밉니다.",
        en: "Claims the guardian role and easily provides shade. But in return, brutally demands a blood pact legally transferring the deed to their soul.",
      },
      timing_modifiers: {
        wood: {
          ko: "암벽을 갈라 치명적인 가시뿌리들이 방어기능을 폭주합니다. 강권적인 감시망과 처벌(관성) 체제가 성채 안의 모든 이견을 척살합니다.",
          en: "Lethal roots brutally shatter the rock walls. Authoritarian surveillance grids and penal codes sadistically execute all dissenters inside."
        },
        fire: {
          ko: "호수가 펄펄 끓으며 유독 가스를 내뿜습니다. 비대한 나르시시즘과 독선적 이념(인성)이 마침내 폭발하여 세상을 광신으로 얼룩지게 합니다.",
          en: "The lake boils wildly, releasing toxic gas. Hypertrophied narcissism and dogmatic ideology finally detonate, smearing reality in absolute fanaticism."
        },
        earth: {
          ko: "토양의 균열을 막기 위해 시멘트를 미친 듯이 들이붓습니다. 지독한 영토 집착과 은폐(비겁)가 성을 외부와 완전히 고립된 수용소로 만듭니다.",
          en: "Frantically pours raw cement to block fault lines. Desperate turf wars and cover-ups violently morph the fortress into a total quarantine zone."
        },
        metal: {
          ko: "산맥 속에 매장된 은갑옷을 파헤치며 이빨을 드러냅니다. 교활하고 예리한 실리 추구(식상)가 기존의 윤리를 가차 없이 해체해 버립니다.",
          en: "Mines silver armor from the mountain and bares fangs. Sly, razor-sharp pragmatism effortlessly massacres all remnants of ethical code."
        },
        water: {
          ko: "암흑 호수가 범람해 요새의 최하층부터 파괴하며 차오릅니다. 한계를 모르는 물질적 탐욕(재성)이 종국엔 스스로를 물고문하는 지옥을 초래합니다.",
          en: "The dark lake floods, annihilating the fortress from the basement up. Limitless material greed ultimately triggers a self-inflicted waterboarding hell."
        }
      }
    }
  },
  己丑: {
    id: "gi-chuk",
    metadata: {
      kr_name: "기축(己丑)",
      en_name: "Gi-chuk (Earth-Ox)",
      element: "Earth-Earth",
      animal: "Ox",
      nature_symbol: {
        ko: "영구동토층에 봉인된 흑마법",
        en: "Black Magic Sealed in Permafrost",
      },
    },
    core_identity: {
      persona: {
        ko: "얼어붙은 파수꾼",
        en: "The Frozen Sentinel",
      },
      goth_punk_vibe: {
        ko: "한겨울의 혹한 속에 꽁꽁 얼어붙은 흑토. 생명력이라곤 찾아볼 수 없는 척박함 속에서 짐승 같은 거대한 인내심과 음습한 광기가 소리 없이 자라납니다.",
        en: "Black earth deep-frozen in the brutal dead of winter. Within a barren wasteland devoid of life, a beast-like endurance and a murky madness silently breed.",
      },
      shadow_side: {
        ko: "타인의 온기를 빼앗아서라도 생존하려는 기생적 생존욕과, 자신만의 동굴에 갇혀 모든 변화를 저주하는 지독한 아집",
        en: "A parasitic urge to survive by draining the warmth of others, bound with a toxic stubbornness that curses any change from within its frozen cave.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 30,
      stability: 95,
      unpredictability: 20,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Hwa-saeng-to"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "마치 죽은 듯이 침묵하지만, 그 안에서는 영원한 복수나 거대한 야심 같은 무거운 감정들이 수십 년간 썩지도 않고 발효됩니다.",
        en: "Silent as the dead, but deep inside, heavy emotions like eternal vengeance or colossal ambition endlessly ferment without decaying for decades.",
      },
      relationship: {
        ko: "한번 내어준 자리는 절대 되찾을 수 없게 만드는 치명적인 수렁이며, 상대가 지쳐 떠나려 해도 발목에 쇠사슬을 채워 무덤까지 끌고 갑니다.",
        en: "A fatal quagmire where once territory is given, it's never returned. If a partner tries to politely leave, you shackle their ankles and drag them into the tomb.",
      },
      timing_modifiers: {
        wood: {
          ko: "언 땅을 뚫고 썩어가는 고목나무 뿌리들이 분출합니다. 잔혹한 억압과 폐쇄적 규율(관성)이 심리를 지배하며 완전한 독재를 이룹니다.",
          en: "Roots of rotting ancient timber violently rupture the permafrost. Brutal repression and closed-off regimens enact absolute psychological dictatorship."
        },
        fire: {
          ko: "얼어붙은 대지 위로 유황불이 쏟아져 내립니다. 기괴한 영감과 어둠의 지식(인성)이 해동의 고통 속에서 위험하게 눈을 뜹니다.",
          en: "Brimstone rains upon the frozen earth. Grotesque inspiration and occult data dangerously awaken through the excruciating pain of the thaw."
        },
        earth: {
          ko: "죽음의 땅에 끝도 없는 진흙 폭풍이 몰아닥칩니다. 광신적인 아집과 비대한 나르시시즘(비겁)이 자아를 영원한 폐쇄병동에 가둡니다.",
          en: "A never-ending mudstorm hits the dead land. Fanatical obstinacy and bloated narcissism permanently lock the ego in an isolated psychiatric ward."
        },
        metal: {
          ko: "동토가 갈라지며 서늘하게 날이 선 은광석들이 솟아오릅니다. 날카로운 계산과 잔혹한 표현력(식상)이 타인의 폐부를 거침없이 찔러댑니다.",
          en: "The tundra cracks to expose razor-sharp silver ores. Frigid calculations and brutal expressionism ruthlessly stab the lungs of all bystanders."
        },
        water: {
          ko: "독을 품은 검은 늪이 동토 위로 범람합니다. 끝없는 물질적 탐욕과 파괴적인 지배욕(재성)이 시커먼 파도가 되어 모든 것을 집어삼킵니다.",
          en: "A toxic black swamp floods the permafrost. Endless material greed and destructive lust for dominance form a pitch-black tsunami devouring everything."
        }
      }
    }
  },
  庚寅: {
    id: "gyeong-in",
    metadata: {
      kr_name: "경인(庚寅)",
      en_name: "Gyeong-in (Metal-Tiger)",
      element: "Metal-Wood",
      animal: "Tiger",
      nature_symbol: {
        ko: "강철 숲의 거대한 포식자",
        en: "The Iron Jungle Prowler",
      },
    },
    core_identity: {
      persona: {
        ko: "도끼불을 삼킨 야수",
        en: "Beast Coated in Axe-fire",
      },
      goth_punk_vibe: {
        ko: "원시적인 생명력이 넘치는 정글을 차가운 철퇴로 무자비하게 박살 내는 파괴의 화신. 본능적인 맹수와 무자비한 강철의 폭력적 충돌입니다.",
        en: "An avatar of destruction mercilessly smashing a highly vital jungle with a cold iron mace. The violent collision of a primal predator and ruthless steel.",
      },
      shadow_side: {
        ko: "자신이 찢어발긴 생명체들에 대한 한 톨의 죄책감도 없는 사이코패스적 잔혹성과, 정복하지 않으면 죽을 것 같은 포식자의 발작",
        en: "Psychopathic brutality devoid of any guilt for the lives shredded, driven by a predator's seizure that fears death if it stops conquering.",
      },
    },
    behavior_metrics: {
      drive: 95,
      empathy: 10,
      stability: 20,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "To-saeng-geum"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "타인의 영역을 도끼로 찍어 내리고 군림하는 데서 카타르시스를 느킵니다. 거칠고 폭발적인 권력 의지로 주위를 공포로 물들입니다.",
        en: "Finds sheer catharsis in hacking down others' territories with an axe and ruling the ruins. Stains the surroundings in fear with raw, explosive power trips.",
      },
      relationship: {
        ko: "사랑은 곧 사냥입니다. 치열하게 상대를 쫓지만, 일단 목줄을 채우고 전리품이 되면 피가 식어버리는 잔혹한 정복욕입니다.",
        en: "Love equals the hunt. Fiercely chases the partner, but the second the collar clicks and they become a trophy, the blood instantly freezes in cruel conquest.",
      },
      timing_modifiers: {
        wood: {
          ko: "베어낸 자리에 저주받은 핏빛 덩굴이 기괴하게 자라납니다. 광기 어린 소유욕과 치명적인 재물 탐욕(재성)이 전신을 찢을 듯이 들끓습니다.",
          en: "Cursed blood-red vines grotesquely sprout from the slashed stumps. Manic possessiveness and lethal greed for wealth violently boil the flesh."
        },
        fire: {
          ko: "강철 산맥에 화산재와 번개가 쏟아지며 도끼를 녹입니다. 가학적 억압과 숨 막히는 복종 체제(관성)가 반항하는 자아를 서늘하게 짓밟습니다.",
          en: "Volcanic ash and lightning crash into the iron range, melting the axe. Sadistic oppression and a suffocating submission code brutally smash the rebellious ego."
        },
        earth: {
          ko: "정상을 향해 끔찍하게 무거운 돌무덤들이 무너져 내립니다. 기괴한 영적 오만과 도그마(인성)가 이빨을 숨기고 모든 이념을 지배하려 듭니다.",
          en: "Horrificly heavy stone tombs collapse down toward the summit. Bizarre spiritual arrogance and dogma hide their fangs to dominate all ideology."
        },
        metal: {
          ko: "수백 개의 잔혹한 쇠갈고리가 허공에서 떨어져 반대파를 학살합니다. 폭주하는 폭력 조직의 패권(비겁)이 짐승의 피비린내를 증폭시킵니다.",
          en: "Hundreds of cruel iron hooks plummet from the void to slaughter dissidents. The rampant hegemony of a violent syndicate maximizes the beast's blood-scent."
        },
        water: {
          ko: "거대한 도끼가 심해의 해일을 갈라버리며 치명적인 소용돌이를 만듭니다. 천재적이고 파괴적인 반항기(식상)가 세상의 모든 질서를 썰어버립니다.",
          en: "The giant axe splits an abyssal tsunami, triggering a lethal vortex. A genius, destructive rebellion endlessly hacks away at all fragments of world order."
        }
      }
    }
  },
  辛卯: {
    id: "shin-myo",
    metadata: {
      kr_name: "신묘(辛卯)",
      en_name: "Shin-myo (Metal-Rabbit)",
      element: "Metal-Wood",
      animal: "Rabbit",
      nature_symbol: {
        ko: "풀숲에 떨어진 서리 묻은 은검",
        en: "Frost-Covered Silver Blade in the Weeds",
      },
    },
    core_identity: {
      persona: {
        ko: "신경쇠약의 토끼",
        en: "The Neuropathic Rabbit",
      },
      goth_punk_vibe: {
        ko: "부드럽고 여린 풀잎 위를 구르는 예리하고 차가운 은구슬. 상처받기 쉬운 연약함과, 자신을 보호하려 무자비하게 찌르는 가시가 혼재되어 있습니다.",
        en: "A sharp, cold silver bead violently rolling over soft, fragile blades of grass. Vulnerable fragility coexists with thorns that ruthlessly stab to protect itself.",
      },
      shadow_side: {
        ko: "살갗에 닿는 모든 미세한 자극을 고통으로 환원하는 극심한 결벽증과, 타인의 약점을 귀신같이 찾아내 베어버리는 사악함",
        en: "Severe mysophobia that reduces every micro-stimulus on the skin into pure agony, backed by an evil talent for universally sniffing out and slicing others' weak points.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 60,
      stability: 15,
      unpredictability: 80,
    },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "To-saeng-geum"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "티 없이 맑아 보이지만, 조금만 다가가도 이내 싸늘하게 날을 세웁니다. 예민함이 만들어낸 변덕과 이별의 천재입니다.",
        en: "Displays a flawless, innocent shine, but step closer and the blade turns lethally cold. A pure genius of caprice and breakups engineered by hyper-sensitivity.",
      },
      relationship: {
        ko: "절대적인 사랑을 구원처럼 바라다가도, 상대의 단점 하나에 끔찍한 혐오를 느끼고 가차 없이 관계의 숨통을 끊어버립니다.",
        en: "Prays for absolute love as salvation. But at the first scent of a partner's flaw, crippling disgust kicks in to ruthlessly sever the relationship's windpipe.",
      },
      timing_modifiers: {
        wood: {
          ko: "풀벌레의 비명 속에서 시꺼먼 독버섯들이 군락을 이룹니다. 집요한 통제욕과 환각적인 재물욕(재성)이 시야를 좁히고 파국을 앞당깁니다.",
          en: "Amidst screaming insects, black venomous mushrooms form a massive colony. Obsessive control and hallucinatory greed brutally narrow vision leading to catastrophe."
        },
        fire: {
          ko: "차가운 은검이 끔찍한 화염술에 의해 녹아내리며 비명을 지릅니다. 처절한 피해의식과 폭압적인 시스템(관성)에 의해 영혼이 산산조각 납니다.",
          en: "The cold silver blade shrieks violently as it melts down from horrific pyromancy. A desperate victim mentality is shattered by a tyrannical system."
        },
        earth: {
          ko: "푸른 초지가 누렇고 끈적이는 진흙 늪에 완전히 질식당합니다. 지독한 편집증증적 은둔과 기괴한 망상(인성)이 현실과 완벽하게 단절됩니다.",
          en: "The green pasture breathes its last suffocated by a sticky yellow mud bog. Paranoiac reclusion and weird delusions trigger an absolute blackout from reality."
        },
        metal: {
          ko: "수천 개의 은바늘 폭풍이 초원을 무자비하게 도륙합니다. 파괴적인 자의식의 팽창과 연쇄 반항기(비겁)가 거침없이 온 땅을 학살합니다.",
          en: "A localized storm of thousands of silver needles mercilessly butchers the prairie. Destructive ego-inflation and chain-mutiny massacres the whole field."
        },
        water: {
          ko: "달콤한 이슬이 치명적인 독수로 변해 모든 생명을 서서히 마비시킵니다. 우울함에 도취된 기형적 식욕과 반항(식상)이 잔혹한 예술로 승화합니다.",
          en: "Sweet morning dew violently mutates into toxic acid, paralyzing all life. Freakish appetite and mutiny intoxicated by depression sublime into a cruel art."
        }
      }
    }
  },
  壬辰: {
    id: "im-jin",
    metadata: {
      kr_name: "임진(壬辰)",
      en_name: "Im-jin (Water-Dragon)",
      element: "Water-Earth",
      animal: "Dragon",
      nature_symbol: {
        ko: "심연의 흑룡",
        en: "The Abyssal Leviathan",
      },
    },
    core_identity: {
      persona: {
        ko: "태풍을 삼킨 포식자",
        en: "Predator Hiding a Typhoon",
      },
      goth_punk_vibe: {
        ko: "괴강살(魁罡)의 거대한 살기를 품고 깊은 바닷골 아래 똬리를 튼 검은 용. 분노가 해방되면 걷잡을 수 없는 해일로 세상을 쓸어버리는 오만방자한 야성입니다.",
        en: "A dark dragon coiled deep in the oceanic trench, carrying the massive lethality of the Gwaegang star. When fury unleashes, arrogant wildness wipes the world with uncontrollable tsunamis.",
      },
      shadow_side: {
        ko: "아무도 자신을 길들일 수 없다는 오만함과, 한 번 핀트를 벗어나면 피아 식별 없이 주변을 진흙탕의 바다로 만들어버리는 폭주",
        en: "Supreme arrogance assuming nothing can tame it, mixed with a berserk frenzy that reduces surroundings to an ocean of bloody mud without friend/foe identification if triggered.",
      },
    },
    behavior_metrics: {
      drive: 85,
      empathy: 30,
      stability: 40,
      unpredictability: 90,
    },
    compatibility_tags: {
      ideal_partner: ["Su-saeng-mok", "Geum-saeng-su"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "보통의 룰을 비웃으며 압도적인 그릇으로 스케일이 다른 도박을 벌입니다. 극단적인 추진력으로 제국을 세우거나 홀로 수장됩니다.",
        en: "Laughs at normal rules and gambles on a scale that defies standard logic. Armed with extreme propulsion to either build an empire or sink into the abyss alone.",
      },
      relationship: {
        ko: "거대한 질투와 소유욕의 화신입니다. 상대가 자신의 통제를 조금이라도 벗어나면 끔찍한 해일을 일으켜 흔적조차 남기지 않습니다.",
        en: "The sheer avatar of colossal jealousy and possessiveness. If the partner strays a single inch from control, you trigger a horrific tsunami leaving literally zero trace.",
      },
      timing_modifiers: {
        wood: {
          ko: "해일 위로 기괴하게 거대한 이무기가 뻗어 올라옵니다. 파괴적인 표현력과 과시적 반란(식상)이 바다를 뒤엎고 기존 질서를 박살 냅니다.",
          en: "A grotesquely massive serpent erupts through the tsunami. Destructive expressionism and a showy rebellion wildly flip the ocean to smash the old order."
        },
        fire: {
          ko: "흑룡의 입에서 검은 불줄기가 내뿜어지며 바다가 기화합니다. 한계를 잊은 미친듯한 폭주와 광기 어린 재물욕(재성)이 전부를 소각합니다.",
          en: "Black fire streams from the leviathan's jaws, vaporizing the sea. Limitless berserker rage and psychotic lust for capital aggressively incinerate everything."
        },
        earth: {
          ko: "심해 한가운데 거대한 진흙 기둥이 솟구쳐올라 용을 감금합니다. 잔혹한 피의 카르마와 처절한 복수극(관성)이 전 영혼을 통제불능으로 만듭니다.",
          en: "A massive mud monolith skyrockets from the abyss to imprison the dragon. Cruel blood karma and a bleak revenge tragedy push the entire soul out of bounds."
        },
        metal: {
          ko: "수천 톤급의 침몰선들이 해구 바닥으로 곤두박질치며 기괴한 무덤을 형성합니다. 비틀린 영적 자폐와 타락한 신비주의(인성)가 내면을 잠식합니다.",
          en: "Thousands of tons of sunken warships crash into the trench binding a bizarre tomb. Twisted spiritual autism and corrupted mysticism fully devour the interior."
        },
        water: {
          ko: "해구가 갈라지며 바닥이 안 보이는 칠흑의 싱크홀이 세상을 집어삼킵니다. 무법의 제왕을 자처하는 극단성의 팽창(비겁)이 모든 빛을 소거합니다.",
          en: "The trench fractures, triggering a pitch-black sinkhole that devours reality. The radical inflation of a self-proclaimed outlaw king permanently deletes all light."
        }
      }
    }
  },
  癸巳: {
    id: "gye-sa",
    metadata: {
      kr_name: "계사(癸巳)",
      en_name: "Gye-sa (Water-Snake)",
      element: "Water-Fire",
      animal: "Snake",
      nature_symbol: {
        ko: "칠흑의 빗줄기 뒤에 숨은 독사",
        en: "Obsidian Viper in the Dark Rain",
      },
    },
    core_identity: {
      persona: {
        ko: "살아있는 마안(魔眼)",
        en: "The Living Evil-Eye",
      },
      goth_punk_vibe: {
        ko: "장대비가 쏟아지는 어둠 속, 타오르는 독기를 품고 소리 없이 미끄러지는 시커먼 뱀. 치명적인 유혹과 냉혹한 독이 교차하는 마성의 영역입니다.",
        en: "A dark serpent violently slipping soundlessly through torrential black rain, harboring a burning toxin. A demonic realm where fatal seduction cleanly intersects with brutal venom.",
      },
      shadow_side: {
        ko: "자신을 드러내지 않고 타인의 심리적 취약점만 노려 파괴하려는 극단적 계산과, 끊임없이 외부에 책임을 전가하는 비열함",
        en: "Extreme calculations to stay hidden while solely targeting and destroying others' psychological flaws, paired with a cowardly mechanism of eternally shifting blame.",
      },
    },
    behavior_metrics: {
      drive: 60,
      empathy: 70,
      stability: 30,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-geuk-su"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "빛을 혐오하면서도 빛 속의 권력을 지배하려 듭니다. 누구보다 유연하게 자세를 바꾸지만, 그 끝에는 항상 치명적인 독니가 준비되어 있습니다.",
        en: "Hates the light but fiercely tries to hijack the power within it. Shifts stances more fluidly than fluid, yet perfectly primes the lethal fangs at the end of the line.",
      },
      relationship: {
        ko: "은밀한 정신적 텔레파시로 상대의 뼈끝까지 감겨들지만, 상대방이 미쳐버릴 쯤 흔적도 없이 독침만 두고 사라지는 사이코 드라마의 주인공입니다.",
        en: "Coils around your spine via covert mental telepathy. But exactly when the partner goes clinically insane, you vanish leaving only a venom dart in this psycho drama.",
      },
      timing_modifiers: {
        wood: {
          ko: "독사가 기괴하게 팽창한 검은 초목 사이로 잠복합니다. 환각적인 거짓말과 무정부적인 충동(식상)이 잔혹한 심리전을 최대로 끌어올립니다.",
          en: "The viper perfectly ambushes through grotesquely inflated black foliage. Hallucinatory lies and anarchic urges maximize brutal psychological warfare."
        },
        fire: {
          ko: "소낙비가 역류하며 독화살 폭우로 변형됩니다. 사악할 정도로 치밀한 물욕과 가학적인 지배욕(재성)이 온 세상을 마비시킵니다.",
          en: "The rain downpour reverses, mutating into a storm of toxic arrows. Wickedly precise materialism and a sadistic lust for dominance thoroughly paralyze the world."
        },
        earth: {
          ko: "질척이는 독진흙이 뱀의 비늘을 무겁게 옥죄어버립니다. 숨 막히는 카르마적 복수와 벗어날 수 없는 파멸의 시스템(관성)이 사형을 선고합니다.",
          en: "Sloshing toxic mud heavily strangles the snake's scales. Suffocating karmic vengeance and an inescapable system of ruin coldly deal the death sentence."
        },
        metal: {
          ko: "죽음의 비 속에서 은빛 수은이 녹아 스며듭니다. 극도로 비틀린 폐쇄성과 뒤틀린 영원성(인성)이 이성을 삼키고 주술적 감옥을 엽니다.",
          en: "Silver mercury melts and seeps through the rain of death. Extremely warped isolation and twisted eternity devour reason, cracking open an occult jail."
        },
        water: {
          ko: "하늘이 무너지며 끝없는 광란의 밤비가 쏟아집니다. 기형적인 군집과 폭력적인 우울감(비겁)이 자아를 늪 바닥 끝까지 익사시킵니다.",
          en: "The sky collapses to unleash an endless frantic night rain. Freely mutating swarms and violent depression aggressively drown the ego into the mud's core."
        }
      }
    }
  },
  甲午: {
    id: "gap-o",
    metadata: {
      kr_name: "갑오(甲午)",
      en_name: "Gap-o (Wood-Horse)",
      element: "Wood-Fire",
      animal: "Horse",
      nature_symbol: {
        ko: "태양 아래 불타는 초원",
        en: "The Solstice Nomad",
      },
    },
    core_identity: {
      persona: {
        ko: "폭주하는 낭만주의자",
        en: "The Burning Drifter",
      },
      goth_punk_vibe: {
        ko: "자비 없는 작열하는 태양 아래, 스스로를 땔감으로 삼아 타오르며 질주하는 미친 고독. 멈추면 곧 죽음이기에 뼈가 녹아내려도 달립니다.",
        en: "A manic solitude sprinting beneath a merciless, scorching sun, using its own flesh as kindling. It runs until its bones melt out of the sheer terror that stopping means death.",
      },
      shadow_side: {
        ko: "끝없는 화려함을 추구하지만, 그 화려함이 남기고 간 재 속에서 허우적대는 극단적인 공허함",
        en: "Chasing endless flamboyance only to violently drown in the pitch-black void of the ashes it leaves behind.",
      },
    },
    behavior_metrics: {
      drive: 100,
      empathy: 40,
      stability: 10,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Hwa-saeng-to"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "목적지 따위는 없습니다. 심장이 터질 듯한 현재의 쾌락과 속도감만이 이들을 존재하게 만드는 유일한 종교입니다.",
        en: "There is no destination. The heart-bursting thrill of the eternal present and the sheer velocity are the sole religion keeping them alive.",
      },
      relationship: {
        ko: "상대에게 남김없이 스스로를 불태워 쏟아붓지만, 재가 되어버린 후엔 서늘하게 등을 돌리는 연쇄 방화탑입니다.",
        en: "They eagerly burn their own soul to the ground for a lover, only to turn ruthlessly cold and vanish leaving behind a pile of scorched ash.",
      },
      timing_modifiers: {
        wood: {
          ko: "타오르는 불꽃에 끊임없이 죽은 나무가 공급됩니다. 브레이크가 파열된 채 끝 모를 자의식(비겁)이 충돌을 향해 가속합니다.",
          en: "Dead wood is relentlessly fed to the roaring blaze. A runaway ego with shattered brakes accelerates straight into a catastrophic collision."
        },
        fire: {
          ko: "기어코 뼈마디가 타들어 가는 줄도 모르고 미친 듯이 웃으며 달립니다. 극한의 유희와 파괴적 과시욕(식상)이 모든 이성을 소각합니다.",
          en: "Laughs psychotically while galloping, completely oblivious that its very own skeleton is melting down. Extreme hedonism and a destructive show-off urge incinerate all reason."
        },
        earth: {
          ko: "불타는 황야 위로 끝없이 재와 모래가 쏟아집니다. 메마른 물질적 극단성과 집착(재성)이 사막에 거대한 신기루를 건설합니다.",
          en: "Endless ash and sand bury the burning wasteland. Barren materialistic extremes and manic obsession construct a colossal mirage in the desert."
        },
        metal: {
          ko: "시뻐건 불길 속으로 휘어지고 녹아내리는 강철들이 비명을 지릅니다. 처절한 자기 파괴와 강압적인 복종 체제(관성)가 내면을 난도질합니다.",
          en: "Steel rebars shriek as they brilliantly warp and melt into the bloody flames. Desperate self-destruction and forced submission fatally hack into the inner core."
        },
        water: {
          ko: "핏빛 해일이 덮쳐오며 불가마를 급랭시킵니다. 증발하는 비명 속에서 서늘한 체념과 우울한 영적 구원(인성)이 기괴하게 피어오릅니다.",
          en: "A blood-red tsunami crashes, rapidly freezing the kiln. Amidst evaporating screams, cold resignation and melancholic spiritual salvation grotesquely bloom."
        }
      }
    }
  },
  乙未: {
    id: "eul-mi",
    metadata: {
      kr_name: "을미(乙未)",
      en_name: "Eul-mi (Wood-Sheep)",
      element: "Wood-Earth",
      animal: "Sheep",
      nature_symbol: {
        ko: "사막의 가시덤불",
        en: "The Desert Thistle",
      },
    },
    core_identity: {
      persona: {
        ko: "모래 폭풍 속의 스토커",
        en: "Stalker of the Sandstorm",
      },
      goth_punk_vibe: {
        ko: "가장 척박한 열사의 모래 위에서 바닥을 기며 기생하는 독한 생존 본능. 상대의 수분을 빨아먹기 위해 기꺼이 자신을 피투성이로 가시화합니다.",
        en: "A venomous survival instinct crawling over the most barren, scorching deserts. Wilfully mutates into a bloody patch of thorns to parasitize other beings' moisture.",
      },
      shadow_side: {
        ko: "지독한 피해의식으로 무장한 채 타인의 영혼에 가시를 박아 통제하려는 흡혈귀적 집착",
        en: "Armed with extreme victimhood, it's a vampiric obsession that forcefully implants thorns into someone's soul just to emotionally control them.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 60,
      stability: 70,
      unpredictability: 35,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Hwa-saeng-to"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "아무리 짓밟혀도 결코 죽지 않는 백호살의 기운. 유연하게 엎드리는 듯하지만 땅속에선 끝없이 뻗어나가는 섬뜩한 뿌리입니다.",
        en: "The terrifying aura of the White Tiger star that simply refuses to die no matter how trampled. Appears to fluently bow down, yet covertly spreads an alarming root network.",
      },
      relationship: {
        ko: "의존의 탈을 쓰고 있지만 사실상 포식자입니다. 사랑이란 이름의 덩굴로 서서히 옥죄어버려, 빠져나가려 할수록 상대방은 살점만 뜯깁니다.",
        en: "Wears the mask of dependence but operates as the apex predator. Slowly strangles with vines named 'love'; the harder the partner struggles, the more flesh gets torn off.",
      },
      timing_modifiers: {
        wood: {
          ko: "마른 사막에 기형적인 덩굴 숲이 번식합니다. 폐쇄적인 동족 의식과 억눌린 광기(비겁)가 오아시스의 피를 전부 빨아먹습니다.",
          en: "A deformed vine forest ruthlessly propagates over the dry desert. Closed-off tribalism and repressed insanity violently drain every drop of blood from the oasis."
        },
        fire: {
          ko: "사막의 태양이 가시덤불을 산채로 불태웁니다. 타오르는 원한과 병적인 예술성(식상)이 신경의 끝자락을 괴롭게 물고 늘어집니다.",
          en: "The desert sun burns the thicket alive. Blazing grudges and morbid artistry torment the frayed endings of every single nerve."
        },
        earth: {
          ko: "끝 모르는 모래성들이 덤불을 겹겹이 짓누릅니다. 극단적인 편집증적 소유욕과 세속적 탐욕(재성)이 시야를 완벽하게 차단합니다.",
          en: "Countless towering sandcastles crush down on the thicket. Extreme paranoiac possessiveness and profane greed absolutely sever all lines of sight."
        },
        metal: {
          ko: "녹슨 칼날 폭풍이 날아와 덤불의 살점을 무자비하게 베어냅니다. 지독한 형벌적 억압과 강박적 규율(관성)이 심리스릴러적 자학을 부릅니다.",
          en: "A rusted blade-storm rips through the thicket's flesh. Sadistic penal suppression and obsessive regimens trigger a psychological thriller of absolute self-harm."
        },
        water: {
          ko: "타는 목마름 속에서 오염된 검은 웅덩이를 허겁지겁 들이켭니다. 왜곡된 지식 체계와 이단적 구원(인성)이 영혼을 천천히 독살합니다.",
          en: "Frantically gulps down a polluted black puddle out of maddening thirst. Warped epistemology and a cultish salvation slowly but permanently envenom the soul."
        }
      }
    }
  },
  丙申: {
    id: "byeong-shin",
    metadata: {
      kr_name: "병신(丙申)",
      en_name: "Byeong-shin (Fire-Monkey)",
      element: "Fire-Metal",
      animal: "Monkey",
      nature_symbol: {
        ko: "용광로 위에 매달린 외줄",
        en: "Tightrope Above the Blast Furnace",
      },
    },
    core_identity: {
      persona: {
        ko: "추락하는 불꽃의 광대",
        en: "The Falling Fire-Jester",
      },
      goth_punk_vibe: {
        ko: "작열하는 용광로 위에서 웃으면서 칼춤을 추는 아슬아슬한 피에로. 환상적인 재기발랄함 밑에 서늘한 추락의 공포를 감추고 있습니다.",
        en: "A dizzying pierrot dancing a laughing knife-dance over a nuclear blast furnace. Conceals the chilling terror of a fatal plunge beneath a facade of brilliant wit.",
      },
      shadow_side: {
        ko: "모든 것을 웃음거리와 장난으로 소비해버리는 지독한 회피성, 그리고 텅 빈 객석을 마주했을 때 느끼는 병적인 무료함",
        en: "A chronic escapism that consumes everything as a joke, paired with the morbidly depressive boredom triggered when forced to face an empty theater.",
      },
    },
    behavior_metrics: {
      drive: 75,
      empathy: 45,
      stability: 15,
      unpredictability: 95,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "천재적인 기지로 상황을 역전시키며 쇼를 장악하지만, 화려한 스포트라이트 밖에서는 극심한 조울증에 시달립니다.",
        en: "Dominates the show by reversing fatal situations with genius-level wit, only to suffer from terminal manic-depression the second the spotlight clicks off.",
      },
      relationship: {
        ko: "상대방의 마음을 손쉽게 훔친 후 무책임하게 저글링하는 유희. 하지만 사랑이 진지해지면 화상을 입은 듯 도망칩니다.",
        en: "A sick game of effortlessly stealing the partner's heart and passively juggling it. But the instant love becomes real, they flee as if burnt alive.",
      },
      timing_modifiers: {
        wood: {
          ko: "용광로에 썩은 마네킹들이 끝없이 내던져집니다. 뒤틀린 영적 과시와 삐뚤어진 망상(인성)이 무대를 기괴한 컬트로 장식합니다.",
          en: "Endless rotting mannequins are chucked into the furnace. Warped spiritual over-display and crooked delusions decorate the stage into a bizarre cult."
        },
        fire: {
          ko: "수십 개의 화염 거울 사이로 미친 듯이 분열하는 자아가 반사됩니다. 통제되지 않는 과시욕과 패거리 의식(비겁)이 쇼를 망쳐놓습니다.",
          en: "A fractured ego reflects wildly across dozens of blazing mirrors. Uncontrollable grandiosity and rabid gang mentality utterly sabotage the show."
        },
        earth: {
          ko: "거대한 진흙 폭포가 불타는 무대를 삼켜버립니다. 폭발하는 충동성과 끝없는 자극 갈구(식상)가 질서를 엉망진창으로 찢어놓습니다.",
          en: "A colossal mud waterfall engulfs the burning stage. Exploding impulsivity and an endless craving for raw stimulation violently tear all order apart."
        },
        metal: {
          ko: "칼날이 불 속에서 예리하게 번쩍입니다. 얼음장같이 냉혹한 이윤 추구와 재물에 대한 소시오패스적 계산(재성)이 무대를 핏빛 상거래로 바꿉니다.",
          en: "Blades sharply gleam in the fire. An ice-cold, sociopathic calculation for profit turns the stage into a horrifically violent black market."
        },
        water: {
          ko: "검은 폭우가 쏟아지며 스포트라이트를 강제로 박살 냅니다. 숨 막히는 권력의 검열과 짓눌린 우울(관성)이 광대에게 치명적인 자살 충동을 속삭입니다.",
          en: "A black downpour violently smashes the spotlight. Suffocating power censorship and crushed depression whisper lethal suicidal urges into the jester's ear."
        }
      }
    }
  },
  丁酉: {
    id: "jeong-yu",
    metadata: {
      kr_name: "정유(丁酉)",
      en_name: "Jeong-yu (Fire-Rooster)",
      element: "Fire-Metal",
      animal: "Rooster",
      nature_symbol: {
        ko: "어둠 속의 빛나는 메스",
        en: "Glowing Scalpel in the Dark",
      },
    },
    core_identity: {
      persona: {
        ko: "초정밀 해부학자",
        en: "The Ultra-Precision Anatomist",
      },
      goth_punk_vibe: {
        ko: "시야를 차단한 심야의 수술실에서 오직 촛불에 의지해 뇌를 해부하는 서늘한 섬세함. 작은 불꽃 안에 극도의 날카로운 집중력을 모아둡니다.",
        en: "Chilling precision actively dissecting a brain by candlelight in a pitch-black operating room. Compresses an extreme, razor-sharp focus down to a single tiny flame.",
      },
      shadow_side: {
        ko: "빛을 잃는 순간 모든 것이 끝난다는 신경증적 강박과, 상대를 철저히 해체해 약점을 도려내는 잔인한 완벽주의",
        en: "A neurotic paranoia that the moment the light flickers out, everything dies, combined with a brutal perfectionism that surgically extracts the partner's weaknesses.",
      },
    },
    behavior_metrics: {
      drive: 40,
      empathy: 30,
      stability: 50,
      unpredictability: 70,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "모든 디테일이 통제 아래 있어야 숨을 쉽니다. 감정조차도 밀리미터 단위로 재단하여 필요 없는 부분은 가차 없이 버립니다.",
        en: "Must have every single detail under perfect control just to breathe. Even emotions are strictly calibrated by the millimeter, and discarded ruthlessly if useless.",
      },
      relationship: {
        ko: "스캔하듯 상대의 영혼을 꿰뚫어 보고 완벽한 부품으로 개조하려 듭니다. 조금의 흠집이라도 발견되면 메스를 들어 연인을 가위질합니다.",
        en: "Scans straight through the lover's soul attempting to mod them into a flawless component. At the first sight of a micro-scratch, out comes the scalpel.",
      },
      timing_modifiers: {
        wood: {
          ko: "촛불의 심지가 독성 환각초로 변해 타들어갑니다. 기괴한 영감과 변태적인 집착(인성)이 이성을 삼키고 은밀한 종교가 됩니다.",
          en: "The candle wick horribly mutates into a toxic hallucinogen. Grotesque inspiration and perverted fixation devour reasoning, birthing a covert religion."
        },
        fire: {
          ko: "좁았던 촛불이 끔찍한 자의식의 화염병으로 폭발합니다. 신경질적인 자기애와 질투(비겁)가 도려낸 파편들을 잿더미로 만들어버립니다.",
          en: "The narrow flame explodes into an insufferable Molotov of ego. Neurotic narcissism and jealousy violently reduce the surgically extracted chunks to ash."
        },
        earth: {
          ko: "정교한 수술대에 오물이 쏟아지며 질서가 붕괴됩니다. 통제력 상실에 대한 공포가 파괴적인 방종(식상)의 비명으로 터져 나옵니다.",
          en: "Raw filth floods the surgical table, causing total order collapse. The sheer terror of losing control violently erupts into a scream of destructive self-indulgence."
        },
        metal: {
          ko: "수천 개의 은빛 메스가 동시에 번쩍입니다. 피도 눈물도 없는 물질적 소유욕(재성)이 세상 모든 것을 바코드 찍힌 고깃덩이로 계산합니다.",
          en: "Thousands of silver scalpels strobe simultaneously. A bloodless, tearless lust for material possession strictly calculates the entire world as barcoded meat chunks."
        },
        water: {
          ko: "검은 먹물이 불꽃을 향해 조여오는 숨 막히는 서스펜스입니다. 참혹한 억압과 처절한 복수(관성)가 초정밀 영혼의 목을 차갑게 조릅니다.",
          en: "Black ink suffocatingly tightening around the flickering flame. Brutal repression and a bleak tragedy coldly strangle the windpipe of the hyper-precise soul."
        }
      }
    }
  },
  戊戌: {
    id: "mu-sul",
    metadata: {
      kr_name: "무술(戊戌)",
      en_name: "Mu-sul (Earth-Dog)",
      element: "Earth-Earth",
      animal: "Dog",
      nature_symbol: {
        ko: "적막한 황야의 요새",
        en: "The Iron Citadel in the Void",
      },
    },
    core_identity: {
      persona: {
        ko: "침묵하는 절대 군주",
        en: "The Silent Warlord",
      },
      goth_punk_vibe: {
        ko: "태양도 별도 뜨지 않는 무한한 황야 한가운데 홀로 버려진 거대한 강철 요새. 누구도 들이지 않고 그 누구에게도 무릎 꿇지 않는 백호·괴강의 끔찍한 중압감입니다.",
        en: "A colossal iron citadel abandoned in the dead center of an infinite wasteland devoid of sun and stars. A horrific heavy gravity of the Gwaegang that kneels to absolutely no one.",
      },
      shadow_side: {
        ko: "스스로를 단절시킨 채 철저히 혼자라는 고립감 속에서, 타인과의 타협 대신 전부를 부수고 군림하려는 타협 없는 독단",
        en: "Bound in total isolation of its own making, opting to ruthlessly crush and dominate all things rather than compromise out of sheer, unyielding dogma.",
      },
    },
    behavior_metrics: {
      drive: 75,
      empathy: 10,
      stability: 95,
      unpredictability: 30,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Hwa-saeng-to"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "자신만의 철의 규율을 강제하며 세상과 단절합니다. 포용하기보다는 철벽을 세워 반대파를 서서히 말라 죽게 만듭니다.",
        en: "Disconnects from reality to forcibly mandate its own iron law. Chooses to erect a brutal wall and slowly starve out its enemies rather than embrace them.",
      },
      relationship: {
        ko: "아무도 침범할 수 없는 요새 안에 가차 없이 상대를 감금합니다. 사랑의 이름으로 절대적인 복종과 맹세를 요구하는 교도소장입니다.",
        en: "Ruthlessly confines the partner inside a fortress that no one can breach. Operates as a prison warden demanding absolute vows and submission under the guise of love.",
      },
      timing_modifiers: {
        wood: {
          ko: "단단한 요새에 거대한 가시덩굴이 침투해 성벽을 부수려 합니다. 극한의 살기와 투쟁 본능(관성)이 전면전을 일으켜 세상을 불바다로 만듭니다.",
          en: "Massive thorn vines infiltrate the fortress intending to crush the walls. Extreme bloodlust and violent instinct launch a total war, turning reality to a sea of fire."
        },
        fire: {
          ko: "요새 지하의 마그마가 끓어오르며 성벽을 달궈버립니다. 광신적인 아집과 비정상적인 종교성(인성)이 철의 제국을 광기로 물들입니다.",
          en: "Magma boils beneath the fortress, superheating the walls. Fanatic dogma and an abnormal religious complex infect the iron empire with total madness."
        },
        earth: {
          ko: "끝 모르는 지진이 일어나며 또 다른 강철 산맥들이 융기합니다. 도가 지나친 나르시시즘과 이기주의(비겁)가 오만한 성벽을 우주 끝까지 쌓아올립니다.",
          en: "Endless earthquakes cause new iron mountain ranges to erupt. Overboard narcissism and severe selfishness arrogantly stack the walls to the edge of the cosmos."
        },
        metal: {
          ko: "요새의 포문들이 일제히 열리며 대량 학살 병기들이 방렬됩니다. 잔혹한 비판력과 타인을 박살 내는 칼날 언어(식상)가 피보라를 부릅니다.",
          en: "The fortress artillery opens simultaneously, deploying mass slaughter weapons. Cruel destructive critique and blade-like semantics summon a storm of blood."
        },
        water: {
          ko: "죽음의 메마른 황야에 썩은 검은 늪이 형성됩니다. 소유욕에 대한 타락한 집착과 물질적 강박(재성)이 요새 전체를 탐욕의 감옥으로 오염시킵니다.",
          en: "A rotting black swamp forms around the dead wasteland. Corrupted obsession for possession and materialistic compulsion pollute the fortress into a prison of greed."
        }
      }
    }
  },
  己亥: {
    id: "gi-hae",
    metadata: {
      kr_name: "기해(己亥)",
      en_name: "Gi-hae (Earth-Pig)",
      element: "Earth-Water",
      animal: "Pig",
      nature_symbol: {
        ko: "은밀한 늪지대의 궤적",
        en: "The Covert Swamp Trajectory",
      },
    },
    core_identity: {
      persona: {
        ko: "포식하는 진흙",
        en: "The Devouring Mud",
      },
      goth_punk_vibe: {
        ko: "조용히 만물을 분해하는 무저갱의 진흙 늪. 표면은 부드럽고 차분해 보이지만, 깊은 곳에서는 무엇이든 삼켜버리는 끝 모를 허기가 소용돌이칩니다.",
        en: "A bottomless mud swamp quietly dissolving all matter. The surface looks perfectly serene, but beneath, an endless hunger violently spirals to swallow literally anything.",
      },
      shadow_side: {
        ko: "겉으로는 순응하는 척하면서도 실상은 모든 이익을 쥐도 새도 모르게 빨아들이는 음침한 탐욕과 감정적 우울",
        en: "Fakes complete compliance on the outside while stealthily siphoning all profit into the darkness, masked by a gloomy, emotional depression.",
      },
    },
    behavior_metrics: {
      drive: 45,
      empathy: 75,
      stability: 40,
      unpredictability: 80,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Hwa-saeng-to"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "자신의 진짜 발톱을 절대 드러내지 않습니다. 우유부단하게 흐르는 듯하지만 결국 가장 많은 전리품을 챙기는 은밀한 사냥꾼입니다.",
        en: "Absolutely refuses to ever reveal its true claws. Drifts along seemingly indecisive, yet constantly turns out to be the covert hunter pocketing the most loot.",
      },
      relationship: {
        ko: "포근함으로 위장해 상대의 방어벽을 허물고는 마음의 밑바닥까지 흡수해버립니다. 집착을 사랑으로 속이며 늪 바닥으로 끌어당깁니다.",
        en: "Camouflages in warmth to dissolve the partner's defenses, drinking them down to the absolute bottom of their soul. Fakes love to drag them into the swamp.",
      },
      timing_modifiers: {
        wood: {
          ko: "진흙 속에 뿌리내린 거대한 독버섯들이 터지며 번식합니다. 교묘한 통제욕과 심리적 지배(관성)가 연막을 치며 상대를 마비시킵니다.",
          en: "Massive toxic mushrooms rooted in the mud explosively propagate. Cunning need for control and psychological dominion violently gaslight and paralyze the target."
        },
        fire: {
          ko: "늪의 가스들이 불이 붙어 스산한 도깨비불로 일렁입니다. 신경증적인 피해의식과 이단적인 신비주의(인성)가 영혼을 기괴하게 갉아먹습니다.",
          en: "Swamp gas catches fire, flickering as macabre will-o'-the-wisps. Neurotic victim mentality and heretical mysticism bizarrely chew away the soul."
        },
        earth: {
          ko: "거대한 진흙 사태가 일어나 주변의 모든 질서를 뭉개버립니다. 이기적인 고집과 파괴적 자아(비겁)가 오직 자신만을 위해 생태계를 파괴합니다.",
          en: "A colossal mudslide completely mangles the surrounding order. Selfish stubbornness and a destructive ego ruthlessly demolish the ecosystem simply for itself."
        },
        metal: {
          ko: "진흙 속에 파묻힌 날카로운 철 구조물들이 솟아오릅니다. 냉혹한 계산과 비정한 손절(식상)이 자비의 가면에 가려진 잔인함을 노출합니다.",
          en: "Sharp iron debris buried in the mud lethally erupts. Brutal calculations and heartless betrayals expose the intense cruelty hidden behind the mask of mercy."
        },
        water: {
          ko: "끝 모르는 흑비가 내려 늪을 홍수로 만듭니다. 통제할 수 없는 물질적 탐욕과 파괴적인 정욕(재성)이 온 세상을 칠흑의 바다로 익사시킵니다.",
          en: "An endless black rain transforms the swamp into a raging flood. Uncontrollable material greed and destructive lust actively drown the entire world in a pitch-black sea."
        }
      }
    }
  },
  庚子: {
    id: "gyeong-ja",
    metadata: {
      kr_name: "경자(庚子)",
      en_name: "Gyeong-ja (Metal-Rat)",
      element: "Metal-Water",
      animal: "Rat",
      nature_symbol: {
        ko: "얼음 호수 밑의 은장도",
        en: "Silver Dagger Beneath an Icy Lake",
      },
    },
    core_identity: {
      persona: {
        ko: "심해의 기계 심장",
        en: "The Abyssal Machine Heart",
      },
      goth_punk_vibe: {
        ko: "영하의 심해에 가라앉은 채 절대 부식되지 않는 백색 강철. 겉으로는 조용하고 이성적이지만, 그 차가운 피부에 데이면 뼈까지 얼어붙습니다.",
        en: "White steel plunged in a sub-zero abyss, absolutely immune to corrosion. Outwardly quiet and rational, but a single touch of its cold logic will instant-freeze your bones.",
      },
      shadow_side: {
        ko: "타인의 온도에 절대 타협하지 않는 섬뜩한 결벽주의와, 감정이입을 철저히 거세한 사이코패스적 차가움",
        en: "A terrifying mysophobia that totally blocks any compromise with others' warmth, along with a borderline psychopathic coldness completely castrated of empathy.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 15,
      stability: 40,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Hwa-saeng-to"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "자신만의 철칙을 계산기처럼 빠르게 구동하며 세상을 난도질합니다. 이들의 이성은 곧 상대를 난도질하는 무자비한 도끼입니다.",
        en: "Runs personal iron codes faster than a supercomputer to chop reality to bits. Its rationality is an active, ruthless axe hacking apart the opposition.",
      },
      relationship: {
        ko: "온도계로 측정하듯 사랑을 실험합니다. 선을 넘는 순간 사랑은 즉각 중단되며, 기계 전원을 끄듯 단 한 톨의 감정도 남기지 않습니다.",
        en: "Experiments on love by strictly reading the thermometer digits. Cross the line, and love is instantly terminated; pulling the plug with absolute zero emotion.",
      },
      timing_modifiers: {
        wood: {
          ko: "얼어붙은 호수 위로 독성 덩굴들이 바다를 뒤덮습니다. 물질에 대한 도착증적 강박과 탐욕(재성)이 시야를 좁히고 극도의 파멸을 부릅니다.",
          en: "Toxic vines overrun the frozen lake. Paraphilic compulsion for materialism and blind greed narrows vision to a microscopic point, summoning extreme ruin."
        },
        fire: {
          ko: "강철 호수 위로 푸른 번개가 떨어지며 빙하를 깨부숩니다. 극심한 신경쇠약과 강압적인 복종 강요(관성)가 자아를 산산조각 냅니다.",
          en: "Blue lightning violently smashes the iron lake's glacier. Severe nervous breakdown and the brutal forcing of submission mercilessly shatter the ego."
        },
        earth: {
          ko: "얼음 속에 갇힌 거대한 화석이 기괴하게 떠오릅니다. 폐쇄적인 우월주의와 오만한 영적 집착(인성)이 타인과의 모든 교류를 저주합니다.",
          en: "A colossal fossil locked in ice gruesomely floats up. Closed superiorism and arrogant spiritual obsession place a curse on any possible human interaction."
        },
        metal: {
          ko: "수천 개의 은빛 톱니바퀴가 폭주하며 바다를 소용돌이치게 만듭니다. 파괴적인 독재 성향과 자아 팽창(비겁)이 모든 질서를 으깨버립니다.",
          en: "Thousands of silver cogwheels rampage, turning the ocean into a vortex. Destructive dictatorial traits and lethal ego-inflation crush all remaining order."
        },
        water: {
          ko: "독성 심해의 폭풍이 한계를 모르고 범람합니다. 천재적이지만 저주받은 광기(식상)가 질서를 조롱하며 잔혹한 예술 쇼를 벌입니다.",
          en: "A toxic abyssal storm floods limitlessly. Genius, yet completely cursed madness actively mocks reality by putting on a terribly cruel art show."
        }
      }
    }
  },
  辛丑: {
    id: "shin-chuk",
    metadata: {
      kr_name: "신축(辛丑)",
      en_name: "Shin-chuk (Metal-Ox)",
      element: "Metal-Earth",
      animal: "Ox",
      nature_symbol: {
        ko: "얼어붙은 땅 위의 은침",
        en: "The Glacial Needle",
      },
    },
    core_identity: {
      persona: {
        ko: "동토의 처형자",
        en: "Executioner of the Tundra",
      },
      goth_punk_vibe: {
        ko: "생명력이 증발한 피가 묻은 언 땅(축토) 위, 홀로 빛나는 예리한 수술용 메스(신금). 아무도 다가오지 못하게 스스로를 치명적인 바늘로 무장한 지독한 고독입니다.",
        en: "A hyper-sharp surgical scalpel shining alone over a frozen, blood-stained tundra where all life has evaporated. A toxic solitude arming itself with lethal needles to keep reality out.",
      },
      shadow_side: {
        ko: "상대방의 핏속에 도는 미세한 결함마저 찾아내어 찌르는 과도한 결벽증과, 자신을 찌르면서 쾌감을 느끼는 병적인 자학",
        en: "An excessive mysophobia that scans and stabs the absolute tiniest defect in a partner's bloodstream, mashed with a sick, morbid thrill found in cutting itself.",
      },
    },
    behavior_metrics: {
      drive: 55,
      empathy: 20,
      stability: 80,
      unpredictability: 35,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Hwa-saeng-to"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "서늘한 인내심으로 완벽을 기하지만, 그 완벽의 기준이 너무나 날카로워 늘 곁에 있는 사람의 살갗을 베어냅니다.",
        en: "Constructs perfection via chilling perseverance, but its standard is so hyper-sharp that it perpetually slices the skin off anyone standing closely by.",
      },
      relationship: {
        ko: "사랑은 곧 정밀한 소유입니다. 아주 작은 이물질(배신)도 허용하지 않으며, 감지하는 순간 관계 전체를 가차 없이 적출 수술해버립니다.",
        en: "Love equals hyper-precision ownership. Grants zero tolerance for 'foreign matter' (betrayal); the microsecond it's detected, the entire relationship gets surgically extracted.",
      },
      timing_modifiers: {
        wood: {
          ko: "얼음골 위로 기형적인 가시나무들이 폭발적으로 자랍니다. 극도의 통제욕구와 파괴적인 금전 집착(재성)이 끝내 자아를 분열시킵니다.",
          en: "Freakish thorn-trees explosively sprout over the ice valley. Extreme dominion desire and destructive money fixation ultimately schism the core ego."
        },
        fire: {
          ko: "보석을 녹여버릴 듯한 참혹한 유황불이 쏟아집니다. 숨 막히는 시스템의 감금과 잔혹한 억압(관성)을 겪으며 처절하게 비명을 지릅니다.",
          en: "Horrific brimstone rains down, threatening to melt the needle. Desperately shrieks while undergoing the suffocating imprisonment and brutal oppression of the system."
        },
        earth: {
          ko: "거대한 진흙 무덤이 은침을 끝없이 질식시킵니다. 왜곡된 은둔과 병적인 나르시시즘(인성)이 이성을 파먹고 영원히 빛을 잃게 만듭니다.",
          en: "A massive mud tomb endlessly suffocates the silver needle. Warped reclusion and morbid narcissism violently eat away at all logic until the light vanishes forever."
        },
        metal: {
          ko: "수십 개의 면도날이 동토 위를 서늘하게 도륙합니다. 타인과의 타협이 거세된 끔찍한 아집(비겁)이 모든 관계를 피바다로 끝맺습니다.",
          en: "Dozens of razor-blades coldly slaughter the tundra. A horrific obstinacy entirely castrated of compromise terminates all relationships into a bloodbath."
        },
        water: {
          ko: "부식성 강한 검은 산성비가 메스를 검게 물들입니다. 신경증적인 창조성과 잔혹한 자기 파괴(식상)가 가장 비참하고 매혹적인 쇼를 완성합니다.",
          en: "Highly corrosive black acid rain permanently stains the scalpel. Neurotic creativity and cruel self-harm complete the most miserable and mesmerizing show possible."
        }
      }
    }
  },
  壬寅: {
    id: "im-in",
    metadata: {
      kr_name: "임인(壬寅)",
      en_name: "Im-in (Water-Tiger)",
      element: "Water-Wood",
      animal: "Tiger",
      nature_symbol: {
        ko: "폭우 속의 검은 숲",
        en: "The Obsidian Rainfall",
      },
    },
    core_identity: {
      persona: {
        ko: "우울의 창조자",
        en: "Architect of Melancholy",
      },
      goth_punk_vibe: {
        ko: "끝없는 비가 쏟아지는 자정의 원시림. 광폭하게 흐르는 흑수(黑水)가 호랑이의 발톱과 만나 기괴하고도 깊은 창조적 영감의 늪을 만듭니다.",
        en: "A midnight primordial forest under an endless torrential downpour. Raging black waters violently mix with tiger claws to birth a bizarre, deep swamp of creative inspiration.",
      },
      shadow_side: {
        ko: "영감과 광기의 경계를 구별하지 못하고 자신만의 망상적 예술 세계에 타인을 익사하게 만드는 이기적인 우울",
        en: "Failing to distinguish between sheer madness and inspiration, it creates a selfish depression that actively forces others to drown within its delusional art-world.",
      },
    },
    behavior_metrics: {
      drive: 75,
      empathy: 60,
      stability: 30,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["To-geuk-su", "Mok-saeng-hwa"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "현실의 규율 따위는 빗물에 씻겨버립니다. 압도적인 상상력 펀치로 세상을 때리지만, 그 내면에는 늘 채워지지 않는 허기가 울부짖습니다.",
        en: "Washes away the pathetic rules of reality with rainwater. Smashes the world with overwhelming punches of imagination, but a howling hunger remains eternally unfulfilled within.",
      },
      relationship: {
        ko: "쏟아지는 빗물처럼 상대를 적시며 스며들지만, 한순간 무시무시한 포식자로 돌변해 상대방의 일상을 홍수로 휩쓸어버립니다.",
        en: "Soaks into the partner exactly like the pouring rain, but violently shifts into a terrifying apex predator an instant later, sweeping their daily life into a flood.",
      },
      timing_modifiers: {
        wood: {
          ko: "밀림이 썩어가는 검은 숲으로 빠르게 변이합니다. 브레이크 없는 병적인 광기와 낭비(식상)가 파멸을 축제로 승화시킵니다.",
          en: "The jungle rapidly mutates into a rotting black woods. A morbid madness completely lacking brakes glorifies terminal ruin into a grand festival."
        },
        fire: {
          ko: "검은 비에 끔찍한 푸른 화염이 옮겨붙습니다. 브레이크 잃은 물질적 쾌락주의와 투기(재성)가 이성을 불태우며 질주합니다.",
          en: "Horrific blue flames ignite atop the black rain. A brakeless hedonism based purely on material thrill aggressively tortures reason as it sprints toward the cliff."
        },
        earth: {
          ko: "끝없는 진흙 사태가 밀림을 완전히 매몰시킵니다. 억눌린 콤플렉스와 강박적 시스템의 통제(관성)가 호랑이의 목줄을 차갑게 죕니다.",
          en: "An unending mud avalanche permanently buries the jungle. Crushed complexes and compulsive system regulations coldly choke the tiger's collar."
        },
        metal: {
          ko: "하늘에서 날카로운 은빛 창들이 억수같이 쏟아집니다. 극단적으로 치우친 이단적 망상과 도착적 은둔(인성)이 영혼을 마비시킵니다.",
          en: "Sharp silver spears violently plummet down from the heavens. Radically skewed heretical delusions and paraphilic reclusion fundamentally paralyze the spirit."
        },
        water: {
          ko: "하늘이 찢어지며 바다가 역류하는 대홍수가 펼쳐집니다. 극한의 자의식 과잉과 타락한 패권주의(비겁)가 오직 죽음과 파괴를 남깁니다.",
          en: "The sky shreds apart to reveal a cataclysmic flood of reversing oceans. Extreme ego over-saturation and corrupted hegemony leave behind nothing but pure destruction."
        }
      }
    }
  },
  癸卯: {
    id: "gye-myo",
    metadata: {
      kr_name: "계묘(癸卯)",
      en_name: "Gye-myo (Water-Rabbit)",
      element: "Water-Wood",
      animal: "Rabbit",
      nature_symbol: {
        ko: "무너진 거울 위의 새벽비",
        en: "Dawn Rain on a Shattered Mirror",
      },
    },
    core_identity: {
      persona: {
        ko: "파편화된 사이코키네시스",
        en: "Fragmented Psychokinesis",
      },
      goth_punk_vibe: {
        ko: "서늘한 새벽 안개 속, 여린 풀잎 위로 내리는 가장 조용하고도 치명적인 구슬비. 너무 예리해서 베인 줄도 모르게 영혼에 스며드는 극단의 섬세함입니다.",
        en: "The quietest, most lethal drizzle falling over fragile grass blades in a freezing dawn fog. An extreme delicacy so razor-sharp that your soul is sliced open before you even bleed.",
      },
      shadow_side: {
        ko: "타인의 가벼운 한숨에도 소스라치게 놀라 심리적 방어벽을 세우고, 이내 저주의 비를 뿌려 상대를 말라 죽게 만드는 과민성 조현증",
        en: "Flinches violently at a partner's mere sigh, erecting absolute psychological barricades before showering down a rain of curses to emotionally starve them to death.",
      },
    },
    behavior_metrics: {
      drive: 40,
      empathy: 95,
      stability: 15,
      unpredictability: 70,
    },
    compatibility_tags: {
      ideal_partner: ["To-geuk-su", "Geum-saeng-su"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "이슬처럼 투명하지만, 언제든 상대를 질식시키는 거대한 독안개로 변모할 수 있는 사이코 패스적 여리여리함을 지녔습니다.",
        en: "Looks flawlessly transparent like pure dew, yet harbors a psychopathic fragility capable of instantly shifting into a massive toxic fog that suffocates all bystanders.",
      },
      relationship: {
        ko: "상대방의 마음의 틈새를 귀신처럼 스며듭니다. 그러나 사랑에 결함이 보이면, 즉시 차가운 얼음 조각이 되어 연인의 심장을 직접 겨냥합니다.",
        en: "Permeates exact micro-cracks in the partner's heart like a ghost. But the millisecond love shows a flaw, it crystallizes into a sharp ice-shard directly aimed at their heart.",
      },
      timing_modifiers: {
        wood: {
          ko: "검은 이끼와 독버섯들이 촉수처럼 폭발적으로 자라납니다. 광기 어린 창조망상과 기괴한 예술성(식상)이 자아를 삼키며 컬트를 양산합니다.",
          en: "Black moss and toxic mushrooms explosively mutate like tentacles. Mania-driven creative delusions and bizarre artistry literally devour the ego to birth a cult."
        },
        fire: {
          ko: "이슬이 불화살로 변하여 숲을 피로 물들입니다. 집요한 금전적 집착과 도덕성이 상실된 지배욕(재성)이 시야를 살기로 붉게 채웁니다.",
          en: "Dewdrops instantly violently freeze into flaming arrows staining the forest in blood. Persistent financial obsession and an amoral lust for control flood the vision with murder."
        },
        earth: {
          ko: "탁하고 끈적한 진흙 늪이 여린 토끼의 다리를 서서히 묻어버립니다. 압살당하는 피해의식과 병적인 복종 체계(관성)에 파묻혀 서서히 익사합니다.",
          en: "A murky, sticky mud swamp slowly buries the fragile rabbit's legs. Slowly drowns alive while being crushed by pure victimhood and a sick submission network."
        },
        metal: {
          ko: "비가 은빛 바늘 눈보라로 변해 천지를 도륙합니다. 숨이 막힐 듯한 결벽성 은둔과 왜곡된 타장배척(인성)이 이성을 소각로에 처넣습니다.",
          en: "The rain coldly shifts into a blizzard of silver needles slaughtering the world. Suffocating mysophobic reclusion and warped xenophobia shove all reason into the incinerator."
        },
        water: {
          ko: "새벽비가 끝없는 태풍이 되어 자아를 산산조각 난 거울로 만듭니다. 참혹한 우울증과 삐뚤어진 파괴 충동(비겁)이 자발적 파멸의 춤을 춥니다.",
          en: "Dawn drizzle escalates into an endless typhoon turning the ego into a shattered mirror. Horrific depression and a crooked destruction urge dance a waltz of willing ruin."
        }
      }
    }
  },
  甲辰: {
    id: "gap-jin",
    metadata: {
      kr_name: "갑진(甲辰)",
      en_name: "Gap-jin (Wood-Dragon)",
      element: "Wood-Earth",
      animal: "Dragon",
      nature_symbol: {
        ko: "청룡의 뇌우",
        en: "The Thunderous Root",
      },
    },
    core_identity: {
      persona: {
        ko: "폭풍을 부르는 고목",
        en: "The Storm Caller",
      },
      goth_punk_vibe: {
        ko: "물기를 가득 머금은 습한 대지를 무자비하게 찢고 솟구쳐 오르는 거대한 나무. 번개를 두른 청룡처럼 하늘을 향해 폭주하는 야수적인 힘입니다.",
        en: "A colossal tree mercilessly tearing through hyper-humid soil to erupt upward. A beastly energy rampaging toward the sky like an azure dragon wreathed in lightning.",
      },
      shadow_side: {
        ko: "원하는 바를 이룰 때까지 주변의 모든 영양분을 게걸스럽게 빨아들이는 괴물 같은 탐욕과 오만",
        en: "A monstrous greed and arrogance that voraciously siphons every drop of nutrients from the surroundings until its desires are violently met.",
      },
    },
    behavior_metrics: {
      drive: 90,
      empathy: 30,
      stability: 60,
      unpredictability: 70,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Su-saeng-mok"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "목표가 정해지면 장애물 따위는 짓밟고 일어납니다. 부서지는 한이 있어도 절대 타협하거나 멈추지 않는 지독한 추진력입니다.",
        en: "Once a target is locked, obstacles are simply trampled over. A toxic propulsion that absolutely refuses to compromise or stop, even if it means shattering itself.",
      },
      relationship: {
        ko: "상대방을 자신의 거대한 뿌리로 완전히 옭아매어 숨쉬기조차 힘들게 하는 끔찍한 소유욕과 독재성애자의 면모를 지닙니다.",
        en: "Completely binds the partner within its massive roots, making it impossible to even breathe. Harbors the horrific possessiveness of a romantic dictator.",
      },
      timing_modifiers: {
        wood: {
          ko: "비바람 속에서 나무들이 기괴하게 얽히며 군락을 이룹니다. 끝없는 영토 확장과 잔혹한 배타주의(비겁)가 오직 동족만의 소굴을 만듭니다.",
          en: "Trees twist grotesquely into a massive colony amidst the storm. Endless territorial expansion and brutal xenophobia forge a den exclusively for its own kind."
        },
        fire: {
          ko: "거대한 고목나무에 벼락이 내리쳐 활활 타오릅니다. 자기 파괴적인 과시욕과 불타는 반항아적 기질(식상)이 찬란하면서도 치명적인 쇼를 펼칩니다.",
          en: "Lightning strikes the ancient timber, setting it ablaze. Self-destructive display tactics and a burning rebel trait put on a brilliant, yet lethal show."
        },
        earth: {
          ko: "뿌리가 파고들던 늪지대가 콘크리트처럼 굳어버립니다. 숨 막힐 듯 촘촘한 세속적 집착과 물신주의(재성)가 모든 여백을 시멘트로 발라버립니다.",
          en: "The swamp into which the roots dug solidifies like concrete. Suffocatingly dense worldly attachment and pure materialism pave over all empty space."
        },
        metal: {
          ko: "하늘에서 서늘한 은도끼들이 우박처럼 쏟아져 내립니다. 철권통치와 강압적 폭력성(관성)이 자아의 싹을 무자비하게 쳐내어 영혼을 절단합니다.",
          en: "Frozen silver axes rain down from the sky like hail. Iron-fist rule and coercive violence ruthlessly chop down the buds of the ego, severing the soul."
        },
        water: {
          ko: "끝없는 폭우가 쏟아져 대지가 완전히 물에 잠깁니다. 광신적이고 뒤틀린 영적 숭배(인성)가 이성을 마비시키고 환각의 늪에 익사시킵니다.",
          en: "Endless torrential rain entirely submerses the land. Fanatic, twisted spiritual worship paralyzes reason and drowns the mind in a swamp of hallucinations."
        }
      }
    }
  },
  乙巳: {
    id: "eul-sa",
    metadata: {
      kr_name: "을사(乙巳)",
      en_name: "Eul-sa (Wood-Snake)",
      element: "Wood-Fire",
      animal: "Snake",
      nature_symbol: {
        ko: "서늘한 독을 머금은 붉은 불꽃",
        en: "The Venomous Ember",
      },
    },
    core_identity: {
      persona: {
        ko: "타오르는 독사",
        en: "The Burning Viper",
      },
      goth_punk_vibe: {
        ko: "화려하게 피어오르는 불꽃의 중심에서 소리 없이 미끄러져 나오는 붉은 뱀. 따뜻해 보이지만 닿는 순간 가장 고통스러운 화상을 입히는 치명적 독입니다.",
        en: "A red serpent soundlessly sliding out from the eye of a brilliant flame. Appears invitingly warm, but touching it inflicts the most agonizing, venomous burn.",
      },
      shadow_side: {
        ko: "자신을 돋보이게 하기 위해 끊임없이 주변을 태워버리는 이기적인 에고와 끝을 모르는 허영심",
        en: "A selfish ego and an endless streak of vanity that perpetually burns down its surroundings just to highlight its own existence.",
      },
    },
    behavior_metrics: {
      drive: 70,
      empathy: 40,
      stability: 30,
      unpredictability: 90,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "말과 행동은 언제나 가장 화려하고 매혹적입니다. 그러나 그 눈부신 쇼의 끝에는 상대를 완전히 잿더미로 만들어버리는 잔혹성이 존재합니다.",
        en: "Words and actions are eternally glamorous and seductive. Yet, the end of that dazzling show harbors a cruelty that turns the partner completely into ashes.",
      },
      relationship: {
        ko: "불꽃놀이 같은 강렬한 사랑을 원합니다. 하지만 온도가 식는 순간 미련 없이 독니를 박아버리고는 또 다른 태양을 찾아 홀연히 사라집니다.",
        en: "Craves an intense, firework-like romance. But the microsecond the temp drops, it coldly sinks its fangs in and vanishes without regret to find another sun.",
      },
      timing_modifiers: {
        wood: {
          ko: "타오르는 뱀의 형상을 띤 군집이 숲을 기형적으로 장악합니다. 광적인 무리 지음과 질투(비겁)가 오아시스 주변을 미치광이 사교 클럽으로 조작합니다.",
          en: "A colony of burning serpents grotesquely overtakes the forest. Fanatic swarming and toxic jealousy manipulate the oasis into a madman's social club."
        },
        fire: {
          ko: "붉은 뱀이 완전히 폭주하여 모든 초목을 전소시킵니다. 거침없는 시각적 도발과 파괴적인 충동(식상)이 잔혹한 예술 쇼를 완성하고 소멸합니다.",
          en: "The red viper completely botches into overdrive, incinerating all vegetation. Ruthless visual provocation and a destructive urge finish a cruel art show before vanishing."
        },
        earth: {
          ko: "용암이 식어 만들어진 딱딱한 바윗덩어리가 화염을 끝내 짓누릅니다. 극단적인 배금주의와 잔인한 계산기(재성)가 뱀의 허물을 도려내 금화로 바꿉니다.",
          en: "Hardened lava rock decisively crushes the flame. Extreme gold-worship and a brutal mental calculator peel the snake's shed skin to sell for pure gold."
        },
        metal: {
          ko: "차가운 강철 도끼가 춤추는 독사의 머리를 향해 떨어집니다. 끔찍한 사회적 억압과 강박증(관성)이 영혼을 질식시키며 처절한 비명을 부릅니다.",
          en: "A cold steel axe plummets toward the dancing viper's head. Horrific social repression and OCD suffocate the soul, conjuring an agonizing shriek."
        },
        water: {
          ko: "시꺼먼 맹독성 오수가 쏟아지며 불꽃을 강제로 끕니다. 우울의 심연과 왜곡된 도덕주의(인성)가 영혼을 마비시키고 미쳐버리게 만듭니다.",
          en: "Pitch-black toxic sewage pours down to forcefully extinguish the flame. The abyss of depression and warped moralism paralyze the soul into pure insanity."
        }
      }
    }
  },
  丙午: {
    id: "byeong-o",
    metadata: {
      kr_name: "병오(丙午)",
      en_name: "Byeong-o (Fire-Horse)",
      element: "Fire-Fire",
      animal: "Horse",
      nature_symbol: {
        ko: "정오의 흑점",
        en: "The Solar Sovereign",
      },
    },
    core_identity: {
      persona: {
        ko: "타오르는 절대군주",
        en: "The Blazing Overseer",
      },
      goth_punk_vibe: {
        ko: "중천에 떠 이글거리는 거대한 붉은 태양. 온 세상을 비추며 지배하려 하지만, 너무 밝고 뜨거운 나머지 그 누구도 곁에 머물지 못하는 절대적인 양성(陽性)의 고독입니다.",
        en: "A colossal red sun glaring directly overhead. Attempts to illuminate and dominate the whole world, but its absolute Yang isolation means no one can stand near the heat.",
      },
      shadow_side: {
        ko: "자신이 세상의 유일한 빛이자 정답이라 믿으며, 자신을 부정하는 존재는 한 줌 재로 만들어버리는 성스러운 폭정",
        en: "A holy tyranny believing it is the sole light and truth of the world, reducing any entity that denies it to a pile of scorched ashes.",
      },
    },
    behavior_metrics: {
      drive: 100,
      empathy: 20,
      stability: 15,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "강렬한 카리스마로 폭풍의 눈이 됩니다. 하지만 태양처럼 모든 것을 드러내기에, 얄팍한 타협이나 그림자 속에 숨는 것을 극도로 경멸합니다.",
        en: "Operates as the eye of the storm via intense charisma. But like the sun exposing everything, it deeply despises surface-level compromises or hiding in the shadows.",
      },
      relationship: {
        ko: "숨 쉴 틈 없이 밀어붙이는 맹렬한 지배욕. 자비 없는 애정 공세로 상대를 정복하지만, 그림자가 생기지 않는 그 사랑 아래에서 연인은 서서히 타들어 죽습니다.",
        en: "A fierce dominion that allows zero breathing room. Conquers the partner with ruthless affection, yet the lover slowly burns to death under a love lacking any shade.",
      },
      timing_modifiers: {
        wood: {
          ko: "태양 아래 마른 장작이 끝도 없이 투입되며 불기둥이 치솟습니다. 폭발하는 망상과 사이비적 영적 오만(인성)이 세상을 광기의 제단으로 바꿉니다.",
          en: "Dry firewood is endlessly tossed under the sun, shooting up columns of fire. Exploding delusions and cultish spiritual arrogance turn reality into an altar of madness."
        },
        fire: {
          ko: "태양이 분열하며 수십 개의 흑점이 세상을 노화시킵니다. 멈출 수 없는 양인살의 폭주와 파괴적인 아집(비겁)이 모든 경쟁자를 태워 학살합니다.",
          en: "The sun fractures, releasing dozens of sunspots that age the world. The unyielding rampage of the Yangin star and destructive stubbornness burn all rivals to slaughter."
        },
        earth: {
          ko: "활화산이 폭발하여 거대한 화산재가 태양을 완전히 가려버립니다. 한계를 잊은 무모함과 극한의 파괴적 쾌락(식상)이 모든 법과 질서를 씹어 먹습니다.",
          en: "An active volcano erupts, its massive ash cloud completely blocking the sun. Limitless recklessness and extreme destructive thrill aggressively chew up all law and order."
        },
        metal: {
          ko: "허공에서 녹아내린 쇳물이 비처럼 쏟아지며 비명을 지릅니다. 소시오패스적 계산기와 무자비한 이윤 추구(재성)가 태양의 영광을 피의 거래로 전락시킵니다.",
          en: "Molten iron shrieks as it rains down from the void. Sociopathic calculations and brutal profit-seeking drag down the sun's glory into a blood-soaked transaction."
        },
        water: {
          ko: "칠흑 같은 밤바다가 거대한 해일로 솟구쳐올라 태양을 짓누릅니다. 극심한 우울과 목을 조르는 권력의 역습(관성)이 절대군주를 처절하게 추락시킵니다.",
          en: "A pitch-black night sea skyrockets as a tsunami to crush the sun. Severe depression and a choking counterattack of power tragically plunge the monarch into the abyss."
        }
      }
    }
  },
  丁未: {
    id: "jeong-mi",
    metadata: {
      kr_name: "정미(丁未)",
      en_name: "Jeong-mi (Fire-Sheep)",
      element: "Fire-Earth",
      animal: "Sheep",
      nature_symbol: {
        ko: "사막의 미라지",
        en: "The Scorchant Mirage",
      },
    },
    core_identity: {
      persona: {
        ko: "사막의 환영",
        en: "Illusion of the Dunes",
      },
      goth_punk_vibe: {
        ko: "태양이 증발할 만큼 지독히 메마른 모래사막을 어슬렁거리는 열기. 타는 듯한 갈증을 안고 끝없는 열파 속을 걷는 외로움과 예민함입니다.",
        en: "Heatwaves stalking a sand desert so brutally dry that the sun itself evaporates. A hyper-sensitivity and loneliness trudging through endless thermal waves with a burning thirst.",
      },
      shadow_side: {
        ko: "속은 바싹 말라 텅 비어있으면서도, 화려한 신기루로 타인을 기만하고 조종하려는 은밀한 스토커적 기질",
        en: "Hollow and parched on the inside, yet manipulating and gaslighting others through brilliant mirages using a covert, stalker-esque disposition.",
      },
    },
    behavior_metrics: {
      drive: 60,
      empathy: 50,
      stability: 40,
      unpredictability: 80,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "겉으로는 순한 양처럼 위장하지만, 내면에는 자신을 괴롭히는 뜨거운 열등감과 누구도 믿지 않는 병적인 편집증이 도사립니다.",
        en: "Camouflaged perfectly as a docile sheep, but internally harbors a scorching inferiority complex and a morbid paranoia that trusts absolutely zero souls.",
      },
      relationship: {
        ko: "상대방을 교묘하게 불길 속으로 유인한 뒤, 연인이 갈증에 허덕일 때 시원한 물 대신 화상 연고만 내미는 사디스틱 로맨스입니다.",
        en: "Cunningly lures the partner straight into the inferno. When they start begging of thirst, you hand them burn-ointment instead of cool water in this sadistic romance.",
      },
      timing_modifiers: {
        wood: {
          ko: "메마른 사막에 시뻘건 독가시 덤불이 치솟아 오아시스를 말살합니다. 과도한 심리적 압박과 뒤틀린 종교적 오만(인성)이 영혼의 목을 조릅니다.",
          en: "Red poisonous thickets shoot out of the dry desert to assassinate the oasis. Excessive psychological pressure and twisted religious dogma literally strangle the soul."
        },
        fire: {
          ko: "열파가 겹겹이 뭉치며 모든 것을 기화시키는 거대한 아지랭이 괴물을 만듭니다. 폭발하는 질투심과 이기적 망상(비겁)이 자아를 열사병으로 미치게 만듭니다.",
          en: "Heatwaves cluster into a massive haze-monster that vaporizes everything. Detonating jealousy and selfish delusions drive the ego completely insane via heatstroke."
        },
        earth: {
          ko: "숨을 쉴 수 없는 거대한 황사 폭풍이 대낮의 태양을 가립니다. 폭주하는 표현욕구와 자기파괴적 방종(식상)이 모든 체면을 진흙탕에 패대기칩니다.",
          en: "A colossal, unbreathable yellow-dust storm blots out the midday sun. Rampant expression and self-destructive overindulgence violently slam all dignity into a mud puddle."
        },
        metal: {
          ko: "사막 한가운데 녹아내리는 은빛 동전들이 서늘하게 버려져 있습니다. 숨 막히는 계산과 타락한 소유욕(재성)이 자본주의의 노예로 타락시킵니다.",
          en: "Melting silver coins lie chillingly abandoned in the dead center of the desert. Suffocating calculations and corrupted possessiveness forcefully degenerate it into a slave of capitalism."
        },
        water: {
          ko: "열사에 갑자기 쏟아진 산성 오수가 끔찍한 치찰음을 내며 끓어오릅니다. 지독한 형벌적 억압과 잔혹한 카르마(관성)가 내면을 고문합니다.",
          en: "Toxic acid sewage suddenly spills over the scorching dunes, boiling with a horrific sizzle. Brutal penal repression and cruel karma actively torture the inner core."
        }
      }
    }
  },
  戊申: {
    id: "mu-shin",
    metadata: {
      kr_name: "무신(戊申)",
      en_name: "Mu-shin (Earth-Monkey)",
      element: "Earth-Metal",
      animal: "Monkey",
      nature_symbol: {
        ko: "음모를 꾸미는 석상",
        en: "The Monolith of Cunning",
      },
    },
    core_identity: {
      persona: {
        ko: "무표정한 조종자",
        en: "The Deadpan Manipulator",
      },
      goth_punk_vibe: {
        ko: "거대한 흙산에 둘러싸인 은밀한 지하 요새. 묵직하고 둔탁해 보이는 외관 뒤에서 수백 개의 은빛 톱니바퀴가 교묘하게 세상을 재단합니다.",
        en: "A covert subterranean bunker fortified by massive earthen mountains. Behind heavy, blunt exterior walls, hundreds of silver cogwheels strictly manipulate reality.",
      },
      shadow_side: {
        ko: "겉으로는 무심한 척하면서도 실상은 모든 이익을 쥐고 흔들려는 소시오패스적 계산과 냉혹성",
        en: "Feigns complete indifference on the surface, but acts via sociopathic calculations and ruthlessness designed to hijack absolutely every ounce of profit.",
      },
    },
    behavior_metrics: {
      drive: 60,
      empathy: 20,
      stability: 75,
      unpredictability: 60,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Hwa-saeng-to"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "태산처럼 움직이지 않지만, 한 번의 날카로운 일격으로 장애물을 피투성이로 만듭니다. 가장 조용한 곳에서 가장 잔인한 이윤을 챙깁니다.",
        en: "Motionless like a great mountain, but shatters obstacles into a bloody mess with a single, ultra-sharp strike. Pockets the cruelest profits from the quietest corners.",
      },
      relationship: {
        ko: "계산기를 두드리며 사랑의 가성비를 잰 후 최적화된 감정만 지불합니다. 손해 본다 싶으면 상대방을 석벽 너머로 차갑게 격리시킵니다.",
        en: "Punctuating the calculator to gauge the ROI of a relationship, strictly paying out optimized emotions. If it feels like a loss, the partner is coldly quarantined behind a stone wall.",
      },
      timing_modifiers: {
        wood: {
          ko: "철벽 바깥으로 군대처럼 자라나는 검은 대나무 숲이 돌격해 옵니다. 잔혹한 서열 싸움과 군사주의적 통제(관성)가 자아를 위협하며 피를 부릅니다.",
          en: "A black bamboo forest charges like an army toward the iron barricade. Brutal hierarchy battles and militaristic regime-control threaten the ego, demanding blood."
        },
        fire: {
          ko: "지하 벙커가 기괴한 열기로 달궈지며 톱니바퀴들을 용해시킵니다. 왜곡된 광신적 믿음과 폐쇄적 사고(인성)가 정밀함을 미친 광기로 타락시킵니다.",
          en: "Bizarre heat cooks the subterranean bunker, liquifying the cogwheels. Warped cultish faith and closed-mindedness deeply corrupt precision logic into pure, foaming madness."
        },
        earth: {
          ko: "끝없는 산사태가 발생하며 모든 통로를 거대한 바위로 짓이겨버립니다. 비대한 나르시시즘과 타인에 대한 공감 능력 영구 상실(비겁)이 자아를 파묻습니다.",
          en: "Endless avalanches completely mangle all passageways with colossal boulders. Bloated narcissism and the permanent loss of all empathy fully bury the ego."
        },
        metal: {
          ko: "은밀한 요새 내부에서 잔혹한 학살 병기들이 일제히 가동되어 폭주합니다. 제어 잃은 천재성과 날카로운 독설(식상)이 모든 경쟁자를 도륙합니다.",
          en: "Inside the covert bunker, brutal slaughter-weapons engage in overdrive. Genius devoid of braking and hyper-sharp venomous words execute all competitors."
        },
        water: {
          ko: "요새의 지하실 위로 썩은 오수가 물밀듯이 차올라 모두를 수몰시킵니다. 타락한 영물주의적 쾌락과 도박적 파멸(재성)이 폐부를 시꺼멓게 익사시킵니다.",
          en: "Rotten sewage suddenly surges over the basement bunker, drowning everyone alive. Corrupted animist pleasure and a gambler's ruination deeply drown the lungs in pitch black."
        }
      }
    }
  },
  己酉: {
    id: "gi-yu",
    metadata: {
      kr_name: "기유(己酉)",
      en_name: "Gi-yu (Earth-Rooster)",
      element: "Earth-Metal",
      animal: "Rooster",
      nature_symbol: {
        ko: "모래 속에 묻힌 메스",
        en: "The Barren Scalpel",
      },
    },
    core_identity: {
      persona: {
        ko: "섬뜩한 완벽주의자",
        en: "The Macabre Perfectionist",
      },
      goth_punk_vibe: {
        ko: "거칠고 황량한 모래사막 속에 교묘하게 숨겨진 수술용 은빛 메스. 부드러워 보이지만 무심결에 밟는 순간 살점을 가장 예리하게 도려냅니다.",
        en: "A surgical silver scalpel covertly hidden within a rough, barren sand desert. Appears soft, but the moment you recklessly step on it, it surgically slices your flesh.",
      },
      shadow_side: {
        ko: "티끌 하나 용납하지 못하는 병적인 결벽증으로 타인의 단점을 현미경처럼 찾아내어 조각내는 신경증적 파괴성",
        en: "A neurotic destructiveness that uses microscope-like precision to find and shred others' flaws due to a morbid mysophobia that tolerates zero specks of dust.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 30,
      stability: 60,
      unpredictability: 70,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Geum-saeng-su"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "말로 입히는 상처의 달인입니다. 조용하고 예의 바르지만, 선을 넘으면 감정이 완벽하게 배제된 날카로운 언어로 상대의 숨통을 단번에 끊어버립니다.",
        en: "A grandmaster of inflicting wounds via words. Quiet and polite, but cross the line, and they instantly sever your windpipe with hyper-sharp, zero-emotion vocabulary.",
      },
      relationship: {
        ko: "자신의 통제권을 완벽하게 충족시키는 인형 같은 상대를 원합니다. 상대에게서 조금의 먼지라도 발견되면 가차 없이 폐기물로 취급합니다.",
        en: "Desires a doll-like partner that perfectly fulfills their need for absolute control. Discovers even a spec of dust on the partner? Mercilessly treated as hazardous waste.",
      },
      timing_modifiers: {
        wood: {
          ko: "메마른 모래에 뒤틀린 독초들이 뿌리내리며 파고듭니다. 가혹한 자기 검열과 끔찍한 사회적 강박(관성)이 자아를 칼날 위로 내몰며 자해합니다.",
          en: "Twisted toxic weeds root and drill into the dry sand. Harsh self-censorship and horrific social OCD force the ego onto the razor's edge, resulting in self-harm."
        },
        fire: {
          ko: "태양이 모래를 달궈 숨겨진 메스를 타는 듯한 흉기로 만듭니다. 숨 막히는 사이비적 집착과 왜곡된 도덕주의(인성)가 영혼을 구속합니다.",
          en: "The sun bakes the sand, turning the hidden scalpel into a burning murder weapon. Suffocating cultish obsession and warped moralism rigidly shackle the soul."
        },
        earth: {
          ko: "거대한 모래 폭풍이 일어 모든 것을 깎아냅니다. 극단적 배타주의와 거만한 아집(비겁)이 자아를 성역화하며 타인을 모래로 만들어버립니다.",
          en: "A massive sandstorm arises, eroding everything away. Extreme xenophobia and arrogant stubbornness sanctify the ego whilst atomizing others into sand."
        },
        metal: {
          ko: "은빛 수술 칼들이 수천 개로 증식하여 허공을 난도질합니다. 통제를 상실한 히스테리와 파괴적 표현욕구(식상)가 피비린내 나는 폭주의 밤을 엽니다.",
          en: "Silver surgical knives multiply into the thousands, hacking the void to pieces. Control-loss hysteria and a destructive expression-urge open a blood-soaked night of rampage."
        },
        water: {
          ko: "오염된 검은 물이 쏟아져 모래를 질퍽한 늪으로 부패시킵니다. 타락한 이익 추구와 끝없는 물질적 탐욕(재성)이 칼날을 녹슬고 썩게 만듭니다.",
          en: "Contaminated black water pours down, rotting the sand into a soggy swamp. Corrupted profit-seeking and endless material greed cause the blade to thoroughly rust and decay."
        }
      }
    }
  },
  庚戌: {
    id: "gyeong-sul",
    metadata: {
      kr_name: "경술(庚戌)",
      en_name: "Gyeong-sul (Metal-Dog)",
      element: "Metal-Earth",
      animal: "Dog",
      nature_symbol: {
        ko: "강철 산의 그림자",
        en: "The Iron Sentry",
      },
    },
    core_identity: {
      persona: {
        ko: "무자비한 수호자",
        en: "The Merciless Guardian",
      },
      goth_punk_vibe: {
        ko: "수만 개의 검이 꽂혀 이루어진 거대한 강철의 산맥. 괴강과 백호의 살기 어린 위압감을 뿜어내며, 침입자를 무표정하게 도륙하는 완벽한 요새입니다.",
        en: "A colossal mountain range forged by ten-thousand embedded swords. Bleeds the murderous intimidation of Gwaegang and Baekho, acting as a flawless fortress that deadpan-slaughters intruders.",
      },
      shadow_side: {
        ko: "자신이 정한 '내 사람'이 아니면 가차 없이 짓밟아버리는 잔혹성과 폭발하면 멈추지 않는 파괴적 광연(狂宴)",
        en: "A cruelty that mercilessly tramples anyone outside their authorized 'inner circle', alongside a destructive lunacy that literally cannot stop once detonated.",
      },
    },
    behavior_metrics: {
      drive: 85,
      empathy: 20,
      stability: 80,
      unpredictability: 60,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Geum-saeng-su"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "강철 같은 신념과 의리로 똘똘 뭉쳐 있습니다. 그러나 배신자를 향해서는 자비란 없으며, 천 개의 칼날이 되어 상대의 숨통을 영구히 끊어버립니다.",
        en: "Armored purely in steel-like conviction and loyalty. But shows absolute zero mercy towards traitors, shifting into a thousand blades to permanently sever their windpipe.",
      },
      relationship: {
        ko: "광신적일 정도의 보호본능으로 연인을 강철 성벽 안에 가둡니다. 바깥 세상으로부터 완벽하게 지켜주지만, 그 문맥탈출은 곧 사형 선고를 의미합니다.",
        en: "Locks the lover inside a steel wall fueled by an almost fanatic protective instinct. Defends them perfectly from the outside world, but escaping that matrix equals an immediate death sentence.",
      },
      timing_modifiers: {
        wood: {
          ko: "강철 산맥 주위로 기괴한 흑단나무 가시덤불이 증식합니다. 잔혹한 영역 표시와 통제 불능의 소유욕(재성)이 피로 물든 자본주의의 노예로 타락시킵니다.",
          en: "Bizarre ebony thorn-thickets rapidly multiply around the iron mountains. Brutal territory marking and uncontrollable possessiveness degrade it into a blood-stained slave of capitalism."
        },
        fire: {
          ko: "천 개의 칼날이 불타오르며 거대한 화염의 십자가로 변모합니다. 살인적인 사회적 억압과 맹신적 권위주의(관성)가 자아를 스스로 불태워버립니다.",
          en: "A thousand blades burst into flames, mutating into a giant cross of fire. Murderous social repression and blind authoritarianism force the ego to self-immolate."
        },
        earth: {
          ko: "엄청난 산사태가 발생해 강철의 군사 기지를 모조리 파묻어버립니다. 숨이 막히는 강박증과 광신적 맹신(인성)이 영혼을 방공호에 생매장합니다.",
          en: "A cataclysmic landslide completely buries the iron military base. Suffocating OCD and cult-like blind faith bury the soul alive inside a bomb shelter."
        },
        metal: {
          ko: "수지붕이 톱니바퀴처럼 맞물려 전 세계를 베어버리는 무기가 됩니다. 절정을 치닫는 살기와 비정상적인 배타성(비겁)이 대학살의 서막을 올립니다.",
          en: "Peaks lock together like giant cogwheels, forming a doomsday weapon that slices the globe. Peaking bloodlust and abnormal exclusivity kick off the prelude to a massacre."
        },
        water: {
          ko: "강철 산맥에서 흘러나오는 피 섞인 독수(毒水)가 대지를 부식시킵니다. 왜곡된 표현력과 잔혹한 카디악 아나키즘(식상)이 모든 법규를 수몰시킵니다.",
          en: "Toxic water mixed with blood flows from the iron mountains, corroding the earth. Warped expression and brutal cardiac anarchism completely submerge all laws."
        }
      }
    }
  },
  辛亥: {
    id: "shin-hae",
    metadata: {
      kr_name: "신해(辛亥)",
      en_name: "Shin-hae (Metal-Pig)",
      element: "Metal-Water",
      animal: "Pig",
      nature_symbol: {
        ko: "검은 바다의 차가운 진주",
        en: "The Frost Pearl",
      },
    },
    core_identity: {
      persona: {
        ko: "얼어붙은 탐미주의자",
        en: "The Frozen Aesthete",
      },
      goth_punk_vibe: {
        ko: "빛 한 점 들지 않는 심해 바닥에 기이하게 빛나는 얼음 진주. 창백하고 압도적인 지적 미학 뒤편에, 타인의 접근을 거부하는 소름 끼치는 결벽이 존재합니다.",
        en: "An eerily glowing ice pearl resting at the abyss of a lightless ocean. Behind its pale, overwhelming intellectual aesthetic lies a horrifying germophobia that rejects all human approach.",
      },
      shadow_side: {
        ko: "세속의 모든 것을 더럽게 여기며 심연 속에 틀어박혀 자신의 우월감만 애무하는 병적인 지적 나르시시즘",
        en: "A morbid intellectual narcissism that views all worldly things as filth, locking itself in the abyss to exclusively massage its own superiority complex.",
      },
    },
    behavior_metrics: {
      drive: 40,
      empathy: 60,
      stability: 30,
      unpredictability: 80,
    },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su", "To-saeng-geum"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "뛰어난 두뇌와 날카로운 통찰력으로 세상을 해부합니다. 진흙탕이나 미천한 군상 속에 섞이는 것을 죽기보다 싫어하는 극단적 엘리트주의입니다.",
        en: "Dissects the world using brilliant brains and razor-sharp insight. Represents an extreme elitism that would literally rather die than mix within a mud pit of plebians.",
      },
      relationship: {
        ko: "서늘하고 우아한 분위기로 상대를 매혹시키지만, 조금이라도 지적이거나 미적으로 자신의 등급에 미치지 못하면 벌레 보듯 차갑게 폐기합니다.",
        en: "Fascinates the partner with a frigid, elegant aura, but the millisecond they fail to meet their intellectual or aesthetic grade, they are coldly discarded like roaches.",
      },
      timing_modifiers: {
        wood: {
          ko: "얼어붙은 검은 바다 위로 독기를 품은 흑단나무가 기이하게 피어납니다. 끝을 모르는 허영심과 계산기적인 이득 추구(재성)가 영혼을 메마르게 합니다.",
          en: "Toxic ebony trees bloom grotesquely over the frozen black sea. Endless vanity and calculator-like profit-seeking bleed the soul completely dry."
        },
        fire: {
          ko: "갑작스러운 열수구가 심해를 끓게 만들어 진주를 고문합니다. 파괴적인 강박과 사회로부터의 잔혹한 처벌(관성)이 정교한 자아를 박살냅니다.",
          en: "A sudden hydrothermal vent boils the abyss, directly torturing the pearl. Destructive OCD and brutal punishment from society crush the delicate ego to pieces."
        },
        earth: {
          ko: "검은 진흙탕이 심해로 쏟아져 진주의 빛을 완전히 매장시킵니다. 숨 돌릴 틈 없는 은둔형 외톨이 성향과 편집증적 의심(인성)이 영구적인 고립을 낳습니다.",
          en: "Black mud dumps into the abyss, utterly burying the pearl's light. Suffocating hikikomori traits and paranoid suspicion give birth to permanent isolation."
        },
        metal: {
          ko: "은빛 바늘들이 거대한 폭풍이 되어 검은 바다를 난도질합니다. 칼날 같은 배타성과 광적인 우월주의(비겁)가 모든 타인을 심해의 노예로 억압합니다.",
          en: "Silver needles form a colossal typhoon, continuously hacking the black sea. Blade-like exclusivity and fanatic supremacism oppress all others into abyssal slaves."
        },
        water: {
          ko: "모든 것을 집어삼키는 해일이 일어 영원한 암흑 지대가 펼쳐집니다. 브레이크 없는 오만방자함과 지적 허영(식상)이 자아를 통제 불능의 바다에 익사시킵니다.",
          en: "A massive tsunami swallows everything, unfurling an eternal zone of absolute dark. Brakeless arrogance and intellectual vanity drown the ego in an uncontrollable ocean."
        }
      }
    }
  },
  壬子: {
    id: "im-ja",
    metadata: {
      kr_name: "임자(壬子)",
      en_name: "Im-ja (Water-Rat)",
      element: "Water-Water",
      animal: "Rat",
      nature_symbol: {
        ko: "빛을 삼킨 심해",
        en: "The Abyssal Tide",
      },
    },
    core_identity: {
      persona: {
        ko: "끝없는 심연의 맹수",
        en: "The Leviathan of the Deep",
      },
      goth_punk_vibe: {
        ko: "모든 빛과 온기를 삼켜버리는 끝을 알 수 없는 칠흑의 바다. 그 고요함 아래에는 언제 터져 나올지 모르는 거대한 해일과 파괴적 자아가 잠들어 있습니다.",
        en: "A pitch-black ocean of unknown depths that swallows all light and warmth. Beneath that silence slumbers a colossal tsunami and a violently destructive ego awaiting detonation.",
      },
      shadow_side: {
        ko: "자신의 거대한 그림자로 온 세상을 덮어, 모든 타자의 개성을 수몰시키고 자신만의 색채로 오염시키려는 고요한 광기",
        en: "A silent madness attempting to blanket the entire world in its massive shadow, submerging the individuality of all others and contaminating reality with its own color.",
      },
    },
    behavior_metrics: {
      drive: 95,
      empathy: 30,
      stability: 10,
      unpredictability: 95,
    },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su", "To-saeng-geum"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "속을 절대 알 수 없는 치명적인 백색왜성입니다. 블랙홀처럼 주변의 모든 에너지와 비밀을 흡수하며, 분노가 터지면 모든 것을 수압으로 압살합니다.",
        en: "A lethal white dwarf whose interior can never be deciphered. Siphons all energy and secrets from its surroundings like a black hole, crushing everything with sheer water pressure when enraged.",
      },
      relationship: {
        ko: "연인을 자신의 심해 속으로 끌고 들어가 숨도 못 쉬게 만듭니다. 압도적인 애정으로 포장된, 상대를 형태도 없이 녹여버리는 정신적 융해입니다.",
        en: "Drags the lover down into its abyss until they literally cannot breathe. Disguised as overwhelming affection, it's actually a psychological meltdown that dissolves the partner formlessly.",
      },
      timing_modifiers: {
        wood: {
          ko: "끝을 모르는 바다 밑바닥에서 괴기스러운 거대 해초가 세상을 휘감습니다. 브레이크가 파괴된 성적/지적 욕망(식상)이 이성을 먹어 치웁니다.",
          en: "Grotesque giant kelp tentacles out from the endless ocean floor and wrap the world. Sexual and intellectual desires with obliterated brakes blatantly devour reason."
        },
        fire: {
          ko: "밤바다에 일렁이는 유령선처럼 섬뜩한 불길이 번집니다. 끔찍한 자본주의적 갈망과 끝없는 소유욕(재성)이 타인의 생명줄마저 얼어붙게 만듭니다.",
          en: "Macabre flames spread like a ghost ship drifting on the night sea. Horrific capitalist craving and endless possessiveness freeze even the lifelines of others."
        },
        earth: {
          ko: "거대한 콘크리트 댐이 심해를 강제로 짓눌러 가둡니다. 폭압적인 사회의 규율과 억압(관성)이 거대한 물을 썩게 만들며 파멸적인 우울증을 낳습니다.",
          en: "A massive concrete dam forcefully crushes and imprisons the abyss. Tyrannical societal rules and oppression rot the giant waters, spawning catastrophic depression."
        },
        metal: {
          ko: "얼어붙은 면도날 비가 깊은 심해로 내리꽂히며 잔혹학살극을 펼칩니다. 강박적 은둔과 사이비 지식 추구(인성)가 세상을 정신병동으로 만듭니다.",
          en: "Frozen razor-blade rain plummets into the deep abyss, staging a brutal slaughter. Compulsive reclusion and the pursuit of pseudo-knowledge turn the world into a psych ward."
        },
        water: {
          ko: "거대한 쌍둥이 해일이 일어나 육지의 모든 문명을 지워버립니다. 끝없는 파괴 본능과 소시오패스적 우월감(비겁)이 자발적 인류 핵겨울을 초래합니다.",
          en: "Colossal twin tsunamis rise, wiping out all land civilizations entirely. Endless destructive instincts and sociopathic superiority voluntarily trigger a human nuclear winter."
        }
      }
    }
  },
  癸丑: {
    id: "gye-chuk",
    metadata: {
      kr_name: "계축(癸丑)",
      en_name: "Gye-chuk (Water-Ox)",
      element: "Water-Earth",
      animal: "Ox",
      nature_symbol: {
        ko: "서리 내린 무덤",
        en: "The Frozen Coffin",
      },
    },
    core_identity: {
      persona: {
        ko: "혹한의 집행자",
        en: "The Winter Executioner",
      },
      goth_punk_vibe: {
        ko: "잔혹한 한파에 꽁꽁 얼어붙은 핏빛 진흙. 거대한 백호의 원념을 품은 채, 고통을 감수하고서라도 목표물을 향해 묵묵히 낫을 치켜드는 사신입니다.",
        en: "Blood-soaked mud frozen solid by a brutal harsh winter. Embodying the vengeful spirit of the White Tiger, it acts as a grim reaper silently raising its scythe toward the target despite the pain.",
      },
      shadow_side: {
        ko: "한 번 맺힌 원한은 얼음 속에 박제해 두고두고 되새기며, 상대가 피눈물을 흘릴 때까지 잔인무도하게 갚아주는 지독한 복수심",
        en: "Stuffs a held grudge into a block of ice to re-examine FOREVER, harboring a venomous vindictiveness that ruthlessly pays it back until the adversary sheds tears of blood.",
      },
    },
    behavior_metrics: {
      drive: 80,
      empathy: 15,
      stability: 70,
      unpredictability: 60,
    },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su", "Hwa-saeng-to"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "극한의 인내심으로 빙하기를 견뎌냅니다. 그러나 그 견딤의 목적은 오직 자신의 목표를 방해하는 자들의 목을 가장 차가운 얼음칼로 베기 위함입니다.",
        en: "Endures the ice age via extreme patience. Yet the sole purpose of that endurance is specifically to decapitate anyone who obstructed their goal using the coldest ice-blade.",
      },
      relationship: {
        ko: "상대방을 절대 벗어날 수 없는 얼음 감옥에 가둬 통제하려 합니다. 영원하고 지독한 사랑을 바치지만 삐끗하는 순간 그 사랑은 가장 잔인한 형벌로 치환됩니다.",
        en: "Attempts to control and lock the partner inside an inescapable ice prison. Offers eternal, toxic love—but step out of line, and that love instantly converts to the cruelest torture.",
      },
      timing_modifiers: {
        wood: {
          ko: "얼어붙은 무덤 위로 마르고 날카로운 검은 나무가 기괴하게 자랍니다. 파괴적인 식욕과 무자비한 배신(식상)이 허무주의적 광연을 이룹니다.",
          en: "Dry, hyper-sharp black trees grow grotesquely over the frozen grave. Destructive appetite and ruthless betrayal forge a nihilistic lunacy."
        },
        fire: {
          ko: "얼음이 녹아 질퍽한 핏빛 진흙으로 변하며 악취를 풍깁니다. 집착에 가까운 배금주의와 타락한 육체적 쾌락(재성)이 부패의 구덩이로 끌어내립니다.",
          en: "The ice melts into soggy, blood-soaked mud leaking a foul stench. Obsessive gold-worship and corrupted carnal pleasure drag everything down into a pit of rot."
        },
        earth: {
          ko: "수천 개의 묘비가 떨어져 내리며 시야를 완전히 차단합니다. 숨 막히는 압제적 통제와 병적인 편집증(관성)이 자아를 영원한 정신적 묘지에 가둡니다.",
          en: "Thousands of tombstones crash down, completely blocking all vision. Suffocating tyrannical control and morbid paranoia lock the ego in an eternal psychological graveyard."
        },
        metal: {
          ko: "허공에서 녹슨 쇠창살들이 내려와 감옥을 이중 삼중으로 봉쇄합니다. 극단적 사이비 종교 심취와 우울증(인성)이 영혼을 스스로 목매달게 합니다.",
          en: "Rusted iron bars descend from the void, double and triple sealing the prison. Extreme cult-worship and depression coerce the soul into hanging itself."
        },
        water: {
          ko: "시꺼먼 우박과 눈보라가 무덤 전체를 뒤덮어 영구 동토로 만듭니다. 극에 달한 독선과 잔혹한 인민재판(비겁)이 모든 궤도를 학살의 빙하기로 동결시킵니다.",
          en: "Pitch-black hail and a blizzard blanket the grave, turning it into permafrost. Peaking self-righteousness and a brutal people's court freeze all orbit into an ice age of slaughter."
        }
      }
    }
  },
  甲寅: {
    id: "gap-in",
    metadata: {
      kr_name: "갑인(甲寅)",
      en_name: "Gap-in (Wood-Tiger)",
      element: "Wood-Wood",
      animal: "Tiger",
      nature_symbol: {
        ko: "폭풍을 뚫고 선 세계수",
        en: "The Emerald Sentinel",
      },
    },
    core_identity: {
      persona: {
        ko: "절대 구부러지지 않는 숲의 심장",
        en: "The Unbending Core of the Forest",
      },
      goth_punk_vibe: {
        ko: "폭풍 속에서도 결코 고개를 숙이지 않는 태고의 숲의 주인. 위를 향해 뻗어가는 무자비한 생명력이 주위를 뒤덮어버립니다.",
        en: "The lord of the primeval forest who never bows, even in the tempest. A ruthless vitality reaching straight up, violently overgrowing everything around it.",
      },
      shadow_side: {
        ko: "부러질지언정 절대 휘지 않는다는 파괴적인 에고. 타협을 모르는 순수한 이상이 현실을 찢어버립니다.",
        en: "A destructive ego that would rather shatter than bend. A pure, compromising ideal that violently shreds reality apart.",
      },
    },
    behavior_metrics: {
      drive: 95,
      empathy: 30,
      stability: 40,
      unpredictability: 70,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Su-saeng-mok"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "오직 직진만을 아는 야수적 추진력입니다. 자신을 가로막는 것은 동정이든 논리든 무엇이든 가차 없이 뚫어버리는 자연의 관문입니다.",
        en: "A beastly propulsion that only knows how to move forward. A gateway of nature that ruthlessly pierces through whatever blocks it—be it logic or pity.",
      },
      relationship: {
        ko: "스스로를 숲의 절대자로 여기며 연인을 완벽한 자신의 피조물로 종속시킵니다. 끝없는 보호를 제공하지만, 그 품을 벗어나는 순간 저주받은 가시덤불이 됩니다.",
        en: "Crowning itself the absolute ruler of the forest, subordinating the lover as its perfect creation. Offers endless protection, but leaving its embrace summons a cursed thicket of thorns.",
      },
      timing_modifiers: {
        wood: {
          ko: "거대한 숲이 햇빛을 가려 모든 것을 질식시킵니다. 파괴적인 동족 의식과 무자비한 영역 확장이 공존을 부정합니다.",
          en: "The massive forest eclipses the sunlight, suffocating everything beneath it. Destructive tribalism and ruthless territorial expansion deny any form of coexistence."
        },
        fire: {
          ko: "세계수가 스스로 불꽃을 달구며 장엄하게 타오릅니다. 끝을 모르는 창조적 폭발이 아름답지만, 결국 기반마저 태워버리는 오문을 부릅니다.",
          en: "The world tree sets itself ablaze, burning with majestic terror. An endless creative explosion that is beautiful, but beckons an arrogance that burns even its foundations."
        },
        earth: {
          ko: "숲이 대지를 강제로 움켜쥐고 뿌리를 깊게 박아버립니다. 치명적인 물신주의가 이상주의의 탈을 쓰고 영혼을 갈취합니다.",
          en: "The forest violently grips the earth, sinking its roots to the absolute core. Lethal materialism parades in the mask of idealism to extort the soul."
        },
        metal: {
          ko: "천지를 베는 은빛 폭풍이 몰아치며 세계수의 가지를 난도질합니다. 억압받는 에고 속에서 돋아나는 뒤틀린 편집증과 생존 본능입니다.",
          en: "A silver storm that cuts perfectly through heaven and earth hacks the world tree's branches. Twisted paranoia and survival instinct bloom from the repressed ego."
        },
        water: {
          ko: "끝없는 검은 장대비가지독한 영적 혼란을 가져옵니다. 철학의 이름으로 뻗어나가는 깊은 늪이 자아를 영원히 잠식합니다.",
          en: "Endless dark torrential rain brings a toxic spiritual chaos. A deep swamp sprawling in the name of philosophy permanently submerges the ego."
        }
      }
    }
  },
  乙卯: {
    id: "eul-myo",
    metadata: {
      kr_name: "을묘(乙卯)",
      en_name: "Eul-myo (Wood-Rabbit)",
      element: "Wood-Wood",
      animal: "Rabbit",
      nature_symbol: {
        ko: "섬뜩한 생명력의 붉은 넝쿨",
        en: "The Crimson Thicket",
      },
    },
    core_identity: {
      persona: {
        ko: "아름답고 잔혹한 포식자",
        en: "The Beautiful, Cruel Predator",
      },
      goth_punk_vibe: {
        ko: "모든 벽과 경계를 기어코 타고 넘어가는 유연하면서도 질긴 넝쿨. 은밀하게 파고들어 마침내 거목마저 질식하게 만드는 아름답고 치명적인 지배력입니다.",
        en: "A flexible yet indestructible vine that inevitably creeps over every wall and boundary. A beautiful, lethal dominance that covertly burrows in to ultimately suffocate even the greatest timber.",
      },
      shadow_side: {
        ko: "생존을 위해서라면 기생조차 우아하다고 믿는, 부드러운 얼굴 뒤의 끝없는 질투와 이기적 증식성",
        en: "A boundless jealousy and selfish proliferation hiding behind a soft face, believing that even parasitism is elegant if it ensures survival.",
      },
    },
    behavior_metrics: {
      drive: 75,
      empathy: 50,
      stability: 30,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "Su-saeng-mok"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "절대 포기하지 않는 생명력. 겉으로는 부드럽게 타인에게 맞춰주는 듯하지만, 종국에는 모두가 자신의 뜻대로 움직이도록 만드는 은밀한 독재자입니다.",
        en: "A vitality that never surrenders. Appears gently accommodating to others on the surface, but operates as a covert dictator orchestrating everyone to move exactly as they will in the end.",
      },
      relationship: {
        ko: "상대방의 마음의 틈새를 정확히 파고들어 자신의 뿌리를 내립니다. 연인이 오직 자신 없이 살 수 없게 만드는 치명적이고 유해한 집착입니다.",
        en: "Precisely drills into the crevices of the partner's heart to lay down its roots. A lethal and toxic obsession designed to render the lover utterly incapable of existing without it.",
      },
      timing_modifiers: {
        wood: {
          ko: "수십만 개의 넝쿨이 얽히고설켜 햇빛과 통로를 완벽히 차단합니다. 맹목적인 무리 지음과 광적인 동족 포식이 사회적 자아를 잠식합니다.",
          en: "Hundreds of thousands of vines intertwine, flawlessly blocking all sunlight and pathways. Blind herding and fanatic cannibalism submerge the social ego."
        },
        fire: {
          ko: "붉은 넝쿨이 스스로를 태워 찬란한 미학적 폭발을 이룹니다. 천재적인 표현욕구가 세상을 매혹시키지만 그 끝은 공허한 잿더미입니다.",
          en: "The crimson vines self-immolate to achieve a brilliant aesthetic explosion. Genius expression-urge seduces the world, but its finale is just a hollow pile of ashes."
        },
        earth: {
          ko: "바위마저 뚫고 들어가는 집요함이 콘크리트 성벽을 무너뜨립니다. 소름 끼치는 소유욕과 세속적 탐욕이 자아의 유연성을 독재적인 힘으로 바꿉니다.",
          en: "A tenacity that drills even through boulders crumbles concrete walls. Chilling possessiveness and worldly greed morph the ego's flexibility into dictatorial force."
        },
        metal: {
          ko: "은빛 가위에 넝쿨이 잘려나가며 날카로운 비명 속 피눈물을 흘립니다. 극심한 신경증과 가학적 통제 속에서 자아의 아름다움이 처절하게 찢어집니다.",
          en: "The vines are severed by silver shears, bleeding tears of blood to a sharp shriek. Under severe neurosis and sadistic control, the ego's beauty is violently torn apart."
        },
        water: {
          ko: "시꺼먼 오염수에 넝쿨이 녹아내리며 주변을 독으로 물들입니다. 깊은 우울과 파괴적 망상이 현실을 부패시킵니다.",
          en: "The vines melt down into pitch-black toxic water, dyeing the surroundings with venom. Profound depression and destructive delusions rot reality away."
        }
      }
    }
  },
  丙辰: {
    id: "byeong-jin",
    metadata: {
      kr_name: "병진(丙辰)",
      en_name: "Byeong-jin (Fire-Dragon)",
      element: "Fire-Earth",
      animal: "Dragon",
      nature_symbol: {
        ko: "대지를 태우는 폭룡의 노을",
        en: "The Crimson Dragon's Dusk",
      },
    },
    core_identity: {
      persona: {
        ko: "자비를 모르는 예언자",
        en: "The Merciless Prophet",
      },
      goth_punk_vibe: {
        ko: "거대한 붉은 비늘을 번뜩이며 습한 대지에 불을 뿜는 용. 태양이 저무는 핏빛 노을 속에서 웅장하면서도 서늘한 파멸의 그림자를 길게 드리웁니다.",
        en: "A dragon flashing massive crimson scales, breathing fire over the humid earth. Casts a grand yet chilling shadow of ruin across a blood-stained sunset.",
      },
      shadow_side: {
        ko: "세상을 자신이 원하는 영광의 무대로 만들고자 하는 과시욕, 그리고 이를 거부하는 자를 불태우는 변덕스러운 잔혹함",
        en: "An exhibitionism obsessed with transforming the world into its desired stage of glory, coupled with a capricious cruelty that scorches anyone who rejects it.",
      },
    },
    behavior_metrics: {
      drive: 85,
      empathy: 30,
      stability: 40,
      unpredictability: 75,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "오만하고 화려하게 비상하지만 그 아래에는 한 치의 동정도 없습니다. 목적을 달성하기 위해 타인을 화려한 불길 속의 장작으로 취급합니다.",
        en: "Tears into the air with arrogant grandiosity, but beneath it hides zero sympathy. Treats others precisely as firewood for a glorious blaze in order to achieve its goal.",
      },
      relationship: {
        ko: "연인을 자신의 화려한 후광으로 여깁니다. 완벽한 스포트라이트를 줄 수 있지만, 조금이라도 자신의 빛을 가리면 지옥의 나락으로 떨어뜨립니다.",
        en: "Regards the lover as its own glamorous halo. Capable of providing the ultimate spotlight, but drops them straight into hell the moment they obscure its light.",
      },
      timing_modifiers: {
        wood: {
          ko: "마른 숲이 폭룡의 연료가 되어 거대한 화염 폭풍으로 변합니다. 통제를 상실한 망상과 사이비적 영적 우월성이 세상을 잿더미로 강제개종시킵니다.",
          en: "A dry forest becomes fuel for the storm dragon, morphing into a colossal firestorm. Delusions devoid of control and cult-like spiritual superiority forcefully convert the world to ashes."
        },
        fire: {
          ko: "두 마리의 용이 천공을 가르며 타오르는 충돌을 일으킵니다. 모든 경쟁자를 섬멸하려는 끝없는 투쟁과 양인의 잔혹함이 도마 위에 오릅니다.",
          en: "Two dragons cleave the firmament, triggering a blazing collision. The endless struggle to annihilate all competitors and the sheer cruelty of Yangin hit the chopping block."
        },
        earth: {
          ko: "뜨거운 화염이 진흙 속으로 빨려 들어가 무거운 화산재로 타락합니다. 파괴적 식욕과 속물적 욕망이 용을 두꺼비로 추락시킵니다.",
          en: "Searing flames get vortexed into mud, degrading into heavy volcanic ash. Destructive appetites and snobbish cravings plunge the dragon down into a monstrous toad."
        },
        metal: {
          ko: "은빛 칼날들이 불타는 비늘에 부딪혀 산산조각 납니다. 기형적인 피의 이득 창출과 세속적 제국주의가 자아를 노예의 왕으로 만듭니다.",
          en: "Silver blades shatter into a million pieces upon striking the blazing scales. Deformed blood-profit creation and secular imperialism crown the ego the king of slaves."
        },
        water: {
          ko: "거대한 먹구름이 몰려와 폭염을 차갑게 짓밟습니다. 숨 막히는 사회적 강박과 질식의 형벌이 자아의 화려한 날개를 비참히 꺾어버립니다.",
          en: "A colossal dark thundercloud swarms in and coldly tramples the heatwave. Suffocating social OCD and the penalty of strangulation miserably snap the ego's glorious wings."
        }
      }
    }
  },
  丁巳: {
    id: "jeong-sa",
    metadata: {
      kr_name: "정사(丁巳)",
      en_name: "Jeong-sa (Fire-Snake)",
      element: "Fire-Fire",
      animal: "Snake",
      nature_symbol: {
        ko: "푸른 불꽃을 두른 코브라",
        en: "The Sapphire Viper",
      },
    },
    core_identity: {
      persona: {
        ko: "가장 치명적인 낭만주의자",
        en: "The Most Lethal Romantic",
      },
      goth_punk_vibe: {
        ko: "어둠 속에서 푸른 불꽃을 내뿜으며 고도로 응축된 독성을 머금은 한 마리 코브라. 가장 매혹적인 색채로 춤을 추지만, 스치는 순간 심장을 멎게 만듭니다.",
        en: "A cobra exhaling blue flames in the dark, laden with a highly concentrated toxin. Dances in the most seductive colors, yet stops your heart the microsecond it brushes past.",
      },
      shadow_side: {
        ko: "속으로는 누구도 믿지 않는 뼛속 깊은 외로움, 그리고 상처받기 전에 상대를 먼저 독살해버리는 지독한 의심과 공격성",
        en: "A bone-deep loneliness trusting absolutely no one on the inside, bound to a toxic suspicion and aggression that preemptively poisons the partner before getting hurt.",
      },
    },
    behavior_metrics: {
      drive: 80,
      empathy: 40,
      stability: 30,
      unpredictability: 90,
    },
    compatibility_tags: {
      ideal_partner: ["Mok-saeng-hwa", "To-saeng-geum"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "완벽하게 이타적인 척하며 접근하지만, 목표물의 모든 에너지를 집어삼켜 뼛조각으로 만드는 정교한 감정 포식자입니다.",
        en: "Approaches pretending to be perfectly altruistic, but plays the role of an intricate emotional predator that devours the target's entire energy, leaving only bone fragments.",
      },
      relationship: {
        ko: "영혼을 송두리째 요구하는 지독한 소유욕. 차가운 피를 데워줄 상대를 원하지만, 자신의 온도가 끓어오르는 순간 강박적으로 연인을 파괴합니다.",
        en: "A toxic possessiveness demanding the soul in its entirety. Craves a partner to warm its cold blood, but obsessively obliterates the lover the instant its own temperature starts to boil.",
      },
      timing_modifiers: {
        wood: {
          ko: "독을 품은 가시나무 숲이 뱀의 소굴을 이루어 세상과 완벽히 단절됩니다. 폐쇄적 망상과 비틀린 정당화가 영혼을 마비시킵니다.",
          en: "A toxic thorn-forest forms the viper's den, perfectly severing it from the world. Closed-loop delusions and twisted self-justification paralyze the soul."
        },
        fire: {
          ko: "수천 마리의 푸른 뱀이 불바다를 이루며 모든 것을 소각합니다. 고삐 풀린 경쟁심과 동족상잔의 비극이 오직 한 마리의 제왕만을 낳기 위해 살육을 벌입니다.",
          en: "Thousands of sapphire vipers forge a sea of fire, incinerating everything. Unbridled rivalry and the tragedy of cannibalism spark a slaughter merely to birth a single king."
        },
        earth: {
          ko: "뜨거운 용암 덩어리가 식으면서 모든 것을 딱딱하게 가둡니다. 계산된 허영과 집요한 재물에 대한 집착이 가장 화려한 감옥을 축조합니다.",
          en: "A boiling lump of lava cools, trapping everything inside it solid. Calculated vanity and obsessive attachment to wealth architect the most glamorous prison."
        },
        metal: {
          ko: "은빛 칼날 위에 기어다니는 불꽃 속에 몸이 찢깁니다. 피비린내 나는 소유욕과 황금에 대한 맹신이 뱀의 꼬리를 스스로 잘라내게 합니다.",
          en: "The body is torn upon silver blades crawling through the flames. A blood-soaked possessiveness and blind faith in gold force the viper to amputate its own tail."
        },
        water: {
          ko: "검고 무거운 진흙수들이 몰려와 불꽃을 사그라뜨립니다. 가혹한 운명의 억압과 처절한 신경쇠약이 가장 치명적인 포식자를 영원히 박제합니다.",
          en: "Black, heavy mud-waters swamp in to smother the flames. Severe destined oppression and a tragic nervous breakdown permanently taxidermy the most lethal predator."
        }
      }
    }
  },
  戊午: {
    id: "mu-o",
    metadata: {
      kr_name: "무오(戊午)",
      en_name: "Mu-o (Earth-Horse)",
      element: "Earth-Fire",
      animal: "Horse",
      nature_symbol: {
        ko: "불타는 대지의 침묵",
        en: "The Scorching Mesa",
      },
    },
    core_identity: {
      persona: {
        ko: "분노를 품은 활화산",
        en: "The Vengeful Mesa",
      },
      goth_punk_vibe: {
        ko: "겉으로는 거대하고 메마른 황무지처럼 보이나, 그 밑바닥에서는 엄청난 마그마가 끓어오르고 있는 무거운 위엄. 무자비한 고요함과 파멸적 열기의 공존입니다.",
        en: "Appears externally as a colossal, dry wasteland, but enormous magma boils at its absolute bottom-layer yielding heavy majesty. The coexistence of ruthless silence and catastrophic heat.",
      },
      shadow_side: {
        ko: "모든 것을 포용하는 듯하지만 실제로는 자신의 방식대로 세상을 태우고 굳혀버리려는 폭군적 인내심과 아집",
        en: "Appears to embrace all, yet actually harbors a tyrannical patience and stubbornness aiming to scorch the world and solidify it in its own way.",
      },
    },
    behavior_metrics: {
      drive: 80,
      empathy: 30,
      stability: 50,
      unpredictability: 60,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Mok-saeng-hwa"],
      caution_partner: ["Ja-o-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "돌처럼 굳건하게 자리를 지키다가, 누군가 자신의 신념이나 영역을 침범하면 순식간에 불기둥을 뿜어 무자비하게 징벌합니다.",
        en: "Stands guard identically to solid stone, but if anyone infringes on its belief or territory, it instantly spews a pillar of fire to mercilessly execute.",
      },
      relationship: {
        ko: "상대방을 자신의 거대한 영토 안에 귀속시킵니다. 숨이 턱 막히는 책임감을 강요받으며, 조금이라도 도망치려 하면 마그마가 되어 연인의 발목을 녹이고 가둬버립니다.",
        en: "Subjugates the partner into its colossal territory. Forces a suffocating sense of duty; attempt to flee even slightly, and it turns into magma to melt the lover's ankles and trap them.",
      },
      timing_modifiers: {
        wood: {
          ko: "메마른 산에 검은 나무 군락이 창을 찌르듯 파고듭니다. 숨통 조이는 지배 체제와 폭압적 권력(관성)이 자아의 혈관을 터뜨립니다.",
          en: "A cluster of black trees pierces the dry mountain like spears. A suffocating regime of dominance and tyrannical power burst the ego's blood vessels."
        },
        fire: {
          ko: "마그마가 분출하여 대지가 끝없는 용암의 제국으로 변모합니다. 통제 불능의 독단주의와 비뚤어진 자아폭발(인성)이 세상을 영원한 심판에 처하게 합니다.",
          en: "Magma erupts, transmuting the earth into an endless empire of lava. Uncontrollable dogmatism and twisted ego-detonation condemn the world to an eternal judgment."
        },
        earth: {
          ko: "비정상적으로 융기하는 대지가 태양마저 가려버리는 산맥이 됩니다. 끝없는 고립과 누구와도 타협하지 않는 병적인 오만함(비겁)이 자아를 가둡니다.",
          en: "Abnormally rising terrain becomes a mountain range that eclipses even the sun. Endless isolation and a morbid arrogance that refuses compromise trap the ego entirely."
        },
        metal: {
          ko: "용암 속에서 거대한 강철의 가시들이 솟아오릅니다. 한계를 넘어선 비정한 지능과 독설적인 살기(식상)가 다가오는 모든 자를 능지처참합니다.",
          en: "Enormous spikes of steel pierce upward from the lava. Rebellious intellect pushed past limits and venomous bloodlust drawn-and-quarter anyone approaching."
        },
        water: {
          ko: "갑작스러운 거대 오수 해파가 활화산을 덮쳐 폭발시킵니다. 타락한 쾌락 탐닉과 끝없는 자본을 향한 갈증(재성)이 무적의 성채를 허물어 내립니다.",
          en: "A sudden massive pulse of corrupted wastewater swarms the active volcano, detonating it. Slumming in degenerate pleasure and endless thirst for capital crumble the invincible citadel."
        }
      }
    }
  },
  己未: {
    id: "gi-mi",
    metadata: {
      kr_name: "기미(己未)",
      en_name: "Gi-mi (Earth-Sheep)",
      element: "Earth-Earth",
      animal: "Sheep",
      nature_symbol: {
        ko: "마르지 않는 열망의 황무지",
        en: "The Arid Sanctuary",
      },
    },
    core_identity: {
      persona: {
        ko: "침묵하는 사막의 지배자",
        en: "The Silent Desert Lord",
      },
      goth_punk_vibe: {
        ko: "온기가 완전히 증발한 건조하고 거친 황무지. 그 끝없는 모래 폭풍 속에서 누구도 감히 불만을 제기하지 못하는 무거운 위엄과 지독한 인내심입니다.",
        en: "A dry, rough wasteland where all warmth has evaporated. A heavy majesty and brutal patience within an endless sandstorm where no one dares utter a complaint.",
      },
      shadow_side: {
        ko: "의심하고 또 의심하여 마침내 주변의 모든 생명력을 메마르게 하는 극단적인 방어기제와 고집",
        en: "An extreme defense mechanism and stubborness that doubts and doubts again, until it ultimately dries up all surrounding vitality.",
      },
    },
    behavior_metrics: {
      drive: 70,
      empathy: 30,
      stability: 85,
      unpredictability: 35,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Hwa-saeng-to"],
      caution_partner: ["Chuk-mi-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "마음의 문을 이중 삼중으로 잠가두고 타인을 철저히 검열합니다. 일단 내 편이 되면 끝까지 책임지지만, 배신은 곧 사회적 매장으로 응징합니다.",
        en: "Double and triple locks the doors of its heart, strictly censoring others. Takes ultimate responsibility once you're on its side, but punishes betrayal with immediate social burial.",
      },
      relationship: {
        ko: "안정적이고 견고한 성을 쌓아 연인을 완벽하게 보호하려 합니다. 그러나 창문 하나 없는 그 철통 보안이 숨 막히는 감옥이 되어버립니다.",
        en: "Builds a stable, solid castle to perfectly protect the lover. Yet that airtight security, lacking even a single window, quickly becomes a suffocating prison.",
      },
      timing_modifiers: {
        wood: {
          ko: "거친 시든 뿌리들이 황무지를 끝도 없이 파고들어 대지를 쪼갭니다. 지독한 억압과 자기검열이 영혼을 질식시킵니다.",
          en: "Rough, withered roots endlessly dig into the wasteland, splitting the earth. Toxic oppression and self-censorship suffocate the soul."
        },
        fire: {
          ko: "태양마저 빛을 잃을 듯한 지독한 열사병의 기운이 피어오릅니다. 비상식적인 강박증과 이기주의가 모래성을 끝없는 열지옥으로 바꿉니다.",
          en: "The aura of a toxic heatstroke rises, almost causing the sun to lose its light. Irrational OCD and egoism turn the sandcastle into an infinite inferno."
        },
        earth: {
          ko: "엄청난 모래 폭풍이 태양빛을 완벽하게 가려 세상이 밤처럼 변합니다. 맹목적인 아집과 지독한 배타적인 지배권이 자아를 영구 격리합니다.",
          en: "An immense sandstorm perfectly blocks the sunlight, turning the world into night. Blind stubbornness and a toxically exclusive dominion permanently quarantine the ego."
        },
        metal: {
          ko: "모래 속에 파묻혀 있던 은빛 칼날들이 무자비하게 솟아납니다. 숨겨둔 냉혹함과 날카로운 단절이 모든 관계를 베어버립니다.",
          en: "Silver blades buried in the sand ruthlessly erupt upward. Hidden ruthlessness and sharp severance slash all relationships."
        },
        water: {
          ko: "오염된 검은 비가 내려 황무지를 늪으로 부패시킵니다. 왜곡된 소유욕과 추악한 물질주의가 오만을 썩어 문드러지게 합니다.",
          en: "Contaminated black rain falls, rotting the wasteland into a swamp. Warped possessiveness and ugly materialism cause its arrogance to rot away."
        }
      }
    }
  },
  庚申: {
    id: "gyeong-shin",
    metadata: {
      kr_name: "경신(庚申)",
      en_name: "Gyeong-shin (Metal-Monkey)",
      element: "Metal-Metal",
      animal: "Monkey",
      nature_symbol: {
        ko: "달빛을 머금은 차가운 강철",
        en: "The Silver Gale",
      },
    },
    core_identity: {
      persona: {
        ko: "피를 묻히지 않는 학살자",
        en: "The Bloodless Executioner",
      },
      goth_punk_vibe: {
        ko: "자비 한 점 없는 차가운 달빛 아래 빛나는 압도적인 거대한 강철검. 불순물을 단 1%도 허용하지 않는 절대적인 순수함이자 파괴적인 결벽입니다.",
        en: "An overwhelming massive steel sword shining under a merciless cold moonlight. An absolute purity that tolerates exactly 0% impurity, manifesting as a destructive mysophobia.",
      },
      shadow_side: {
        ko: "스스로를 신의 대리인처럼 여기며, 자신의 기준에 맞지 않는 열등한 것들을 기계적으로 베어버리는 소시오패스적 단호함",
        en: "Views itself as a proxy of god, wielding a sociopathic decisiveness that mechanically severs anything inferior that fails to meet its standard.",
      },
    },
    behavior_metrics: {
      drive: 85,
      empathy: 10,
      stability: 70,
      unpredictability: 60,
    },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su", "To-saeng-geum"],
      caution_partner: ["In-shin-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "가장 날카롭고 단단한 의지를 지녔습니다. 타협과 잡담을 경멸하며, 목표를 향해 나아갈 때 거슬리는 것들은 무표정하게 도륙하고 전진합니다.",
        en: "Possesses the sharpest and hardest will. Despises compromise and small talk, marching forward while deadpan-slaughtering anything that gets in the way of the objective.",
      },
      relationship: {
        ko: "연인에게조차 완벽한 칼날의 각도를 강요합니다. 기준치를 아주 조금이라도 넘어서면 망설임 없이 관계를 베어버리는 얼음 같은 사랑입니다.",
        en: "Forces the exact angle of a perfect blade even onto the lover. An icy romance that severes the relationship without hesitation if the partner steps even slightly out of line.",
      },
      timing_modifiers: {
        wood: {
          ko: "강철 검에 휘감긴 거칠고 시든 넝쿨들이 피를 요구하며 자라납니다. 무자비한 이윤 추구와 재물에 대한 병적인 강박이 거대한 학살을 주도합니다.",
          en: "Rough, withered vines wrapping the steel sword grow, demanding blood. Ruthless profit-seeking and a morbid obsession with wealth lead a massive slaughter."
        },
        fire: {
          ko: "백색왜성처럼 폭발하는 불꽃이 차가운 검을 무자비하게 녹이려 듭니다. 사회적 폭압과 강박적인 규율이 완벽주의적 아집을 고문합니다.",
          en: "Flames exploding like a white dwarf ruthlessly attempt to melt the cold sword. Social tyranny and obsessive discipline violently torture its perfectionist stubbornness."
        },
        earth: {
          ko: "무거운 진흙 무더기가 강철 위로 쏟아져 빛나는 광채를 시꺼멓게 묻어버립니다. 왜곡된 은둔과 폐쇄적 사고가 자아를 완전히 매장시킵니다.",
          en: "Heavy mounds of mud crash onto the steel, burying its shining brilliance in pitch black. Warped reclusion and closed-mindedness completely bury the ego."
        },
        metal: {
          ko: "수백 개의 검이 복제되어 허공에서 일제히 떨어져 내립니다. 브레이크가 파괴된 극단주의와 무자비한 배타성이 모두를 피로 물들입니다.",
          en: "Hundreds of cloned swords fall simultaneously from the void. Extremism without brakes and ruthless xenophobia dye everyone in blood."
        },
        water: {
          ko: "시꺼먼 산성 오수가 쏟아져 빛나는 검을 서서히 부식시킵니다. 타락한 지식과 통제력을 상실한 표현욕구가 검신의 순수함을 썩게 만듭니다.",
          en: "Pitch-black toxic acid pours down, slowly corroding the shining sword. Corrupted knowledge and expression-lust out of control rot the blade's purity."
        }
      }
    }
  },
  辛酉: {
    id: "shin-yu",
    metadata: {
      kr_name: "신유(辛酉)",
      en_name: "Shin-yu (Metal-Rooster)",
      element: "Metal-Metal",
      animal: "Rooster",
      nature_symbol: {
        ko: "대지 아래 잠든 태고의 보석",
        en: "The Crystallized Edge",
      },
    },
    core_identity: {
      persona: {
        ko: "피로 세공된 다이아몬드",
        en: "The Blood-Cut Diamond",
      },
      goth_punk_vibe: {
        ko: "어두운 동굴 깊은 곳에서 스스로 뿜어내는 서늘한 광채의 다이아몬드 칼날. 손이 베이는 줄도 모를 만큼 정교하고 아름다운 치명상입니다.",
        en: "A diamond blade radiating a chilling brilliance on its own in the depths of a dark cave. A beautiful fatal wound so precise you don't even realize your hand was sliced.",
      },
      shadow_side: {
        ko: "흠집 하나 없는 완벽한 자신의 미학을 위해 주변의 불완전한 모든 것을 수술대에 올려놓고 조각내는 사디스틱한 검열",
        en: "A sadistic censorship that places all imperfect surroundings on the operating table to be carved apart, entirely for the sake of its own flawless aesthetic.",
      },
    },
    behavior_metrics: {
      drive: 70,
      empathy: 15,
      stability: 80,
      unpredictability: 35,
    },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su", "To-saeng-geum"],
      caution_partner: ["Myo-yu-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "신랄함과 예리함의 극치. 감성을 완벽히 배제한 논리로 타인의 가장 아픈 곳을 찾아내 정확하게 도려냅니다. 오류를 결코 용서하지 않습니다.",
        en: "The epitome of acerbity and sharpness. Uses logic entirely devoid of emotion to locate and precisely excise the most painful spot of another. Inherently unforgiving of errors.",
      },
      relationship: {
        ko: "유리장 속에 보관하는 차갑고 완벽한 소유물로서의 연인을 원합니다. 지문이나 먼지가 묻는 순간, 아름다운 조각품은 산산조각 납니다.",
        en: "Desires the lover as a cold, perfect possession kept in a glass showcase. The exact moment a fingerprint or speck of dust appears, the beautiful sculpture is shattered.",
      },
      timing_modifiers: {
        wood: {
          ko: "수만 가닥의 은빛 실이 탐욕스럽게 영토를 잠식하며 모든 것을 베어냅니다. 기형적으로 팽창한 물신주의가 미학의 끝을 타락시킵니다.",
          en: "Tens of thousands of silver threads greedily encroach on the territory, slicing everything. Grotesquely expanded materialism corrupts the edge of aesthetic."
        },
        fire: {
          ko: "다이아몬드가 용암의 바다를 만나 기괴하게 일그러지기 시작합니다. 사회적 잣대와 무자비한 억압이 자아의 숨통을 영원히 막아버립니다.",
          en: "The diamond meets a sea of lava, beginning to violently contort. Societal yardsticks and ruthless oppression permanently seal the ego's windpipe."
        },
        earth: {
          ko: "깊고 검은 진흙 수렁이 보석의 빛을 집어삼켜버립니다. 폐쇄형 자폐 증세와 고착된 아집 속에 완전히 매장된 고독입니다.",
          en: "A deep, black mud swamp completely swallows the gem's light. An isolation entirely buried within closed-loop autistic tendencies and ossified stubbornness."
        },
        metal: {
          ko: "수백만 개의 얼음 조각이 공명을 일으키며 모든 소리를 찢어냅니다. 타락한 우월감과 피의 엘리트주의가 광신적인 살육극을 벌입니다.",
          en: "Millions of ice shards resonate, tearing apart all sound. Corrupted superiority and blood-elitism stage a fanatical massacre."
        },
        water: {
          ko: "칠흑 같은 독기 어린 심해수가 보석마저 부식시키기 시작합니다. 방종한 퇴폐주의와 파괴적 표현이 수정 같은 자아를 오염수로 바꿉니다.",
          en: "Pitch-black toxic abyssal water begins to corrode even the gem. Indulgent decadence and destructive expression mutate the crystalline ego into toxic sewage."
        }
      }
    }
  },
  壬戌: {
    id: "im-sul",
    metadata: {
      kr_name: "임술(壬戌)",
      en_name: "Im-sul (Water-Dog)",
      element: "Water-Earth",
      animal: "Dog",
      nature_symbol: {
        ko: "모든 것이 소멸하는 검은 지평선",
        en: "The Abyssal Eclipse",
      },
    },
    core_identity: {
      persona: {
        ko: "세상의 끝에서 기다리는 감시자",
        en: "Watcher at the World's End",
      },
      goth_punk_vibe: {
        ko: "모든 빛과 소음이 사라진 후 거대한 댐으로 막혀버린 끝을 알 수 없는 검은 파도. 그 무거운 고요 속에서 언제 터질지 모르는 파괴적인 살기가 잠겨있습니다.",
        en: "A pitch-black wave of unknown depths blocked by a massive dam after all light and noise vanish. A destructive bloodlust is kept submerged in that heavy silence, threatening to detonate at any moment.",
      },
      shadow_side: {
        ko: "거대한 댐 뒤에서 조용히 자신의 분노를 증식시키며, 한 번에 세상을 수몰시켜 모든 것을 무(無)로 돌리고자 하는 파멸의 욕구",
        en: "Quietly multiplying its fury behind the massive dam, harboring an apocalyptic urge to submerge the entire world at once and return everything to the Void.",
      },
    },
    behavior_metrics: {
      drive: 75,
      empathy: 30,
      stability: 40,
      unpredictability: 85,
    },
    compatibility_tags: {
      ideal_partner: ["To-saeng-geum", "Geum-saeng-su"],
      caution_partner: ["Jin-sul-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "괴강과 백호를 품은 검은 바다. 겉으로는 조용하고 지혜로워 보이나, 심기를 건드리면 댐을 부수고 쓰나미를 일으켜 흔적도 없이 쓸어내립니다.",
        en: "A black sea harboring Gwaegang and Baekho. Appears quiet and wise on the surface, but touch its nerve and it shatters the dam, triggering a tsunami that sweeps away everything without a trace.",
      },
      relationship: {
        ko: "상대방의 마음을 완전히 흡수하여 지배하는 감정의 블랙홀. 자신의 소유가 되지 않으면, 익사시키듯 상대를 깊은 우울 속으로 파묻습니다.",
        en: "An emotional black hole that entirely absorbs and dominates the partner's heart. If the lover cannot be possessed, it buries them in a deep depression, akin to drowning.",
      },
      timing_modifiers: {
        wood: {
          ko: "검은 바다 한가운데서 피를 빨아먹는 거대한 식충나무가 뿌리를 뻗습니다. 브레이크가 망가진 표현욕구와 광기가 스스로를 무너뜨립니다.",
          en: "A colossal blood-sucking carnivorous tree extends its roots in the center of the black sea. An expression-urge with shattered brakes and sheer madness cause it to self-destruct."
        },
        fire: {
          ko: "칠흑 같은 수면 위로 지옥불과 같은 거대한 화염이 끓어오릅니다. 가학적인 황금만능주의와 끝이 보이지 않는 재물에 대한 집착이 심연을 더럽힙니다.",
          en: "Hellfire-like massive flames boil over the pitch-black water surface. Sadistic gold-almightiness and an endless obsession with wealth taint the abyss."
        },
        earth: {
          ko: "수백만 톤의 날카로운 암석들이 떨어져 내려 댐을 막아버립니다. 끔찍한 강박적 편집증과 살인적인 사회적 억압이 자아를 생매장합니다.",
          en: "Millions of tons of sharp rock crash down to physically plug the dam. Horrific compulsive paranoia and murderous social suppression bury the ego alive."
        },
        metal: {
          ko: "날카로운 은빛 폭풍이 심해의 가장 깊은 곳을 난도질합니다. 폐쇄적인 우월주의적 지식 추구와 광신적 맹신이 자아를 타락시킵니다.",
          en: "A sharp silver storm mutilates the deepest trenches of the abyss. Closed supremacist knowledge-seeking and blind fanaticism corrupt the ego."
        },
        water: {
          ko: "모든 것을 흡수하는 거대한 블랙홀이 바다 자체를 빨아들입니다. 동족을 향한 기괴한 의심과 폭주하는 지배욕이 스스로를 영원한 암흑에 가둡니다.",
          en: "A colossal black hole that absorbs everything begins to suck in the sea itself. Bizarre suspicion toward its own kind and rampaging lust for dominion lock it in eternal darkness."
        }
      }
    }
  },
  癸亥: {
    id: "gye-hae",
    metadata: {
      kr_name: "계해(癸亥)",
      en_name: "Gye-hae (Water-Pig)",
      element: "Water-Water",
      animal: "Pig",
      nature_symbol: {
        ko: "모든 빛을 삼키는 우주",
        en: "The Final Horizon",
      },
    },
    core_identity: {
      persona: {
        ko: "가장 고요한 종말",
        en: "The Quietest Apocalypse",
      },
      goth_punk_vibe: {
        ko: "60갑자의 긴 여정이 도달한 빛의 무덤. 수만 년의 세월을 응축한 가장 무겁고 차가운 검은 물이며, 우주가 숨을 멎는 절대 영도의 침묵입니다.",
        en: "The tomb of light reached at the long journey's end of the 60 Iljus. The heaviest, coldest black water condensing tens of thousands of years, embodying the absolute zero silence when the universe holds its breath.",
      },
      shadow_side: {
        ko: "빛나는 모든 것을 혐오하며, 타인의 모든 개성과 열정을 자신의 차가운 심연 밑바닥으로 가라앉혀 똑같은 검은색으로 물들이려는 치명적 공허감",
        en: "A fatal emptiness that loathes all things shiny, seeking to sink others' passions and individualities to the bottom of its cold abyss to dye everything in identically pitched black.",
      },
    },
    behavior_metrics: {
      drive: 50,
      empathy: 80,
      stability: 20,
      unpredictability: 95,
    },
    compatibility_tags: {
      ideal_partner: ["Geum-saeng-su", "Mok-saeng-hwa"],
      caution_partner: ["Sae-hae-chung"],
    },
    narrative_blocks: {
      default: {
        ko: "가장 똑똑하면서도 동시에 가장 허탈을 잘 느낍니다. 모든 것을 투시하는 지혜 덕분에 오히려 시작도 하기 전에 결말을 단정 짓고는 서늘하게 방관합니다.",
        en: "Possesses prime intelligence yet feels utter futility the quickest. Thanks to clairvoyant wisdom, it statically judges the ending before even starting, chillingly observing as a bystander.",
      },
      relationship: {
        ko: "경계선이 존재하지 않는 사랑. 내 것과 네 것, 빛과 어둠의 구분 없이 상대를 완전히 통째로 흡수해버리는 끔찍하고도 절대적인 정신적 융합입니다.",
        en: "Love completely devoid of boundaries. A horrific yet absolute psychological fusion that totally absorbs the partner without distinction of yours, mine, light, or dark.",
      },
      timing_modifiers: {
        wood: {
          ko: "우주의 끝자락에서 피와 살을 요구하는 거대한 나무가 자라납니다. 우울 속에서 기형적으로 뻗어나간 잔혹한 파괴욕이 세상을 부식시킵니다.",
          en: "A colossal tree demanding flesh and blood sprouts at the edge of the universe. A cruel destructive urge stretching grotesquely from within depression corrodes the world."
        },
        fire: {
          ko: "검은 물 위로 죽어가는 별빛의 연기가 기괴하게 피어납니다. 지독한 쾌락 탐닉과 자본에 대한 타락한 망상이 무덤을 가장 화려한 지옥으로 꾸밉니다.",
          en: "The ghost smoke of dying starlight blooms bizarrely over the black water. Toxic pleasure-slumming and corrupted delusions of capital decorate the tomb into the most glamorous hell."
        },
        earth: {
          ko: "수백만 톤의 얼어붙은 흙이 우주를 막아버리며 영원한 닫힘을 선고합니다. 압제적 폭군과 극심한 폐쇄 공포가 지혜의 끝을 돌무덤으로 만듭니다.",
          en: "Millions of tons of frozen dirt seal off the universe, sentencing an eternal closure. A tyrannical overlord and extreme claustrophobia turn the finale of wisdom into a stone crypt."
        },
        metal: {
          ko: "수십만 개의 부서진 뼛조각들이 검은 물속에서 서늘하게 진동합니다. 광신적인 고립주의와 왜곡된 현학적 태도가 자아를 얼음 고문 속으로 밀어 넣습니다.",
          en: "Hundreds of thousands of shattered bone fragments vibrate chillingly in the black water. Fanatic isolationism and warped pedantry physically force the ego into an ice torture."
        },
        water: {
          ko: "차원을 찢어발기는 거대한 해일이 몰려와 남은 단 하나의 불씨마저 삼켜버립니다. 완벽한 허무의 도래, 60갑자의 최종 포맷이자 가장 어두운 영원입니다.",
          en: "A massive tsunami that rips apart dimensions floods in to swallow the single remaining ember. The arrival of optimal nihilism; the final format of the 60 Ilju and the darkest eternity."
        }
      }
    }
  }
};

export const getIljuData = (stem?: string, branch?: string): any => {
  if (!stem || !branch) return null;
  return ILJU_DATASET[stem + branch] || null;
};
