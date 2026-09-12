import React from "react";
import {
  X,
  TrendingUp,
  DollarSign,
  BarChart3,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export function RevenueModal({
  isGeneratingRevenue,
  revenueResult,
  revenueIdea,
  onClose,
}) {
  if (!revenueIdea && !isGeneratingRevenue) return null;

  const chartData = revenueResult?.projections?.map((val, i) => ({
    month: `M${i + 1}`,
    revenue: val,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#1A1425] border border-white/10 rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-[#1A1425]">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="text-[#6855FF]" />
              Revenue Model Simulator
            </h2>
            <p className="text-white/40 text-sm mt-1">
              12-month financial projection for {revenueIdea?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isGeneratingRevenue ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6855FF]"></div>
              <p className="text-white/60 font-medium animate-pulse">
                Running financial simulations...
              </p>
            </div>
          ) : revenueResult ? (
            <div className="space-y-8">
              {/* Chart Section */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <BarChart3 size={20} className="text-[#6855FF]" />
                  Projected Monthly Revenue (Year 1)
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorRev"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6855FF"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6855FF"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#ffffff10"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#ffffff40"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#ffffff40"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val) => `$${val}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1A1425",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                        }}
                        itemStyle={{ color: "#6855FF" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6855FF"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Pricing Tiers */}
                <div className="md:col-span-2 grid md:grid-cols-3 gap-4">
                  {revenueResult.tiers?.map((tier, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                      <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">
                        {tier.name}
                      </h4>
                      <div className="text-2xl font-bold text-white mb-4">
                        {tier.price}
                      </div>
                      <ul className="space-y-2">
                        {tier.features?.map((f, i) => (
                          <li
                            key={i}
                            className="text-[11px] text-white/60 flex items-start gap-2"
                          >
                            <CheckCircle2
                              size={12}
                              className="text-[#6855FF] mt-0.5 shrink-0"
                            />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Metrics & Assumptions */}
                <div className="space-y-6">
                  <div className="bg-[#6855FF]/10 border border-[#6855FF]/20 rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-[#6855FF] uppercase tracking-widest mb-4">
                      Growth Metrics
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40">
                          Acquisition
                        </span>
                        <span className="text-sm font-bold">
                          {revenueResult.metrics?.acquisition}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40">Churn</span>
                        <span className="text-sm font-bold">
                          {revenueResult.metrics?.churn}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-white/40">ARPU</span>
                        <span className="text-sm font-bold">
                          {revenueResult.metrics?.arpu}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Info size={14} /> Assumptions
                    </h4>
                    <ul className="space-y-2">
                      {revenueResult.assumptions?.map((a, i) => (
                        <li key={i} className="text-[11px] text-white/50">
                          • {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              Failed to load revenue model. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
