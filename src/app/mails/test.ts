import { env } from "../../env";
import transporter from "../../libs/mail/mail";

export const test = async (job: any): Promise<void> => {
  const { subject, email, url } = job.data;
  try {
    const options = {
      from: env.mail.from_address,
      to: email,
      subject: subject,
      template: "test",
      context: {
        link: url,
      },
    };

    await transporter.sendMail(options);
    return Promise.resolve();
  } catch (error: any) {
    Promise.reject(error.message);
  }
};
