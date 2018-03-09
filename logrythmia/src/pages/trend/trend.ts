import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ServiceProvider } from '../../providers/service/service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the TrendPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trend',
  templateUrl: 'trend.html',
})
export class TrendPage {
  @ViewChild('barCanvas') barCanvas;
  episodes;
  length: boolean;
  constructor(private translate: TranslateService, private screenOrientation: ScreenOrientation, public navCtrl: NavController, public navParams: NavParams,
    public service: ServiceProvider) {
    var languageValue = localStorage.getItem('Launguage');
    translate.setDefaultLang(languageValue);
    translate.use(languageValue);
    /*Get episode */
    this.service.getEpisode().then(data => {
      if (data != null) {
        this.length = true;
        this.episodes = data;
        for (var i in this.episodes) {
          const valueOfepisode = this.episodes[i];
          const dateFormat = moment(this.episodes[i].date).format('DD MMM YYYY');
          valueOfepisode['dateformat'] = dateFormat;
        }
        console.log("episodes", this.episodes);
      } else {
        this.length = false;
      }
    })
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    var chartOptions = {
      scales: {
        yAxes: [{
          barPercentage: 0.5,
          gridLines: {
            display: false
          }
        }],
        xAxes: [{
          gridLines: {
            zeroLineColor: "black",
            zeroLineWidth: 2
          },
          ticks: {
            min: 0,
            max: 6500,
            stepSize: 1300
          },
          scaleLabel: {
            display: true,
            labelString: "Density in kg/m3"
          }
        }]
      },
      elements: {
        rectangle: {
          borderSkipped: 'left',
        }
      }
    };
  }

  ionViewDidLoad() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  detailsView(i) {
    this.navCtrl.push('TrenddetailsPage', { id: i })
  }

}
