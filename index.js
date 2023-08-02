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
// const addItemBtn = document.getElementById("add-button");
// const inputField = document.getElementById("input-field");
const addItemDiv = document.getElementById("open-modal-btn-container");
const itemUlList = document.getElementById("item-list");
const completedItemUlList = document.getElementById("completed-item-list");

//Modal
const form = document.getElementById("form");
const openModalBtn = document.getElementById("open-modal-btn");
const addBtn = document.getElementById("add-btn");
const doneBtn = document.getElementById("done-btn");
const modalEl = document.getElementById("modal");
const inputContainer = document.getElementById("input-container");
const inputFieldModal = document.getElementById("modal-input-field");
// const quantityFieldModal = document.getElementById("modal-quantity-field");

//Arrays
let itemArray = [];
let completedItemArray = [];

// item added popup icon HTML element
let itemAddedPTag = document.createElement("div");
itemAddedPTag.textContent = "Added";
// inputContainer.append(itemAddedPTag);

//Fetching items from the database, runs every time there is edit to the database
onValue(itemsInDB, function (snapshot) {
  itemArray = [];
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
    itemUlList.innerHTML = `<h3 id="no-item-msg">Add more items to your cart</h3>`;
  }
});

onValue(completedItemDB, function (snapshot) {
  completedItemArray = [];
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
    // completedItemUlList.innerHTML = "<span></span>";
    completedItemUlList.innerHTML = `<h3 id="no-item-msg">No items</h3>`;
  }
});

addBtn.addEventListener("click", function () {
  let inputValue = trimAndLowerCase(inputFieldModal.value);
  if (
    !itemArray.includes(inputValue) &&
    !completedItemArray.includes(inputValue) &&
    !inputFieldModal.value == ""
  ) {
    itemAddedPTag.classList = "itemPTagAdded";
    setTimeout(function () {
      itemAddedPTag.className = "itemPTag";
    }, 1000);
    inputContainer.append(itemAddedPTag);
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
  inputFieldModal.focus();
});

//Add items by opening a modal
form.addEventListener("submit", function (e) {
  e.preventDefault();
});
openModalBtn.addEventListener("click", function () {
  modalEl.style.display = "flex";
  addItemDiv.style.display = "none";
  inputFieldModal.focus();
  inputModalChecks();
});
doneBtn.addEventListener("click", function () {
  modalEl.style.display = "none";
  addItemDiv.style.display = "flex";
  inputFieldModal.value = "";
  // quantityFieldModal.value = "0";
});

let itemsHTML = ``;
//Add items to Ul list
function appendItemToUlList(item) {
  let newItem = document.createElement("li"); // Create li element
  let deleteBtn = document.createElement("button");
  let checkBox = document.createElement("input");
  let liDiv = document.createElement("div");
  let itemID = item[0]; //Get id from the item
  let itemValue = item[1]; // Get value from the item

  newItem.textContent = itemValue; //Assign to the li element the item value

  // //Append checkbox and delete button to the div and the div to the li element
  deleteBtn.classList = "deleteItemBtn";
  checkBox.type = "checkBox";
  checkBox.classList = "check-box-el";
  liDiv.classList = "li-div";

  liDiv.append(checkBox);
  liDiv.append(newItem);
  liDiv.append(deleteBtn);
  itemUlList.append(liDiv);

  // itemsHTML += `
  // <li class="li-new">
  //   <input type="checkBox" id="${item[0]}" class="check-box-el"/>
  //   <label>${item[1]}</label>
  //   <button id="${item[0]}" class="deleteItemBtn"></button>
  // </li>`;

  // itemUlList.innerHTML = itemsHTML;

  //if checked move to the completed ul list items
  checkBox.addEventListener("click", function () {
    let itemLocationInDB = ref(database, `itemsList/${itemID}`);
    console.log(itemID);
    if (checkBox.checked) {
      completedItemUlList.append(newItem);
      push(completedItemDB, itemValue);
      remove(itemLocationInDB);
    }
  });

  //Call deleteBtn function on clicks
  deleteBtn.addEventListener("click", function () {
    let itemLocationInDB = ref(database, `itemsList/${itemID}`);
    remove(itemLocationInDB); //remove exact item by ID
  });
}

itemUlList.addEventListener("click", function (e) {
  // console.log(document.getElementById(e.target.id).parentElement);
});

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
  deleteBtn.classList = "deleteItemBtn";
  checkBox.type = "checkBox";
  checkBox.classList = "check-box-el";
  checkBox.checked = true;
  liDiv.id = "li-div-completed";

  liDiv.append(checkBox);
  liDiv.append(newItem);
  liDiv.append(deleteBtn);
  completedItemUlList.append(liDiv); // Append newItem li element to Ul list

  //if checked move to the completed ul list items
  checkBox.addEventListener("click", function () {
    let itemLocationInDB = ref(database, `completedItemsList/${itemID}`);
    if (!checkBox.checked) {
      itemUlList.append(newItem);
      remove(itemLocationInDB);
      push(itemsInDB, itemValue);
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
  // inputField.value = "";
  inputFieldModal.value = "";
}
//Clear UL list element
function clearItemUlList() {
  itemUlList.innerHTML = "";
}
function clearCompletedItemUlList() {
  completedItemUlList.innerHTML = "";
}
//Trim and lower user inputs
function trimAndLowerCase(input) {
  input = input.trim();
  input = input.toLowerCase();
  return input;
}
//Modal input checks
function inputModalChecks() {
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
