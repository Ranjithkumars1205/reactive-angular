import { Injectable } from "@angular/core";

/**
 * we are going to make it as global applicable singleton so, all the part of the application can able to access it ( providedIn: 'root')
 * it means one instance of coursestore across the application
 */
@Injectable({
  providedIn: "root",
})
export class CoursesStore {}
