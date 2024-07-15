import React, { type FC } from "react";
import ReactDOM from "react-dom/client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcher } from "./fetcher";
import type * as Binding from "./model/binding";

const Button: FC<Binding.Button & {root: string}> = ({ root, def, status }) => {
  const { trigger: emitClickEvent } = useSWRMutation("./forms", fetcher.post);
  return (
    <div className="m-2">
      <button
        type="button"
        className="btn"
        onClick={() => emitClickEvent({ name: `${root}{def.name}`, click: true })}
      >
        {status.text}
      </button>
    </div>
  );
};

const Toggle: FC<Binding.Toggle & { root: string }> = ({ root, def, status }) => {
  const { trigger: updateStatus } = useSWRMutation("./forms", fetcher.put);
  return (
    <div className="m-2 flex flex-row gap-2">
      <input
        type="checkbox"
        className="toggle"
        aria-label={def.name}
        onClick={() => updateStatus({
          name: `${root}${def.name}`,
          status: { active: !status.active },
        })}
        checked={status.active}
      />
      <label>{def.name}</label>
    </div>
  );
};

const Label: FC<Binding.Label & { root: string }> = ({ root, def, status }) => (
  <div className="m-2">
    <p>{def.name}: {status.text}</p>
  </div>
);

const Group: FC<Binding.Group & { root: string }> = ({ root, name, subs }) => {
  const subroot = `${root}${name}.`;
  return (
    <div className="relative border border-1 border-slate-200 rounded-xl border-solid bg-base-100 m-4 p-4">
      <h2 className="absolute -top-4 bg-base-100">{name}</h2>
      {subs.map((sub) => {
        switch (sub.type) {
          case "group": return (<Group key={sub.name} root={subroot} {...sub} />);
          case "button": return (<Button key={sub.name} root={subroot} {...sub} />);
          case "toggle": return (<Toggle key={sub.name} root={subroot} {...sub} />);
          case "label": return (<Label key={sub.name} root={subroot} {...sub} />);
        }
      })}
    </div>
  );
};

const Root: FC = () => {
  const {
    data: bindings,
    error,
    isLoading,
  } = useSWR<Binding.Binding[]>("./forms", fetcher.get);

  if (error) return <div>Error: {error.message}</div>;
  if (!bindings) return <div>Loading...</div>;
  if (isLoading) return <div>Loading...</div>;

  return bindings.map((binding) => {
    switch( binding.type ) {
      case "button": return (<Button key={binding.def.name} root="" {...binding} />);
      case "toggle": return (<Toggle key={binding.def.name} root="" {...binding} />);
      case "label" : return (<Label key={binding.def.name} root="" {...binding} />);
      case "group" : return (<Group key={binding.def.name} root="" {...binding} />);
    }
  });
};

const rootElm = document.getElementById("root");
if (!rootElm) throw new Error("Failed to get root element");

const root = ReactDOM.createRoot(rootElm);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
