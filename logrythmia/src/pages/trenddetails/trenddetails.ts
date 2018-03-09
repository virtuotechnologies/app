import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, Navbar } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service/service';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import * as moment from 'moment';
/**
 * Generated class for the TrenddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-trenddetails',
  templateUrl: 'trenddetails.html',
})
export class TrenddetailsPage {
  episodes;
  id;
  @ViewChild(Navbar) navBar: Navbar;
  @ViewChild('mySlider') mySlider: any;
  constructor(private screenOrientation: ScreenOrientation, public navCtrl: NavController, public navParams: NavParams, public service: ServiceProvider) {
    var id = this.navParams.get('id');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.id = id;
    console.log("id",this.id);

    /*Get episode */
    this.service.getEpisode().then(data => {
      if (data != null) {
        this.episodes = data;
        for (var i in this.episodes) {
          const valueOfepisode = this.episodes[i];
          const dateFormat = moment(this.episodes[i].date).format('DD MMM YYYY');
          valueOfepisode['dateformat'] = dateFormat;
        }
      }
    })
  }

  ngOnInit() {
    // console.log("slides",mySlider);
    
  }

  ionViewDidEnter(){
     this.mySlider.slideTo(this.id, 500);
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      console.log("DID LOAD PREVIOUS");
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      this.navCtrl.setRoot('TrendPage')
    }
  }
}
