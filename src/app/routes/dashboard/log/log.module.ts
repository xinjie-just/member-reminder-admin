import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { LogRoutingModule } from './log-routing.module';
import { OperationLogComponent } from './operation/operation.component';
import { RemindLogComponent } from './remind/remind.component';
import { SendLogComponent } from './send/send.component';

const COMPONENTS = [OperationLogComponent, RemindLogComponent, SendLogComponent];
const COMPONENTS_NOROUNT = [OperationLogComponent, RemindLogComponent, SendLogComponent];

@NgModule({
  imports: [SharedModule, LogRoutingModule],
  declarations: [...COMPONENTS],
  entryComponents: [...COMPONENTS_NOROUNT],
})
export class LogModule {}
