const KnowledgeArticle = require("../models/KnowledgeArticle");
const { logAction } = require("../services/auditService");

// @desc    Get all knowledge articles
// @route   GET /api/knowledge-base
// @access  Private
const getArticles = async (req, res) => {
    try {
        const { search, category, tag, status } = req.query;
        const query = {};

        const canViewUnpublished = ["System Admin", "IT Manager"].includes(req.user.role);

        if (!canViewUnpublished) {
            query.status = "Published";
        } else if (status) {
            query.status = status;
        }

        if (category && category !== "All") {
            query.category = category;
        }

        if (tag) {
            query.tags = tag;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $regex: search, $options: "i" } }
            ];
        }

        const articles = await KnowledgeArticle.find(query)
            .populate("author", "name email role")
            .sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: articles.length,
            articles
        });
    } catch (error) {
        console.error("Get knowledge articles error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve knowledge articles",
            error: error.message
        });
    }
};

// @desc    Get category summary counts
// @route   GET /api/knowledge-base/categories
// @access  Private
const getCategories = async (req, res) => {
    try {
        const canViewUnpublished = ["System Admin", "IT Manager"].includes(req.user.role);
        const match = canViewUnpublished ? {} : { status: "Published" };

        const summary = await KnowledgeArticle.aggregate([
            { $match: match },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            categories: summary
        });
    } catch (error) {
        console.error("Get categories error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve categories",
            error: error.message
        });
    }
};

// @desc    Get knowledge article by ID
// @route   GET /api/knowledge-base/:id
// @access  Private
const getArticleById = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findById(req.params.id)
            .populate("author", "name email role");

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Knowledge article not found"
            });
        }

        const canViewUnpublished = ["System Admin", "IT Manager"].includes(req.user.role);
        if (!canViewUnpublished && article.status !== "Published") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this article"
            });
        }

        // Increment view count
        article.views += 1;
        await article.save();

        res.status(200).json({
            success: true,
            article
        });
    } catch (error) {
        console.error("Get article error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve article",
            error: error.message
        });
    }
};

// @desc    Create knowledge article
// @route   POST /api/knowledge-base
// @access  Private (System Admin, IT Manager)
const createArticle = async (req, res) => {
    try {
        const { title, content, category, tags, status } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required"
            });
        }

        const article = await KnowledgeArticle.create({
            title,
            content,
            category: category || "General",
            tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []),
            status: status || "Published",
            author: req.user._id
        });

        await logAction({
            actor: req.user._id,
            action: "KNOWLEDGE_ARTICLE_CREATED",
            entityType: "KNOWLEDGE",
            entityId: article._id,
            description: `Created knowledge article "${article.title}" in category ${article.category}`
        });

        res.status(201).json({
            success: true,
            message: "Article created successfully",
            article
        });
    } catch (error) {
        console.error("Create article error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create article",
            error: error.message
        });
    }
};

// @desc    Update knowledge article
// @route   PUT /api/knowledge-base/:id
// @access  Private (System Admin, IT Manager)
const updateArticle = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        const { title, content, category, tags, status } = req.body;

        if (title !== undefined) article.title = title;
        if (content !== undefined) article.content = content;
        if (category !== undefined) article.category = category;
        if (status !== undefined) article.status = status;
        if (tags !== undefined) {
            article.tags = Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim());
        }

        await article.save();

        await logAction({
            actor: req.user._id,
            action: "KNOWLEDGE_ARTICLE_UPDATED",
            entityType: "KNOWLEDGE",
            entityId: article._id,
            description: `Updated knowledge article "${article.title}"`
        });

        res.status(200).json({
            success: true,
            message: "Article updated successfully",
            article
        });
    } catch (error) {
        console.error("Update article error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update article",
            error: error.message
        });
    }
};

// @desc    Delete knowledge article
// @route   DELETE /api/knowledge-base/:id
// @access  Private (System Admin, IT Manager)
const deleteArticle = async (req, res) => {
    try {
        const article = await KnowledgeArticle.findById(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: "Article not found"
            });
        }

        await KnowledgeArticle.findByIdAndDelete(req.params.id);

        await logAction({
            actor: req.user._id,
            action: "KNOWLEDGE_ARTICLE_DELETED",
            entityType: "KNOWLEDGE",
            entityId: req.params.id,
            description: `Deleted knowledge article "${article.title}"`
        });

        res.status(200).json({
            success: true,
            message: "Article deleted successfully"
        });
    } catch (error) {
        console.error("Delete article error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete article",
            error: error.message
        });
    }
};

module.exports = {
    getArticles,
    getCategories,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};
