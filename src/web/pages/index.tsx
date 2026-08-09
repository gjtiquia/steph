import Elysia from "elysia";
import { html, Html } from "@elysia/html";
import { staticPlugin } from "@elysia/static";
import { HomePage } from "./HomePage";

const app = new Elysia()
    // HTML Plugin - allows JSX
    // https://elysiajs.com/plugins/html
    .use(html())

    // Static Plugin - serves static files in /public
    // https://elysiajs.com/plugins/static
    .use(
        staticPlugin({
            assets: "src/web/public",
        }),
    )

    .get("/", () => <HomePage />);

export default app;
