
import React from 'react';

const Blog2Upload: React.FC = () => {
  React.useEffect(() => {
    document.body.classList.add('blog2upload-page');
    return () => {
      document.body.classList.remove('blog2upload-page');
    };
  }, []);
  return <div>Blog2 Upload Page</div>;
};

export default Blog2Upload;
