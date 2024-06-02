import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private rec: any;
  public interim: string = '';
  public final: string = '';
  isSpeeching$ = new BehaviorSubject<string>('not_speaking');

  constructor(private zone: NgZone) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.rec = new SpeechRecognition();
      this.rec.continuous = true;
      this.rec.lang = 'it-IT';
      this.rec.interimResults = true;

      this.rec.onresult = (event: any) => {
        this.zone.run(() => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            this.isSpeeching$.next('speaking');

            if (event.results != null && event.results[i].isFinal) {
              this.final += event.results[i][0].transcript;
              this.interim = '';

            } else {
              if (event.results != null) {

                this.interim = event.results[i][0].transcript;
              }
            }
          }
        });
      };

      this.rec.onerror = (event: any) => {
        console.error('Speech recognition error', event);
      };
    } else {
      console.error('Speech recognition not supported in this browser.');
    }
  }

  start(): void {
    if (this.rec) {
      this.rec.start();
    } else {
      console.error('Speech recognition not initialized.');
    }
  }
}
