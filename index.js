import { add } from "./functions.js";
//Database imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//Setting up database

//Link of the firebase database
const appSettings = {
  databaseURL: "https://shopping-app-401eb-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "itemsList");

//
const addItemBtn = document.getElementById("add-button");
const inputField = document.getElementById("input-field");

addItemBtn.addEventListener("click", function () {
  let inputValue = inputField.value;
  push(itemsInDB, inputValue);

  console.log(`${inputValue} added to the database`);
});
