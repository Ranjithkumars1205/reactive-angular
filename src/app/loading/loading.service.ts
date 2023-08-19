import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

// decoupled component communication
@Injectable()
export class LoadingService {
  private loadingSubject = new BehaviorSubject(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {
    console.log("Loading service created!");
  }

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      concatMap(() => obs$), // ConcatMap is going to take the values emitted by the source observable in this case,
      // this observable here, which only emitted the value null and then it completed immediately and concatMap is going to transform this value
      // into a new observable, which is going to be our input observable(obs$). this means that the values emitted by the result observable are going to be identical to the values
      // emitted by the input observable.
      finalize(() => this.loadingOff()) // now when this input observable completes or errors out, we are going to be turning off the loading observable.
    );
  }

  loadingOn() {
    this.loadingSubject.next(true);
  }

  loadingOff() {
    this.loadingSubject.next(false);
  }
}
