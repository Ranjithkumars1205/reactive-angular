import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { interval, noop, Observable, of, throwError, timer } from "rxjs";
import {
  catchError,
  delay,
  delayWhen,
  filter,
  finalize,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";

/**
 * Main responsibility of this main component is to access the service layer, extract data from it and pass it
 * to the courses list presentational component. let's see the diffence in roles between the two components.
 * this component has very little information
 */

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  // beginnerCourses: Course[]; // this is mutable state variable
  /**
   * In Reactive approach, mutable state variable no longer to be presented
   */
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messageService: MessagesService,
    private coursesStore: CoursesStore
  ) {}

  /**
   * Home component is aware is that there is a store somewhere in our application with a public observable that courses
   * observable that is going to give us back the data when it's available.
   * The CoursesStore doesn't know if the data comes from the backedn or from an in-memory cache that is transparent for the home component.
   */

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");
    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");

    /**
     * We produce two subscriptions (this.beginnerCourses$ = course$, this.advancedCourses$ = course$) at the level of the view the async pipe,
     * and that results in two separate API requests, check in network we can see three api would happen. Overcome this use shareReplay rxjs operator
     *
     */

    // this.coursesService.loadAllCourses().subscribe
    // const course$ = this.coursesService.loadAllCourses().pipe(
    //   map((res) => res.sort(sortCoursesBySeqNo)),
    //   catchError((err) => {
    //     const message = "Could not load courses";
    //     this.messageService.showErrors(message);
    //     console.log(message, err);
    //     return throwError(err);
    //   })
    // );

    // const loadCourse$ =
    //   this.loadingService.showLoaderUntilCompleted<Course[]>(course$);

    // course$.subscribe(res => console.log(res));

    // look at here still we are not subscribe, we will subscribe it by async pipe.
    // this.beginnerCourses$ = course$.pipe(
    //   map(res => res.filter(c => c.category === 'BEGINNER')
    //   )
    // );

    // this.beginnerCourses$ = loadCourse$.pipe(
    //   map((res) => res.filter((c) => c.category === "BEGINNER"))
    // );

    // this.advancedCourses$ = loadCourse$.pipe(
    //   map((res) => res.filter((c) => c.category === "ADVANCED"))
    // );

    // this.http.get("/api/courses").subscribe((res) => {
    //   const courses: Course[] = res["payload"].sort(sortCoursesBySeqNo);

    //   this.beginnerCourses = courses.filter(
    //     (course) => course.category == "BEGINNER"
    //   );

    //   this.advancedCourses = courses.filter(
    //     (course) => course.category == "ADVANCED"
    //   );
    // });
  }
}
