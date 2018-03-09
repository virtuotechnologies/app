var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
var MyApp = /** @class */ (function () {
    function MyApp(Events, translate, platform, statusBar, splashScreen) {
        this.Events = Events;
        this.translate = translate;
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.initializeApp();
        //localStorage.clear();
        var languageValue = localStorage.getItem('Launguage');
        console.log("LANGUAGE VALUE", languageValue);
        if (languageValue != null) {
            translate.setDefaultLang(languageValue);
            translate.use(languageValue);
        }
        else {
            translate.setDefaultLang('English');
            translate.use('English');
        }
        // localStorage.clear();
        var pagevalue = localStorage.getItem('AboutPage');
        var Launguage = localStorage.getItem('Launguage');
        this.listenToLoginEvents();
        if (Launguage === null) {
            this.rootPage = 'LaunguagePage';
            this.page = 'LaunguagePage';
        }
        else {
            if (pagevalue === null) {
                this.rootPage = HomePage;
                this.page = HomePage;
            }
            else if (pagevalue != null) {
                if (pagevalue === 'true') {
                    this.rootPage = 'CaptureepisodePage';
                    this.page = 'CaptureepisodePage';
                }
                else if (pagevalue === 'false') {
                    this.rootPage = HomePage;
                    this.page = HomePage;
                }
            }
        }
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.statusBar.backgroundColorByHexString("#9b9b9b");
            //this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.page = page;
        console.log("PAGE", this.page);
        if (this.page === 'Capture') {
            this.nav.setRoot('CaptureepisodePage');
        }
        else if (this.page === 'Trend') {
            this.nav.setRoot('TrendPage');
        }
        else if (this.page === 'Dashboard') {
            this.nav.setRoot('DashboardPage');
        }
        else if (this.page === 'Analysis') {
            this.nav.setRoot('AnalysisPage');
        }
        else if (this.page === 'Help') {
            this.nav.setRoot('ContactPage');
        }
        else if (this.page === 'About') {
            this.nav.setRoot(HomePage);
        }
        else if (this.page === 'Terms') {
            this.nav.setRoot('TermsandconditionsPage');
        }
        else if (this.page === 'TrendDetails') {
            this.nav.setRoot('TrenddetailsPage');
        }
        else if (this.page === 'Launguage') {
            this.nav.setRoot('LaunguagePage');
        }
    };
    MyApp.prototype.listenToLoginEvents = function () {
        // console.log("App Component Launguage");
        // this.subscribeToData();
        // var languageValue=localStorage.getItem('Launguage');
        // console.log("LANGUAAGEVAULE",languageValue);
        // this.translate.setDefaultLang(languageValue);
        // this.translate.use(languageValue);
    };
    MyApp.prototype.subscribeToData = function () {
        var _this = this;
        this.timerSubscription = Observable.timer(2000).subscribe(function () {
            _this.listenToLoginEvents();
        });
    };
    MyApp.prototype.ngOnDestroy = function () {
        if (this.postsSubscription) {
            this.postsSubscription.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    };
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Events, TranslateService, Platform, StatusBar, SplashScreen])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map