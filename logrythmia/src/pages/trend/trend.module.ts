import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrendPage } from './trend';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TrendPage,
  ],
  imports: [
    IonicPageModule.forChild(TrendPage),
    TranslateModule
  ],
  providers:[ScreenOrientation]
})
export class TrendPageModule {}
