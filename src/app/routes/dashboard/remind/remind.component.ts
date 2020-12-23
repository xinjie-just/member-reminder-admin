import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
  DeleteRemindRequestParams,
  RemindSearchRequestParams,
  RemindSearchResponsePageParams,
  RemindSearchResponseRecordsParams,
} from '@shared/interface/remind';
import { ResponseParams } from '@shared/interface/response';
import { RemindService } from '@shared/service/remind.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddOrUpdateRemindComponent } from './add-or-update/add-or-update.component';

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

  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  step: number = null;
  reminds: RemindSearchResponseRecordsParams[] = [];

  ngOnInit(): void {
    this.getReminds();
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
  getReminds(): void {
    this.tableLoading = true;
    let params: RemindSearchRequestParams = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    if (this.step) {
      params = { ...params, idNode: this.step };
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

  lockRemind(remind: RemindSearchResponseRecordsParams): void {
    console.log('提醒配置锁定开发中');
    this.msg.warning('提醒配置锁定开发中');
  }
}
