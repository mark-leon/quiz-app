import React, { useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/localStorage";
import { useAuth } from "../../context/AuthContext";

interface Question {
  id: number;
  text: string;
  answers: { username: string; answer: string }[];
}

const Answers: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    const storedQuestions = loadFromLocalStorage<Question[]>("questions");
    if (storedQuestions) {
      setQuestions(storedQuestions);
    }
  }, []);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const saveAnswer = (questionId: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        const userAnswer = q.answers.find((a) => a.username === user?.username);
        if (userAnswer) {
          userAnswer.answer = answers[questionId];
        } else {
          q.answers.push({
            username: user!.username,
            answer: answers[questionId],
          });
        }
      }
      return q;
    });
    setQuestions(updatedQuestions);
    saveToLocalStorage("questions", updatedQuestions);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Answer Questions</h2>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <p className="mb-2">{q.text}</p>
          <input
            type="text"
            placeholder="Your answer"
            className="w-full p-2 mb-2 border"
            value={
              answers[q.id] ||
              q.answers.find((a) => a.username === user?.username)?.answer ||
              ""
            }
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />
          <button
            className="p-2 bg-blue-500 text-white"
            onClick={() => saveAnswer(q.id)}
          >
            Submit Answer
          </button>
        </div>
      ))}
    </div>
  );
};

export default Answers;
