const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://Subha-admin:8HwDCsK4EktIdnIa@cluster0.xhhtsqg.mongodb.net/medicineDB");

// Define schema for the data to be stored in MongoDB
const scheduleSchema = new mongoose.Schema({
  timeOfDay: String,
  alarmTime: String,
  medications: [String]
});

// Create a mongoose model based on the schema
const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

// Route to handle form submission
app.post("/schedule", async (req, res) => {
  try {
    // Extract data from the request body
    const { timeOfDay, alarmTime, medications } = req.body;
    
    // Create a new schedule instance
    const newSchedule = new ScheduleModel({
      timeOfDay,
      alarmTime,
      medications
    });

    // Save the schedule to the database
    await newSchedule.save();

    // Respond with the saved schedule
    res.status(201).json(newSchedule);
  } catch (error) {
    // Handle errors
    res.status(500).json(error);
  }
});


// Endpoint to retrieve data from MongoDB
app.get('/data', async (req, res) => {
  try {
    // Retrieve all schedules from the database
    const schedules = await ScheduleModel.find();
    res.json(schedules);
  } catch (error) {
    console.error('Error retrieving data from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




app.get("/api/latest-alarm", async (req, res) => {
  try {
    // Find the most recent schedule by sorting _id in descending order
    const latestSchedule = await ScheduleModel.findOne()
      .sort({ _id: -1 }) // Sort by _id descending to get the latest document
      .select("alarmTime -_id"); // Select only the alarmTime field, exclude _id

    if (!latestSchedule) {
      return res.status(404).json({ message: "No schedules found." });
    }

    res.json({ alarmTime: latestSchedule.alarmTime });
  } catch (error) {
    console.error("Error fetching latest alarm time:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});
app.get('/api/latest-alarm', (req, res) => {
  // Example response data
  const response = {
    alarmTime: "08:00 AM"
  };
  res.json(response); // Send JSON response
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
