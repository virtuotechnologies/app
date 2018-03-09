import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrenddetailsPage } from './trenddetails';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    TrenddetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TrenddetailsPage),
  ],
   providers:[ScreenOrientation]
})
export class TrenddetailsPageModule {}
