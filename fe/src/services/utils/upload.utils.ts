import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {TokenService} from "../token.service";
import {Router} from "@angular/router";
import {UploadingProgressService} from "./uploading-progress.service";
import {BehaviorSubject} from "rxjs";
import {Attachment} from "../../@data/attachment";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {Note} from "../note.service";

export interface CanUpload {
  id: string;
  attachments: Attachment[];
}

@Injectable({
  providedIn: 'root'
})
export class UploadUtils {

  baseUrl: string = environment.api_url;

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private tokenService: TokenService,
    private router: Router,
     private uploadProgressService: UploadingProgressService
  ) {
  }

  // PRIMO OVERLOAD, GENERICO:
  // SE NON CE UN PATH I FILE VERRANNO CARICATI DENTRO LA FOLDER ATTACHMENTS,
  // SE IL PATH é FORNITO IL FILE VIENE CARICATO NELLA PATH DESIDERATA.
  upload(apiUrl: string, fileToUpload: File, path: string | null): void;

  // SECONDO OVERLOAD, SPECIFICO PER ENTITA':
  // IL FILE VIENE CARICATO IN UNA CARTELLA CHIAMATA COME L' ID
  // DELL ENTITA' A CUI VIENE ASSOCIATO IL DOCUMENTO
  upload(apiUrl: string, fileToUpload: File, path: null, entityId: string, obsToUpdate: BehaviorSubject<Note[]>): void;

  //IMPLEMENTAZIONE
  upload(apiUrl: string, fileToUpload: File, path: string | null = null, entityId?: string, obsToUpdate?: BehaviorSubject<Note[]>): void {
    this.uploadProgressService.pushNewFile({fileName: fileToUpload.name, status: 'uploading', url: null});

    const form = this.createFormData(fileToUpload, path!)
    const endpoint = entityId ? `${apiUrl}/${entityId}/upload` : `${apiUrl}/upload`;

    this.http.post<Attachment>(endpoint, form)
      .pipe(
        map((res: any) => res.data)
      )
      .subscribe((doc: Attachment) => {
        console.log('DOOOOC', doc)

        if (doc) {
          console.log('DOOOOC', doc)
          this.checkIfDocuemntExist(doc.default_url)
            .subscribe((check) => {
              if (check) {
                this.uploadProgressService.updateStatusSuccess(doc);
                if (entityId) {
                  this.updateState(entityId, doc, obsToUpdate);
                } else {
                  console.log('No ID provided to update state...')
                }
              } else {
                this.uploadProgressService.updateStatusFailed(doc);
              }
            });
        }
      });
  }

  updateState(id: string, doc: Attachment, obs?: BehaviorSubject<any>) {
    const last = obs!.value;
    const index = last.findIndex((i: any) => i.id === id)
    if (index !== -1) {
      last[index].attachments.push(doc)
      obs!.next(last);
    }
  }

  checkIfDocuemntExist(path: string) {
    return this.http.post(this.baseUrl + '/documents/check', {path})
  }

  createFormData(file: File, path: string | null) {
    const formData: FormData = new FormData();
    formData.append('attachment', file, file.name);
    path ? formData.append('path', path): null;
    return formData;
  }

}
