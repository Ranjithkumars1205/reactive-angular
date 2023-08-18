import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
import { Lesson } from "../model/lesson";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "course",
  templateUrl: "./search-lessons.component.html",
  styleUrls: ["./search-lessons.component.css"],
})
export class SearchLessonsComponent implements OnInit {
  /**
   * In this component, we did not use centralized state management service.
   * Instead, we have used state (searchResults$) that is only present at the level of a particular component
   * when component get destroyed, then state (searchResults$) also get destroyed
   */
  searchResults$: Observable<Lesson[]>;

  activeLession: Lesson;
  constructor(private coursesService: CoursesService) {}

  ngOnInit() {}

  onSearch(searchItem: string) {
    this.searchResults$ = this.coursesService.searchLessons(searchItem);
  }

  openLession(lesson) {
    this.activeLession = lesson;
  }

  onBackToSearch() {
    this.activeLession = null;
  }
}
