// TUI: global state
let count = 0;

main();

function main() {
    // console.log("Hello World!");

    // TUI: on keypress
    document.body.addEventListener("keydown", onKeydown);
}

function onKeydown(e: KeyboardEvent) {
    console.log(e);

    // process state
    count++;

    // render
    const keyElements = document.querySelectorAll("[data-key]");
    for (const keyElement of keyElements) {
        keyElement.textContent = `Key: ${e.key}`;
    }

    const countElements = document.querySelectorAll("[data-count]");
    for (const countElement of countElements) {
        countElement.textContent = `${count}`;
    }
}
