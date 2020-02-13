import { NgModule, Optional, SkipSelf } from '@angular/core';

@NgModule({
  declarations: [],
  imports: []
})
export class CoreModule {

  // Make sure CoreModule is only imported once.
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`${parentModule} has already been loaded. Import core module modules in the AppModule only.`);
    }
  }
}
