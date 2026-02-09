import express from "express";
import { getResponse } from "../services/regretLogic.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Prompt required" });
  }

  const result = await getResponse(prompt);
  res.json(result);
});

export default router;
