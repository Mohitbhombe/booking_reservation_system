import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Resource } from "../models/Resource";

export const createResource = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const resource = await Resource.create(req.body);
  res.status(201).json(resource);
};

export const getResources = async (_req: Request, res: Response): Promise<void> => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.status(200).json(resources);
};

export const updateResource = async (req: Request, res: Response): Promise<void> => {
  const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res.status(200).json(resource);
};

export const deleteResource = async (req: Request, res: Response): Promise<void> => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) {
    res.status(404).json({ message: "Resource not found" });
    return;
  }

  res.status(200).json({ message: "Resource deleted" });
};
