import type * as Form from "./form";

export type Group = Form.Group & { forms: Definition[] };
export type Button = Form.Button & { text: string };
export type Toggle = Form.Toggle & { active: boolean };
export type Label = Form.Label & { text: string };

export type Definition = Group | Button | Toggle | Label;