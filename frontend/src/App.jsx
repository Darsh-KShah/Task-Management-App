// App.jsx with improvements
import { useState, useEffect } from "react";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import Celebration from "./components/Celebration";
import { AnimatePresence, motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { fetchTasks, createTask, updateTask, toggleTaskCompletion, deleteTask } from "./services/api";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load tasks from the backend on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const data = await fetchTasks();
        setTodos(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "false" ? false : true;
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const addTodo = async (text, priority) => {
    if (text.trim() === "") return;
    
    try {
      setIsLoading(true);
      const newTodo = await createTask({ text, priority, completed: false });
      setTodos([newTodo, ...todos]);
      setError(null);
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo._id === id);
      if (!todoToUpdate) return;

      // Only proceed with API call if we're changing the status
      setIsLoading(true);
      const updatedTodo = await toggleTaskCompletion(id, !todoToUpdate.completed);
      
      setTodos(
        todos.map((todo) => {
          if (todo._id === id) {
            return updatedTodo;
          }
          return todo;
        })
      );
      
      // Only show celebration when a task is being completed (not when unchecking)
      if (!todoToUpdate.completed && updatedTodo.completed) {
        setShowCelebration(true);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to toggle task completion:', err);
      setError('Failed to update task status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  const deleteTodoItem = async (id) => {
    try {
      setIsLoading(true);
      await deleteTask(id);
      setTodos(todos.filter((todo) => todo._id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id, newText, newPriority) => {
    try {
      setIsLoading(true);
      const updatedTodo = await updateTask(id, { 
        text: newText, 
        priority: newPriority 
      });
      
      setTodos(
        todos.map((todo) => {
          if (todo._id === id) {
            return updatedTodo;
          }
          return todo;
        })
      );
      setError(null);
    } catch (err) {
      console.error('Failed to update task:', err);
      setError('Failed to update task. Please try again.');
    } finally {
      setIsLoading(false);
      setEditingId(null);
    }
  };

  const startEditing = (id) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const filteredTodos = todos
    .filter((todo) => {
      // Status filter
      if (filter === "active" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;
      
      // Priority filter
      if (priorityFilter !== "all" && todo.priority !== priorityFilter) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed - b.completed;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  // Empty state messages
  const getEmptyStateMessage = () => {
    if (isLoading) return "Loading tasks...";
    if (error) return error;
    
    // Priority + Status combined message
    if (filteredTodos.length === 0) {
      let statusMsg = filter === "all" ? "" : filter === "active" ? "active " : "completed ";
      let priorityMsg = priorityFilter === "all" ? "" : `${priorityFilter} priority `;
      
      return `No ${priorityMsg}${statusMsg}tasks found`;
    }
    return null;
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <div className="app-header">
        <h1>To-Do List 📝</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
      
      <TodoInput onAdd={addTodo} darkMode={darkMode} />

      <div className="filters">
        <div className="status-filters">
          <span>Progress: </span>
          <button
            onClick={() => setFilter("all")}
            className={filter === "all" ? "active" : ""}
          >
            All
          </button>
          <button
            onClick={() => setFilter("active")}
            className={filter === "active" ? "active" : ""}
          >
            Active
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={filter === "completed" ? "active" : ""}
          >
            Completed
          </button>
        </div>
        
        <div className="priority-filters">
          <span>Priority: </span>
          <button
            onClick={() => setPriorityFilter("all")}
            className={priorityFilter === "all" ? "active" : ""}
            style={{ marginLeft: "8px" }}
          >
            All
          </button>
          <button
            onClick={() => setPriorityFilter("high")}
            className={priorityFilter === "high" ? "active high" : ""}
            style={{ marginLeft: "4px" }}
          >
            High
          </button>
          <button
            onClick={() => setPriorityFilter("medium")}
            className={priorityFilter === "medium" ? "active medium" : ""}
            style={{ marginLeft: "4px" }}
          >
            Medium
          </button>
          <button
            onClick={() => setPriorityFilter("low")}
            className={priorityFilter === "low" ? "active low" : ""}
            style={{ marginLeft: "4px" }}
          >
            Low
          </button>
        </div>
      </div>

      <div className="todo-list">
        <AnimatePresence>
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={{
                  ...todo,
                  id: todo._id // Ensure the id property is available for TodoItem
                }}
                onToggle={toggleComplete}
                onDelete={deleteTodoItem}
                onEdit={startEditing}
                onUpdate={updateTodo}
                onCancelEdit={cancelEditing}
                isEditing={editingId === todo._id}
                darkMode={darkMode}
              />
            ))
          ) : (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {getEmptyStateMessage()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration component */}
      <Celebration 
        show={showCelebration} 
        onComplete={handleCelebrationComplete} 
      />
    </div>
  );
}

export default App;