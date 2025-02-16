const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); 

// Anslut till MongoDB
mongoose.connect( "mongodb+srv://linea:uppgift1@uppgift1.gnz9t.mongodb.net/?retryWrites=true&w=majority&appName=uppgift1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Ansluten"))
  .catch(err => console.log("❌ DB Fel:", err));

// Skapa Schema & Modell
const responseSchema = new mongoose.Schema({ response: String });
const Response = mongoose.model("Response", responseSchema, "magig-8-ball.responses");

// 🚀 GET: Hämta alla svar
app.get("/responses", async (req, res) => {
    try {
        const responses = await Response.find();
        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: "Serverfel" });
    }
});

app.post("/responses", async (req, res) => {
    try {
        // Check if request contains "responses" array
        if (req.body.responses && Array.isArray(req.body.responses)) {
            const newResponses = req.body.responses.map(responseText => ({ response: responseText }));
            const savedResponses = await Response.insertMany(newResponses);
            res.status(201).json(savedResponses);
        } else {
            res.status(400).json({ error: "Fel format, skicka en 'responses' array." });
        }
    } catch (error) {
        res.status(500).json({ error: "Fel vid skapande av svar." });
    }
});

// Start the server
app.listen(port, () => {
  console.log(`Magic 8-Ball API is running at http://localhost:${port}`);
});

