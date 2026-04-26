let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

// Обновление часов каждую секунду
function updateClock() {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    document.getElementById('currentDate').innerText = now.toLocaleDateString('ru-RU', dateOptions);
    document.getElementById('currentTime').innerText = now.toLocaleTimeString('ru-RU');
}
setInterval(updateClock, 1000);
updateClock();

// Установка сегодняшней даты в инпут по умолчанию
// document.getElementById('taskDate').valueAsDate = new Date();

function addTask() {
    const text = document.getElementById('taskText').value;
    const time = document.getElementById('taskTime').value; // Теперь здесь будет ЧЧ:ММ:СС
    const date = document.getElementById('taskDate').value;
    const priority = document.getElementById('taskPriority').value;

    if (!text || !time) return alert("Введите дело и время!");

    // Если вдруг секунд нет (зависит от браузера), добавим их вручную
    const fullTime = time.split(':').length === 2 ? time + ':00' : time;

    const newTask = {
        id: Date.now(),
        text,
        time: fullTime,
        date: date || "",
        priority: parseInt(priority),
    };

    tasks.push(newTask);
    saveAndRender();
    resetForm();
}

// function toggleTask(id) {
//     tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
//     saveAndRender();
// }

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    render();
}

function resetForm() {
    document.getElementById('taskText').value = '';
    document.getElementById('taskTime').value = '';
    document.getElementById('taskDate').value = '';
}

function render() {
    [1, 2, 3, 4].forEach(p => document.getElementById(`list-${p}`).innerHTML = '');

    // Сортировка: сначала по дате, потом по времени
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
    });

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        li.style.flexDirection = "column";
        li.style.alignItems = "flex-start";

        // Красивое отображение даты, если она есть
        const dateDisplay = task.date ? `<span class="date-tag"> ${task.date}</span>` : "";
        const timeDisplay = task.time ? `<span class="time-tag"> ${task.time}</span>` : "";

        li.innerHTML = `
            <div style="width: 100%; display: flex; align-items: center; justify-content: space-between;">
                <div style="width: 80%; display: flex; align-items: center; justify-content: space-between; font-size: 18px;">
                    <input type="checkbox" ${task.done ? 'checked' : ''} onclick="toggleTask(${task.id})">
                    ${timeDisplay}
                    ${dateDisplay}
                    <span class="${task.done ? 'task-done' : ''}">${task.text}</span>
                </div>
                <button onclick="deleteTask(${task.id})" style="border:none; background:none; cursor:pointer;">❌</button>
            </div>
        `;
        document.getElementById(`list-${task.priority}`).appendChild(li);
    });
}

render();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}