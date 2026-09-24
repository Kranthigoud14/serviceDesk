const mongoose = require("mongoose");

const knowledgeArticleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Hardware",
                "Software",
                "Network",
                "Access",
                "Email",
                "General",
                "Security",
                "Other"
            ],
            default: "General"
        },
        tags: {
            type: [String],
            default: []
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["Draft", "Published", "Archived"],
            default: "Published"
        },
        views: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

knowledgeArticleSchema.index({ title: "text", content: "text", tags: "text" });
knowledgeArticleSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model("KnowledgeArticle", knowledgeArticleSchema);
