import { useState } from 'react'
/*get started with Vite + React! */
//
//
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

//

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
      
      </>
  )
}
/*
function setTimeout(() => {
  Counter()
}, 1000)

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
export { Counter }



function todolist() {
  const [tasks, setTasks] = useState([])// set tasks to an empty array  //useState is a hook that allows you to add state to a functional component in React. In this case, we are using useState to create a state variable called tasks and a function called setTasks to update that state. The initial value of tasks is set to an empty array, which means that when the component first renders, there will be no tasks in the to-do list.  
  const [inputValue, setInputValue] = useState('')//add display input value in the input field
  const [displayname, setDisplayName] = useState('')//add display name in the input field

  const addTask = () => {
    if (inputValue.trim() !== '') {
      setTasks([...tasks, inputValue])
      setInputValue('')
    }
  }

  return (
    //fragment <> </>

    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
       // value={name}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}//e is object that represents the event that occurred, in this case, the change event on the input field. e.target refers to the element that triggered the event, which is the input field. e.target.value retrieves the current value of the input field.
        placeholder="Add a new task"
      />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
    </div>
  )
}   
//dom manipulation is the process of using JavaScript to interact with and modify the structure, style, and content of a web page. The Document Object Model (DOM) is a programming interface for web documents that represents the page as a tree of objects. With DOM manipulation, you can dynamically change the content, structure, and style of a web page without needing to reload it. This allows for interactive and responsive user experiences.
export { todolist }
*/
export default App

/*
export default { Counter, todolist }

//useState is a hook that allows you to add state to a functional component in React. It returns an array with two elements: the current state value and a function to update that state. In the code snippet, useState is used to create state variables for tasks, inputValue, and displayname, along with their corresponding setter functions (setTasks, setInputValue, setDisplayName). This allows the component to manage and update its state as needed.
//usestate function is used to create state variables in a functional component. It takes an initial value as an argument and returns an array with two elements: the current state value and a function to update that state. In the provided code, useState is used to create state variables for tasks, inputValue, and displayname, allowing the component to manage and update its state as needed.

// person 1, person 2 useState make code onthis
function Person() {
  const [name, setName] = useState('')//set name to an empty string

  return (
    <div>
      <h1>Person</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}//e is object that represents the event that occurred, in this case, the change event on the input field. e.target refers to the element that triggered the event, which is the input field. e.target.value retrieves the current value of the input field.
        placeholder="Enter your name"
      />
      <p>Your name is: {name}</p>
    </div>
  )
}
export { Person }//shows the name that is entered in the input field and updates it as the user types. The useState hook is used to create a state variable called name and a function called setName to update that state. The input field's value is bound to the name state, and the onChange event handler updates the name state whenever the user types in the input field. The current value of name is also displayed in a paragraph below the input field.

// person 1, person 2 useState a mail make code onthis
function Email() {
  const [email, setEmail] = useState('email@example.com')//set email to an empty string
  return (
    <div>
      <h1>Email</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <p>Your email is: {email}</p>
    </div>
  )
}
export { Email }    
