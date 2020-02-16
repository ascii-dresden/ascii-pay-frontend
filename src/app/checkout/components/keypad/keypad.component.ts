import { Component, HostBinding } from '@angular/core';

import { faUndo } from '@fortawesome/free-solid-svg-icons';

import { CheckoutController } from '../../checkout.controller';

@Component({
  selector: 'ascii-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss']
})
export class KeypadComponent {

  @HostBinding('class') classes = 'keypad d-block';

  undoIcon = faUndo;

  constructor(private checkoutController: CheckoutController) { }

  addDigit(digit: number): void {
    this.checkoutController.addDigit(digit);
  }

  negateTotal(): void { }

  clear(): void {
    this.checkoutController.clear();
  }
}
