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
        <h1 className="text-2xl font-bold text-[#162723]">Blog Management</h1>
        <Link
          to="/staff/blog/new"
          className="bg-[#162723] text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-[#1a302b] transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create Post
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
          <p className="text-gray-500">Create your first blog post to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      blog.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
