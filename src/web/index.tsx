import { html, Html } from "@elysia/html";
import { Elysia } from "elysia";
import pages from "./pages";

// TODO : thinking... with the web having so many "quirks", it might be better to emulate browser behavior in TUI, than stripping down browser to TUI

export async function mainAsync(port: number): Promise<Error[] | null> {
    if (!process.env.VERSION)
        process.env.VERSION = await Bun.$`git rev-parse --short HEAD`.text(); // use git commit as version

    console.log(`🦊 VERSION`, process.env.VERSION);

    const app = new Elysia()
        .onError(({ error, path }) => {
            // temporarily ignored to reduce noise
            if (path.includes("favicon")) return;

            console.error(path);
            console.error(error);
        })
        .use(pages)
        .listen(port);

    console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );

    // server process now owns process exit and error logging
    return null;
}
