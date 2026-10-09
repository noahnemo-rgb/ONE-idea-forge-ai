import { useAiBufferDashboard } from "./useAiBufferDashboard.js";

export function AiBufferDashboard() {
  const { rows, choose, commitModel } = useAiBufferDashboard();
  return (
    <section className="mb-6">
      <h2 className="text-sm text-white/60 mb-3">ai-buffer</h2>
      <ul className="space-y-3 list-none p-0 m-0">
        {rows.map((row) => (
          <li
            key={row.id}
            data-active={row.activeLabel ? "true" : "false"}
            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap gap-3 items-center"
          >
            <button type="button" className="text-left font-medium" onClick={() => choose(row.id)}>
              {row.label}
            </button>
            <span className="text-sm text-white/60">{row.status}</span>
            <span className="text-sm text-white/60">{row.keyHint}</span>
            <span className="text-sm text-white/80">{row.activeLabel}</span>
            <label className="flex items-center gap-2 text-sm text-white/60">
              <span>{row.modelLabel}</span>
              <input
                key={`${row.id}:${row.model}`}
                defaultValue={row.model}
                onBlur={(event) => commitModel(row.id, event.target.value)}
                className="bg-transparent border border-white/10 rounded-xl px-3 py-1 outline-none focus:border-[#6855FF]"
              />
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}
