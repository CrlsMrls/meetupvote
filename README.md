# MeetupVote

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

## Local development

- Clone the repository
- Run `npm install` to install the dependencies.
- Install Firebase CLI (https://firebase.google.com/docs/cli), follow the steps to be able to start the local emulators. Run `npm run emulators` to start them and navigate to `http://localhost:4000/`.
- In a separate terminal, run `ng serve` for a dev server.
- Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Admin functionalities

In order to access the Admin functionalities (create a new voting, close a voting, etc), you need to create a Firestore database and add a user with the Admin role.

- Once the Firestore database is created
- Access with your user (Google or GitHub)
- Copy the User id from Firebase console in the Authentication panel
- Go to the Firestore database console and create a `users` collection.
- Add a new document inside that collection, using the User id as document identifier and add a field `admin` with the boolean value `true`.

For local development, you must follow the same approach with the Firebase Emulators: create fake user, copy the user id, create a new document in the `users` collection, etc.

## Publishing

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

Firebase hosting is used to deploy the application. Run `firebase deploy` to deploy the application to Firebase.
