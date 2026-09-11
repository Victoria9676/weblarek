import { Form } from "./Form";
import { IContactsViewData, IContactsView } from "../../types";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export class Contacts extends Form<IContactsViewData> implements IContactsView {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.emailInput = ensureElement<HTMLInputElement>(
      "input[name='email']",
      container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      "input[name='phone']",
      container,
    );
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
