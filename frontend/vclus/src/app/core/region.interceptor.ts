import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';

@Injectable()
export class RegionInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const region = localStorage.getItem('region_value');

    if (!region) {
      window.location.href = '/';
      return;
    }

    let xhr: HttpRequest<any>;

    xhr = req.clone({
      params: req.params.set('region_value', region),
      headers: req.headers.append('Content-Type', 'application/json'),
    });

    return next.handle(xhr);
  }
}
