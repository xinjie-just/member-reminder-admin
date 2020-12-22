import { UpdatePasswordComponent } from './../../../../routes/dashboard/user/update-password/update-password.component';
import { ResponseParams } from './../../../../shared/interface/response';
import { UserService } from '@shared/service/user.service';
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzModalService } from 'ng-zorro-antd';

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
export class HeaderUserComponent {
  userName = '';
  constructor(
    public settings: SettingsService,
    private modalService: NzModalService,
    private router: Router,
    private userService: UserService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.userName = JSON.parse(localStorage.getItem('_token'))['realName'];
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
      nzFooter: null,
    });
  }
}
