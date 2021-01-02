import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// i18n
import { TranslateModule } from '@ngx-translate/core';

import { SHARED_DELON_MODULES } from './shared-delon.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';

// #region third libs
import { CountdownModule } from 'ngx-countdown';
import { NodeStatusPipe, UserRolePipe } from './pipe/user.pipe';
import { RemindTypePipe } from './pipe/remind.pipe';
import { NodeBizTypePipe } from './pipe/stage.pipe';
import { RoleStatusPipe } from './pipe/role.pipe';
import { IsPipe, StatusPipe } from './pipe/common.pipe';

const THIRDMODULES = [CountdownModule];
// #endregion

// #region your componets & directives & pipes
const COMPONENTS = [];
const DIRECTIVES = [];
const PIPES = [UserRolePipe, RoleStatusPipe, StatusPipe, NodeStatusPipe, NodeBizTypePipe, IsPipe, RemindTypePipe];
// #endregion

const SERVICES = [];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonACLModule,
    DelonFormModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonACLModule,
    DelonFormModule,
    // i18n
    TranslateModule,
    ...SHARED_DELON_MODULES,
    ...SHARED_ZORRO_MODULES,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  providers: [...SERVICES],
})
export class SharedModule {}
