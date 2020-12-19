import { Component, OnInit } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { QuestionService } from '@shared/service/faq.service';
import { QuestionInfoParams, QuestionSearchRequestParams, DeleteQuestionRequestParams } from '@shared/interface/faq';
import { ResponseParams } from '@shared/interface/response';
import { AddOrUpdateComponent } from './add-or-update/add-or-update.component';
import { ImportComponent } from './import/import.component';
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.less'],
})
export class FaqComponent implements OnInit {
  question = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中

  questions: QuestionInfoParams[] = [];

  constructor(
    private questionService: QuestionService,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.getQuestions();
  }

  /**
   * 查询问题
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getQuestions();
  }

  /**
   * 搜索问题
   */
  getQuestions(): void {
    this.tableLoading = true;
    const params: QuestionSearchRequestParams = {
      query: this.question.trim(),
      pos: (this.pageIndex - 1) * this.pageSize,
      cnt: this.pageSize,
    };
    this.questionService.getQuestions(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const userInfo = value.data;
          this.questions = userInfo.results;
          this.total = userInfo.total;
        } else {
          this.questions = [];
          this.total = 0;
          this.msg.error(value.msg);
        }
      },
      error => {
        this.msg.error(error);
      },
      () => {
        this.tableLoading = false;
      },
    );
  }

  /**
   * 添加或修改问题
   */
  addOrUpdateQuestion(question = {}): void {
    const addOrUpdateModal = this.modalService.create({
      nzTitle: Object.keys(question).length ? '修改问题' : '新增问题',
      nzContent: AddOrUpdateComponent,
      nzFooter: null,
      nzComponentParams: {
        question: Object.keys(question).length ? question : {},
      },
    });

    addOrUpdateModal.afterClose.subscribe(result => {
      if (result && result.data === 'success') {
        this.search(); // 新增或修改成功后，重置页码
      }
    });
  }

  /**
   * 删除问题
   * @param user UserInfoParams
   */
  deleteQuestion(question: QuestionInfoParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除问题 <i>${question.question}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(question),
      nzCancelText: '取消',
    });
  }
  delete(question: QuestionInfoParams): void {
    const params: DeleteQuestionRequestParams = {
      faq_id: question.faq_id,
    };
    this.questionService.deleteQuestion(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('删除成功');
          this.search(); // 删除成功后，重置页码，避免当前页没有数据
        } else {
          this.msg.error(value.msg);
        }
      },
      error => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 导入
   */
  importQuestions(): void {
    const importModal = this.modalService.create({
      nzTitle: '导入文档',
      nzContent: ImportComponent,
      nzFooter: null,
    });

    importModal.afterClose.subscribe(result => {
      if (result && result.data === 'success') {
        this.search(); // 新增或修改成功后，重置页码
      }
    });
  }
}
