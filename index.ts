import path from "node:path";
import {
	Component,
	type ComponentConfig,
	type Fetch,
	type Field,
} from "mrdamian-plugin";

export type PanelConfig = ComponentConfig;
export default class Panel extends Component<PanelConfig> {
  get fetch(): Fetch {
    return async (req: Request): Promise<Response> => {
      // TODO: reimplement with some http router library.
      // TODO: implement event receiving api endpoints from each ui-component.
      // TODO: implement event sending for single event ui-component. (ex. button)
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

  public async process(): Promise<Field> {
    // TODO: implement for permanent state ui-component (ex. toggle button, radio button, slider, etc.)
    return undefined;
  }
}