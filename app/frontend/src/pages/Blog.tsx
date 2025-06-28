import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Modal from "react-modal";
import Masonry from 'react-masonry-css';
import '../assets/css/blog.css';

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1
};

const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";

const blogPosts = [
  { id: 1, image: `${S3_PREFIX}/images/oct-issue/p21.jpg`, title: "First Post", uploader: "Alice", date: "2025-06-26" },
  { id: 2, image: `${S3_PREFIX}/images/oct-issue/p22.jpg`, title: "Second Post", uploader: "Bob", date: "2025-06-24" },
  { id: 3, image: `${S3_PREFIX}/images/oct-issue/p23.jpg`, title: "Third Post", uploader: "Charlie", date: "2025-06-22" },
];

interface BlogPost {
  id: number;
  image: string;
  title: string;
  uploader: string;
  date: string;
}

const Blog: React.FC = () => {
  const isAuthenticated = true; // Replace with real auth
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
        {isAuthenticated && (
          <a href="/blog-upload" className="upload-btn bg-blue-600 text-white px-4 py-2 rounded mb-6 inline-block">Upload New Post</a>
        )}

        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {blogPosts.map(post => (
            <div
              key={post.id}
              className="relative cursor-pointer group mb-4"
              onClick={() => setSelectedPost(post)}
            >
              <img src={post.image} alt={post.title} className="w-full object-cover rounded-lg shadow-md" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-4">
                <h2 className="text-white font-semibold text-lg">{post.title}</h2>
                <p className="text-white text-sm">{post.uploader} • {post.date}</p>
              </div>
            </div>
          ))}
        </Masonry>

        {selectedPost && (
          <Modal
            isOpen={true}
            onRequestClose={() => setSelectedPost(null)}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4"
            overlayClassName=""
          >
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full rounded" />
              <h2 className="text-xl font-bold mt-4">{selectedPost.title}</h2>
              <p className="text-gray-600">Uploaded by {selectedPost.uploader} on {selectedPost.date}</p>
              <button
                onClick={() => setSelectedPost(null)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};

export default Blog;