import path from "node:path";
import { AutoRouter, json } from "itty-router";
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

export type InitConfig = ComponentConfig & {
	action?: "" | "init";
	forms: Form[];
};

export type UpdateConfig = ComponentConfig & {
	action: "update";
	args: Status;
};

export type PanelConfig = ComponentConfig & {
	action?: "" | "init" | "update";
} & (InitConfig | UpdateConfig);

function isInitConfig(config: PanelConfig): config is InitConfig {
	if( config.action === undefined ) return true;
	if( config.action === "" ) return true;
	if( config.action === "init" ) return true;
	return false;
}

export default class Panel extends Component<PanelConfig> {
	config?: InitConfig;
	statuses: Map<string, Status> = new Map();

	currentForms(): FormWithStatus[] {
		if (!this.config) {
			return [];
		}
		return this.config.forms.map((form) => ({
			...form,
			...(this.statuses.get(form.name) ?? {
				name: form.name,
				status: false,
			}),
		}));
	}

	async fetch(): Promise<Fetch | undefined> {
		const router = AutoRouter();

		return router
			.get("/", async () => sendFile("dist/index.html"))
			.get("/index.js", async () => sendFile("dist/index.js"))
			.get("/index.css", async () => sendFile("dist/index.css"))
			.get("/forms", async () => json(this.currentForms()))
			.put("/forms", async (req: Request) => {
				const content = await req.json();
				this.statuses.set(content.name, content);
				return json({ status: "ok" });
			})
			.post("/forms", async (req: Request) => {
				const content = await req.json();
				this.emit({ [content.name]: true });
				return json({ status: "ok" });
			})
			.fetch;
	}

	public async initialize(config: PanelConfig): Promise<void> {
		if( !isInitConfig(config) ) return;
		this.config = config;
		const setupStatuses = (forms: Form[]) => {
			for( const form of forms ) {
				if( form.type === "group" ) {
					return setupStatuses(form.forms);
				}
				// TODO: write type-wise default status deifnition.
				this.statuses.set(form.name, { name: form.name, status: false });
			}
		};
		setupStatuses(config.forms);
	}

	public async process(config: PanelConfig): Promise<Field> {
		if( isInitConfig(config) ) {
			const writeField = (forms: Form[]) => {
				let field = {};
				for (const form of config.forms) {
					if( form.type === "group" ) {
						field = {
							...field,
							[form.name]: writeField(form.forms),
						};
					}

					if (form.type === "toggle") {
						field = {
							...field,
							[form.name]: this.statuses.get(form.name)?.status,
						};
					}
				}
				return field;
			};
			return writeField(config.forms);
		}

		if( config.action === "update" ) {
			const status = config.args;
			const current = this.statuses.get(status.name);
			if( !current ) return undefined;
			this.statuses.set(status.name, status);
			return undefined;
		}

		return undefined;
	}
}