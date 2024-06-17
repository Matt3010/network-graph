import {AfterViewInit, Component} from '@angular/core';
import {NoteService} from '../../../services/note.service';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {basicSetup, EditorView} from 'codemirror';
import {markdown} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

export interface FormStatistics {
  Chars: number;
  Words: number;
  Paragraphs: number;
}

@Component({
  selector: 'app-edit',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss']
})
export class WriteComponent implements AfterViewInit {

  editorView!: EditorView;

  editForm = new FormGroup({
    title: new FormControl(''),
    body: new FormControl('Hello\n\n```javascript\nlet x = \'y\'\n```'),
    created_by: new FormControl(''),
    created_at: new FormControl(''),
    updated_at: new FormControl('')
  });

  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngAfterViewInit() {
    const targetElement = document.querySelector('#editor')!;
    this.editorView = new EditorView({
      doc: this.editForm.value.body!,
      extensions: [
        basicSetup,
        markdown({codeLanguages: languages})
      ],
      parent: targetElement,
      dispatch: (transaction) => {
        this.editorView.update([transaction]);
        if (transaction.docChanged) {
          const value = this.editorView.state.doc.toString();
          this.editForm.controls.body.setValue(value);
        }
      }
    });

    this.editForm.controls.body.valueChanges.subscribe(value => {
      const editorValue = this.editorView.state.doc.toString();
      if (value !== editorValue) {
        this.editorView.dispatch({
          changes: {from: 0, to: editorValue.length, insert: value!}
        });
      }
    });
  }

  convertMarkdownToHtml(markdownText: string): string {
    let html = '';
    unified()
      .use([remarkParse, remarkRehype, rehypeStringify])
      .process(markdownText, (err, file) => {
        if (err) throw err;
        html = String(file);
      });
    return html;
  }
}
