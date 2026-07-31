require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const UAParser = require("ua-parser-js");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const Task = require("./models/Task");
const Visit = require("./models/Visit");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    family: 4
})
.then(() => {

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {

        console.log(`🚀 Server running on port ${PORT}`);

    });

})
.catch(err => {

    console.error("❌ MongoDB Connection Failed");
    console.error(err);

});

// ---------------- TASK ROUTES ---------------- //

// Get all tasks
app.get("/tasks", async (req, res) => {

    try {

        const tasks = await Task.find();

        res.json(tasks);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// Add task
app.post("/tasks", async (req, res) => {

    try {

        const task = await Task.create({

            text: req.body.text,

            completed: false

        });

        res.status(201).json(task);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// Toggle task completion
app.put("/tasks/:id", async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {

            return res.status(404).json({

                message: "Task not found"

            });

        }

        task.completed = !task.completed;

        await task.save();

        res.json(task);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// Delete task
app.delete("/tasks/:id", async (req, res) => {

    try {

        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) {

            return res.status(404).json({

                message: "Task not found"

            });

        }

        res.json({

            success: true,

            message: "Task deleted"

        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// ---------------- VISITOR LOGGING ---------------- //

// POST /visit
app.post("/visit", async (req, res) => {

    try {

        const parser = new UAParser(req.headers["user-agent"]);

        const visit = await Visit.create({

            browser: parser.getBrowser().name || "Unknown",

            os: parser.getOS().name || "Unknown",

            device: parser.getDevice().type || "Desktop",

            ip: req.ip,

            timestamp: new Date()

        });

        res.status(201).json(visit);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// GET /visit/report
app.get("/visit/report", async (req, res) => {

    try {

        const totalVisits = await Visit.countDocuments();

        const lastFive = await Visit.find()
            .sort({ timestamp: -1 })
            .limit(5);

        res.json({

            totalVisits,

            lastFive

        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});