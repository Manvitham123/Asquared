import React from 'react';
import { Flipbook } from '../components/Flipbook/Flipbook';
import Flipbook2 from '../components/Flipbook/Flipbook2';
import '../assets/css/flipbook.css';
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";

//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://cdn.asquaredmag.org"; // Updated to use new CDN

const pages = [
  `${S3_PREFIX}/images/oct-issue/cover.jpg`,
  `${S3_PREFIX}/images/oct-issue/p2.jpg`,
  `${S3_PREFIX}/images/oct-issue/p3.jpg`,
  `${S3_PREFIX}/images/oct-issue/p4.jpg`,
  `${S3_PREFIX}/images/oct-issue/p5.jpg`,
  `${S3_PREFIX}/images/oct-issue/p6.jpg`,
  `${S3_PREFIX}/images/oct-issue/p7.jpg`,
  `${S3_PREFIX}/images/oct-issue/p8.jpg`,
  `${S3_PREFIX}/images/oct-issue/p9.jpg`,
  `${S3_PREFIX}/images/oct-issue/p10.jpg`,
  `${S3_PREFIX}/images/oct-issue/p11.jpg`,
  `${S3_PREFIX}/images/oct-issue/p12.jpg`,
  `${S3_PREFIX}/images/oct-issue/p13.jpg`,
  `${S3_PREFIX}/images/oct-issue/p14.jpg`,
  `${S3_PREFIX}/images/oct-issue/p15.jpg`,
  `${S3_PREFIX}/images/oct-issue/p16.jpg`,
  `${S3_PREFIX}/images/oct-issue/p17.jpg`,
  `${S3_PREFIX}/images/oct-issue/p18.jpg`,
  `${S3_PREFIX}/images/oct-issue/p19.jpg`,
  `${S3_PREFIX}/images/oct-issue/p20.jpg`,
  `${S3_PREFIX}/images/oct-issue/p21.jpg`,
  `${S3_PREFIX}/images/oct-issue/p22.jpg`,
  `${S3_PREFIX}/images/oct-issue/p23.jpg`,
  `${S3_PREFIX}/images/oct-issue/p24.jpg`,
  `${S3_PREFIX}/images/oct-issue/p25.jpg`,
  `${S3_PREFIX}/images/oct-issue/p26.jpg`,
];

const Issues3: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('issues3-page');
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.classList.remove('issues3-page');
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
            <Flipbook2 pages={pages} title="Fall 2023 Edition" />
          ) : (
            <Flipbook pages={pages} title="Fall 2023 Edition" />
          )}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default Issues3;
