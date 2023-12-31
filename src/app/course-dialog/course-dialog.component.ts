import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { catchError, tap } from "rxjs/operators";
import { throwError } from "rxjs";
import { CoursesService } from "../services/courses.service";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesStore } from "../services/courses.store";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
  // providers: [LoadingService, MessagesService],
})
// this CourseDialogComponent is not direct child component for app component
export class CourseDialogComponent implements AfterViewInit {
  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    // private coursesService: CoursesService,
    private coursesStore: CoursesStore // private loadingService: LoadingService, // private messageService: MessagesService
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngAfterViewInit() {}

  save() {
    const changes: Partial<Course> = this.form.value;
    this.coursesStore.saveCourse(this.course.id, changes).subscribe();

    this.dialogRef.close(changes);

    // const saveCourse$ = this.coursesService
    //   .saveCourse(this.course.id, changes)
    //   .pipe(
    //     catchError((err) => {
    //       const message = "Could not save course";
    //       this.messageService.showErrors(message);
    //       console.log(message, err);
    //       return throwError(err);
    //     })
    //   );
    // this.loadingService
    //   .showLoaderUntilCompleted(saveCourse$)
    //   .subscribe((val) => {
    //     this.dialogRef.close(val);
    //   });
  }

  close() {
    this.dialogRef.close();
  }
}
