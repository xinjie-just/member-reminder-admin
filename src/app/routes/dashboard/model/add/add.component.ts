import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ModelService } from '@shared/service/model.service';
import { CreateModelRequestParams, ModelInfoParams, ModelSearchRequestParams } from '@shared/interface/model';
import { ResponseParams } from '@shared/interface/response';

@Component({
  selector: 'app-add-model',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less'],
})
export class AddModelComponent implements OnInit {
  form: FormGroup;
  uploading = false;
  completedModels: ModelInfoParams[];

  constructor(
    private fb: FormBuilder,
    private modelService: ModelService,
    private msg: NzMessageService,
    private modal: NzModalRef,
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      type: [null, [Validators.required]],
      epoch: [null, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      learningRate: [null, [Validators.required, Validators.pattern(/^(\+)?\d+(\.\d+)?$/)]],
      batchSize: [null, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      batchAccumulation: [null, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
    });
  }

  ngOnInit(): void {
    this.getModels();
  }

  /**
   * 模型搜索(目的是获取训练完成的模型)
   */
  getModels(): void {
    const params: ModelSearchRequestParams = {
      title: '',
      state: 2, // 2 表示训练完成的模型
      pos: 0,
      cnt: 9999,
    };
    this.modelService.getModels(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const userInfo = value.data;
          this.completedModels = userInfo.results;
        } else {
          this.completedModels = [];
          this.msg.error(value.msg);
        }
      },
      error => {
        this.msg.error(error);
      },
    );
  }

  /**
   * 新增模型(模型训练)
   */
  submit(): void {
    this.uploading = true;
    const params: CreateModelRequestParams = {
      title: this.form.get('name').value,
      model_id: this.form.get('type').value,
      epoch: this.form.get('epoch').value,
      learning_rate: this.form.get('learningRate').value,
      batch_size: this.form.get('batchSize').value,
      batch_accumulation: this.form.get('batchAccumulation').value,
    };
    this.modelService.createModel(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('新增模型成功');
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

  /**
   * 关闭添加用户窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
