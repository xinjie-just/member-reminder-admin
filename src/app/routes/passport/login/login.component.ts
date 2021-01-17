import { _HttpClient, SettingsService } from '@delon/theme';
import { Component, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { SocialService, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { StartupService } from '@core';
import { UserService } from '@shared/service/user.service';
import { ResponseParams } from '@shared/interface/response';
import { LoginRequestParams } from '@shared/interface/user';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent {
  loading = false;
  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private router: Router,
    @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
    private userService: UserService,
    private settingService: SettingsService,
  ) {
    this.form = fb.group({
      phone: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: [null, [Validators.required]],
    });
    modalSrv.closeAll();
  }

  // #region fields

  get phone() {
    return this.form.controls.phone;
  }
  get password() {
    return this.form.controls.password;
  }

  form: FormGroup;
  error = '';
  passwordVisible = false;

  interval$: any;

  submit(): void {
    this.loading = true;
    this.error = '';
    this.phone.markAsDirty();
    this.phone.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.phone.invalid || this.password.invalid) {
      return;
    }

    const loginRequestParams: LoginRequestParams = {
      phone: this.phone.value.trim(),
      // password: Md5.hashStr(this.password.value.trim()).toString(),
      password: this.password.value.trim().toString(),
    };

    this.userService.login(loginRequestParams).subscribe(
      (value: ResponseParams) => {
        if (value.code !== 200) {
          this.msg.error(value.message);
          return;
        }
        // 清空路由复用信息
        this.reuseTabService.clear();
        const data = value.data;
        const userInfo = data.user;
        // 设置用户Token信息
        this.tokenService.set({
          token: data.token,
          userId: userInfo.idUser,
          roleId: userInfo.idRole,
          userState: userInfo.dataState, // 0-锁定，1-正常，2-假删除
          lastLoginTime: userInfo.lastLoginTime,
          // phone: userInfo.phoneNum,
          // realName: userInfo.realName,
          startTime: userInfo.startTime,
        });
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          let url = this.tokenService.referrer.url || '/';
          if (url.includes('/passport')) {
            url = '/';
          }
          this.router.navigateByUrl(url);
        });
      },
      (error) => {
        this.msg.error(error);
        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }
}
