import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LogRoutingModule } from './log-routing.module';
import { OperationLogComponent } from './operation/operation.component';
import { TimingLogComponent } from './timing/timing.component';

const COMPONENTS = [OperationLogComponent, TimingLogComponent];
const COMPONENTS_NOROUNT = [OperationLogComponent, TimingLogComponent];

@NgModule({
  imports: [SharedModule, LogRoutingModule],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS_NOROUNT],
})
export class LogModule {}
