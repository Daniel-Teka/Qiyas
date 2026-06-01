function calculateGrade() {
  // 1. Get input values from the text fields and dropdown
  const studentId = document.getElementById("studentId").value;
  const studentName = document.getElementById("studentName").value;
  const course = document.getElementById("course").value;
  
  // 2. Get scores and convert them to numbers
  const assignment = Number(document.getElementById("assignment").value);
  const final = Number(document.getElementById("final").value);
  const test = Number(document.getElementById("test").value);
  const resultDiv = document.getElementById("result");

  // 3. Validation: Ensure scores do not exceed limits
  if (assignment > 30) {
    resultDiv.innerText = "Error: Assignment score cannot be greater than 30%";
    return;
  }
  if (final > 50) {
    resultDiv.innerText = "Error: Final exam score cannot be greater than 50%";
    return;
  }
  if (test > 20) {
    resultDiv.innerText = "Error: Test score cannot be greater than 20%";
    return;
  }

  // 4. Calculate total score (Max: 100)
  const totalScore = assignment + final + test;
  let grade = "";

  // 5. If-Else logic to determine the grade
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

  // 6. Display the complete result
  resultDiv.innerText = `Student ID: ${studentId}\nName: ${studentName}\nCourse: ${course}\nTotal Score: ${totalScore}%\nGrade: ${grade}`;
}
