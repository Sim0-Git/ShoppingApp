//
const addItemBtn = document.getElementById("add-button");
const inputField = document.getElementById("input-field");

addItemBtn.addEventListener("click", function () {
  let inputValue = inputField.value;
  console.log(inputValue);
});
