import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Variables
  /** holds the input file to be imported */
  @ViewChild('file')
  file: HTMLInputElement;

  public form: FormGroup;

  public title = 'Translation Portal';

  public foods = [
    { value: 'english-0', viewValue: 'English' },
    { value: 'french-1', viewValue: 'French' },
    { value: 'german-2', viewValue: 'German' }
  ];

  // Life Cycle Hooks
  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      language: ['', Validators.required],
      textToTranslate: ['', Validators.required],
    });
  }

  load($event) {
    const input = $event.target;
    const reader = new FileReader();
    reader.onload = () => {
      this.form.controls.textToTranslate.setValue(reader.result);
    };
    reader.readAsText(input.files[0]);
  }
  submit() {
    console.log(this.form.value);
    if (this.form.valid) {

    }
  }
}
