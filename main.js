"use strict";
const btnSubmit = document.querySelector(".todo-btn");
const inputTodo = document.querySelector(".todo-input");
const formtodo = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const btnDeleteAll = document.querySelector(".todo-delete-all");
const todos = JSON.parse(localStorage.getItem("todos") || "[]");
window.addEventListener("DOMContentLoaded", () => {
  todos.forEach((todo) => appendTodo(todo));
});
const handlesubmit = (e) => {
  e.preventDefault();
  const newTodo = {
    id: Date.now(),
    todo: inputTodo.value,
    completed: false,
  };
  todos.push(newTodo);
  appendTodo(newTodo);
  savetodos();
  inputTodo.value = "";
};
const appendTodo = (todo) => {
  const newLi = document.createElement("li");
  newLi.dataset.id = todo.id.toString();
  const span = document.createElement("span");
  span.textContent = todo.todo;
  const checkB = document.createElement("input");
  checkB.type = "checkbox";
  checkB.checked = todo.completed;
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "remove-btn";
  if (todo.completed) {
    newLi.classList.add("completed");
  }
  checkB.addEventListener("change", () => {
    todo.completed = checkB.checked;
    newLi.classList.toggle("completed");
    savetodos();
  });
  removeBtn.addEventListener("click", () => {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
      savetodos();
      newLi.remove();
    }
  });
  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit your todo:", todo.todo);
    if (newText !== null && newText.trim() !== "") {
      todo.todo = newText.trim();
      span.textContent = todo.todo;
      savetodos();
    }
  });
  newLi.append(checkB, span, editBtn, removeBtn);
  todoList.prepend(newLi);
};
const savetodos = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};
const clearTodos = () => {
  todos.length = 0;
  savetodos();
  todoList.innerHTML = "";
};
formtodo.addEventListener("submit", handlesubmit);
btnDeleteAll.addEventListener("click", clearTodos);
