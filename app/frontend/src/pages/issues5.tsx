import React from 'react';
import { Flipbook } from '../components/Flipbook/Flipbook';
import Flipbook2 from '../components/Flipbook/Flipbook2';
import '../assets/css/flipbook.css';
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";

//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://cdn.asquaredmag.org"; // Updated to use new CDN

const pages = [
  `${S3_PREFIX}/images/Winter-2025-issue/cover.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p2.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p3.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p4.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p5.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p6.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p7.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p8.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p9.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p10.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p11.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p12.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p13.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p14.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p15.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p16.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p17.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p18.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p19.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p20.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p21.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p22.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p23.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p24.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p25.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p26.jpg`,
  `${S3_PREFIX}/images/Winter-2025-issue/p27.jpg`,
    `${S3_PREFIX}/images/Winter-2025-issue/p28.jpg`,
];

const Issues5: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('issues5-page');
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.classList.remove('issues5-page');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Navbar2 />
      <div style={{
         background: 'black',
        marginTop: '20px',
        minHeight: '100vh',
        padding: '2rem',
        maxWidth: '100vw'
      }}>
        <div className="issues2-wrapper">
          {isMobile ? (
            <Flipbook2 pages={pages} title="Fall 2024 Edition" />
          ) : (
            <Flipbook pages={pages} title="Fall 2024 Edition" />
          )}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default Issues5;
