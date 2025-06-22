import express from "express";
import { supabase } from "../app/supabase.js";

const router = express.Router();

// **Signup Route**
router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, // Store additional user info
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ user: data.user });
});

// **Login Route**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ user: data.user, session: data.session });
});

// **Logout Route**
router.post("/logout", async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;
