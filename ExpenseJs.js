document.addEventListener("DOMContentLoaded", initialize);

// When the page get load display all users
function initialize() {
  const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
  usersList.forEach((user) => display(user));
  sessionStorage.removeItem("editId");
}

// add new users in usersList array and local storage
function handleFormSubmit(event) {
  event.preventDefault();

  const expense = event.target.expense.value.trim();
  const description = event.target.description.value.trim();
  const category = event.target.category.value;

  if (!category) {
    alert("Please select a category!");
    return;
  }

  const userDetails = { expense, description, category };
  const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
  const editId = sessionStorage.getItem("editId");

  if (editId) {
    const userIndex = usersList.findIndex((user) => user.id == editId);
    if (userIndex !== -1) {
      usersList[userIndex] = { ...usersList[userIndex], ...userDetails };
      updateDisplay(editId, userDetails);
    }
    sessionStorage.removeItem("editId");
  } else {
    addData(usersList, userDetails);
  }

  localStorage.setItem("usersList", JSON.stringify(usersList));
  event.target.reset();
}

// use this function to display user on screen
function display(data) {
  const ul = document.querySelector("ul");
  const li = document.createElement("li");
  li.id = data.id;
  li.textContent = `${data.expense} --- ${data.description} --- ${data.category}`;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteData(data.id, li));

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editData(data));

  li.appendChild(deleteBtn);
  li.appendChild(editBtn);
  ul.appendChild(li);
}

// use this function to add user details into local storage
function addData(usersList, userDetails) {
  userDetails.id = Date.now();
  usersList.push(userDetails);
  display(userDetails);
}

// use this function to delete the user details from local store and DOM (screen)
function deleteData(id, li) {
  const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
  const updatedUsersList = usersList.filter((user) => user.id != id);
  localStorage.setItem("usersList", JSON.stringify(updatedUsersList));
  li.remove();
}

// use this function to update user details from local storage
function editData(data) {
  document.querySelector("#expense").value = data.expense;
  document.querySelector("#description").value = data.description;
  document.querySelector("#category").value = data.category;
  sessionStorage.setItem("editId", data.id);
}

function updateDisplay(id, userDetails) {
  const li = document.getElementById(id);
  if (li) {
    li.firstChild.textContent = `${userDetails.expense} --- ${userDetails.description} --- ${userDetails.category}`;
  }
}

module.exports = handleFormSubmit;
