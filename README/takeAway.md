statemanagement concept is basedon private behaviout subject and
all the obserable data finally subscribed (only one subscription in most of the place) by async pipe.

1. first thing we have to make normal variable to observable.
2. Subcribe those observable by only async pipe

Single data observable patter - combineLatest - lifesaver for larger number of observable in our application component

CombineLatest - In most cases, this is going to give you the behaviour that you are looking for, which is
the ability of filling the template with the data as soon as it's available.

Onpush change detection - Any other template expression

If you have to show a lot of data to the user with a lot of template expressions that it might become a problem in those rare cases where the amount of data that we are trying to display makes the UI less responsive, you might want to switch some of the angular component into angular onpush change detection.

Onpush - Angular is only going to update the component if we push new data to it explicitly. so, angular is not
going to check all the expressions by default instead of angular is going to wait for the data to be explicitly pushed to the component before re-rendering it.
there are couple of way to push data to the component:
1. Input property
2. By any of the observables

