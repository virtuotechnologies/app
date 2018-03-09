import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateModule } from '@ngx-translate/core';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    TranslateModule
  ],
  providers: [
    EmailComposer,
    ScreenOrientation
  ]
})
export class DashboardPageModule {}
