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
const completedItemDB = ref(database, "completedItemsList");

//reference elements and variables
const addItemBtn = document.getElementById("add-button");
const inputField = document.getElementById("input-field");
const itemUlList = document.getElementById("item-list");
const completedItemUlList = document.getElementById("completed-item-list");
let inputValue;

//Fetching items from the database, runs every time there is edit to the database
onValue(itemsInDB, function (snapshot) {
  console.log("Enter on value in ItemsInDB");
  //Check if the item list is empty
  if (snapshot.exists()) {
    console.log("Snapshot in ItemsInDB exists");
    // values retrieve just the values of the itemsArray, keys retrieve just the id , and entries retrieve both
    let itemsArray = Object.entries(snapshot.val());
    clearItemUlList();
    itemsArray.forEach((currentItem) => {
      appendItemToUlList(currentItem);
      console.log(`${currentItem} appended to the list`);
    });
  } else {
    itemUlList.innerHTML = `<h3 id="no-item-msg">Add more items to your list</h3>`;
  }
});

onValue(completedItemDB, function (snapshot) {
  console.log("Enter on value in completedItemDB");
  //Check if the item list is empty
  if (snapshot.exists()) {
    console.log("Snapshot in completedItemDB exists");
    // values retrieve just the values of the itemsArray, keys retrieve just the id , and entries retrieve both
    let itemsArray = Object.entries(snapshot.val());
    clearCompletedItemUlList();
    itemsArray.forEach((currentItem) => {
      appendItemToCompletedUlList(currentItem);
      console.log(`${currentItem} appended to the completed item list`);
    });
  } else {
    // completedItemUlList.innerHTML = `<h3 id="no-item-msg">No items in the list</h3>`;
    completedItemUlList.innerHTML = "<span></span>";
    // return;
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
  console.log("Enter appendItemTodUlList and append item " + item);
  // itemUlList.innerHTML += `<li>${itemValue}</li>`;
  let newItem = document.createElement("li"); // Create li element
  let deleteBtn = document.createElement("button");
  let checkBox = document.createElement("input");
  let liDiv = document.createElement("div");
  let itemID = item[0]; //Get id from the item
  let itemValue = item[1]; // Get value from the item

  newItem.textContent = itemValue; //Assign to the li element the item value

  // //Append checkbox and delete button to the div and the div to the li element
  deleteBtn.id = "deleteItemBtn";
  checkBox.type = "checkBox";
  checkBox.id = "check-box-el";
  liDiv.id = "li-div";

  liDiv.append(checkBox);
  liDiv.append(newItem);
  liDiv.append(deleteBtn);
  itemUlList.append(liDiv);

  //if checked move to the completed ul list items
  checkBox.addEventListener("click", function () {
    console.log("Enter checkbox listener in itemList");
    let itemLocationInDB = ref(database, `itemsList/${itemID}`);
    if (checkBox.checked) {
      completedItemUlList.append(newItem);
      console.log(newItem.textContent + " appended to completedItemUlList");
      push(completedItemDB, itemValue);
      console.log(newItem.textContent + " pushed in completedItemDB");
      remove(itemLocationInDB);
      console.log("remove " + newItem.textContent + " from itemsInDB");
    }
  });

  //Call deleteBtn function on clicks
  deleteBtn.addEventListener("click", function () {
    let itemLocationInDB = ref(database, `itemsList/${itemID}`);
    remove(itemLocationInDB); //remove exact item by ID
  });
}
function appendItemToCompletedUlList(item) {
  console.log("Enter appendItemToCompletedUlList and append item " + item);
  // itemUlList.innerHTML += `<li>${itemValue}</li>`;
  let newItem = document.createElement("li"); // Create li element
  let deleteBtn = document.createElement("button");
  let checkBox = document.createElement("input");
  let liDiv = document.createElement("div");
  let itemID = item[0]; //Get id from the item
  let itemValue = item[1]; // Get value from the item

  newItem.id = "completed-item-li";
  newItem.textContent = itemValue; //Assign to the li element the item value

  //Append checkbox and delete button to the div and the div to the li element
  deleteBtn.id = "deleteItemBtn";
  checkBox.type = "checkBox";
  checkBox.id = "check-box-el";
  checkBox.checked = true;
  liDiv.id = "li-div-completed";

  liDiv.append(checkBox);
  liDiv.append(newItem);
  liDiv.append(deleteBtn);
  completedItemUlList.append(liDiv); // Append newItem li element to Ul list

  //if checked move to the completed ul list items
  checkBox.addEventListener("click", function () {
    console.log("Enter checkbox listener in completedItemList");
    let itemLocationInDB = ref(database, `completedItemsList/${itemID}`);
    if (!checkBox.checked) {
      console.log(newItem.textContent + " item had ben unchecked");
      itemUlList.append(newItem);
      console.log(newItem.textContent + " appended to itemUlList");
      remove(itemLocationInDB);
      console.log("remove " + newItem.textContent + " from completedItemDB");
      push(itemsInDB, itemValue);
      console.log(newItem.textContent + " pushed in itemsInDB");
    }
  });

  //Call deleteBtn function on clicks
  deleteBtn.addEventListener("click", function () {
    let itemLocationInDB = ref(database, `completedItemsList/${itemID}`);
    remove(itemLocationInDB); //remove exact item by ID
  });
}
//Clear input field
function clearInputField() {
  inputField.value = "";
}
//Clear UL list element
function clearItemUlList() {
  itemUlList.innerHTML = "";
  console.log("CLEARING THE ITEM UL LIST");
}
function clearCompletedItemUlList() {
  completedItemUlList.innerHTML = "";
  console.log("CLEARING THE COMPLETED ITEM UL LIST");
}
