import { Html } from "@elysia/html";

export function HomePage() {
    // fingerprinting static files cuz cloudflare proxy automatically caches static assets, this forces to miss cache and get the most updated static files
    let version = process.env.VERSION;

    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <link
                    href={`public/styles.css?v=${version}`}
                    rel="stylesheet"
                />
                <script type="module" src={`/public/index.js?v=${version}`}></script>
                <title>steph</title>
            </head>
            <body class="bg-stone-900 text-stone-50 font-fira">
                <section>
                    <p class="min-h-[1.5rem]"></p>
                    <h1>steph</h1>
                    <p class="min-h-[1.5rem]"></p>
                </section>

                <section>
                    <div class="flex gap-2">
                        <label for="room">Type:</label>
                        <span>
                            <input
                                type="text"
                                id="room"
                                class="border-1 border-stone-50/25 rounded-sm px-1 flex-grow"
                            />
                        </span>
                    </div>
                </section>

                <section>
                    <p data-key>Key:</p>
                    <p>Count: <span data-count>0</span> (this is using shared state)</p>
                    <p>Count: <span data-count>0</span> (press any key to increment)</p>
                </section>

                <section>
                    <h2>this is a list with options</h2>
                </section>
            </body>
        </html>
    );
}
