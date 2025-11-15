import express from 'express'
import './config/dotenv.js'
import cors from 'cors'
import { pool as db } from "./config/database.js";

const app = express()

app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 3001

// HABITS CRUD

// GET all habits
app.get("/api/habits", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, user_id, title, description, created_at FROM habits ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// CREATE habit
app.post("/api/habits", async (req, res) => {
  const { title, description, user_id } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  // TEMP: fake logged in user
  const effectiveUserId = user_id ?? 1;

  try {
    const result = await db.query(
      `INSERT INTO habits (user_id, title, description, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, user_id, title, description, created_at`,
      [effectiveUserId, title.trim(), description || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating habit:", err);
    res.status(500).json({ error: "Failed to create habit" });
  }
});

// GET single habit
app.get("/api/habits/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, user_id, title, description, created_at FROM habits WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching habit:", err);
    res.status(500).json({ error: "Failed to fetch habit" });
  }
});

// DELETE habit
app.delete("/api/habits/:id", async (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/habits", id);

  try {
    const result = await db.query("DELETE FROM habits WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      console.log("No habit found to delete for id:", id);
      return res.status(404).json({ error: "Habit not found" });
    }

    return res.status(204).end(); // success, no content
  } catch (err) {
    console.error("Error deleting habit:", err);
    return res.status(500).json({ error: "Failed to delete habit" });
  }
});

// TIMER COMPLETE -> POINTS 

app.post("/api/habits/:id/complete", async (req, res) => {
  const habitId = req.params.id;
  const { minutes } = req.body;

  // TEMP: fake logged in user
  const userId = 1;

  try {
    const pointsEarned = Number(minutes) || 0;
    if (pointsEarned <= 0) {
      return res
        .status(400)
        .json({ error: "Timer minutes must be a positive number." });
    }

    // ensure habit exists 
    const habitResult = await db.query(
      "SELECT id FROM habits WHERE id = $1",
      [habitId]
    );
    if (habitResult.rows.length === 0) {
      return res.status(404).json({ error: "Habit not found" });
    }

    const userResult = await db.query(
      "UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points",
      [pointsEarned, userId]
    );

    const totalPoints = userResult.rows[0].points;

    res.json({ pointsEarned, totalPoints });
  } catch (err) {
    console.error("Error completing habit:", err);
    res.status(500).json({ error: "Failed to complete habit" });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})