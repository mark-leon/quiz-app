import React, { useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/reusableFunction";
import { useAuth } from "../../context/authContext/AuthContext";

interface Question {
  id: number;
  text: string;
  answers: { username: string; answer: string }[];
}

const Answers: React.FC = () => {
  const storedQuestions = loadFromLocalStorage<Question[]>("questions") || [];
  const [questions, setQuestions] = useState<Question[]>(storedQuestions);

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const { user } = useAuth();

  useEffect(() => {
    saveToLocalStorage("questions", questions);
  }, [questions]);

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
  };

  return (
    <div className="p-4">
      <div className="flex justify-around">
        <h2 className="text-2xl mb-4">Answer Questions</h2>
        <button
          className="p-2 bg-blue-500 text-white"
          //   onClick={() => logout()}
        >
          Logout
        </button>
      </div>

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
