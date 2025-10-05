import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import Masonry from 'react-masonry-css';
import '../assets/css/blog.css'
import Bottom from "../components/Bottom";
import Navbar2 from "../components/Navbar2";

const API_URL = import.meta.env.VITE_API_URL;
const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};

// const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://cdn.asquaredmag.org"; // Updated to use new CDN

interface BlogThumb {
  title: string;
  slug: string;
  author: string;
  contentType: string;
  date: string;
  createdAt: string;
  thumbnail: string;
}

const Blog: React.FC = () => {
  const [thumbnails, setThumbnails] = useState<BlogThumb[]>([]);

  // Format date to display month, day, year
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('blog-page');
    return () => {
      document.body.classList.remove('blog-page');
    };
  }, []);

  useEffect(() => {
    // Try to fetch from the new blog list API first
    fetch(`${API_URL}/api/blog-list`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.blogs) {
          // Use the new metadata structure
          setThumbnails(data.blogs);
        } else {
          // Fallback to old method
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
        const thumbs: BlogThumb[] = (data.images || [])
          .filter((key: string) => key.startsWith('images/blog/') && key.includes('/thumbnail'))
          .map((key: string) => {
            const parts = key.split('/');
            const title = parts[2];
            // Find the date from the main image in the same folder
            const mainImage = (data.images || []).find((img: string) => img.startsWith(`images/blog/${title}/`) && !img.includes('thumbnail'));
            let date = '';
            if (mainImage) {
              const file = mainImage.split('/')[3];
              date = file.split('.')[0].split('_')[0];
            }
            console.log(`Processing blog: ${title}, date: ${date}`);
            // Fallback to a very old date if missing or invalid
            const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '1970-01-01';
            return {
              title,
              slug: title,
              author: 'Unknown',
              contentType: 'article',
              date: safeDate,
              createdAt: safeDate,
              thumbnail: `${S3_PREFIX}/${key}`
            };
          });
        // Sort by date descending (most recent first) using Date objects
        thumbs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setThumbnails(thumbs);
      })
      .catch((error) => {
        console.error("Error fetching blog data:", error);
      });
  }, []);

  // Card component to handle dynamic height based on image aspect ratio
  const BlogCard: React.FC<{ post: BlogThumb; idx: number }> = ({ post, idx }) => {
    const defaultHeights = [180, 220, 250, 280];
    const [imgHeight, setImgHeight] = useState<number>(defaultHeights[idx % defaultHeights.length]);

    function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement, Event>) {
      const img = e.currentTarget;
      const aspect = img.naturalHeight / img.naturalWidth;
      // If image is portrait or very tall, make the card taller
      if (aspect > 1.2) {
        setImgHeight(320);
      } else if (aspect > 0.9) {
        setImgHeight(260);
      } else {
        setImgHeight(defaultHeights[idx % defaultHeights.length]);
      }
    }

    return (
      <div className="blog-post-card cursor-pointer group mb-4 flex flex-col items-center">
        <Link to={`/blog/${post.slug || post.title}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full object-cover rounded-lg shadow-md"
            style={{ height: imgHeight, transition: 'height 0.3s' }}
            onLoad={handleImgLoad}
          />
          <h2 className="mt-2 font-semibold text-lg text-center">{post.title.replace(/_/g, ' ')}</h2>
          
          {/* Author and Content Type */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '0.75rem', 
            marginTop: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span style={{
              color: '#666',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'capitalize',
              textDecoration: 'underline'
            }}>
              {post.contentType}
            </span>
            <span style={{
              color: '#666',
              fontSize: '0.85rem',
              fontWeight: 500
            }}>
              by {post.author}
            </span>
          </div>
          
          {/* Formatted Date */}
          <p className="text-center text-gray-500 mt-1" style={{
            fontSize: '0.75rem',
            fontFamily: 'Helvetica, Arial, sans-serif'
          }}>
            {formatDate(post.createdAt || post.date)}
          </p>
        </Link>
      </div>
    );
  };

  // Highlight the most recent post
  const mostRecent = thumbnails.length > 0 ? thumbnails[0] : null;
  const rest = thumbnails.slice(1);

  return (
    <>
      <Navbar2 />
      <div style={{
        background: 'black',
        marginTop: '20px',
        minHeight: 'calc(100vh)',
        padding: '2rem',
        maxWidth: '100vw'
      }}>
        <main className="p-6">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
          {mostRecent && (
            <div key={mostRecent.title} className="blog-post-card most-recent-card cursor-pointer group mb-4 flex flex-col items-center" style={{ gridColumn: 'span 2', width: '100%' }}>
              <Link to={`/blog/${mostRecent.slug || mostRecent.title}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <div style={{ position: 'relative' }}>
                  <img src={mostRecent.thumbnail} alt={mostRecent.title} className="w-full object-cover rounded-lg shadow-lg" style={{ height: 350 }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, background: 'black', color: 'white', padding: '4px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem' }}>New!</span>
                </div>
                <h2 className="mt-2 font-bold text-2xl text-center">{mostRecent.title.replace(/_/g, ' ')}</h2>
                
                {/* Author and Content Type for Featured Post */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  marginTop: '0.75rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    color: '#555',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    textDecoration: 'underline'
                  }}>
                    {mostRecent.contentType}
                  </span>
                  <span style={{
                    color: '#555',
                    fontSize: '0.9rem',
                    fontWeight: 500
                  }}>
                    by {mostRecent.author}
                  </span>
                </div>
                
                <p className="text-center text-gray-500 mt-2" style={{
                  fontSize: '0.8rem',
                  fontFamily: 'Helvetica, Arial, sans-serif'
                }}>
                  {formatDate(mostRecent.createdAt || mostRecent.date)}
                </p>
              </Link>
            </div>
          )}
          {rest.map((post, idx) => (
            <BlogCard key={post.title} post={post} idx={idx} />
          ))}
        </Masonry>
        </main>
      </div>
      <Bottom />
    </>
  );
};

export default Blog;