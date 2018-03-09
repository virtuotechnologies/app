import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnalysisPage } from './analysis';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AnalysisPage
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(AnalysisPage)
  ],
  providers: [
    ScreenOrientation
  ]
})
export class AnalysisPageModule {}
