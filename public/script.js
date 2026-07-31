fetch("/visit", {
    method: "POST"
});

async function loadTasks() {

    const response = await fetch("/tasks");

    const tasks = await response.json();

    const list = document.getElementById("taskList");

    list.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `

        <span class="${task.completed ? "completed" : ""}">

        ${task.text}

        </span>

        <div class="actions">

        <button onclick="toggleTask('${task._id}')">

        ✔

        </button>

        <button onclick="deleteTask('${task._id}')">

        🗑

        </button>

        </div>

        `;

        list.appendChild(li);

    });

}

async function addTask() {

    const input = document.getElementById("taskInput");

    if (input.value.trim() === "") return;

    await fetch("/tasks", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            text: input.value

        })

    });

    input.value = "";

    loadTasks();

}

async function toggleTask(id) {

    await fetch("/tasks/" + id, {

        method: "PUT"

    });

    loadTasks();

}

async function deleteTask(id) {

    await fetch("/tasks/" + id, {

        method: "DELETE"

    });

    loadTasks();

}

loadTasks();