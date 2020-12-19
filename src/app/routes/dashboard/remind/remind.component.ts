import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  RemindInfoParams,
  DeleteRemindRequestParams,
  RemindSearchRequestParams,
  OnlineRemindRequestParams,
} from '@shared/interface/remind';
import { ResponseParams } from '@shared/interface/response';
import { RemindService } from '@shared/service/remind.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddRemindComponent } from './add/add.component';

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
  ) {}

  name = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  models: RemindInfoParams[] = [];
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
    this.getReminds();
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
    this.getReminds();
  }

  /**
   * 模型搜索
   */
  getReminds(): void {
    this.tableLoading = true;
    const params: RemindSearchRequestParams = {
      title: this.name.trim(),
      state: this.status,
      pos: (this.pageIndex - 1) * this.pageSize,
      cnt: this.pageSize,
    };
    this.remindService.getReminds(params).subscribe(
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
      nzContent: AddRemindComponent,
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
   * @param user RemindInfoParams
   */
  deleteRemind(remind: RemindInfoParams): void {
    this.nzModalService.confirm({
      nzTitle: `你确定要删除模型 <i>${remind.title}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(remind),
      nzCancelText: '取消',
    });
  }
  delete(remind: RemindInfoParams): void {
    const params: DeleteRemindRequestParams = {
      model_id: remind.model_id,
    };
    this.remindService.deleteRemind(params).subscribe(
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
  onlineRemind(remind: RemindInfoParams): void {
    this.nzModalService.confirm({
      nzTitle: `你确定要上线模型 <i>${remind.title}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.online(remind),
      nzCancelText: '取消',
    });
  }
  online(remind: RemindInfoParams) {
    const params: OnlineRemindRequestParams = {};
    this.remindService.onlineRemind(remind.model_id, params).subscribe(
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
