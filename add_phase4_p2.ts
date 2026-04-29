import fs from 'fs';

const rawData = JSON.parse(fs.readFileSync('phase4_dump.json', 'utf8'));

const updates = {
  "己亥": {
    "metadata": {
      "kr_name": "기해(己亥)",
      "en_name": "Gi-hae (Earth-Pig)",
      "element": "Earth-Water",
      "animal": "Pig",
      "nature_symbol": { "ko": "밤바다를 몰래 헤엄치는 진흙", "en": "Mud Island in the Dark Sea" }
    },
    ...rawData["己亥"],
    "core_identity": {
      "persona": { "ko": "비밀스러운 관찰자", "en": "Midnight Stalker" },
      "goth_punk_vibe": {
        "ko": "칠흑 같은 밤, 파도 밑으로 조용히 스며들어 거대한 바다의 정보를 남몰래 빨아들이는 음습한 섬",
        "en": "A dark muddy island slowly melting into the pitch-black ocean. Silently absorbing every secret current, functioning as a damp, chilling reservoir."
      },
      "shadow_side": {
        "ko": "모든 것을 파악하려 하면서도 어느 곳에도 완전히 섞이지 못하고 우울한 의심 속에 스스로를 갉아먹는 강박",
        "en": "A paranoid compulsion to map out all hidden motives, leading to a miserable isolation where you belong nowhere and trust absolutely no one."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "부드럽고 조용한 태도 속에, 타인의 내면을 해킹하듯 스며들어 치명적인 약점을 잡아내는 놀라운 능력이 있습니다.",
        "en": "Behind a gentle, quiet presence lies a terrifying aptitude for dissolving into others' boundaries and exfiltrating their fatal weaknesses."
      },
      "relationship": {
        "ko": "상대에게 완벽히 동화되는 척하면서 가장 밑바닥까지 캐내지만, 자신이 통제당할 위기에 처하면 물속으로 증발해버립니다.",
        "en": "You fake total assimilation to mine their deepest core, but the exact second you feel trapped, you evaporate into the maritime dark."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "진흙 위로 독초가 미친 듯이 뿌리를 내립니다. 가혹한 억압(관성) 속에서 병적인 피해망상이 작동해 공격장치를 숨겨둡니다.",
          "en": "Toxic thorns frantically root into the mud. Beneath heavy systemic panic, a pathological victim-complex activates, hiding lethal countermeasures."
        },
        "fire": {
          "ko": "건조한 불길이 스치며 진흙섬이 단단한 진지로 변모합니다. 학문적인 갈증(인성)을 해소하며 흔들리던 정체성이 빛을 찾습니다.",
          "en": "Dry flame hardens the mud into a solid base. Slaking a deep intellectual thirst, your shaky identity finally violently anchors itself."
        },
        "earth": {
          "ko": "황사가 몰아치며 바다의 수면을 덮어버립니다. 아집(비겁)에 사로잡혀 세상과의 연결고리를 스스로 부숴버리는 고통스런 자폭에 빠집니다.",
          "en": "Yellow dust violently blankets the ocean. Consumed by stubborn ego, you trigger a painful self-destruct sequence, severing all worldly ties."
        },
        "metal": {
          "ko": "차가운 은맥이 진흙 밖으로 노출됩니다. 날 선 계산원(식상)으로 각성하여 자비 따위 없는 냉정한 현실 감각으로 상대를 베어 넘깁니다.",
          "en": "Cold silver veins breach the mud. Awakening as a razor-sharp operative, you execute cold-blooded strategy to brutally outmaneuver the competition."
        },
        "water": {
          "ko": "검은 해일이 몰아쳐 남은 흙조차 다 휩쓸어갑니다. 물질적 갈망(재성)이라는 심연에 거세게 마비되어 영혼이 익사합니다.",
          "en": "A black tsunami obliterates the remaining earth. Completely paralyzed by an abyssal lust for wealth, your spirit drowns entirely in the deep."
        }
      }
    }
  },
  "庚子": {
    "metadata": {
      "kr_name": "경자(庚子)",
      "en_name": "Gyeong-ja (Metal-Rat)",
      "element": "Metal-Water",
      "animal": "Rat",
      "nature_symbol": { "ko": "차가운 해저에 가라앉은 거대한 닻", "en": "Titanium Anchor in the Trench" }
    },
    ...rawData["庚子"],
    "core_identity": {
      "persona": { "ko": "심연의 처형자", "en": "Abyssal Executioner" },
      "goth_punk_vibe": {
        "ko": "빛이 닿지 않는 해저 밑바닥에서 얼음보다 차갑게 도사리며 다가오는 모든 생명을 응결시키는 소름 돋는 살기",
        "en": "Lurking below the frozen trench line without a single trace of light. A terrifying, silent mass of titanium radiating a lethal freezing aura."
      },
      "shadow_side": {
        "ko": "감정의 교류마저 가차 없이 잘라내고 가장 효율적인 살육(결단)만을 선택하려는, 영혼이 텅 빈 오만함",
        "en": "An absolute, soul-void arrogance that severs all emotional connection in favor of the most agonizingly efficient terminal outcome."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "세련되고 지적이면서도 결코 타협을 모릅니다. 치명적인 독설과 계산능력을 무기 삼아 가장 차가운 왕좌에 앉는 폭군입니다.",
        "en": "Sophisticated, hyper-intelligent, and absolutely uncompromising. You wield fatal tongue and logic to ascend the coldest throne in the room."
      },
      "relationship": {
        "ko": "마치 신처럼 파트너를 통제하려 들며, 한 치의 오차나 감정적 기만에 대해서는 단칼에 숨통을 끊듯 징벌합니다.",
        "en": "You attempt to override your partner like a god program. Any deviation or emotional glitch is punished with a fast, brutal system wipe."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "해저의 닻에 기괴한 수초가 얽혀 솟아오릅니다. 돈과 결과물(재성)에 대한 집요한 탐욕이 폭주하여 이성의 한계치를 찢습니다.",
          "en": "Grotesque kelp violently drags the anchor upward. An obsessive, clawing greed for results shatters your strict logical parameters."
        },
        "fire": {
          "ko": "강렬한 수중 화산이 얼음을 붉게 녹입니다. 권위와 승진(관성)을 쟁취하기 위해 가장 극단적이고 치명적인 룰을 끌어안습니다.",
          "en": "An intense underwater volcano melts the frost. To grab absolute authority, you willingly merge with the most destructive, extreme corporate policies."
        },
        "earth": {
          "ko": "거대한 토사가 닻을 파묻어버립니다. 소름 돋는 은둔형 학자(인성)로 돌변하여 남들이 접근할 수 없는 끔찍한 오컬트의 심연을 구축합니다.",
          "en": "A massive landslide buries the titanium. You mutate into a chilling, recluse scholar, constructing a horrifying, inaccessible occult foundation."
        },
        "metal": {
          "ko": "도끼날들이 공명하며 심해를 산산조각 냅니다. 오직 나만이 진리라는 맹목적 나르시시즘(비겁)이 세상을 서늘한 피바다로 몰아넣습니다.",
          "en": "Axes resonate, shattering the deep ocean. Blind, fanatical narcissism dictates that only you are truth, plunging the world into an icy bloodbath."
        },
        "water": {
          "ko": "끝을 모르는 심해의 어둠이 모든 것을 익사시킵니다. 자신의 뾰족한 재능과 비판(식상)에 심취해 세상의 모든 빛을 잔혹하게 꺼버립니다.",
          "en": "The endless dark trench drowns everything outright. Drunk on your own razor-sharp criticism, you sadistically flip the switch on the world’s light."
        }
      }
    }
  },
  "辛丑": {
    "metadata": {
      "kr_name": "신축(辛丑)",
      "en_name": "Sin-chuk (Metal-Ox)",
      "element": "Metal-Earth",
      "animal": "Ox",
      "nature_symbol": { "ko": "얼어붙은 무덤 속에 감춰진 수술용 칼", "en": "Scalpel in the Frost" }
    },
    ...rawData["辛丑"],
    "core_identity": {
      "persona": { "ko": "동토의 도축자", "en": "Frostbite Surgeon" },
      "goth_punk_vibe": {
        "ko": "영원히 녹지 않을 듯한 동토 속에 가장 아프고 예리한 비수를 칼집도 없이 묻어둔 매서운 한기",
        "en": "Burying a painfully sharp surgical blade in the permafrost with no sheath. A terrifyingly cold entity silently waiting to dissect what approaches."
      },
      "shadow_side": {
        "ko": "자신의 고통을 훈장처럼 여기며 타인에게도 상처를 강요하고, 한계를 넘는 순간 잔인하게 도려내는 피학적 신경증",
        "en": "Wearing agony like a medal, forcing your trauma onto others. The moment your invisible line is crossed, you execute a sadistic amputation."
      }
    },
    "narrative_blocks": {
      "default": {
        "ko": "가장 소름 돋는 침착함과 인내심을 가졌습니다. 어떤 치명상에도 비명 한번 지르지 않고 상대의 약점을 도려낼 기회를 노립니다.",
        "en": "Posessing the most chilling composure. Taking fatal blows without a scream, silently waiting for the perfect angle to excise the enemy's core."
      },
      "relationship": {
        "ko": "마치 상대의 죄업(카르마)을 내가 벌해야만 직성이 풀리듯, 의존과 처벌이 기괴하게 뒤섞인 가학적인 사랑을 합니다.",
        "en": "A grotesque blend of deeply reliant love and sadistic karma. Operating as if you were appointed to punish their sins disguised as romance."
      },
      "timing_modifiers": {
        "wood": {
          "ko": "죽은 나무가 얼음을 찢고 비수를 휘감습니다. 파괴적일 만큼 물욕(재성)이 발동해 자신의 살점을 깎아내며 금맥을 찾으려 헤맵니다.",
          "en": "Dead roots rip the ice to strangle the scalpel. A destructive money-hunger triggers, tearing your own flesh to violently excavate the gold vein."
        },
        "fire": {
          "ko": "불길이 얼음을 녹이려 들며 날숨을 막습니다. 절대적인 억압과 규율(관성) 속에서 히스테리가 폭주하여 이성을 베어버립니다.",
          "en": "Flames attempt to melt the ice, suffocating the exhales. Under absolute systemic discipline, a severe hysterical override severs your own sanity."
        },
        "earth": {
          "ko": "거대한 산사태가 무덤을 겹겹이 짓누릅니다. 극도의 피해의식과 삐뚤어진 종교적 믿음(인성)으로 스스로의 감옥을 철저히 폐쇄합니다.",
          "en": "A colossal avalanche repeatedly crushes the grave. Driven by extreme victimhood and warped dogma, you completely quarantine your own dark cell."
        },
        "metal": {
          "ko": "은빛 가위들이 무덤 주위로 수없이 돋아납니다. 자비 없는 에고(비겁)가 부활하며 주변의 모든 생명을 피도 눈물도 없이 절단합니다.",
          "en": "Silver scissors sprout infinitely around the grave. A merciless ego resurrects, brutally amputating all nearby life with zero emotional recoil."
        },
        "water": {
          "ko": "검은 폭우가 쏟아져 칼날의 독을 씻어냅니다. 끔찍한 비애와 창조력(식상)이 결합돼, 모두를 소름 돋게 하는 탐미적 걸작을 탄생시킵니다.",
          "en": "Black downpour violently washes the venom off the blade. Hideous sorrow and chilling creativity merge to vomit out an awe-inspiring, gothic masterpiece."
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
fs.writeFileSync('phase4_patch2.json', JSON.stringify(finalObj, null, 2));
