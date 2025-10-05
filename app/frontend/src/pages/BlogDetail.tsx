import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "../components/Navbar2";
import "../assets/css/blogdetail.css";
import Bottom from "../components/Bottom";
const API_URL = import.meta.env.VITE_API_URL;
const S3_PREFIX = "https://cdn.asquaredmag.org"; // CDN path

interface BlogDetail {
  title: string;
  slug: string;
  content: string;
  author: string;
  contentType: string;
  references: string[];
  links: Array<{text: string, url: string}>;
  date: string;
  createdAt: string;
  images: string[];
  pdfs: string[];
  thumbnail: string;
  totalFiles: number;
}

const BlogDetailPage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const [blog, setBlog] = useState<BlogDetail | null>(null);

  useEffect(() => {
    document.body.classList.add("blogdetail-page");
    return () => {
      document.body.classList.remove("blogdetail-page");
    };
  }, []);

  useEffect(() => {
    if (!title) return;
    
    // Try to fetch from the new metadata API first
    fetch(`${API_URL}/api/blog/${title}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.blog) {
          setBlog(data.blog);
        } else {
          // Fallback to old method if new API fails
          return fetch(`${API_URL}/api/list-images`);
        }
      })
      .catch(() => {
        // Fallback to old method
        return fetch(`${API_URL}/api/list-images`);
      })
      .then((res) => {
        if (!res) return; // Already handled by new API
        return res.json();
      })
      .then((data) => {
        if (!data) return; // Already handled by new API
        
        // Old fallback method
        const prefix = `images/blog/${title}/`;
        const allFiles = data.images || [];

        const allImages = allFiles.filter(
          (key: string) =>
            key.startsWith(prefix) &&
            !key.includes("thumbnail") &&
            !key.endsWith(".pdf")
        );

        const pdfs = allFiles.filter(
          (key: string) => key.startsWith(prefix) && key.endsWith(".pdf")
        );

        const thumbnail = allFiles.find(
          (key: string) =>
            key.startsWith(prefix) && key.includes("thumbnail")
        );

        let date = "";
        if (allImages.length > 0) {
          const file = allImages[0].split("/")[3];
          date = file.split("_")[0];
        }

        if ((allImages.length > 0 || pdfs.length > 0) && thumbnail) {
          setBlog({
            title: title || "",
            slug: title || "",
            content: "No content available (legacy post)",
            author: "Unknown",
            contentType: "article",
            references: [],
            links: [],
            date,
            createdAt: date,
            images: allImages.map((img: string) => `${S3_PREFIX}/${img}`),
            pdfs: pdfs.map((pdf: string) => `${S3_PREFIX}/${pdf}`),
            thumbnail: `${S3_PREFIX}/${thumbnail}`,
            totalFiles: allImages.length + pdfs.length,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
      });
  }, [title]);

  if (!blog) {
    return (
      <div style={{ backgroundColor: '#c66297', minHeight: '100vh' }}>
        <Navbar2 />
        <main className="p-6" style={{ color: '#fff' }}>Loading...</main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#c66297', minHeight: '100vh' }}>
      <Navbar2 />
      <div className="issues-overlay-container">
      <main className="p-6">
        {/* Simple Header */}
        
        <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            {blog.title}
          </h1>
          <div style={{
            fontSize: '1rem',
            color: '#fff',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            By {blog.author} • {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })} • {blog.contentType}
          </div>
          {blog.content && (
            <div style={{
              color: '#fff',
              fontSize: '1rem',
              lineHeight: 1.6,
              marginBottom: '2rem',
              whiteSpace: 'pre-wrap'
            }}>
              {blog.content}
            </div>
          )}
        </div>

        {/* Links */}
        {blog.links && blog.links.length > 0 && (
          <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              textAlign: 'left',
              borderBottom: '2px solid #fff',
              paddingBottom: '0.5rem'
            }}>Links</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {blog.links.filter(link => link.text.trim() && link.url.trim()).map((link, idx) => {
                let url = link.url.trim();
                if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                  url = 'https://' + url;
                }
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#fff',
                      backgroundColor: '#8b4513',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      textDecoration: 'underline',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      border: '2px solid #fff',
                      display: 'inline-block',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#c66297';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#712c51ff';
                      e.currentTarget.style.color = '#fff';
                    }}
                  >
                    {link.text}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* References */}
        {blog.references && blog.references.length > 0 && (
          <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
            <h3 style={{ 
              color: '#fff', 
              fontSize: '1.2rem', 
              marginBottom: '1rem',
              textAlign: 'left',
              borderBottom: '2px solid #fff',
              paddingBottom: '0.5rem'
            }}>References</h3>
            <ul style={{ color: '#fff', paddingLeft: '1.5rem' }}>
              {blog.references.filter(ref => ref.trim()).map((ref, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Images */}
        {blog.images.length > 0 && (
          <div style={{ 
            maxWidth: '800px', 
            margin: '0 auto', 
            marginBottom: '2rem',
            background: '#111',
            border: '2px solid #222',
            borderRadius: '12px',
            padding: '2rem'
          }}>
            {blog.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${blog.title} image ${idx + 1}`}
                style={{
                  width: "100%",
                  height: 'auto',
                  marginBottom: idx !== blog.images.length - 1 ? '2rem' : 0,
                  borderRadius: '8px'
                }}
              />
            ))}
          </div>
        )}

        {/* PDFs */}
        {blog.pdfs.length > 0 && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {blog.pdfs.map((pdfUrl, idx) => {
              let viewerUrl = pdfUrl;
              if (pdfUrl.includes('#')) {
                viewerUrl = pdfUrl + '&toolbar=0';
              } else if (pdfUrl.includes('?')) {
                viewerUrl = pdfUrl + '#toolbar=0';
              } else {
                viewerUrl = pdfUrl + '#toolbar=0';
              }
              return (
                <div key={idx} style={{ marginBottom: '2rem' }}>
                  <iframe
                    src={viewerUrl}
                    title={`PDF ${idx + 1}`}
                    width="100%"
                    height="1200px"
                    style={{ 
                      border: "1px solid #333", 
                      borderRadius: "8px",
                      minHeight: "1200px",
                      display: "block"
                    }}
                    scrolling="yes"
                  />
                  <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#66d9f7', textDecoration: 'none' }}
                    >
                      View in new tab
                    </a>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
      </div>
      <Bottom />
    </div>
  );
};

export default BlogDetailPage;
