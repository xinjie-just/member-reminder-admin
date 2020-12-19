import { Component, OnInit } from '@angular/core';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { ReadService } from '@shared/service/read.service';
import {
  DocumentInfoParams,
  DocumentSearchRequestParams,
  DeleteDocumentRequestParams,
  KeywordResponseParams,
} from '@shared/interface/read';
import { ResponseParams } from '@shared/interface/response';
import { ImportReadComponent } from './import/import.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.less'],
})
export class ReadComponent implements OnInit {
  name = '';
  pageIndex = 1; // 当前页码
  pageSize = 10; // 每页显示数据量
  total = 0; // 总数据量
  tableLoading = true; // 表格数据加载中
  refreshKeyword = false;

  documents: DocumentInfoParams[] = [];

  constructor(
    private readService: ReadService,
    private router: Router,
    private msg: NzMessageService,
    private modalService: NzModalService,
  ) {}

  ngOnInit(): void {
    this.getDocuments();
  }

  /**
   * 查询文档
   */
  search(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.getDocuments();
  }

  /**
   * 搜索文档
   */
  getDocuments(): void {
    this.tableLoading = true;
    const params: DocumentSearchRequestParams = {
      query: this.name.trim(),
      pos: (this.pageIndex - 1) * this.pageSize,
      cnt: this.pageSize,
    };
    this.readService.getDocuments(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          const userInfo = value.data;
          this.documents = userInfo.results;
          this.total = userInfo.total;
        } else {
          this.documents = [];
          this.total = 0;
          this.msg.error(value.msg);
        }
      },
      () => {
        // this.msg.error(error);  // 注释掉，避免未登录状态下从工作台进入时出现[object, object]
      },
      () => {
        this.tableLoading = false;
      },
    );
  }

  /**
   * 添加文档
   */
  upload(): void {
    const addOrUpdateModal = this.modalService.create({
      nzTitle: '上传文档',
      nzContent: ImportReadComponent,
      nzFooter: null,
    });

    addOrUpdateModal.afterClose.subscribe((result) => {
      if (result && result.data === 'success') {
        this.search(); // 上传成功后，重置页码
      }
    });
  }

  /**
   * 删除文档
   * @param user UserInfoParams
   */
  deleteDocument(document: DocumentInfoParams): void {
    this.modalService.confirm({
      nzTitle: `你确定要删除文档 <i>${document.title}</i> 吗?`,
      nzOkText: '确定',
      nzOkType: 'danger',
      nzOnOk: () => this.delete(document),
      nzCancelText: '取消',
    });
  }
  delete(document: DocumentInfoParams): void {
    const params: DeleteDocumentRequestParams = {
      doc_id: document.doc_id,
    };
    this.readService.deleteDocument(params).subscribe(
      (value: ResponseParams) => {
        if (!value.code) {
          this.msg.success('删除成功');
          this.search(); // 删除成功后，重置页码，避免当前页没有数据
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
   * 重新计算关键词
   */
  refresh() {
    this.refreshKeyword = true;
    this.readService.refreshKeyword().subscribe(
      (value: ResponseParams) => {
        if (value.code === 0) {
          const data: KeywordResponseParams = value.data;
          if (data.is_success) {
            this.msg.success('阅读理解关键词重新刷新成功！', { nzDuration: 4000 });
          } else {
            this.msg.warning('关键词正在计算中，请稍后再试。', { nzDuration: 4000 });
          }
        } else {
          this.msg.error('阅读理解关键词重新刷新失败！', { nzDuration: 4000 });
        }
      },
      (err) => {
        this.msg.error(`阅读理解关键词重新刷新失败！${err}`, { nzDuration: 4000 });
      },
      () => {
        this.refreshKeyword = false;
      },
    );
  }
}
