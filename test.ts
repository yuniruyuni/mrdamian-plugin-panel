import { setTimeout } from "node:timers/promises";

import Component from "./main";
import type { Cell } from "./model";

const emit = {
  emit: () => {},
};

const cells: Cell[] = [
  {
    name: "button-test",
    emit: true,
    discharge: false,
    defs: [
      {
        text: "hoge",
        color: "primary",
        value: true,
      },
    ]
  },
  {
    name: "toggle-test",
    emit: true,
    discharge: false,
    defs: [
      {
        text: "on",
        color: "neutral",
        value: true,
      },
      {
        text: "off",
        color: "neutral",
        value: false,
      },
    ]
  },
  {
    name: "auto_shoutout",
    defs: [
      {
        text: "auto shoutout on",
        color: "#ff0000",
        value: true,
      },
      {
        text: "auto shoutout off",
        color: "#0000FF",
        value: false,
      },
    ]
  },
  {
    name: "colors",
    defs: [
      {
        text: "base",
        color: "base",
        value: "base",
      },
      {
        text: "info",
        color: "info",
        value: "info",
      },
      {
        text: "success",
        color: "success",
        value: "success",
      },
      {
        text: "warning",
        color: "warning",
        value: "warning",
      },
      {
        text: "error",
        color: "error",
        value: "error",
      },
    ]
  },
];

const comp = new Component(emit);
await comp.initialize({
  type: "panel",
  name: "main",
  args: {
    width: 8,
    height: 8,
    cells,
  },
});

const loop = async () => {
  for (;;) {
    const field = await comp.process({
      type: "panel",
      name: "main",
      args: {
        width: 8,
        height: 8,
        cells,
      },
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
