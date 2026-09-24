import React, { useEffect, useState } from 'react';
import { useKnowledgeStore } from '../../store/knowledgeStore';
import { useAuthStore } from '../../store/authStore';
import {
  BookOpen,
  Search,
  Plus,
  Eye,
  Tag,
  Clock,
  Sparkles,
  Edit3,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import Button from '../../components/common/Button';
import ArticleModal from '../../components/knowledge/ArticleModal';
import { TableSkeleton } from '../../components/common/Skeleton';
import { formatDate } from '../../utils/formatters';

const CATEGORIES = ['All', 'Hardware', 'Software', 'Network', 'Access', 'Email', 'Security', 'General'];

export default function KnowledgeBasePage() {
  const { user } = useAuthStore();
  const {
    articles,
    categories,
    loading,
    fetchArticles,
    fetchCategories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useKnowledgeStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const canManage = ['System Admin', 'IT Manager'].includes(user?.role);

  useEffect(() => {
    fetchArticles({
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      search: searchQuery.trim() || undefined,
    });
    fetchCategories();
  }, [selectedCategory, searchQuery]);

  const handleOpenCreate = () => {
    setSelectedArticle(null);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleOpenView = (art) => {
    setSelectedArticle(art);
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (art, e) => {
    e.stopPropagation();
    setSelectedArticle(art);
    setIsEditing(true);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            Enterprise Knowledge Base & Self-Service
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-1">
            IT Solution Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse verified troubleshooting procedures, hardware setups, and self-help articles.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreate}
          >
            Create Article
          </Button>
        )}
      </div>

      {/* Search & Category Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solutions by keyword, error code, or tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <TableSkeleton rows={6} cols={3} />
      ) : articles.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No Knowledge Articles Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No published articles match your filter criteria. Try searching with different keywords.
          </p>
          {canManage && (
            <Button size="sm" variant="primary" icon={Plus} onClick={handleOpenCreate}>
              Publish First Article
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((art) => (
            <div
              key={art._id}
              onClick={() => handleOpenView(art)}
              className="group p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900/90 hover:border-cyan-500/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-sm hover:shadow-lg hover:shadow-cyan-500/5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-semibold uppercase tracking-wider">
                    {art.category}
                  </span>
                  {canManage && (
                    <button
                      type="button"
                      title="Edit Article"
                      onClick={(e) => handleOpenEdit(art, e)}
                      className="text-slate-500 hover:text-cyan-400 p-1 rounded hover:bg-slate-800 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {art.content}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> {art.views || 0}
                </span>
                <span>Updated {formatDate(art.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View / Edit */}
      <ArticleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        article={selectedArticle}
        isEditing={isEditing}
      />
    </div>
  );
}
