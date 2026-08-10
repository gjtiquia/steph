import {
    init,
    update,
    staticText,
    input,
    keyDisplay,
    countGetter,
    countSetter,
    list,
    modelFieldFor,
} from "../../../shared";
import type {
    Msg,
    Model,
    Tree,
    StaticTextSlice,
    InputSlice,
    KeyDisplaySlice,
    CountSlice,
    ListSlice,
} from "../../../shared";

const widgetViews: Record<string, (slice: unknown, model: Model) => Tree> = {
    "static-text": (slice, model) =>
        staticText.view(slice as StaticTextSlice, model),
    input: (slice, model) => input.view(slice as InputSlice, model),
    "key-display": (slice, model) =>
        keyDisplay.view(slice as KeyDisplaySlice, model),
    "count-getter": (slice, model) => countGetter.view(slice as CountSlice, model),
    "count-setter": (slice, model) => countSetter.view(slice as CountSlice, model),
    list: (slice, model) => list.view(slice as ListSlice, model),
};

export function renderNode(node: Tree): HTMLElement {
    switch (node.type) {
        case "text": {
            const p = document.createElement("p");
            p.className = "min-h-[1.5rem] whitespace-pre";
            p.textContent = node.text;
            return p;
        }
        case "section": {
            const div = document.createElement("div");
            div.className = "flex flex-col gap-1";
            for (const child of node.children) {
                div.appendChild(renderNode(child));
            }
            return div;
        }
        case "list": {
            const container = document.createElement("div");
            container.className = "flex flex-col gap-1";

            const title = document.createElement("h2");
            title.className = "text-lg";
            title.textContent = node.title;
            container.appendChild(title);

            const ul = document.createElement("ul");
            ul.className = "flex flex-col";
            node.options.forEach((option, index) => {
                const li = document.createElement("li");
                const isSelected = index === node.selectedIndex;
                li.className =
                    "cursor-pointer px-1 rounded-sm " +
                    (isSelected ? "text-stone-900 bg-stone-100" : "text-stone-50");
                li.setAttribute("data-index", String(index));
                li.textContent = `${isSelected ? ">" : " "} ${index + 1}) ${option}`;
                ul.appendChild(li);
            });
            container.appendChild(ul);

            return container;
        }
        case "input":
            throw new Error("input nodes are rendered natively on web");
    }
}

function renderWidgetInto(container: HTMLElement, key: string, model: Model): void {
    if (key === "input") return;

    const view = widgetViews[key];
    const field = modelFieldFor[key];
    if (!view || !field) return;

    const slice = model[field];
    const tree = view(slice, model);
    container.replaceChildren(renderNode(tree));
}

export function createApp(): {
    mount(root: HTMLElement): void;
    dispatch(msgs: Msg[]): void;
} {
    let model: Model = init();

    function mount(_root: HTMLElement): void {
        for (const key of Object.keys(widgetViews)) {
            if (key === "input") continue;
            const container = document.querySelector(`[data-widget="${key}"]`);
            if (container) renderWidgetInto(container as HTMLElement, key, model);
        }
    }

    function dispatch(msgs: Msg[]): void {
        for (const msg of msgs) {
            const result = update(msg, model);
            model = result.model;

            for (const key of result.changed) {
                if (key === "input") continue;
                const container = document.querySelector(`[data-widget="${key}"]`);
                if (container) renderWidgetInto(container as HTMLElement, key, model);
            }
        }
    }

    return { mount, dispatch };
}
