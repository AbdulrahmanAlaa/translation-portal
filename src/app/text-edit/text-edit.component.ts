import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { StorageService } from './../storage.service';
import { LOCAL_STORAGE } from '../../shared/utilities/defines';
import { Word } from '../shared/models/word';
import { ReplacePipe } from '../shared/pipes/replace.pipe';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'tp-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})
export class TextEditComponent implements OnInit {

  /** holds user selected language and text */
  currentData: { language, text } = { language: '', text: '' };

  /** holds all words */
  public words = [];

  /** display text after formatting and before exporting */
  public showPreview = false;

  /** holds the text that will be exported as preview */
  public processedText = null;

  /** holds selected current word */
  public currentWord: Word = null;

  /** holds the new value to add new word  */
  public newValue = new Object() as Word;

  // Life Cycle Hooks
  constructor(public dialog: MatDialog, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.newValue.value = '';
    this.newValue.showAlternatives = this.newValue.gapStatus = this.newValue.boldStatus = false;
    this.newValue.alternatives = [];
    this.currentData.language = this.storageService.getStorage(LOCAL_STORAGE.Language);
    this.currentData.text = this.storageService.getStorage(LOCAL_STORAGE.TEXT);
    if (!this.currentData.language || !this.currentData.text) {
      this.router.navigate(['/']);
    }
    this.processDate();
  }


  /**
   * Split each word and make it draggable
   */
  private processDate(): any {
    let singleWord: Word = null;

    // Holds array of words
    const words = this.currentData.text.split(' ');
    // Holds array of objects needed to save each word functionality
    this.words = words.map((word: string, index) => {
      singleWord = new Object() as Word;
      singleWord.id = index;
      singleWord.value = word;
      singleWord.alternatives = [];
      singleWord.showAlternatives = singleWord.gapStatus = singleWord.boldStatus = false;
      singleWord.offset = ((word.length <= 3) ? word.length : 3);
      return singleWord;
    });
  }

  private makeBold(word: string): string {
    return `<strong>${word}</strong>`;
  }

  /**
   * Export html to PDF and open download dialog
   * @param title File name to be saved
   */
  private processPDFFile(title) {
    const doc = new jsPDF();
    doc.fromHTML(
      this.processedText,
      15,
      15,
      {
        'width': 180, 'elementHandlers': (a) => console.log(a)
      }
    );
    doc.save(title);
    return;
  }

  /**
   * Cancel Changes and return back home
   */
  public openDialogCancel(): void {
    const dialogRef = this.dialog.open(ModalDialogComponent, {
      width: '',
      data: { title: 'Go Back', content: 'All data will be lost, do you want to continue', no: 'No', yes: 'Yes' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        // Yes Case
        this.storageService.setStorage(LOCAL_STORAGE.Language, null);
        this.storageService.setStorage(LOCAL_STORAGE.TEXT, null);
        this.router.navigate(['/']);
      }
    });
  }

  /**
   * Ask user to Export html to txt/pdf
   */
  public openDialogExport(): void {
    const data = {
      file: { placeholder: 'Name', title: '' },
      options: {
        title: 'Format',
        values: [
          'PDF',
          'Text'
        ],
        selectedValue: 'Text'
      },
      title: 'Export As', action: () => {
        this.processPreview();
        switch (data.options.selectedValue) {
          case 'PDF':
            this.processPDFFile(data.file.title);
            break;

          case 'Text':
            const doc = document.createElement('a');
            doc.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.processedText)),
              doc.setAttribute('download', (data.file.title + '.txt'));
            doc.click();
            break;
        }
      }, no: 'Cancel', yes: 'Export'
    };
    const dialogRef = this.dialog.open(ModalDialogComponent, { width: '', data });
  }

  /**
   * Set Current Clicked Word to be Configurable
   */
  public onWordClick(word: Word) {
    this.currentWord = word;
  }

  /**
   *  Edit The Word to be Bold and Gaped
   * @param word
   */
  public makeItBoldAndGapped(word: Word) {
    word.boldStatus = word.gapStatus = true;
  }

  /** Process data before being exported  */
  public processPreview() {
    let words = '';
    const replace = new ReplacePipe().transform;
    this.words.forEach((word: Word) => {
      if (word.boldStatus) {
        words += ` ${this.makeBold(replace(word.value, word.offset, !word.gapStatus))}`;
      } else {
        words += ` ${replace(word.value, word.offset, !word.gapStatus)}`;
      }
    });
    this.processedText = `<p>${words}</p>`;
  }


  /** adding alternative for current selected word */
  public addAlternative(word: Word): void {
    word.alternatives.push('');
  }

  /** updates the alternative word with each change */
  public onWordAlternativeChange(word: Word, index: number, event: Event) {
    word.alternatives[index] = (event.target as HTMLInputElement).value;
  }

  public onWordAlternativeCloseClick(word: Word, index: number) {
    word.alternatives.splice(index, 1);
  }

  /** Calculate total gapes enabled for each word */
  public calculateGaps() {
    let total = 0;
    this.words.forEach((word: Word) => {
      total += word.gapStatus ? word.offset : 0;
    });
    return total;
  }
}
