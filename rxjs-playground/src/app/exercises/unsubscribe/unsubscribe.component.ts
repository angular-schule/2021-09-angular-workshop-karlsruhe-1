import { Component, OnDestroy } from '@angular/core';
import { Subject, ReplaySubject, timer, Subscription } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'rxw-unsubscribe',
  templateUrl: './unsubscribe.component.html',
})
export class UnsubscribeComponent implements OnDestroy {

  logStream$ = new ReplaySubject<string | number>();
  destroyed = false;

  /**
   * Öffne die Browser-Console: Dort siehst Du den Output eines Observables, das jede Sekunde einen Wert generiert.
   * Navigiere zurück auf die Startseite und beobachte die Console:
   * Die Subscription läuft weiter. Wir haben einen klassischen Memory Leak erzeugt...
   *
   * Sorge dafür, dass die Subscription in der Methode ngOnDestroy() beendet wird!
   * Sie wird beim Buttonklick und beim Wegnavigieren ausgelöst.
   *
   * Es gibt noch weitere Wege, das Problem zu lösen...
   */
  constructor() {
    const interval$ = timer(0, 1000);

    interval$.pipe(

      /******************************/

      takeWhile(() => !this.destroyed)

      /******************************/

    ).subscribe({
      next: e => this.log(e),
      error: err => this.log('❌ ERROR: ' + err),
      complete: () => this.log('✅ COMPLETE')
    });

  }

  ngOnDestroy() {
    this.logStream$.next('DESTROY');
    this.destroyed = true;
  }

  log(msg: string | number) {
    console.log(msg);
    this.logStream$.next(msg);
  }
}
