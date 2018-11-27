import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../service/auth.service';
import {catchError, mergeMap, repeat} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

import {of} from 'rxjs/observable/of';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthorizationToken();
    let authReq: any;
    if (authToken != null) {
      authReq = req.clone({
      withCredentials: true,
        setHeaders: {
          'Authorization': authToken
        }
      });
    } else {
      authReq = req.clone({
      withCredentials: true 
      });
    }

    //console.log(authReq);
    return next.handle(authReq).pipe(
      mergeMap(event => {
        // 返回response
        if (event instanceof HttpResponse) {
          if (event.status === 200) {
            // 若返回JWT过期但refresh token未过期,返回新的JWT 状态码为1005
          
          }
          if (event.status === 404) {
            // go to 404 html
            this.router.navigateByUrl('/404');
          }
          if (event.status === 500) {
            // go to 500 html
            this.router.navigateByUrl('/500');
          }
        }

       // console.log(event);
        // 返回正常情况的可观察对象
        return of(event);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error( `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    repeat(1);
    return new ErrorObservable('亲请检查网络');

  }
}
