import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CaptureepisodePage } from './captureepisode';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CaptureepisodePage
  ],
  imports: [
    TranslateModule,
    IonicPageModule.forChild(CaptureepisodePage)
  ],
  providers: [
    ScreenOrientation
  ]
})
export class CaptureepisodePageModule { }
