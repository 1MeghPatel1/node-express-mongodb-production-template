import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
// import { defaultMailSendQueue } from "../jobs/DefaultMailSend";
// import { forgotPasswordEmailQueue } from "../jobs/ForgotMailSend";
// import { sendPushNotificationQueue } from "../jobs/PushNotificationSend";
import  { VerificationMailSendQueue }  from '../jobs/VerificationMailSend';
//IMPORT QUEUES HERE
const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [
    // new BullMQAdapter(forgotPasswordEmailQueue),
    // new BullMQAdapter(defaultMailSendQueue),
    // new BullMQAdapter(sendPushNotificationQueue),
     new BullMQAdapter(VerificationMailSendQueue), 
//ADD ADAPTERS HERE
  ],
  serverAdapter: serverAdapter,
});

serverAdapter.setBasePath("/queues");

export default serverAdapter;
