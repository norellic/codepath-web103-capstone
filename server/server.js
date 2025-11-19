// server/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import { pool as db } from "./config/database.js";
import { initDb } from "./db/init.js";
import storeRoutes from "./routes/storeRoutes.js";
import "dotenv/config";


const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// ===== TAGS CRUD =====

// GET all tags
app.get("/api/tags", async (req, res) => {
  const result = await db.query("SELECT * FROM tags ORDER BY name ASC");
  res.json(result.rows);
});

// GET tags for a habit id
app.get("/api/tags/:id", async (req, res) => { 
  const { id } = req.params;
  const result = await db.query(`
  SELECT tags.id, tags.name 
  FROM tags 
  JOIN habit_tags ON tags.id = habit_tags.tag_id
  WHERE habit_id = $1`, [id]);
  res.json(result.rows)
});

// GET all habits for a tag id
app.get("/api/habits/by-tag/:tagName", async (req, res) => {
  const { tagName } = req.params;

  try {
    const result = await db.query(
      `
      SELECT h.*
      FROM habits h
      JOIN habit_tags ht ON h.id = ht.habit_id
      JOIN tags t ON t.id = ht.tag_id
      WHERE t.name = $1
      ORDER BY h.id DESC
      `,
      [tagName]
    );

    res.json(result.rows); // array
  } catch (err) {
    console.error("Error fetching habits by tag:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE tag
app.put("/api/tags/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Tag name cannot be empty" });
  }

  try {
    const result = await db.query(
      "UPDATE tags SET name = $1 WHERE id = $2 RETURNING *",
      [name.trim(), id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    return res.json(result.rows[0]);

  } catch (err) {
    console.error("Error updating tag:", err);
    if (err.code === "23505") {
      return res.status(409).json({ error: "Tag name already exists" });
    }
    return res.status(500).json({ error: "Database error" });
  }
});

// DELETE tag
app.delete("/api/tags/:id", async (req, res) => {
  const { id } = req.params;
  console.log("DELETE /api/tags/", id);

  try {
    const result = await db.query("DELETE FROM tags WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Tag not found" });
    }

    return res.status(200).json({ success: true, deletedId: parseInt(id) });

  } catch (err) {
    console.error("Error deleting tag:", err);
    return res.status(500).json({ error: "Failed to delete tag" });
  }
});

// ===== HABITS CRUD =====

// GET all habits
app.get("/api/habits", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, user_id, title, description FROM habits ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

// CREATE habit + habit's tags
app.post("/api/habits", async (req, res) => {
  const { title, description, user_id, tags } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const effectiveUserId = user_id ?? 1; // demo user id

  try {
    // 1. create habit
    const habitResult = await db.query(
      `INSERT INTO habits (user_id, title, description)
       VALUES ($1, $2, $3)
       RETURNING id, user_id, title, description`,
      [effectiveUserId, title.trim(), description || null]
    );

    const habit = habitResult.rows[0];

    // 2. If no tags, return early
    if (!tags || tags.length === 0) {
      return res.status(201).json(habit);
    }

    // 3. Insert tags (create if not exists)
    const tagIds = [];

    for (const tagName of tags) {
      const tagResult = await db.query(
        `INSERT INTO tags (name)
         VALUES ($1)
         ON CONFLICT (name)
         DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [tagName]
      );
      tagIds.push(tagResult.rows[0].id);
    }

    // 4. Insert habit_tags relational entries
    for (const tagId of tagIds) {
      await db.query(
        `INSERT INTO habit_tags (habit_id, tag_id)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [habit.id, tagId]
      );
    }

    // 5. Return habit with tags
    return res.status(201).json({
      ...habit,
      tags: tagIds,
    });

  } catch (err) {
    console.error("Error creating habit:", err);
    return res.status(500).json({ error: err.message });
  }
});


// GET single habit by id
app.get("/api/habits/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, user_id, title, description FROM habits WHERE id = $1",
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

// UPDATE habit
app.put("/api/habits/:id", async (req, res) => {
  const { title, description, tags } = req.body;
  const { id } = req.params;

  try {
    // update habit
    await db.query(
      "UPDATE habits SET title=$1, description=$2 WHERE id=$3",
      [title, description, id]
    );

    // delete old tags
    await db.query("DELETE FROM habit_tags WHERE habit_id=$1", [id]);

    // insert new tags
    for (let tagName of tags) {
      // insert tag if not exists
      const tagRes = await db.query(
        "INSERT INTO tags(name) VALUES($1) ON CONFLICT (name) DO UPDATE SET name=EXCLUDED.name RETURNING id",
        [tagName]
      );
      const tagId = tagRes.rows[0].id;
      await db.query(
        "INSERT INTO habit_tags(habit_id, tag_id) VALUES($1, $2) ON CONFLICT DO NOTHING",
        [id, tagId]
      );
    }

    res.json({ id, title, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
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

    return res.status(204).end();
  } catch (err) {
    console.error("Error deleting habit:", err);
    return res.status(500).json({ error: "Failed to delete habit" });
  }
});

// ===== TIMER COMPLETE -> POINTS =====

app.post("/api/habits/:id/complete", async (req, res) => {
  const habitId = req.params.id;
  const { minutes } = req.body;

  const userId = 1; // demo user

  console.log("complete called for habit", habitId, "minutes:", minutes);

  try {
    const pointsEarned = Number(minutes) || 0;
    if (pointsEarned <= 0) {
      return res
        .status(400)
        .json({ error: "Timer minutes must be a positive number." });
    }

    // habit must exist
    const habitResult = await db.query(
      "SELECT id FROM habits WHERE id = $1",
      [habitId]
    );
    if (habitResult.rows.length === 0) {
      console.log("Habit not found for id:", habitId);
      return res.status(404).json({ error: "Habit not found" });
    }

    // update user points
    const userResult = await db.query(
      "UPDATE users SET points = COALESCE(points, 0) + $1 WHERE id = $2 RETURNING points",
      [pointsEarned, userId]
    );

    if (userResult.rows.length === 0) {
      console.log("User not found for id:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    const totalPoints = userResult.rows[0].points;

    return res.json({ pointsEarned, totalPoints });
  } catch (err) {
    console.error("Error completing habit:", err);
    return res.status(500).json({ error: "Failed to complete habit" });
  }
});

// ===== STICKER STORE ROUTES =====
app.use("/api", storeRoutes);

// ===== START SERVER AFTER DB INIT =====

async function start() {
  try {
    await initDb(); // ensures tables + demo user
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Fatal startup error:", err);
    process.exit(1);
  }
}

start();
