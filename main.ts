import path from "node:path";
import { AutoRouter } from "itty-router";
import {
	Component,
	type ComponentConfig,
	type Fetch,
	type Field,
} from "mrdamian-plugin";

import type { Form, FormWithStatus, Status } from "./model";

const sendFile = (rel: string) =>{
	const f = Bun.file(path.join(import.meta.dir, rel));
	return new Response(f, { headers: { "Content-Type": f.type } });
}

export type PanelConfig = ComponentConfig & {
	args: {
		forms: Form[];
	}
};

export default class Panel extends Component<PanelConfig> {
	latestConfig?: PanelConfig;
	statuses: Map<string, Status> = new Map();

	currentForms(): FormWithStatus[] {
		if (!this.latestConfig) {
			return [];
		}
		return this.latestConfig.args.forms.map((form) => ({
			...form,
			...(this.statuses.get(form.name) ?? {
				name: form.name,
				status: false,
			}),
		}));
	}

	async fetch(config: PanelConfig): Promise<Fetch | undefined> {
		const router = AutoRouter();

		return router
			.get("/", async () => sendFile("dist/index.html"))
			.get("/index.js", async () => sendFile("dist/index.js"))
			.get("/index.css", async () => sendFile("dist/index.css"))
			.get(
				"/forms",
				async () =>
					new Response(JSON.stringify(this.currentForms()), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					}),
			)
			.put("/forms", async (req) => {
				const content = await req.json();
				this.statuses.set(content.name, content);
				return new Response(JSON.stringify({ status: "ok" }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			})
			.post("/forms", async (req) => {
				const content = await req.json();
				this.emit({
					[content.name]: {
						click: true,
					},
				});
				return new Response(JSON.stringify({ status: "ok" }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			})
			.fetch;
	}

	public async initialize(config: PanelConfig): Promise<void> {
		this.latestConfig = config;
	}

	public async process(config: PanelConfig): Promise<Field> {
		this.latestConfig = config;

		let field = {};
		for (const form of config.args.forms) {
			if (form.type === "toggle") {
				field = {
					...field,
					[form.name]: this.statuses.get(form.name)?.status,
				};
			}
		}

		return field;
	}
}