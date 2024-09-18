import { CronJob } from "cron";
import { CronEnums } from "../../utils/types";
import { helloWorld } from "../commands/helloWorld";
//IMPORT CRON HERE
export class cron {
  public static async setup(): Promise<void> {
    new CronJob(CronEnums.EVERY_MINUTE, helloWorld).start();
    //ADD CRON JOBS HERE
  }
}
