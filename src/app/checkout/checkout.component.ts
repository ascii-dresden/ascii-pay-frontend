import { Component, HostBinding, OnInit } from '@angular/core';

import { faBars, faUserSlash, faCheck, faUndo } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

import { CheckoutController } from './checkout.controller';

@Component({
  selector: 'ascii-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  @HostBinding('class') classes = 'd-flex flex-row row no-gutters';

  bars = faBars;
  logoff = faUserSlash;
  check = faCheck;
  undoIcon = faUndo;

  barista = 'Max Mustermann';
  customer = 'Mathias Stuhlbein';
  credit = 4.20;
  total$: Observable<number>;

  constructor(private checkoutController: CheckoutController) { }

  ngOnInit(): void {
    this.total$ = this.checkoutController.total$;
  }
}
