import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database/';
import { AngularFireAuth } from 'angularfire2/auth/';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessagingService {
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);
    constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth) { }

    updateToken(token) {
        this.afAuth.authState.take(1).subscribe(user => {
            if (!user) return;
            const data = { [user.uid]: token };
            this.db.object('fcmTokens/').update(data);
        });
    }

    getPermission() {
        this.messaging.requestPermission().then(() => {
            console.log("Nofication permission granted");
            return this.messaging.getToken();
        }).then(token => {
            console.log(token);
            this.updateToken(token);
        }).catch(error => console.log("unabled to get permission notify", error));
    }

    receiveMessage() {
        this.messaging.onMessage((payload) => {
            console.log("Message recived ", payload);
            this.currentMessage.next(payload);
        });
    }
}
