import React, { useState, useEffect } from 'react';
function Counter() {
  const [count, setCount] = useState(0);

  // useEffect runs every time the 'count' state changes
  useEffect(() => {
    document.title = `You clicked ${count} times`;
    console.log(`The count is now ${count}`); // error is `
  },[]); // The dependency array tracks 'count'

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Counter App</h2>
      <h1>{count}</h1>
      
      {/* Increment Button */}
      <button onClick={() => setCount(count + 1)}> + </button>

      {/* Decrement Button */}
      <button onClick={() => setCount(count - 1)} style={{ margin: '0 10px' }}> - </button>

      {/* Reset Button */}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default Counter;