import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';
import { TranslateModule } from '@ngx-translate/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { EmailComposer } from '@ionic-native/email-composer';

@NgModule({
  declarations: [
    ContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ContactPage),
    TranslateModule
  ],
  entryComponents:[
  	ContactPage
  ],
  providers: [
    ScreenOrientation,
    EmailComposer
  ]
})
export class ContactPageModule {}
