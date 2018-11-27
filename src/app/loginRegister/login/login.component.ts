import {Component, OnDestroy, OnInit,Renderer2,ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {AlertEnum} from '../../common/alert-enum.enum';
import {LoginService} from '../../service/login.service';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

declare var particlesJS: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {


  msg: string = '默认提示信息';
  alert: AlertEnum = AlertEnum.DANGER;

  private baseUrl: string;


  userName: string;
  password: string;
  verCode: string;

  isDisabled: boolean = false;

  constructor(private loginService: LoginService,
              private authService: AuthService,
              private renderer2: Renderer2,
              private el:ElementRef,
              private router: Router) {

              this.baseUrl = environment.apiBaseUrl;
  }

  ngOnInit() {
    document.getElementsByTagName('body')[0].classList.add('login-page');

    particlesJS.load('particles-js', '/assets/js/particles.json', null);

  }

  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('login-page');
  }

  check() {
    if (!this.userName) {
      this.msg = '用户名不能为空';
      return false;
    }
    if (!this.password) {
      this.msg = '密码不能为空';
      return false;
    }
    if (!this.verCode) {
      this.msg = '验证码不能为空';
      return false;
    }
    return true;
  }

  changeLock(){

          var password_input = this.el.nativeElement.querySelector('.password_input');
          var eye = this.el.nativeElement.querySelector('.eye');
          var lockicon = this.el.nativeElement.querySelector('.lockicon');
          var type = password_input.type;
          if (type == "password") {
            this.renderer2.setProperty(password_input,'type','text');
            this.renderer2.setProperty(eye,'title','隐藏密码');
            this.renderer2.removeClass(lockicon,"fa-eye");
            this.renderer2.addClass(lockicon,"fa-eye-slash");

          }else if (type == "text") {
           this.renderer2.setProperty(password_input,'type','password');
          this.renderer2.setProperty(eye,'title','显示密码');
            this.renderer2.removeClass(lockicon,"fa-eye-slash");
            this.renderer2.addClass(lockicon,"fa-eye");
          }

  }

  getVerify(){
    var imgVerify = this.el.nativeElement.querySelector('.imgVerify');
    var url = environment.apiBaseUrl + "getVerify?" +Math.random();
    this.renderer2.setProperty(imgVerify,'src',url);
  }


  login() {
    if (!this.check()) {
      return;
    }
    this.isDisabled = true;

    const login$ = this.loginService.login(this.userName, this.password ,this.verCode).subscribe(
            data2 => {

              // 认证成功返回jwt
              if (data2.code === 200 && data2.data != null) {
                this.authService.updateAuthorizationToken(data2.data.token);
                this.authService.updateUser(data2.data.user);
                this.authService.updateRole(data2.data.role);
                login$.unsubscribe();
                this.router.navigateByUrl('/index');
              } else {
                this.msg = data2.msg;
                this.alert = AlertEnum.DANGER;
                this.isDisabled = false;
                login$.unsubscribe();
              }
            },
            error => {
              console.error(error);
              login$.unsubscribe();
              this.msg = '服务器开小差啦';
              this.alert = AlertEnum.DANGER;
              this.isDisabled = false;
            }
          );
  }

  reloadAlertMsg(_msg: string) {
    this.msg = _msg;
  }

}
