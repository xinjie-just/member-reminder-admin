import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ResponseParams } from '@shared/interface/response';
import { CurrentUserInfo, UpdatePasswordRequestParams } from '@shared/interface/user';
import { UserService } from '@shared/service/user.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styles: [],
})
export class UpdatePasswordComponent implements OnInit {
  @Input() phone: string = '';
  @Input() userName: string = '';
  form: FormGroup;
  oldPasswordVisible = false; // 密码或普通字符串转换
  passwordVisible = false; // 密码或普通字符串转换
  verifyPasswordVisible = false;

  uploading = false;
  currentUserInfo: CurrentUserInfo = {
    lastLoginTime: null,
    // phone: null,
    // realName: null,
    roleId: null,
    startTime: null,
    token: null,
    userId: null,
    userState: null,
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msg: NzMessageService,
    private modal: NzModalRef,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.form = this.fb.group({
      phoneNum: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      verifyPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }

  ngOnInit(): void {
    this.currentUserInfo = JSON.parse(localStorage.getItem('_token'));

    this.form.patchValue({
      phoneNum: this.phone,
    });
  }

  updateConfirmValidator(): void {
    /** 先检查重复密码的值 */
    Promise.resolve().then(() => this.form.controls.verifyPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.form.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  /**
   * 更改密码
   */
  submit(): void {
    this.uploading = true;
    const params: UpdatePasswordRequestParams = {
      idUser: this.currentUserInfo.userId,
      oldPassword: this.form.get('oldPassword').value,
      newPassword: this.form.get('password').value,
      confirmNewPassword: this.form.get('verifyPassword').value,
    };
    this.userService.updatePassword(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success(`用户 <i>${this.userName}</i> 密码修改成功！`);
          //修改成功后，退出登录，需要重新登录。
          this.tokenService.clear();
          localStorage.clear();
          this.router.navigateByUrl(this.tokenService.login_url);
          this.modal.destroy({ data: 'success' });
        } else {
          this.msg.error(value.message || `用户 <i>${this.userName}</i> 密码修改失败！`);
          this.modal.destroy({ data: 'error' });
        }
      },
      (error) => {
        this.msg.error(error.message || `用户 <i>${this.userName}</i> 密码修改失败！`);
        this.uploading = false;
      },
      () => {
        this.uploading = false;
      },
    );
  }

  /**
   * 关闭更改密码窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
