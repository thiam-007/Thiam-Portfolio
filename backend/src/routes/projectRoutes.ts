import { Router } from "express";
import Project from "../models/Project";

const router = Router();

router.get("/", async (req, res) => {
  const projects = await Project.find({});
  res.json(projects);
});

router.post("/", async (req, res) => {
  const body = req.body;
  const created = await Project.create(body);
  res.status(201).json(created);
});

router.put('/:id', async (req, res) => {
  const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;