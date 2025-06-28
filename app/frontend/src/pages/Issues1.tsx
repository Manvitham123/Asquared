import React from 'react';
import { Flipbook } from '../components/Flipbook/Flipbook';
import '../assets/css/flipbook.css';
import Navbar from "../components/Navbar";

const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";

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
  return (
    <>
      <Navbar />
    <div className="issues2-wrapper">
      <Flipbook pages={pages} title="Fall 2022 Edition" />
    </div>
    </>
  );
};

export default Issues1;
