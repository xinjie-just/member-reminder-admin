import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@shared/service/user.service';
import { Component, Input, OnInit } from '@angular/core';
import {
  QueryAllNodeStatusRequestParams,
  QueryAllNodeStatusResponseParams,
  UserSearchResponseRecordsParams,
} from '@shared/interface/user';
import { ResponseParams } from '@shared/interface/response';

@Component({
  selector: 'app-view-process',
  templateUrl: './view-process.component.html',
  styles: [],
})
export class ViewProcessComponent implements OnInit {
  @Input() userInfo: UserSearchResponseRecordsParams = {
    idUser: null,
    idRole: null,
    phoneNum: null,
    openId: null,
    realName: null,
    startTime: null,
    lastLoginTime: null,
    dataState: null,
  };
  tableLoading = false;
  pageIndex = 1;
  pageSize = 10;
  total = 0;

  processes: QueryAllNodeStatusResponseParams[] = [];

  constructor(private userService: UserService, private msg: NzMessageService) {}

  ngOnInit(): void {
    this.getQueryAllNode();
  }

  /**
   * 查询个人用户所有节点状态，展示用户的所有节点状态界面调用
   */
  getQueryAllNode(): void {
    this.tableLoading = true;
    const params: QueryAllNodeStatusRequestParams = {
      idUser: this.userInfo.idUser,
    };
    this.userService.queryAllNodeStatus(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.processes = value.data;
          this.total = value.data.length;
        } else {
          this.processes = [];
          this.msg.error(value.message || '查询个人用户所有节点状态失败！');
        }
      },
      (error) => {
        this.msg.error('查询个人用户所有节点状态失败！', error);
        this.tableLoading = false;
      },
      () => {
        this.tableLoading = false;
      },
    );
  }
}
