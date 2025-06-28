import React from "react";

interface BlogPostCardProps {
  image: string;
  title: string;
  uploader: string;
  date: string;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ image, title, uploader, date }) => (
  <div className="blog-post-card">
    <img src={image} alt={title} />
    <h2>{title}</h2>
    <p>By {uploader} on {date}</p>
  </div>
);

export default BlogPostCard;