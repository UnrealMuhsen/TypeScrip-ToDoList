interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

const btnSubmit = document.querySelector(".todo-btn") as HTMLButtonElement;
const inputTodo = document.querySelector(".todo-input") as HTMLInputElement;
const formtodo = document.querySelector(".todo-form") as HTMLFormElement;
const todoList = document.querySelector(".todo-list") as HTMLUListElement;
const btnDeleteAll = document.querySelector(
  ".todo-delete-all"
) as HTMLButtonElement;

const todos: Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");

window.addEventListener("DOMContentLoaded", () => {
  todos.forEach((todo) => appendTodo(todo));
});

const handlesubmit = (e: Event) => {
  e.preventDefault();

  const newTodo: Todo = {
    id: Date.now(),
    todo: inputTodo.value,
    completed: false,
  };

  todos.push(newTodo);
  appendTodo(newTodo);
  savetodos();
  inputTodo.value = "";
};

const appendTodo = (todo: Todo) => {
  const newLi = document.createElement("li");
  newLi.dataset.id = todo.id.toString();

  const span = document.createElement("span");
  span.textContent = todo.todo;

  const checkB = document.createElement("input");
  checkB.type = "checkbox";
  checkB.checked = todo.completed;

  // زرار Edit
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";

  // زرار Remove
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.className = "remove-btn";

  // لو التودو مكتمل ضيف كلاس completed
  if (todo.completed) {
    newLi.classList.add("completed");
  }

  // ✅ checkbox toggle
  checkB.addEventListener("change", () => {
    todo.completed = checkB.checked;
    newLi.classList.toggle("completed");
    savetodos();
  });

  // 🗑️ remove button
  removeBtn.addEventListener("click", () => {
    const index = todos.findIndex((t) => t.id === todo.id);
    if (index !== -1) {
      todos.splice(index, 1);
      savetodos();
      newLi.remove();
    }
  });

  // ✏️ edit button
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
