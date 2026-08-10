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
    Component,
    StaticTextProps,
    InputProps,
    KeyDisplayProps,
    CountProps,
    ListProps,
} from "../../../shared";

const componentViews: Record<string, (props: unknown, model: Model) => Tree> = {
    "static-text": (props, model) =>
        staticText.view(props as StaticTextProps, model),
    input: (props, model) => input.view(props as InputProps, model),
    "key-display": (props, model) =>
        keyDisplay.view(props as KeyDisplayProps, model),
    "count-getter": (props, model) => countGetter.view(props as CountProps, model),
    "count-setter": (props, model) => countSetter.view(props as CountProps, model),
    list: (props, model) => list.view(props as ListProps, model),
};

const templateCache: Record<string, HTMLTemplateElement> = {};

function cloneTemplate(id: string): DocumentFragment {
    const template =
        (templateCache[id] ??= document.querySelector<HTMLTemplateElement>(
            `#${id}`,
        )!);
    return template.content.cloneNode(true) as DocumentFragment;
}

export function renderNode(node: Tree): DocumentFragment {
    switch (node.type) {
        case "text": {
            const frag = cloneTemplate("tpl-text");
            const el = frag.firstElementChild as HTMLElement;
            el.textContent = node.text;
            return frag;
        }
        case "section": {
            const frag = cloneTemplate("tpl-section");
            const container =
                frag.querySelector<HTMLElement>("[data-children]") ?? frag;
            for (const child of node.children) {
                container.appendChild(renderNode(child));
            }
            return frag;
        }
        case "list": {
            const frag = cloneTemplate("tpl-list");
            const title = frag.querySelector<HTMLElement>("[data-title]");
            if (title) title.textContent = node.title;
            const ul = frag.querySelector<HTMLElement>("[data-items]")!;
            node.options.forEach((option, index) => {
                const li = cloneTemplate("tpl-list-item")
                    .firstElementChild as HTMLElement;
                const isSelected = index === node.selectedIndex;
                li.className +=
                    " " +
                    (isSelected ? "text-stone-900 bg-stone-100" : "text-stone-50");
                li.setAttribute("data-index", String(index));
                li.textContent = `${isSelected ? ">" : " "} ${index + 1}) ${option}`;
                ul.appendChild(li);
            });
            return frag;
        }
        case "input":
            throw new Error("input nodes are rendered natively on web");
    }
}

function renderComponentInto(
    key: string,
    model: Model,
    containers: Map<string, HTMLElement>,
): void {
    if (key === "input") return;

    const container = containers.get(key);
    const view = componentViews[key];
    const field = modelFieldFor[key];
    if (!container || !view || !field) return;

    container.replaceChildren(renderNode(view(model[field], model)));
}

export function createApp(screen: Component<unknown>[]): {
    mount(root: HTMLElement): void;
    dispatch(msgs: Msg[]): void;
} {
    let model: Model = init();
    const containers = new Map<string, HTMLElement>();

    function mountInputComponent(): void {
        const container = containers.get("input");
        if (!container) return;

        const frag = cloneTemplate("tpl-component-input");
        const tree = input.view(model.input, model);
        const prefix = tree.type === "input" ? tree.prefix : "";
        const label = frag.querySelector<HTMLElement>("[data-prefix]");
        if (label) label.textContent = prefix.trim();
        container.appendChild(frag);
    }

    function mount(root: HTMLElement): void {
        for (const component of screen) {
            const container = document.createElement("div");
            container.setAttribute("data-component", component.key);
            root.appendChild(container);
            containers.set(component.key, container);
        }

        for (const component of screen) {
            if (component.key === "input") mountInputComponent();
            else renderComponentInto(component.key, model, containers);
        }
    }

    function dispatch(msgs: Msg[]): void {
        for (const msg of msgs) {
            const result = update(msg, model);
            model = result.model;

            for (const key of result.changed) {
                if (key === "input") continue;
                renderComponentInto(key, model, containers);
            }
        }
    }

    return { mount, dispatch };
}
