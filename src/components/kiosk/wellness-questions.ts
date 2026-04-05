/** Copy for follow-up flows (all optional multiselect). Replace with final copy as needed. */

export type WellnessQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export const MOOD_OPTIONS: { id: string; label: string }[] = [
  { id: "great", label: "Great" },
  { id: "good", label: "Good" },
  { id: "okay", label: "Okay" },
  { id: "low", label: "Low" },
  { id: "stressed", label: "Stressed" },
  { id: "tired", label: "Tired" },
];

/** Three short questions — shown one at a time. */
export const SHORT_FOLLOWUP_QUESTIONS: WellnessQuestion[] = [
  {
    id: "short-1",
    prompt: "What would help you most today?",
    options: [
      "A quiet space",
      "Someone to talk to",
      "Food or essentials",
      "Help with housing",
      "Medical or mental health support",
      "Other resources",
    ],
  },
  {
    id: "short-2",
    prompt: "How has rest or sleep been for you lately?",
    options: [
      "Sleeping well",
      "Some trouble sleeping",
      "Often tired",
      "Nightmares or unrest",
      "Prefer not to say",
    ],
  },
  {
    id: "short-3",
    prompt: "Is there anything else you want the team to know right now?",
    options: [
      "I feel safe today",
      "I'm worried about safety",
      "I'd like a follow-up",
      "I'm okay for now",
      "Prefer not to say",
    ],
  },
];

/** Six questions — long scrollable form. */
export const LONG_FOLLOWUP_QUESTIONS: WellnessQuestion[] = [
  {
    id: "long-1",
    prompt: "In the past week, what best describes your overall mood?",
    options: [
      "Mostly positive",
      "Mixed up and down",
      "Mostly low or heavy",
      "Numb or shut down",
      "Prefer not to say",
    ],
  },
  {
    id: "long-2",
    prompt: "What has been hardest lately? (Select any that apply.)",
    options: [
      "Housing or stability",
      "Money or work",
      "Family or relationships",
      "Health or substance use",
      "Loneliness or isolation",
      "Something I'd rather not specify",
    ],
  },
  {
    id: "long-3",
    prompt: "How connected do you feel to support here?",
    options: [
      "Very connected",
      "Somewhat connected",
      "Not sure yet",
      "Not very connected",
      "Prefer not to say",
    ],
  },
  {
    id: "long-4",
    prompt: "What helps you feel grounded? (Select any.)",
    options: [
      "Routine or structure",
      "Faith or spiritual practice",
      "Music or art",
      "Exercise or movement",
      "Talking with others",
      "Time alone",
    ],
  },
  {
    id: "long-5",
    prompt: "Any changes in appetite or energy this week?",
    options: [
      "Eating more than usual",
      "Eating less than usual",
      "More energy",
      "Less energy",
      "About the same",
      "Prefer not to say",
    ],
  },
  {
    id: "long-6",
    prompt: "Anything else you want staff to know? (Select any.)",
    options: [
      "I'm grateful for support",
      "I need more help soon",
      "I want to be left alone today",
      "I'd like information about programs",
      "No, not right now",
    ],
  },
];
