import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  ModelInfoParams,
  DeleteModelRequestParams,
  ModelSearchRequestParams,
  OnlineModelRequestParams,
} from '@shared/interface/model';
import { ResponseParams } from '@shared/interface/response';
import { ModelService } from '@shared/service/model.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddModelComponent } from '../model/add/add.component';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.less'],
})
export class ModelComponent implements OnInit {
  constructor(
    private modelService: ModelService,
    private msg: NzMessageService,
    private nzModalService: NzModalService,
    private route: ActivatedRoute,
  ) {}

  name = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  models: ModelInfoParams[] = [];
  status = 0;
  title = '';
  showAddBtn = true;

  statusOption = [
    { value: 0, label: '全部' },
    { value: 1, label: '训练中' },
    { value: 2, label: '训练完成' },
    { value: 3, label: '训练失败' },
  ];

  ngOnInit(): void {
    this.getModels();
    this.route.data.subscribe((data: { title: string; showAddBtn: boolean }) => {
      this.title = data.title;
      this.showAddBtn = data.showAddBtn;
    });
  }

  /**
   * 查询问题
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getModels();
  }

  /**
   * 模型搜索
   */
  getModels(): void {
    this.tableLoading = true;
    const params: ModelSearchRequestParams = {
      title: this.name.trim(),
      state: this.status,
      pos: (this.pageIndex - 1) * this.pageSize,
      cnt: this.pageSize,
    };
    this.modelService.getModels(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const userInfo = value.data;
          this.models = userInfo.results;
          this.total = userInfo.total;
        } else {
          this.models = [];
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

  /**
   * 新建模型
   */
  add(): void {
    const addOrUpdateModal = this.nzModalService.create({
      nzTitle: '新增模型',
      nzContent: AddModelComponent,
      nzWidth: 570,
      nzFooter: null,
    });

    addOrUpdateModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }

  /**
   * 删除模型
   * @param user ModelInfoParams
   */
  deleteModel(model: ModelInfoParams): void {
    this.nzModalService.confirm({
      nzTitle: `你确定要删除模型 <i>${model.title}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(model),
      nzCancelText: '取消',
    });
  }
  delete(model: ModelInfoParams): void {
    const params: DeleteModelRequestParams = {
      model_id: model.model_id,
    };
    this.modelService.deleteModel(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
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

  /**
   * 上线
   */
  onlineModel(model: ModelInfoParams): void {
    this.nzModalService.confirm({
      nzTitle: `你确定要上线模型 <i>${model.title}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.online(model),
      nzCancelText: '取消',
    });
  }
  online(model: ModelInfoParams) {
    const params: OnlineModelRequestParams = {};
    this.modelService.onlineModel(model.model_id, params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('模型上线成功');
          this.search(); // 上线成功后，重置页码
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
