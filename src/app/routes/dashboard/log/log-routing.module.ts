import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperationLogComponent } from './operation/operation.component';
import { TimingLogComponent } from './timing/timing.component';

const routes: Routes = [
  { path: '', redirectTo: 'operation', pathMatch: 'full' },
  { path: 'operation', component: OperationLogComponent },
  { path: 'timing', component: TimingLogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogRoutingModule {}
