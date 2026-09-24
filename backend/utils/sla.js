// ==========================================
// SLA CONFIGURATION
// ==========================================

const SLA_HOURS = {
    Low: 72,
    Medium: 24,
    High: 8,
    Critical: 4
};

// ==========================================
// CALCULATE SLA DUE DATE
// ==========================================

const calculateSlaDueAt = (priority, createdAt = new Date()) => {
    const hours = SLA_HOURS[priority];

    if (!hours) {
        throw new Error("Invalid ticket priority");
    }

    const dueDate = new Date(createdAt);

    dueDate.setHours(dueDate.getHours() + hours);

    return dueDate;
};

// ==========================================
// GET SLA HOURS
// ==========================================

const getSlaHours = (priority) => {
    return SLA_HOURS[priority] || null;
};

// ==========================================
// GET SLA STATUS
// ==========================================

const getSlaStatus = (slaDueAt, status) => {

    // Resolved and closed tickets have completed their SLA
    if (status === "Resolved" || status === "Closed") {
        return "Completed";
    }

    const now = new Date();
    const dueDate = new Date(slaDueAt);

    // SLA has expired
    if (now >= dueDate) {
        return "Overdue";
    }

    // Calculate remaining time
    const remainingMilliseconds = dueDate - now;
    const remainingHours =
        remainingMilliseconds / (1000 * 60 * 60);

    // Less than 2 hours remaining
    if (remainingHours <= 2) {
        return "Due Soon";
    }

    return "On Track";
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
    SLA_HOURS,
    calculateSlaDueAt,
    getSlaHours,
    getSlaStatus
};