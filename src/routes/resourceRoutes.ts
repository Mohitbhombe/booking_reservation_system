import { Router } from "express";
import { body } from "express-validator";
import { createResource, deleteResource, getResources, updateResource } from "../controllers/resourceController";
import { authorize, protect } from "../middleware/auth";

const router = Router();

router.get("/", getResources);
router.post(
  "/",
  protect,
  authorize("admin"),
  [body("name").notEmpty(), body("pricePerHour").isFloat({ min: 0 })],
  createResource
);
router.put("/:id", protect, authorize("admin"), updateResource);
router.delete("/:id", protect, authorize("admin"), deleteResource);

export default router;
