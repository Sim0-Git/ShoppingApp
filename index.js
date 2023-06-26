//
import { add } from "./functions.js";

//Database imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

//Setting up database

//Link of the firebase database
const appSettings = {
  databaseURL: "https://shopping-app-401eb-default-rtdb.firebaseio.com/",
};
const app = initializeApp(appSettings);
const database = getDatabase(app);
const itemsInDB = ref(database, "itemsList");

//reference elements and variables
const addItemBtn = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const itemUlList = document.getElementById("item-list");
let inputValue;

//Fetching items from the database, runs every time there is edit to the database
onValue(itemsInDB, function (snapshot) {
  //Check if the item list is empty
  if (snapshot.exists()) {
    // values retrieve just the values of the itemsArray, keys retrieve just the id , and entries retrieve both
    let itemsArray = Object.entries(snapshot.val());
    clearItemUlList();
    itemsArray.forEach((currentItem) => {
      appendItemToUlList(currentItem);
      console.log(`${currentItem} appended to the list`);
    });
  } else {
    itemUlList.innerHTML = `<h3 id="no-item-msg">No items in the list</h3>`;
  }
});

//Add items to the Ul list and the database
addItemBtn.addEventListener("click", function () {
  inputValue = inputField.value;
  if (inputValue == "") {
    return;
  } else {
    push(itemsInDB, inputValue);
    clearInputField();
  }
});

//Add items to Ul list
function appendItemToUlList(item) {
  // itemUlList.innerHTML += `<li>${itemValue}</li>`;
  let newItem = document.createElement("li"); // Create li element
  let deleteBtn = document.createElement("button");
  let itemID = item[0]; //Get id from the item
  let itemValue = item[1]; // Get value from the item

  newItem.textContent = itemValue; //Assign to the li element the item value
  newItem.draggable = { containment: "parent" };
  deleteBtn.textContent = "Delete";
  deleteBtn.id = "deleteItemBtn";

  newItem.append(deleteBtn);
  itemUlList.append(newItem); // Append newItem li element to Ul list

  //Call deleteBtn function on clicks
  deleteBtn.addEventListener("click", function () {
    let itemLocationInDB = ref(database, `itemsList/${itemID}`);
    remove(itemLocationInDB); //remove exact item by ID
  });
  // newItem.addEventListener("drag", function () {
  //   let itemLocationInDB = ref(database, `itemsList/${itemID}`);
  //   remove(itemLocationInDB); //remove exact item by ID
  // });
}

//Clear input field
function clearInputField() {
  inputField.value = "";
}
//Clear UL list element
function clearItemUlList() {
  itemUlList.innerHTML = "";
}
