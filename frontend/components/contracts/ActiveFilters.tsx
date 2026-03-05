import { X } from 'lucide-react';

interface FilterChip {
  id: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFiltersProps {
  chips: FilterChip[];
  onClearAll: () => void;
}

export function ActiveFilters({ chips, onClearAll }: ActiveFiltersProps) {
  if (chips.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {chips.map((chip) => (
        <button
          type="button"
          key={chip.id}
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-primary/30 bg-primary/10 text-primary"
        >
          {chip.label}
          <X className="w-3 h-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:bg-accent"
      >
        Clear all filters
      </button>
    </div>
  );
}
