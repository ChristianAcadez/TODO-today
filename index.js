// Adding date on the title
function getDate(){
    const todaysDate = new Date();
    return todaysDate.toLocaleDateString("es-MX");
}
const titulo = document.getElementById("tittle");
titulo.textContent = `TO-DO hoy ${getDate()}`;

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask(){
    const input = document.getElementById("new-task");
    const taskText = input.value.trim();

    if (taskText === ""){
        return;
    }

    const task = {
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleDateString("es-MX")
    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTaskElement(task);
    input.value = "";
    input.focus();
}

function createTaskElement(task){
    const ul = document.getElementById("all-tasks");
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = task.text;

    let chk = document.createElement('input');
    chk.type = "checkbox";

    let del = document.createElement('button');
    del.type = "button";
    del.textContent = 'x';
    del.setAttribute("aria-label", "Eliminar tarea");

    if(task.completed){
        chk.checked = true;
        text.style.textDecoration = "line-through";
    }

    chk.addEventListener("change", function(){
        finishTask(task, chk, text);
    })

    del.addEventListener("click", function(){
        deleteTask(li, task);
    })

    li.appendChild(chk)
    li.appendChild(text);
    li.appendChild(del);

    ul.appendChild(li);
}

function deleteTask(li, task){
    const taskIndex = tasks.indexOf(task);
    if (taskIndex !== -1){
        tasks.splice(taskIndex, 1);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
    li.remove();
}

function finishTask(task, chk, text){
    task.completed = chk.checked;
    if(task.completed){
        text.style.textDecoration = "line-through";
    }else{
        text.style.textDecoration = "none";
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteOldTasks(){
    const today = getDate();
    tasks = tasks.filter(function(task){
        return task.createdAt === today;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearTasks(){
    tasks = [];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    const ul = document.getElementById("all-tasks");
    ul.innerHTML = "";
}

// load tasks
function loadTasks(){
    tasks.forEach(function(task){
        createTaskElement(task);
    });
}

deleteOldTasks();
loadTasks();

// event bindings (consistente en todos lados con addEventListener,
// en vez de mezclar con atributos onclick en el HTML)
document.getElementById("add-task").addEventListener("click", addTask);
document.getElementById("clear-tasks").addEventListener("click", clearTasks);
document.getElementById("new-task").addEventListener("keydown", function(e){
    if (e.key === "Enter"){
        addTask();
    }
});