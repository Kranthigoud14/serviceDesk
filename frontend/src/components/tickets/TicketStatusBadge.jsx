import React from 'react';
import Badge from '../common/Badge';

export default function TicketStatusBadge({ status }) {
  const configs = {
    Open: { variant: 'cyan', label: 'Open', dot: true },
    Assigned: { variant: 'primary', label: 'Assigned', dot: true },
    'In Progress': { variant: 'warning', label: 'In Progress', dot: true },
    Resolved: { variant: 'violet', label: 'Resolved (Pending Verification)', dot: true },
    Closed: { variant: 'success', label: 'Verified & Closed', dot: false },
    Reopened: { variant: 'danger', label: 'Reopened', dot: true },
  };

  const cfg = configs[status] || { variant: 'default', label: status || 'Unknown', dot: false };

  return (
    <Badge variant={cfg.variant} dot={cfg.dot} size="sm">
      {cfg.label}
    </Badge>
  );
}

