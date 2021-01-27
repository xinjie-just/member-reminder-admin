import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StageService } from '@shared/service/stage.service';
import {
  StepSearchResponseRecordsParams,
  StepSearchRequestParams,
  StepSearchResponsePageParams,
  StepDeleteRequestParams,
  StageSearchResponseDataParams,
} from '@shared/interface/stage';
import { ResponseParams } from '@shared/interface/response';
import { AddOrUpdateStageComponent } from './add-or-update/add-or-update.component';
import { CurrentUserInfo } from '@shared/interface/user';
import { ReminderComponent } from './reminder/reminder.component';
@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.less'],
})
export class StageComponent implements OnInit {
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  steps: StepSearchResponseRecordsParams[] = [];
  stages: StageSearchResponseDataParams[] = [];
  stage = null;
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
    private stageService: StageService,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.currentUserInfo = JSON.parse(localStorage.getItem('_token'));
    this.getStages();
    this.getSteps();
  }

  /**
   * 查询步骤
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getStages();
    this.getSteps(this.stage);
  }

  /**
   * 搜索阶段
   */
  getStages(): void {
    this.stageService.getStages().subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.stages = value.data;
        } else {
          this.stages = [];
          this.msg.error(value.message || '获取阶段列表失败！');
        }
      },
      (error) => {
        this.msg.error(error.message || '获取阶段列表失败！');
      },
    );
  }

  /**
   * 获取步骤
   * 获取所有步骤，idStageNode 不传
   */
  getSteps(stage?: number): void {
    this.tableLoading = true;
    let params: StepSearchRequestParams = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    if (stage) {
      params = { ...params, idStageNode: this.stage };
    }
    this.stageService.getSteps(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: StepSearchResponsePageParams = value.data.page;
          this.steps = info.records;
          this.total = info.total;
        } else {
          this.steps = [];
          this.total = 0;
          this.msg.error(value.message || '获取步骤列表失败！');
        }
      },
      (error) => {
        this.msg.error(error.message || '获取步骤列表失败！');
        this.tableLoading = false;
      },
      () => {
        this.tableLoading = false;
      },
    );
  }

  /**
   * 添加或修改步骤
   */
  addOrUpdateStage(step?: StepSearchResponseRecordsParams): void {
    const addOrUpdateModal = this.modalService.create({
      nzTitle: step ? '修改步骤' : '新增步骤',
      nzContent: AddOrUpdateStageComponent,
      nzFooter: null,
      nzComponentParams: {
        stepInfo: step ? step : null,
        stages: this.stages,
      },
    });

    addOrUpdateModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增或修改成功后，重置页码
      }
    });
  }

  reminder(step: StepSearchResponseRecordsParams): void {
    const addOrUpdateModal = this.modalService.create({
      nzTitle: '提醒事项管理',
      nzContent: ReminderComponent,
      nzFooter: null,
      nzWidth: 900,
      nzComponentParams: {
        idNode: step.idNode,
      },
      nzOnCancel: () => {
        this.search();
      },
    });

    addOrUpdateModal.afterClose.subscribe((result) => {
      if (result && (result.data === 'success' || result.data === 'cancel')) {
        this.search(); // 新增或修改成功后，重置页码
      }
    });
  }

  /**
   * 删除步骤
   * @param step StepSearchResponseRecordsParams
   */
  deleteStep(step: StepSearchResponseRecordsParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除步骤 <i>${step.name}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(step),
      nzCancelText: '取消',
    });
  }
  delete(step: StepSearchResponseRecordsParams): void {
    const params: StepDeleteRequestParams = {
      idNode: step.idNode,
    };
    this.stageService.deleteStep(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('步骤删除成功！');
          this.search(); // 删除成功后，重置页码，避免当前页没有数据
        } else {
          this.msg.error(value.message || '步骤删除失败！');
        }
      },
      (error) => {
        this.msg.error(error.message || '步骤删除失败！');
      },
    );
  }
}
