import { Component, OnInit, Input } from '@angular/core';
import { QuestionTypeOptionsObject, UpdateLabelQuestionRequestParams } from '@shared/interface/read';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ReadService } from '@shared/service/read.service';
import { ResponseParams } from '@shared/interface/response';

@Component({
  selector: 'app-label-update',
  templateUrl: './label-update.component.html',
  styleUrls: ['./label-update.component.less'],
})
export class LabelUpdateComponent implements OnInit {
  @Input() question_id: number;
  @Input() question_type: number[];
  @Input() question: string;
  @Input() answer: string;
  @Input() questionTypeOptions: QuestionTypeOptionsObject[];
  form: FormGroup;
  uploading = false;
  selectedQuestionType: number[];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private msg: NzMessageService,
    private readService: ReadService,
  ) {
    this.form = this.fb.group({
      question: [null, [Validators.required, Validators.pattern(/^.{1,100}$/)]],
      questionType: [null],
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      question: this.question,
      questionType: this.question_type,
    });
  }

  /**
   * 改变问题类型
   * @param values number[]
   */
  changeQuestionType(values: number[]): void {
    this.selectedQuestionType = values;
  }

  /**
   * 关闭更新标注问题 modal
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }

  /**
   * 修改标注问题
   */
  submit(): void {
    this.uploading = true;
    const params: UpdateLabelQuestionRequestParams = {
      question: this.form.get('question').value,
      question_type: this.form.get('questionType').value,
    };
    this.readService.updateLabelQuestion(this.question_id, params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('标注问题修改成功');
          this.modal.destroy({ data: 'success' });
        } else {
          this.msg.error(value.msg);
          this.modal.destroy({ data: 'error' });
        }
      },
      error => {
        this.msg.error(error);
      },
      () => {
        this.uploading = false;
      },
    );
  }
}
