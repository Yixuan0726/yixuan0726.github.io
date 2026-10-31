// Generated from the authored PDF by tools/import-keepdribbling-pdf.py.
export const keepDribblingDocument = {
  "source": {
    "file": "uploads/keepdribbling-portfolio.pdf",
    "pages": 11
  },
  "intro": {
    "coreConcept": "KeepDribbling is an indie action game combining parkour obstacle avoidance with a sports narrative. Players take on the role of a basketball player recovering from a severe injury. While constantly dribbling forward, she must overcome various physical and external obstacles to ultimately reach her own buzzer-beating moment. This experience challenges the limits of reaction times while taking players on an emotional journey of perseverance, frustration, and self-redemption.",
    "personalMotivation": [
      "Basketball has always been an indispensable passion in my life. However, an accidental injury during childhood forced me to permanently abandon my dream of playing professionally. The regret of never sweating it out on the court has remained buried deep in my heart ever since.",
      "Now, taking the opportunity to build my portfolio, I decided to use code and game design to reconstruct that unfulfilled basketball dream in a virtual world. KeepDribbling goes beyond a simple demo showcasing my programming and design skills; it is an attempt to \"mechanize\" my personal experiences. By translating real-world setbacks into game systems and using code to bridge the gap left by my early retirement, I aim to make peace with my past, injured self. I may have stopped walking on the real court, but in the game, I will keep dribbling forward."
    ],
    "screenshots": [
      {
        "src": "assets/keepdribbling/document/introduction-final-shot.webp",
        "width": 751,
        "height": 423,
        "alt": "KeepDribbling's narrative transition into the final shot."
      },
      {
        "src": "assets/keepdribbling/document/introduction-ball-retrieval.webp",
        "width": 751,
        "height": 423,
        "alt": "The GO GET THE BALL prompt after losing possession in KeepDribbling."
      },
      {
        "src": "assets/keepdribbling/document/introduction-standard-ending.webp",
        "width": 805,
        "height": 453,
        "alt": "KeepDribbling's Standard Ending beside a basketball hoop."
      }
    ],
    "inspiration": {
      "templeRun": {
        "text": "The core gameplay was heavily inspired by the classic parkour game Temple Run. I extracted its mechanics of continuous running and extreme dodging, deeply integrating them with the rhythmic feel of keeping a dribble alive in basketball. Players must do more than just dodge; they need to constantly maintain ball control and make precise decisions on the move.",
        "image": {
          "src": "assets/keepdribbling/document/inspiration-temple-run.webp",
          "width": 367,
          "height": 368,
          "alt": "Temple Run icon, a gameplay inspiration."
        }
      },
      "shaolinSoccer": {
        "text": "When designing the obstacles, my main challenge was translating the intense defensive pressure of a basketball court into a single-player parkour experience. The movie Shaolin Soccer offered immense inspiration. I borrowed its surreal, exaggerated portrayal of sports, manifesting real-world \"dirty plays\" and invisible pressures as absurd physical obstacles. Players must evade sudden flying kicks from martial artists, foot-dragging slimes, and deadly floor spikes. This over-the-top approach significantly amplifies the kinetic tension and fun of the parkour while using dark humor to highlight the hardships the protagonist faces while chasing her dream.",
        "image": {
          "src": "assets/keepdribbling/document/inspiration-shaolin-soccer.webp",
          "width": 602,
          "height": 655,
          "alt": "Shaolin Soccer poster, an inspiration for exaggerated sports encounters."
        },
        "gameplayImage": {
          "src": "assets/keepdribbling/document/inspiration-gameplay.webp",
          "width": 1120,
          "height": 630,
          "alt": "KeepDribbling's player running and dribbling along the obstacle course."
        }
      }
    }
  },
  "protagonist": {
    "intro": "In this process of translating personal trauma into game mechanics, the protagonist is more than just a playable avatar; she is a projection of my own uncompromising inner self.",
    "implementation": "Lacking a formal background in 3D art and animation, I utilized Hyper3D to generate the character model and manually rigged and animated it using Blender. As a result, the character's animations lack the seamless fluidity of commercial titles, carrying instead an undeniable sense of stiffness.",
    "designMetaphor": "Initially, I was frustrated by this lack of fluid motion. However, I quickly realized that this stilted, slightly rigid physical feedback accurately captures the harsh reality of sports rehabilitation. The slight clunkiness and hesitation in the protagonist's dribbling and dodging perfectly mirror the steep decline in physical capability following a severe injury. The once-effortless muscle memory is gone, and the connection between nerve and limb is broken. Every simple crossover now requires deliberate mental exertion to overcome subconscious physical fear. In this way, a technical \"imperfection\" organically elevated the absolute authenticity of the emotional narrative.",
    "facelessPlayer": "The model generated by Hyper3D lacks intricate facial details, a trait that coincidentally aligns with the psychological state of recovery. Through the agonizing, monotonous repetition of daily physical therapy, outward individuality is gradually stripped away. What drives the protagonist forward—dribbling past obstacle after obstacle—is not the glamour of the spotlight, but a pure, desperate will to \"heal.\" Within the game, she takes the place of my injured self, limping yet relentless, carrying forward an unfinished basketball dream.",
    "images": [
      {
        "src": "assets/keepdribbling/document/protagonist-rig.webp",
        "width": 451,
        "height": 647,
        "alt": "The protagonist's grey character model and skeleton in Blender."
      },
      {
        "src": "assets/keepdribbling/document/protagonist-character.webp",
        "width": 566,
        "height": 566,
        "alt": "The basketball protagonist in a light-blue uniform."
      }
    ]
  },
  "mechanics": {
    "intro": "The core gameplay loop is built on a foundational logic of \"Cognition → Reaction → Overcoming.\" To ensure the parkour mechanics align perfectly with the narrative metaphor of an \"injury comeback,\" the game utilizes a design framework that alternates between situational tutorials and high-pressure combat.",
    "tutorial": "Throughout the game, whenever a new obstacle makes its debut, the system triggers a dedicated tutorial phase: the action pauses instantly as the camera zooms in, using UI text to teach the dodge mechanics while revealing the physiological or psychological metaphor each trap represents in the player’s recovery journey. As players build their understanding of these metaphorical obstacles, the difficulty curve ramps up in a step-like manner. In the subsequent combat phases, dodge frequency spikes alongside a narrowing margin for error. This seamless shift from static learning to reflexive action creates an immersive simulation of the surging physical and mental pressure a player faces when moving from tedious rehab back into the heat of competition.",
    "screenshots": [
      {
        "src": "assets/keepdribbling/document/tutorial-step-1.webp",
        "width": 529,
        "height": 298,
        "alt": "Tutorial sequence, step 1: approaching the obstacle."
      },
      {
        "src": "assets/keepdribbling/document/tutorial-step-2.webp",
        "width": 529,
        "height": 298,
        "alt": "Tutorial sequence, step 2: the camera focuses on the training dummy and explains the action."
      },
      {
        "src": "assets/keepdribbling/document/tutorial-step-3.webp",
        "width": 529,
        "height": 298,
        "alt": "Tutorial sequence, step 3: returning to the running view."
      },
      {
        "src": "assets/keepdribbling/document/tutorial-step-4.webp",
        "width": 532,
        "height": 299,
        "alt": "Tutorial sequence, step 4: the player continues dribbling forward."
      }
    ]
  },
  "progression": {
    "intention": "The obstacle design and level progression are intentionally structured to mirror the psychological and physical timeline of sports rehabilitation. The overarching design intention is clear: the player must first conquer her internal fears and physical limitations (Phase I: Overcoming the Self) before she is resilient enough to face external malice and intense physical confrontation (Phase II: Confronting the Outside World).",
    "loop": "Structurally, both Phase I and Phase II share an identical progression loop: enduring randomized obstacles until a 500-meter milestone is reached. This repetitive, highly monotonous structure is not a lack of design variation, but a deliberate metaphor for the reality of rehabilitation training. Recovery is rarely a fast-paced adventure; it is a tedious, cyclical, and often frustrating grind. By forcing the player to repeat the core loop until the exact distance is cleared, the gameplay mechanically replicates the immense patience and endurance required to slowly rebuild a shattered body.",
    "penalty": "Throughout the game, failing to execute a dodge or missing a Quick Time Event (QTE) shares a unified consequence: Turnover & Retrieval. The player loses possession of the ball, forcing her to break momentum and physically run back to retrieve it. This shared penalty constantly reinforces the frustration of rehab—where hard-earned progress can be instantly undone by a single mistake.",
    "diagram": {
      "src": "assets/keepdribbling/document/level-progression-diagram.webp",
      "width": 805,
      "height": 711,
      "alt": "Level flow: Levels 1 and 2 start with Tutorial Mode, then Training & Action and Training Action. Distance under 500 m loops to Training & Action; at 500 m or more, trigger a scene transition and load the next stage. Level 3 enters the final shot, reads the defender and finds an opening, asks for Space within 24 seconds, triggers the final ending, then ends the game."
    },
    "diagramSteps": {
      "phaseOne": [
        "Start: Level 1 & 2",
        "Phase 1: Tutorial Mode",
        "Phase 2: Training & Action",
        "Training Action",
        "Distance ≥ 500m?",
        "No: return to Phase 2: Training & Action",
        "Yes: Trigger Scene Transition",
        "Load Next Stage"
      ],
      "phaseTwo": [
        "Start: Level 3",
        "Enter Final shot",
        "Read Defender & Find an Opening",
        "Press Space in 24s",
        "Trigger Final Ending",
        "Game End"
      ]
    }
  },
  "phases": [
    {
      "title": "Phase I: Overcoming the Self (Internal Fears & Physical Limitations)",
      "obstacles": [
        {
          "id": "slime",
          "name": "The Slime",
          "subtitle": "The Instinctual Fear of Re-injury",
          "action": "Watch for a yellow-green aura and press [Q] to \"Override\".",
          "metaphor": "This represents the psychological baggage causing a heavy delay between thought and action. While the mind envisions a swift crossover, the legs freeze, paralyzed by a lack of confidence and the terror of re-injury.",
          "image": {
            "src": "assets/keepdribbling/document/slime.webp",
            "width": 415,
            "height": 294,
            "alt": "The green slime obstacle on the running course."
          }
        },
        {
          "id": "small-dummy",
          "name": "The Small Dummy",
          "subtitle": "The Fragility of Basic Mechanics",
          "action": "Watch for a yellow-green aura and press [W] to dodge.",
          "metaphor": "Bypassing a standard dummy was once effortless. Post-injury, it embodies a hypersensitive fear of failure—the lingering terror that even the simplest, least threatening drills will result in a humiliating loss of control.",
          "image": {
            "src": "assets/keepdribbling/document/small-dummy.webp",
            "width": 372,
            "height": 322,
            "alt": "The small training dummy with a target on its chest."
          }
        },
        {
          "id": "large-dummy",
          "name": "The Large Dummy",
          "subtitle": "The Demonization of Confrontation",
          "action": "Watch for a yellow-green aura and press [E] to execute a wide dodge.",
          "metaphor": "This oversized dummy is a projection of internal fear regarding high-intensity physical contact. It simulates how a traumatized subconscious can distort a standard opponent into a towering, insurmountable threat.",
          "image": {
            "src": "assets/keepdribbling/document/large-dummy.webp",
            "width": 467,
            "height": 426,
            "alt": "The oversized training dummy with target markers."
          }
        },
        {
          "id": "push-board",
          "name": "The Push Board",
          "subtitle": "The Void of Core Power",
          "action": "When the board horizontally blocks the path, press [A] or [D] to dodge in the corresponding direction.",
          "metaphor": "The board materializes the profound sense of helplessness caused by a hollowed-out core. The brain issues a sharp command to alter direction, but the compromised core muscles provide zero structural support, leaving the body feeling \"empty\".",
          "image": {
            "src": "assets/keepdribbling/document/push-board.webp",
            "width": 407,
            "height": 358,
            "alt": "The red push board extending across the running lanes."
          }
        },
        {
          "id": "floor-spikes",
          "name": "The Floor Spikes",
          "subtitle": "The Phantom Sting of Scar Tissue",
          "action": "Spikes randomly block a single lane. Press [A] or [D] to execute a lateral dodge.",
          "metaphor": "Even when bones have medically healed, tight scar tissue acts like hidden traps in the joints. This obstacle tests the player's courage to trust her recovery, forcing her to overcome the instinct to completely freeze whenever she feels a fleeting, phantom sting.",
          "image": {
            "src": "assets/keepdribbling/document/floor-spikes.webp",
            "width": 396,
            "height": 389,
            "alt": "A red floor tile with rows of raised spikes."
          }
        }
      ]
    },
    {
      "title": "Phase II: Confronting the Outside World (External Malice & Interference)",
      "obstacles": [
        {
          "id": "martial-artist-tripping",
          "name": "Martial Artist - Tripping",
          "subtitle": "Hyper-Vigilance & Somatic Insecurity",
          "action": "A two-stage QTE. 1) Press a randomized key instantly when the opponent's foot slides out. 2) Press a second key right before impact to adjust stride and accelerate past them.",
          "metaphor": "This simulates the immense cognitive load of a post-trauma athlete. The necessity to obsessively read the defender's lower body mirrors the psychological insecurity that forces a recovering player's eyes to fixate on opponents' feet. Mastering this reflex represents converting paralyzing paranoia into tactical execution.",
          "image": {
            "src": "assets/keepdribbling/document/martial-artist-tripping.webp",
            "width": 636,
            "height": 316,
            "alt": "The martial artist's tripping animation in the 3D scene."
          }
        },
        {
          "id": "martial-artist-elbow",
          "name": "The Martial Artist - Elbow Strike",
          "subtitle": "The Ultimate Paradigm Shift",
          "action": "The defender mirrors the player's lane changes. Press [A] or [D] to exploit his heavy footsteps and break his ankles. Collision: If unable to dodge, instantly press a randomized matching key to power through the impact.",
          "metaphor": "This represents the ultimate fear: violent external contact targeting unhealed areas. Breaking his ankles symbolizes a defensive psychology of evading contact, while the mandatory QTE collisions force the core psychological breakthrough—compelling the player to suppress her defensive evasion instincts and actively embrace the physical impact required to survive on the court.",
          "image": {
            "src": "assets/keepdribbling/document/martial-artist-elbow.webp",
            "width": 639,
            "height": 375,
            "alt": "The martial artist's elbow-strike animation in the 3D scene."
          }
        },
        {
          "id": "smoker",
          "name": "The Smoker",
          "subtitle": "Environmental Malice & Somatic Distress",
          "action": "Smoke continuously chokes a specific lane. Quickly switch to a clear lane, then press [SHIFT] at the smoke's edge to sprint. (Note: Getting caught in the smoke specifically drops movement speed to zero, rather than causing a turnover).",
          "metaphor": "While it personifies the physical agony of lungs burning from exhaustion, it primarily represents the toxic external environment of rehabilitation. The secondhand smoke symbolizes the indifferent bystanders and the chaotic external interferences that constantly threaten to derail a lonely comeback.",
          "image": {
            "src": "assets/keepdribbling/document/smoker.webp",
            "width": 1920,
            "height": 1080,
            "alt": "The smoker obstacle emitting a cloud into the running lane.",
            "crop": {
              "left": 11.310168,
              "top": 13.360521,
              "right": 52.94672,
              "bottom": 54.296661,
              "flipX": true
            }
          }
        }
      ]
    }
  ],
  "endings": {
    "introTitle": "Multiple Destinations on the Road to Recovery",
    "intro": "In this game, the ending is not simply about \"winning\" or \"losing\"; it offers different life profiles calculated based on the player's number of turnovers and completion time during the rehabilitation process.",
    "items": [
      {
        "title": "1. STANDARD ENDING: Accepting Imperfect Growth",
        "condition": "Complete the game within 7 minutes with a small number of turnovers.",
        "metaphor": "This represents the most realistic state of rehab. As a varsity player, I had to accept that I would lose the ball and that my form would falter due to the dull ache of old injuries. This ending conveys that mistakes and pain are inherent parts of the journey; as long as you can stand firm within the allotted time, you have already won back your life."
      },
      {
        "title": "2. 99% ENDING: Effort Does Not Always Yield Results",
        "condition": "Fail the final shot determination.",
        "metaphor": "This is the most brutal and unforgettable aspect of competitive sports. Sometimes, after enduring all the rehab and sweating every last drop, that final ball still rims out. In statistics, a 99% confidence interval still does not equate to 100% success."
      },
      {
        "title": "3. DEVIL'S BARGAIN: The Desperate Gamble of Playing Through Pain",
        "condition": "Commit more than 5 turnovers within 5 minutes, but successfully make the final shot.",
        "metaphor": "This crimson ending serves as a metaphor for \"destructive perseverance.\" It embodies the drive to force the ball into the hoop even when the body is severely injured during a game. Although it wins the match, sacrificing the future in this manner feels more like a deal with the devil."
      },
      {
        "title": "4. ANOMALY: A Will Defying Logic",
        "condition": "Exceed the 7-minute time limit, enduring a long and painful process to ultimately finish.",
        "metaphor": "This ending is dedicated to the \"late bloomers\"—even if your rhythm is completely ruined and it takes you several times longer than others, as long as you haven't quit, you are the one who breaks the rules and defines your own success."
      },
      {
        "title": "5. Hidden Ending: TAS (Tool-Assisted Speedrun): Unattainable Perfection",
        "condition": "0 turnovers, speedrun clear.",
        "metaphor": "This is a \"superhuman\" realm. It symbolizes that perfect, machine-like state we desperately crave to reclaim post-injury. In reality, such absolute precision exists only within a programmed TAS run. This ending acts more as a phantom, representing our almost obsessive nostalgia for our pre-injury peak."
      }
    ]
  },
  "development": {
    "intro": "As this was my inaugural game project, KeepDribbling presented steep learning curves in both engineering and art direction.",
    "architecture": {
      "text": "On the programming front, I initially fell into common beginner traps, such as hardcoding \"Magic Numbers\" and rigidly scripting completely independent logic for every single level. Whenever I needed to tweak a gameplay variable or a UI trigger, it felt like searching for a needle in a haystack across over twenty disorganized scripts, which inevitably led to an endless cycle of bugs. It wasn't until I taught myself to refactor the architecture utilizing parent-child class inheritance that I experienced a major breakthrough. I realized that those seemingly disparate level mechanics could share a unified, underlying logic, transforming a tangled mess into a clean, transparent, and highly scalable codebase.",
      "image": {
        "src": "assets/keepdribbling/document/development-code-architecture.webp",
        "width": 650,
        "height": 273,
        "alt": "A class hierarchy diagram showing the game's shared code architecture."
      }
    },
    "artPipeline": {
      "text": "Beyond programming, asset creation was a major bottleneck. Lacking a formal background in 3D art, I had to build a character pipeline from scratch. While utilizing an AI tool (Hyper3D) to generate the base mesh expedited the initial phase, the subsequent process of manually rigging the skeleton and tweaking animation curves frame-by-frame in Blender proved incredibly time-consuming. This steep learning curve exposed me to the rigorous demands of 3D animation workflows. Rather than a narrative realization, this specific hurdle taught me a crucial practical lesson: the importance of strict scoping, resource management, and how to pragmatically navigate technical bottlenecks when stepping outside my primary domain. This experience fundamentally broadened my perspective, teaching me to balance creative ambition with production realities.",
      "images": [
        {
          "src": "assets/keepdribbling/document/development-rig.webp",
          "width": 262,
          "height": 375,
          "alt": "The grey protagonist model during the rigging process."
        },
        {
          "src": "assets/keepdribbling/document/development-animation-1.webp",
          "width": 206,
          "height": 248,
          "alt": "Animation study of the protagonist dribbling, pose 1."
        },
        {
          "src": "assets/keepdribbling/document/development-animation-2.webp",
          "width": 207,
          "height": 248,
          "alt": "Animation study of the protagonist dribbling, pose 2."
        },
        {
          "src": "assets/keepdribbling/document/development-animation-3.webp",
          "width": 202,
          "height": 241,
          "alt": "Animation study of the protagonist dribbling, pose 3."
        }
      ]
    }
  }
};
