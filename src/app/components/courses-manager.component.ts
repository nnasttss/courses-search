import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

interface Course {
  id: number;
  title: string;
  category: string;
  duration: number;
}

@Component({
  selector: 'app-courses-manager',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container">
      <h1>📚 Керування курсами</h1>
      
      <div class="add-course-section">
        <h2>Додати новий курс</h2>
        <form [formGroup]="courseForm" (ngSubmit)="onSubmit()">
          <div>
            <label>Назва курсу:</label>
            <input type="text" formControlName="title">
            <div *ngIf="courseForm.get('title')?.invalid && courseForm.get('title')?.touched">
              Назва обов'язкова
            </div>
          </div>

          <div>
            <label>Категорія:</label>
            <select formControlName="category">
              <option value="">Виберіть категорію</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Мови програмування">Мови програмування</option>
            </select>
            <div *ngIf="courseForm.get('category')?.invalid && courseForm.get('category')?.touched">
              Виберіть категорію
            </div>
          </div>

          <div>
            <label>Тривалість (годин):</label>
            <input type="number" formControlName="duration">
            <div *ngIf="courseForm.get('duration')?.invalid && courseForm.get('duration')?.touched">
              Введіть тривалість (1-200 годин)
            </div>
          </div>

          <button type="submit" [disabled]="courseForm.invalid">+ Додати курс</button>
        </form>
      </div>

      <div>
        <h2>Список курсів ({{ courses.length }})</h2>
        <div class="courses-grid">
          <div *ngFor="let course of courses" class="course-card">
            <div>
              <h3>{{ course.title }}</h3>
              <button (click)="deleteCourse(course.id)">Видалити</button>
            </div>
            <div>
              <div>Категорія: {{ course.category }}</div>
              <div>Тривалість: {{ course.duration }} годин</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; color: #2c3e50; }
    .add-course-section { background: #ecf0f1; padding: 20px; border-radius: 10px; margin-bottom: 30px; }
    form { display: flex; gap: 15px; flex-wrap: wrap; align-items: end; }
    form div { flex: 1; }
    input, select { width: 100%; padding: 8px; margin-top: 5px; }
    button { background: #3498db; color: white; border: none; padding: 8px 20px; border-radius: 5px; cursor: pointer; }
    button:hover { background: #2980b9; }
    button:disabled { background: #95a5a6; }
    .courses-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .course-card { background: white; border-radius: 10px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .course-card > div:first-child { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; }
    .course-card h3 { margin: 0; }
    .course-card button { background: #e74c3c; padding: 5px 10px; font-size: 12px; }
    .course-card button:hover { background: #c0392b; }
  `]
})
export class CoursesManagerComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  courseForm: FormGroup;
  private destroy$ = new Subject<void>();
  private mockCourses: Course[] = [
    { id: 1, title: 'Angular для початківців', category: 'Frontend', duration: 40 },
    { id: 2, title: 'RxJS: Реактивне програмування', category: 'Frontend', duration: 30 },
    { id: 3, title: 'TypeScript: Поглиблений курс', category: 'Мови програмування', duration: 25 }
  ];
  private nextId = 4;

  constructor(private fb: FormBuilder) {
    this.courseForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(200)]]
    });
    this.courses = this.mockCourses;
  }

  ngOnInit() {}

  onSubmit() {
    if (this.courseForm.valid) {
      const newCourse: Course = {
        ...this.courseForm.value,
        id: this.nextId++
      };
      this.courses.push(newCourse);
      this.courseForm.reset();
    }
  }

  deleteCourse(id: number) {
    if (confirm('Видалити курс?')) {
      this.courses = this.courses.filter(c => c.id !== id);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}