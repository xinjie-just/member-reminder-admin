import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StageService } from '@shared/service/stage.service';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';
import {
  StageSearchResponseDataParams,
  StepSearchRequestParams,
  StepSearchResponsePageParams,
  StepSearchResponseRecordsParams,
} from '@shared/interface/stage';
import { ResponseParams } from '@shared/interface/response';
@Component({
  selector: 'app-add-or-update',
  templateUrl: './add-or-update.component.html',
  styles: [],
})
export class AddOrUpdateStageComponent implements OnInit {
  @Input() stepInfo: StepSearchResponseRecordsParams = {
    idNode: null,
    type: null, // 类型：1阶段2步骤，默认步骤
    parentId: null,
    previous: null,
    name: null,
    nodeBizType: null,
    duration: null,
    isBeginPreNode: null,
    sort: null,
    dataState: null,
  };
  @Input() stages: StageSearchResponseDataParams[] = [];
  form: FormGroup;
  uploading = false;
  steps: StepSearchResponseRecordsParams[] = [];

  samePreSteps: { value: number; label: string }[] = [
    { value: 1, label: '是' },
    { value: 0, label: '否' },
  ];

  sorts: { value: number; label: string }[] = [];
  nodeBizTypes: { value: number; label: string }[] = [
    { value: 1, label: '提醒办理' },
    { value: 2, label: '等待批复' },
  ];
  durations: {
    value: number;
    label: string;
  }[] = [];

  constructor(
    private fb: FormBuilder,
    private stageService: StageService,
    private msg: NzMessageService,
    private modal: NzModalRef,
  ) {
    this.form = this.fb.group({
      stage: [null, [Validators.required]],
      stepName: [null, [Validators.required]],
      nodeBizType: [1, [Validators.required]],
      step: [null, [Validators.required]],
      duration: [30, [Validators.required]],
      samePreStep: [0, [Validators.required]],
      sort: [1, [Validators.required]],
    });
  }

  ngOnInit(): void {
    const list = [7, 15, 30, 60, 90, 120, 180, 365];
    this.durations = list.map((item) => {
      return {
        value: Number(item),
        label: String(item),
      };
    });

    for (let i = 1; i < 11; i++) {
      this.sorts.push({ value: i, label: String(i) });
    }

    if (this.stepInfo) {
      this.form.patchValue({
        stage: this.stepInfo.parentId,
        stepName: this.stepInfo.name,
        step: this.stepInfo.previous,
        duration: this.stepInfo.duration,
        samePreStep: this.stepInfo.isBeginPreNode,
        sort: this.stepInfo.sort,
      });
    }
    this.getSteps();
  }

  /**
   * 获取步骤
   * 获取所有步骤，idStageNode 不传
   */
  getSteps() {
    let params: StepSearchRequestParams = {
      pageNo: 1,
      pageSize: 999,
    };
    this.stageService.getSteps(params).subscribe(
      (value: ResponseParams) => {
        if (value.code === 200) {
          const info: StepSearchResponsePageParams = value.data.page;
          this.steps = info.records;
        } else {
          this.steps = [];
          this.msg.error(value.message || '获取步骤列表失败！');
        }
      },
      (error) => {
        this.msg.error('获取步骤列表失败！', error);
      },
    );
  }

  /**
   * 新建或修改步骤
   */
  submit(): void {
    this.uploading = true;
    let addParams = {
      type: 2, // 类型：1阶段2步骤，默认步骤
      parentId: this.form.get('stage').value,
      previous: this.form.get('step').value,
      name: this.form.get('stepName').value,
      nodeBizType: this.form.get('nodeBizType').value,
      duration: this.form.get('duration').value,
      isBeginPreNode: this.form.get('samePreStep').value,
      sort: this.form.get('sort').value,
    };
    if (this.stepInfo) {
      // 修改
      const updateParams = { ...addParams, idNode: this.stepInfo.idNode };
      this.stageService.addOrUpdateStep(updateParams).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('步骤修改成功！');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.message || '步骤修改失败！');
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error('步骤修改失败！', error);
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        },
      );
    } else {
      // 新建
      this.stageService.addOrUpdateStep(addParams).subscribe(
        (value: ResponseParams) => {
          if (value.code === 200) {
            this.msg.success('步骤新增成功！');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.message || '步骤新增失败！');
            this.modal.destroy({ data: 'error' });
          }
        },
        (error) => {
          this.msg.error('步骤新增失败！', error);
          this.uploading = false;
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
