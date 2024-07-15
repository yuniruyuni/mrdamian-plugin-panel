import clsx from "clsx";
import React, { type FC } from "react";
import ReactDOM from "react-dom/client";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import { fetcher } from "./fetcher";
import type {Binding, Panel } from "./model";

function isColorCode(color: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

const Button: FC<Binding> = ({ cell, current }) => {
  const { trigger: emitClickEvent } = useSWRMutation("./forms", fetcher.post);
  return (
    <button
      type="button"
      className={
        clsx(
          "btn flex-1 hover:scale-105",
          // current.color === "base" && "", // just ignore "base" case.
          current.color === "info" && "bg-info hover:bg-info",
          current.color === "success" && "bg-success hover:bg-success",
          current.color === "warning" && "bg-warning hover:bg-warning",
          current.color === "error" && "bg-error hover:bg-error",
        )
      }
      style={
        isColorCode(current.color)
          ? { backgroundColor: current.color }
          : {}
      }
      onClick={() => emitClickEvent({ name: cell.name })}
    >
      {current.text}
    </button>
  );
};

function window<T,>(size: number, arr: T[]): T[][] {
  const res = [];
  for(let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

const Root: FC = () => {
  const {
    data: panel,
    error,
    isLoading,
  } = useSWR<Panel>("./forms", fetcher.get);

  if (error) return <div>Error: {error.message}</div>;
  if (!panel) return <div>Loading...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={clsx(
      "flex flex-1"
    )}>
      {
        window(panel.width, panel.cells)
          .map((w) =>
            <div key={w[0].cell.name} className="flex flex-row flex-1">
              {w.map((binding) => <Button key={binding.cell.name} {...binding} />)}
            </div>
          )
      }
    </div>
  )
};

const rootElm = document.getElementById("root");
if (!rootElm) throw new Error("Failed to get root element");

const root = ReactDOM.createRoot(rootElm);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
