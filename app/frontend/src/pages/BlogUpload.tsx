import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const BlogUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/blog"); // Redirect to landing page after logout
    window.location.reload(); // Optionally force reload to clear state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!image || !thumbnail || !title) {
      setError("All fields are required.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("date", new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    try {
      const res = await fetch(`${API_URL}/api/blog-upload`, {
        method: "POST",
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", jsonErr);
        const text = await res.text();
        console.error("Raw response text:", text);
        setError("Upload failed: Invalid response from server");
        return;
      }
      if (res.ok) {
        setSuccess("Upload successful!");
        setImage(null);
        setThumbnail(null);
        setTitle("");
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

  useEffect(() => {
    fetch(`${API_URL}/auth/get-cookie`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        console.log("Token:", data.token);
        setToken(data.token);
      })
      .catch(() => setToken(null));
  }, []);


  console.log(`id_token=${token}`); // Debugging line to check id_token
      
  return (
    <div style={{ minHeight: '100vh'}}>
      <Navbar />
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
        <div style={{ borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', maxWidth: 420, width: '100%', margin: '2rem 0', background: 'transparent' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Blog Post Image:
              <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required style={{ display: 'block', marginTop: '0.5rem' }} />
              <span style={{ fontSize: '0.92rem', color: '#888', marginTop: '0.2rem' }}>Shown at the top of your post. Under 2MB recommended.</span>
            </label>
            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Thumbnail Image:
              <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} required style={{ display: 'block', marginTop: '0.5rem' }} />
              <span style={{ fontSize: '0.92rem', color: '#888', marginTop: '0.2rem' }}>Used in blog listings. Under 2MB recommended.</span>
            </label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px', border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222' }} />
            <span style={{ fontSize: '0.92rem', color: '#888', marginTop: '-0.7rem', marginBottom: '0.2rem' }}>Enter a descriptive title for your post.</span>
            {image && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#888' }}>Main Image Preview:</span><br />
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{ maxWidth: "200px", margin: "10px 0", borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                />
              </div>
            )}
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
            <button type="submit" disabled={uploading} style={{
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
            }}>{uploading ? "Uploading..." : "Upload"}</button>
          </form>
          {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{success}</p>}
        </div>
      </main>
    </div>
  );
};

export default BlogUpload;