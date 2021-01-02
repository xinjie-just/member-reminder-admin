import { CurrentUserInfo, LockOrUnlockUserRequestParams } from './../../../shared/interface/user';
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
import { StageService } from '@shared/service/stage.service';
import {
  StageSearchResponseDataParams,
  StepSearchResponsePageParams,
  StepSearchResponseRecordsParams,
} from '@shared/interface/stage';
import { ViewProcessComponent } from './view-process/view-process.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less'],
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private stageService: StageService,
  ) {}

  username = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中
  currentUserInfo: CurrentUserInfo = {
    lastLoginTime: null,
    // phone: null,
    // realName: null,
    roleId: null,
    startTime: null,
    token: null,
    userId: null,
    userState: null,
  };

  users: UserSearchResponseRecordsParams[] = [];
  roles: RoleSearchResponseRecordsParams[] = [];

  step: number = null;
  steps: StepSearchResponseRecordsParams[] = [];

  ngOnInit(): void {
    this.currentUserInfo = JSON.parse(localStorage.getItem('_token'));
    this.getSteps();
    this.getUers();
    this.getRoles();
  }

  /**
   * 搜索步骤
   */
  getSteps(): void {
    const params = {
      pageNo: 1,
      pageSize: 999,
    };
    this.stageService.getSteps(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: StepSearchResponsePageParams = value.data.page;
          this.steps = info.records;
        } else {
          this.steps = [];
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 改变步骤
   * @param idNode number
   */
  onChangeStep(idNode: number) {
    this.step = idNode;
    this.getUers(this.step);
  }

  inputClear() {
    this.username = '';
    this.search();
  }

  /**
   * 查询用户
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getUers(this.step);
  }

  /**
   * 获取用户列表
   */
  getUers(step?: number): void {
    this.tableLoading = true;
    let params: UserSearchRequestParams = {
      keyword: this.username.trim(),
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    if (step) {
      params = { ...params, idNode: step };
    }
    this.userService.getUers(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: UserSearchResponsePageParams = value.data.page;
          this.users = info.records;
          this.total = info.total;
        } else {
          this.users = [];
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
  deleteUser(user: UserSearchResponseRecordsParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除用户 <i>${user.realName}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(user),
      nzCancelText: '取消',
    });
  }
  delete(user: UserSearchResponseRecordsParams): void {
    const params: DeleteUserRequestParams = {
      idUser: user.idUser,
    };
    this.userService.deleteUser(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('用户删除成功');
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

  /**
   * 查看流程
   */
  viewProcess(user: UserSearchResponseRecordsParams) {
    this.modalService.create({
      nzTitle: '用户入党流程查看',
      nzContent: ViewProcessComponent,
      nzFooter: null,
      nzWidth: 900,
      nzComponentParams: {
        userInfo: user,
      },
    });
  }

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
          this.msg.error(value.message);
        }
      },
      (error) => {
        this.msg.error('用户密码重置失败！', error);
      },
    );
  }

  /**
   * 锁定或解锁用户
   * @param remind UserSearchResponseRecordsParams
   */
  lockOrUnlockUser(user: UserSearchResponseRecordsParams): void {
    const type = user.dataState === 0 ? '解锁' : '锁定';
    this.modalService.confirm({
      nzTitle: `你确定要${type}用户 <i>${user.realName}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.lockOrUnlock(user),
      nzCancelText: '取消',
    });
  }
  lockOrUnlock(user: UserSearchResponseRecordsParams): void {
    const params: LockOrUnlockUserRequestParams = {
      idUser: user.idUser,
    };
    if (user.dataState !== 0) {
      this.userService.lockUser(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('锁定成功！');
            this.search(); // 锁定成功后，重置页码
          } else {
            this.msg.error(value.message);
          }
        },
        (error) => {
          this.msg.error('锁定失败！', error);
        },
      );
    } else {
      this.userService.unlockUser(params).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('解锁成功！');
            this.search(); // 解锁成功后，重置页码
          } else {
            this.msg.error(value.message);
          }
        },
        (error) => {
          this.msg.error('解锁失败！', error);
        },
      );
    }
  }
}
