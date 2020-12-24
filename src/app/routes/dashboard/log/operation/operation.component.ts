import { LogSearchResponsePageParams } from '../../../../shared/interface/log';
import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { LogService } from '@shared/service/log.service';
import { ResponseParams } from '@shared/interface/response';
import { OperationLogSearchRequestParams, LogSearchResponseRecordsParams } from '@shared/interface/log';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.less'],
})
export class OperationLogComponent implements OnInit {
  tableLoading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  logs: LogSearchResponseRecordsParams[] = [];

  constructor(private logService: LogService, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.getOperationLogs();
  }

  getOperationLogs() {
    this.tableLoading = true;
    const params: OperationLogSearchRequestParams = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.logService.getOperationLogs(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: LogSearchResponsePageParams = value.data.page;
          this.logs = info.records;
          this.total = info.total;
        } else {
          this.total = 0;
          this.logs = [];
          this.msg.error(value.message);
        }
      },
      () => {
        this.msg.error('业务日志查询成功！');
        this.tableLoading = false;
      },
      () => {
        this.tableLoading = false;
      },
    );
  }
}
