import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { KeypadComponent } from './components';

@NgModule({
  declarations: [
    CheckoutComponent,
    KeypadComponent,
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    FontAwesomeModule,
  ],
  exports: [
    CheckoutComponent,
  ],
})
export class CheckoutModule { }
