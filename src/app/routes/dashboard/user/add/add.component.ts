import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@shared/service/user.service';
import { CreateUserRequestParams } from '@shared/interface/user';
import { Md5 } from 'ts-md5/dist/md5';
import { ResponseParams } from '@shared/interface/response';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [],
})
export class AddComponent implements OnInit {
  passwordVisible = false; // 密码或普通字符串转换
  form: FormGroup;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msg: NzMessageService,
    private modal: NzModalRef,
  ) {
    this.form = this.fb.group({
      account: [null, [Validators.required, Validators.pattern(/^[0-9A-Za-z]{4,20}$/)]],
      nickname: [null, [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      password: [null, [Validators.required, Validators.pattern(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)]],
      role: ['admin'],
    });
  }

  ngOnInit(): void {}

  /**
   * 添加用户
   */
  submit(): void {
    this.uploading = true;
    const params: CreateUserRequestParams = {
      role: 'user', // 角色默认为普通用户，管理员用户初始化有几个，不再另外新建
      name: this.form.get('nickname').value,
      account: this.form.get('account').value,
      password: Md5.hashStr(this.form.get('password').value).toString(),
    };
    this.userService.createUser(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('新增用户成功');
          this.modal.destroy({ data: 'success' });
        } else {
          this.msg.error(value.msg);
          this.modal.destroy({ data: 'error' });
        }
      },
      error => {
        this.msg.error(error);
      },
      () => {
        this.uploading = false;
      },
    );
  }

  /**
   * 关闭添加用户窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
