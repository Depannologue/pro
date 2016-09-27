// import {Injectable} from 'angular2/core';
// import {Geolocation} from 'ionic-native';
// import {Observable} from 'rxjs/Observable';
//
// @Injectable()
// export class LocationTracker {
//
//     constructor() {
//
//       this.positionObserver = null;
//
//       this.position = Observable.create(observer => {
//         this.positionObserver = observer;
//       });
//
//     }
//
//     startTracking() {
//       // In App Tracking
//
//    let options = {
//      frequency: 3000,
//      enableHighAccuracy: true
//    };
//
//    this.watch = Geolocation.watchPosition(options);
//
//    this.watch.subscribe((data) => {
//      this.notifyLocation(data.coords);
//    });
//
//    // Background Tracking
//
//    let backgroundOptions = {
//      desiredAccuracy: 10,
//      stationaryRadius: 10,
//      distanceFilter: 30
//    };
//
//    backgroundGeoLocation.configure((location) => {
//      this.notifyLocation(location);
//    }, (err) => {
//      console.log(err);
//    }, backgroundOptions);
//
//    backgroundGeoLocation.start();
//
//    return this.position;
//   }
//
//   stopTracking() {
//
//   }
//
//   notifyLocation(location) {
//
//   }
//
// }
