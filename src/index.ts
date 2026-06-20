import { parseArgs } from "util";
import { Effect, Console, pipe, Data, Cause } from "effect"
import * as tui from "./tui"
import * as web from "./web"
import * as utils from "./utils"

class ParseArgsError extends Data.TaggedError("ParseArgsError")<{ message: string, error: Error }> { }
class UnexpectedError extends Data.TaggedError("UnexpectedError")<{ message: string }> { }

Effect.runPromise(mainEffect()).catch(console.error);

function mainEffect() {
    const parseArgsEffect = Effect.try({
        try: () => parseArgs({
            args: Bun.argv,
            options: {
                port: {
                    type: "string",
                },
            },
            strict: true,
            allowPositionals: true,
        }),
        catch: (error) => {
            // TODO : gotta handle these at the top boundary, cuz these are almost always fatal
            if (error instanceof Error)
                return new ParseArgsError({ message: error.message, error });
            return new UnexpectedError({ message: String(error) });
        }
    })

    const mainProgram = pipe(
        parseArgsEffect,
        Effect.flatMap(({ values, positionals }) => {
            const bunPath = positionals[0]
            const scriptPath = positionals[1]
            const maybeCommand = positionals[2]

            if (maybeCommand === undefined) {
                return tui.mainEffect()
            }

            if (maybeCommand === "web") {
                let port = 3000;

                // PORT
                const envPort = process.env.PORT;

                // --port
                const argPort = values.port;

                // PORT takes precedence over --port
                if (envPort !== undefined) {
                    const { ok, parsedInt } = utils.tryParseInt(envPort)
                    if (!ok) return Effect.fail(new Error(`web command: received PORT env variable but unable to parse ${envPort}!`));
                    port = parsedInt
                }
                else if (argPort !== undefined) {
                    const { ok, parsedInt } = utils.tryParseInt(argPort)
                    if (!ok) return Effect.fail(new Error(`web command: received --port arg but unable to parse ${argPort}!`))
                    port = parsedInt
                }

                return web.mainEffect(port);
            }

            return Console.log("TODO: help behavior")
        })
    )

    return mainProgram;
}

