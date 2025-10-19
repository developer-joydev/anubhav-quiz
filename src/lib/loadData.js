const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;
export const fetchSubjects = async () => {
  const res = await fetch(SERVER_API_URL + "/api/subjects");
  const subjectList = await res.json();
  return subjectList?.data || [];
};

export const fetchTopics = async () => {
  const res = await fetch(SERVER_API_URL + "/api/quizzes");
  const topicList = await res.json();
  return topicList?.data || [];
};

export const fetchTopicById = async (topicId) => {
  const res = await fetch(`${SERVER_API_URL}/api/quizzes/${topicId}`);
  const topicData = await res.json();
  return topicData?.data || null;
};

export const fetchQuestionsBySubject = async (subject) => {
  const res = await fetch(`${SERVER_API_URL}/api/questions?subject=${subject}`);
  const questionList = await res.json();
  return questionList?.data || [];
};

// USING
export const fetchSubjectById = async (subjectId) => {
  const res = await fetch(`${SERVER_API_URL}/api/subjects/${subjectId}`);
  const subjectData = await res.json();
  return subjectData?.data || null;
};

// USING
export const fetchQuestionsByTopic = async (topicId) => {
  const res = await fetch(`${SERVER_API_URL}/api/questions/${topicId}`);
  const questionsByTopic = await res.json();
  return questionsByTopic?.data || [];
};

// USING
export const submitAnswer = async (answers) => {
  const response = await fetch(`${SERVER_API_URL}/api/questions/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answers),
  });

  const result = await response.json();
  return result || [];
};

export const fetchResults = async (topicId) => {
  const res = await fetch(`${SERVER_API_URL}/api/questions/${topicId}/results`);
  const result = await res.json();
  return result?.data || [];
};

export const fetchAllQuestions = async () => {
  const res = await fetch(SERVER_API_URL + "/api/questions");
  const questionList = await res.json();
  return questionList?.data || [];
};

export const fetchQuestionsCountBySubject = async (subject) => {
  const res = await fetch(`${SERVER_API_URL}/api/questions?subject=${subject}`);
  const questionList = await res.json();
  return questionList?.data.length || 0;
};
