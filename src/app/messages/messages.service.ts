import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";

// for this service, we are not going to be declaring this as a global singleton.
@Injectable()
export class MessagesService {
  private subject$ = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this.subject$
    .asObservable()
    .pipe(filter((messages) => !!messages && messages.length > 0));
  // we are going to derive these observable from the subject observable

  showErrors(...errors: string[]) {
    this.subject$.next(errors);
  }
}
