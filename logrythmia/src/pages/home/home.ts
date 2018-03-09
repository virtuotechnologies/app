import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checked: boolean;
  constructor(private translate: TranslateService,private screenOrientation: ScreenOrientation, public navCtrl: NavController) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    var languageValue = localStorage.getItem('Launguage');
    translate.setDefaultLang(languageValue);
    translate.use(languageValue);

    if (localStorage.getItem('AboutPage') == null) {
      this.checked = false;
    } else if (localStorage.getItem('AboutPage') !== null) {
      if (localStorage.getItem('AboutPage') === 'true') {
        this.checked = true;
      } else if (localStorage.getItem('AboutPage') === 'false') {
        this.checked = false;
      }
    }
  }

  toggle(event) {
    console.log("event", event.checked);
    if (event.checked) {
      localStorage.setItem('AboutPage', 'true');
    } else {
      localStorage.setItem('AboutPage', 'false');
    }
  }

}
