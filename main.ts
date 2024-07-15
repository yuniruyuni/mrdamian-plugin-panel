import path from "node:path";
import { AutoRouter, error, json } from "itty-router";
import {
  Component,
  type ComponentConfig,
  type Fetch,
  type Field,
} from "mrdamian-plugin";

import { bindWithDefaultStatus } from "./model";
import type { Binding } from "./model/binding";
import type { Definition } from "./model/definition";
import type { Status } from "./model/status";

const sendFile = (rel: string) => {
  const f = Bun.file(path.join(import.meta.dir, rel));
  return new Response(f, { headers: { "Content-Type": f.type } });
};

export type InitConfig = ComponentConfig & {
  action?: "" | "init";
  forms: Definition[];
};

export type UpdateConfig = ComponentConfig & {
  action: "update";
  args: Status;
};

export type PanelConfig = ComponentConfig & {
  action?: "" | "init" | "update";
} & (InitConfig | UpdateConfig);

function isInitConfig(config: PanelConfig): config is InitConfig {
  if (config.action === undefined) return true;
  if (config.action === "") return true;
  if (config.action === "init") return true;
  return false;
}

export default class Panel extends Component<PanelConfig> {
  bindings: Binding[] = [];

  async fetch(): Promise<Fetch | undefined> {
    const router = AutoRouter();

    return router
      .get("/", async () => sendFile("dist/index.html"))
      .get("/index.js", async () => sendFile("dist/index.js"))
      .get("/index.css", async () => sendFile("dist/index.css"))
      .get("/forms", async () => json(this.bindings))
      .put("/forms", async (req: Request) => {
        const content = await req.json();
        const names = content.name.split(".");
        const dig = (binds: Binding[], names: string[]) => {
          const [name, ...rest] = names;
          const b = binds.find((b) => b.name === name);
          if( !b ) return undefined;
          if( rest.length === 0 ) return b;
          if( b.type !== "group" ) return undefined;
          return dig(b.subs, rest);
        };

        const b = dig(this.bindings, names);
        if( !b ) return error(404, { status: "error", detail: `target binding '${content.name}' does not exist` });
        if( b.type === "group" ) return error(422, { status: "error", detail: `target binding '${content.name}' type is 'group' so it doesn't have status` });

        b.status = content.status;

        return json({ status: "ok", binding: b });
      })
      .post("/forms", async (req: Request) => {
        const content = await req.json();
        this.emit({ [content.name]: true });
        return json({ status: "ok" });
      })
      .fetch;
  }

  public async initialize(config: PanelConfig): Promise<void> {
    if (!isInitConfig(config)) return;
    this.bindings = config.forms.map(bindWithDefaultStatus);
  }

  public async process(config: PanelConfig): Promise<Field> {
    if (isInitConfig(config)) {
      // initialize component discharge current status values into pipeline.
      const writeField = (bindings: Binding[]) => {
        let field = {};
        for (const binding of bindings) {
          switch( binding.type ) {
            case "group":
              field = {
                ...field,
                [binding.name]: writeField(binding.subs),
              };
              break;
            case "button":
              // non need to write status for buttons and labels.
              break;
            case "toggle":
              field = {
                ...field,
                [binding.name]: binding.status.active,
              };
              break;
            case "label":
              // non need to write status for buttons and labels.
              break;
          }
        }
        return field;
      };
      return writeField(this.bindings);
    }

    if (config.action === "update") {
      const dig = (binds: Binding[], names: string[]): Binding | undefined => {
        const [name, ...rest] = names;

        const b = binds.find((b) => b.name === name);
        if( !b ) return undefined;

        if( b.type === "group" ) {
          return dig(b.subs, rest);
        }

        return b;
      };

      const status = config.args;
      const names = status.name.split(".");
      const b = dig(this.bindings, names);

      if( !b ) return undefined;
      if( b.type === "group" ) return undefined;
      if( b.type === status.type ){
        b.status = status;
      }

      return undefined;
    }

    return undefined;
  }
}
