import web from "./application/web";
import logger from "./application/logger";
import "dotenv/config";

const HOST: string = process.env.APP_HOST || "localhost";
const PORT: number = 5000;

web.listen(PORT, HOST, () => {
  logger.info(`Server is running in host: ${HOST} and port: ${PORT}`);
});
