// Button.
// If user click on it, it will emit an event contains `name`.
export type Button = {
    type: "button";
};

// Toggle.
// This form insert itown status into pipeline.
// If user click on it, it flips the status.
export type Toggle = {
    type: "toggle";
    status: boolean;
};

// Label.
export type Label = {
    type: "label";
    text: string;
};


export type Form = {
    type: "button" | "toggle";
    name: string;
} & (Button | Toggle);


export type Status = {
	name: string;
	status: boolean;
};

export type FormWithStatus = Form & Status;