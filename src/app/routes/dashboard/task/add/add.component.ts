import { LogService } from '@shared/service/log.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddTempTaskRequestParams } from '@shared/interface/log';
import { ResponseParams } from '@shared/interface/response';
import {
  RoleSearchRequestParams,
  RoleSearchResponsePageParams,
  RoleSearchResponseRecordsParams,
} from '@shared/interface/role';
import { RoleService } from '@shared/service/role.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less'],
  providers: [DatePipe],
})
export class AddTaskComponent implements OnInit {
  form: FormGroup;
  uploading = false;
  roles: RoleSearchResponseRecordsParams[] = [];
  remindDate = '';
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private logService: LogService,
    private msg: NzMessageService,
    private modal: NzModalRef,
    private datePipe: DatePipe,
  ) {
    this.form = this.fb.group({
      role: [null, [Validators.required]],
      date: [null, [Validators.required]],
      content: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getRoles();
  }

  /**
   * 搜索角色
   */
  getRoles(): void {
    const params: RoleSearchRequestParams = {
      pageNo: 1,
      pageSize: 99,
    };
    this.roleService.getRoles(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: RoleSearchResponsePageParams = value.data.page;
          this.roles = info.records;
        } else {
          this.roles = [];
          this.msg.error(value.message || '获取角色列表失败！');
        }
      },
      (error) => {
        this.msg.error(error.message || '获取角色列表失败！');
      },
    );
  }

  onChangeDate(date: Date): void {
    this.remindDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) <= 0;
  };

  /**
   * 添加临时提醒
   */
  submit(): void {
    this.uploading = true;
    const params: AddTempTaskRequestParams = {
      idRole: this.form.get('role').value,
      content: this.form.get('content').value,
      remindDate: this.remindDate,
    };
    this.logService.addTempTask(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('临时提醒新增成功！');
          this.modal.destroy({ data: 'success' });
        } else {
          this.msg.error(value.message || '临时提醒新增失败！');
          this.modal.destroy({ data: 'error' });
        }
      },
      (error) => {
        this.msg.error(error.message || '临时提醒新增失败！');
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
