import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Attachment} from "../../@data/attachment";

export interface UploadingFile {
  fileName: string;
  status: 'uploading' | 'uploaded' | 'failed';
  url: null | string;
}


@Injectable({
  providedIn: 'root'
})
export class UploadingProgressService {
  constructor() { }
  files$ = new BehaviorSubject<UploadingFile[]>([])

  pushNewFile(file: UploadingFile) {
    const lastValue = this.files$.value;
    lastValue.push(file);
    this.files$.next(lastValue);
    console.log('Added', lastValue)
  }

  updateStatusSuccess(attachment:Attachment) {
    const lastValue = this.files$.value;
    const index = lastValue.findIndex((i) => attachment.default_url.includes(i.fileName) && i.status === 'uploading')
    console.log(index)
    if (index !== -1) {
      lastValue[index] = {...lastValue[index], url: attachment.url, status: 'uploaded'}
      this.files$.next(lastValue);
      console.log('Success', lastValue)
    }
  }

  updateStatusFailed(attachment:Attachment) {
    const lastValue = this.files$.value;
    const index = lastValue.findIndex((i) => attachment.default_url.includes(i.fileName))
    if (index !== -1) {
      lastValue[index] = {...lastValue[index], url: null, status: 'failed'}
      this.files$.next(lastValue);
      console.log('failed', lastValue)

    }
  }



}
