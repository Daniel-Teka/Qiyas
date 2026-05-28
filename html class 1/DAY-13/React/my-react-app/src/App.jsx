import { useState } from "react";
function ToDoList() {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  /*
  const handleChange = (event) => {
    setName(event.target.value);
  };
  */
 function changeName(event) {
  setDisplayName(name);
 }
  return (
    <>
    <h1>Hellow {displayName}</h1>
    <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
    <button onClick={changeName}>Submit</button>
    </>