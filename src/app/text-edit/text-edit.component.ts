import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { StorageService } from './../storage.service';
import { LOCAL_STORAGE } from '../../shared/utilities/defines';
import { Word } from '../shared/models/word';

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

  /** holds selected current word */
  public currentWord: Word = null;

  // Life Cycle Hooks
  constructor(public dialog: MatDialog, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
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
    this.words = words.map((word, index) => {
      singleWord = new Object() as Word;
      singleWord.id = index;
      singleWord.value = word;
      singleWord.alternatives = [];
      singleWord.gapStatus = false;
      singleWord.specialStatus = false;
      singleWord.offset = 3;
      return singleWord;
    });
  }


  /**
   * Cancel Changes and return back home
   */
  openDialogCancel(): void {
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

  // Set Current Word to be Configurable
  setCurrentWord(word: Word) {
    this.currentWord = word;
  }

}
