import React, { useEffect, useState } from "react";
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";
import "../assets/css/events.css";
import "../assets/css/navbar.css";

const S3_PREFIX = "https://cdn.asquaredmag.org";
const API_URL = import.meta.env.VITE_API_URL;

interface Event {
  title: string;
  slug: string;
  description: string;
  location?: string;
  date: string;
  createdAt: string;
  images: string[];
  totalImages: number;
  isUpcoming?: boolean;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allEventImages, setAllEventImages] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("events-page");
    
    // Fetch both past and upcoming events
    const fetchEvents = async () => {
      try {
        // Fetch past events
        const pastResponse = await fetch(`${API_URL}/api/event-list?type=past`);
        const pastData = await pastResponse.json();
        
        // Fetch upcoming events
        const upcomingResponse = await fetch(`${API_URL}/api/event-list?type=upcoming`);
        const upcomingData = await upcomingResponse.json();
        
        if (pastData.success && upcomingData.success) {
          setEvents(pastData.events);
          setUpcomingEvents(upcomingData.events);
          
          // Collect all images from all events for rotating display
          const allImages: string[] = [];
          [...pastData.events, ...upcomingData.events].forEach((event: Event) => {
            event.images.forEach((image: string) => {
              const imageUrl = image.startsWith('http') 
                ? image.replace('asquared-images.s3.amazonaws.com', 'cdn.asquaredmag.org')
                : event.isUpcoming 
                  ? `${S3_PREFIX}/images/events2/upcoming/${event.slug}/${image}`
                  : `${S3_PREFIX}/images/events2/${event.slug}/${image}`;
              allImages.push(imageUrl);
            });
          });
          setAllEventImages(allImages);
        } else {
          setError('Failed to load events');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Error loading events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    
    return () => {
      document.body.classList.remove("events-page");
    };
  }, []);

  // Rotate images in camera screen every 3 seconds
  useEffect(() => {
    if (allEventImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allEventImages.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [allEventImages]);

  // Format date for display (short format for upcoming events)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date for upcoming events (compact format)
  const formatUpcomingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: '2-digit'
    });
  };

  // Get the first upcoming event for header display
  const nextUpcomingEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;

  return (
    <div>
      <Navbar2 />
      <header className="retro-header">
        <div className="header-left">
          <img 
            className="film-roll-left" 
            src={`${S3_PREFIX}/images/events2/filmrollbbox.PNG`} 
            alt="Film roll" 
          />
          <div className="header-content">
            <div className="tape-title">EVENTS</div>
            <div className="upcoming">
              <p>Upcoming:</p>
              {nextUpcomingEvent ? (
                <>
                  <h3>
                    {nextUpcomingEvent.title}
                    <span>{formatUpcomingDate(nextUpcomingEvent.date)}</span>
                  </h3>
                  <p className="desc">
                    {nextUpcomingEvent.description.length > 120 
                      ? `${nextUpcomingEvent.description.substring(0, 120)}...` 
                      : nextUpcomingEvent.description}
                  </p>
                  {nextUpcomingEvent.location && (
                    <p className="location">@ {nextUpcomingEvent.location}</p>
                  )}
                </>
              ) : (
                <>
                  <h3>
                    Stay tuned!
                    <span>TBA</span>
                  </h3>
                  <p className="desc">Check back soon for upcoming events</p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="camera-container">
            <img 
              className="camera" 
              src={`${S3_PREFIX}/images/events2/digi.PNG`} 
              alt="Digital camera" 
            />
            {allEventImages.length > 0 && (
              <div className="camera-screen">
                <img 
                  src={allEventImages[currentImageIndex]}
                  alt="Event photos rotating"
                  key={currentImageIndex}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main>
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
            Loading events...
          </div>
        )}
        
        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <div className="events-category">
                <h2 className="category-title" style={{ color: 'white', textAlign: 'center', margin: '2rem 0', fontSize: '1.8rem' }}>
                  🎬 Upcoming Events
                </h2>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '2rem',
                  justifyContent: 'center',
                  marginBottom: '2rem'
                }}>
                  {[...upcomingEvents]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((event, index) => {
                      const image = event.images[0];
                      const imageUrl = image
                        ? (image.startsWith('http')
                            ? image.replace('asquared-images.s3.amazonaws.com', 'cdn.asquaredmag.org')
                            : `${S3_PREFIX}/images/events2/upcoming/${event.slug}/${image}`)
                        : undefined;
                      return (
                        <div key={`upcoming-${index}`} style={{
                          background: 'rgba(255,255,255,0.95)',
                          borderRadius: '16px',
                          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                          padding: '1.5rem',
                          minWidth: 260,
                          maxWidth: 320,
                          width: '100%',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={event.title}
                              style={{
                                width: '100%',
                                maxWidth: 220,
                                height: 'auto',
                                borderRadius: '12px',
                                marginBottom: '1rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.10)'
                              }}
                            />
                          )}
                          <h3 style={{ color: '#e95a51', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>{event.title}</h3>
                          <p style={{ color: '#333', fontSize: '1rem', marginBottom: '0.5rem' }}>{formatDate(event.date)}</p>
                          {event.location && (
                            <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{event.location}</p>
                          )}
                          <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '0.5rem', lineHeight: 1.4 }}>{event.description}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {events.length > 0 && (
              <div className="events-category">
                <h2 className="category-title" style={{ color: 'white', textAlign: 'center', margin: '2rem 0', fontSize: '1.8rem' }}>
                  📸 Past Events
                </h2>
                {events.map((event, index) => (
                  <div key={`past-${index}`} className="event-section">
                    <div className="event-header">
                      <h2 className="event-title">{event.title}</h2>
                      <p className="event-date">{formatDate(event.date)}</p>
                      {event.location && (
                        <p className="event-location">{event.location}</p>
                      )}
                    </div>
                    <div className="film-roll-container">
                      <div className="film-roll">
                        <div className="film-photos">
                          {event.images.map((image, imgIndex) => {
                            // Handle both full URLs and relative paths for past events
                            const imageUrl = image.startsWith('http') 
                              ? image.replace('asquared-images.s3.amazonaws.com', 'cdn.asquaredmag.org')
                              : `${S3_PREFIX}/images/events2/${event.slug}/${image}`;
                            
                            return (
                              <img 
                                key={imgIndex} 
                                src={imageUrl} 
                                alt={`${event.title} - Image ${imgIndex + 1}`} 
                                className="film-photo" 
                              />
                            );
                          })}
                        </div>
                        <div className="film-photos">
                          {event.images.map((image, imgIndex) => {
                            // Handle both full URLs and relative paths for past events
                            const imageUrl = image.startsWith('http') 
                              ? image.replace('asquared-images.s3.amazonaws.com', 'cdn.asquaredmag.org')
                              : `${S3_PREFIX}/images/events2/${event.slug}/${image}`;
                            
                            return (
                              <img 
                                key={`duplicate-${imgIndex}`} 
                                src={imageUrl} 
                                alt={`${event.title} - Image ${imgIndex + 1}`} 
                                className="film-photo" 
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="event-description">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No events message */}
            {upcomingEvents.length === 0 && events.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'white' }}>
                No events found. Check back soon!
              </div>
            )}
          </>
        )}
      </main>
      <Bottom />
    </div>
  );
};

export default Events;
