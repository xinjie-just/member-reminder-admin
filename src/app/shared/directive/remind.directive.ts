import { Directive, Input, ElementRef } from '@angular/core';

// 模型管理状态
@Directive({
  selector: '[appRemindStatus]',
})
export class RemindStatusDirective {
  private _status: number;

  get status(): number {
    return this._status;
  }

  @Input()
  set status(value: number) {
    this._status = value;
    this.updateView();
  }

  constructor(private elementRef: ElementRef) {}

  /**
   * 1-训练中 2-训练完成 3-训练失败
   * 训练中和训练失败都不可进行上线操作
   */
  updateView() {
    switch (this.status) {
      case 1: {
        this.elementRef.nativeElement.style.color = '#337ab7';
        break;
      }
      case 2: {
        this.elementRef.nativeElement.style.color = '#54ba9a';
        break;
      }
      case 3: {
        this.elementRef.nativeElement.style.color = '#ff3d3d';
        break;
      }
    }
  }
}

// 模型管理是否允许上线
@Directive({
  selector: '[appRemindOnlineHandle]',
})
export class RemindOnlineHandleDirective {
  private _status: number;
  private _inuse: number;

  get status(): number {
    return this._status;
  }

  @Input()
  set status(value: number) {
    this._status = value;
    this.updateView();
  }

  get inuse(): number {
    return this._inuse;
  }

  @Input()
  set inuse(value: number) {
    this._inuse = value;
    this.updateInuseView();
  }

  constructor(private elementRef: ElementRef) {}

  /**
   * 1-训练中 2-训练完成 3-训练失败
   * 训练中和训练失败都不可进行上线操作
   */
  updateView() {
    if (this.status === 2) {
      this.elementRef.nativeElement.style.color = '#337ab7';
    } else {
      this.elementRef.nativeElement.style.color = 'rgba(0, 0, 0, .25)';
      this.elementRef.nativeElement.style.cursor = 'not-allowed';
    }
  }

  updateInuseView() {
    switch (this.inuse) {
      case 0: {
        this.elementRef.nativeElement.style.color = this.status !== 2 ? 'rgba(0, 0, 0, .25)' : '#337ab7';
        break;
      }
      case 1: {
        this.elementRef.nativeElement.style.color = '#54ba9a';
        this.elementRef.nativeElement.style.cursor = 'not-allowed';
        break;
      }
    }
  }
}
