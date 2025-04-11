import { useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoMdArrowDropdown } from "react-icons/io";

function TodoInput({ onAdd }) {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(input, priority);
    setInput("");
    setPriority("medium");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a task..."
      />
      <div className="select-wrapper">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="priority-dropdown"
        >
          <option value="high">🔥 High</option>
          <option value="medium">⚡ Medium</option>
          <option value="low">🌱 Low</option>
        </select>
        <IoMdArrowDropdown className="dropdown-icon" />
      </div>
      <button type="submit" className="add-btn">
        <AiOutlinePlusCircle size={25} />
      </button>
    </form>
  );
}

export default TodoInput;
