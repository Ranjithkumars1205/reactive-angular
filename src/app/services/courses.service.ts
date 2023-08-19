import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

// Stateless Observable-based services, not state management
@Injectable({
  providedIn: "root",
})
export class CoursesService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @returns return observable is not kept here in our service.so our service is stateless, meaning that
   * it does not hold any application data.
   * The Only thing that this service holds in memory is a reference to the HTTP client in order to be able to do
   * HTTP calls
   */
  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      shareReplay()
    );
  }

  loadCourseById(courseId: number): Observable<any> {
    return this.http
      .get<Course>(`/api/courses/${courseId}`)
      .pipe(shareReplay());
  }

  loadAllCoursesLessson(courseId: number): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          pageSize: "10000",
          courseId: courseId.toString(),
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay() // In order to avoid that, multiple subscriptions of our output observable accidentally triggered multiple repeated HTTP requests
      );
  }

  saveCourse(courseId, courseChanges: Partial<Course>): Observable<any> {
    return this.http
      .put(`/api/courses/${courseId}`, courseChanges)
      .pipe(shareReplay());
  }

  searchLessons(search: string): Observable<Lesson[]> {
    return this.http
      .get<Lesson[]>("/api/lessons", {
        params: {
          filter: search,
          pageSize: "100",
        },
      })
      .pipe(
        map((res) => res["payload"]),
        shareReplay() // In order to avoid that, multiple subscriptions of our output observable accidentally triggered multiple repeated HTTP requests
      );
  }
}
