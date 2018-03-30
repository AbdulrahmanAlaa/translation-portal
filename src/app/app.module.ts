import { LanguageTranslateService } from './language-translate.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './material.module';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextEditComponent } from './text-edit/text-edit.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TextEditComponent
  ],
  imports: [
  FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [LanguageTranslateService],
  bootstrap: [AppComponent]
})
export class AppModule { }
