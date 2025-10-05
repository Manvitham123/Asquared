import React from 'react';
import Bottom from '../components/Bottom';

const Home: React.FC = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('home-page');
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a placeholder for your Home page content.</p>
      <Bottom />
    </div>
  );
};

export default Home;
