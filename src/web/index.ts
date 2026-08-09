import { Elysia } from "elysia";

// TODO : thinking... with the web having so many "quirks", it might be better to emulate browser behavior in TUI, than stripping down browser to TUI

// TODO : hoping to decouple to a point that its "backend agnostic", at least the frontend parts!

export async function mainAsync(port: number): Promise<Error[] | null> {
    const app = new Elysia()
        .onError(({ error }) => {
            console.error(error)
        })
        .get("/", () => "Hello Elysia")
        .get("/error", () => {
            throw new Error("forced elysia error");
        })
        .listen(port);

    console.log(
        `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
    );

    // server process now owns process exit and error logging
    return null;
}
