import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login.service';

@Injectable()
export class AuthService {

  constructor(private router: Router, private loginService: LoginService) { }

  public checkLogin(): void {
    const jwt = this.getAuthorizationToken();
    if ( jwt == null) {
      this.router.navigateByUrl('/login');
    }

  }

  public logout(): void {
    
    // 通知服务器用户下线
    this.loginService.logout().subscribe(
      () => {
        this.router.navigateByUrl('/login');
    },
      error2 => {
        this.router.navigateByUrl('/login');
      }
    );

    // 本地消除存储用户信息
    localStorage.clear();
  }


  public getAuthorizationToken(): string {
    const jwt = localStorage.getItem('Authorization');
    return jwt != null ? jwt : null;
  }

  public updateAuthorizationToken(jwt: string): void {
    localStorage.setItem('Authorization', jwt);
  }

  public updateUser(user: any): void {
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public getUser(): any {
    const user = localStorage.getItem('userInfo');
    return user != null ? JSON.parse(user) : null;
  }

  public updateRole(role: any): void {
    localStorage.setItem('roleInfo', JSON.stringify(role));
  }

  public getRole(): any {
    const role = localStorage.getItem('roleInfo');
    return role != null ? JSON.parse(role) : null;
  }

  public updateMenuTree(menuTree: any[]): void {

    sessionStorage.setItem('menuTree', JSON.stringify(menuTree));

  }

  public getMenuTree(): any[] {
    const menuTree = sessionStorage.getItem('menuTree');
    return menuTree != null ? JSON.parse(menuTree) : null;
  }

}
