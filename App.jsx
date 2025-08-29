import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load todos from localStorage
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
      // Fallback to empty array
      setTodos([]);
    }
  }, []);

  // Save todos to local Storage
  useEffect(() => {
    try {
      if (todos.length > 0) {
        localStorage.setItem("todos", JSON.stringify(todos));
      } else {
        localStorage.removeItem("todos");
      }
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
        },
      ]);
      setNewTodo("");
    }
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText.trim() } : todo
        )
      );
    }
    setEditingId(null);
    setEditText("");
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const clearAll = () => {
    setTodos([]);
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gray-300 py-8 px-4">
      <div className="max-w-2xl mx-auto text-black">
        <div className="bg-gray-600 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-indigo-600 p-6 text-white">
            <h1 className="text-3xl font-bold text-center">To-Do List</h1>
            <p className="text-center mt-2 opacity-90">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>

          {/* Add new todo */}
          <div className="p-6 border-b border-gray-100 text-white">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, addTodo)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>
          </div>

          {/* Todo list */}
          <div className="p-6">
            {todos.length === 0 ? (
              <div className="text-center py-12 text-white">
                <p className="text-xl">No tasks yet</p>
                <p className="text-sm mt-2">Add a task above to get started!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      todo.completed
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={() => toggleComplete(todo.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        todo.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {todo.completed && <Check size={16} />}
                    </button>

                    {/* Todo text */}
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) =>
                            handleKeyPress(e, () => saveEdit(todo.id))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`text-lg ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-gray-800"
                          }`}
                        >
                          {todo.text}
                        </span>
                      )}
                    </div>

                    {/* buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === todo.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(todo.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                            title="Save"
                          >
                            <Check size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(todo.id, todo.text)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* footer */}
          {todos.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>
                  {todos.filter((t) => !t.completed).length} remaining
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={clearAll}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-all"
                  >
                    Clear All
                  </button>
                </div>
                <span>{completedCount} completed</span>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
