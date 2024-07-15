// Group.
export type Group = {
  type: "group";
  name: string;
};

// Button.
// If user click on it, it will emit an event contains `name`.
export type Button = {
  type: "button";
  name: string;
};

// Toggle.
// This form insert itown status into pipeline.
// If user click on it, it flips the status.
export type Toggle = {
  type: "toggle";
  name: string;
};

// Label.
export type Label = {
  type: "label";
  name: string;
};

export type Form = Group | Button | Toggle | Label;