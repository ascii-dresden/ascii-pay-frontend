import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class CheckoutController {

  private totalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public total$: Observable<number> = this.totalSubject.asObservable();

  addDigit(digit: number): void {
    const current = this.totalSubject.getValue();
    this.totalSubject.next(+`${current}${digit}`);
  }

  clear(): void {
    this.totalSubject.next(0);
  }
}
