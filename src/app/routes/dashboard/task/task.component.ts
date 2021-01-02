import { AddTaskComponent } from './add/add.component';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import {
  StageSearchResponseDataParams,
  StepSearchRequestParams,
  StepSearchResponsePageParams,
  StepSearchResponseRecordsParams,
} from '@shared/interface/stage';
import { StageService } from '@shared/service/stage.service';
import { ResponseParams } from '@shared/interface/response';
import {
  lockOrUnlockRequestParams,
  LogSearchResponsePageParams,
  RemindTaskSearchRecordsParams,
  RemindTaskSearchRequestParams,
} from '@shared/interface/log';
import { LogService } from '@shared/service/log.service';
import { CurrentUserInfo } from '@shared/interface/user';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.less'],
})
export class TaskComponent implements OnInit {
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  stages: StageSearchResponseDataParams[] = [];
  steps: StepSearchResponseRecordsParams[] = [];
  stage: number = null;
  step: number = null;

  status = 0;
  statusOptions: { value: number; label: string }[] = [
    { value: 0, label: '未执行' },
    { value: 1, label: '已执行' },
  ];
  tasks: RemindTaskSearchRecordsParams[] = [];

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
    private modalService: NzModalService,
    private msg: NzMessageService,
    private stageService: StageService,
    private logService: LogService,
  ) {}

  ngOnInit(): void {
    this.currentUserInfo = JSON.parse(localStorage.getItem('_token'));

    this.getStages();
    this.getTasks();
  }

  search() {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getTasks();
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
   * 获取选择阶段下的步骤
   */
  getSteps(stage?: number): void {
    let params: StepSearchRequestParams = {
      pageNo: 1,
      pageSize: 10,
      idStageNode: stage,
    };
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
   * 改变步骤
   * @param step number
   */
  onChangeStep(step: number) {
    this.step = step;
    this.getTasks(step);
  }

  /**
   * 获取临时任务日志
   * @param step number
   */
  getTasks(step?: number) {
    this.tableLoading = true;
    let params: RemindTaskSearchRequestParams = {
      executed: this.status,
      pageNo: 1,
      pageSize: 10,
    };
    if (step) {
      params = { ...params, idNode: step };
    }
    this.logService.getRemindLogs(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: LogSearchResponsePageParams = value.data.page;
          this.tasks = value.data.page.records;
          this.total = info.total;
        } else {
          this.tasks = [];
          this.total = 0;
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.tableLoading = false;
        this.msg.error(error);
      },
      () => {
        this.tableLoading = false;
      },
    );
  }

  /**
   * 新增临时提醒
   */
  add() {
    const addModal = this.modalService.create({
      nzTitle: '新增临时提醒',
      nzContent: AddTaskComponent,
      nzFooter: null,
    });

    addModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }

  /**
   * 锁定或解锁用户
   * @param remind RemindTaskSearchRecordsParams
   */
  lockOrUnlockTask(remind: RemindTaskSearchRecordsParams): void {
    const type = remind.dataState === 0 ? '解锁' : '锁定';
    const contentStr = remind.content.length > 10 ? remind.content.substring(0, 10) + '...' : remind.content;
    this.modalService.confirm({
      nzTitle: `你确定要${type}提醒配置 <i>${contentStr}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.lockOrUnlock(remind),
      nzCancelText: '取消',
    });
  }
  lockOrUnlock(remind: RemindTaskSearchRecordsParams): void {
    const params: lockOrUnlockRequestParams = {
      idTask: remind.id,
    };
    if (remind.dataState !== 0) {
      this.logService.lockTempTask(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('锁定成功！');
            this.search(); // 锁定成功后，重置页码
          } else {
            this.msg.error(value.message);
          }
        },
        (error) => {
          this.msg.error('锁定失败！', error);
        },
      );
    } else {
      this.logService.unlockTempTask(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('解锁成功！');
            this.search(); // 解锁成功后，重置页码
          } else {
            this.msg.error(value.message);
          }
        },
        (error) => {
          this.msg.error('解锁失败！', error);
        },
      );
    }
  }
}
