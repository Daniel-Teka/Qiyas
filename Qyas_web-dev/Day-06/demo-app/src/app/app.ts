import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showName = true;
  showSubject = true;
  showGrade = true;

  newName = '';
  newSubject = '';
  newGrade: number | null = null;

  students = [
    { name: 'Selam', subject: 'Maths', grade: 90, editMode: false },
    { name: 'Abebe', subject: 'English', grade: 85, editMode: false }
  ];

  addStudent() {
    if (this.newName && this.newGrade !== null) {
      this.students.push({
        name: this.newName,
        subject: this.newSubject,
        grade: this.newGrade,
        editMode: false
      });
      this.newName = ''; this.newSubject = ''; this.newGrade = null;
    }
  }

  deleteStudent(index: number) {
    this.students.splice(index, 1);
  }
}
