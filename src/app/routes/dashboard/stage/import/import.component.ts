import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile, NzModalRef } from 'ng-zorro-antd';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.less'],
})
export class ImportComponent implements OnInit {
  uploading = false;
  fileList: UploadFile[] = [];

  constructor(private msg: NzMessageService, private http: HttpClient, private modal: NzModalRef) {}

  ngOnInit(): void {}

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    this.uploading = true;
    const req = new HttpRequest('POST', 'api/console/faq_upload', formData);
    this.http
      .request(req)
      .pipe(filter(e => e instanceof HttpResponse))
      .subscribe(
        (value: any) => {
          if (!value.body.code) {
            this.msg.success('上传成功');
            this.modal.destroy({ data: 'success' });
          } else {
            this.msg.error(value.body.msg);
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
   * 关闭导入文档窗口
   */
  cancel(): void {
    this.modal.destroy({ data: 'cancel' });
  }
}
