import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from '@app/core';
import { CheckoutModule } from '@app/checkout';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    CheckoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
