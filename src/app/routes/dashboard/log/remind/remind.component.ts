import { AddComponent } from './add/add.component';
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
  LogSearchResponsePageParams,
  RemindTaskSearchRecordsParams,
  RemindTaskSearchRequestParams,
} from '@shared/interface/log';
import { LogService } from '@shared/service/log.service';

@Component({
  selector: 'app-remind',
  templateUrl: './remind.component.html',
  styles: [],
})
export class RemindLogComponent implements OnInit {
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  stages: StageSearchResponseDataParams[] = [];
  steps: StepSearchResponseRecordsParams[] = [];
  stage: number = null;
  step: number = null;

  status = 0;
  statusOptions: { value: number; label: string }[] = [];
  remindLogs: RemindTaskSearchRecordsParams[] = [];

  constructor(
    private modalService: NzModalService,
    private msg: NzMessageService,
    private stageService: StageService,
    private logService: LogService,
  ) {}

  ngOnInit(): void {
    this.getStages();
  }

  search() {
    this.pageIndex = 1;
    this.pageSize = 10;
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
    this.getReminds(step);
  }

  /**
   * 获取临时任务日志
   * @param step number
   */
  getReminds(step?: number) {
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
          this.remindLogs = value.data.page.records;
          this.total = info.total;
        } else {
          this.remindLogs = [];
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
      nzContent: AddComponent,
      nzFooter: null,
    });

    addModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }
}
