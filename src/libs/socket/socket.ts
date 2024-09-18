import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";
import { env } from "../../env";

interface Events {
  basicEmit: (a: number, b: string, c: number[]) => void;
}

const IO = async () => {
  const url = env.redis.url;
  const redisClient = createClient({
    url: url,
  });

  await redisClient.connect();
  return new Emitter<Events>(redisClient);
};


/**
 *  connects to socket server adapter and emits data
 * @param namespace
 * @param event
 * @param data
 */
const broadcastTo = async (namespace: any, event: any, data: any) => {
  const io = await IO();
  const response = io.to(namespace).emit(event, data);
  console.log("response for socket >>>", response);
};

export class SocketEmitter {
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  public static async sendMessage(namespace: any, event: any, data: any) {
    return await broadcastTo(namespace, event, data);
  }
}
