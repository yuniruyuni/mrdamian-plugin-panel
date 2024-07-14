import React, { type FC } from "react";
import ReactDOM from "react-dom/client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { fetcher } from "./fetcher";
import type { FormWithStatus } from "./model";

const Root: FC = () => {
  const {
    data: forms,
    error,
    isLoading,
  } = useSWR<FormWithStatus[]>("./forms", fetcher.get);

  const { trigger: updateStatus } = useSWRMutation("./forms", fetcher.put);
  const { trigger: emitClickEvent } = useSWRMutation("./forms", fetcher.post);

  if (error) return <div>Error: {error.message}</div>;
  if (!forms) return <div>Loading...</div>;
  if (isLoading) return <div>Loading...</div>;

  return forms.map((form) => (
    <div key={form.name}>
      {form.type === "button" && (
        <button
          type="button"
          className="btn"
          onClick={() => emitClickEvent({ name: form.name, click: true })}
        >
          {form.name}
        </button>
      )}
      {form.type === "toggle" && (
        <input
          type="checkbox"
          className="toggle"
          aria-label={form.name}
          onClick={() =>
            updateStatus({
              name: form.name,
              status: !form.status,
            })
          }
          checked={form.status}
        />
      )}
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
