import { setTimeout } from "node:timers/promises";

import Component from "./main";

const emit = {
  emit: () => {},
};
const comp = new Component(emit);
await comp.initialize({
  type: "panel",
  name: "main",
  forms: [
    {
      type: "button",
      name: "button-test",
    },
    {
      type: "toggle",
      name: "toggle-test",
      status: true,
    },
  ],
});

const loop = async () => {
  for (;;) {
    const field = await comp.process({
      type: "panel",
      name: "main",
      forms: [
        {
          type: "button",
          name: "button-test",
        },
        {
          type: "toggle",
          name: "toggle-test",
          status: true,
        },
      ],
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
