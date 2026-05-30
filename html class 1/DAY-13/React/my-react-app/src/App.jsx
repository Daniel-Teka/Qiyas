import { useState } from "reac; 

function App() {
  return (
    <div className="app-card">
      <h1>Hello World</h1>
    </div>
  );
}

//export default App;
function ToDoList() {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");

  function changeName() {
    setDisplayName(name);
    setName(""); // Optional: Clears the input field after submitting
  }

  return (
    <div className="todo-container">
      <h1 className="hero">Hello {displayName}</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Enter your name..."
          value={name} 
          onChange={(event) => setName(event.target.value)} 
        />
        <button onClick={changeName}>Submit</button>
      </div>
    </div>
  );
}

export default ToDoList;
//without it wll be the index.html file that will be rendered, with it the ToDoList component will be rendered.