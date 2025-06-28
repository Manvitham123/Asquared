import React, { useState } from "react";
import Navbar from "../components/Navbar";

const BlogUpload: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Upload logic here (API call)
    // On success: redirect to /blog
  };

  return (
    <div>
      <Navbar />
      <main>
        <h1>Upload Blog Post</h1>
        <form onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} required />
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
            {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ maxWidth: "200px", margin: "10px 0" }}
            />
            )}
          <button type="submit">Upload</button>
        </form>
      </main>
    </div>
  );
};

export default BlogUpload;