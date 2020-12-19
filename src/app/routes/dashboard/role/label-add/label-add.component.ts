import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
  LabelRequestParams,
  ListOfControlObject,
  LabelRequestQuestionParams,
  QuestionTypeOptionsObject,
} from '@shared/interface/role';
import { ReadService } from '@shared/service/role.service';
import { ResponseParams } from '@shared/interface/response';

@Component({
  selector: 'app-label-add',
  templateUrl: './label-add.component.html',
  styleUrls: ['./label-add.component.less'],
})
export class LabelAddComponent implements OnInit {
  @Input() start: number;
  @Input() end: number;
  @Input() selectedText: string;
  @Input() documentId: number;
  @Input() questionTypeOptions: QuestionTypeOptionsObject[];
  form: FormGroup;
  uploading = false;

  questions: LabelRequestQuestionParams[] = [{ question: '', question_type: [] }];
  listOfControl: Array<ListOfControlObject> = [
    {
      id: 0,
      questionTypeInstance: `questionType0`,
      questionInstance: `question0`,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private modal: NzModalRef,
    private msg: NzMessageService,
    private roleService: ReadService,
  ) {
    this.form = this.fb.group({
      question0: [null, [Validators.required, Validators.pattern(/^.{1,100}$/)]],
      questionType0: [null],
    });
  }

  ngOnInit(): void {}

  /**
   * 改变问题类型
   * @param values number[]
   * @param controlId: number
   */
  changeQuestionType(values: number[], controlId: number): void {
    this.questions[controlId].question_type = values;
  }

  /**
   * 改变问题
   * @param value string
   * @param controlId: number
   */
  changeQuestion(value: string, controlId: number): void {
    this.questions[controlId].question = this.form.get(value).value;
  }

  /**
   * 关闭创建问题 modal
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }

  /**
   * 添加一项问题和问题类型
   * @param e: MouseEvent
   */
  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control = {
      id,
      questionTypeInstance: `questionType${id}`,
      questionInstance: `question${id}`,
    };
    const index = this.listOfControl.push(control);
    this.questions.push({ question: '', question_type: [] });
    this.form.addControl(this.listOfControl[index - 1].questionTypeInstance, new FormControl(null));
    this.form.addControl(
      this.listOfControl[index - 1].questionInstance,
      new FormControl(null, [Validators.required, Validators.pattern(/^.{1,100}$/)]),
    );
  }

  /**
   * 删除该组问题和问题类型
   * @param i ListOfControlObject
   * @param e MouseEvent
   */
  removeField(i: ListOfControlObject, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.questions.pop();
      this.form.removeControl(i.questionInstance);
      this.form.removeControl(i.questionTypeInstance);
    }
  }

  /**
   * 创建问题
   */
  submit(): void {
    if (this.selectedText.length > 10000) return;
    this.uploading = true;
    const params: LabelRequestParams = {
      doc_id: this.documentId,
      questions: this.questions,
      answer: this.selectedText,
      start: this.start,
      end: this.end,
    };
    this.roleService.label(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('标注问题创建成功');
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
