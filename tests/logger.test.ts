import logger from "../src/application/logger";

describe("Logger", () => {
  it("should can test", () => {
    logger.info("Logger info");
    logger.error("Logger error");
  });
});
