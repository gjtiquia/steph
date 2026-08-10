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
                <div id="root" class="flex flex-col gap-2 p-4">
                    <div data-widget="static-text"></div>
                    <div data-widget="input">
                        <label>Type:</label>
                        <input
                            type="text"
                            data-input
                            class="border-1 border-stone-50/25 rounded-sm px-1"
                        />
                    </div>
                    <div data-widget="key-display"></div>
                    <div data-widget="count-getter"></div>
                    <div data-widget="count-setter"></div>
                    <div data-widget="list"></div>
                </div>
            </body>
        </html>
    );
}
