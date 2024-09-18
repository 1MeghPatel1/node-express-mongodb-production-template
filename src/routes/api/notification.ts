import { Router } from "express";
import { NotificationController } from "../../app/http/controllers/api/Notification/NotificationController";
import { paginationCleaner } from "../../app/http/middleware/Pagination";

const router = Router();

router.get("/", paginationCleaner, NotificationController.index);

router.delete("/", NotificationController.deleteAll);

router.delete("/:id", NotificationController.delete);

export default router;
