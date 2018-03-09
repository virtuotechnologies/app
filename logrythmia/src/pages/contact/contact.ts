import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the ContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {
  userName;
  userEmail;
  userMessage;
  myForm;
  constructor(private emailComposer: EmailComposer,private screenOrientation: ScreenOrientation,private translate: TranslateService,public navCtrl: NavController, public navParams: NavParams) {
    var languageValue = localStorage.getItem('Launguage');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    translate.setDefaultLang(languageValue);
    translate.use(languageValue);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactPage');
  }

  sendEmail() {
    var subject ='New enquiry from '+this.userName;
    var replace =this.userMessage.replace(/\n/g,"<br>");
    var value ='Hi Admin,<br><br>Enquiry Details<br><br>Name: '+this.userName+',<br><br>Email: '+this.userEmail+',<br><br>Message:<br> '+replace+'<br><br>Thanks & Regards,<br>'+this.userName;
    var Email = this.userEmail;
    var Msg = this.userMessage;
    var from='support@logrythmia.com';
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
     });
     let email = {
       to: 'support@logrythmia.com',
       cc: '',
       bcc: ['', ''],
       attachments: [
       ],
       subject: subject,
       body: value,
       isHtml: true
     };
     // Send a text message using default options
     this.emailComposer.open(email);
  }

}
