import { X, Loader2, Database, Server, Code2 } from "lucide-react";

export function TechnicalArchitectureModal({
  isGeneratingArchitecture,
  architectureResult,
  architectureIdea,
  onClose,
}) {
  if (!isGeneratingArchitecture && !architectureResult) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] p-8 max-w-3xl w-full shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Code2 size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Technical Architecture</h3>
              <p className="text-xs text-white/40">{architectureIdea?.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2">
          {isGeneratingArchitecture ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin mb-4" />
              <p className="text-white/60">Designing system architecture...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <p className="text-sm text-blue-300 italic">
                  <span className="font-bold uppercase text-[10px] tracking-widest mr-2">
                    Pattern:
                  </span>
                  {architectureResult.architecture_notes}
                </p>
              </div>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Database size={18} className="text-blue-400" />
                  <h4 className="font-bold text-lg">Database Schema</h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {architectureResult.database_schema.map((table, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-2xl p-5"
                    >
                      <h5 className="font-bold text-blue-400 mb-3 flex items-center justify-between">
                        {table.table}
                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">
                          Table
                        </span>
                      </h5>
                      <ul className="space-y-2">
                        {table.columns.map((col, j) => (
                          <li
                            key={j}
                            className="text-xs text-white/60 font-mono flex justify-between border-b border-white/5 pb-1"
                          >
                            {col}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Server size={18} className="text-blue-400" />
                  <h4 className="font-bold text-lg">Core API Endpoints</h4>
                </div>
                <div className="space-y-3">
                  {architectureResult.api_endpoints.map((endpoint, i) => (
                    <div
                      key={i}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4"
                    >
                      <div
                        className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          endpoint.method === "GET"
                            ? "bg-green-500/20 text-green-400"
                            : endpoint.method === "POST"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {endpoint.method}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-mono text-white/80 mb-1">
                          {endpoint.path}
                        </p>
                        <p className="text-xs text-white/40">
                          {endpoint.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
