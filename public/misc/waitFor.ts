import { Observable, first, combineLatest } from 'https://esm.sh/rxjs@7.5.7'

export function waitFor<T>(
  signal$: Observable<any>
) {
  return (source$: Observable<T>) =>
      new Observable<T>((observer: Observable) => {
          // combineLatest emits the first value only when
          // both source and signal emitted at least once
          combineLatest([
              source$,
              signal$.pipe(
                  first(),
              ),
          ]).subscribe(([v]: [any]) => observer.next(v));
      });
}