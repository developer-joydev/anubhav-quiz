export const sampleQuestions = {
  bengali: [
    {
      Question: "কবিগুরু রবীন্দ্রনাথ ঠাকুরের জন্মসাল কত?",
      OptionA: "১৮৬১",
      OptionB: "১৮৬৫",
      OptionC: "১৮৭১",
      OptionD: "১৮৮১",
      CorrectAnswer: "A",
      UserAnswer: "",
    },
    {
      Question: "বাংলা সাহিত্যের প্রথম মহিলা কবি কে?",
      OptionA: "বেগম রোকেয়া",
      OptionB: "কামিনী রায়",
      OptionC: "চন্দ্রাবতী",
      OptionD: "সুফিয়া কামাল",
      CorrectAnswer: "C",
      UserAnswer: "",
    },
    {
      Question: "‘পদ্মাবতী’ নাটকটির রচয়িতা কে?",
      OptionA: "মাইকেল মধুসূদন দত্ত",
      OptionB: "রবীন্দ্রনাথ ঠাকুর",
      OptionC: "দীনবন্ধু মিত্র",
      OptionD: "মীর মশাররফ হোসেন",
      CorrectAnswer: "D",
      UserAnswer: "",
    },
  ],

  english: [
    {
      Question: "Choose the correct sentence:",
      OptionA: "She don't like apples",
      OptionB: "She doesn't likes apples",
      OptionC: "She doesn't like apples",
      OptionD: "She don't likes apples",
      CorrectAnswer: "C",
      UserAnswer: "",
    },
    {
      Question: "What is the synonym of 'Happy'?",
      OptionA: "Sad",
      OptionB: "Joyful",
      OptionC: "Angry",
      OptionD: "Tired",
      CorrectAnswer: "B",
      UserAnswer: "",
    },
    {
      Question: "Which word is a noun?",
      OptionA: "Beautiful",
      OptionB: "Run",
      OptionC: "Happiness",
      OptionD: "Quickly",
      CorrectAnswer: "C",
      UserAnswer: "",
    },
  ],

  science: [
    {
      Question: "What is the chemical symbol for Gold?",
      OptionA: "Go",
      OptionB: "Gd",
      OptionC: "Au",
      OptionD: "Ag",
      CorrectAnswer: "C",
      UserAnswer: "",
    },
    {
      Question: "Which planet is known as the Red Planet?",
      OptionA: "Venus",
      OptionB: "Mars",
      OptionC: "Jupiter",
      OptionD: "Saturn",
      CorrectAnswer: "B",
      UserAnswer: "",
    },
    {
      Question: "What is the powerhouse of the cell?",
      OptionA: "Nucleus",
      OptionB: "Mitochondria",
      OptionC: "Ribosome",
      OptionD: "Endoplasmic Reticulum",
      CorrectAnswer: "B",
      UserAnswer: "",
    },
  ],

  math: [
    {
      Question: "What is the value of π (pi) approximately?",
      OptionA: "3.14",
      OptionB: "2.71",
      OptionC: "1.61",
      OptionD: "3.16",
      CorrectAnswer: "A",
      UserAnswer: "",
    },
    {
      Question: "Solve: 2x + 5 = 15",
      OptionA: "x = 5",
      OptionB: "x = 10",
      OptionC: "x = 7.5",
      OptionD: "x = 2.5",
      CorrectAnswer: "A",
      UserAnswer: "",
    },
    {
      Question: "What is the area of a circle with radius 7cm?",
      OptionA: "44 cm²",
      OptionB: "154 cm²",
      OptionC: "49 cm²",
      OptionD: "22 cm²",
      CorrectAnswer: "B",
      UserAnswer: "",
    },
  ],
};

export const getSampleQuestions = (subject) => {
  return sampleQuestions[subject] || sampleQuestions.english;
};
