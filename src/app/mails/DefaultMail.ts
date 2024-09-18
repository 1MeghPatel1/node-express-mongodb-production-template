// import { env } from "../../env";
// import transporter from "../../libs/mail/mail";

// export const sendWithDefaultTemplateEmail = async (job: any): Promise<void> => {
//   const { title, body, email } = job.data;
//   try {
//     const options = {
//       from: env.mail.from_address,
//       to: email,
//       subject: title,
//       template: "default",
//       context: {
//         body: body,
//       },
//     };

//     await transporter.sendMail(options);
//     return Promise.resolve();
//   } catch (error: any) {
//     Promise.reject(error.message);
//   }
// };
