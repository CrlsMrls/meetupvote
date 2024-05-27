/*
This script is used to set custom claims for a user in Firebase Auth.
Follow the instructions from https://firebase.google.com/docs/admin/setup#initialize_the_sdk for setting up the Firebase Admin SDK.

export GOOGLE_APPLICATION_CREDENTIALS="/Users/carlos/src/credentials.json"
*/

const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const app = initializeApp();
console.log(app.name + " initialized");
const auth = getAuth(app);

const email = "carlosbarcelona@gmail.com";

// showUser(email);
// const uid = "E7AUwKVZZIeH32BzGbpAurTCW873";
// setUserAdmin(uid, true);
// showUser(email);
listUsers();

function listUsers() {
  // List batch of users, 1000 at a time.
  auth
    .listUsers(1000)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        console.log("user", userRecord.toJSON());
      });
    })
    .catch((error) => {
      console.log("Error listing users:", error);
    });
}

function showUser(email) {
  getAuth()
    .getUserByEmail(email)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data:`);
      console.log(userRecord.toJSON());
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
}

function setUserAdmin(uid, admin) {
  auth
    .setCustomUserClaims(uid, {
      admin,
    })
    .then(() => {
      console.log("Custom claims set successfully.");
    })
    .catch((error) => {
      console.error("Error setting custom claims:", error);
    });
}
