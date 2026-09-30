import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const OPTIONS: Array<{ value: Unit; label: string }> = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' },
];

export default function UnitToggle({ unit, onChange }: UnitToggleProps) {
  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === unit;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 ${
              isActive ? 'bg-accent-400 text-night-900' : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
