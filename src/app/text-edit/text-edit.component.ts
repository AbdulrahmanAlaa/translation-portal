import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalDialogComponent } from '../modal-dialog/modal-dialog.component';
import { Router } from '@angular/router';
import { StorageService } from './../storage.service';
import { LOCAL_STORAGE } from '../../shared/utilities/defines';

@Component({
  selector: 'tp-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.scss']
})
export class TextEditComponent implements OnInit {
  /** holds user selected language and text */
  currentData: { language, text } = { language: '', text: '' };

  // Life Cycle Hooks
  constructor(public dialog: MatDialog, private router: Router, private storageService: StorageService) { }

  ngOnInit(): void {
    this.currentData.language = this.storageService.getStorage(LOCAL_STORAGE.Language);
    this.currentData.text = this.storageService.getStorage(LOCAL_STORAGE.TEXT);
    if (!this.currentData.language || !this.currentData.text) {
      this.router.navigate(['/']);
    }
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


}
