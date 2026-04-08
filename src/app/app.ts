import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { combineLatest, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';

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
      <h1>📚 Фільтрація курсів</h1>
      
      <div class="filters-section">
        <div class="filter-group">
          <label>🔍 Пошук за назвою:</label>
          <input 
            type="text"
            [formControl]="searchControl"
            placeholder="Введіть назву курсу..."
            class="filter-input"
          >
        </div>

        <div class="filter-group">
          <label>📁 Фільтр за категорією:</label>
          <select [formControl]="categoryControl" class="filter-select">
            <option value="">Всі категорії</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Мови програмування">Мови програмування</option>
            <option value="DevOps">DevOps</option>
            <option value="Бази даних">Бази даних</option>
          </select>
        </div>
      </div>

      <div class="info-section">
        <div class="results-count">Знайдено курсів: {{ filteredCourses.length }}</div>
        <div class="active-filters" *ngIf="searchControl.value || categoryControl.value">
          Активні фільтри:
          <span *ngIf="searchControl.value" class="filter-badge">Назва: "{{ searchControl.value }}"</span>
          <span *ngIf="categoryControl.value" class="filter-badge">Категорія: {{ categoryControl.value }}</span>
        </div>
      </div>

      <div class="courses-grid">
        <div *ngFor="let course of filteredCourses" class="course-card">
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

      <div *ngIf="filteredCourses.length === 0" class="no-results">
        😔 За вашими фільтрами курсів не знайдено
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
    
    .filters-section {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      background: #ecf0f1;
      padding: 20px;
      border-radius: 10px;
    }
    
    .filter-group {
      flex: 1;
      min-width: 200px;
    }
    
    .filter-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .filter-input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: all 0.3s;
    }
    
    .filter-input:focus {
      outline: none;
      border-color: #3498db;
    }
    
    .filter-select {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
    }
    
    .filter-select:focus {
      outline: none;
      border-color: #3498db;
    }
    
    .info-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .results-count {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .active-filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      align-items: center;
      font-size: 14px;
      color: #7f8c8d;
    }
    
    .filter-badge {
      background: #3498db;
      color: white;
      padding: 5px 10px;
      border-radius: 15px;
      font-size: 12px;
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
      transition: transform 0.3s;
    }
    
    .course-card:hover {
      transform: translateY(-3px);
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
      .filters-section {
        flex-direction: column;
      }
      
      .courses-grid {
        grid-template-columns: 1fr;
      }
      
      .info-section {
        flex-direction: column;
        align-items: start;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  categoryControl = new FormControl('');
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];
  private destroy$ = new Subject<void>();

  private mockCourses: Course[] = [
    { id: 1, title: 'Angular для початківців', category: 'Frontend', duration: 40 },
    { id: 2, title: 'RxJS: Реактивне програмування', category: 'Frontend', duration: 30 },
    { id: 3, title: 'TypeScript: Поглиблений курс', category: 'Мови програмування', duration: 25 },
    { id: 4, title: 'Node.js з нуля', category: 'Backend', duration: 45 },
    { id: 5, title: 'Angular Performance Optimization', category: 'Frontend', duration: 20 },
    { id: 6, title: 'JavaScript для просунутих', category: 'Frontend', duration: 35 },
    { id: 7, title: 'Python для початківців', category: 'Мови програмування', duration: 30 },
    { id: 8, title: 'Docker та Kubernetes', category: 'DevOps', duration: 25 },
    { id: 9, title: 'SQL для аналітиків', category: 'Бази даних', duration: 20 }
  ];

  ngOnInit() {
    this.allCourses = this.mockCourses;
    this.filteredCourses = this.allCourses;

    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged()
    );

    combineLatest([search$, category$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([searchTerm, selectedCategory]) => {
        this.filteredCourses = this.allCourses.filter(course => {
          const matchesSearch = !searchTerm || 
            course.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = !selectedCategory || 
            course.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}