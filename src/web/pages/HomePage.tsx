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
                <div id="root" class="flex flex-col gap-2 p-4"></div>

                <template id="tpl-text">
                    <p class="min-h-[1.5rem] whitespace-pre"></p>
                </template>
                <template id="tpl-section">
                    <div class="flex flex-col gap-1" data-children></div>
                </template>
                <template id="tpl-list">
                    <div class="flex flex-col gap-1">
                        <h2 class="text-lg" data-title></h2>
                        <ul class="flex flex-col" data-items></ul>
                    </div>
                </template>
                <template id="tpl-list-item">
                    <li class="cursor-pointer px-1 rounded-sm"></li>
                </template>
                <template id="tpl-widget-input">
                    <label data-prefix></label>
                    <input
                        type="text"
                        data-input
                        class="border-1 border-stone-50/25 rounded-sm px-1"
                    />
                </template>
            </body>
        </html>
    );
}
