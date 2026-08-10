import { homeScreen } from "../../../shared";
import { fromKeydown, fromClick } from "./fromDom";
import { createApp } from "./patch";

const app = createApp(homeScreen);
app.mount(document.getElementById("root")!);

document.addEventListener("keydown", (e) => app.dispatch(fromKeydown(e)));
document.addEventListener("click", (e) => app.dispatch(fromClick(e)));

const input = document.querySelector<HTMLInputElement>("[data-input]")!;
if (input) {
    input.addEventListener("input", () =>
        app.dispatch([
            { type: "ValueChanged", value: input.value, cursor: input.selectionStart ?? 0 },
        ]),
    );
    input.addEventListener("select", () =>
        app.dispatch([
            { type: "ValueChanged", value: input.value, cursor: input.selectionStart ?? 0 },
        ]),
    );
}
