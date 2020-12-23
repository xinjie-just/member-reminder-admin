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
    this.getStages();
    this.getRoles();
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
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 改变阶段获取步骤
   * @param stage: number
   */
  onChangeStage(stage: number) {
    this.getSteps(stage);
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
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 根据步骤 ID 获取该步骤下面的全部提醒事项
   */
  onChangeStep(step: number): void {
    const params: QueryReminderByNodeRequestParams = {
      idNode: step,
    };
    this.stageService.queryReminderByStep(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          // const info: QueryReminderByNodeResposeDataParams = value.data;
          this.reminders = value.data;
        } else {
          this.reminders = [];
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
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
        } else {
          this.roles = [];
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
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

    // 新增
    this.remindService.addOrUpdateRemind(addParams).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('提醒配置新增成功');
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

    // 修改
    let updateParams = { ...addParams, id: this.remindInfo.id };
    this.remindService.addOrUpdateRemind(updateParams).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('提醒配置修改成功');
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
   * 关闭添加用户窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
