import React from 'react';
import Badge from '../common/Badge';

export default function AvailabilityBadge({ availability }) {
  const configs = {
    Available: { variant: 'success', label: 'Available', dot: true },
    Busy: { variant: 'warning', label: 'Busy', dot: true },
    Offline: { variant: 'default', label: 'Offline', dot: false },
  };

  const cfg = configs[availability] || { variant: 'default', label: availability || 'Unknown', dot: false };

  return (
    <Badge variant={cfg.variant} dot={cfg.dot} size="sm">
      {cfg.label}
    </Badge>
  );
}

