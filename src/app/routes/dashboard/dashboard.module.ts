import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { RoleComponent } from './role/role.component';
import { RemindComponent } from './remind/remind.component';
import { StageComponent } from './stage/stage.component';
import { UserComponent } from './user/user.component';
import { AddComponent } from './user/add/add.component';
import { AddOrUpdateStageComponent } from './stage/add-or-update/add-or-update.component';
import { LogComponent } from './log/log.component';
import { AddOrUpdateRoleComponent } from './role/add-or-update/add-or-update.component';
import { UpdatePasswordComponent } from './user/update-password/update-password.component';
import { AddOrUpdateRemindComponent } from './remind/add-or-update/add-or-update.component';

const COMPONENTS = [
  RoleComponent,
  RemindComponent,
  StageComponent,
  UserComponent,
  AddComponent,
  AddOrUpdateRoleComponent,
  AddOrUpdateStageComponent,
  AddOrUpdateRemindComponent,
];
const COMPONENTS_NOROUNT = [
  AddComponent,
  AddOrUpdateRoleComponent,
  AddOrUpdateStageComponent,
  AddOrUpdateRemindComponent,
];

@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, LogComponent, UpdatePasswordComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class DashboardModule {}
