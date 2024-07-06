import React, { useState, useEffect } from "react";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
} from "../../utils/reusableFunction";

interface Question {
  id: number;
  text: string;
  answers: { username: string; answer: string }[];
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    const storedQuestions = loadFromLocalStorage<Question[]>("questions");
    if (storedQuestions) {
      setQuestions(storedQuestions);
    }
  }, []);

  useEffect(() => {
    saveToLocalStorage("questions", questions);
  }, [questions]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), text: newQuestion, answers: [] },
    ]);
    setNewQuestion("");
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const startEditing = (id: number, currentText: string) => {
    setEditingQuestion(id);
    setEditingText(currentText);
  };

  const saveEdit = (id: number) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, text: editingText } : q))
    );
    setEditingQuestion(null);
    setEditingText("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Manage Questions</h2>
      <input
        type="text"
        placeholder="Add new question"
        className="w-full p-2 mb-2 border"
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
      />
      <button className="p-2 bg-green-500 text-white" onClick={addQuestion}>
        Add Question
      </button>
      <ul className="mt-4">
        {questions.map((q) => (
          <li key={q.id} className="p-2 mb-2 border-b">
            {editingQuestion === q.id ? (
              <>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full p-2 mb-2 border"
                />
                <button
                  className="p-2 bg-blue-500 text-white mr-2"
                  onClick={() => saveEdit(q.id)}
                >
                  Save
                </button>
                <button
                  className="p-2 bg-gray-500 text-white"
                  onClick={() => setEditingQuestion(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                {q.text}
                <button
                  className="ml-2 p-1 bg-yellow-500 text-white"
                  onClick={() => startEditing(q.id, q.text)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 p-1 bg-red-500 text-white"
                  onClick={() => deleteQuestion(q.id)}
                >
                  Delete
                </button>
              </>
            )}
            <ul className="mt-2">
              {q.answers.map((a, index) => (
                <li key={index} className="p-1 border-b">
                  <strong>{a.username}:</strong> {a.answer}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;
