import Component from './main';

const emit = {
    emit: () => {},
};
const comp = new Component(emit);
await comp.process({
        type: "panel",
		args: {
			forms: [
				{
					type: "button",
                    name: "button-test",
				},
				{
					type: "toggle",
                    name: "toggle-test",
					status: false,
				},
			],
		},
	});

export default {
	port: 3000,
	fetch: await comp.fetch({ type: "panel", args: { forms: [] } }),
};