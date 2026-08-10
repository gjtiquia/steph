// src/shared/init.ts
function init() {
  return {
    staticText: {},
    input: { value: "", cursor: 0, showCursor: false },
    keyDisplay: { lastKey: "waiting input..." },
    list: { selectedIndex: 0 },
    count: { count: 0 }
  };
}
// src/shared/components/staticText.ts
var staticText = {
  key: "static-text",
  init: () => ({}),
  update: (_msg, props, _model) => ({ props, changed: false }),
  view: (_props, _model) => ({
    type: "section",
    children: [
      { type: "text", text: "" },
      { type: "text", text: "steph" },
      { type: "text", text: "" }
    ]
  })
};

// src/shared/components/input.ts
var input = {
  key: "input",
  init: () => ({ value: "", cursor: 0, showCursor: false }),
  update: (msg, props, _model) => {
    if (msg.type === "Keypress") {
      const isEditing = msg.text !== undefined && msg.text.length > 0 || msg.name === "backspace" || msg.name === "left" || msg.name === "right";
      const showCursor = isEditing;
      if (showCursor === props.showCursor)
        return { props, changed: false };
      return { props: { ...props, showCursor }, changed: true };
    }
    if (msg.type === "ValueChanged") {
      return {
        props: { value: msg.value, cursor: msg.cursor, showCursor: true },
        changed: true
      };
    }
    return { props, changed: false };
  },
  view: (props, _model) => ({
    type: "input",
    prefix: "Type: ",
    value: props.value,
    cursor: props.cursor,
    showCursor: props.showCursor
  })
};

// src/shared/components/keyDisplay.ts
var keyDisplay = {
  key: "key-display",
  init: () => ({ lastKey: "waiting input..." }),
  update: (msg, props, _model) => {
    if (msg.type !== "Keypress")
      return { props, changed: false };
    let lastKey;
    if (msg.name === "backspace")
      lastKey = "Special: Backspace";
    else if (msg.name === "left")
      lastKey = "Special: Left";
    else if (msg.name === "right")
      lastKey = "Special: Right";
    else if (msg.text !== undefined && msg.text.length > 0)
      lastKey = "Text: " + msg.text;
    else
      lastKey = "Key: " + msg.name;
    if (lastKey === props.lastKey)
      return { props, changed: false };
    return { props: { lastKey }, changed: true };
  },
  view: (props, _model) => ({ type: "text", text: props.lastKey })
};

// src/shared/components/count.ts
var countGetter = {
  key: "count-getter",
  init: () => ({ count: 0 }),
  update: (_msg, props, _model) => ({ props, changed: false }),
  view: (props, _model) => ({
    type: "text",
    text: "count: " + props.count + " (this is using shared state)"
  })
};
var countSetter = {
  key: "count-setter",
  init: () => ({ count: 0 }),
  update: (msg, props, _model) => {
    if (msg.type !== "Keypress")
      return { props, changed: false };
    return { props: { count: props.count + 1 }, changed: true };
  },
  view: (props, _model) => ({
    type: "text",
    text: "count: " + props.count + " (press any key to increment)"
  })
};

// src/shared/components/list.ts
var TITLE = "this is a list with options";
var OPTIONS = ["option 1", "option 2", "option 3"];
var list = {
  key: "list",
  init: () => ({ selectedIndex: 0 }),
  update: (msg, props, _model) => {
    if (msg.type === "Select") {
      const selectedIndex = Math.max(0, Math.min(OPTIONS.length - 1, msg.index));
      if (selectedIndex === props.selectedIndex)
        return { props, changed: false };
      return { props: { selectedIndex }, changed: true };
    }
    if (msg.type !== "Keypress")
      return { props, changed: false };
    const isUp = msg.name === "up" || msg.text === "k";
    const isDown = msg.name === "down" || msg.text === "j";
    if (isUp) {
      const selectedIndex = Math.max(0, props.selectedIndex - 1);
      if (selectedIndex === props.selectedIndex)
        return { props, changed: false };
      return { props: { selectedIndex }, changed: true };
    }
    if (isDown) {
      const selectedIndex = Math.min(OPTIONS.length - 1, props.selectedIndex + 1);
      if (selectedIndex === props.selectedIndex)
        return { props, changed: false };
      return { props: { selectedIndex }, changed: true };
    }
    return { props, changed: false };
  },
  view: (props, _model) => ({
    type: "list",
    title: TITLE,
    options: OPTIONS,
    selectedIndex: props.selectedIndex
  })
};

// src/shared/components/index.ts
var homeScreen = [
  staticText,
  input,
  keyDisplay,
  countGetter,
  countSetter,
  list
];

// src/shared/fields.ts
var modelFieldFor = {
  "static-text": "staticText",
  input: "input",
  "key-display": "keyDisplay",
  "count-getter": "count",
  "count-setter": "count",
  list: "list"
};
var fieldKeysFor = {
  staticText: ["static-text"],
  input: ["input"],
  keyDisplay: ["key-display"],
  count: ["count-getter", "count-setter"],
  list: ["list"]
};

// src/shared/update.ts
function composeUpdate(msg, model, components) {
  let next = model;
  const changed = new Set;
  for (const component of components) {
    const field = modelFieldFor[component.key];
    if (!field)
      continue;
    const result = component.update(msg, next[field], next);
    if (!result.changed)
      continue;
    for (const key of fieldKeysFor[field] ?? []) {
      changed.add(key);
    }
    next = { ...next, [field]: result.props };
  }
  return { model: next, changed };
}
function update(msg, model) {
  return composeUpdate(msg, model, homeScreen);
}
// src/web/pages/scripts/fromDom.ts
var KEY_MAP = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "return",
  " ": "space",
  Backspace: "backspace",
  Tab: "tab",
  Escape: "escape"
};
function fromKeydown(e) {
  if (e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Meta") {
    return [];
  }
  const name = KEY_MAP[e.key] ?? e.key;
  const text = name === "space" ? " " : name.length === 1 ? name : undefined;
  return [{ type: "Keypress", name, text }];
}
function fromClick(e) {
  if (!(e.target instanceof Element))
    return [];
  const el = e.target.closest("[data-index]");
  if (!el)
    return [];
  const indexAttr = el.getAttribute("data-index");
  if (indexAttr === null)
    return [];
  const index = Number(indexAttr);
  return [{ type: "Select", index }];
}

// src/web/pages/scripts/patch.ts
var componentViews = {
  "static-text": (props, model) => staticText.view(props, model),
  input: (props, model) => input.view(props, model),
  "key-display": (props, model) => keyDisplay.view(props, model),
  "count-getter": (props, model) => countGetter.view(props, model),
  "count-setter": (props, model) => countSetter.view(props, model),
  list: (props, model) => list.view(props, model)
};
var templateCache = {};
function cloneTemplate(id) {
  const template = templateCache[id] ??= document.querySelector(`#${id}`);
  return template.content.cloneNode(true);
}
function renderNode(node) {
  switch (node.type) {
    case "text": {
      const frag = cloneTemplate("tpl-text");
      const el = frag.firstElementChild;
      el.textContent = node.text;
      return frag;
    }
    case "section": {
      const frag = cloneTemplate("tpl-section");
      const container = frag.querySelector("[data-children]") ?? frag;
      for (const child of node.children) {
        container.appendChild(renderNode(child));
      }
      return frag;
    }
    case "list": {
      const frag = cloneTemplate("tpl-list");
      const title = frag.querySelector("[data-title]");
      if (title)
        title.textContent = node.title;
      const ul = frag.querySelector("[data-items]");
      node.options.forEach((option, index) => {
        const li = cloneTemplate("tpl-list-item").firstElementChild;
        const isSelected = index === node.selectedIndex;
        li.className += " " + (isSelected ? "text-stone-900 bg-stone-100" : "text-stone-50");
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
function renderComponentInto(key, model, containers) {
  if (key === "input")
    return;
  const container = containers.get(key);
  const view = componentViews[key];
  const field = modelFieldFor[key];
  if (!container || !view || !field)
    return;
  container.replaceChildren(renderNode(view(model[field], model)));
}
function createApp(screen) {
  let model = init();
  const containers = new Map;
  function mountInputComponent() {
    const container = containers.get("input");
    if (!container)
      return;
    const frag = cloneTemplate("tpl-component-input");
    const tree = input.view(model.input, model);
    const prefix = tree.type === "input" ? tree.prefix : "";
    const label = frag.querySelector("[data-prefix]");
    if (label)
      label.textContent = prefix.trim();
    container.appendChild(frag);
  }
  function mount(root) {
    for (const component of screen) {
      const container = document.createElement("div");
      container.setAttribute("data-component", component.key);
      root.appendChild(container);
      containers.set(component.key, container);
    }
    for (const component of screen) {
      if (component.key === "input")
        mountInputComponent();
      else
        renderComponentInto(component.key, model, containers);
    }
  }
  function dispatch(msgs) {
    for (const msg of msgs) {
      const result = update(msg, model);
      model = result.model;
      for (const key of result.changed) {
        if (key === "input")
          continue;
        renderComponentInto(key, model, containers);
      }
    }
  }
  return { mount, dispatch };
}

// src/web/pages/scripts/index.ts
var app = createApp(homeScreen);
app.mount(document.getElementById("root"));
document.addEventListener("keydown", (e) => app.dispatch(fromKeydown(e)));
document.addEventListener("click", (e) => app.dispatch(fromClick(e)));
var input2 = document.querySelector("[data-input]");
if (input2) {
  input2.addEventListener("input", () => app.dispatch([
    { type: "ValueChanged", value: input2.value, cursor: input2.selectionStart ?? 0 }
  ]));
  input2.addEventListener("select", () => app.dispatch([
    { type: "ValueChanged", value: input2.value, cursor: input2.selectionStart ?? 0 }
  ]));
}
