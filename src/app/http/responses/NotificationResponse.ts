import { Notification } from "@prisma/client";

export const NotificationResponse = (
  notification: Notification[] | Notification
) => {
  if (Array.isArray(notification)) {
    return notification.map((d) => objectResponse(d));
  }

  return objectResponse(notification);
};

const objectResponse = (notification: Notification) => {
  return {
    title: notification.title,
    body: notification.body,
    type: notification.type,
    readAt: notification.readAt,
    createdAt: notification.createdAt,
  };
};
