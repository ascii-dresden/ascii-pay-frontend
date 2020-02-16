import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpInterceptor } from '@angular/common/http';

import { HttpService } from './http.service';
import { ApiPrefixInterceptor } from './api-prefix.interceptor';

describe('HttpService', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let interceptors: HttpInterceptor[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiPrefixInterceptor,
        {
          provide: HttpClient,
          useClass: HttpService
        }
      ]
    });

    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController as Type<HttpTestingController>);

    const realRequest = http.request;
    spyOn(HttpService.prototype, 'request').and.callFake(
      function (this: any, method: string, url: string, options?: any) {
        interceptors = this.interceptors;
        return realRequest.call(this, method, url, options);
      }
    );
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should use API prefix by default', () => {
    const request = http.get('/foo');

    request.subscribe(() => {
      expect(http.request).toHaveBeenCalled();
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeTruthy();
    });
    httpMock.expectOne({}).flush({});
  });

  it('should not use API prefix', () => {
    const request = http.disableApiPrefix().get('/foo');

    request.subscribe(() => {
      expect(interceptors.some(i => i instanceof ApiPrefixInterceptor)).toBeFalsy();
    });
    httpMock.expectOne({}).flush({});
  });
});
