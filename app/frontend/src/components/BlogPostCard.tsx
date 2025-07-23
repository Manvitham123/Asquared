import React from "react";

interface BlogPostCardProps {
  image: string;
  title: string;
  uploader: string;
  date: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ image, title, uploader, date }) => (
  <div className="blog-post-card">
    <img src={image.startsWith('http') ? image : `https://d1gmweuuxd5quh.cloudfront.net/images/${image.replace(/^\/+/, '')}`} alt={title} />
    <h2>{title}</h2>
    <p>By {uploader} on {date}</p>
  </div>
);

export default BlogPostCard;