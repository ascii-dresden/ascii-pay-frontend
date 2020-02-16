import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutComponent } from './checkout.component';
import { KeypadComponent } from './components';
import { CheckoutController } from './checkout.controller';

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
  providers: [
    CheckoutController
  ],
})
export class CheckoutModule { }
