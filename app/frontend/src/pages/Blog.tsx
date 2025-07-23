import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import Masonry from 'react-masonry-css';
import '../assets/css/blog.css'
const API_URL = import.meta.env.VITE_API_URL;
const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};

// const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://d1gmweuuxd5quh.cloudfront.net"; // Updated to use CloudFront for better performance

interface BlogThumb {
  title: string;
  date: string;
  thumbnail: string;
}

const Blog: React.FC = () => {
  const [thumbnails, setThumbnails] = useState<BlogThumb[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/list-images`)
      .then(res => res.json())
      .then(data => {
        // Find all thumbnails: images/blog/{title}/thumbnail.{ext}
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
              date = file.split('.')[0];
            }
            // Fallback to a very old date if missing or invalid
            const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '1970-01-01';
            return {
              title,
              date: safeDate,
              thumbnail: `${S3_PREFIX}/${key}`
            };
          });
        // Sort by date descending (most recent first) using Date objects
        thumbs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setThumbnails(thumbs);
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
        <Link to={`/blog/${post.title}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full object-cover rounded-lg shadow-md"
            style={{ height: imgHeight, transition: 'height 0.3s' }}
            onLoad={handleImgLoad}
          />
          <h2 className="mt-2 font-semibold text-lg text-center">{post.title.replace(/_/g, ' ')}</h2>
          <p className="text-center text-sm text-gray-500">{post.date}</p>
        </Link>
      </div>
    );
  };

  // Highlight the most recent post
  const mostRecent = thumbnails.length > 0 ? thumbnails[0] : null;
  const rest = thumbnails.slice(1);

  return (
    <div>
      <Navbar />
      <main className="p-6" style={{ marginTop: '80px' }}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {mostRecent && (
            <div key={mostRecent.title} className="blog-post-card most-recent-card cursor-pointer group mb-4 flex flex-col items-center" style={{ gridColumn: 'span 2', width: '100%' }}>
              <Link to={`/blog/${mostRecent.title}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <div style={{ position: 'relative' }}>
                  <img src={mostRecent.thumbnail} alt={mostRecent.title} className="w-full object-cover rounded-lg shadow-lg" style={{ height: 350 }} />
                  <span style={{ position: 'absolute', top: 10, left: 10, background: 'black', color: 'white', padding: '4px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '1rem' }}>New!</span>
                </div>
                <h2 className="mt-2 font-bold text-2xl text-center">{mostRecent.title.replace(/_/g, ' ')}</h2>
                <p className="text-center text-base text-gray-500">{mostRecent.date}</p>
              </Link>
            </div>
          )}
          {rest.map((post, idx) => (
            <BlogCard key={post.title} post={post} idx={idx} />
          ))}
        </Masonry>
      </main>
    </div>
  );
};

export default Blog;