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
    Widget,
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

const templateCache: Record<string, HTMLTemplateElement> = {};

function cloneTemplate(id: string): HTMLElement {
    const template =
        (templateCache[id] ??= document.querySelector<HTMLTemplateElement>(
            `#${id}`,
        )!);
    return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

export function renderNode(node: Tree): HTMLElement {
    switch (node.type) {
        case "text": {
            const el = cloneTemplate("tpl-text");
            el.textContent = node.text;
            return el;
        }
        case "section": {
            const el = cloneTemplate("tpl-section");
            const container =
                el.querySelector<HTMLElement>("[data-children]") ?? el;
            for (const child of node.children) {
                container.appendChild(renderNode(child));
            }
            return el;
        }
        case "list": {
            const el = cloneTemplate("tpl-list");
            el.querySelector("[data-title]")!.textContent = node.title;
            const ul = el.querySelector<HTMLElement>("[data-items]")!;
            node.options.forEach((option, index) => {
                const li = cloneTemplate("tpl-list-item");
                const isSelected = index === node.selectedIndex;
                li.className +=
                    " " +
                    (isSelected ? "text-stone-900 bg-stone-100" : "text-stone-50");
                li.setAttribute("data-index", String(index));
                li.textContent = `${isSelected ? ">" : " "} ${index + 1}) ${option}`;
                ul.appendChild(li);
            });
            return el;
        }
        case "input":
            throw new Error("input nodes are rendered natively on web");
    }
}

function renderWidgetInto(
    key: string,
    model: Model,
    containers: Map<string, HTMLElement>,
): void {
    if (key === "input") return;

    const container = containers.get(key);
    const view = widgetViews[key];
    const field = modelFieldFor[key];
    if (!container || !view || !field) return;

    container.replaceChildren(renderNode(view(model[field], model)));
}

export function createApp(screen: Widget<unknown>[]): {
    mount(root: HTMLElement): void;
    dispatch(msgs: Msg[]): void;
} {
    let model: Model = init();
    const containers = new Map<string, HTMLElement>();

    function mountInputWidget(): void {
        const container = containers.get("input");
        if (!container) return;

        const el = cloneTemplate("tpl-widget-input");
        const tree = input.view(model.input, model);
        const prefix = tree.type === "input" ? tree.prefix : "";
        const label = el.querySelector<HTMLElement>("[data-prefix]");
        if (label) label.textContent = prefix;
        container.appendChild(el);
    }

    function mount(root: HTMLElement): void {
        for (const widget of screen) {
            const container = document.createElement("div");
            container.setAttribute("data-widget", widget.key);
            root.appendChild(container);
            containers.set(widget.key, container);
        }

        for (const widget of screen) {
            if (widget.key === "input") mountInputWidget();
            else renderWidgetInto(widget.key, model, containers);
        }
    }

    function dispatch(msgs: Msg[]): void {
        for (const msg of msgs) {
            const result = update(msg, model);
            model = result.model;

            for (const key of result.changed) {
                if (key === "input") continue;
                renderWidgetInto(key, model, containers);
            }
        }
    }

    return { mount, dispatch };
}
