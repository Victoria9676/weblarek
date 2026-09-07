import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> {
  protected events: IEvents;
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected formErrors: HTMLElement;

  private isBound = false;
  private readonly handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.name) {
      this.events.emit(`${this.form.name}.${target.name}:change`, {
        value: target.value,
      });
    }
  };
  private readonly handleSubmit = (event: Event) => {
    event.preventDefault();
    this.events.emit(`${this.form.name}:submit`);
  };

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this.form = container;
    this.submitButton = ensureElement<HTMLButtonElement>(
      "button[type=submit]",
      container,
    );
    this.formErrors = ensureElement<HTMLElement>(".form__errors", container);

    this.bindEvents();
  }

  protected bindEvents(): void {
    if (this.isBound) return;
    this.form.addEventListener("input", this.handleInput);
    this.form.addEventListener("submit", this.handleSubmit);
    this.isBound = true;
  }

  public unbind(): void {
    if (!this.isBound) return;
    this.form.removeEventListener("input", this.handleInput);
    this.form.removeEventListener("submit", this.handleSubmit);
    this.isBound = false;
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
