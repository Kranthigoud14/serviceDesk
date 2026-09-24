import React from 'react';
import Badge from '../common/Badge';
import { Flame, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const configs = {
    Critical: {
      variant: 'danger',
      icon: Flame,
      label: 'Critical',
    },
    High: {
      variant: 'warning',
      icon: ArrowUp,
      label: 'High',
    },
    Medium: {
      variant: 'primary',
      icon: AlertTriangle,
      label: 'Medium',
    },
    Low: {
      variant: 'default',
      icon: ArrowDown,
      label: 'Low',
    },
  };

  const cfg = configs[priority] || { variant: 'default', label: priority || 'Medium' };
  const Icon = cfg.icon;

  return (
    <Badge variant={cfg.variant} size="sm">
      {Icon && <Icon className="w-3 h-3" />}
      {cfg.label}
    </Badge>
  );
}

