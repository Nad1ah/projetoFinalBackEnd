const express = require("express");
const router = express.Router();
const services = require("./services");
const { auth } = require("../middleware");

router.get("/", async (req, res) => {
  const polls = await services.getAllPolls();
  res.status(200).json(polls);
});

router.delete("/:id", async (req, res) => {
  const pollId = req.params.id;

  const poll = await services.getPollById(pollId);
  if (!poll) {
    return res.status(404).json({ error: "poll not found" });
  }

  const deleted = await services.deletePollById(pollId);
  if (!deleted) {
    return res.status(500).json({ error: "failed to delete poll" });
  }

  res.status(200).json({ message: "poll deleted successfully" });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const poll = await services.getPollById(id);
  if (!poll) {
    return res.status(404).json({ error: "Poll not found" });
  }
  res.status(200).json(poll);
});

router.post("/", auth, async (req, res) => {
  const { question, options, expiresAt } = req.body;
  const newPoll = await services.createPoll({ question, options, expiresAt });
  if (!newPoll) {
    return res.status(500).json({ error: "Unexpected server error" });
  }
  res.status(201).json(newPoll);
});

router.post("/:id/vote", auth, async (req, res) => {
  const { id } = req.params;
  const { option } = req.body;
  const vote = await services.vote(id, option);
  if (!vote) {
    return res.status(404).json({ error: "Poll not found" });
  }
  res.status(200).json(vote);
});

module.exports = router;
