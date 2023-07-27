//
// import { appendItemToUlList } from "./functions.js";

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

//Reference elements and variables
const addItemBtn = document.getElementById("add-button");
const addItemDiv = document.getElementById("open-modal-btn-container");
const inputField = document.getElementById("input-field");
const itemUlList = document.getElementById("item-list");
const completedItemUlList = document.getElementById("completed-item-list");
//Modal
const form = document.getElementById("form");
const openModalBtn = document.getElementById("open-modal-btn");
const addBtn = document.getElementById("add-btn");
const doneBtn = document.getElementById("done-btn");
const modalEl = document.getElementById("modal");
const inputFieldModal = document.getElementById("modal-input-field");
const quantityFieldModal = document.getElementById("modal-quantity-field");
//Arrays
let itemArray = [];
let completedItemArray = [];

//Fetching items from the database, runs every time there is edit to the database
onValue(itemsInDB, function (snapshot) {
  //Check if the item list is empty
  if (snapshot.exists()) {
    // values retrieve just the values of the itemsArray, keys retrieve just the id , and entries retrieve both
    let itemsArray = Object.entries(snapshot.val());
    clearItemUlList();
    itemsArray.forEach((currentItem) => {
      itemArray.push(currentItem[1]);
      appendItemToUlList(currentItem);
    });
  } else {
    itemUlList.innerHTML = `<h3 id="no-item-msg">Add more items to your list</h3>`;
  }
});

onValue(completedItemDB, function (snapshot) {
  //Check if the item list is empty
  if (snapshot.exists()) {
    // values retrieve just the values of the itemsArray, keys retrieve just the id , and entries retrieve both
    let itemsArray = Object.entries(snapshot.val());
    clearCompletedItemUlList();
    itemsArray.forEach((currentItem) => {
      completedItemArray.push(currentItem[1]);
      appendItemToCompletedUlList(currentItem);
    });
  } else {
    // completedItemUlList.innerHTML = `<h3 id="no-item-msg">No items in the list</h3>`;
    completedItemUlList.innerHTML = "<span></span>";
    // return;
  }
});

//Add items to the Ul list and the database
// addItemBtn.addEventListener("click", function () {
//   let inputValue = trimAndLowerCase(inputField.value);
//   console.log(inputValue);
//   console.log(itemArray);
//   console.log(completedItemArray);
//   if (
//     !itemArray.includes(inputValue) &&
//     !completedItemArray.includes(inputValue) &&
//     !inputField.value == ""
//   ) {
//     console.log(`${inputValue} added`);
//     push(itemsInDB, inputValue);
//     clearInputField();
//   } else {
//     inputField.value = "Already in the list!";
//     setTimeout(function () {
//       inputField.value = "";
//     }, 1500);
//   }
// });
addBtn.addEventListener("click", function () {
  let inputValue = trimAndLowerCase(inputFieldModal.value);
  if (
    !itemArray.includes(inputValue) &&
    !completedItemArray.includes(inputValue) &&
    !inputFieldModal.value == ""
  ) {
    console.log(`${inputValue} added`);
    push(itemsInDB, inputValue);
    clearInputField();
  } else {
    inputFieldModal.value = "Already in the list!";
    setTimeout(function () {
      inputFieldModal.value = "";
      // quantityFieldModal.value = "";
    }, 1500);
  }
  inputModalChecks();
});

//Add items by opening a modal
form.addEventListener("submit", function (e) {
  e.preventDefault();
});
openModalBtn.addEventListener("click", function () {
  modalEl.style.display = "flex";
  addItemDiv.style.display = "none";
  inputModalChecks();
});
doneBtn.addEventListener("click", function () {
  modalEl.style.display = "none";
  addItemDiv.style.display = "flex";
  inputFieldModal.value = "";
  // quantityFieldModal.value = "0";
});

//Add items to Ul list
function appendItemToUlList(item) {
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
//Add items to completed Ul list
function appendItemToCompletedUlList(item) {
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
  inputFieldModal.value = "";
}
//Clear UL list element
function clearItemUlList() {
  itemUlList.innerHTML = "";
}
function clearCompletedItemUlList() {
  completedItemUlList.innerHTML = "";
}
function trimAndLowerCase(input) {
  input = input.trim();
  input = input.toLowerCase();
  return input;
}
function inputModalChecks() {
  //Modal input checks
  if (!inputFieldModal.value) {
    addBtn.style.backgroundColor = "#d2d2cf";
    addBtn.disabled = true;
  }
  inputFieldModal.addEventListener("keydown", function () {
    addBtn.style.backgroundColor = "#ff9770";
    addBtn.disabled = false;
  });
  inputFieldModal.addEventListener("keyup", function () {
    if (!inputFieldModal.value) {
      addBtn.style.backgroundColor = "#d2d2cf";
      addBtn.disabled = true;
    }
  });
}
