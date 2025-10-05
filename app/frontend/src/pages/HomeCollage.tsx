


import React, { useState, useEffect} from 'react';
import Navbar2 from '../components/Navbar2';
import Bottom from '../components/Bottom';
import '../assets/css/homecollage.css';

const imagePaths: string[] = [
  'backgrounds/b1.jpg', 'backgrounds/b2.jpg', 'backgrounds/b3.jpg', 'backgrounds/b4.jpg',
  'backgrounds/b5.jpg', 'backgrounds/b6.jpg', 'backgrounds/b7.jpg', 'backgrounds/b8.jpg',
  'backgrounds/b9.jpg', 'backgrounds/b10.jpg', 'backgrounds/b11.jpg', 'backgrounds/b12.jpg',
  'backgrounds/b13.jpg', 'backgrounds/b14.jpg', 'backgrounds/b15.jpg', 'backgrounds/b16.jpg'
];

const HomeCollage: React.FC = () => {
  // Teams slider data and state must be inside the component
  const teams = [
    {
      name: 'Creative',
      text: `The Creative Team designs and executes photoshoots for our physical and digital magazine releases, while also supporting collaborative, cross-functional shoots.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Creative.jpeg',
    },
    {
      name: 'Copy',
      text: `The Copy Team writes community-oriented and introspective pieces on arts, culture, and fashion for our new blog, print magazine, and social media. Members cover a wide range of topics, including local business spotlights, opinion pieces, event coverage, and the latest in media news.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Copy.jpeg',
    },
    {
      name: 'Design',
      text: `The Design Team creates striking visuals for our print magazine, social media, website, events, and physical merchandise. Members blend photographs and digital elements into engaging infographics, collages, UX layouts, and branded graphics.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Design.jpeg',
    },
    {
      name: 'Events',
      text: `The Events Team organizes and manages all of A/Squared's internal and external events aside from recruitment and professional development. This includes fundraisers, launch parties, socials, and themed gatherings.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Events.jpeg',
    },
    {
      name: 'Finance',
      text: `The Finance Team secures funding for A/Squared through grants and strategic partnerships, helping to plan events that support professional development, inclusivity, and sustainability. Team members manage budgets, track expenses, and assist with contracts and negotiations to ensure smooth operations.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Finance.jpeg',
    },
    {
      name: 'Marketing',
      text: `The Marketing Team focuses on promoting a/squared while working with the Design and Video teams to create content for Instagram and TikTok. Marketing develops strategic campaigns that highlight our events, initiatives, and creative projects, helping publicize everything a/squared represents across campus.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Marketing.jpeg',
    },
    {
      name: 'PR',
      text: `The PR Team manages external communication and builds meaningful relationships with partners, sponsors, and collaborators. PR leads promotional and collaborative initiatives, manages our affiliate program and LinkedIn, and works closely with Events and Marketing to ensure that partnerships and promotions align with a/squared's values and enhance our community presence.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/PR.jpeg',
    },
    {
      name: 'Video',
      text: `The Video Team brings social ideas to life by filming and editing high-quality content for our Instagram, TikTok, and website. While Marketing helps with concept development, the Video Team collaborates on scripting, shooting, editing, and post-production to ensure all content is engaging and on brand.`,
      img: 'https://asquared-images.s3.us-east-2.amazonaws.com/images/Home-page-teams/Video.jpeg',
    },
  
  ];
  const [teamIdx, setTeamIdx] = useState(0);
  const columns = 4;
  const rows = 5;
  const totalImages = imagePaths.length;
  const [visibleImages, setVisibleImages] = useState<boolean[]>(Array(totalImages).fill(false));
  // Log visibleImages after every update (for debugging)
  useEffect(() => {
    console.log('Current visibleImages (from React state):', visibleImages);
  }, [visibleImages]);

  // Fisher-Yates shuffle (returns a new array, does not mutate input)
  function shuffleArray(array: number[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const [revealedCount, setRevealedCount] = useState(0);
  const [shuffled, setShuffled] = useState<number[]>([]);

  // On mount, shuffle indices and reset state
  useEffect(() => {
    const indices = Array.from({ length: totalImages }, (_, i) => i);
    const shuffledOrder = shuffleArray(indices);
    setShuffled(shuffledOrder);
    setVisibleImages(Array(totalImages).fill(false));
    setRevealedCount(0);
    console.log('Shuffled reveal order:', shuffledOrder);
  }, [totalImages]);

  // Reveal next image when revealedCount changes
  useEffect(() => {
    if (revealedCount === 0 || revealedCount > totalImages) return;
    setVisibleImages((prev) => {
      const updated = [...prev];
      const revealIdx = shuffled[revealedCount - 1];
      console.log(updated);
      console.log(`Revealing image at shuffled index: ${revealedCount - 1}, actual image index: ${revealIdx}`);
      updated[revealIdx] = true;
      if (revealedCount === totalImages) {
        console.log('All images revealed!');
      }
      return updated;
    });
  }, [revealedCount, shuffled, totalImages]);

  // Drive the animation
  useEffect(() => {
    if (revealedCount < totalImages) {
      const timeout = setTimeout(() => setRevealedCount((c) => c + 1), 120);
      return () => clearTimeout(timeout);
    }
  }, [revealedCount, totalImages]);

  const generateCells = () => {
    const cells = [];
    let imgIndex = 0;
    for (let row = 0; row < rows; row++) {
      if (row === 2) {
        // Third row: logo spanning all columns
        cells.push(
          <div
            className="home-logo-center"
            key="logo"
            style={{ gridColumn: `1 / span ${columns}`, gridRow: row + 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
          >
            <h2 style={{ color: '#111', margin: 0 }}>a/squared</h2>
          </div>
        );
      } else {
        for (let col = 0; col < columns; col++) {
          const imgPath = imagePaths[imgIndex] || '';
          const isVisible = visibleImages[imgIndex];
          cells.push(
            <div
              className="home-block white"
              key={`cell-${row}-${col}`}
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
            >
              <img
                src={`https://d1gmweuuxd5quh.cloudfront.net/${imgPath}`}
                alt={`Gallery image ${imgIndex + 1}`}
                loading="lazy"
                className={isVisible ? 'fade-in' : 'fade-hidden'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.7s',
                  opacity: isVisible ? 1 : 0
                }}
              />
            </div>
          );
          imgIndex++;
        }
      }
    }
    return cells;
  };

  return (
    <div className="cream-bg">
      <Navbar2 />
      <div
        className="home-collage"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '0px',
          width: '100%',
          height: '100%',
        }}
      >
        {generateCells()}
      </div>
      {/* Who We Are Section */}
      {/* Divider Bar */}

     <div className='section-bar'>a/squared&nbsp;a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp;</div>

      {/* About Section with collage background and sticky note */}
      <section className="about-section">
        <div
          className="about-collage-bg"
          style={{
            width: '100%',
            minHeight: '420px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            padding: '0 0 40px 0',
          }}
        >
          <div className="about-content">
            <h2 className="about-title">Who We Are</h2>
            <p className="about-description">
              a/squared is a community driven platform and publication united around fashion, culture, and arts in Ann Arbor.<br /><br />
              We aim to cultivate meaningful digital and physical experiences through creative expression and collaboration, while simultaneously highlighting underrepresented voices and student life.
            </p>
          </div>
        </div>
      </section>

      {/* Divider Bar */}
 <div className='section-bar'>a/squared&nbsp;a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp; a/squared&nbsp;</div>
      {/* Team Slider Section Placeholder */}
      <section className="teams-bg-full">
        <div className="team-slider-bg">
          <div className="team-slider-overlay">
            <div className="team-slider-row">
              <button
                className="team-arrow left"
                aria-label="Previous team"
                onClick={() => setTeamIdx((prev) => (prev === 0 ? teams.length - 1 : prev - 1))}
              >
                &#8592;
              </button>
              <div className="team-content">
                <div className="team-text">
                  <h2 className="team-title">{teams[teamIdx].name}</h2>
                  <p className="team-description">
                    {teams[teamIdx].text}
                  </p>
                </div>
                <div className="team-image-container">
                  <img
                    src={teams[teamIdx].img}
                    alt={teams[teamIdx].name + ' preview'}
                    className="team-image"
                    draggable={false}
                  />
                </div>
              </div>
              <button
                className="team-arrow right"
                aria-label="Next team"
                onClick={() => setTeamIdx((prev) => (prev === teams.length - 1 ? 0 : prev + 1))}
              >
                &#8594;
              </button>
            </div>
            {/* Carousel dots below the row */}
            <div className="team-dots">
              {teams.map((_, idx) => (
                <span
                  key={idx}
                  className={"dot" + (teamIdx === idx ? " active" : "")}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setTeamIdx(idx)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Bottom />
    </div>
  );
};

export default HomeCollage;