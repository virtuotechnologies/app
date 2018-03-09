import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Storage } from '@ionic/storage';
import { Events, Note } from 'ionic-angular';
/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServiceProvider {
  episode;
  constructor(public Events:Events,public http: HttpClient, public storage: Storage) {
    console.log('Hello ServiceProvider Provider');
  }

  addEpisode(selectedSymptomsValue, selectedTimeValue, selectedPulseValue, doSelectedValue,
    stopSelectedValue, selectWhichOneValue, textValueOne, textValueTwo,timeValue,dateValue,Notes) {
    this.storage.get('episodes').then((data) => {
      if (data == null) {
        data = [];
      }
      this.episode = data;//re-initialize the items array equal to storage value
      this.episode.push({
        symptoms: selectedSymptomsValue,
        minutes: selectedTimeValue,
        pulse: selectedPulseValue,
        doSelectedValue: doSelectedValue,
        stopSelectedValue: stopSelectedValue,
        selectWhichOneValue: selectWhichOneValue,
        textValueOne: textValueOne,
        textValueTwo: textValueTwo,
        date: dateValue,
        timeValue:timeValue,
        Notes:Notes
      });
      console.log("addEpisodes",this.episode)
      this.storage.set('episodes', this.episode);
    });
  }

  getEpisode() {
    //this.storage.remove('episodes');
    return this.storage.get('episodes');
  }

}
