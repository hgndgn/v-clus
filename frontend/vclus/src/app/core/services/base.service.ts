import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { DEFAULT_REGION } from '@constants/.ts';
import { HttpClient } from '@angular/common/http';

/**
 * This abstract service handles all required HTTP operations.
 */
@Injectable({
  providedIn: 'root',
})
export abstract class BaseService {
  private readonly http: HttpClient;

  protected region: string;
  protected regionAsParam = {};

  constructor(injector: Injector) {
    this.http = injector.get(HttpClient);

    const localRegion = localStorage.getItem('region_name');

    if (localRegion === null) {
      this.region = DEFAULT_REGION;
      this.regionAsParam = {
        params: { region_name: DEFAULT_REGION },
      };
    } else {
      this.region = localRegion;
      this.regionAsParam = {
        params: { region_name: localRegion },
      };
    }
  }

  protected delete(url: string, options?: any): Observable<any> {
    return this.http.delete(url, options).pipe(
      map(_ => _),
      catchError(this.handleError()),
    );
  }

  protected get(url: string, options?: any): Observable<any> {
    return this.http.get(url, options).pipe(
      map(_ => _),
      catchError(this.handleError()),
    );
  }

  protected post(url: string, body?: any, options?: any): Observable<any> {
    return this.http.post(url, body, options).pipe(
      map(_ => _),
      catchError(this.handleError()),
    );
  }

  protected put(url: string, body: any, options?: any): Observable<any> {
    return this.http.put(url, body, options).pipe(
      map(_ => _),
      catchError(this.handleError()),
    );
  }

  getCircularReplacer () {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  protected handleError<T>(result?: T) {
    return (err: any): Observable<T> => 
    {
      err = JSON.stringify(err, this.getCircularReplacer());
      console.error(err);
      return of(result as T);
    };
  }
}
