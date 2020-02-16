import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core';
import { AppComponent } from './app.component';
import { CheckoutModule } from './checkout';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    CheckoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
