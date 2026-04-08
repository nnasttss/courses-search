import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Course {
  id: number;
  title: string;
  category: string;
  duration: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="text-align: center; color: #2c3e50;">📚 Керування курсами</h1>
      
      <div style="background: #ecf0f1; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
        <h2 style="margin-top: 0;">Додати новий курс</h2>
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
          <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px;">Назва курсу:</label>
              <input type="text" formControlName="title" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
              <div *ngIf="courseForm.get('title')?.invalid && courseForm.get('title')?.touched" style="color: red; font-size: 12px;">Назва обов'язкова</div>
            </div>
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px;">Категорія:</label>
              <select formControlName="category" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                <option value="">Виберіть</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Мови програмування">Мови програмування</option>
              </select>
              <div *ngIf="courseForm.get('category')?.invalid && courseForm.get('category')?.touched" style="color: red; font-size: 12px;">Виберіть категорію</div>
            </div>
            <div style="flex: 1;">
              <label style="display: block; margin-bottom: 5px;">Тривалість (годин):</label>
              <input type="number" formControlName="duration" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
              <div *ngIf="courseForm.get('duration')?.invalid && courseForm.get('duration')?.touched" style="color: red; font-size: 12px;">Введіть 1-200 годин</div>
            </div>
            <button type="submit" [disabled]="courseForm.invalid" style="background: #3498db; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; align-self: end;">+ Додати</button>
          </div>
        </form>
      </div>

      <h2>Список курсів ({{ courses.length }})</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
        <div *ngFor="let course of courses" style="background: white; border-radius: 10px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0;">{{ course.title }}</h3>
            <button (click)="deleteCourse(course.id)" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Видалити</button>
          </div>
          <div style="margin-top: 10px; color: #7f8c8d;">
            <div>📁 {{ course.category }}</div>
            <div>⏱ {{ course.duration }} годин</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  courses: Course[] = [
    { id: 1, title: 'Angular для початківців', category: 'Frontend', duration: 40 },
    { id: 2, title: 'RxJS: Реактивне програмування', category: 'Frontend', duration: 30 },
    { id: 3, title: 'TypeScript: Поглиблений курс', category: 'Мови програмування', duration: 25 }
  ];
  courseForm: FormGroup;
  private nextId = 4;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(200)]]
    });
  }

  onSubmit() {
    if (this.courseForm.valid) {
      this.courses.push({
        ...this.courseForm.value,
        id: this.nextId++
      });
      this.courseForm.reset();
    }
  }

  deleteCourse(id: number) {
    if (confirm('Видалити курс?')) {
      this.courses = this.courses.filter(c => c.id !== id);
    }
  }
}