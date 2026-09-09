import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected events: IEvents;
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this.form = container;
    this.submitButton = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      container,
    );
    this.formErrors = ensureElement<HTMLElement>(".form__errors", container);
    this.form.addEventListener("input", (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.name) {
        this.events.emit(`${this.form.name}.${target.name}:change`, {
          value: target.value,
        });
      }
    });
    this.form.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      this.events.emit(`${this.form.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.formErrors.textContent = value;
  }

  reset() {
    this.form.reset();
    this.errors = "";
    this.valid = false;
  }
}
