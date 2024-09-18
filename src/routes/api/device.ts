import { Router } from "express";
import { DeviceController } from "../../app/http/controllers/api/Device/DeviceController";
import { RequestValidator } from "../../app/http/middleware/RequestValidator";
import { UpdateDeviceRequest } from "../../app/http/requests/UpdateDeviceRequest";

const router = Router();

router.get("/", DeviceController.list);

router.delete("/:id", DeviceController.delete);

router.patch(
  "/:id",
  RequestValidator(UpdateDeviceRequest),
  DeviceController.update
);

export default router;
