import React, { useState } from "react";
import Navbar from "../components/Navbar";

const BlogUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const res = await fetch("http://localhost:5001/api/blog-upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Upload successful!");
        setImage(null);
        setThumbnail(null);
        setTitle("");
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main>
        <h1>Upload Blog Post</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Blog Post Image:
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required />
          </label>
          <label style={{marginTop: '10px', display: 'block'}}>
            Thumbnail Image:
            <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files?.[0] || null)} required />
          </label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required style={{marginTop: '10px'}} />
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ maxWidth: "200px", margin: "10px 0" }}
            />
          )}
          {thumbnail && (
            <img
              src={URL.createObjectURL(thumbnail)}
              alt="Thumbnail Preview"
              style={{ maxWidth: "100px", margin: "10px 0" }}
            />
          )}
          <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </main>
    </div>
  );
};

export default BlogUpload;