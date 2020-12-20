import { Component, OnInit } from '@angular/core';
import { UserService } from '@shared/service/user.service';
import { ResponseParams } from '@shared/interface/response';
import {
  DeleteUserRequestParams,
  ResetPasswordRequestParams,
  UserSearchRequestParams,
  UserSearchResponsePageParams,
  UserSearchResponseRecordsParams,
} from '@shared/interface/user';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import {
  RoleSearchRequestParams,
  RoleSearchResponsePageParams,
  RoleSearchResponseRecordsParams,
} from '@shared/interface/role';
import { RoleService } from '@shared/service/role.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {}

  username = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  users: UserSearchResponseRecordsParams[] = [];
  roles: RoleSearchResponseRecordsParams[] = [];

  stage;
  stages;

  ngOnInit(): void {
    this.getUers();
    this.getRoles();
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
    const params: UserSearchRequestParams = {
      userName: this.username.trim(),
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.userService.getUers(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: UserSearchResponsePageParams = value.data.page;
          this.users = info.records;
          // const userInfo = info.records;
          // this.users = userInfo.map((item: UserSearchResponseRecordsParams) => {
          //   return {
          //     disabled: item.id === Number(localStorage.getItem('userId')),
          //     ...item,
          //   };
          // });
          this.total = info.total;
        } else {
          this.users = [];
          this.total = 0;
          this.msg.error(value.msg);
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
   * 获取角色信息
   */
  getRoles(): void {
    const params: RoleSearchRequestParams = {
      roleName: '',
      pageNo: 1,
      pageSize: 999,
    };
    this.roleService.getRoles(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: RoleSearchResponsePageParams = value.data.page;
          this.roles = info.records;
        } else {
          this.roles = [];
          this.total = 0;
          this.msg.error(value.message);
        }
      },
      () => {
        this.msg.error('角色信息获取失败！');
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
      nzComponentParams: {
        roles: this.roles,
      },
    });

    addModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }

  /**
   * 修改用户信息
   */
  updateUser(user: UserSearchResponseRecordsParams): void {
    const updateModal = this.modalService.create({
      nzTitle: '修改用户信息',
      nzContent: UpdateComponent,
      nzFooter: null,
      nzComponentParams: {
        user,
        roles: this.roles,
        role: user.idRole,
      },
    });

    updateModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增成功后，重置页码
      }
    });
  }

  /**
   * 删除用户
   * @param user UserSearchResponseRecordsParams
   */
  deleteUserModal(user: UserSearchResponseRecordsParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除用户 <i>${user.realName}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteUser(user),
      nzCancelText: '取消',
    });
  }
  deleteUser(user: UserSearchResponseRecordsParams): void {
    const params: DeleteUserRequestParams = {
      idUser: user.idUser,
    };
    this.userService.deleteUser(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('用户删除成功');
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
   * 查看流程
   */
  viewProcess(user: UserSearchResponseRecordsParams) {}

  /**
   * 重置密码
   */
  resetPasswordModal(user: UserSearchResponseRecordsParams) {
    this.modalService.confirm({
      nzTitle: `你确定要重置用户 <i>${user.realName}</i> 的密码吗？`,
      nzContent: '<b>密码将重置为手机号后6位</b>',
      nzOnOk: () => this.resetPassword(user),
    });
  }
  resetPassword(user: UserSearchResponseRecordsParams) {
    const params: ResetPasswordRequestParams = {
      idUser: user.idUser,
    };
    this.userService.resetPassword(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('用户密码重置成功');
          this.search(); // 用户密码成功后，重置页码，回到第一页
        } else {
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error('用户密码重置失败！', error);
      },
    );
  }

  /**
   * 修改用户密码
   */
  /* updateUser(user: UserInfoParams): void {
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
  } */
}
