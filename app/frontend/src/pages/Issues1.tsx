import React, { useEffect, useState } from 'react';
import { Flipbook } from '../components/Flipbook/Flipbook';
import '../assets/css/flipbook.css';
import Flipbook2 from '../components/Flipbook/Flipbook2';
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";

//const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";
const S3_PREFIX = "https://cdn.asquaredmag.org"; // Updated to use new CDN

const pages = [
  `${S3_PREFIX}/images/sept-issue/cover.jpg`,
  `${S3_PREFIX}/images/sept-issue/p2.jpg`,
  `${S3_PREFIX}/images/sept-issue/p3.jpg`,
  `${S3_PREFIX}/images/sept-issue/p4.jpg`,
  `${S3_PREFIX}/images/sept-issue/p5.jpg`,
  `${S3_PREFIX}/images/sept-issue/p6.jpg`,
  `${S3_PREFIX}/images/sept-issue/p7.jpg`,
  `${S3_PREFIX}/images/sept-issue/p8.jpg`,
  `${S3_PREFIX}/images/sept-issue/p9.jpg`,
  `${S3_PREFIX}/images/sept-issue/p10.jpg`,
  `${S3_PREFIX}/images/sept-issue/p11.jpg`,
  `${S3_PREFIX}/images/sept-issue/p12.jpg`,
  `${S3_PREFIX}/images/sept-issue/p13.jpg`,
  `${S3_PREFIX}/images/sept-issue/p14.jpg`,
  `${S3_PREFIX}/images/sept-issue/p15.jpg`,
  `${S3_PREFIX}/images/sept-issue/p16.jpg`,
  `${S3_PREFIX}/images/sept-issue/p17.jpg`,
  `${S3_PREFIX}/images/sept-issue/p18.jpg`,
  `${S3_PREFIX}/images/sept-issue/p19.jpg`,
  `${S3_PREFIX}/images/sept-issue/p20.jpg`,
];

const Issues1: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('issues1-page');
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.classList.remove('issues1-page');
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
        maxWidth: '100vw'
      }}>
      <div className="issues2-wrapper">
        {isMobile ? (
          <Flipbook2 pages={pages} title="Fall 2022 Edition" />
        ) : (
          <Flipbook pages={pages} title="Fall 2022 Edition" />
        )}
      </div>
      </div>
      <Bottom />
    </>
  );
};

export default Issues1;
