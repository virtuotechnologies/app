import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Storage } from '@ionic/storage';
import { ServiceProvider } from '../../providers/service/service';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the CaptureepisodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-captureepisode',
  templateUrl: 'captureepisode.html',
})
export class CaptureepisodePage {
  capture_form;
  selectedSymptomsValue = [];
  selectedTimeValue;
  selectedPulseValue;
  doSelectedValue;
  stopSelectedValue;
  selectWhichOneValue;
  textValueOne;
  textValueTwo;
  timeValue;
  episodeForm;
  myDate: String = new Date().toISOString();
  maxDateValue;
  NotesValue;
  selectedSymptomsValueOne = [];
  selectedSymptomsValueFinal = [];
  selectedTimeValueOne = [];
  selectedTimeValueFinal = [];
  selectedPulseValueOne = [];
  selectedPulseValueFinal = [];
  doSelectedValueFinal = [];
  doSelectedValueOne = [];
  stopSelectedValueOne = [];
  stopSelectedValueFinal = [];

  symptoms = [{
    value: 'Lightheadedness',
    tranlsate: 'LIGHTHEADEDNESS',
    selected: ''
  }, {
    value: 'Fainted',
    tranlsate: 'FAINTNESS',
    selected: ''
  }, {
    value: 'Passing out/syncope',
    tranlsate: 'PASSING_OUT/SYNCOPE',
    selected: ''
  }, {
    value: 'Fatigue',
    tranlsate: 'FATIGUE',
    selected: ''
  }, {
    value: 'Short of breath',
    tranlsate: 'SHORT_OF_BREATH',
    selected: ''
  }, {
    value: 'Chest tightness',
    tranlsate: 'CHEST_TIGHTNESS',
    selected: ''
  }]
  Time = [{
    value: 'Less than 5 min',
    tranlsate: 'LESS_THAN_5_MIN',
    selected: ''
  }, {
    value: 'More than 5 min',
    tranlsate: 'MORE_THAN_5_MIN',
    selected: ''
  }, {
    value: 'Less than 30 min',
    tranlsate: 'LESS_THAN_30_MIN',
    selected: ''
  }, {
    value: 'More than 30 min',
    tranlsate: 'MORE_THAN_30_MIN',
    selected: ''
  }]
  pulse = [{
    value: 'Fast',
    tranlsate: 'FAST',
    selected: ''
  }, {
    value: 'Slow',
    tranlsate: 'SLOW',
    selected: ''
  }, {
    value: 'Irregular',
    tranlsate: 'IRREGULAR',
    selected: ''
  }, {
    value: 'I felt skip beats',
    tranlsate: 'I_FELT_SKIP_BEATS',
    selected: ''
  }]
  doselectedList = [{
    value: 'At rest',
    translate: 'AT_REST',
    selected: ''
  }, {
    value: 'Doing exercise',
    translate: 'DOING_EXERCISE',
    selected: ''
  }, {
    value: 'Drinking alcohol',
    translate: 'DRINKING_ALCOHOL',
    selected: ''
  }, {
    value: 'Recover from Exersise',
    translate: 'RECOVERING_FROM_EXERSISE',
    selected: ''
  }, {
    value: 'having sex',
    translate: 'HAVING_SEX',
    selected: ''
  }, {
    value: 'Under stress',
    translate: 'UNDER_STRESS',
    selected: ''
  }]

  stopSelectedValueList = [{
    value: 'By itself',
    translate: 'BY_ITSELF',
    selected: '',
    whichOne: false
  }, {
    value: 'At rest',
    translate: 'AT_REST',
    selected: '',
    whichOne: false
  }, {
    value: 'After a cold drink',
    translate: 'AFTER_A_COLD_DRINK',
    selected: '',
    whichOne: false
  }, {
    value: 'After specific maneouvers',
    translate: 'AFTER_SPECIFIC_MANEOUVERS',
    selected: '',
    whichOne: false
  }, {
    value: 'After an intervention by medical team',
    translate: 'AFTER_AN_INTERVENTION_BY_MEDICAL_TEAM',
    selected: '',
    whichOne: true
  }, {
    value: 'After taking medication',
    translate: 'AFTER_TAKING_MEDICATION',
    selected: '',
    whichOne: true
  }]

  constructor(private translate: TranslateService, private toastCtrl: ToastController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    private screenOrientation: ScreenOrientation, public storage: Storage, public service: ServiceProvider) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.maxDateValue = moment().format('YYYY-MM-DD');
    var currentTime = moment().format('HH:mm:ss');
    console.log("currentTime", currentTime)
    this.timeValue = currentTime;
    var languageValue = localStorage.getItem('Launguage');
    console.log("LANGUAGEVALUE", languageValue);
    translate.setDefaultLang(languageValue);
    translate.use(languageValue);
  }

  ngOnInit() {
    this.capture_form = this.formBuilder.group({
      online: [''],
      occurDate: [''],
      occurTime: ['']
    });
    console.log("selectedSymptomsValueFinal", this.selectedSymptomsValueFinal.length)
  }

  selectSymptoms(symptoms) {
    var unique, uniqueOne;
    var filter = this.selectedSymptomsValueFinal.filter(a => a.toString() === symptoms.toString());
    if (this.selectedSymptomsValueFinal.length === 0) {
      this.selectedSymptomsValueOne = [];
    }
    if (filter.length === 0) {
      this.selectedSymptomsValueOne.push(symptoms);
      unique = this.selectedSymptomsValueOne.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      })
    } else {
      var index = this.selectedSymptomsValueFinal.indexOf(symptoms);
      if (index != -1) {
        this.selectedSymptomsValueFinal.splice(index, 1);
        this.selectedSymptomsValueOne.splice(index, 1);
        var f = this.symptoms.filter(a => a.value === symptoms);
        f[0].selected = ''
      }
    }

    if (unique != undefined) {
      this.selectedSymptomsValueFinal = unique;
    } else if (uniqueOne != undefined) {
      this.selectedSymptomsValueFinal = uniqueOne;
    } else if (unique && uniqueOne != undefined) {
      this.selectedSymptomsValueFinal = unique.concat(uniqueOne);
    }

    for (var i in this.selectedSymptomsValueFinal) {
      for (var k in this.symptoms) {
        var value = this.symptoms[k];
        console.log("SYMTOMS")
        if (this.selectedSymptomsValueFinal[i] === this.symptoms[k].value) {
          console.log("TRU")
          value.selected = 'true';
        }
      }
    }
  }

  selectSeconds(selectTime) {
    this.selectedTimeValue = selectTime;
  }

  selectPulse(pulse) {
    var unique, uniqueOne;
    if (pulse === 'Slow') {
      var indexOne = this.selectedPulseValueFinal.indexOf('Fast');
      if (indexOne != -1) {
        this.selectedPulseValueFinal.splice(indexOne, 1);
        this.selectedPulseValueOne.splice(indexOne, 1);
      }
      var f = this.pulse.filter(a => a.value === 'Fast');
      f[0].selected = '';;
      console.log("pluse");
      console.log("selectdeValueFinal",this.selectedPulseValueFinal);

    } else if (pulse === 'Fast') {
      var indexTwo = this.selectedPulseValueFinal.indexOf('Slow');
      if (indexTwo != -1) {
        this.selectedPulseValueFinal.splice(indexTwo, 1);
        this.selectedPulseValueOne.splice(indexTwo, 1);
      }
      var f1 = this.pulse.filter(a => a.value === 'Slow');
      f1[0].selected = '';
      console.log("fast");
      console.log("selectedVale",this.selectedPulseValueFinal);

    }
    console.log("this.selectedPulseValueFinal", this.selectedPulseValueFinal);
    var filter = this.selectedPulseValueFinal.filter(a => a.toString() === pulse.toString());
    if (this.selectedPulseValueFinal.length === 0) {
      this.selectedPulseValueOne = [];
    }
    if (filter.length === 0) {
      this.selectedPulseValueOne.push(pulse);
      unique = this.selectedPulseValueOne.filter(function (elem, index, self) {
        return index === self.indexOf(elem);
      })
    } else {
      var index = this.selectedPulseValueFinal.indexOf(pulse);
      if (index != -1) {
        this.selectedPulseValueFinal.splice(index, 1);
        this.selectedPulseValueOne.splice(index, 1);
        var f = this.pulse.filter(a => a.value === pulse);
        f[0].selected = ''
      }
    }

    if (unique != undefined) {
      this.selectedPulseValueFinal = unique;
    } else if (uniqueOne != undefined) {
      this.selectedPulseValueFinal = uniqueOne;
    } else if (unique && uniqueOne != undefined) {
      this.selectedPulseValueFinal = unique.concat(uniqueOne);
    }

    for (var i2 in this.selectedPulseValueFinal) {
      for (var k2 in this.pulse) {
        var value2 = this.pulse[k2];
        console.log("SYMTOMS")
        if (this.selectedPulseValueFinal[i2] === this.pulse[k2].value) {
          console.log("TRU")
          value2.selected = 'true';
        }
      }
    }

    console.log("TIME", this.pulse);
    console.log("selectedTimeValueFinal", this.selectedPulseValueFinal);
  }

  doSelected(did) {
    this.doSelectedValue = did
  }

  selectedStop(stop) {
    this.stopSelectedValue = stop;
  }

  selectWhichone(which) {
    this.selectWhichOneValue = which;
  }

  save() {
    console.log("timeValue", this.myDate);
    this.service.addEpisode(this.selectedSymptomsValueFinal, this.selectedTimeValue, this.selectedPulseValueFinal, this.doSelectedValue,
      this.stopSelectedValue, this.selectWhichOneValue, this.textValueOne, this.textValueTwo, this.timeValue, this.myDate, this.NotesValue);
    let toast = this.toastCtrl.create({
      message: 'Episode saved successfully',
      duration: 1500,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
    this.service.getEpisode().then(data => {
      console.log("data", data);
    })
  }

}
