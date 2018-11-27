import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {UserVO} from '../../pojo/UserVO';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  leftSideBar: boolean = true;
  rightSideBar: boolean = false;
  userInfo: any;
  roleInfo: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkLogin();
    this.userInfo = this.authService.getUser();
    this.roleInfo = this.authService.getRole();
  }

  logout() {
    this.authService.logout();
  }


}
