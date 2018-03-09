import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsandconditionsPage } from './termsandconditions';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TermsandconditionsPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsandconditionsPage),
    TranslateModule
  ],
})
export class TermsandconditionsPageModule {}
