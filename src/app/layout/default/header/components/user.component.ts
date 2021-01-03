import { CurrentUserInfo } from '@shared/interface/user';
import { UpdatePasswordComponent } from './../../../../routes/dashboard/user/update-password/update-password.component';
import { ResponseParams } from './../../../../shared/interface/response';
import { UserService } from '@shared/service/user.service';
import { Component, Inject, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { QueryUserByIdRequestParams } from '@shared/interface/user';

@Component({
  selector: 'header-user',
  template: `
    <div
      class="alain-default__nav-item d-flex align-items-center px-sm"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="userMenu"
    >
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{ userName }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <!--<div nz-menu-item routerLink="/pro/account/center">
          <i nz-icon nzType="user" class="mr-sm"></i>
          {{ 'menu.account.center' | translate }}
        </div>
        <div nz-menu-item routerLink="/pro/account/settings">
          <i nz-icon nzType="setting" class="mr-sm"></i>
          {{ 'menu.account.settings' | translate }}
        </div>
        <div nz-menu-item routerLink="/exception/trigger">
          <i nz-icon nzType="close-circle" class="mr-sm"></i>
          {{ 'menu.account.trigger' | translate }}
        </div>-->
        <div nz-menu-item (click)="updateUser()">
          <i nz-icon nzType="lock" nzTheme="outline" class="mr-sm"></i>
          修改密码
        </div>
        <li nz-menu-divider></li>
        <div nz-menu-item (click)="logout()">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          {{ 'menu.account.logout' | translate }}
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserComponent implements OnInit {
  userName = '';
  phone = '';
  userId: number = null;
  userInfo: CurrentUserInfo = {
    lastLoginTime: null,
    roleId: null,
    phone: null,
    realName: null,
    startTime: null,
    token: null,
    userId: null,
    userState: null,
  };
  constructor(
    public settings: SettingsService,
    private modalService: NzModalService,
    private router: Router,
    private userService: UserService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private msg: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
    if (JSON.parse(localStorage.getItem('_token'))) {
      this.userId = JSON.parse(localStorage.getItem('_token'))['userId'];
    }
  }

  ngOnInit(): void {
    this.getUserById();
  }

  /**
   * 通过用户ID获取用户信息
   */
  getUserById(): void {
    let params: QueryUserByIdRequestParams = {
      idUser: this.userId,
    };
    this.userService.getUerById(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.cdr.markForCheck(); // 把该视图显示标记为已更改，以便它再次进行检查

          this.userInfo = value.data;
          this.userName = value.data.realName;
          this.phone = value.data.phoneNum;
        } else {
          this.msg.error('用户信息获取失败，请联系管理员解决111！', {
            nzDuration: 5000,
          });
        }
      },
      () => {
        /* this.msg.error('用户信息获取失败，请联系管理员解决222！', {
          nzDuration: 5000,
        }); */
      },
    );
  }

  logout() {
    this.userService.logout().subscribe((value: ResponseParams) => {
      if (value.code === 2000) {
      }
    });
    this.tokenService.clear();
    localStorage.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }

  /**
   * 修改用户密码
   */
  updateUser(): void {
    this.modalService.create({
      nzTitle: '修改密码',
      nzContent: UpdatePasswordComponent,
      nzComponentParams: { phone: this.phone, userName: this.userName },
      nzFooter: null,
    });
  }
}
