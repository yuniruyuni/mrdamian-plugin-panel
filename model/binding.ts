import type * as Definition from './definition';
import type * as Form from './form';
import type * as Status from './status';

export type Group = Form.Group & {
  def: Definition.Group;
  subs: Binding[];
};

export type Button = Form.Button & {
  def: Definition.Button;
  status: Status.Button;
};

export type Toggle = Form.Toggle & {
  def: Definition.Toggle;
  status: Status.Toggle;
};

export type Label = Form.Label & {
  def: Definition.Label;
  status: Status.Label;
};

export type Binding = Group | Button | Toggle | Label;