/* 27 multi-step-form: Implement multi-step create flow (basic→details→confirm). */
import React from "react";

export default function Solution() {
  const [step, setStep] = React.useState(1);
  const [draft, setDraft] = React.useState({ title: "", desc: "" });
  const [items, setItems] = React.useState<any[]>([]);
  return (
    <div>
      {step === 1 && (
        <div>
          <input
            aria-label="title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            aria-label="desc"
            value={draft.desc}
            onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
          />
          <button onClick={() => setStep(1)}>Back</button>
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <button
            onClick={() => {
              setItems([{ id: Date.now(), ...draft }, ...items]);
              setDraft({ title: "", desc: "" });
              setStep(1);
            }}
          >
            Create
          </button>
        </div>
      )}
      <ul>
        {items.map((i) => (
          <li key={i.id}>{i.title}</li>
        ))}
      </ul>
    </div>
  );
}
