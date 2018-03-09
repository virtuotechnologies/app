import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the TermsandconditionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-termsandconditions',
  templateUrl: 'termsandconditions.html',
})
export class TermsandconditionsPage {

  constructor(private translate: TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    var languageValue = localStorage.getItem('Launguage');
    translate.setDefaultLang(languageValue);
    translate.use(languageValue);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsandconditionsPage');
  }

}
