import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { ModelComponent } from './model/model.component';
import { ReadComponent } from './read/read.component';
import { UserComponent } from './user/user.component';
import { ViewComponent } from './read/view/view.component';
import { ThresholdComponent } from './threshold/threshold.component';
import { AnswerComponent } from './answer/answer.component';

const routes: Routes = [
  { path: '', redirectTo: 'data/read', pathMatch: 'full' },
  { path: 'data/faq', component: FaqComponent, data: { title: '问答对库' } },
  { path: 'data/read', component: ReadComponent, data: { title: '文档库' } },
  { path: 'data/read/:id', component: ViewComponent, data: { title: '文档标注' } },
  { path: 'model/read', component: ModelComponent, data: { title: '阅读理解模型', showAddBtn: true } },
  { path: 'model/semantic', component: ModelComponent, data: { title: '问题语义联想模型', showAddBtn: false } },
  { path: 'model/intentions', component: ModelComponent, data: { title: '问题意图分类模型', showAddBtn: false } },
  { path: 'user', component: UserComponent, data: { title: '用户管理' } },
  { path: 'threshold', component: ThresholdComponent, data: { title: '问题阈值管理' } },
  { path: 'answer', component: AnswerComponent, data: { title: '答案生成管理' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
