import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseParams } from '@shared/interface/response';
import {
  QueryReminderByNodeRequestParams,
  ReminderDeleteRequestParams,
  ReminderSaveRequestParams,
} from '@shared/interface/stage';
import { StageService } from '@shared/service/stage.service';
import { NzMessageService, NzModalRef, NzModalService } from 'ng-zorro-antd';

interface ListOfControlObject {
  id: number;
  idReminder?: number;
  reminderInstance: string;
}

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.less'],
})
export class ReminderComponent implements OnInit {
  @Input() idNode: number = null;

  uploading = false;
  reminder: { idReminder: number; content: string } = { idReminder: null, content: null };
  reminders: { idReminder: number; content: string }[] = []; // 某步骤下的全部提醒事项

  form: FormGroup;
  listOfControl: ListOfControlObject[] = [
    {
      id: 0,
      idReminder: null,
      reminderInstance: `reminder0`,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modal: NzModalRef,
    private stageService: StageService,
    private modalService: NzModalService,
  ) {
    this.form = this.fb.group({
      reminder0: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getReminders(this.idNode);
  }

  /**
   * 获取该步骤下的全部提醒事项
   * @param step number
   */
  getReminders(step?: number) {
    this.uploading = true;
    const params: QueryReminderByNodeRequestParams = {
      idNode: step,
    };
    this.stageService.queryReminderByStep(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.reminders = value.data.map((item) => {
            return {
              idReminder: item.idReminder,
              content: item.content,
            };
          });
          this.initFrom();
        } else {
          this.reminders = [];
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.uploading = false;
        this.msg.error(error);
      },
      () => {
        this.uploading = false;
      },
    );
  }

  /**
   * 初始化form实例
   */
  initFrom() {
    const reminderCount = this.reminders.length;
    const groupObj: { [key: string]: any[] } = {};
    if (reminderCount > 1) {
      for (let i = 0; i < reminderCount; i++) {
        groupObj[`reminder${i}`] = [null, [Validators.required]];
      }
      this.form = this.fb.group({
        ...groupObj,
      });
    } else {
      this.form = this.fb.group({
        reminder0: [null, [Validators.required]],
      });
    }

    this.listOfControl = [];
    const pathValueObj: { [key: string]: string } = {};
    for (let j = 0; j < reminderCount; j++) {
      const reminderInstance = `${this.reminders[j].content}`;
      pathValueObj[`reminder${j}`] = reminderInstance;
      this.listOfControl.push({ id: j, idReminder: this.reminders[j].idReminder, reminderInstance: `reminder${j}` });
    }
    if (reminderCount > 0) {
      this.form.patchValue({
        ...pathValueObj,
      });
    }
  }

  /**
   * 改变问题
   * @param value string
   * @param controlId: number
   */
  changeReminder(value: string, controlId: number): void {
    this.reminders[controlId].content = this.form.get(value).value;
  }

  /**
   * 添加一项问题
   * @param e: MouseEvent
   */
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control = {
      id,
      idReminder: null,
      reminderInstance: `reminder${id}`,
    };
    const index = this.listOfControl.push(control);
    this.reminders.push({ content: '', idReminder: null });
    this.form.addControl(this.listOfControl[index - 1].reminderInstance, new FormControl(null, [Validators.required]));
  }

  /**
   * 删除该组问题
   * @param control ListOfControlObject
   * @param e MouseEvent
   */
  removeField(control: ListOfControlObject, e: MouseEvent, textareaTem: any): void {
    e.preventDefault();
    if (control.idReminder) {
      const content = textareaTem.value.length > 10 ? textareaTem.value.substring(0, 10) + '...' : textareaTem.value;
      this.modalService.confirm({
        nzTitle: `你确定要删除提醒事项 <i>${content}</i> 吗?`,
        nzOkText: '确定',
        nzOkType: 'danger',
        nzOnOk: () => this.deleteReminder(control),
        nzCancelText: '取消',
      });
    } else {
      this.deleteInstance(control);
    }
  }
  deleteReminder(control: ListOfControlObject) {
    const params: ReminderDeleteRequestParams = {
      idReminder: control.idReminder,
    };
    this.stageService.deleteReminder(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('删除提醒事项成功！');
          this.deleteInstance(control);
        } else {
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }
  /**
   * 移除实例
   * @param control ListOfControlObject
   */
  deleteInstance(control: ListOfControlObject) {
    const index = this.listOfControl.indexOf(control);
    this.listOfControl.splice(index, 1);
    this.reminders.splice(index, 1);
    this.form.removeControl(control.reminderInstance);
  }

  /**
   * 新增或修改提醒事项
   * @param control ListOfControlObject
   */
  saveReminder(control: ListOfControlObject) {
    let params: ReminderSaveRequestParams = {
      content: this.form.get(control.reminderInstance).value,
      idNode: this.idNode,
    };
    if (control.idReminder) {
      // 修改
      params = { ...params, idReminder: control.idReminder };
      this.stageService.addOrUpdateReminder(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('提醒事项修改成功');
          } else {
            this.msg.error(value.message);
          }
        },
        (error) => {
          this.msg.error(error);
        },
      );
    } else {
      // 新增
      this.stageService.addOrUpdateReminder(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('提醒事项新增成功');
          } else {
            this.msg.error(value.message);
          }
        },
        (error) => {
          this.msg.error(error);
        },
      );
    }
  }

  /**
   * 确认
   */
  submit() {
    this.modal.destroy({ data: 'success' });
  }

  /**
   * 关闭提醒事项管理窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
