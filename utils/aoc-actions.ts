require("dotenv").config(); //Get SESSION_COOKIE from .env
import https from "https";

export const downloadInputForYearAndDay = (day: string, year: string) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "adventofcode.com",
      path: `/${year}/day/${day}/input`,
      method: "GET",
      port: "443",
      headers: {
        Cookie: `session=${process.env.SESSION_COOKIE}`,
      },
    };
    let data = "";
    https.get(options, (res: any) => {
      res.on("data", (dataChunk: any) => {
        data += dataChunk;
      });
      res.on("error", (err: Error) => {
        reject(err);
      });
      res.on("close", (done: any) => resolve(data));
    });
  });
};
