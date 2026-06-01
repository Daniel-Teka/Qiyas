// use state to store the current value of the calculator
import React, { useState } from 'react'; // 

function App() {
  const [number1, setNumber1] = useState(""); // setNumber1 is a function that updates the value of number1
  const [operator1, setOperator1] = useState("");
  const [number2, setNumber2] = useState("");
  const [operator2, setOperator2] = useState("");
  const [number3, setNumber3] = useState("");
  const [result, setResult] = useState(0);

  const handleNumberClick = (number) => {
    if (operator1 === "") {
      setNumber1(number1 + number);
    } else if (operator2 === "") {
      setNumber2(number2 + number);
    } else {
      setNumber3(number3 + number);
    }
  };

  const handleOperatorClick = (operator) => {
    if (operator1 === "") {
      setOperator1(operator);
    } else if (operator2 === "") {
      setOperator2(operator);
    }
  };

  const calculateResult = () => {
    let intermediateResult;
    if (operator1 === "+") {
      intermediateResult = parseFloat(number1) + parseFloat(number2);
    } else if (operator1 === "-") {
      intermediateResult = parseFloat(number1) - parseFloat(number2);
    } else if (operator1 === "*") {
      intermediateResult = parseFloat(number1) * parseFloat(number2);
    } else if (operator1 === "/") {
      intermediateResult = parseFloat(number1) / parseFloat(number2);
    }

    if (operator2 === "+") {
      setResult(intermediateResult + parseFloat(number3));
    } else if (operator2 === "-") {
      setResult(intermediateResult - parseFloat(number3));
    } else if (operator2 === "*") {
      setResult(intermediateResult * parseFloat(number3));
    } else if (operator2 === "/") {
      setResult(intermediateResult / parseFloat(number3));
    } else {
      setResult(intermediateResult);
    }
  };

  return (
    <>
      <h1>Simple Calculator</h1>
      <div>
        <input type="text" value={number1} onChange={(e) => setNumber1(e.target.value)} /> // it  cannt imput number1 because it is a string and we need to convert it to a number before we can use it in calculations
        <input type="text" value={operator1} onChange={(e) => setOperator1(e.target.value)} />
        <input type="text" value={number2} onChange={(e) => setNumber2(e.target.value)} />
        <input type="text" value={operator2} onChange={(e) => setOperator2(e.target.value)} />
        <input type="text" value={number3} onChange={(e) => setNumber3(e.target.value)} />
      </div>
      <div>
        <button onClick={() => handleNumberClick("1")}>1</button>
        <button onClick={() => handleNumberClick("2")}>2</button>
        <button onClick={() => handleNumberClick("3")}>3</button>
        <button onClick={() => handleNumberClick("4")}>4</button>
        <button onClick={() => handleNumberClick("5")}>5</button>
        <button onClick={() => handleNumberClick("6")}>6</button>
        <button onClick={() => handleNumberClick("7")}>7</button>
        <button onClick={() => handleNumberClick("8")}>8</button>
        <button onClick={() => handleNumberClick("9")}>9</button>
        <button onClick={() => handleNumberClick("0")}>0</button>
      </div>
      <div>
        <button onClick={() => handleOperatorClick("+")}>+</button>
        <button onClick={() => handleOperatorClick("-")}>-</button>
        <button onClick={() => handleOperatorClick("*")}>*</button>
        <button onClick={() => handleOperatorClick("/")}>/</button>
      </div>
      <div>
        <button onClick={calculateResult}>=</button>
      </div>
      <h2>Result: {result}</h2>
    </>
  );
}

export default App;