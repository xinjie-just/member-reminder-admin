import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ThresholdService } from '@shared/service/threshold.service';
import { ResponseParams } from '@shared/interface/response';
import { ThresholdInfoResponse, FaqReadScoreRequestParams } from '@shared/interface/threshold';

@Component({
  selector: 'app-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.less'],
})
export class ThresholdComponent implements OnInit {
  form: FormGroup;
  thresholdInfo: ThresholdInfoResponse[] = [];

  constructor(private fb: FormBuilder, private msg: NzMessageService, private thresholdService: ThresholdService) {
    this.form = this.fb.group({
      FAQThresholdId: [null],
      FAQThreshold: [null, [Validators.required, Validators.pattern(/^(\+)?\d+(\.\d+)?$/)]],
      ReadThresholdId: [null],
      ReadThreshold: [null, [Validators.required, Validators.pattern(/^(\+)?\d+(\.\d+)?$/)]],
    });
  }

  ngOnInit(): void {
    this.getFAQAndReadThreshold();
  }

  /**
   * FAQ和阅读理解阈值获取
   */
  getFAQAndReadThreshold(): void {
    this.thresholdService.getFAQAndReadThreshold().subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.thresholdInfo = value.data.result;
          const faqObj = this.thresholdInfo.filter((item) => item.answer_type.includes('faq'))[0];
          const rcObj = this.thresholdInfo.filter((item) => item.answer_type.includes('rc'))[0];
          this.form.patchValue({
            FAQThresholdId: faqObj.score_id,
            FAQThreshold: faqObj.score,
            ReadThresholdId: rcObj.score_id,
            ReadThreshold: rcObj.score,
          });
        } else {
          this.thresholdInfo = [];
          this.msg.error(value.msg);
        }
      },
      (error) => {
        this.msg.error('FAQ和阅读理解阈值获取失败！', error);
      },
    );
  }

  /**
   * 新增模型(模型训练)
   * 由于接口有问题，保存时需要调用两次
   */
  submit(): void {
    const count = this.thresholdInfo.length;
    for (let i = 0; i < count; i++) {
      let params: FaqReadScoreRequestParams;
      if (i === 0) {
        params = {
          score_id: this.form.get('FAQThresholdId').value,
          score: this.form.get('FAQThreshold').value,
        };
      } else if (i === 1) {
        params = {
          score_id: this.form.get('ReadThresholdId').value,
          score: this.form.get('ReadThreshold').value,
        };
      }
      this.thresholdService.updateFAQAndReadThreshold(params).subscribe(
        (value: ResponseParams) => {
          if (!value.code) {
            if (i === 0) {
              this.msg.success('阈值更新成功');
            }
          } else {
            if (i === 0) {
              this.msg.error('阈值更新失败');
            }
          }
        },
        () => {
          if (i === 0) {
            this.msg.error('阈值更新失败');
          }
        },
      );
    }
  }
}
