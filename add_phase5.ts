import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('phase5_dump.json', 'utf8'));

const updates = {
  "甲辰": {
    "metadata": {
      "kr_name": "갑진(甲辰)",
      "en_name": "Gap-jin (Wood-Dragon)",
      "element": "Wood-Earth",
      "animal": "Dragon",
      "nature_symbol": { "ko": "비옥한 진흙탕 속에 똬리를 튼 푸른 용", "en": "Blue Dragon in the Mud" }
    },
    ...rawData["甲辰"],
    "core_identity": {
      "persona": { "ko": "진흙탕의 지배자", "en": "Swamp Sovereign" },
      "goth_punk_vibe": {
        "ko": "질척이는 늪지대에 거대한 뿌리를 내리고 모든 생명과 자본을 집어삼키며 비상하려는 포식자",
        "en": "A massive root system submerged in a corrosive swamp. An absolute predator absorbing all surrounding life and capital, preparing for a devastating ascent."
      },
      "shadow_side": {
        "ko": "내가 세워둔 거대한 왕국이 언제 무너질지 모른다는 극도의 피해망상에 시달리는 폭군의 불안",
        "en": "The paranoid terror of a tyrant bleeding out on a throne, fearing the swamp they conquered will inevitably rot their own foundations."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "어떤 혼탁한 진흙 속에서도 자양분을 기어코 빨아들이고 판을 지배하려는 끔찍한 성취욕을 가졌습니다.",
        "en": "Executing an atrocious, brutal ambition to extract nourishment from the most toxic mud, commanding the board at all costs."
      },
      "relationship": {
        "ko": "내 울타리 안의 파트너는 철저히 통제되며 지켜지지만, 반기를 드는 순간 진흙탕 속에 수장시켜 버립니다.",
        "en": "Partners within your perimeter are ferociously defended yet strictly controlled. Revolt, and they are hopelessly drowned in the dark swamp."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "숲이 미친 듯이 뿌리를 뻗어 늪을 완전히 잠식합니다. 끝없이 복제되는 경쟁심과 소유욕(비겁)이 수면을 질식시킵니다.",
          "en": "The forest viciously invades, completely dominating the bog. Endlessly replicating rivalry and possessive ego suffocate the horizon."
        },
        "fire": {
          "ko": "햇살이 늪을 강렬하게 증발시킵니다. 억눌렸던 폭발적인 역량과 천재성(식상)이 잔혹할 만큼 매력적으로 세상에 노출됩니다.",
          "en": "Intense sunlight forcefully evaporates the mire. Long-suppressed explosive talent acts like a blinding flash, fascinating but searing all witnesses."
        },
        "earth": {
          "ko": "거대한 산사태가 늪을 막아버립니다. 더 많은 영토(재성)를 원하지만 욕망의 늪에 스스로 갇혀 생명력을 잃는 모순에 빠집니다.",
          "en": "A massive landslide dams the swamp. Blinded by territorial lust, you trap yourself in your own quagmire, draining your vital core."
        },
        "metal": {
          "ko": "차갑고 거대한 강철의 창이 숲을 도려냅니다. 강압적인 시스템과 억의(관성) 속에서 지옥 같은 수치심을 맛보며 신경이 찢깁니다.",
          "en": "A colossal titanium spear gouges the earth. Pinned by draconian systemic pressure, you suffer immense humiliation and shredded nerves."
        },
        "water": {
          "ko": "끝을 알 수 없는 흙비가 비옥한 숲을 범람시킵니다. 왜곡된 지식과 오컬트(인성)에 중독되어 현실 통제력을 잃고 방황합니다.",
          "en": "An endless mud rain floods the lush woods. Becoming addicted to poisoned knowledge and dark philosophies, you lose total grip on reality."
        }
      }
    }
  },
  "乙巳": {
    "metadata": {
      "kr_name": "을사(乙巳)",
      "en_name": "Eul-sa (Wood-Snake)",
      "element": "Wood-Fire",
      "animal": "Snake",
      "nature_symbol": { "ko": "붉은 화염 속에 핀 푸른 독초", "en": "Blue Venom in the Flame" }
    },
    ...rawData["乙巳"],
    "core_identity": {
      "persona": { "ko": "화염의 무희", "en": "Flame Dancer" },
      "goth_punk_vibe": {
        "ko": "모든 것을 태워버리는 뜨거운 불길 한가운데서 타죽지 않고 오히려 화려하게 유혹의 독을 내뿜는 덩굴",
        "en": "A wild toxic vine refusing to burn in a roaring inferno, instead spitting blindingly beautiful, hallucinogenic venom through the heat."
      },
      "shadow_side": {
        "ko": "자신의 외로움과 공허함을 숨기기 위해 미친 듯이 감각적 쾌락에 탐닉하며 스스로를 재로 만드는 도피성",
        "en": "Hiding deep abyssal isolation by frantically indulging in sensory overload, escaping reality while burning yourself out to cinders."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "지독한 환경일수록 더욱 매혹적으로 피어나는, 가장 위태롭고 치명적인 서바이벌 아티스트입니다.",
        "en": "The ultimate high-wire survival artist. You bloom most seductively in the most terrifyingly hostile environments."
      },
      "relationship": {
        "ko": "지루함을 견디지 못하고 도발적인 매력으로 상대를 태우다가도, 감정이 식는 순간 뱀처럼 매정하게 독을 뱉고 뒤돌아섭니다.",
        "en": "You burn partners with provocative allure to cure your profound boredom. Once the flame flickers, you spit venom without a backward glance."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "밀림이 불길로 번져갑니다. 통제할 수 없는 과시욕과 오만(비겁)이 자아를 삼켜버리며 눈먼 폭주를 감행합니다.",
          "en": "The jungle accelerates the inferno. Uncontrollable narcissism and ostentatious urges hijack your ego, leading a blind, devastating rampage."
        },
        "fire": {
          "ko": "거대한 산불이 대륙 전체를 태웁니다. 발산의 욕구(식상)가 극에 달해, 매혹적인 광기로 예술적 절정에 이르나 모든 것이 타버릴 위험이 있습니다.",
          "en": "A mega-fire consumes the continent. The expressive drive detonates into mesmerizing madness, achieving artistic climax at the cost of total burn-out."
        },
        "earth": {
          "ko": "화산재가 모래폭풍을 부릅니다. 맹목적인 돈과 쾌락(재성)을 추구하다 덫에 빠져, 탈출 불가한 어둠 속에 스스로를 가둡니다.",
          "en": "Volcanic ash summons a sandstorm. Blindly chasing after extreme wealth and pleasure trips a deadly snare, locking you in absolute darkness."
        },
        "metal": {
          "ko": "은빛 가위가 불타는 덩굴을 잘라냅니다. 끔찍한 사회적 억압과 고통(관성) 속에서 히스테릭한 날카로움이 뼈저리게 극대화됩니다.",
          "en": "Silver shears ruthlessly sever the flaming vine. Under severe societal strangulation, your hysterical sharpness is agonizingly amplified."
        },
        "water": {
          "ko": "깊고 어두운 소나기가 불길을 위협합니다. 우울한 깊이와 철학(인성)이 더해져 당신의 퇴폐적인 오라를 한층 소름 돋게 완성합니다.",
          "en": "A dark downpour violently threatens the flames. Tragic depths and profound depression elevate your decadent, chilling aura to perfection."
        }
      }
    }
  },
  "丙午": {
    "metadata": {
      "kr_name": "병오(丙午)",
      "en_name": "Byeong-o (Fire-Horse)",
      "element": "Fire-Fire",
      "animal": "Horse",
      "nature_symbol": { "ko": "만물을 태우는 정오의 태양 폭풍", "en": "Solar Storm at High Noon" }
    },
    ...rawData["丙午"],
    "core_identity": {
      "persona": { "ko": "절대적 파괴자", "en": "Absolute Scorcher" },
      "goth_punk_vibe": {
        "ko": "한 치의 물기도 남기지 않는 거대한 흑점의 폭발. 오직 자신만이 세상의 중심이 되어야 하는 압도적이고 눈먼 광휘",
        "en": "An apocalyptic solar flare evaporating every last drop of moisture. An overwhelmingly blind, ego-centric brilliance demanding absolute center stage."
      },
      "shadow_side": {
        "ko": "제어 장치 없이 고도를 높이다 결국 자신의 불길에 가장 먼저 눈이 멀고 타죽어버리는 극단적 파멸",
        "en": "Ascending violently without a parachute. You inevitably go blind from your own solar intensity before burning into complete, catastrophic oblivion."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "그 어떤 장애물이나 한계선도 태워버리며 돌진합니다. 압도적인 카리스마로 주변을 복종시키거나 초토화시키는 절대 권력자입니다.",
        "en": "Obliterating limits and barriers as you charge forward. A tyrant wielding sheer, terrifying charisma to force systemic submission or scorched-earth ruin."
      },
      "relationship": {
        "ko": "상대를 전부 바싹 말려버릴 듯한 지독한 갈증으로 소유하려 들며, 거역하는 순간 가장 잔인한 재투성이로 만들어버립니다.",
        "en": "Possessing partners with a violent, dehydrating thirst. The moment they resist the glare, you reduce their entire world to an ash heap."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "끝없는 장작이 쏟아져 광활한 산불을 일으킵니다. 지식과 영감(인성)이 파괴력을 수백 배로 증폭시켜 신에 가까운 오만을 부릅니다.",
          "en": "Endless fuel triggers an apocalyptic wildfire. Arcane wisdom magnifies your destructiveness a hundredfold, summoning god-level arrogance."
        },
        "fire": {
          "ko": "두 개의 태양이 충돌하며 대기를 찢어버립니다. 극단적인 나르시시즘과 공격성(비겁)이 폭주하여 적과 아군 모두를 산화시킵니다.",
          "en": "Twin suns collide, ripping the atmosphere to shreds. Extreme narcissistic aggression detonates, vaporizing both your enemies and your allies."
        },
        "earth": {
          "ko": "거대한 화산재가 태양마저 등지게 만듭니다. 폭발적인 재능(식상)이 묵직한 구속복에 묶여, 비관적인 감옥 속으로 침전합니다.",
          "en": "Immense volcanic ash eclipses the sun entirely. Your nuclear capability is thrust into a heavy straitjacket, isolating you inside a pessimistic jail."
        },
        "metal": {
          "ko": "백색의 은맥이 태양빛을 칼날로 반사합니다. 무자비한 목표지향성과 물욕(재성)이 가장 차갑고 잔인하게 당신을 피도 눈물도 없는 기계로 조작합니다.",
          "en": "White silver veins turn the sunbeams into razor blades. A merciless hunger for dominance and wealth neuro-hacks you into an unfeeling cyborg."
        },
        "water": {
          "ko": "칠흑 같은 태풍이 들이닥쳐 태양과 정면충돌합니다. 절대군주를 억압하려는 무서운 압박(관성) 속에서 미칠 듯한 전쟁이 시작됩니다.",
          "en": "A pitch-black typhoon crashes head-on with the sun. Pinned by terrifying institutional suppression, a horrific, reality-bending war commences."
        }
      }
    }
  },
  "丁未": {
    "metadata": {
      "kr_name": "정미(丁未)",
      "en_name": "Jeong-mi (Fire-Sheep)",
      "element": "Fire-Earth",
      "animal": "Sheep",
      "nature_symbol": { "ko": "사막의 모래 폭풍 속에 숨은 붉은 불씨", "en": "Ember in the Sandstorm" }
    },
    ...rawData["丁未"],
    "core_identity": {
      "persona": { "ko": "갈증의 순례자", "en": "Thirsty Nomad" },
      "goth_punk_vibe": {
        "ko": "모든 것을 말려 죽일 듯한 열사의 사막에서 도무지 꺼지지 않고 집요하게 온기를 간직하며 번져가는 서늘한 열기",
        "en": "A persistently glowing ember resisting eradication in an agonizing, dehydrating desert storm. Radiating a chilling, unkillable heat."
      },
      "shadow_side": {
        "ko": "극한의 결핍과 건조함을 견디다 미쳐버릴 것 같은 우울, 그리고 자신을 해치면서까지 감각을 증명하려는 극단적 예민함",
        "en": "An agonizing depression born from immense deprivation, culminating in extreme hypersensitivity that drives you to self-harm just to feel alive."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "도저히 생존할 수 없는 척박함 속에서도 소름 돋게 정교한 직관력과 예술성을 유지하며 묘한 권력을 쥐는 이단아입니다.",
        "en": "Maintaining a chillingly precise intuition and dark aesthetic amidst absolute desolation, allowing you to quietly usurp bizarre pockets of power."
      },
      "relationship": {
        "ko": "물 한 방울 없는 나를 적셔주길 갈구하면서도, 누군가 내 영토에 들어오려 하면 의심의 모래바람으로 그들의 눈을 멀게 합니다.",
        "en": "You desperately crave a single drop of water, yet unleash blinding, paranoid sandstorms the moment anyone attempts to cross into your dry territory."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "바싹 마른 가시나무가 불씨를 거대하게 키웁니다. 편집증적인 학구열과 꼬인 생각(인성)이 불타오르며 자신만의 오컬트적인 성을 쌓습니다.",
          "en": "Bone-dry thorn trees inflate the ember into a towering blaze. Paranoid academic obsession incinerates reality, building your own occult castle."
        },
        "fire": {
          "ko": "사막에 수천 개의 불기둥이 치솟습니다. 폭주하는 투쟁심과 오만(비겁)이 수분을 완전히 증발시켜 관계의 아포칼립스를 맞이합니다.",
          "en": "Thousands of fire pillars pierce the wasteland. Runaway vanity and combative pride vaporize all remaining moisture in an apocalyptic relationship collapse."
        },
        "earth": {
          "ko": "모래 언덕이 불씨를 무겁게 짓누릅니다. 극단적인 자기표현과 반항심(식상)이 발동해 기괴한 방식의 저항 예술을 폭발시킵니다.",
          "en": "Heavy dunes crush the live ember. Extreme rebellious expressions detonate, releasing grotesque but utterly mesmerizing forms of resistance art."
        },
        "metal": {
          "ko": "서늘한 모래 속 무기들이 형체를 드러냅니다. 결핍을 채우려는 차가운 결단력(재성)이 발동해 가장 가학적이고 집요한 사냥을 시작합니다.",
          "en": "Chilling metallic weapons surface from the sand. Triggering ice-cold resolve to fill the void, you initiate a sadistically patient, lethal hunt."
        },
        "water": {
          "ko": "오랜 가뭄 끝에 끈적한 비가 내립니다. 외부의 폭력적인 통제(관성) 속에서 지독한 갈증이 해소되는 듯하지만, 이내 신경이 썩어드는 고통에 직면합니다.",
          "en": "Sticky, toxic rain falls after an endless drought. External violent controls seem to quench the thirst, but eventually rot your nerves from the inside."
        }
      }
    }
  },
  "戊申": {
    "metadata": {
      "kr_name": "무신(戊申)",
      "en_name": "Mu-sin (Earth-Monkey)",
      "element": "Earth-Metal",
      "animal": "Monkey",
      "nature_symbol": { "ko": "거대한 돌산 위를 가로지르는 철도", "en": "Iron Tracks on the Titan" }
    },
    ...rawData["戊申"],
    "core_identity": {
      "persona": { "ko": "바위 요새의 공학자", "en": "Titan Engineer" },
      "goth_punk_vibe": {
        "ko": "범접할 수 없는 거대한 암벽의 무게감과, 그 사이를 가장 빠르고 영악하게 파고드는 날이 선 금속성의 섬뜩한 조화",
        "en": "The terrifying gravity of an impenetrable rock face paired with the shrill, razor-sharp metallic tracks cutting through its isolated core."
      },
      "shadow_side": {
        "ko": "태산 같은 자만심을 바탕으로 타인을 도구로만 취급하다, 결국 아무도 접근할 수 없는 텅 빈 기지로 전락하는 고립",
        "en": "Operating out of titanic arrogance, treating everyone as disposable gears until you are left stranded in a completely empty, silent facility."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "흔들림 없는 산맥의 안정감 뒤에 누구보다 교묘하고 날카로운 계산이 돌아갑니다. 피도 눈물도 없이 실리를 베어 먹는 거수입니다.",
        "en": "Behind the unshakeable mountain facade hums a brilliantly cruel, calculating supercomputer. A behemoth reaping maximum profit without a single tear."
      },
      "relationship": {
        "ko": "상대를 거대한 요새에 보호하는 척하며 사실상 철저히 고립시키고, 쓸모가 사라지면 가차 없이 낭떠러지로 밀어버립니다.",
        "en": "You isolate partners inside your massive bunker disguised as protection. Once their utility expires, they are mercilessly thrown off the precipice."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "강철의 협곡을 뚫고 거대한 나무들이 공격적으로 솟아오릅니다. 지독하게 무거운 시련(관성) 속에서 살아남기 위한 잔혹한 방어기제가 작동합니다.",
          "en": "Massive trees aggressively puncture the titanium valley. Brutal oppression triggers a sadistic, unyielding defense mechanism to ensure survival."
        },
        "fire": {
          "ko": "돌산을 불길이 집어삼켜 철로를 녹입니다. 어둠에 갇힌 기괴한 사상(인성)이 발현되어 타협 없는 폭군으로 스스로를 세뇌시킵니다.",
          "en": "Flames swallow the rock face, melting the iron tracks. Trapped bizarre ideologies surface, brainwashing yourself into a tyrant immune to compromise."
        },
        "earth": {
          "ko": "지진이 발생해 돌산이 끝없이 비대해집니다. 통제할 수 없는 자만심장과 소유욕(비겁)이 모든 외부 채널을 닫고 세상을 적으로 돌립니다.",
          "en": "A quake radically expands the titan's mass. An uncontrollable swelling of ego violently shuts all external comms, framing the entire world as hostile."
        },
        "metal": {
          "ko": "수만 개의 날카로운 톱니바퀴들이 미친 듯이 공명합니다. 천재성과 뛰어난 처세술(식상)이 잔인할 정도로 날을 세워 적의 목을 노립니다.",
          "en": "Tens of thousands of razor gears resonate wildly. Genius reflexes and chilling manipulation sharpen to a lethal edge, directly targeting the enemy's throat."
        },
        "water": {
          "ko": "검은 계곡물이 철기둥을 부식시킵니다. 끝없는 재물의 확장(재성)에 휩쓸려 자아의 무게중심을 잃고 끝 모를 탐욕의 해저로 침몰합니다.",
          "en": "Black waters flood the valley, rapidly corroding the steel. Swept away by endless greedy expansion, you lose your gravitational core and sink entirely."
        }
      }
    }
  }
};

const finalObj = {};
for (const key of Object.keys(updates)) {
  finalObj[key] = { ...rawData[key], ...updates[key] };
  if (finalObj[key].narrative_blocks && finalObj[key].narrative_blocks.timing_modifier) {
    delete finalObj[key].narrative_blocks.timing_modifier;
  }
}
fs.writeFileSync('phase5_patch1.json', JSON.stringify(finalObj, null, 2));
