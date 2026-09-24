const {
    summarizeTicket,
    classifyTicket,
    suggestResolution,
    getTicketInsights
} = require("../services/aiService");
const Ticket = require("../models/Ticket");

// @desc    Summarize a ticket
// @route   POST /api/ai/summarize
// @access  Private
const summarize = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        if (!description) {
            return res.status(400).json({
                success: false,
                message: "Description is required for summarization"
            });
        }
        const result = await summarizeTicket({ title, description, category });
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("AI Summarize error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate AI summary",
            error: error.message
        });
    }
};

// @desc    Classify and suggest category / priority
// @route   POST /api/ai/classify
// @access  Private
const classify = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title && !description) {
            return res.status(400).json({
                success: false,
                message: "Title or description is required for classification"
            });
        }
        const result = await classifyTicket({ title, description });
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("AI Classify error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to classify ticket",
            error: error.message
        });
    }
};

// @desc    Suggest troubleshooting / resolution steps
// @route   POST /api/ai/suggest-resolution
// @access  Private
const suggestSteps = async (req, res) => {
    try {
        const { title, description, category } = req.body;
        const result = await suggestResolution({ title, description, category });
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("AI Suggest Resolution error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to suggest resolution steps",
            error: error.message
        });
    }
};

// @desc    Get ticket operational insights
// @route   GET /api/ai/insights/:ticketId
// @access  Private
const getInsights = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId);
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }
        const insights = await getTicketInsights(ticket);
        res.status(200).json({
            success: true,
            data: insights
        });
    } catch (error) {
        console.error("AI Insights error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate ticket insights",
            error: error.message
        });
    }
};

module.exports = {
    summarize,
    classify,
    suggestSteps,
    getInsights
};
