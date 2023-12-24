import Fastify from "fastify";
import PagePool from "./browser/pagepool";

const fastify = Fastify({ logger: true });

const { PAGE_COUNT = "5", PORT = "8000" } = process.env;

(async () => {
    console.log("connecting to puppeteer...");

    console.log("connected");

    console.log("initializing pages...");

    try {
        await new PagePool(parseInt(PAGE_COUNT, 10)).init();
    } catch (e) {
        console.log("Failed to initialize pages");
        console.error(e);
        process.exit(1);
    }

    console.log("ready");

    // Register only the API route as the home page
    fastify.register(require("./routers/api").default, { prefix: "/" });

    try {
        await fastify.listen({
            port: Number(PORT),
            host: "0.0.0.0",
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
})();
