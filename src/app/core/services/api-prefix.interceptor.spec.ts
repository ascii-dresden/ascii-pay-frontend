import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { environment } from '@env/environment';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';

describe('ApiPrefixInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: ApiPrefixInterceptor,
        multi: true
      }]
    });

    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController as Type<HttpTestingController>);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should prepend environment.baseUrl to the request url', () => {
    http.get('/foo').subscribe();

    httpMock.expectOne({ url: environment.baseUrl + '/foo' });
  });

  it('should not prepend environment.baseUrl to request url', () => {
    http.get('https://example.com/foo').subscribe();

    httpMock.expectOne({ url: 'https://example.com/foo' });
  });
});
