import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/AuthContext";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/reusableFunction";

interface Question {
  id: number;
  text: string;
  answers: { username: string; answer: string }[];
}

const Answers: React.FC = () => {
  const storedQuestions = loadFromLocalStorage<Question[]>("questions") || [];
  const [questions, setQuestions] = useState<Question[]>(storedQuestions);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editingAnswer, setEditingAnswer] = useState<{
    questionId: number;
    answerIndex: number;
  } | null>(null);
  const [answerText, setAnswerText] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    saveToLocalStorage("questions", questions);
  }, [questions]);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const startEditing = (
    questionId: number,
    answerIndex: number,
    currentAnswer: string
  ) => {
    setEditingAnswer({ questionId, answerIndex });
    setAnswerText((prev) => ({ ...prev, [questionId]: currentAnswer }));
  };

  const saveEdit = () => {
    if (editingAnswer !== null) {
      const { questionId, answerIndex } = editingAnswer;
      const updatedQuestions = questions.map((q) => {
        if (q.id === questionId) {
          const updatedAnswers = q.answers.map((a, index) => {
            if (index === answerIndex) {
              return { ...a, answer: answerText[questionId] || "" };
            }
            return a;
          });
          return { ...q, answers: updatedAnswers };
        }
        return q;
      });
      setQuestions(updatedQuestions);
      setEditingAnswer(null);
      setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
    }
  };

  const addAnswer = (questionId: number) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [
            ...q.answers,
            {
              username: user?.username || "",
              answer: answerText[questionId] || "",
            },
          ],
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    setAnswerText((prev) => ({ ...prev, [questionId]: "" }));
  };

  const handleChange = (questionId: number, value: string) => {
    setAnswerText((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h2 className="text-2xl mb-4">Answer Questions</h2>
        <button className="p-2 bg-blue-500 text-white" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <ul className="mt-4">
        {questions.map((q) => {
          const userAnswer = q.answers.find(
            (a) => a.username === user?.username
          );
          return (
            <li key={q.id} className="p-2 mb-2 border-b">
              <strong>{q.text}</strong>
              {userAnswer ? (
                <div className="mt-2">
                  {editingAnswer &&
                  editingAnswer.questionId === q.id &&
                  editingAnswer.answerIndex ===
                    q.answers.indexOf(userAnswer) ? (
                    <div>
                      <input
                        type="text"
                        value={answerText[q.id] || ""}
                        onChange={(e) => handleChange(q.id, e.target.value)}
                        className="w-full p-2 mb-2 border"
                      />
                      <button
                        className="p-2 bg-green-500 text-white mr-2"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="p-2 bg-gray-500 text-white"
                        onClick={() => setEditingAnswer(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p>{userAnswer.answer}</p>
                      <button
                        className="p-2 bg-yellow-500 text-white"
                        onClick={() =>
                          startEditing(
                            q.id,
                            q.answers.indexOf(userAnswer),
                            userAnswer.answer
                          )
                        }
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <input
                    type="text"
                    value={answerText[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full p-2 mb-2 border"
                  />
                  <button
                    className="p-2 bg-green-500 text-white"
                    onClick={() => addAnswer(q.id)}
                  >
                    Submit
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Answers;
