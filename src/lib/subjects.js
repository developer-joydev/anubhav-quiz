export const subjects = [
  {
    id: "bengali",
    name: "Bengali",
    description: "Test your knowledge of Bengali language and literature",
    icon: "📚",
    color: "from-blue-500 to-blue-600",
    questionCount: 15,
  },
  {
    id: "english",
    name: "English",
    description: "Improve your English grammar and vocabulary skills",
    icon: "🔤",
    color: "from-green-500 to-green-600",
    questionCount: 20,
  },
  {
    id: "science",
    name: "Science",
    description: "Explore physics, chemistry, and biology concepts",
    icon: "🔬",
    color: "from-purple-500 to-purple-600",
    questionCount: 25,
  },
  {
    id: "computer",
    name: "Computer",
    description: "Challenge yourself with computer problems",
    icon: "💻",
    color: "from-red-500 to-red-600",
    questionCount: 18,
  },
  {
    id: "math",
    name: "Mathematics",
    description: "Challenge yourself with mathematics problems",
    icon: "🧮",
    color: "from-yellow-500 to-red-600",
    questionCount: 18,
  },
];

export const getSubjectById = (id) => {
  return subjects.find((subject) => subject.id === id);
};
