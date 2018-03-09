var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
/*
  Generated class for the ServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var ServiceProvider = /** @class */ (function () {
    function ServiceProvider(Events, http, storage) {
        this.Events = Events;
        this.http = http;
        this.storage = storage;
        console.log('Hello ServiceProvider Provider');
    }
    ServiceProvider.prototype.addEpisode = function (selectedSymptomsValue, selectedTimeValue, selectedPulseValue, doSelectedValue, stopSelectedValue, selectWhichOneValue, textValueOne, textValueTwo, timeValue, dateValue, Notes) {
        var _this = this;
        this.storage.get('episodes').then(function (data) {
            if (data == null) {
                data = [];
            }
            _this.episode = data; //re-initialize the items array equal to storage value
            _this.episode.push({
                symptoms: selectedSymptomsValue,
                minutes: selectedTimeValue,
                pulse: selectedPulseValue,
                doSelectedValue: doSelectedValue,
                stopSelectedValue: stopSelectedValue,
                selectWhichOneValue: selectWhichOneValue,
                textValueOne: textValueOne,
                textValueTwo: textValueTwo,
                date: dateValue,
                timeValue: timeValue,
                Notes: Notes
            });
            console.log("addEpisodes", _this.episode);
            _this.storage.set('episodes', _this.episode);
        });
    };
    ServiceProvider.prototype.getEpisode = function () {
        //this.storage.remove('episodes');
        return this.storage.get('episodes');
    };
    ServiceProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Events, HttpClient, Storage])
    ], ServiceProvider);
    return ServiceProvider;
}());
export { ServiceProvider };
//# sourceMappingURL=service.js.map