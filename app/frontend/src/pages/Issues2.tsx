import React from 'react';
import { Flipbook } from '../components/Flipbook/Flipbook';
import Flipbook2 from '../components/Flipbook/Flipbook2';
import '../assets/css/flipbook.css';
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";

//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://cdn.asquaredmag.org"; // Updated to use new CDN

const pages = [
  `${S3_PREFIX}/images/Spring-issue/cover.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p2.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p3.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p4.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p5.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p6.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p7.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p8.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p9.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p10.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p11.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p12.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p13.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p14.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p15.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p16.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p17.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p18.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p19.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p20.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p21.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p22.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p23.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p24.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p25.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p26.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p27.jpg`,
  `${S3_PREFIX}/images/Spring-issue/p28.jpg`,
];

const Issues2: React.FC = () => {

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('issues2-page');
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.classList.remove('issues2-page');
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
            <Flipbook2 pages={pages} title="Spring 2023 Edition" />
          ) : (
            <Flipbook pages={pages} title="Spring 2023 Edition" />
          )}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default Issues2;
