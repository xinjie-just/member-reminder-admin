import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { ReadComponent } from './read/read.component';
import { ModelComponent } from './model/model.component';
import { FaqComponent } from './faq/faq.component';
import { UserComponent } from './user/user.component';
import { AddComponent } from './user/add/add.component';
import { AddOrUpdateComponent } from './faq/add-or-update/add-or-update.component';
import { ImportComponent } from './faq/import/import.component';
import { AddModelComponent } from './model/add/add.component';
import { ImportReadComponent } from './read/import/import.component';
import { ViewComponent } from './read/view/view.component';
import { LabelAddComponent } from './read/label-add/label-add.component';
import { LabelUpdateComponent } from './read/label-update/label-update.component';
import { ThresholdComponent } from './threshold/threshold.component';
import { AnswerComponent } from './answer/answer.component';

const COMPONENTS = [
  ReadComponent,
  ModelComponent,
  FaqComponent,
  UserComponent,
  AddComponent,
  AddOrUpdateComponent,
  ImportComponent,
  AddModelComponent,
  ImportReadComponent,
  ViewComponent,
  LabelAddComponent,
  LabelUpdateComponent,
  ThresholdComponent,
];
const COMPONENTS_NOROUNT = [
  AddComponent,
  AddOrUpdateComponent,
  ImportComponent,
  AddModelComponent,
  ImportReadComponent,
  ViewComponent,
  LabelAddComponent,
  LabelUpdateComponent,
  ThresholdComponent,
];

@NgModule({
  imports: [SharedModule, DashboardRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, AnswerComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class DashboardModule {}
