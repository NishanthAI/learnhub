interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className = "", 
  showLabel = true,
  label 
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>{label || "Progress"}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
