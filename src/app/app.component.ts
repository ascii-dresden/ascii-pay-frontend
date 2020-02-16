import { Component } from '@angular/core';

import { environment } from '@env/environment';

import { Logger } from '@app/core';

const log = new Logger('App');

@Component({
  selector: 'ascii-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor() {
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');
  }
}
