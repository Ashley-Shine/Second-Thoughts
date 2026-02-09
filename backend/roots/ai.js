import express from "express";
import { getResponse } from "../services/regretLogic.js";

const router = express.Router();

let dependency = 0;

router.post("/", async (req, res) => {
  dependency++;
  const result = await getResponse(req.body.prompt, dependency);
  res.json({ ...result, dependency });
});

export default router;
