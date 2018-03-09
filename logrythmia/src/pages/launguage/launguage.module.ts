import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LaunguagePage } from './launguage';
import { ServiceProvider } from '../../providers/service/service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    LaunguagePage,
  ],
  imports: [
    IonicPageModule.forChild(LaunguagePage),
    TranslateModule
  ],
  providers: [
    ServiceProvider
  ]
})
export class LaunguagePageModule {}
