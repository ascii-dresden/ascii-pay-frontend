import { Component, HostBinding } from '@angular/core';

import { faUndo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ascii-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss']
})
export class KeypadComponent {

  undoIcon = faUndo;

  @HostBinding('class') classes = 'keypad';

  addDigit(): void { }

  negateTotal(): void { }

  clear(): void { }
}
