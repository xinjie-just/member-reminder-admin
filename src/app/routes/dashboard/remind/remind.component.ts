import { StageService } from './../../../shared/service/stage.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  DeleteRemindRequestParams,
  lockRemindRequestParams,
  RemindSearchRequestParams,
  RemindSearchResponsePageParams,
  RemindSearchResponseRecordsParams,
  unlockRemindRequestParams,
} from '@shared/interface/remind';
import { ResponseParams } from '@shared/interface/response';
import { RemindService } from '@shared/service/remind.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddOrUpdateRemindComponent } from './add-or-update/add-or-update.component';
import {
  StageSearchResponseDataParams,
  StepSearchRequestParams,
  StepSearchResponsePageParams,
  StepSearchResponseRecordsParams,
} from '@shared/interface/stage';
import { CurrentUserInfo } from '@shared/interface/user';

@Component({
  selector: 'app-remind',
  templateUrl: './remind.component.html',
  styleUrls: ['./remind.component.less'],
})
export class RemindComponent implements OnInit {
  constructor(
    private remindService: RemindService,
    private msg: NzMessageService,
    private nzModalService: NzModalService,
    private route: ActivatedRoute,
    private stageService: StageService,
  ) {}

  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  stages: StageSearchResponseDataParams[] = [];
  steps: StepSearchResponseRecordsParams[] = [];
  stage: number = null;
  step: number = null;
  reminds: RemindSearchResponseRecordsParams[] = [];

  currentUserInfo: CurrentUserInfo = {
    lastLoginTime: null,
    phone: null,
    realName: null,
    roleId: null,
    startTime: null,
    token: null,
    userId: null,
    userState: null,
  };

  ngOnInit(): void {
    this.currentUserInfo = JSON.parse(localStorage.getItem('_token'));
    this.getStages();
    this.getReminds();
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
   * 改变步骤
   * @param step number
   */
  onChangeStep(step: number) {
    this.step = step;
    this.getReminds(step);
  }

  /**
   * 查询问题
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getReminds();
  }

  /**
   * 提醒配置搜索
   */
  getReminds(step?: number): void {
    this.tableLoading = true;
    let params: RemindSearchRequestParams = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    if (step) {
      params = { ...params, idNode: step };
    }
    this.remindService.getReminds(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: RemindSearchResponsePageParams = value.data.page;
          this.reminds = info.records;
          this.total = info.total;
        } else {
          this.reminds = [];
          this.total = 0;
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
        this.tableLoading = false;
      },
      () => {
        this.tableLoading = false;
      },
    );
  }

  /**
   * 新建或修改提醒配置
   */
  addOrUpdateRemind(remind?: RemindSearchResponseRecordsParams): void {
    const addOrUpdateModal = this.nzModalService.create({
      nzTitle: remind ? '修改提醒配置' : '新增提醒配置',
      nzContent: AddOrUpdateRemindComponent,
      nzWidth: 600,
      nzComponentParams: {
        remindInfo: remind ? remind : null,
      },
      nzFooter: null,
    });

    addOrUpdateModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }

  /**
   * 删除提醒配置
   * @param user RemindSearchResponseRecordsParams
   */
  deleteRemind(remind: RemindSearchResponseRecordsParams): void {
    this.nzModalService.confirm({
      nzTitle: `你确定要删除提醒配置 <i>${remind.content}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(remind),
      nzCancelText: '取消',
    });
  }
  delete(remind: RemindSearchResponseRecordsParams): void {
    const params: DeleteRemindRequestParams = {
      idConfig: remind.id,
    };
    this.remindService.deleteRemind(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('删除成功');
          this.search(); // 删除成功后，重置页码，避免当前页没有数据
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
   * 锁定或解锁提醒配置
   * @param remind RemindSearchResponseRecordsParams
   */
  lockOrUnlockRemind(remind: RemindSearchResponseRecordsParams): void {
    const type = remind.dataState === 0 ? '解锁' : '锁定';
    this.nzModalService.confirm({
      nzTitle: `你确定要${type}提醒配置 <i>${remind.content}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.lockOrUnlock(remind),
      nzCancelText: '取消',
    });
  }
  lockOrUnlock(remind: RemindSearchResponseRecordsParams): void {
    if (remind.dataState !== 0) {
      let params: lockRemindRequestParams = {
        idConfig: remind.id,
      };
      this.remindService.lockRemind(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('锁定成功！');
          } else {
            this.msg.error('锁定失败！');
          }
        },
        (error) => {
          this.msg.error('锁定失败！', error);
        },
      );
    } else {
      let params: unlockRemindRequestParams = {
        idConfig: remind.id,
      };
      this.remindService.unlockRemind(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('解锁成功！');
          } else {
            this.msg.error('解锁失败！');
          }
        },
        (error) => {
          this.msg.error('解锁失败！', error);
        },
      );
    }
  }
}
