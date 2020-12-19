import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './stage/stage.component';
import { RemindComponent } from './remind/remind.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { ViewComponent } from './role/view/view.component';
import { LogComponent } from './log/log.component';

const routes: Routes = [
  { path: '', redirectTo: 'role', pathMatch: 'full' },
  { path: 'user', component: UserComponent, data: { title: '用户管理' } },
  { path: 'role', component: RoleComponent, data: { title: '角色管理' } },
  { path: 'stage', component: StageComponent, data: { title: '阶段步骤' } },
  // { path: 'role/:id', component: ViewComponent, data: { title: '文档标注' } },
  { path: 'remind', component: RemindComponent, data: { title: '提醒配置管理' } },
  { path: 'log', component: LogComponent, data: { title: '日志管理' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
