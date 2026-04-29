import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('phase6_dump.json', 'utf8'));

const updates = {
  "甲寅": {
    "metadata": {
      "kr_name": "갑인(甲寅)",
      "en_name": "Gap-in (Wood-Tiger)",
      "element": "Wood-Wood",
      "animal": "Tiger",
      "nature_symbol": { "ko": "태고의 밀림 속 가장 거대한 수호목", "en": "Ancient Guardian Tree" }
    },
    ...rawData["甲寅"],
    "core_identity": {
      "persona": { "ko": "태초의 지배자", "en": "Primal Sovereign" },
      "goth_punk_vibe": {
        "ko": "빛조차 들어오지 않는 검은 밀림의 한가운데서 모든 식생을 발밑에 거느린 묵직하고 폭압적인 고목",
        "en": "A massive, ancient tree towering over a sunless jungle. A heavy, oppressive monarch holding the entire ecosystem hostage beneath its roots."
      },
      "shadow_side": {
        "ko": "내가 숲의 법이자 진리라는 극단적 우월감 속에 어떤 타협도 거부하며 결국 모두를 부러뜨리는 독선",
        "en": "A god-complex demanding absolute ecological dominance. Refusing to bend the slightest inch, eventually snapping every branch in its own path."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "흔들림 없는 거대한 뿌리와 압도적인 기백(간여지동)으로, 환경의 저항을 부수며 제왕적 영토를 구축합니다.",
        "en": "Equipped with colossal roots and overwhelming force. You crush any environmental resistance to establish a pure, dictatorial empire."
      },
      "relationship": {
        "ko": "가장 거대하고 튼튼한 그늘을 내어주어 상대를 보호하지만, 나의 뿌리를 잘라내려는 독립은 무자비하게 짓밟아버립니다.",
        "en": "You provide the safest, thickest shade available, but ruthlessly stomp out any partner attempting to grow independently outside your root zone."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "밀림이 통제 불능으로 팽창해 모든 대지를 갈라놓습니다. 신앙심에 가까운 자만(비겁)이 극단화되어 전쟁을 부릅니다.",
          "en": "The jungle aggressively hyper-expands, tearing the earth apart. A cult-like arrogance pushes you to initiate an absolute, unyielding holy war."
        },
        "fire": {
          "ko": "거대한 나무가 산불의 진원지가 되어 대륙을 태웁니다. 발산의 욕구(식상)가 폭발하며 세상을 매혹적이고 치명적인 잿더미로 만듭니다.",
          "en": "The giant tree detonates as ground-zero for a continental wildfire. Explosive creative urges incinerate the landscape into a beautiful, lethal ash pile."
        },
        "earth": {
          "ko": "지진이 일어나 거목의 뿌리가 잔인하게 뜯겨 나갑니다. 통제할 수 없는 재물적 집착(재성)이 자신의 존재 기반마저 깎아냅니다.",
          "en": "An earthquake violently shreds the massive root system. Uncontrollable hoarding instincts brutally erode the very foundation keeping you alive."
        },
        "metal": {
          "ko": "하늘에서 날아든 거대한 은빛 도끼들이 고목을 내리찍습니다. 숨 막히는 시련(관성) 속에서 지옥 같은 수치와 자아 분열을 견뎌냅니다.",
          "en": "Massive silver axes drop from the sky. Under suffocating systemic torture, you endure hellish humiliation and a terrifying ego-split."
        },
        "water": {
          "ko": "폭우가 쏟아져 숲이 침수되고 썩어 들어갑니다. 지나친 철학적 망상(인성)과 우울감이 실천력을 마비시켜 스스로를 무덤에 가둡니다.",
          "en": "A monsoon floods and rots the canopy. Toxic over-thinking and melancholic delusions paralyze your drive, locking you in a damp, self-made grave."
        }
      }
    }
  },
  "乙卯": {
    "metadata": {
      "kr_name": "을묘(乙卯)",
      "en_name": "Eul-myo (Wood-Rabbit)",
      "element": "Wood-Wood",
      "animal": "Rabbit",
      "nature_symbol": { "ko": "어둠 속을 잠식하는 야생 독초", "en": "Proliferating Toxic Ivy" }
    },
    ...rawData["乙卯"],
    "core_identity": {
      "persona": { "ko": "은밀한 반역자", "en": "Shadow Mutineer" },
      "goth_punk_vibe": {
        "ko": "가장 여리고 부드러워 보이지만 잡초의 무서운 번식력으로 어느새 콘크리트 벽마저 완전히 붕괴시켜버리는 독초",
        "en": "Deceptively fragile toxic ivy possessing a terrifying reproductive rate. Silently absorbing the foundation until the concrete wall completely shatters."
      },
      "shadow_side": {
        "ko": "피해의식 속에 억눌려 지내다 기회가 생기면 타인의 영양분을 흡혈귀처럼 짜내며 가장 악독하게 복수하는 신경증",
        "en": "Harboring severe victim-complex until the perfect opening appears, then viciously draining the host’s nutrients like a parasitic vampire."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "질긴 생명력(간여지동)으로 시스템의 틈새를 은밀히 공략해, 종국에는 완전히 자신의 생태계로 전복시키는 서바이버입니다.",
        "en": "Relying on hyper-tenacious survival skills, you slip into the system's cracks and silently overwrite their entire ecosystem with your own."
      },
      "relationship": {
        "ko": "상대에게 기생하듯 강하게 얽히고 의존하며 통제권을 갖습니다. 하지만 스스로 버림받을까 두려워 먼저 가시로 찔러버리는 극성을 보입니다.",
        "en": "You weave intimately into your partner, silently seizing control. However, terrified of abandonment, you often preemptively inject them with spikes."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "독초가 대륙 전체를 덮어버릴 듯 미친 듯이 확산됩니다. 주변의 모든 것을 경쟁자(비겁)로 돌리며 무한 투쟁의 지옥도를 엽니다.",
          "en": "Toxic ivy aggressively blankets the entire continent. Framing every shadow as a rival, you ignite a paranoid, endless war of attrition."
        },
        "fire": {
          "ko": "독초가 불길을 만나 치명적인 독연기를 내뿜습니다. 빼어난 미적 감각과 도발(식상)이 잔인한 흉기가 되어 주변을 마비시킵니다.",
          "en": "The ivy burns, releasing weaponized neuro-smoke. Your blinding artistic flair and provocation mutate into a deadly bio-weapon, paralyzing the room."
        },
        "earth": {
          "ko": "거친 모래 폭풍이 덩굴을 말려 죽이려 듭니다. 돈과 현실적 성취(재성)에 편집증적으로 물리면서 영혼의 끝을 보게 됩니다.",
          "en": "A violent sandstorm attempts to dehydrate the vine. Pathologically obsessed with material targets, you stare down the absolute limits of your soul."
        },
        "metal": {
          "ko": "예리한 낫이 끝없이 덩굴을 도륙합니다. 가장 고통스러운 압박과 규율(관성) 속에서 피투성이가 된 채 더욱 치명적인 살기를 뿜습니다.",
          "en": "Razor scythes endlessly butcher the overgrowth. Bleeding heavily under draconian corporate rules, you emanate an even more lethal, venomous intent."
        },
        "water": {
          "ko": "차가운 늪지가 덩굴을 익사시킵니다. 깊숙이 가라앉는 우울감과 오컬트적 집착(인성)이 현실감을 마비시키고 끝없는 심연으로 끌어들입니다.",
          "en": "A freezing swamp drowns the ivy. Sinking into profound melancholia and occult obsessions, you lose tactile reality, spiraling into the deep."
        }
      }
    }
  },
  "丙辰": {
    "metadata": {
      "kr_name": "병진(丙辰)",
      "en_name": "Byeong-jin (Fire-Dragon)",
      "element": "Fire-Earth",
      "animal": "Dragon",
      "nature_symbol": { "ko": "진흙 늪에서 타오르는 화산정령", "en": "Lava Golem in the Bog" }
    },
    ...rawData["丙辰"],
    "core_identity": {
      "persona": { "ko": "끓어오르는 환상가", "en": "Boiling Illusionist" },
      "goth_punk_vibe": {
        "ko": "차갑고 탁한 진흙 늪에서 튀어 올라 세상을 붉게 물들이며 시리도록 화려한 춤을 추는 불의 용",
        "en": "A fire dragon violently erupting from a murky, freezing mud bog. Dyeing the sky blood-red while performing a breathtaking, agonizingly bright dance."
      },
      "shadow_side": {
        "ko": "자신의 뜨거운 이상을 세상이 알아주지 않는다는 병적인 불만 속에 갇혀, 현실을 저주하고 모두를 불태우려 드는 원망. 식상 고장지의 비애.",
        "en": "A pathological bitterness that the world rejects your blazing ideals. Cursing reality from inside the swamp, wanting to incinerate those who look away."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "눈부신 영감과 화려한 언변을 가졌지만, 늪(진토)에 발이 묶인 불꽃처럼 마음 깊은 곳에 지독한 공허와 분노를 감추고 있습니다.",
        "en": "Gifted with blinding inspiration and radiant charisma, yet severely tethered by the mud. A captive flame hiding deep, explosive resentment inside."
      },
      "relationship": {
        "ko": "자신의 뜨거운 열정을 전적으로 숭배해 줄 상대를 갈구하며, 만족되지 않으면 불안정한 온도 차이로 상대의 진을 빼어버립니다.",
        "en": "Demanding absolute worship for your blazing passion. If starved of validation, your erratic temperature shifts drain the partner's sanity."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "진흙에서 자란 거대한 가시덩굴이 불꽃을 보호합니다. 학구열과 명예욕(인성)이 비정상적으로 부풀며 오만한 교주로 군림합니다.",
          "en": "Giant thorns raised from the mud protect the flame. Abnormal spikes in academic obsession and narcissism elevate you to an arrogant cult pontiff."
        },
        "fire": {
          "ko": "늪지대가 거대한 불기둥과 화산으로 변합니다. 통제 불능의 경쟁심과 자만(비겁)이 폭주하며 피아를 가리지 않고 초토화시킵니다.",
          "en": "The bog transforms into a colossal volcano. Runaway rivalry and god-complex bypass all safety protocols, orchestrating an absolute scorched-earth campaign."
        },
        "earth": {
          "ko": "거대한 산사태가 덮쳐 불길의 숨통을 조입니다. 강박적인 완벽주의와 우울감(식상)이 폭발 직전의 마그마처럼 억눌려 미칠 듯한 고통을 줍니다.",
          "en": "Massive landslides choke the fire. Obsessive-compulsive melancholia tightly compresses like sealed magma, threatening to tear your mind apart."
        },
        "metal": {
          "ko": "굳어버린 마그마 사이로 차갑게 빛나는 금맥이 드러납니다. 치밀한 계산과 탐욕(재성)이 가장 서늘하게 발동해 상대를 난도질합니다.",
          "en": "Cold gold veins reveal themselves in the hardened magma. Chillingly calculative greed activates, mercilessly dissecting opposition with zero warmth."
        },
        "water": {
          "ko": "검은 비가 쏟아져 화산재와 섞이며 숨 막히는 진흙이 됩니다. 외부의 강력한 통제(관성) 속에서 지옥 같은 수치와 멸망의 두려움을 겪습니다.",
          "en": "Black rain mixes with ash, creating suffocating concrete mud. Under extreme systemic control, you fight terrifying, hellish humiliation and dread."
        }
      }
    }
  },
  "丁巳": {
    "metadata": {
      "kr_name": "정사(丁巳)",
      "en_name": "Jeong-sa (Fire-Snake)",
      "element": "Fire-Fire",
      "animal": "Snake",
      "nature_symbol": { "ko": "어둠을 찢는 용광로", "en": "Furnace Core Melting the Grid" }
    },
    ...rawData["丁巳"],
    "core_identity": {
      "persona": { "ko": "재앙의 연금술사", "en": "Cataclysm Alchemist" },
      "goth_punk_vibe": {
        "ko": "폭발 직전의 열기를 가둬둔 거대한 용광로. 한순간 가장 치명적인 붉은 뱀처럼 대기를 찢으며 마그마를 뿜어내는 공포",
        "en": "A titanic furnace harboring critical-mass heat. At any second, it splinters reality like a crimson snake, unleashing apocalyptic magma."
      },
      "shadow_side": {
        "ko": "자신을 굽히느니 차라리 세상과 함께 산화해 버리겠다는, 극단의 자존심이 만들어낸 파괴적이고 고립된 광기",
        "en": "A lethal pride that prefers global immolation over bending the knee. A destructive, completely isolated madness fueled by self-righteous combustion."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "간여지동의 절대적 압도감으로, 적이 나타나면 숨통을 끊을 때까지 불태우고야 마는 집요하고 폭력적인 에너지가 있습니다.",
        "en": "Wielding absolute, synchronized momentum. When an enemy appears, you deploy a sadistic, obsessive energy that burns until no trace remains."
      },
      "relationship": {
        "ko": "강렬한 소유욕으로 상대를 나의 영토에 완전히 가두길 원하며, 조금이라도 선을 넘거나 배신하면 영혼까지 회피 불가능하게 태워버립니다.",
        "en": "You violently quarantine the partner within your territory. The slightest betrayal or boundary breach triggers an inescapable soul-incineration."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "거대한 통나무들이 용광로로 무자비하게 쑤셔 넣어집니다. 편협한 지식과 오컬트(인성)가 결합해 자아를 광신도로 타락시킵니다.",
          "en": "Massive logs are brutally jammed into the furnace. Narrow occult obsessions violently synergize, corrupting the ego into a raving fanatic."
        },
        "fire": {
          "ko": "용광로가 한계치를 넘겨 대폭발을 일으킵니다. 통제할 수 없는 우월감과 나르시시즘(비겁)이 자아를 잃게 하고 피바다를 부릅니다.",
          "en": "The furnace breaches critical limits and detonates. Uncontrollable god-complex and narcissism completely short-circuit sanity, inviting a bloodbath."
        },
        "earth": {
          "ko": "산사태가 발생해 용광로의 불길과 압력을 가둬버립니다. 창의적 광기(식상)가 질식당하는 고통 속에서 미칠 듯한 히스테리가 발생합니다.",
          "en": "An avalanche buries the containment vessel. Your creative madness is tortured via suffocation, breeding terrifying bouts of explosive hysteria."
        },
        "metal": {
          "ko": "붉게 달아오른 마그마 위로 날 선 강철 검들이 부어집니다. 폭력적인 물욕(재성)이 가장 차갑고 잔인하게 당신을 살육 기계로 움직입니다.",
          "en": "Razor-sharp titanium blades are dumped into the boiling magma. A violent, freezing lust for wealth ruthlessly neuro-hacks you into a slaughter-bot."
        },
        "water": {
          "ko": "검은 소나기가 용광로를 습격하며 치명적인 수증기 폭발을 일으킵니다. 권력의 억압(관성) 속에서 저항하다 장렬하거나 처참하게 산화합니다.",
          "en": "A black monsoon ambushes the furnace, causing a lethal steam explosion. You violently resist systemic suppression until you are catastrophically vaporized."
        }
      }
    }
  },
  "戊午": {
    "metadata": {
      "kr_name": "무오(戊午)",
      "en_name": "Mu-o (Earth-Horse)",
      "element": "Earth-Fire",
      "animal": "Horse",
      "nature_symbol": { "ko": "마그마를 뿜어내는 가장 거대한 화산", "en": "Apocalyptic Volcano" }
    },
    ...rawData["戊午"],
    "core_identity": {
      "persona": { "ko": "재를 지배하는 황제", "en": "Emperor of Ash" },
      "goth_punk_vibe": {
        "ko": "거대하고 육중한 돌산의 형상을 하고 있으나 그 심장부엔 지구를 멸망시킬 만큼 끓어오르는 용암(양인살)을 품은 파괴의 신",
        "en": "Appearing as a heavy, unshakeable stone titan, but concealing an earth-shattering magma core (Yang-in) inside. A terrifying god of destruction."
      },
      "shadow_side": {
        "ko": "스스로의 폭발적인 감정을 다스리지 못해 주기적으로 화산을 터뜨려 주변을 초토화시키고 마침내 철저히 고립되는 형벌",
        "en": "Failing to regulate explosive internal pressure, cyclically detonating the volcano to obliterate your surroundings, ensuring total, penalized isolation."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "양인살의 절대적인 파괴력을 가진 폭군입니다. 한 번 방향을 정하면 그 어떤 제왕의 군대도 두려워하지 않고 산 채로 매장시켜 버립니다.",
        "en": "Bearing the catastrophic power of Yang-in. Once locked onto a target, you fear absolutely nothing, burying entire armies alive without blinking."
      },
      "relationship": {
        "ko": "파트너를 가장 높은 화산 꼭대기에 안치하지만, 조금이라도 나를 의심하거나 조종하려 들면 용암 불지옥으로 추락시킵니다.",
        "en": "You enthrone the partner at the peak of the volcano, but the absolute instant they try to manage you, they are thrown straight into the hellfire."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "화산재를 뚫고 잔혹한 가시나무들이 거대하게 솟아납니다. 무자비한 권력과 시스템(관성)의 압박이 당신의 광기를 극한으로 끌어올립니다.",
          "en": "Cruel thorn trees heavily puncture the ash layer. Merciless systemic authoritarian pressure drags your madness up to the absolute critical precipice."
        },
        "fire": {
          "ko": "마침내 임계점을 넘어선 대규모 마그마 폭발이 일어납니다. 지적인 오만과 광신(인성)이 결합돼 아무도 막을 수 없는 피바람을 예고합니다.",
          "en": "Critical mass is breached; a mega volcanic eruption occurs. Intellectual arrogance fuses with fanaticism, heralding an unstoppable wave of bloodshed."
        },
        "earth": {
          "ko": "지각판이 붕괴되어 산맥이 대륙 전체를 파괴하며 끝없이 비대해집니다. 극도의 자만심(비겁)이 자아를 삼켜버린 파멸적 독재가 시작됩니다.",
          "en": "Tectonic plates collapse, inflating the continent. Extreme narcissism completely swallows the ego, inaugurating a ruinous, dictatorial reign."
        },
        "metal": {
          "ko": "굳어버린 화산암 사이로 차갑고 예리한 금속성이 울립니다. 광기 어린 감정을 얼음 같은 처세술(식상)로 통제하며 적들을 소름 돋게 유린합니다.",
          "en": "Chilling metallic shrieks echo through the hardened igneous rock. You lock down the emotional madness with cold manipulation, sadistically violating enemies."
        },
        "water": {
          "ko": "검은 해일이 화산을 덮치며 증기 폭발이 대기를 찢습니다. 돈과 탐욕(재성)이라는 폭력적인 유혹에 이성을 잃고 나락으로 곤두박질칩니다.",
          "en": "A black tsunami crashes the volcano, ripping the sky with steam explosions. Mad lust for wealth violently strips your sanity, plunging you into the abyss."
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
fs.writeFileSync('phase6_patch1.json', JSON.stringify(finalObj, null, 2));
