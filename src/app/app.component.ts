import { Component, OnInit } from "@angular/core";
import { LoadingService } from "./loading/loading.service";
import { MessagesService } from "./messages/messages.service";

// stateless means we getting data from backend (server side). not stored in here - this is one of the example we can say!
// directly passing to the template using the async pipe (beginnerCourses$ | async) and it's not kept anywhere else in our application.
// why state management needed - Even if the data is not modified, if we navigate the way from the screen, that fits the data that we want to display and
// we come back to that same screen such as home component, we are going to reload the data again by another request.
// One of the main consequence of not using any state management in our application is that we have a lot of
// network overhead.

/**
 * General recommendation is to try to keep your application stateless and only add state management if you really need to
 * improve the user experience, if you have network requests that are very slow, that are really harming the user experience,
 * if you are showing a lot fo user indicators to the user, if there are long backend delays, then in those cases you
 * can conside state management. Otherwise, having a completely stateless front end solution also tends to work very well for a
 * large number of use cases. and with these tradeoffs in mind, let's now get started having state management to our angular application.
 */
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  providers: [LoadingService, MessagesService],
})

// instance of LoadingService only available child component of app-root component. for eg: router-outlet component can able to access instance of loading service
export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  logout() {}
}
