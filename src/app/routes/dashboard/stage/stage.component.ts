import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { StageService } from '@shared/service/stage.service';
import {
  StepSearchResponseRecordsParams,
  StepSearchRequestParams,
  StepSearchResponsePageParams,
} from '@shared/interface/stage';
import { ResponseParams } from '@shared/interface/response';
import { AddOrUpdateStageComponent } from './add-or-update/add-or-update.component';
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

  constructor(
    private stageService: StageService,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.getSteps();
  }

  /**
   * 查询问题
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getSteps();
  }

  /**
   * 搜索问题
   */
  /*
  getStages(): void {
    this.tableLoading = true;
    const params: StageSearchRequestParams = {
      query: this.question.trim(),
      pos: (this.pageIndex - 1) * this.pageSize,
      cnt: this.pageSize,
    };
    this.stageService.getStages(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const userInfo = value.data;
          this.steps = userInfo.results;
          this.total = userInfo.total;
        } else {
          this.steps = [];
          this.total = 0;
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error(error);
      },
      () => {
        this.tableLoading = false;
      },
    );
  }
 */
  /**
   * 获取步骤
   * 获取所有步骤，idStageNode 不传
   */
  getSteps() {
    this.tableLoading = true;
    const params: StepSearchRequestParams = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.stageService.getSteps(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: StepSearchResponsePageParams = value.data.page;
          this.steps = info.records;
          this.total = info.total;
        } else {
          this.steps = [];
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
   * 添加或修改问题
   */
  addOrUpdateStage(question = {}): void {
    const addOrUpdateModal = this.modalService.create({
      nzTitle: Object.keys(question).length ? '修改问题' : '新增问题',
      nzContent: AddOrUpdateStageComponent,
      nzFooter: null,
      nzComponentParams: {
        question: Object.keys(question).length ? question : {},
      },
    });

    addOrUpdateModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增或修改成功后，重置页码
      }
    });
  }

  /**
   * 删除问题
   * @param user UserInfoParams
   */
  deleteStep(question: StageInfoParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除问题 <i>${question.question}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(question),
      nzCancelText: '取消',
    });
  }
  delete(question: StageInfoParams): void {
    const params: DeleteStageRequestParams = {
      faq_id: question.faq_id,
    };
    this.stageService.deleteStep(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('删除成功');
          this.search(); // 删除成功后，重置页码，避免当前页没有数据
        } else {
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }
}
