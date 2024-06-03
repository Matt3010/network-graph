import {AfterViewInit, Component} from '@angular/core';
import {NoteService} from "../../services/note.service";
import {SpeechRecognitionService} from "../../services/utils/speech.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements AfterViewInit{

  speeching$ = this.speechService.isSpeeching$;


  constructor(
    private noteService: NoteService,
    public speechService: SpeechRecognitionService
  ) {
  }

  ngAfterViewInit() {
    this.speechService.isSpeeching$.subscribe((res) => {
      console.log('stai parlando')
      const speeching = document.getElementById('speeching');
      if (res) {
        this.animateSpeeching(speeching);
      } else {
        this.resetSpeeching(speeching);
      }
    })
  }

  animateSpeeching(element: HTMLElement | null) {
    if (!element) return;
    element.classList.add('speech-animation');
    setTimeout(() => {
      this.resetSpeeching(element);
    }, 1000); // Tempo di ingrandimento in millisecondi
  }

  resetSpeeching(element: HTMLElement | null) {
    if (!element) return;
    element.classList.remove('speech-animation');
  }



  createNewNote() {
    this.noteService.createNewNote()
  }
  startRecognition(): void {
    this.speechService.start();
  }


}
