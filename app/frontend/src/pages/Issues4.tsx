import React from 'react';
import { Flipbook } from '../components/Flipbook/Flipbook';
import '../assets/css/flipbook.css';
import Navbar from "../components/Navbar";

const S3_PREFIX = "https://asquared-images.s3.us-east-2.amazonaws.com";

const pages = [
  `${S3_PREFIX}/images/Fall-2024-issue/cover.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p2.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p3.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p4.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p5.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p6.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p7.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p8.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p9.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p10.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p11.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p12.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p13.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p14.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p15.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p16.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p17.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p18.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p19.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p20.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p21.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p22.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p23.jpg`,
  `${S3_PREFIX}/images/Fall-2024-issue/p24.jpg`,
];

const Issues4: React.FC = () => {
  return (
    <>
      <Navbar />
    <div className="issues2-wrapper">
      <Flipbook pages={pages} title="Fall 2024 Edition" />
    </div>
    </>
  );
};

export default Issues4;
