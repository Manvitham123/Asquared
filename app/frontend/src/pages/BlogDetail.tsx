import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
const API_URL = import.meta.env.VITE_API_URL;
//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://d1gmweuuxd5quh.cloudfront.net"; // Updated to use CloudFront for better performance

interface BlogDetail {
  title: string;
  date: string;
  image: string;
  thumbnail: string;
}

const BlogDetailPage: React.FC = () => {
  const { title } = useParams<{ title: string }>();
  const [blog, setBlog] = useState<BlogDetail | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/list-images`)
      .then(res => res.json())
      .then(data => {
        // Find main image and thumbnail for this title
        const mainImage = (data.images || []).find((key: string) => key.startsWith(`images/blog/${title}/`) && !key.includes('thumbnail'));
        const thumbnail = (data.images || []).find((key: string) => key.startsWith(`images/blog/${title}/`) && key.includes('thumbnail'));
        let date = '';
        if (mainImage) {
          const file = mainImage.split('/')[3];
          date = file.split('.')[0];
        }
        if (mainImage && thumbnail) {
          setBlog({
            title: title || '',
            date,
            image: `${S3_PREFIX}/${mainImage}`,
            thumbnail: `${S3_PREFIX}/${thumbnail}`
          });
        }
      });
  }, [title]);

  if (!blog) return <div><Navbar /><main className="p-6">Loading...</main></div>;

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-500 mb-2">{blog.date}</p>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src={blog.image} alt={blog.title} className="w-full max-w-2xl object-cover rounded-lg shadow-md mb-6" style={{maxHeight: 500}} />
        </div>
      </main>
    </div>
  );
};

export default BlogDetailPage;
