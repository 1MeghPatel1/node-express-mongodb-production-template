import { Worker, Queue } from "bullmq";
import { queueConnection } from "../../utils/utils";
import { verificationMail } from "../mails/VerificationMail";

export const VerificationMailSendQueue = new Queue(
  "verificationMailSend",
  queueConnection
);
new Worker("verificationMailSend", verificationMail, queueConnection);
