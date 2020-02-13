import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '@env/environment';

@Injectable()
export class ApiPrefixInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: environment.baseUrl + request.url });
    }

    return next.handle(request);
  }
}
