import { Activity } from 'lucide-react';

export default function OpsisLogo({ size = 'md', className = '' }) {
  const sizes = {
    sm: { icon: 14, text: 'text-base', circle: 'w-7 h-7' },
    md: { icon: 16, text: 'text-xl', circle: 'w-8 h-8' },
    lg: { icon: 20, text: 'text-2xl', circle: 'w-10 h-10' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`${s.circle} rounded-full bg-primary flex items-center justify-center shadow-glow flex-shrink-0`}>
        <Activity size={s.icon} color="white" strokeWidth={2.5} />
      </div>
      <span className={`${s.text} font-bold text-text tracking-tight leading-none`}>
        opsis
      </span>
    </div>
  );
}
