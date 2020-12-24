import { Component, OnInit } from '@angular/core';
import {
  LogSearchResponsePageParams,
  TimingTaskSearchRecordsParams,
  TimingTaskSearchRequestParams,
} from '@shared/interface/log';
import { ResponseParams } from '@shared/interface/response';
import { LogService } from '@shared/service/log.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-timing',
  templateUrl: './timing.component.html',
  styles: [],
})
export class TimingLogComponent implements OnInit {
  tableLoading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  logs: TimingTaskSearchRecordsParams[] = [];

  constructor(private logService: LogService, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.getTimingLogs();
  }

  getTimingLogs() {
    this.tableLoading = true;
    const params: TimingTaskSearchRequestParams = {
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.logService.getTimingLogs(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: LogSearchResponsePageParams = value.data.page;
          this.logs = value.data.page.records;
          this.total = info.total;
        } else {
          this.total = 0;
          this.logs = [];
          this.msg.error(value.message);
        }
      },
      () => {
        this.msg.error('定时任务日志查询成功！');
        this.tableLoading = false;
      },
      () => {
        this.tableLoading = false;
      },
    );
  }
}
