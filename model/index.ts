import type { Binding } from './binding';
import type { Definition } from './definition';

export const bindWithDefaultStatus = (def: Definition): Binding => {
  const type = def.type;
  const name = def.name;
  switch (type) {
    case "group":
      return { type, name, def, subs: def.forms.map(bindWithDefaultStatus) };
    case "toggle":
      return { type, name, def, status: { type, name, active: def.active } };
    case "button":
      return { type, name, def, status: { type, name, text: def.text } };
    case "label":
      return { type, name, def, status: { type, name, text: def.text } };
  }
};