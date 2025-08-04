// App.jsx with improvements and routing
import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TodoInput from "./components/TodoInput";
import TodoItem from "./components/TodoItem";
import Celebration from "./components/Celebration";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { FaMoon, FaSun } from "react-icons/fa";
import { fetchTasks, createTask, updateTask, toggleTaskCompletion, deleteTask } from "./services/api";
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  // Protected component that redirects to login if not authenticated
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Load tasks from the backend when user is logged in
  useEffect(() => {
    if (currentUser) {
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
    }
  }, [currentUser]);

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

  // Todo app main component
  const TodoApp = () => (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <Header />
      
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
                  id: todo._id
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

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <TodoApp />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;