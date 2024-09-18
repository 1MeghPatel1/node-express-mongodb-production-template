import { env } from "../../env";
import transporter from "../../libs/mail/mail";

export const verificationMail = async (job: any): Promise<void> => {
  const { subject, email, url, name } = job.data;
  try {
    const options = {
      from: env.mail.from_address,
      to: email,
      subject: subject,
      template: "verificationMail",
      context: {
        link: url,
        name: name
      },
    };

    await transporter.sendMail(options);
    return Promise.resolve();
  } catch (error: any) {
    Promise.reject(error.message);
  }
};
