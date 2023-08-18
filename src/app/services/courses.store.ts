import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { MessagesService } from "../messages/messages.service";
import { LoadingService } from "../loading/loading.service";

/**
 * we are going to make it as global applicable singleton so, all the part of the application can able to access it ( providedIn: 'root')
 * it means one instance of coursestore across the application
 * we should move loadingservice and messageservice from application level of root component to app.module.
 */
@Injectable({
  providedIn: "root",
})

/**
 * Home component is aware is that there is a store somewhere in our application with a public observable that courses
 * observable that is going to give us back the data when it's available.
 * The CoursesStore doesn't know if the data comes from the backedn or from an in-memory cache that is transparent for the home component.
 *
 * best way to define a custom observable in angular is to use a private behaviourSubject.
 */
export class CoursesStore {
  // this behaviourSubject has the particularity of remembering the last value that was emittedb
  private subject = new BehaviorSubject<Course[]>([]);

  // here, we are derived this from the subject using that as observable
  course$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private messageService: MessagesService,
    private loadingService: LoadingService
  ) {
    /**
     * it will going to be done only at service construction time. so this will happen only once during the
     * application lifecycle.
     */
    this.loadAllCourses();
  }

  saveCourse(courseId, changes: Partial<Course>): Observable<any> {
    // this is for done only inmemory client side
    const courses = this.subject.getValue();
    const index = courses.findIndex((c) => c.id === courseId);

    // here, we can use find instead of findIndex
    const newCourse = {
      ...courses[index],
      ...changes,
    };
    const newCourses = courses.slice(0); // here passing 0 means complete copy of courses array
    newCourses[index] = newCourse;
    this.subject.next(newCourses); // this is inmemory data, not updated data from server

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const message = "Could not save course";
        this.messageService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );

    // this.loadingService
    //   .showLoaderUntilCompleted(saveCourse$)
    //   .subscribe((val) => {
    //     // this.dialogRef.close(val);
    //   });
  }

  // Once you get back to course page, it will call from home component and you can get existing data from course$ (course observable)
  // for advanced category, we are calling this course observable only not api, so we dont need shareReplay for this
  filterByCategory(category: string): Observable<Course[]> {
    return this.course$.pipe(
      map((courses) =>
        courses.filter((c) => c.category === category).sort(sortCoursesBySeqNo)
      )
    );
  }

  /**
   * Should be private, this method will not accessible to anywhere else in our application
   * This means, loadCourses only going to be loaded from backend once at application start up time.
   *  */
  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((res) => res["payload"]),
      // shareReplay() // this is not required right now as we have to load the course at once in the application level.
      catchError((err) => {
        const message = "Could not load courses";
        this.messageService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$).subscribe();
  }
}
