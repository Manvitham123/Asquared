import React, { useState, useEffect } from 'react';
import Navbar2 from "../components/Navbar2";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

interface BlogPost {
  title: string;
  author: string;
  date: string;
  slug: string;
  createdAt?: string;
  thumbnail?: string;
}

const BlogUpload: React.FC = () => {
  const [existingPosts, setExistingPosts] = useState<BlogPost[]>([]);
  // Key status by slug (not id)
  const [deleteStatus, setDeleteStatus] = useState<{ [slug: string]: string }>({});

  React.useEffect(() => {
    document.body.classList.add('blogupload-page');
    return () => {
      document.body.classList.remove('blogupload-page');
    };
  }, []);

  // Single blog post state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [contentType, setContentType] = useState("article");
  const [references, setReferences] = useState("");
  const [links, setLinks] = useState<Array<{ text: string, url: string }>>([]);
  const [images, setImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  // Initial fetch of existing blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch token once
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/get-cookie`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          setToken(null);
          return;
        }
        const data = await response.json();
        setToken(data.token ?? null);
      } catch {
        setToken(null);
      }
    };
    fetchToken();
  }, []);

  // Fetch existing blog posts (no auth needed per your backend)
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blog-list`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setExistingPosts(data.blogs);
      } else {
        console.warn('Blog list response indicated failure:', data);
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blog posts');
    }
  };

  // DELETE: use slug as identifier
  const handleDelete = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteStatus(prev => ({ ...prev, [slug]: 'Deleting...' }));

      const response = await fetch(`${API_URL}/api/blog-delete/${slug}`, {
        method: 'DELETE',
        // Don't send Content-Type for an empty DELETE
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setDeleteStatus(prev => ({ ...prev, [slug]: 'Deleted!' }));
        setTimeout(() => {
          setDeleteStatus(prev => {
            const copy = { ...prev };
            delete copy[slug];
            return copy;
          });
          fetchPosts();
        }, 1000);
      } else {
        setDeleteStatus(prev => ({ ...prev, [slug]: data.error || 'Failed to delete' }));
        setTimeout(() => {
          setDeleteStatus(prev => {
            const copy = { ...prev };
            delete copy[slug];
            return copy;
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setDeleteStatus(prev => ({ ...prev, [slug]: 'Error deleting' }));
      setTimeout(() => {
        setDeleteStatus(prev => {
          const copy = { ...prev };
          delete copy[slug];
          return copy;
        });
      }, 3000);
    }
  };

  // Handlers for images
  const handleImagesChange = (files: FileList | null) => {
    if (files) setImages(Array.from(files));
    else setImages([]);
  };
  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Handlers for links
  const addLink = () => setLinks(prev => [...prev, { text: '', url: '' }]);
  const updateLink = (idx: number, field: 'text' | 'url', value: string) => {
    setLinks(prev => prev.map((link, i) => (i === idx ? { ...link, [field]: value } : link)));
  };
  const removeLink = (idx: number) => setLinks(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!thumbnail || !title || !content || !author || images.length === 0) {
      setError("Title, content, author, thumbnail, and at least one image are required.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", author);
    formData.append("contentType", contentType);
    formData.append("references", references);
    formData.append("links", JSON.stringify(links.filter(l => l.text.trim() && l.url.trim())));
    formData.append("date", new Date().toISOString().slice(0, 10));

    images.forEach((file) => {
      if (file.type === 'application/pdf') formData.append("pdfs[]", file);
      else formData.append("images[]", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/blog-upload`, {
        method: "POST",
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });

      let data: any;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        console.error("Raw response text:", text);
        setError("Upload failed: Invalid response from server");
        return;
      }

      if (res.ok) {
        setSuccess("Upload successful!");
        setTitle("");
        setContent("");
        setAuthor("");
        setContentType("article");
        setReferences("");
        setLinks([]);
        setImages([]);
        setThumbnail(null);
        // Refresh list after successful upload
        fetchPosts();
      } else {
        console.error("Upload error response:", data);
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: " + err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/blog");
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar2 />
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '90vh', paddingTop: '4.5rem' }}>
        <button
          onClick={handleLogout}
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '0.6rem 1.2rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          Logout
        </button>

        {/* Upload form */}
        <div style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', maxWidth: 520, width: '100%', margin: '2rem 0', background: 'transparent' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Blog Post Title:
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title"
                required
                style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222' }}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Author:
              <input
                type="text"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                placeholder="Author name"
                required
                style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222' }}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Content Type:
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value)}
                style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222' }}
              >
                <option value="article">Article</option>
                <option value="photoshoot">Photoshoot</option>
                <option value="interview">Interview</option>
                <option value="review">Review</option>
                <option value="editorial">Editorial</option>
                <option value="news">News</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Content:
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your blog post content here..."
                required
                rows={6}
                style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222', resize: 'vertical', minHeight: '120px' }} />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              References/Notes (Optional):
              <textarea
                value={references}
                onChange={e => setReferences(e.target.value)}
                placeholder="Add any additional notes, citations, or text references..."
                rows={3}
                style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222', resize: 'vertical' }}
              />
              <span style={{ fontSize: '0.92rem', color: '#888', marginTop: '0.2rem' }}>Optional: Add notes or text-based references</span>
            </label>

            <div style={{ fontWeight: 500 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Links (Optional):</label>
              {links.map((link, idx) => (
                <div key={`link-${idx}`} style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  padding: '0.75rem',
                  background: '#f9f9f9',
                  borderRadius: '6px',
                  border: '1px solid #ddd'
                }}>
                  <input
                    key={`text-${idx}`}
                    type="text"
                    value={link.text}
                    onChange={e => updateLink(idx, 'text', e.target.value)}
                    placeholder="Link text (e.g., Instagram)"
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '0.95rem',
                      background: '#fff'
                    }}
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={e => updateLink(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    style={{
                      flex: 2,
                      padding: '0.4rem',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      fontSize: '0.95rem',
                      background: '#fff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    style={{
                      background: '#e74c3c',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '0.4rem 0.6rem',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addLink}
                style={{
                  background: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  marginTop: '0.5rem'
                }}
              >
                + Add Link
              </button>
              <span style={{ fontSize: '0.92rem', color: '#888', display: 'block', marginTop: '0.5rem' }}>
                Add clickable links with custom text (e.g., "Instagram" → instagram.com/username)
              </span>
            </div>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Blog Post Images:
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={e => handleImagesChange(e.target.files)}
                required
              />
            </label>

            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      style={{ maxWidth: "120px", margin: "10px 0", borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                    />
                    <button type="button" onClick={() => removeImage(idx)} style={{ position: 'absolute', top: 0, right: 0, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>×</button>
                  </div>
                ))}
              </div>
            )}

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Thumbnail Image:
              <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} required style={{ display: 'block', marginTop: '0.5rem' }} />
              <span style={{ fontSize: '0.92rem', color: '#888', marginTop: '0.2rem' }}>Used in blog listings. Under 2MB recommended.</span>
            </label>

            {thumbnail && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#888' }}>Thumbnail Preview:</span><br />
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail Preview"
                  style={{ maxWidth: "100px", margin: "10px 0", borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              style={{
                background: uploading ? '#aaa' : '#2d72d9',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.7rem',
                fontWeight: 600,
                fontSize: '1.08rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                transition: 'background 0.2s'
              }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{success}</p>}
        </div>

        {/* Existing Blog Posts Section */}
        <div style={{
          borderRadius: '16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: '2.5rem 2rem',
          maxWidth: 520,
          width: '100%',
          margin: '2rem 0',
          background: 'transparent'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.5rem', fontWeight: 600 }}>
            Existing Blog Posts
          </h2>

          {existingPosts.map(post => (
            <div key={post.slug} style={{
              padding: '1rem',
              marginBottom: '1rem',
              background: '#f9f9f9',
              borderRadius: '8px',
              border: '1px solid #ddd',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{post.title}</h3>
                <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                  By {post.author} • {new Date(post.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button
                  onClick={() => handleDelete(post.slug)}
                  disabled={deleteStatus[post.slug] === 'Deleting...'}
                  style={{
                    background: deleteStatus[post.slug] === 'Deleted!' ? '#28a745' : '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '0.5rem 1rem',
                    cursor: deleteStatus[post.slug] === 'Deleting...' ? 'not-allowed' : 'pointer',
                    opacity: deleteStatus[post.slug] === 'Deleting...' ? 0.7 : 1
                  }}
                >
                  {deleteStatus[post.slug] || 'Delete'}
                </button>
              </div>
            </div>
          ))}

          {existingPosts.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666' }}>No blog posts found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogUpload;
