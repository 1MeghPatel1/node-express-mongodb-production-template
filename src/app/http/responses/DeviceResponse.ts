import { Device } from "@prisma/client";

export const DeviceResponse = (device: Device[] | Device) => {
  if (Array.isArray(device)) {
    return device.map((d) => objectResponse(d));
  }

  return objectResponse(device);
};

const objectResponse = (device: Device) => {
  return {
    fcmToken: device.fcmToken,
    device: device.device,
    metaData: device.metaData,
    createdAt: device.createdAt,
  };
};
