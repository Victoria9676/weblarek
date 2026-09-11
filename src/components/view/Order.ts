import { Form } from "./Form";
import { IOrderViewData, TPayment, IOrderView } from "../../types";
import { ensureElement, ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/Events";

export class Order extends Form<IOrderViewData> implements IOrderView {
  protected addressInput: HTMLInputElement;
  protected paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>(
      "input[name='address']",
      container,
    );
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button_alt",
      container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("order:payment", {
          payment: button.name as TPayment,
        });
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | "") {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }
}
