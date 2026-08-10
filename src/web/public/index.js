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
// src/shared/widgets/staticText.ts
var staticText = {
  key: "static-text",
  init: () => ({}),
  update: (_msg, slice, _model) => ({ slice, changed: false }),
  view: (_slice, _model) => ({
    type: "section",
    children: [
      { type: "text", text: "" },
      { type: "text", text: "steph" },
      { type: "text", text: "" }
    ]
  })
};

// src/shared/widgets/input.ts
var input = {
  key: "input",
  init: () => ({ value: "", cursor: 0, showCursor: false }),
  update: (msg, slice, _model) => {
    if (msg.type === "Keypress") {
      const isEditing = msg.text !== undefined && msg.text.length > 0 || msg.name === "backspace" || msg.name === "left" || msg.name === "right";
      const showCursor = isEditing;
      if (showCursor === slice.showCursor)
        return { slice, changed: false };
      return { slice: { ...slice, showCursor }, changed: true };
    }
    if (msg.type === "ValueChanged") {
      return {
        slice: { value: msg.value, cursor: msg.cursor, showCursor: true },
        changed: true
      };
    }
    return { slice, changed: false };
  },
  view: (slice, _model) => ({
    type: "input",
    prefix: "Type: ",
    value: slice.value,
    cursor: slice.cursor,
    showCursor: slice.showCursor
  })
};

// src/shared/widgets/keyDisplay.ts
var keyDisplay = {
  key: "key-display",
  init: () => ({ lastKey: "waiting input..." }),
  update: (msg, slice, _model) => {
    if (msg.type !== "Keypress")
      return { slice, changed: false };
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
    if (lastKey === slice.lastKey)
      return { slice, changed: false };
    return { slice: { lastKey }, changed: true };
  },
  view: (slice, _model) => ({ type: "text", text: slice.lastKey })
};

// src/shared/widgets/count.ts
var countGetter = {
  key: "count-getter",
  init: () => ({ count: 0 }),
  update: (_msg, slice, _model) => ({ slice, changed: false }),
  view: (slice, _model) => ({
    type: "text",
    text: "count: " + slice.count + " (this is using shared state)"
  })
};
var countSetter = {
  key: "count-setter",
  init: () => ({ count: 0 }),
  update: (msg, slice, _model) => {
    if (msg.type !== "Keypress")
      return { slice, changed: false };
    return { slice: { count: slice.count + 1 }, changed: true };
  },
  view: (slice, _model) => ({
    type: "text",
    text: "count: " + slice.count + " (press any key to increment)"
  })
};

// src/shared/widgets/list.ts
var TITLE = "this is a list with options";
var OPTIONS = ["option 1", "option 2", "option 3"];
var list = {
  key: "list",
  init: () => ({ selectedIndex: 0 }),
  update: (msg, slice, _model) => {
    if (msg.type === "Select") {
      const selectedIndex = Math.max(0, Math.min(OPTIONS.length - 1, msg.index));
      if (selectedIndex === slice.selectedIndex)
        return { slice, changed: false };
      return { slice: { selectedIndex }, changed: true };
    }
    if (msg.type !== "Keypress")
      return { slice, changed: false };
    const isUp = msg.name === "up" || msg.text === "k";
    const isDown = msg.name === "down" || msg.text === "j";
    if (isUp) {
      const selectedIndex = Math.max(0, slice.selectedIndex - 1);
      if (selectedIndex === slice.selectedIndex)
        return { slice, changed: false };
      return { slice: { selectedIndex }, changed: true };
    }
    if (isDown) {
      const selectedIndex = Math.min(OPTIONS.length - 1, slice.selectedIndex + 1);
      if (selectedIndex === slice.selectedIndex)
        return { slice, changed: false };
      return { slice: { selectedIndex }, changed: true };
    }
    return { slice, changed: false };
  },
  view: (slice, _model) => ({
    type: "list",
    title: TITLE,
    options: OPTIONS,
    selectedIndex: slice.selectedIndex
  })
};

// src/shared/widgets/index.ts
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
function composeUpdate(msg, model, widgets) {
  let next = model;
  const changed = new Set;
  for (const widget of widgets) {
    const field = modelFieldFor[widget.key];
    if (!field)
      continue;
    const result = widget.update(msg, next[field], next);
    if (!result.changed)
      continue;
    for (const key of fieldKeysFor[field] ?? []) {
      changed.add(key);
    }
    next = { ...next, [field]: result.slice };
  }
  return { model: next, changed };
}
function update(msg, model) {
  return composeUpdate(msg, model, homeScreen);
}
// src/web/pages/scripts/patch.ts
var widgetViews = {
  "static-text": (slice, model) => staticText.view(slice, model),
  input: (slice, model) => input.view(slice, model),
  "key-display": (slice, model) => keyDisplay.view(slice, model),
  "count-getter": (slice, model) => countGetter.view(slice, model),
  "count-setter": (slice, model) => countSetter.view(slice, model),
  list: (slice, model) => list.view(slice, model)
};
function renderNode(node) {
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
        li.className = "cursor-pointer px-1 rounded-sm " + (isSelected ? "text-stone-900 bg-stone-100" : "text-stone-50");
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
function renderWidgetInto(container, key, model) {
  if (key === "input")
    return;
  const view = widgetViews[key];
  const field = modelFieldFor[key];
  if (!view || !field)
    return;
  const slice = model[field];
  const tree = view(slice, model);
  container.replaceChildren(renderNode(tree));
}
function createApp() {
  let model = init();
  function mount(_root) {
    for (const key of Object.keys(widgetViews)) {
      if (key === "input")
        continue;
      const container = document.querySelector(`[data-widget="${key}"]`);
      if (container)
        renderWidgetInto(container, key, model);
    }
  }
  function dispatch(msgs) {
    for (const msg of msgs) {
      const result = update(msg, model);
      model = result.model;
      for (const key of result.changed) {
        if (key === "input")
          continue;
        const container = document.querySelector(`[data-widget="${key}"]`);
        if (container)
          renderWidgetInto(container, key, model);
      }
    }
  }
  return { mount, dispatch };
}

// src/web/pages/scripts/index.ts
var app = createApp();
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
