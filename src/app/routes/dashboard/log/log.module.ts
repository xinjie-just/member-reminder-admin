import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LogRoutingModule } from './log-routing.module';
import { OperationLogComponent } from './operation/operation.component';
import { RemindLogComponent } from './remind/remind.component';
import { TimingLogComponent } from './timing/timing.component';
import { AddComponent } from './remind/add/add.component';

const COMPONENTS = [OperationLogComponent, RemindLogComponent, TimingLogComponent];
const COMPONENTS_NOROUNT = [OperationLogComponent, RemindLogComponent, TimingLogComponent];

@NgModule({
  imports: [SharedModule, LogRoutingModule],
  declarations: [...COMPONENTS, AddComponent],
  entryComponents: [...COMPONENTS_NOROUNT],
})
export class LogModule {}
