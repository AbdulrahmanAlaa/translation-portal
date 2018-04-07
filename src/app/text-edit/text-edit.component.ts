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
  processDate(): any {
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
        // const doc = new jsPDF();
        // const text = `${data.file.title}`;
        this.processPDFFile(data.file.title);
        // doc.text(20, 20, this.processedText);
        // doc.save(text);
      }, no: 'Cancel', yes: 'Export'
    };
    const dialogRef = this.dialog.open(ModalDialogComponent, { width: '', data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {
        // Yes Case
        this.storageService.setStorage(LOCAL_STORAGE.Language, null);
        this.storageService.setStorage(LOCAL_STORAGE.TEXT, null);
        this.router.navigate(['/']);
      }
    });
  }

  // Set Current Word to be Configurable
  setCurrentWord(word: Word) {
    this.currentWord = word;
  }

  /**
   * Add Gap to word
   * @param word {Word}
   */
  createGap(word: Word) {

  }

  /**
   *  Edit The Word
   * @param word
   */
  makeItBoldAndGapped(word: Word) {
    word.boldStatus = word.gapStatus = true;
  }

  /** Process data before being exported  */
  processPreview() {
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

  private makeBold(word: string): string {
    return `<strong>${word}</strong>`;
  }

  public addAlternative(word: Word): void {
    word.alternatives.push('');
  }

  public updateAlternative(word: Word, index: number, event: Event) {
    word.alternatives[index] = (event.target as HTMLInputElement).value;
  }

  public removeAlternative(word: Word, index: number) {
    word.alternatives.splice(index, 1);
  }
  private processPDFFile(title) {
     const doc = new jsPDF();
    this.processPreview();
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
}
