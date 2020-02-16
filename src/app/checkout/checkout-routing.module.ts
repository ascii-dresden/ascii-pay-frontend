import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { CheckoutComponent } from './checkout.component';
import { KeypadComponent } from './components';

const routes: Routes = [
  {
    path: 'checkout',
    component: CheckoutComponent,
    children: [
      { path: 'keypad', component: KeypadComponent },
      { path: '', redirectTo: 'keypad', pathMatch: 'full' },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }
