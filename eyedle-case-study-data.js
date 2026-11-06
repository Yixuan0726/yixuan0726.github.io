// Concise case study. The complete source document remains separately accessible.
export const eyedleCaseStudy = {
  "hero": {
    "title": "EyeDle",
    "subtitle": "A short guided routine. A workshop that carries on.",
    "summary": "An experimental eye-interaction idle game. Completing a guided routine supplies energy to a small workshop; selling its products funds upgrades. I designed the two activities around brief participation, visible progress, and time away."
  },
  "sections": [
    {
      "id": "purpose",
      "title": "Making room for a pause",
      "paragraphs": [
        "I often keep playing games even when my eyes feel tired. EyeDle began with a question: could the desire to play also create room for a pause? Before Your Eyes inspired eye-based input; Mr. Mine suggested a rhythm of income, upgrades, and discovery.",
        "EyeDle pairs a finite guided routine with an idle workshop. A water drop accompanies the player during care and works afterward. My design challenge was to make a brief visit feel complete while giving players something to return to."
      ]
    },
    {
      "id": "loop",
      "title": "How care powers the workshop",
      "lead": "Start with the care routine. The Care Energy it earns is the resource the workshop spends to produce bottles.",
      "steps": [
        {
          "number": "01",
          "title": "Complete care",
          "text": "Follow near–far focus shifts, directional cues, circular movements, and closed-eye rest. The full sequence takes about three minutes and provides 12 units of Care Energy."
        },
        {
          "number": "02",
          "title": "Produce and sell",
          "text": "Workers filter, mix, and bottle a fictional drink. That energy supports at most 12 regular bottles; sales turn finished stock into coins."
        },
        {
          "number": "03",
          "title": "Choose the next upgrade",
          "text": "Spend income on processing speed, workers, storage, or transport. Purchase order and worker allocation affect waiting and bottlenecks."
        },
        {
          "number": "04",
          "title": "Leave and return",
          "text": "Production can progress offline. The next full routine becomes available eight hours after completion; staying online does not increase its energy allowance."
        }
      ],
      "paragraphs": [
        "Each worker sent on Search takes an independent eight-hour trip without spending Care Energy. More workers away means more opportunities for discoveries, but fewer at home. Before automation, sending everyone away stops production; loading and selling always need workers.",
        "Completion requires 24 full routines and all workshop upgrades. Missed days do not reset progress. Early returns require one minute of closed-eye rest to enter the workshop, without rewards or routine credit.",
        "Upgrades change production and management; the care actions stay the same. The two activities are connected through energy and progression. Whether that exchange gives players enough reason to return remains open."
      ]
    },
    {
      "id": "decisions",
      "title": "Three decisions that changed the experience",
      "decisions": [
        {
          "title": "Give eye-based input an endpoint",
          "paragraphs": [
            "My early roguelike prototype asked players to blink, close their eyes, and move the device repeatedly while choosing upgrade cards. The cards changed rewards more than they changed play: one raised bonus XP for the same closed-eye action. Continuous input also introduced tension.",
            "I stopped expanding that system and separated the guided routine from workshop management. Eye-based participation now ends after a short sequence; longer progression happens through the workshop. I accepted less immediate stimulation to avoid making care another task that demanded constant responses."
          ]
        },
        {
          "title": "Make the first routine visibly matter",
          "paragraphs": [
            "The redesigned loop introduced a new problem: players had to wait for production, transport, and sales before they could afford an upgrade. They could leave before seeing what care contributed.",
            "I moved a one-time 12-coin bonus to the end of the first routine. Players can immediately spend 8 coins on a faster filter or all 12 on a second worker. Later income still comes from production and sales. The bonus gives the first routine an immediate consequence in the workshop and introduces a purchase choice."
          ]
        },
        {
          "title": "Give feedback without asking players to look",
          "paragraphs": [
            "Early players found the eyes-closed wait long and were unsure how much time remained. I added spoken cues at 30 and 15 seconds, a final five-second countdown, and an instruction to open the eyes. These follow accumulated closed-eye time and pause with the routine.",
            "The water drop closes its eyes alongside the player and visibly recovers afterward. Lost tracking now pauses progress and gives a prompt; players can resume, switch a stalled near–far step to closed-eye rest, or save and leave. Feedback and recovery became part of making the routine manageable."
          ]
        }
      ]
    },
    {
      "id": "interaction",
      "title": "What the prototype actually detects",
      "paragraphs": [
        "For near–far focus shifts, the camera estimates relative distance from the apparent size of the player's face. The final rest step accumulates time when both eyes are detected as closed. These are the prototype's checked inputs.",
        "Directional and circular eye movements use timed voice guidance; the game does not verify each gaze direction. I chose this after relative face movement could not reliably distinguish head movement from phone movement. Switching to closed-eye rest still requires camera detection.",
        "The demonstrations identify simulated sensor input and staged saves where used. They show the interaction flow and feedback, rather than proving tracking accuracy. Research informed action selection; EyeDle's sequence and duration are design choices, not validated treatment."
      ],
      "inputs": [
        {
          "title": "Near–far movement · camera estimate",
          "text": "The camera estimates relative distance from changes in the apparent size of the player's face. It does not directly measure where the eyes are focused."
        },
        {
          "title": "Closed-eye rest · detected and timed",
          "text": "The final step accumulates time when both eyes are detected as closed. Opening the eyes or losing tracking pauses progress. Switching a stalled near–far step to rest still requires camera detection."
        },
        {
          "title": "Directional and circular movements · guided",
          "text": "These steps follow timed voice cues. The prototype does not verify each gaze direction; relative face movement could not reliably distinguish head movement from phone movement."
        }
      ],
      "disclosure": "Prototype recordings disclose simulated sensor input and staged saves where used. They demonstrate flow and feedback, not tracking accuracy. Research informed action selection; the sequence and duration are design choices, not validated treatment."
    },
    {
      "id": "reflection",
      "title": "What testing changed—and what remains open",
      "paragraphs": [
        "An online retest with classmates and friends collected 11 questionnaire responses in October 2026. It used the earlier 20-minute care and Search intervals, before the final eight-hour pacing. The findings exposed different problems:",
        "Five of 11 respondents said they would probably or definitely return within a week. Together with comments about waiting, this prompted the first-routine upgrade bonus. Seven of 11 reported input-response problems, leading me to improve confirmation, recovery, and alternatives.",
        "Of the 10 participants who completed a routine, six left the game afterward—but five switched to other screen content and only one took a screen-free break. Leaving the game was not the same as resting away from screens. I narrowed my goal to a clear endpoint that does not require continued online play.",
        "The retest identified problems without isolating the effect of each revision. Next, I need to test the final eight-hour rhythm over a longer period, and whether workshop choices sustain interest when the care sequence stays the same."
      ],
      "findings": [
        {
          "number": "5 / 11",
          "title": "Would probably or definitely return",
          "text": "This was stated intention within a week, not measured retention. Alongside comments about waiting, it prompted the first-routine upgrade bonus."
        },
        {
          "number": "7 / 11",
          "title": "Reported an input-response problem",
          "text": "Four eventually continued; three could not finish that attempt. I added clearer confirmation, recovery prompts, and alternatives."
        },
        {
          "number": "1 / 10",
          "title": "Took a screen-free break",
          "text": "Among routine completers, five others switched to more screen content and four stayed in the game. Leaving the game did not necessarily mean leaving screens."
        }
      ],
      "takeaway": "This led me to narrow the goal to a clear endpoint that does not require continued online play. Comfort, enjoyment, and willingness to return are different outcomes."
    }
  ],
  "detailLink": {
    "title": "Read the complete design document",
    "description": "Full mechanics, research references, economy tables, development records, questionnaire links, and all demonstrations."
  }
};
