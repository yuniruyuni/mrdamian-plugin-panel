import React, { type FC, useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom/client";

import type { FormWithStatus, Status } from "./model";

const Root: FC = () => {
  const [forms, setForms] = useState<FormWithStatus[]>([]);

  // TODO: use tanstack-query or swr...
  useEffect(() => {
    (async () => {
      const res = await fetch("./forms");
      const json = await res.json();
	  console.log(json);
      setForms(json as FormWithStatus[]);
    })();
  }, []);

  const updateStatus = useCallback(async (status: Status) => {
	await fetch("./forms", {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(status),
	});
  }, []);

  const emitClickEvent = useCallback(async (name: string) => {
	await fetch("./forms", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({name, click: true}),
	});
  }, []);

  return forms.map((form) => (
			<div key={form.name}>
				{form.type === "button" && (
					<button
						type="button"
						className="btn"
						onClick={() => emitClickEvent(form.name)}
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
