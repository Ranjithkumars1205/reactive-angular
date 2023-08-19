import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Course } from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CourseDialogComponent } from "../course-dialog/course-dialog.component";
import { filter, tap } from "rxjs/operators";

@Component({
  selector: "courses-card-list",
  templateUrl: "./courses-card-list.component.html",
  styleUrls: ["./courses-card-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * It doesn't know a lot about the service layer of the application.
 */
export class CoursesCardListComponent {
  @Input() courses: Course[] = [];
  // @Output() coursesChanged: EventEmitter<Course> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  editCourse(course: Course) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;
    // this CourseDialogComponent is not direct child component for app component, so we should add loading service in this component providers as well.
    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
    /**
     * The only way to do that is to reload our list of courses from the back end in order to get back latest
     * verion of each course - @Output
     */

    // dialogRef.afterClosed().pipe(
    //   filter(val => !!val),
    //   tap(() => this.coursesChanged.emit())
    // ).subscribe();
  }
}
