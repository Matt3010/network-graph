import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PluginService {

  constructor() { }

  getPlugins() {
    return [
      { name: 'CodeMirror - Display Full Screen', url: 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/display/fullscreen.js'},
    ];
  }

}
