import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from "rxjs/Subscription";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any ;

  page;

  pages: Array<{ title: string, component: any }>;

  private timerSubscription: AnonymousSubscription;
  private postsSubscription: AnonymousSubscription;

  constructor(public Events: Events, private translate: TranslateService, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
    //localStorage.clear();
    var languageValue = localStorage.getItem('Launguage');
    console.log("LANGUAGE VALUE", languageValue);
    if (languageValue != null) {
      translate.setDefaultLang(languageValue);
      translate.use(languageValue);
    } else {
      translate.setDefaultLang('English');
      translate.use('English');
    }

    // localStorage.clear();
    const pagevalue = localStorage.getItem('AboutPage');
    const Launguage = localStorage.getItem('Launguage');
    this.listenToLoginEvents();

    if (Launguage === null) {
      this.rootPage = 'LaunguagePage';
      this.page = 'LaunguagePage';
    }
    else {
      if (pagevalue === null) {
        this.rootPage = HomePage;
        this.page = HomePage;
      } else if (pagevalue != null) {
        if (pagevalue === 'true') {
          this.rootPage = 'CaptureepisodePage';
          this.page = 'CaptureepisodePage';
        } else if (pagevalue === 'false') {
          this.rootPage = HomePage;
          this.page = HomePage;
        }
      }
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString("#9b9b9b");
      //this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.page = page;
    console.log("PAGE",this.page) ;
    if (this.page === 'Capture') {
      this.nav.setRoot('CaptureepisodePage')
    } else if (this.page === 'Trend') {
      this.nav.setRoot('TrendPage')
    } else if (this.page === 'Dashboard') {
      this.nav.setRoot('DashboardPage')      
    } else if (this.page === 'Analysis') {
      this.nav.setRoot('AnalysisPage')      
    } else if (this.page === 'Help') {
      this.nav.setRoot('ContactPage')
    } else if (this.page === 'About') {
      this.nav.setRoot(HomePage);
    } else if (this.page === 'Terms') {
      this.nav.setRoot('TermsandconditionsPage')
    } else if (this.page === 'TrendDetails') {
      this.nav.setRoot('TrenddetailsPage')
    } else if (this.page === 'Launguage') {
      this.nav.setRoot('LaunguagePage');
    }
  }

  listenToLoginEvents() {
    // console.log("App Component Launguage");
    // this.subscribeToData();
    // var languageValue=localStorage.getItem('Launguage');
    // console.log("LANGUAAGEVAULE",languageValue);
    // this.translate.setDefaultLang(languageValue);
    // this.translate.use(languageValue);
  }

  subscribeToData() {
    this.timerSubscription = Observable.timer(2000).subscribe(() => {
      this.listenToLoginEvents();
    })
  }

  public ngOnDestroy(): void {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

}
