import {Component, OnDestroy, OnInit,Renderer2,ElementRef} from '@angular/core';
import {AlertEnum} from '../../common/alert-enum.enum';
import {RegisterService} from '../../service/register.service';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  msg: string = '默认提示信息';
  alert: AlertEnum = AlertEnum.DANGER;
  uid: string;
  username: string;
  password: string;
  repassword: string;
  phone: string;
  email: string;
  isDisabled: boolean = false;
  pswClass: number = 0;
  verCode: string;

  checkPhone: boolean = true;
  checkEmail: boolean = false;

  constructor(private registerService: RegisterService, private authService: AuthService,
              private router: Router,private renderer2: Renderer2,
              private el:ElementRef) { }

  ngOnInit() {
    document.getElementsByTagName('body')[0].classList.add('register-page');
  }

  ngOnDestroy(): void {
    document.getElementsByTagName('body')[0].classList.remove('register-page');
  }

  check() {  
    if (!this.username) {
      this.msg = '用户名不能为空';
    }
    if (!this.password) {
      this.msg = '密码不能为空';
      return false;
    }
     if (this.password != this.repassword) {
      this.msg = '两次密码不一致';
      return false;
    }
    return true;
  }

  getLvl(txt) {
      //默认级别是0
      var lvl = 0;
      //判断这个字符串中有没有数字
      if (/[0-9]/.test(txt)) {
          lvl++;
      }
      //判断字符串中有没有字母
      if (/[a-zA-Z]/.test(txt)) {
          lvl++;
      }
      //判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(txt)) {
          lvl++;
      }
      return lvl;
  }

 checkpswLv(){
      this.pswClass = this.getLvl(this.password);
 }

 changeOption(value){
    if(value=="option1"){
      this.checkPhone = true;
      this.phone = "";
      this.email = "";
      }else{
      this.checkPhone = false;
      this.phone = "";
      this.email = "";
    }
  }

  settime(val,countdown) {
        if (countdown == 0) {
         this.renderer2.removeAttribute(val,'disabled',null);
         val.innerHTML = "发送验证码";

        } else {
        this.renderer2.setAttribute(val,'disabled',null);
            var strInfo = '重新发送'+'('+ countdown +')';
            val.innerHTML = strInfo;
                countdown--;

              setTimeout(()=>{
                    this.settime(val,countdown); 
                },1000);
        }
    }


 sendToPhone(){
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
            if (!myreg.test(this.phone)) {
                this.msg = '手机号格式不正确';
                this.alert = AlertEnum.WARNING;
                this.phone = "";
                return ;
            } 
             const phoneCode$ = this.registerService.sendCode(1,this.phone).subscribe(
             data => {
              // 注册成功返回
              if (data.code === 200) {
                this.msg = '验证码已发送至手机,请注意查收';
                this.alert = AlertEnum.SUCCESS;
                phoneCode$.unsubscribe();

                var sendBtn = this.el.nativeElement.querySelector('#sendBtn1');
                var timer = 60;
                this.settime(sendBtn,timer);
               
              } else {
                this.msg = data.data;
                this.alert = AlertEnum.WARNING;
                phoneCode$.unsubscribe();
              }
            },
          );
 }

 sendToMail(){

 const mailCode$ = this.registerService.sendCode(2,this.email).subscribe(
             data => {
              // 注册成功返回
              if (data.code === 200) {
                this.msg = '验证码已发送至邮箱,请注意查收';
                this.alert = AlertEnum.SUCCESS;
                mailCode$.unsubscribe();

                var sendBtn = this.el.nativeElement.querySelector('#sendBtn2');
                var timer = 60;
                this.settime(sendBtn,timer);
               
              } else {
                this.msg = data.data;
                this.alert = AlertEnum.WARNING;
                mailCode$.unsubscribe();
              }
            },
          );

 }

  register() {
    if (!this.check()) {
      return;
    }

  
         const register$ = this.registerService.register(this.username, this.password, this.phone, this.email,this.verCode).subscribe(
             data => {
              // 注册成功返回
              if (data.code === 200) {
                this.msg = '注册成功,请重新登录';
                this.alert = AlertEnum.SUCCESS;
                register$.unsubscribe();

               setTimeout( () => {
                  this.router.navigateByUrl('/login');
                }, 1800 );
               
              } else {
                this.msg = data.data;
                this.alert = AlertEnum.WARNING;
                register$.unsubscribe();
              }
            },
          );

  }

  reloadAlertMsg(_msg: string) {
    this.msg = _msg;
  }

}
