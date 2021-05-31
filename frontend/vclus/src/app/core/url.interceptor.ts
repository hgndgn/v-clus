import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr: HttpRequest<any> = req.clone({
      url: req.url.replace('api/', `http://localhost:${environment.PORT}/`),
    });

    return next.handle(xhr);
  }
}
