import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { RoleService } from '@shared/service/role.service';
import {
  DeleteRoleRequestParams,
  RoleSearchRequestParams,
  RoleSearchResponsePageParams,
  RoleSearchResponseRecordsParams,
} from '@shared/interface/role';
import { ResponseParams } from '@shared/interface/response';
import { AddOrUpdateRoleComponent } from './add-or-update/add-or-update.component';
import { CurrentUserInfo } from '@shared/interface/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less'],
})
export class RoleComponent implements OnInit {
  name = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  roles: RoleSearchResponseRecordsParams[] = [];

  currentUserInfo: CurrentUserInfo = {
    lastLoginTime: null,
    phone: null,
    realName: null,
    roleId: null,
    startTime: null,
    token: null,
    userId: null,
    userState: null,
  };

  constructor(
    private roleService: RoleService,
    private router: Router,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.currentUserInfo = JSON.parse(localStorage.getItem('_token'));
    if (!this.currentUserInfo) {
      this.router.navigateByUrl('/passport/login');
      this.msg.error('请先登录！');
    }
    this.getRoles();
  }

  /**
   * 查询角色
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getRoles();
  }

  /**
   * 搜索角色
   */
  getRoles(): void {
    this.tableLoading = true;
    const params: RoleSearchRequestParams = {
      roleName: this.name.trim(),
      pageNo: this.pageIndex,
      pageSize: this.pageSize,
    };
    this.roleService.getRoles(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: RoleSearchResponsePageParams = value.data.page;
          this.roles = info.records;
          this.total = info.total;
        } else {
          this.roles = [];
          this.total = 0;
          this.msg.error(value.message);
        }
      },
      () => {
        // this.msg.error(error);  // 注释掉，避免未登录状态下从工作台进入时出现[object, object]
      },
      () => {
        this.tableLoading = false;
      },
    );
  }

  /**
   * 添加或删除角色
   */
  addOrUpdate(role?: RoleSearchResponseRecordsParams): void {
    const addOrUpdateRoleModal = this.modalService.create({
      nzTitle: role ? '修改角色' : '新增角色',
      nzContent: AddOrUpdateRoleComponent,
      nzComponentParams: {
        role: role ? role : null,
      },
      nzFooter: null,
    });

    addOrUpdateRoleModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 新增或修改成功后，重置页码
      }
    });
  }

  /**
   * 删除角色
   * @param user RoleSearchResponseRecordsParams
   */
  deleteRole(role: RoleSearchResponseRecordsParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除角色 <i>${role.roleName}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(role),
      nzCancelText: '取消',
    });
  }
  delete(role: RoleSearchResponseRecordsParams): void {
    const params: DeleteRoleRequestParams = {
      idRole: role.idRole,
    };
    this.roleService.deleteRole(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          this.msg.success('角色 <i>${role.roleName}</i> 删除成功');
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
}
