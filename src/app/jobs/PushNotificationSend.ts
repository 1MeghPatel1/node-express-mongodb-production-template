// import { Worker, Queue } from "bullmq";
// import { PushNotification } from "../../libs/push/push";
// import { queueConnection } from "../../utils/utils";
// import { logger } from "../providers/logger";

// export const sendPushNotificationQueue = new Queue(
//   "sendPushNotification",
//   queueConnection
// );

// const sendFCM = async (job: any) => {
//   console.log("send fcm");
//   const push = new PushNotification({ tokens: job.fcmTokens });
//   const response = await push.send(job.messagePayload);
//   logger.info(
//     `Push notification sent: ${response} with job params ${JSON.stringify(job)}`
//   );
// };

// new Worker("sendPushNotification", sendFCM, queueConnection);
