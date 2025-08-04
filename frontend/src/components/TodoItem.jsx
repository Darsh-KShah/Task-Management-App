// TodoItem.jsx with edit feature and animations
import { useState } from "react";
import { motion } from "framer-motion";
import { FaFire, FaBolt, FaLeaf, FaEdit, FaSave, FaTimes } from "react-icons/fa";

const getPriorityIcon = (priority) => {
  switch (priority) {
    case "high":
      return <FaFire color="#e74c3c" />;
    case "medium":
      return <FaBolt color="#f39c12" />;
    case "low":
      return <FaLeaf color="#2ecc71" />;
    default:
      return null;
  }
};

function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onUpdate, 
  onCancelEdit, 
  isEditing,
  darkMode 
}) {
  // Use todo.id which is mapped from MongoDB's _id in the App component
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    if (editText.trim() === "") return;
    onUpdate(todo.id, editText, editPriority);
  };

  // Animation variants
  const checkmarkAnimation = {
    unchecked: { pathLength: 0 },
    checked: { 
      pathLength: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -300, transition: { duration: 0.5 } },
    incomplete: { opacity: 1 },
    complete: { 
      opacity: 0.7,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.li
      className={`todo-item ${todo.completed ? "completed" : ""} ${darkMode ? "dark" : ""}`}
      variants={itemVariants}
      initial="initial"
      animate={todo.completed ? "complete" : "animate"}
      exit="exit"
      layout
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30,
        layout: { duration: 0.1 }
      }}
    >
      {isEditing ? (
        // Edit mode
        <div className="edit-mode">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="edit-input"
            autoFocus
          />
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="priority-edit-dropdown"
          >
            <option value="high">🔥 High</option>
            <option value="medium">⚡ Medium</option>
            <option value="low">🌱 Low</option>
          </select>
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn" title="Save">
              <FaSave />
            </button>
            <button onClick={onCancelEdit} className="cancel-btn" title="Cancel">
              <FaTimes />
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <>
          <span className="left-content">
            <div className="checkbox-wrapper" onClick={() => onToggle(todo.id)}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
                id={`todo-${todo.id}`}
              />
              <motion.svg
                className="checkmark"
                viewBox="0 0 24 24"
                initial="unchecked"
                animate={todo.completed ? "checked" : "unchecked"}
              >
                <motion.path
                  d="M4 12l6 6L20 6"
                  fill="transparent"
                  strokeWidth="3"
                  stroke={darkMode ? "#81ecec" : "#00a8ff"}
                  strokeLinecap="round"
                  variants={checkmarkAnimation}
                />
              </motion.svg>
            </div>
            <span className={`todo-text priority-${todo.priority}`}>
              {todo.text}
            </span>
          </span>
          <div className="right-actions">
            <span className="priority-icon">{getPriorityIcon(todo.priority)}</span>
            <button onClick={() => onEdit(todo.id)} className="edit-btn" title="Edit">
              <FaEdit />
            </button>
            <motion.button 
              onClick={() => onDelete(todo.id)}
              className="delete-btn"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              title="Delete"
            >
              ❌
            </motion.button>
          </div>
        </>
      )}
    </motion.li>
  );
}

export default TodoItem;