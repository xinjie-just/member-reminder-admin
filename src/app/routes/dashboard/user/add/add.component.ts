import { AddUserRequestParams } from './../../../../shared/interface/user';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@shared/service/user.service';
import { ResponseParams } from '@shared/interface/response';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { RoleSearchResponseRecordsParams } from '@shared/interface/role';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styles: [],
})
export class AddComponent implements OnInit {
  @Input() roles: RoleSearchResponseRecordsParams[] = [];

  form: FormGroup;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private msg: NzMessageService,
    private modal: NzModalRef,
  ) {
    this.form = this.fb.group({
      role: [null, [Validators.required]],
      name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  /**
   * 添加用户
   */
  submit(): void {
    this.uploading = true;
    const params: AddUserRequestParams = {
      idRole: this.form.get('role').value,
      phoneNum: this.form.get('phone').value,
      realName: this.form.get('name').value,
    };
    this.userService.createUser(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('用户新增成功');
          this.modal.destroy({ data: 'success' });
        } else {
          this.msg.error(value.message);
          this.modal.destroy({ data: 'error' });
        }
      },
      (error) => {
        this.msg.error(error);
        this.uploading = false;
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
