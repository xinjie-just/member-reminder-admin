import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StageComponent } from './stage/stage.component';
import { RemindComponent } from './remind/remind.component';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path: '', redirectTo: 'role', pathMatch: 'full' },
  { path: 'role', component: RoleComponent },
  { path: 'user', component: UserComponent },
  { path: 'stage', component: StageComponent },
  { path: 'remind', component: RemindComponent },
  { path: 'task', component: TaskComponent },
  { path: 'log', loadChildren: () => import('./log/log.module').then((m) => m.LogModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
