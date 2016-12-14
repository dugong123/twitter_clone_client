import {inject, Aurelia} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './services/messages';
import TweetService from './services/tweet-service';

@inject(TweetService, Aurelia, EventAggregator)
export class App {

  constructor(ts, au, ea) {
    this.au = au;
    this.tweetService = ts;
    ea.subscribe(LoginStatus, msg => {
      if (msg.status.success === true) {
        au.setRoot('home').then(() => {
          this.router.navigateToRoute('home');
        });
      } else {
        au.setRoot('app').then(() => {
          this.router.navigateToRoute('login');
        });
      }
    });
  }

  configureRouter(config, router) {
    config.map([
      { route: ['', 'login'], name: 'login', moduleId: 'viewmodels/login/login', nav: true, title: 'Login' },
      { route: 'signup', name: 'signup', moduleId: 'viewmodels/signup/signup', nav: true, title: 'Signup' }
    ]);

    config.mapUnknownRoutes(instruction => {
      return 'login';
    });

    this.router = router;
  }

  attached() {
    if (this.tweetService.isAuthenticated()) {
      this.au.setRoot('home').then(() => {
        this.router.navigateToRoute('home');
      });
    }
  }
}
