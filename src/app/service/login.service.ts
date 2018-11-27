import {Injectable} from '@angular/core';
import {HttpUtil} from '../util/http-util';
import * as CryptoJS from 'crypto-js';
import {of} from 'rxjs/observable/of';
import {ErrorObserver} from 'rxjs/Observer';
import {HttpParams} from '@angular/common/http';

@Injectable()
export class LoginService {


  constructor(private httpUtil: HttpUtil) {
  }


  login(userName: string, password: string ,verCode: string) {
    const url = 'login/check';
    const body = {
      'username': userName,
      'password': password,
      'verCode': verCode
    };

    return this.httpUtil.post(url, body);
  }

  logout() {
    const url = 'login/exit';
    return this.httpUtil.post(url);
  }
}
