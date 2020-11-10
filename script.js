// Selectors
const notifDiv = document.getElementById('notification');
const form = document.getElementById('form');
const mic = document.getElementById('mic');
const addBtn = document.getElementById('addBtn');
const inputTxt = document.getElementById('inputTxt');
const todos = document.getElementById('todos');
const clrBtn = document.getElementById('clrBtn');
const clearTodoDiv = document.getElementById('clearTodo');

// Globals
let flag = false;
let editTxt;
let editId = '';

// Event Listeners
window.addEventListener('DOMContentLoaded', loaderfunc)
form.addEventListener('submit', (e) => {
    e.preventDefault();
});
addBtn.addEventListener('click', mainFunction);

clrBtn.addEventListener('click', clearTodos);



//Functions

function mainFunction(e) {
    const id = new Date().getTime().toString();
    let value = inputTxt.value;

    if (value && !flag) {
        addfunc(id, value);
        clearTodoDiv.classList.add('show');


        notification("Todo Added", "success");


        updateLS(id, value);
        setToDefault();

    }
    else if (value && flag) {
        editTxt.innerHTML = value;
        updateLS();
        setToDefault();
        notification("Todo Updated", "success");


    }
    else {
        notification("Type Something", "warning");
    }

};




//Utility Functions

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
    console.log("voice active");

    inputTxt.value = "Listening";
};
recognition.onresult = function (event) {
    inputTxt.value = "";
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;
    inputTxt.value = transcript;
}
mic.addEventListener('click', () => {
    recognition.start();
});


function notification(text, className) {

    const notificationAudio = new SpeechSynthesisUtterance();

    notifDiv.innerText = text;
    notifDiv.classList.add(className);

    notificationAudio.text = text;
    notificationAudio.pitch = 1;
    notificationAudio.rate = 1;
    notificationAudio.volume = 1;
    window.speechSynthesis.speak(notificationAudio)


    setTimeout(() => {
        notifDiv.classList.remove(className);
        notifDiv.innerText = "";

    }, 2000);
}

function setToDefault() {
    inputTxt.value = "";
    flag = false;
    editTxt;
    addBtn.innerText = 'Add';

}

function clearTodos() {
    const todoEl = document.querySelectorAll('p');

    todoEl.forEach((todo) => {
        const todos = todo.parentElement;
        // console.log(todos);
        todos.remove();
    });
    todos.classList.remove('show');

    clearTodoDiv.classList.remove('show');
    notification("Todo List Cleared", "warning");

    setToDefault();
    updateLS();

}

function deleteFunc(e) {
    const event = e.target.parentElement;
    event.remove();

    if (todos.children.length === 0) {
        clearTodoDiv.classList.remove('show');
    }

    notification("Todo Deleted", "warning");
    setToDefault();
    updateLS();

};

function checkedFunc(e) {
    const event = e.target;
    event.classList.toggle('checked');
    updateLS();
}

function editFunc(e) {
    let event = e.target.parentElement;
    editTxt = e.target.previousElementSibling.previousElementSibling;
    inputTxt.value = editTxt.innerHTML;

    editId = event.dataset.id;
    flag = true;
    addBtn.innerText = 'Update';

    updateLS();
}
function listenTodoAudio(e){
    const listenTodoText = new SpeechSynthesisUtterance();
    const event = e.target.previousElementSibling.innerText;
    
    listenTodoText.text = event;
    listenTodoText.pitch = 1;
    listenTodoText.rate = 1;
    listenTodoText.volume = 1;

    window.speechSynthesis.speak(listenTodoText);
    console.log(event);

}



// *********************************
//  Local Storage

function updateLS() {
    const todoEl = document.querySelectorAll('#todoEl');
    let todos = [];
    todoEl.forEach((todo) => {
        todos.push({
            id: todo.parentElement.dataset.id,
            value: todo.innerHTML,
            checked: todo.classList.contains('checked')
        });
        // console.log(todo.innerHTML);

    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loaderfunc() {
    const todos = JSON.parse(localStorage.getItem('todos'));
    todos.forEach((todo) => {
        addfunc(todo.id, todo.value, todo.checked)

    });
    if(todos.length>0){

        clearTodoDiv.classList.add('show');
    }
    
}


function addfunc(id, value, checked) {
    const article = document.createElement('article');
    const attr = document.createAttribute('data-id');
    attr.value = id;
    article.setAttributeNode(attr);

    article.innerHTML = `<p id="todoEl">${value}</p>
    <button id="listenTodo" ><img src="./icons/volume.svg" alt="mic"></button>
        <button id="editBtn"><img src="./icons/pencil.svg" alt="editBtn"></button>
        <button id="delBtn"><img src="./icons/trash.svg" alt="delBtn"></button>`;

    // Audio
    const listenTodo = article.querySelector('#listenTodo');
    listenTodo.addEventListener('click', listenTodoAudio);




    // Checked / Unchecked / delete / edit btn selector

    const todoEl = article.querySelector('#todoEl');

    if (checked) {
        todoEl.classList.add('checked');
    }
    todoEl.addEventListener('click', checkedFunc);

    const editBtn = article.querySelector('#editBtn');
    editBtn.addEventListener('click', editFunc);

    const delBtn = article.querySelector('#delBtn');
    delBtn.addEventListener('click', deleteFunc);


    // Append Child

    todos.appendChild(article);
    todos.classList.add('show');

}

