import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '@shared/service/stage.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import {
  CreateQuestionRequestParams,
  UpdateQuestionRequestParams,
  RecommendLogRequestParams,
} from '@shared/interface/stage';
import { ResponseParams } from '@shared/interface/response';

@Component({
  selector: 'app-add-or-update',
  templateUrl: './add-or-update.component.html',
  styles: [],
})
export class AddOrUpdateComponent implements OnInit {
  @Input() question: { faq_id?: number; question?: string; answer?: string } = {};
  form: FormGroup;
  uploading = false;

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private msg: NzMessageService,
    private modal: NzModalRef,
  ) {
    this.form = this.fb.group({
      question: [null, [Validators.required, Validators.pattern(/^.{1,100}$/)]],
      answer: [null, [Validators.required, Validators.pattern(/^.{1,10000}$/)]],
    });
  }

  ngOnInit(): void {
    if (Object.keys(this.question).length) {
      this.form.patchValue({
        question: this.question.question,
        answer: this.question.answer,
      });
    }
  }

  /**
   * 推荐答案
   * @param question string
   */
  recommendLog(question: string): void {
    const params: RecommendLogRequestParams = {
      question,
    };
    this.questionService.recommendLog(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.form.patchValue({
            answer: value.data.answer,
          });
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
   * 新建或修改问题
   */
  submit(): void {
    this.uploading = true;
    if (Object.keys(this.question).length) {
      // 修改
      const params: UpdateQuestionRequestParams = {
        question: this.form.get('question').value,
        answer: this.form.get('answer').value,
      };
      this.questionService.updateQuestion(this.question.faq_id, params).subscribe(
        (value: ResponseParams) => {
          if (!value.code) {
            this.msg.success('修改问题成功');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.msg);
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error(error);
        },
        () => {
          this.uploading = false;
        },
      );
    } else {
      // 新建
      const params: CreateQuestionRequestParams = {
        question: this.form.get('question').value,
        answer: this.form.get('answer').value,
      };
      this.questionService.createQuestion(params).subscribe(
        (value: ResponseParams) => {
          if (!value.code) {
            this.msg.success('新增问题成功');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.msg);
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error(error);
        },
        () => {
          this.uploading = false;
        },
      );
    }
  }

  /**
   * 关闭添加用户窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
