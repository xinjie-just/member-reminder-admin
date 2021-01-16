import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { RemindService } from '@shared/service/remind.service';
import { addOrUpdateRemindRequestParams, RemindSearchResponseRecordsParams } from '@shared/interface/remind';
import { ResponseParams } from '@shared/interface/response';
import { StageService } from '@shared/service/stage.service';
import {
  QueryReminderByNodeRequestParams,
  QueryReminderByNodeResposeDataParams,
  StageSearchResponseDataParams,
  StepSearchRequestParams,
  StepSearchResponsePageParams,
  StepSearchResponseRecordsParams,
} from '@shared/interface/stage';
import {
  RoleSearchRequestParams,
  RoleSearchResponsePageParams,
  RoleSearchResponseRecordsParams,
} from '@shared/interface/role';
import { RoleService } from '@shared/service/role.service';

@Component({
  selector: 'app-add-or-update-remind',
  templateUrl: './add-or-update.component.html',
  styleUrls: ['./add-or-update.component.less'],
})
export class AddOrUpdateRemindComponent implements OnInit {
  @Input() remindInfo: RemindSearchResponseRecordsParams = {
    id: null,
    idConfig: null,
    idNode: null,
    idRole: null,
    remindType: null,
    idReminder: null,
    content: null,
    remindBatchNum: null,
    remindTimes: null,
    remindLeadDay: null,
    intervalDuration: null,
    dataState: null,
    idStage: null,
    stageName: null,
    nodeName: null,
    reminder: null,
    roleName: null,
  };

  form: FormGroup;
  uploading = false;

  //提醒类型：日常提醒1/办理提醒2，默认办理提醒,这个字段暂时未使用
  remindTypes: { value: number; label: string }[] = [
    { value: 1, label: '日常提醒' },
    { value: 2, label: '办理提醒' },
  ];

  stages: StageSearchResponseDataParams[] = [];
  steps: StepSearchResponseRecordsParams[] = [];
  reminders: QueryReminderByNodeResposeDataParams[] = []; // 某步骤下的全部提醒事项
  roles: RoleSearchResponseRecordsParams[] = [];
  selectedReminder: { idReminder: number; content: string } = { idReminder: null, content: null };

  constructor(
    private fb: FormBuilder,
    private remindService: RemindService,
    private msg: NzMessageService,
    private modal: NzModalRef,
    private stageService: StageService,
    private roleService: RoleService,
  ) {
    this.form = this.fb.group({
      stage: [null, [Validators.required]],
      step: [null, [Validators.required]],
      role: [null, [Validators.required]],
      remindType: [2, [Validators.required]],
      reminder: [null, [Validators.required]],
      content: [null, [Validators.required]],
      remindLeadDay: [1, [Validators.required]],
      remindBatchNum: [1, [Validators.required]],
      intervalDuration: [1, [Validators.required]],
      remindTimes: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.remindInfo) {
      this.form.patchValue({
        stage: this.remindInfo.idStage,
        step: this.remindInfo.idNode,
        role: this.remindInfo.idRole,
        remindType: this.remindInfo.remindType,
        // reminder: this.remindInfo.idReminder,
        content: this.remindInfo.content,
        remindLeadDay: this.remindInfo.remindLeadDay,
        remindBatchNum: this.remindInfo.remindBatchNum,
        intervalDuration: this.remindInfo.intervalDuration,
        remindTimes: this.remindInfo.remindTimes,
      });
    }
    this.getStages();
    this.getRoles();
    this.getSteps();
    if (this.remindInfo) {
      this.onChangeStep(this.remindInfo.idNode);
    }
  }

  /**
   * 获取阶段
   */
  getStages(): void {
    this.stageService.getStages().subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.stages = value.data;
        } else {
          this.stages = [];
          this.msg.error(value.message || '阶段列表获取失败！');
        }
      },
      (error) => {
        this.msg.error('阶段列表获取失败！', error);
      },
    );
  }

  /**
   * 改变阶段获取步骤
   * @param stage: number
   */
  onChangeStage(stage: number) {
    if (!stage) {
      this.form.patchValue({
        step: null,
        reminder: null,
      });
      this.steps = [];
      this.reminders = [];
    } else {
      this.getSteps(stage);
    }
  }

  /**
   * 获取步骤
   * 获取所有步骤，idStageNode 不传
   */
  getSteps(stage?: number): void {
    let params: StepSearchRequestParams = {
      pageNo: 1,
      pageSize: 10,
    };
    if (stage) {
      params = { ...params, idStageNode: stage };
    }
    this.stageService.getSteps(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: StepSearchResponsePageParams = value.data.page;
          this.steps = info.records;
        } else {
          this.steps = [];
          this.msg.error(value.message || '步骤列表获取失败！');
        }
      },
      (error) => {
        this.msg.error('步骤列表获取失败！', error);
      },
    );
  }

  /**
   * 根据步骤 ID 获取该步骤下面的全部提醒事项
   */
  onChangeStep(step: number): void {
    if (!step) {
      this.form.patchValue({
        reminder: null,
      });
      this.reminders = [];
    } else {
      const params: QueryReminderByNodeRequestParams = {
        idNode: step,
      };
      this.stageService.queryReminderByStep(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.reminders = value.data;
            if (this.remindInfo) {
              this.form.patchValue({
                reminder: this.remindInfo.idReminder,
              });
            }
          } else {
            this.reminders = [];
            this.msg.error(value.message || '提醒事项获取失败！');
          }
        },
        (error) => {
          this.msg.error('提醒事项获取失败！', error);
        },
      );
    }
  }

  /**
   * 改变提醒事项，填充提醒内容详情
   */
  onChangeReminder(reminder: number) {
    this.reminders.forEach((item) => {
      if (reminder === item.idReminder) {
        this.selectedReminder.content = item.content;
      }
    });
    if (!this.remindInfo || !this.form.get('content').value) {
      this.form.patchValue({
        content: this.selectedReminder.content,
      });
    }
  }

  /**
   * 搜索角色
   */
  getRoles(): void {
    const params: RoleSearchRequestParams = {
      pageNo: 1,
      pageSize: 999,
    };
    this.roleService.getRoles(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: RoleSearchResponsePageParams = value.data.page;
          this.roles = info.records;
          console.log('角色', this.roles);
        } else {
          this.roles = [];
          this.msg.error(value.message || '角色列表获取失败！');
        }
      },
      (error) => {
        this.msg.error('角色列表获取失败！', error);
      },
    );
  }

  /**
   * 新增或修改提醒配置
   */
  submit(): void {
    this.uploading = true;
    const addParams: addOrUpdateRemindRequestParams = {
      content: this.form.get('content').value,
      idNode: this.form.get('step').value,
      idReminder: this.form.get('reminder').value,
      idRole: this.form.get('role').value,
      intervalDuration: this.form.get('intervalDuration').value,
      remindBatchNum: this.form.get('remindBatchNum').value,
      remindLeadDay: this.form.get('remindLeadDay').value,
      remindTimes: this.form.get('remindTimes').value,
      remindType: this.form.get('remindType').value,
    };

    // 修改
    if (this.remindInfo) {
      let updateParams = { ...addParams, id: this.remindInfo.idConfig };
      this.remindService.addOrUpdateRemind(updateParams).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('提醒配置修改成功！');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.message || '提醒配置修改失败！');
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error('提醒配置修改失败！', error);
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        },
      );
    } else {
      // 新增
      this.remindService.addOrUpdateRemind(addParams).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('提醒配置新增成功');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.message || '提醒配置新增失败！');
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error('提醒配置新增失败！', error);
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        },
      );
    }
  }

  /**
   * 关闭添加用户窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
