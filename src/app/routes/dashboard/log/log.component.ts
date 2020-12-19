import { NzMessageService } from 'ng-zorro-antd';
import { Component, OnInit } from '@angular/core';
import { LogService } from '@shared/service/log.service';
import { ResponseParams } from '@shared/interface/response';
import { LogTransform } from '@shared/interface/log';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less'],
})
export class LogComponent implements OnInit {
  loading = false;
  switchValue = false;
  statusId: number;
  constructor(private logService: LogService, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.logService.getLogTransform().subscribe(
      (value: ResponseParams) => {
        if (value.code === 0) {
          const data: LogTransform = value.data;
          this.statusId = data.status_id; // 本状态的数据id
          this.switchValue = Boolean(data.answer_change_value);
        } else {
          this.msg.error(value.msg);
        }
      },
      () => {
        this.msg.error(`"获取是否启用答案转换"失败！`);
      },
    );
  }

  onChange(status: boolean) {
    this.loading = true;
    const params: LogTransform = {
      answer_change_value: Number(status),
      status_id: this.statusId,
    };
    this.logService.updateLogTransform(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 0) {
          this.msg.success(status ? '启用答案转换成功！' : '停用答案转换成功！');
        } else {
          this.msg.error(value.msg);
        }
      },
      () => {
        this.msg.error(`"修改答案生成转换"失败！`);
      },
      () => {
        this.loading = false;
      },
    );
  }
}
