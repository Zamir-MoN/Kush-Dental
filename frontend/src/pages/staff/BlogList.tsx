import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, FileText, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../../lib/apiClient';

interface Blog {
  id: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  publishedAt: string | null;
}

export const BlogList: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient<any>('/api/v1/blog', { method: 'GET' });
      setBlogs(response);
      setError(null);
    } catch (err: any) {
      setError(err.details?.detail || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await apiClient(`/api/v1/blog/${id}`, { method: 'DELETE' });
      setBlogs(blogs.filter((b) => b.id !== id));
    } catch (err) {
      alert('Failed to delete blog post');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await apiClient(`/api/v1/blog/${id}/publish`, { method: 'POST' });
      fetchBlogs();
    } catch (err) {
      alert('Failed to publish blog post');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await apiClient(`/api/v1/blog/${id}/unpublish`, { method: 'POST' });
      fetchBlogs();
    } catch (err) {
      alert('Failed to unpublish blog post');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading blogs...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Blog Management</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Publish articles and manage SEO blog content.</p>
        </div>
        <Link
          to="/staff/blog/new"
          className="bg-gradient-to-r from-[#E5B22D] via-[#DCA51B] to-[#C49216] hover:brightness-105 text-[#141518] px-4 py-2.5 rounded-xl font-bold flex items-center shadow-xs transition-all"
        >
          <Plus size={18} className="mr-2" />
          Create Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xs border border-[#E8E2D5] p-12 text-center">
          <FileText size={48} className="mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-bold text-zinc-900 mb-1">No blog posts yet</h3>
          <p className="text-zinc-500 text-sm">Create your first blog post to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-xs rounded-2xl border border-[#E8E2D5] overflow-hidden">
          <table className="min-w-full divide-y divide-[#E8E2D5]">
            <thead className="bg-[#FAF7F2]">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold text-zinc-600 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold text-zinc-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8E2D5]">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-zinc-900">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      blog.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-[#FAF3E0] text-[#8C6B14] border border-[#DCA51B]/30'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    {blog.status === 'DRAFT' ? (
                      <button onClick={() => handlePublish(blog.id)} className="text-green-600 hover:text-green-900" title="Publish">
                        <CheckCircle size={18} />
                      </button>
                    ) : (
                      <button onClick={() => handleUnpublish(blog.id)} className="text-amber-600 hover:text-amber-900" title="Unpublish">
                        <XCircle size={18} />
                      </button>
                    )}
                    <Link to={`/staff/blog/${blog.id}/edit`} className="text-blue-600 hover:text-blue-900 inline-block">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(blog.id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
