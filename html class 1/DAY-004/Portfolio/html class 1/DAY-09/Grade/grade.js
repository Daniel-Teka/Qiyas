// 1. Global history tracking array
let gradeHistory = [];

function calculateGrade() {
  // 2. Fetch DOM values
  const studentId = document.getElementById("studentId").value;
  const studentName = document.getElementById("studentName").value;
  const course = document.getElementById("course").value;
  
  const assignment = Number(document.getElementById("assignment").value);
  const final = Number(document.getElementById("final").value);
  const test = Number(document.getElementById("test").value);
  const resultDiv = document.getElementById("result");

  // 3. Validation rule checks
  if (assignment > 30) {
    resultDiv.innerText = "Error: Assignment score cannot exceed 30%";
    return;
  }
  if (final > 50) {
    resultDiv.innerText = "Error: Final exam score cannot exceed 50%";
    return;
  }
  if (test > 20) {
    resultDiv.innerText = "Error: Test score cannot exceed 20%";
    return;
  }

  // 4. Calculate total score percentage
  const totalScore = assignment + final + test;
  let grade = "";

  // 5. Conditional grading logic hierarchy
  if (totalScore >= 90) {
    grade = "A";
  } else if (totalScore >= 80) {
    grade = "B";
  } else if (totalScore >= 70) {
    grade = "C";
  } else if (totalScore >= 60) {
    grade = "D";
  } else {
    grade = "F";
  }

  // 6. Output localized text block results
  resultDiv.innerText = `Student ID: ${studentId}\nName: ${studentName}\nCourse: ${course}\nTotal Score: ${totalScore}%\nGrade: ${grade}`;

  // 7. Store student object inside dataset array
  gradeHistory.push({
    id: studentId,
    name: studentName,
    course: course,
    total: totalScore,
    grade: grade
  });

  // 8. Execute list generation view updates
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById("historyList");
  
  // Wipe container clear before execution loops trace elements
  historyList.innerHTML = "";

  // Loop backward (from last item down to 0) to put newest entries at the top
  for (let i = gradeHistory.length - 1; i >= 0; i--) {
    const item = gradeHistory[i];
    const liNode = document.createElement("li");
    
    const textNode = document.createTextNode(
      `ID: ${item.id} | ${item.name} (${item.course}) ➔ Total: ${item.total}% [Grade: ${item.grade}]`
    );
    
    liNode.appendChild(textNode);
    historyList.appendChild(liNode);
  }
}
