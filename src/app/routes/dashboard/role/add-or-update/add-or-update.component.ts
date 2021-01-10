import { RoleUpdateRequestParams, RoleAddRequestParams } from './../../../../shared/interface/role';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { ResponseParams } from '@shared/interface/response';
import { RoleService } from '@shared/service/role.service';

@Component({
  selector: 'app-add-or-update-role',
  templateUrl: './add-or-update.component.html',
  styles: [],
})
export class AddOrUpdateRoleComponent implements OnInit {
  @Input() role: { idRole?: number; roleName?: string; dataState?: number } = {};
  form: FormGroup;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private msg: NzMessageService,
    private modal: NzModalRef,
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.role) {
      this.form.patchValue({
        name: this.role.roleName,
      });
    }
  }

  /**
   * 新建或修改问题
   */
  submit(): void {
    this.uploading = true;
    if (this.role) {
      // 修改
      const params: RoleUpdateRequestParams = {
        idRole: this.role.idRole,
        roleName: this.form.get('name').value,
      };
      this.roleService.updateRole(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('角色修改成功！');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.message || '角色修改失败！');
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error('角色修改失败！', error);
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        },
      );
    } else {
      // 新建
      const params: RoleAddRequestParams = {
        roleName: this.form.get('name').value,
      };
      this.roleService.addeRole(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('角色新增成功！');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.message || '角色新增失败！');
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error('角色新增失败！', error);
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        },
      );
    }
  }

  /**
   * 关闭新增或修改角色窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
