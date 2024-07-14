import React, { type FC } from "react";
import ReactDOM from "react-dom/client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcher } from "./fetcher";
import type {
  Button as ButtonModel,
  FormWithStatus,
  Status,
  Toggle as ToggleModel,
} from "./model";

const Button: FC<ButtonModel & Status> = ({ name, status }) => {
  const { trigger: emitClickEvent } = useSWRMutation("./forms", fetcher.post);
  return (
    <button
      type="button"
      className="btn"
      onClick={() => emitClickEvent({ name, click: true })}
    >
      {name}
    </button>
  );
};

const Toggle: FC<ToggleModel & Status> = ({ name, status }) => {
  const { trigger: updateStatus } = useSWRMutation("./forms", fetcher.put);
  return (<input
    type="checkbox"
    className="toggle"
    aria-label={name}
    onClick={() => updateStatus({ name, status: !status })}
    checked={status}
  />);
};

const Root: FC = () => {
  const {
    data: forms,
    error,
    isLoading,
  } = useSWR<FormWithStatus[]>("./forms", fetcher.get);

  if (error) return <div>Error: {error.message}</div>;
  if (!forms) return <div>Loading...</div>;
  if (isLoading) return <div>Loading...</div>;

  return forms.map((form) => (
    <div key={form.name}>
      {form.type === "button" && (<Button {...form} />)}
      {form.type === "toggle" && (<Toggle {...form} />)}
    </div>
  ));
};

const rootElm = document.getElementById("root");
if (!rootElm) throw new Error("Failed to get root element");

const root = ReactDOM.createRoot(rootElm);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
