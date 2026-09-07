import { Form } from "./Form";
import { IFormState } from "../../types";
import { IEvents } from "../base/Events";

export class Contacts extends Form<IFormState> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
}
