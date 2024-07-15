import path from "node:path";
import { AutoRouter, error, json } from "itty-router";
import {
  Component,
  type ComponentConfig,
  type Environment,
  type Fetch,
  type Field,
} from "mrdamian-plugin";

import type { Cell, Panel as PanelModel, Status } from "./model";

const sendFile = (rel: string) => {
  const f = Bun.file(path.join(import.meta.dir, rel));
  return new Response(f, { headers: { "Content-Type": f.type } });
};

export type InitConfig = ComponentConfig & {
  action?: "" | "init";
  args: {
    width: number;
    height: number;
    cells: Cell[];
  };
};

export type UpdateConfig = ComponentConfig & {
  action: "update";
  args: {
    name: string;
    status: Status;
  }
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
  panel: PanelModel = { width: 8, height: 8, cells: [] };

  async fetch(): Promise<Fetch | undefined> {
    const router = AutoRouter();

    return router
      .get("/", async () => sendFile("dist/index.html"))
      .get("/index.js", async () => sendFile("dist/index.js"))
      .get("/index.css", async () => sendFile("dist/index.css"))
      .get("/forms", async () => json(this.panel))
      .post("/forms", async (req: Request) => {
        const content = await req.json();
        const name = content.name;

        const b = this.panel.cells.find((b) => b.cell.name === name);
        if( !b ) return error(404, { status: "error", detail: `target binding '${content.name}' does not exist` });

        // switch to next status.
        const defs = b.cell.defs;
        b.current = defs[(defs.indexOf(b.current) + 1) % defs.length];

        const shouldEmit = (cell: Cell) => {
          if( cell.emit === undefined ) {
            return cell.defs.length === 1;
          }
          return cell.emit;
        };

        if( shouldEmit(b.cell) ) {
          this.emit({ [content.name]: b.current.value });
        }

        return json({ status: "ok" });
      })
      .fetch;
  }

  public async initialize(config: PanelConfig): Promise<void> {
    if (!isInitConfig(config)) return;
    this.panel = {
      width: config.args.width,
      height: config.args.height,
      cells: config.args.cells.map((cell) => ({ cell, current: cell.defs[0] })),
    };
  }

  public async process(config: PanelConfig): Promise<Field> {
    if (isInitConfig(config)) {
      // initialize component discharge current status values into pipeline.
      const shouldDischarge = (cell: Cell) => {
        if( cell.discharge === undefined ) {
          return cell.defs.length === 1;
        }
        return cell.discharge;
      };

      return this.panel.cells.reduce<Environment>((field, binding) => {
        if( shouldDischarge(binding.cell) ) {
          field[binding.cell.name] = binding.current.value;
        }
        return field;
      }, {});
    }

    if (config.action === "update") {
      const name = config.args.name;
      const status = config.args.status;

      const b = this.panel.cells.find((b) => b.cell.name === name);
      if( !b ) return undefined;
      b.current = status

      return undefined;
    }

    return undefined;
  }
}
