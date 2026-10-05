import React, { useState, useMemo } from 'react';
import { Order, formatINR } from '../types';
import { addOrder, deleteOrder, resetOrders } from '../services/orderStorage';
import { useToast } from '../context/ToastContext';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Calendar,
  RotateCcw,
  PlusCircle,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  BarChart3,
  LineChart,
} from 'lucide-react';

interface AdminSalesAnalyticsProps {
  orders: Order[];
}

export const AdminSalesAnalytics: React.FC<AdminSalesAnalyticsProps> = ({ orders }) => {
  const { showToast } = useToast();
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [hoveredDay, setHoveredDay] = useState<{ day: number; dateStr: string; revenue: number; count: number } | null>(null);

  // Determine current month & year (October 2026 based on mock context or current date)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (9 = Oct)
  const monthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Filter orders for the current month
  const currentMonthOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getFullYear() === currentYear &&
        orderDate.getMonth() === currentMonth
      );
    });
  }, [orders, currentYear, currentMonth]);

  // Monthly Summary Calculations
  const totalOrders = currentMonthOrders.length;
  const totalRevenue = currentMonthOrders.reduce((sum, o) => sum + (o.price || 0), 0);
  const totalProductsSold = totalOrders; // each order is 1+ products
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Aggregate daily revenue for current month (days 1 to 31)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyData = useMemo(() => {
    const map: { [day: number]: { revenue: number; count: number; dateStr: string } } = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `Oct ${d}`;
      map[d] = { revenue: 0, count: 0, dateStr };
    }

    currentMonthOrders.forEach((o) => {
      const d = new Date(o.date).getDate();
      if (map[d]) {
        map[d].revenue += o.price;
        map[d].count += 1;
      }
    });

    return Object.entries(map).map(([dayStr, val]) => ({
      day: parseInt(dayStr, 10),
      ...val,
    }));
  }, [currentMonthOrders, daysInMonth]);

  // Chart scaling math
  const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue), 6000);
  // Show up to the current day + 3 days in chart for neat spacing, or all days
  const activeDaysRange = dailyData.slice(0, Math.min(daysInMonth, Math.max(now.getDate() + 2, 7)));

  // SVG dimensions
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;
  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  // Add sample order for instant testing
  const handleAddSampleOrder = () => {
    const sampleProducts = [
      { name: 'Marshall VORTEX 01 Heavyweight Boxy Hoodie', price: 2499 },
      { name: 'Tactical Basalt Modular Cargo Pants', price: 1899 },
      { name: 'Marshall Distressed Industrial Flight Bomber', price: 4999 },
      { name: 'Archive Mineral Oversized Raw Edge Tee', price: 999 },
    ];
    const picked = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    const names = ['Rohan Sen', 'Meera Joshi', 'Karan Patel', 'Zara Khan'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const newOrder = addOrder({
      productName: picked.name,
      price: picked.price,
      customerName: randomName,
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      address: 'Express Delivery Hub, Mumbai',
      date: new Date().toISOString(),
      status: 'Processing',
    });

    showToast('Simulated order generated', 'success', `+${formatINR(newOrder.price)} added to ${monthName}`);
  };

  const handleResetOrders = () => {
    if (window.confirm('Reset all sales data back to default October 2026 archive?')) {
      resetOrders();
      showToast('Sales data restored to default', 'info');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-zinc-950 border border-zinc-900 rounded-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>REPORTING PERIOD: {monthName.toUpperCase()}</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
            Monthly Sales & Revenue Intelligence
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddSampleOrder}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-semibold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Simulate Order</span>
          </button>

          <button
            onClick={handleResetOrders}
            className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-1"
            title="Reset sample orders"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* A. MONTHLY SUMMARY (3 Key Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Metric 1: Total Orders */}
        <div className="p-6 bg-zinc-950/90 border border-zinc-900 hover:border-zinc-800 rounded-xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {totalOrders}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 mt-2">
            <span className="text-emerald-400 font-semibold">&bull; Active Period</span>
            <span>in {monthName}</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Metric 2: Total Revenue (₹) */}
        <div className="p-6 bg-zinc-950/90 border border-zinc-900 hover:border-zinc-800 rounded-xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-amber-400 tracking-tight">
            {formatINR(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 mt-2">
            <span>Avg Order Value:</span>
            <span className="text-white font-medium">{formatINR(averageOrderValue)}</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Metric 3: Total Products Sold */}
        <div className="p-6 bg-zinc-950/90 border border-zinc-900 hover:border-zinc-800 rounded-xl relative overflow-hidden group transition-all">
          <div className="flex items-center justify-between mb-3 text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-wider">Total Products Sold</span>
            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            {totalProductsSold} <span className="text-sm font-mono text-zinc-500 font-normal">Units</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 mt-2">
            <span>Direct Orders &bull; High Conversion</span>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />
        </div>

      </div>

      {/* B. SALES CHART SECTION */}
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-6">
        
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                Daily Revenue Curve ({monthName})
              </h3>
              <span className="text-[10px] font-mono uppercase bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded">
                Live LocalStorage
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              X-Axis: Dates of Current Month &bull; Y-Axis: Revenue in Indian Rupees (₹)
            </p>
          </div>

          {/* Chart Controls */}
          <div className="flex items-center gap-2">
            <div className="flex border border-zinc-800 bg-zinc-900 rounded-lg p-0.5">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-xs font-mono uppercase rounded flex items-center gap-1.5 transition-colors ${
                  chartType === 'bar' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Bar</span>
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-xs font-mono uppercase rounded flex items-center gap-1.5 transition-colors ${
                  chartType === 'line' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LineChart className="w-3.5 h-3.5" />
                <span>Line</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hover Tooltip Indicator */}
        <div className="h-6 flex items-center justify-between text-xs font-mono">
          {hoveredDay ? (
            <div className="flex items-center gap-3 text-amber-400">
              <span>Date: <strong>{hoveredDay.dateStr}</strong></span>
              <span>&bull;</span>
              <span>Revenue: <strong>{formatINR(hoveredDay.revenue)}</strong></span>
              <span>&bull;</span>
              <span>Orders: <strong>{hoveredDay.count}</strong></span>
            </div>
          ) : (
            <span className="text-zinc-500">Hover over any day bar or node to inspect details</span>
          )}
          <span className="text-zinc-500 text-[11px]">Peak Day: {formatINR(maxDailyRevenue)}</span>
        </div>

        {/* Interactive SVG Chart */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[640px]">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Defs for gradients */}
              <defs>
                <linearGradient id="goldBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#D97706" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="goldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = paddingY + innerHeight * (1 - ratio);
                const val = maxDailyRevenue * ratio;
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#27272a"
                      strokeDasharray={ratio === 0 ? 'none' : '3 3'}
                      strokeWidth={ratio === 0 ? '1.5' : '1'}
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      fill="#71717a"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      {formatINR(val)}
                    </text>
                  </g>
                );
              })}

              {/* BAR CHART VIEW */}
              {chartType === 'bar' &&
                activeDaysRange.map((item, index) => {
                  const barWidth = Math.max(16, (innerWidth / activeDaysRange.length) * 0.6);
                  const x =
                    paddingX +
                    index * (innerWidth / activeDaysRange.length) +
                    ((innerWidth / activeDaysRange.length) - barWidth) / 2;
                  const barHeight = (item.revenue / maxDailyRevenue) * innerHeight;
                  const y = paddingY + innerHeight - barHeight;

                  const isHovered = hoveredDay?.day === item.day;

                  return (
                    <g
                      key={item.day}
                      onMouseEnter={() => setHoveredDay(item)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className="cursor-pointer group"
                    >
                      {/* Bar Rectangle */}
                      <rect
                        x={x}
                        y={Math.max(paddingY, y)}
                        width={barWidth}
                        height={Math.max(4, barHeight)}
                        rx="3"
                        fill={item.revenue > 0 ? (isHovered ? '#FBBF24' : 'url(#goldBarGrad)') : '#27272a'}
                        className="transition-all duration-150"
                      />

                      {/* X-Axis Date Label */}
                      <text
                        x={x + barWidth / 2}
                        y={chartHeight - 4}
                        fill={isHovered ? '#F59E0B' : '#a1a1aa'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight={isHovered ? 'bold' : 'normal'}
                      >
                        {item.dateStr}
                      </text>

                      {/* Bar Top Value Label */}
                      {item.revenue > 0 && (
                        <text
                          x={x + barWidth / 2}
                          y={Math.max(paddingY - 5, y - 6)}
                          fill={isHovered ? '#FBBF24' : '#d4d4d8'}
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                          fontWeight="bold"
                        >
                          {formatINR(item.revenue)}
                        </text>
                      )}
                    </g>
                  );
                })}

              {/* LINE / AREA CHART VIEW */}
              {chartType === 'line' && (
                <g>
                  {/* Generate Area & Line path */}
                  {(() => {
                    const points = activeDaysRange.map((item, index) => {
                      const step = innerWidth / (activeDaysRange.length - 1 || 1);
                      const x = paddingX + index * step;
                      const y = paddingY + innerHeight - (item.revenue / maxDailyRevenue) * innerHeight;
                      return { x, y, item };
                    });

                    const linePath = points
                      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                      .join(' ');

                    const areaPath = `
                      ${linePath} 
                      L ${points[points.length - 1].x} ${paddingY + innerHeight} 
                      L ${points[0].x} ${paddingY + innerHeight} 
                      Z
                    `;

                    return (
                      <>
                        <path d={areaPath} fill="url(#goldAreaGrad)" />
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {points.map((p) => {
                          const isHovered = hoveredDay?.day === p.item.day;
                          return (
                            <g
                              key={p.item.day}
                              onMouseEnter={() => setHoveredDay(p.item)}
                              onMouseLeave={() => setHoveredDay(null)}
                              className="cursor-pointer"
                            >
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isHovered ? 6 : 4}
                                fill={isHovered ? '#FBBF24' : '#F59E0B'}
                                stroke="#09090b"
                                strokeWidth="2"
                              />
                              <text
                                x={p.x}
                                y={chartHeight - 4}
                                fill={isHovered ? '#F59E0B' : '#a1a1aa'}
                                fontSize="9"
                                fontFamily="monospace"
                                textAnchor="middle"
                              >
                                {p.item.dateStr}
                              </text>
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </g>
              )}
            </svg>
          </div>
        </div>

      </div>

      {/* C. ALL RECENT ORDERS (DATA SOURCE MONITOR) */}
      <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
          <div>
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">
              Orders Ledger (Data Source)
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Persisted in localStorage &bull; Every "Buy Now" and Cart Order appears instantly here
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {orders.length} Total Historical Orders
          </span>
        </div>

        {/* Table of Orders */}
        <div className="border border-zinc-900 rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-zinc-900/60 text-[11px] text-zinc-400 uppercase tracking-wider border-b border-zinc-900">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {orders.map((order) => {
                const dateObj = new Date(order.date);
                const formattedDate = dateObj.toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <tr key={order.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-amber-400">
                      {order.id}
                    </td>
                    <td className="py-3 px-4 text-white font-sans font-medium max-w-[200px] truncate">
                      {order.productName}
                    </td>
                    <td className="py-3 px-4 font-bold text-white font-display">
                      {formatINR(order.price)}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      <div>{order.customerName}</div>
                      <span className="text-[10px] text-zinc-500">{order.phone}</span>
                    </td>
                    <td className="py-3 px-4 text-zinc-400">
                      {formattedDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : order.status === 'Dispatched'
                            ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                            : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'Dispatched' && <Truck className="w-3 h-3" />}
                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                        <span>{order.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          deleteOrder(order.id);
                          showToast('Order removed', 'info');
                        }}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
