import { Form } from "./Form";
import { IFormState, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Order extends Form<IFormState> {
  protected paymentButtons: HTMLButtonElement[] = [];
  private paymentHandlers: ((e: MouseEvent) => void)[] = [];
  private isPaymentBound = false;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }

  protected bindEvents(): void {
    super.bindEvents();
    if (this.isPaymentBound) return;
    this.paymentButtons = Array.from(
      this.form.querySelectorAll<HTMLButtonElement>(".button_alt"),
    );

    this.paymentHandlers = this.paymentButtons.map((button) => {
      const handler = () => {
        const payment = button.name as TPayment;
        this.events.emit("order:payment", { payment });
      };
      button.addEventListener("click", handler);
      return handler;
    });

    this.isPaymentBound = true;
  }

  public unbind(): void {
    if (!this.isPaymentBound) return;

    this.paymentButtons.forEach((button, index) => {
      const handler = this.paymentHandlers[index];
      if (handler) {
        button.removeEventListener("click", handler);
      }
    });

    this.paymentHandlers = [];
    this.isPaymentBound = false;
  }

  set payment(value: TPayment | "") {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  reset() {
    super.reset();
    this.payment = "";
  }
}
