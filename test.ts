import { setTimeout } from "node:timers/promises";

import Component from "./main";
import type { Definition } from "./model/definition";

const emit = {
  emit: () => {},
};

const defs: Definition[] = [
  {
    type: "group",
    name: "group-1",
    forms: [
      {
        type: "button",
        name: "button-test",
        text: "hoge",
      },
      {
        type: "toggle",
        name: "toggle-test",
        active: true,
      },
      {
        type: "label",
        name: "label-test",
        text: "hogehoge",
      },
      {
        type: "group",
        name: "group-1-1",
        forms: [
          {
            type: "button",
            name: "button-test",
            text: "hoge",
          },
          {
            type: "toggle",
            name: "toggle-test",
            active: true,
          },
          {
            type: "label",
            name: "label-test",
            text: "hogehoge",
          },
        ],
      },
    ],
  },
  {
    type: "group",
    name: "group-2",
    forms: [
      {
        type: "button",
        name: "button-test",
        text: "hoge",
      },
      {
        type: "toggle",
        name: "toggle-test",
        active: true,
      },
      {
        type: "label",
        name: "label-test",
        text: "hogehoge",
      },
    ],
  },
];

const comp = new Component(emit);
await comp.initialize({
  type: "panel",
  name: "main",
  forms: defs,
});

const loop = async () => {
  for (;;) {
    const field = await comp.process({
      type: "panel",
      name: "main",
      forms: defs,
    });
    console.log(field);
    await setTimeout(1000);
  }
};
loop();

export default {
  port: 3000,
  fetch: await comp.fetch(),
};
