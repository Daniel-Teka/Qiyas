import React, { useState, useCallback } from 'react';
import './App.css'; // 👈 Import your CSS here


// 1. የልጅ ኮምፖነንት (Child Component)
// React.memo ፕሮፕስ (Props) ካልተቀየሩ በስተቀር ኮምፖነንቱ ድጋሚ እንዳይሳል ይከለክላል።
const ChildComponent = React.memo(({ onClick }) => {
  console.log("የልጅ ኮምፖነንት ድጋሚ ተሳለ (Child Rendered) ❌");
  
  return (
    <div className='flex items-center gap-4 rounded-lg bg-white p-6 shadow-md outline outline-black/5 dark:bg-gray-800'>
    <button className="child-btn" onClick={onClick}>
      እዚህ ይጫኑ (Child Button)
    </button>
    </div>
  );
});

// 2. የአባት ኮምፖነንት (Parent Component)
function ParentWithCallback() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // መፍትሄ፡ ፈንክሽኑን በ useCallback ማቀፍ
  // የ Dependency Arrayው [] በመሆኑ ፈንክሽኑ በየሬንደሩ አዲስ አድራሻ አይዝም (Memoized ይሆናል)
  const handleClick = useCallback(() => {
    console.log("ቁልፉ ተጭኗል!");
  }, []); 

  return (
    <div className="parent-container">
      <h2>በ useCallback የተስተካከለ</h2>
      
      <div className="counter-section">
        <p>ቆጣሪ (Count): <strong>{count}</strong></p>
        <button onClick={() => setCount(prev => prev + 1)}>ቁጥር ጨምር (+1)</button>
      </div>
      
      <div className="input-section">
        <input 
          type="text" 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="ፅሁፍ እዚህ ይጻፉ..."
        />
      </div>
      
      {/* አሁን የ input ፅሁፍ ሲቀየር ይህ ኮምፖነንት በከንቱ ድጋሚ አይሳልም */}
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

export default ParentWithCallback;



