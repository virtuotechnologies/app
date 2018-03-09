import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { ServiceProvider } from '../../providers/service/service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**
 * Generated class for the LaunguagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-launguage',
  templateUrl: 'launguage.html',
})
export class LaunguagePage {
  selectLaunguage;
  selectedValue;
  constructor(private screenOrientation: ScreenOrientation,public service: ServiceProvider, public events: Events, private translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
    this.selectedValue = localStorage.getItem('Launguage');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    if (localStorage.getItem('Launguage') === 'English'
      || localStorage.getItem('Launguage') === 'French' || localStorage.getItem('Launguage') === 'German'
      || localStorage.getItem('Launguage') === 'Spanish' || localStorage.getItem('Launguage') === 'italian'
      || localStorage.getItem('Launguage') === 'Chinese' || localStorage.getItem('Launguage') === 'Japanese'
      || localStorage.getItem('Launguage') === 'Portuguese' || localStorage.getItem('Launguage') === 'Russian'
      || localStorage.getItem('Launguage') === 'Vietnamese') {
      this.selectLaunguage = true;
      var languageValue = localStorage.getItem('Launguage');
      translate.setDefaultLang(languageValue);
      translate.use(languageValue);
    } else {
      this.selectLaunguage = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LaunguagePage');
  }

  selectValue(event) {
    localStorage.setItem('Launguage', event);
    var value = localStorage.getItem('Launguage');
    console.log("VALUE",value)
    this.translate.setDefaultLang(value);
    this.translate.use(value);
    this.navCtrl.setRoot(HomePage)
  }

}
