export function getRemainingTimeText(slaDueAt, status) {
  if (status === 'Resolved' || status === 'Closed') {
    return { text: 'Met SLA', isOverdue: false, isWarning: false, isDone: true };
  }
  if (!slaDueAt) {
    return { text: 'No SLA', isOverdue: false, isWarning: false, isDone: false };
  }

  const due = new Date(slaDueAt).getTime();
  const now = Date.now();
  const diff = due - now;

  if (diff <= 0) {
    const overdueMs = Math.abs(diff);
    const overdueHours = Math.floor(overdueMs / (1000 * 60 * 60));
    const overdueMins = Math.floor((overdueMs % (1000 * 60 * 60)) / (1000 * 60));
    return {
      text: overdueHours > 0 ? `Overdue by ${overdueHours}h ${overdueMins}m` : `Overdue by ${overdueMins}m`,
      isOverdue: true,
      isWarning: false,
      isDone: false
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const isWarning = hours < 2;

  return {
    text: `${hours}h ${mins}m left`,
    isOverdue: false,
    isWarning,
    isDone: false
  };
}

export function getSlaColorClass(slaStatus, isTicketClosed) {
  if (isTicketClosed || slaStatus === 'Completed') {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }
  if (slaStatus === 'Overdue') {
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse';
  }
  if (slaStatus === 'Due Soon') {
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
  return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
}
