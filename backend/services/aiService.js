// AI Service with Intelligent Heuristic Engine + External Gemini LLM Integration

const summarizeTicket = async ({ title = "", description = "", category = "" }) => {
    // 1. Check if Gemini API is configured
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        try {
            const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are an IT Service Desk AI. Summarize the following incident in 2-3 concise, professional operational sentences.\nTitle: ${title}\nCategory: ${category}\nDescription: ${description}`
                        }]
                    }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    return {
                        summary: text.trim(),
                        provider: "Gemini 3.8 Flash"
                    };
                }
            } else {
                console.warn(`Gemini API returned status ${response.status}. Falling back to local heuristic engine.`);
            }
        } catch (err) {
            console.warn("External Gemini API call failed, falling back to local heuristic engine:", err.message);
        }
    }

    // Heuristic NLP Engine Fallback
    const cleanDesc = description.trim();
    const sentences = cleanDesc.split(/(?<=[.?!])\s+/).filter(s => s.length > 5);
    const primarySentence = sentences[0] || cleanDesc;
    const secondarySentence = sentences[1] ? ` ${sentences[1]}` : "";

    const summary = `Incident reported for ${category || "IT services"} regarding "${title}". Primary symptom: ${primarySentence}${secondarySentence} Action is required to diagnose and restore standard service operations.`;

    return {
        summary,
        keyPoints: sentences.slice(0, 3),
        provider: "ServiceDesk Pro AI Engine (Heuristic v2)"
    };
};

const classifyTicket = async ({ title = "", description = "" }) => {
    const text = `${title} ${description}`.toLowerCase();

    // Classification keyword dictionaries
    const categories = {
        Hardware: ["laptop", "desktop", "monitor", "printer", "keyboard", "mouse", "screen", "cable", "power", "battery", "charger", "motherboard", "ram", "cpu", "disk", "ssd", "hardware", "dock", "headset"],
        Network: ["wifi", "wi-fi", "internet", "vpn", "ethernet", "router", "switch", "latency", "dns", "gateway", "ip", "connection", "disconnected", "firewall", "bandwidth"],
        Access: ["password", "login", "locked", "unlock", "permission", "access", "mfa", "2fa", "credential", "account", "active directory", "sso", "reset", "role"],
        Software: ["install", "crash", "error", "bug", "software", "application", "app", "excel", "outlook", "teams", "browser", "windows", "os", "update", "patch", "license", "freeze"],
        Email: ["email", "outlook", "mailbox", "spam", "inbox", "smtp", "exchange", "phishing", "attachment", "bounce", "delivery"]
    };

    let matchedCategory = "Other";
    let highestScore = 0;

    for (const [cat, keywords] of Object.entries(categories)) {
        let score = 0;
        keywords.forEach(kw => {
            if (text.includes(kw)) score += 2;
        });
        if (score > highestScore) {
            highestScore = score;
            matchedCategory = cat;
        }
    }

    // Priority Assessment
    const criticalKeywords = ["server down", "production down", "outage", "data loss", "security breach", "ransomware", "emergency", "all users", "cannot work", "critical"];
    const highKeywords = ["urgent", "asap", "boss", "executive", "deadline", "broken", "blocked", "vip", "cannot login", "high priority"];
    const lowKeywords = ["request", "when possible", "minor", "typo", "question", "how to", "inquiry", "low priority", "enhancement"];

    let suggestedPriority = "Medium";
    let priorityRationale = "Standard impact on daily operations with regular resolution turnaround.";

    if (criticalKeywords.some(kw => text.includes(kw))) {
        suggestedPriority = "Critical";
        priorityRationale = "Detected severe operational impact, system outage, or broad user disruption.";
    } else if (highKeywords.some(kw => text.includes(kw))) {
        suggestedPriority = "High";
        priorityRationale = "Work blockage or time-sensitive issue affecting key workflow.";
    } else if (lowKeywords.some(kw => text.includes(kw))) {
        suggestedPriority = "Low";
        priorityRationale = "Non-blocking inquiry, standard request, or cosmetic item.";
    }

    return {
        suggestedCategory: matchedCategory,
        suggestedPriority,
        priorityRationale,
        confidence: Math.min(Math.round((highestScore / 6) * 100) || 75, 95),
        provider: "ServiceDesk Pro AI Classifier (Heuristic)"
    };
};

const suggestResolution = async ({ title = "", description = "", category = "" }) => {
    const text = `${title} ${description} ${category}`.toLowerCase();

    let steps = [];
    let rootCauses = [];

    if (text.includes("wifi") || text.includes("network") || text.includes("vpn") || text.includes("internet")) {
        rootCauses = ["DHCP lease expiration or IP conflict", "Local network adapter driver glitch", "VPN gateway certificate mismatch or firewall block"];
        steps = [
            "Verify physical connectivity or wireless SSID association and signal strength.",
            "Flush local DNS cache and renew IP configuration (ipconfig /flushdns && ipconfig /renew).",
            "Verify VPN client profile settings, active credentials, and endpoint certificates.",
            "Reboot network interface adapter or test via secondary gateway."
        ];
    } else if (text.includes("password") || text.includes("login") || text.includes("locked") || text.includes("access")) {
        rootCauses = ["Consecutive invalid password attempts triggering security lockout", "Expired corporate credentials or directory sync latency", "MFA authenticator app de-synchronization"];
        steps = [
            "Inspect Active Directory user status and clear any active lockout flags.",
            "Initiate a secure self-service password reset or dispatch temporary OTP token.",
            "Verify MFA token registration and synchronize time offsets on authenticator device.",
            "Test authentication in private browser session to eliminate cached browser tokens."
        ];
    } else if (text.includes("laptop") || text.includes("hardware") || text.includes("monitor") || text.includes("printer")) {
        rootCauses = ["Peripheral driver incompatibility or firmware corruption", "Hardware power cycle failure or loose docking connection", "Display driver or thermal throttle condition"];
        steps = [
            "Perform a 30-second hard power discharge of the peripheral / workstation.",
            "Inspect and reseat all physical power, HDMI/DisplayPort, and USB-C dock cables.",
            "Update OEM hardware drivers and verify peripheral recognition in Device Manager.",
            "Check Asset Management inventory for active warranty coverage if replacement is needed."
        ];
    } else {
        rootCauses = ["Application runtime cache corruption", "Background process lock or conflicting background task", "Missing software update or missing permission elevation"];
        steps = [
            "Review system event logs / error codes associated with the reported timestamp.",
            "Terminate hung application processes and clear temporary application cache files.",
            "Verify software version compatibility and apply pending maintenance patches.",
            "Test application under standard user privileges vs elevated profile to isolate permissions."
        ];
    }

    return {
        suggestedSteps: steps,
        potentialRootCauses: rootCauses,
        safetyChecklist: [
            "Ensure user files and work are backed up before restarting services.",
            "Obtain user confirmation before executing elevated administrative commands.",
            "Capture screenshot or photo proof of final test for OTP verification."
        ],
        provider: "ServiceDesk Pro Knowledge Playbook (Heuristic)"
    };
};

const getTicketInsights = async (ticket) => {
    const text = `${ticket.title} ${ticket.description}`.toLowerCase();
    
    // Calculate estimated resolution time in minutes
    let estimatedMinutes = 60;
    if (ticket.priority === "Critical") estimatedMinutes = 30;
    else if (ticket.priority === "High") estimatedMinutes = 90;
    else if (ticket.priority === "Low") estimatedMinutes = 180;

    const difficulty = ticket.priority === "Critical" ? "High" : ticket.priority === "High" ? "Medium-High" : "Standard";

    return {
        estimatedResolutionMinutes: estimatedMinutes,
        difficultyLevel: difficulty,
        slaUrgencyNotice: ticket.priority === "Critical" ? "Requires immediate response within 4h SLA window." : "Standard queue handling.",
        requiredSkillTags: [ticket.category, ticket.priority === "Critical" ? "Incident Response" : "Diagnostics"],
        provider: "ServiceDesk Pro Operations AI"
    };
};

module.exports = {
    summarizeTicket,
    classifyTicket,
    suggestResolution,
    getTicketInsights
};
