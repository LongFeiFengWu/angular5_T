import { Injectable } from '@angular/core';
import {HttpUtil} from '../util/http-util';
import {HttpParams} from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class RegisterService {

  constructor(private httpUtil: HttpUtil) { }

  getTokenKey() {
    const url = 'account/login?tokenKey=get';
    // 先向后台申请加密tokenKey tokenKey=get
    return this.httpUtil.get(url);
  }

  sendCode(type:number ,des: string){

  if(type==1){
      const url = 'sendToPhone';
      const body = {
      'phone': des
      };
      return this.httpUtil.post(url, body);
    }

  if(type==2){
      const url = 'sendToMail';
      const body = {
      'email': des
      };
    return this.httpUtil.post(url, body);
}


     
  }

  register(username: string, password: string, phone: string, email: string,verCode: string) {
    const url = 'user/addNewUser';

    const body = {
      'username': username,
      'password': password,
      'phone': phone,
      'email': email,
      'verCode': verCode
    };

    return this.httpUtil.post(url, body);
  }
}
