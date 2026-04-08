import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesSubject: BehaviorSubject<Course[]>;
  public courses$: Observable<Course[]>;
  
  private nextId: number;

  constructor() {
    const initialCourses: Course[] = [
      { id: 1, title: 'Angular для початківців', category: 'Frontend', duration: 40 },
      { id: 2, title: 'RxJS: Реактивне програмування', category: 'Frontend', duration: 30 },
      { id: 3, title: 'TypeScript: Поглиблений курс', category: 'Мови програмування', duration: 25 }
    ];
    
    this.coursesSubject = new BehaviorSubject<Course[]>(initialCourses);
    this.courses$ = this.coursesSubject.asObservable();
    this.nextId = 4;
  }

  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  getCoursesValue(): Course[] {
    return this.coursesSubject.getValue();
  }

  addCourse(course: Omit<Course, 'id'>): void {
    const currentCourses = this.coursesSubject.getValue();
    const newCourse: Course = {
      ...course,
      id: this.nextId++
    };
    this.coursesSubject.next([...currentCourses, newCourse]);
  }

  deleteCourse(id: number): void {
    const currentCourses = this.coursesSubject.getValue();
    const filteredCourses = currentCourses.filter(course => course.id !== id);
    this.coursesSubject.next(filteredCourses);
  }
}