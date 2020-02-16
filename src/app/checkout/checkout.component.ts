import { Component, HostBinding } from '@angular/core';

import { faBars, faUserSlash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ascii-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  @HostBinding('class') classes = 'd-flex flex-row row no-gutters';

  bars = faBars;
  logoff = faUserSlash;
  check = faCheck;
  undoIcon = faUndo;

  barista = 'Max Mustermann';
  customer = 'Mathias Stuhlbein';
  credit = 4.20;
  total = 4.20;
}
