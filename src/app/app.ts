import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

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
    <div class="container">
      <h1>📚 Наші курси</h1>
      
      <div class="search-section">
        <div class="search-wrapper">
          <input 
            type="text"
            [formControl]="searchControl"
            placeholder="Пошук курсів за назвою..."
            class="search-input"
            autocomplete="off"
          >
          <button 
            *ngIf="searchControl.value"
            class="clear-btn"
            (click)="clearSearch()"
          >
            ✕
          </button>
        </div>
        <div class="search-info" *ngIf="searchControl.value">
          Результати пошуку: "{{ searchControl.value }}"
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        ⏳ Завантаження...
      </div>

      <div class="courses-grid" *ngIf="!loading">
        <div *ngFor="let course of courses" class="course-card">
          <div class="course-header">
            <h3>{{ course.title }}</h3>
            <span class="course-id">ID: {{ course.id }}</span>
          </div>
          <div class="course-details">
            <div class="detail-item">
              <span class="label">Категорія:</span>
              <span class="value">{{ course.category }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Тривалість:</span>
              <span class="value">{{ course.duration }} годин</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="courses.length === 0 && !loading && searchControl.value" class="no-results">
        😔 На жаль, курсів за запитом "{{ searchControl.value }}" не знайдено.
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .search-section {
      margin-bottom: 30px;
    }
    
    .search-wrapper {
      position: relative;
      max-width: 500px;
      margin: 0 auto;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 40px 12px 15px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 25px;
      transition: all 0.3s ease;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
    
    .clear-btn {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 18px;
      color: #999;
      transition: color 0.3s ease;
    }
    
    .clear-btn:hover {
      color: #e74c3c;
    }
    
    .search-info {
      text-align: center;
      margin-top: 10px;
      color: #7f8c8d;
      font-style: italic;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: #3498db;
    }
    
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }
    
    .course-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .course-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
    }
    
    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 10px;
    }
    
    .course-header h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 18px;
    }
    
    .course-id {
      font-size: 12px;
      color: #95a5a6;
      background: #ecf0f1;
      padding: 2px 8px;
      border-radius: 12px;
    }
    
    .course-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    .label {
      font-weight: 600;
      color: #7f8c8d;
    }
    
    .value {
      color: #34495e;
    }
    
    .no-results {
      text-align: center;
      padding: 50px;
      font-size: 18px;
      color: #e74c3c;
      background: #fdf0ef;
      border-radius: 10px;
      margin-top: 20px;
    }
    
    @media (max-width: 768px) {
      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  courses: Course[] = [];
  loading = false;
  private destroy$ = new Subject<void>();

  private mockCourses: Course[] = [
    { id: 1, title: 'Angular для початківців', category: 'Frontend', duration: 40 },
    { id: 2, title: 'RxJS: Реактивне програмування', category: 'Frontend', duration: 30 },
    { id: 3, title: 'TypeScript: Поглиблений курс', category: 'Мови програмування', duration: 25 },
    { id: 4, title: 'Node.js з нуля', category: 'Backend', duration: 45 },
    { id: 5, title: 'Angular Performance Optimization', category: 'Frontend', duration: 20 },
    { id: 6, title: 'JavaScript для просунутих', category: 'Frontend', duration: 35 }
  ];

  ngOnInit() {
    this.courses = this.mockCourses;
    
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        this.loading = true;
        const search = searchTerm?.toLowerCase() || '';
        const filtered = this.mockCourses.filter(course =>
          course.title.toLowerCase().includes(search)
        );
        return of(filtered);
      }),
      takeUntil(this.destroy$)
    ).subscribe(courses => {
      this.courses = courses;
      this.loading = false;
    });
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}