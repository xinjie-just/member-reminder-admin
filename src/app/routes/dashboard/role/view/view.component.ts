import { Component, OnInit } from '@angular/core';
import {
  LabelQuestionRequestParams,
  LabelQuestionInfoParams,
  DocInfoRequestParams,
  DeleteLabelRequestParams,
  LabelQuestionInfoQuestionsParams,
  DeleteLabelQuestionRequestParams,
  QuestionTypeOptionsObject,
  RowSelectedTextInfo,
} from '@shared/interface/role';
import { ReadService } from '@shared/service/role.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ResponseParams } from '@shared/interface/response';
import { ActivatedRoute } from '@angular/router';
import { LabelAddComponent } from '../label-add/label-add.component';
import { LabelUpdateComponent } from '../label-update/label-update.component';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.less'],
})
export class ViewComponent implements OnInit {
  documentId: number;
  title: string;
  text: string; // 可以用来判断是否跨行划选了，没实际用途
  textArray: string[] = [];
  labelQuestions: LabelQuestionInfoParams[] = [];

  questionTypeOptions: QuestionTypeOptionsObject[] = this.settings.app.questionTypeOptions;

  constructor(
    private roleService: ReadService,
    private msg: NzMessageService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    public settings: SettingsService,
  ) {}

  ngOnInit(): void {
    this.documentId = Number(this.route.snapshot.paramMap.get('id'));
    this.route.queryParamMap.subscribe((params) => {
      this.title = params.get('title');
    });
    this.getDocInfo();
    this.getQuestions();
  }

  /**
   * 获取文档信息
   */
  getDocInfo(): void {
    const params: DocInfoRequestParams = {
      doc_id: this.documentId,
    };
    this.roleService.getDocInfo(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const docInfo = value.data;
          // 对文本根据换行进行拆分，装进数组
          this.text = docInfo.text;
          this.textArray = docInfo.text.split('\n');
        } else {
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 选择文本
   * @param idx number
   */
  selectionText(idx: number): void {
    const txt = window.getSelection();
    // 选区起点的位置偏移量和终点的位置偏移量
    if (Math.abs(txt.anchorOffset - txt.focusOffset) > 0) {
      // 区分开始和结束位置
      const start: number = txt.anchorOffset - txt.focusOffset > 0 ? txt.focusOffset : txt.anchorOffset;
      // 将前面段落的长度加起来组成开始索引
      let lengthCount = 0;
      for (let i = 0; i < idx; i++) {
        if (this.textArray[i].length === 0) {
          lengthCount += 1;
        } else {
          lengthCount += this.textArray[i].length;
        }
        if (this.textArray[i + 1] && this.textArray[i + 1].length !== 0) {
          lengthCount += 1; // 段落与段落之间的换行符
        }
      }
      lengthCount += start;
      // 选择的文本的信息
      const addLabelQuestionParams: RowSelectedTextInfo = {
        txtStart: lengthCount,
        txtEnd: lengthCount + txt.toString().length - 1, // 根据 api 要求，end 减 1
        answer: txt.toString(),
      };
      if (txt.toString() !== this.text.substring(lengthCount, lengthCount + txt.toString().length)) {
        console.log('跨行划选');
      }
      this.addLabelQuestion(addLabelQuestionParams);
    }
  }

  /**
   * 为选择的答案添加问题
   * @param params RowSelectedTextInfo
   */
  addLabelQuestion(params: RowSelectedTextInfo, labelQuestionObj?: LabelQuestionInfoParams): void {
    const labelAddModel = this.modalService.create({
      nzTitle: '新增标注问题',
      nzContent: LabelAddComponent,
      nzWidth: 600,
      nzComponentParams: {
        start: params.txtStart,
        end: params.txtEnd,
        documentId: this.documentId,
        selectedText: params.answer,
        questionTypeOptions: this.questionTypeOptions,
      },
      nzFooter: null,
    });

    labelAddModel.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.getQuestions(labelQuestionObj);
      }
    });
  }

  /**
   * 获取问题列表
   */
  getQuestions(labelQuestionObj?: LabelQuestionInfoParams): void {
    const params: LabelQuestionRequestParams = {
      doc_id: this.documentId,
      pos: 0, // 默认值，不分页
      cnt: 999999, // 设置一个很大的值，不分页
    };
    this.roleService.labelQuestion(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const userInfo = value.data;
          // isOpen 用来设置折叠菜单是否展开（默认全部折叠）
          this.labelQuestions = userInfo.results.map((item: LabelQuestionInfoParams) => {
            return {
              isOpen: false,
              ...item,
            };
          });
          // 本次操作的“问答对对象”折叠面板展开
          this.labelQuestions.forEach((item) => {
            if (labelQuestionObj) {
              if (item.faq_id === labelQuestionObj.faq_id) {
                item.isOpen = labelQuestionObj.isOpen;
              }
            }
          });
        } else {
          this.labelQuestions = [];
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 标注问题修改
   * @param questionObj LabelQuestionInfoQuestionsParams
   * @param labelQuestion LabelQuestionInfoParams
   */
  updateQuestion(questionObj: LabelQuestionInfoQuestionsParams, labelQuestion: LabelQuestionInfoParams): void {
    this.setCollapsePanelStatus(labelQuestion);
    const labelUpdateModel = this.modalService.create({
      nzTitle: '修改标注问题',
      nzContent: LabelUpdateComponent,
      nzWidth: 600,
      nzComponentParams: {
        question_id: questionObj.rc_question_id,
        question: questionObj.question,
        question_type: questionObj.question_type,
        answer: labelQuestion.answer,
        questionTypeOptions: this.questionTypeOptions,
      },
      nzFooter: null,
    });
    labelUpdateModel.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.getQuestions(labelQuestion);
      }
    });
  }

  /**
   * 标注问题删除
   * @param question LabelQuestionInfoParams
   */
  deleteQuestion(question: LabelQuestionInfoQuestionsParams, labelQuestion?: LabelQuestionInfoParams): void {
    this.setCollapsePanelStatus(labelQuestion);
    const params: DeleteLabelQuestionRequestParams = {
      question_id: question.rc_question_id,
    };
    this.roleService.deleteLabelQuestion(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('删除成功');
          this.getQuestions(labelQuestion);
        } else {
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 为当前答案添加问题
   * @param labelQuestion LabelQuestionInfoParams
   */
  addQuestion(labelQuestion: LabelQuestionInfoParams): void {
    this.setCollapsePanelStatus(labelQuestion);
    const addLabelQuestionParams: RowSelectedTextInfo = {
      txtStart: labelQuestion.start,
      txtEnd: labelQuestion.end,
      answer: labelQuestion.answer,
    };
    this.addLabelQuestion(addLabelQuestionParams, labelQuestion);
  }

  /**
   * 设置折叠面板折叠状态
   * @param labelQuestion LabelQuestionInfoParams
   */
  setCollapsePanelStatus(labelQuestion: LabelQuestionInfoParams): void {
    this.labelQuestions.forEach((item) => {
      item.isOpen = false;
    });
    labelQuestion.isOpen = true;
  }

  /**
   * 标注问题和答案整体删除
   * @param question LabelQuestionInfoParams
   */
  deleteQuestionAndLog(questionAndLog: LabelQuestionInfoParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除标注及其问题吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(questionAndLog),
      nzCancelText: '取消',
    });
  }

  delete(question: LabelQuestionInfoParams): void {
    const params: DeleteLabelRequestParams = {
      faq_id: question.faq_id,
    };
    this.roleService.deleteLabel(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('删除成功');
          this.getQuestions();
        } else {
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error(error);
      },
    );
  }
}
