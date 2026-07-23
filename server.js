const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const TASK_FILE = path.join(__dirname, "tasks.json");

app.use(express.static("public"));
app.use(express.json());

// Read tasks
function getTasks() {
    if (!fs.existsSync(TASK_FILE)) {
        fs.writeFileSync(TASK_FILE, "[]");
    }

    const data = fs.readFileSync(TASK_FILE);

    return JSON.parse(data);
}

// Save tasks
function saveTasks(tasks) {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 4));
}

// GET
app.get("/tasks", (req, res) => {

    res.json(getTasks());

});

// POST
app.post("/tasks", (req, res) => {

    const tasks = getTasks();

    const newTask = {

        id: Date.now(),

        text: req.body.text,

        completed: false

    };

    tasks.push(newTask);

    saveTasks(tasks);

    res.json(newTask);

});

// PUT
app.put("/tasks/:id", (req, res) => {

    const tasks = getTasks();

    const id = Number(req.params.id);

    tasks.forEach(task => {

        if (task.id === id) {

            task.completed = !task.completed;

        }

    });

    saveTasks(tasks);

    res.json({ success: true });

});

// DELETE
app.delete("/tasks/:id", (req, res) => {

    let tasks = getTasks();

    const id = Number(req.params.id);

    tasks = tasks.filter(task => task.id !== id);

    saveTasks(tasks);

    res.json({ success: true });

});

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});