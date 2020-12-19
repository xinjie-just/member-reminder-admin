import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { RoleComponent } from './role/role.component';
import { RemindComponent } from './remind/remind.component';
import { StageComponent } from './stage/stage.component';
import { UserComponent } from './user/user.component';
import { AddComponent } from './user/add/add.component';
import { AddOrUpdateComponent } from './stage/add-or-update/add-or-update.component';
import { ImportComponent } from './stage/import/import.component';
import { AddRemindComponent } from './remind/add/add.component';
import { ImportReadComponent } from './role/import/import.component';
import { ViewComponent } from './role/view/view.component';
import { LabelAddComponent } from './role/label-add/label-add.component';
import { LabelUpdateComponent } from './role/label-update/label-update.component';
import { LogComponent } from './log/log.component';

const COMPONENTS = [
  RoleComponent,
  RemindComponent,
  StageComponent,
  UserComponent,
  AddComponent,
  AddOrUpdateComponent,
  ImportComponent,
  AddRemindComponent,
  ImportReadComponent,
  ViewComponent,
  LabelAddComponent,
  LabelUpdateComponent,
];
const COMPONENTS_NOROUNT = [
  AddComponent,
  AddOrUpdateComponent,
  ImportComponent,
  AddRemindComponent,
  ImportReadComponent,
  ViewComponent,
  LabelAddComponent,
  LabelUpdateComponent,
];

@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, LogComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class DashboardModule {}
