import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

import Quill from "quill";

const quill = new Quill("#editor", {
  theme: "snow",
});

const contentInput: HTMLInputElement = document.querySelector("#content");
const submitBtn: HTMLButtonElement = document.querySelector("#submit-btn");
const form: HTMLFormElement = document.querySelector("#new-form");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  contentInput.value = quill.getSemanticHTML(0);
  form.submit();
});
