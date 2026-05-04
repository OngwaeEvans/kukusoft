import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  id?: string;
}

export function ActionCard({ icon: Icon, title, subtitle, onClick, variant = 'primary', id }: ActionCardProps) {
  const iconColors = {
    primary: 'bg-emerald-500 text-white shadow-emerald-200',
    secondary: 'bg-amber-500 text-white shadow-amber-200',
    accent: 'bg-slate-800 text-white shadow-slate-200'
  };

  return (
    <motion.button
      id={id}
      whileHover={{ y: -4, shadow: '0 12px 24px rgba(0,0,0,0.05)' }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card p-6 text-left w-full h-full min-h-[160px] flex flex-col justify-between group active:border-emerald-500/20 transition-colors"
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110 ${iconColors[variant]}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-display text-xl text-ink">{title}</h3>
        <p className="text-sm font-medium text-slate-400 mt-1">{subtitle}</p>
      </div>
    </motion.button>
  );
}
