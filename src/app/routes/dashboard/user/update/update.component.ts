import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@shared/service/user.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { RoleSearchResponseRecordsParams } from '@shared/interface/role';
import { UserUpdateRealNameRequestParams, UserUpdateRoleRequestParams } from '@shared/interface/user';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
})
export class UpdateComponent implements OnInit {
  @Input() roles: RoleSearchResponseRecordsParams[] = [];
  @Input() user: { idUser: number; realName: string; phoneNum: string } = {
    idUser: null,
    realName: null,
    phoneNum: null,
  };
  @Input() role: number;

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

  ngOnInit(): void {
    this.form.patchValue({
      role: this.role,
      name: this.user.realName,
      phone: this.user.phoneNum,
    });
  }

  /**
   * 修改用户
   */
  submit(): void {
    this.uploading = true;
    // 用户姓名和用户角色分别修改
    const realNameParams: UserUpdateRealNameRequestParams = {
      idUser: this.user.idUser,
      realName: this.form.get('name').value,
    };
    const updateRealNamePromise = this.userService.updateRealName(realNameParams).toPromise();

    const roleParams: UserUpdateRoleRequestParams = {
      idUser: this.user.idUser,
      idRole: this.form.get('role').value,
    };
    const updateRolePromise = this.userService.updateRole(roleParams).toPromise();

    Promise.all([updateRealNamePromise, updateRolePromise])
      .then((value) => {
        this.msg.success('用户信息修改成功！');
        this.modal.destroy({ data: 'success' });
      })
      .catch(() => {
        this.msg.error('用户信息修改失败！');
        this.modal.destroy({ data: 'error' });
      })
      .finally(() => {
        this.uploading = false;
      });
  }

  /**
   * 关闭添加用户窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
