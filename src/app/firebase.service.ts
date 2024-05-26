import { Injectable, effect, signal } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';

import {
  Firestore,
  getFirestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import {
  getAuth,
  onAuthStateChanged,
  connectAuthEmulator,
  Auth,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  GithubAuthProvider,
} from 'firebase/auth';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  GoogleProvider = new GoogleAuthProvider();
  GithubProvider = new GithubAuthProvider();

  // Create a signal to store the authenticated user
  user = signal<User | null>(null);

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.auth.useDeviceLanguage();

    // Observe authentication state changes
    onAuthStateChanged(this.auth, (currentUser) => {
      this.user.set(currentUser);
    });

    this.#setupEmulators();
  }

  #setupEmulators(): void {
    if (!environment.production) {
      const emulators = {
        // keep in sync with firebase.json
        auth: {
          port: 5001,
        },
        firestore: {
          port: 5002,
        },
      };

      connectFirestoreEmulator(
        this.firestore,
        'localhost',
        emulators.firestore.port
      );
      connectAuthEmulator(
        this.auth,
        `http://localhost:${emulators.auth.port}/`
      );
      console.warn('Emulators are enabled');
    }
  }

  // Authenticate with Google provider
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.GoogleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log('Signed in with Google ' + credential);
    } catch (error) {
      console.error('Error signing in with Google ', error);
    }
  }

  async signInWithGitHub() {
    try {
      const result = await signInWithPopup(this.auth, this.GithubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      console.log('Signed in with GitHub ' + credential);
    } catch (error) {
      console.error('Error signing in with GitHub ', error);
    }
  }

  async signOut() {
    await signOut(this.auth);
  }
}
