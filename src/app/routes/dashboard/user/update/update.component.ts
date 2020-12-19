import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from '@shared/service/user.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { UpdateUserRequestParams } from '@shared/interface/user';
import { Md5 } from 'ts-md5/dist/md5';
import { ResponseParams } from '@shared/interface/response';
import { Router } from '@angular/router';
import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
})
export class UpdateComponent implements OnInit {
  @Input() userId: number;
  @Input() userName: string;
  form: FormGroup;
  passwordVisible = false; // 密码或普通字符串转换
  verifyPasswordVisible = false;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msg: NzMessageService,
    private modal: NzModalRef,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    this.form = this.fb.group({
      password: [null, [Validators.required, Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)]],
      verifyPassword: [
        null,
        [
          Validators.required,
          Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/),
          this.confirmationValidator,
        ],
      ],
    });
  }

  ngOnInit(): void {}

  updateConfirmValidator(): void {
    /** 先检查重复密码的值 */
    Promise.resolve().then(() => this.form.controls.verifyPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    // 如果显示了 “6-16位，包含数字和字母” 的提示，就不显示“两次密码不一致”的提示
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(control.value)) {
      return {};
    }
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
    const params: UpdateUserRequestParams = {
      password: Md5.hashStr(this.form.get('password').value).toString(),
    };
    this.userService.updateUser(this.userId, params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success(`用户 "${this.userName}" 密码修改成功`);
          if (localStorage.getItem('userId') === String(this.userId)) {
            // 如果修改当前登录用户的密码，修改成功后，退出登录，需要重新登录。
            this.tokenService.clear();
            this.router.navigateByUrl(this.tokenService.login_url);
          }
          this.modal.destroy({ data: 'success' });
        } else {
          this.msg.error(value.msg);
          this.modal.destroy({ data: 'error' });
        }
      },
      (error) => {
        this.msg.error(error);
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
