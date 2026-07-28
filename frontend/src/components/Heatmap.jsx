import React, { useState } from 'react';
import { Calendar, Flame, Zap, Award } from 'lucide-react';

export default function Heatmap({ heatmapData }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate 52 weeks (364 days) leading up to today
  const weeks = [];
  const today = new Date();
  
  // Align start to nearest Sunday ~52 weeks ago
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  // Adjust start to previous Sunday
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek);

  let current = new Date(startDate);

  for (let w = 0; w < 53; w++) {
    const daysInWeek = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = current.toISOString().split('T')[0];
      const data = heatmapData[dateStr] || { count: 0, efficiency: 0, studyHours: 0, items: [] };
      daysInWeek.push({
        date: dateStr,
        dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
        monthName: current.toLocaleDateString('en-US', { month: 'short' }),
        dayNum: current.getDate(),
        ...data
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(daysInWeek);
  }

  // Get Month Labels
  const monthLabels = [];
  let lastMonth = '';
  weeks.forEach((week, weekIndex) => {
    const firstDayOfWeek = week[0];
    if (firstDayOfWeek && firstDayOfWeek.monthName !== lastMonth) {
      monthLabels.push({ month: firstDayOfWeek.monthName, weekIndex });
      lastMonth = firstDayOfWeek.monthName;
    }
  });

  // Calculate stats
  let totalSolved = 0;
  let activeDays = 0;
  let maxEfficiency = 0;

  Object.values(heatmapData).forEach(day => {
    if (day.count > 0) {
      totalSolved += day.count;
      activeDays++;
      if (day.efficiency > maxEfficiency) maxEfficiency = day.efficiency;
    }
  });

  const getHeatColor = (count, efficiency) => {
    if (!count || count === 0) return 'var(--heat-empty)';
    if (efficiency >= 90) return 'var(--heat-level-4)';
    if (efficiency >= 70) return 'var(--heat-level-3)';
    if (efficiency >= 40) return 'var(--heat-level-2)';
    return 'var(--heat-level-1)';
  };

  return (
    <div className="fluent-card fluent-card-glow" style={{ padding: '24px' }}>
      {/* Heatmap Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(16, 185, 129, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#10B981'
          }}>
            <Calendar size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              LeetCode & GitHub Daily Contribution Matrix
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Heatmap intensity scaled by daily problem count & efficiency score
            </p>
          </div>
        </div>

        {/* Heatmap Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <span>Less</span>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--heat-empty)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--heat-level-1)' }} title="1-40% Efficiency" />
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--heat-level-2)' }} title="41-70% Efficiency" />
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--heat-level-3)' }} title="71-89% Efficiency" />
            <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--heat-level-4)', boxShadow: '0 0 6px #34D399' }} title="90-100% Efficiency" />
          </div>
          <span>More / 100% Efficiency</span>
        </div>
      </div>

      {/* Heatmap Grid Area */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        {/* Month Labels */}
        <div style={{ display: 'flex', gap: '4px', paddingLeft: '28px', marginBottom: '6px' }}>
          {monthLabels.map((lbl, idx) => (
            <div key={idx} style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              fontWeight: 600,
              width: `${(monthLabels[idx + 1] ? monthLabels[idx + 1].weekIndex - lbl.weekIndex : 4) * 15}px`
            }}>
              {lbl.month}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {/* Day of week labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, width: '24px', justifyContent: 'space-around' }}>
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          {/* 52 Weeks Columns */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {weeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {week.map((day, dIdx) => {
                  const color = getHeatColor(day.count, day.efficiency);
                  const isHighEff = day.efficiency >= 90 && day.count > 0;
                  return (
                    <div
                      key={dIdx}
                      onMouseEnter={() => setHoveredDay(day)}
                      onMouseLeave={() => setHoveredDay(null)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '3px',
                        backgroundColor: color,
                        boxShadow: isHighEff ? '0 0 6px rgba(52, 211, 153, 0.8)' : 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease',
                        border: day.count > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Info Tooltip Bar */}
      <div style={{
        marginTop: '16px',
        padding: '10px 16px',
        borderRadius: '8px',
        background: 'var(--fluent-surface-2)',
        border: '1px solid var(--fluent-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '44px'
      }}>
        {hoveredDay ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {hoveredDay.monthName} {hoveredDay.dayNum}, {hoveredDay.date.split('-')[0]}
            </span>
            <span style={{ color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flame size={14} /> {hoveredDay.count} Solved
            </span>
            <span style={{ color: '#00BCF2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Award size={14} /> {hoveredDay.efficiency || 0}% Efficiency
            </span>
            <span style={{ color: 'var(--text-muted)' }}>
              ⏱️ {hoveredDay.studyHours || 0} hrs
            </span>
          </div>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={14} color="#00BCF2" />
            <span>Hover over any day square to inspect daily solved problems & efficiency rating</span>
          </div>
        )}

        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Total Solved: <span style={{ color: '#34D399' }}>{totalSolved}</span> | Active Days: <span style={{ color: '#00BCF2' }}>{activeDays}</span>
        </div>
      </div>
    </div>
  );
}
