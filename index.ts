import path from "node:path";
import { Component } from "mrdamian/model/component";
import type { ComponentConfig } from "mrdamian/model/parameters";
import type { Fetch } from "mrdamian/model/server";
import type { Field } from "mrdamian/model/variable";

export type PanelConfig = ComponentConfig;
export default class Panel extends Component<PanelConfig> {
  get fetch(): Fetch {
    return async (req: Request): Promise<Response> => {
      const url = new URL(req.url);
      if (url.pathname === "/") {
        const f = Bun.file(path.join(import.meta.dir, "dist/index.html"));
        return new Response(f, { headers: { "Content-Type": f.type } });
      }
      if (url.pathname === "/index.js") {
        const f = Bun.file(path.join(import.meta.dir, "dist/index.js"));
        return new Response(f, { headers: { "Content-Type": f.type } });
      }
      if (url.pathname === "/index.css") {
        const f = Bun.file(path.join(import.meta.dir, "dist/index.css"));
        return new Response(f, { headers: { "Content-Type": f.type } });
      }
      if (url.pathname === "/panels") {
        return new Response(`[{"type":"button", "name": "first"},{"type":"toggle", "name": "secondary"}]`, {
          status: 200,
          headers: { "Content-Type": "text/javascript" },
        });
      }
      return new Response("<p>Not found</p>", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    };
  }

  public async run(): Promise<Field> {
    // TODO: implement
    return undefined;
  }
}