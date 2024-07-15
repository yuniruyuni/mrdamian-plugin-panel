import type * as Form from "./form";

export type Button = Form.Button & { text: string };
export type Toggle = Form.Toggle & { active: boolean };
export type Label = Form.Label & { text: string };
export type Group = Form.Group;

export type Status = Button | Toggle | Label | Group;