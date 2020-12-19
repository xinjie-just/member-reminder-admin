import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/service/user.service';
import { ResponseParams } from '@shared/interface/response';
import { UserInfoParams, DeleteUserRequestParams, UserRequestParams } from '@shared/interface/user';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
})
export class UserComponent implements OnInit {
  constructor(private userService: UserService, private msg: NzMessageService, private modalService: NzModalService) {}

  username = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  users: UserInfoParams[] = [];

  ngOnInit(): void {
    this.getUers();
  }

  /**
   * 查询用户
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getUers();
  }

  /**
   * 获取用户列表
   */
  getUers(): void {
    this.tableLoading = true;
    const params: UserRequestParams = {
      query: this.username.trim(),
      pos: (this.pageIndex - 1) * this.pageSize,
      cnt: this.pageSize,
    };
    this.userService.getUers(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const userInfo = value.data;
          this.users = userInfo.results.map((item: UserInfoParams) => {
            return {
              disabled: item.id === Number(localStorage.getItem('userId')),
              ...item,
            };
          });
          this.total = userInfo.total;
        } else {
          this.users = [];
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
   * 添加用户
   */
  addUser(): void {
    const addModal = this.modalService.create({
      nzTitle: '新增用户',
      nzContent: AddComponent,
      nzFooter: null,
    });

    addModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }

  /**
   * 删除用户
   * @param user UserInfoParams
   */
  deleteUser(user: UserInfoParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除用户 <i>${user.name}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(user),
      nzCancelText: '取消',
    });
  }
  delete(user: UserInfoParams): void {
    const params: DeleteUserRequestParams = {
      dst_id: user.id,
    };
    this.userService.deleteUser(params).subscribe(
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
   * 修改用户密码
   */
  updateUser(user: UserInfoParams): void {
    const updateModel = this.modalService.create({
      nzTitle: '修改密码',
      nzContent: UpdateComponent,
      nzFooter: null,
      nzComponentParams: {
        userId: user.id,
        userName: user.name,
      },
    });

    updateModel.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 修改成功后，重置页码
      }
    });
  }
}
