// src/web/pages/scripts/index.ts
var count = 0;
main();
function main() {
  document.body.addEventListener("keydown", onKeydown);
}
function onKeydown(e) {
  console.log(e);
  count++;
  const keyElements = document.querySelectorAll("[data-key]");
  for (const keyElement of keyElements) {
    keyElement.textContent = `Key: ${e.key}`;
  }
  const countElements = document.querySelectorAll("[data-count]");
  for (const countElement of countElements) {
    countElement.textContent = `${count}`;
  }
}
