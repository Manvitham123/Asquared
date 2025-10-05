import React, { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("events-page");

    const fetchEvents = async () => {
      try {
        const pastResponse = await fetch(`${API_URL}/api/event-list?type=past`);
        const pastData = await pastResponse.json();

        const upcomingResponse = await fetch(`${API_URL}/api/event-list?type=upcoming`);
        const upcomingData = await upcomingResponse.json();

        if (pastData.success && upcomingData.success) {
          setEvents(pastData.events);
          setUpcomingEvents(upcomingData.events);
        } else {
          setError("Failed to load events");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Error loading events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    return () => document.body.classList.remove("events-page");
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const capitalizeTitle = (title: string) => {
    const lowercaseWords = [
      "a","an","the","and","but","or","for","nor","on","at","to","from","by","with","in","of",
    ];
    const parts = title.split(" ");
    return parts
      .map((word, index) => {
        const lower = word.toLowerCase();
        if (index === 0 || index === parts.length - 1 || !lowercaseWords.includes(lower)) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return lower;
      })
      .join(" ");
  };

  // Collect all past event images for the camera rotation
  const allPastImages = events.flatMap((event) =>
    event.images.map((image) =>
      image.startsWith("http")
        ? image.replace("asquared-images.s3.amazonaws.com", "cdn.asquaredmag.org")
        : `${S3_PREFIX}/images/events2/${event.slug}/${image}`
    )
  );

  // Camera image rotation
  const [cameraImageIndex, setCameraImageIndex] = useState(0);
  useEffect(() => {
    if (allPastImages.length === 0) return;
    const interval = setInterval(() => {
      setCameraImageIndex((prev) => (prev + 1) % allPastImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [allPastImages.length]);

  // ----- Manual-mode (hover) + drag-to-scroll helpers -----
  const enableManual = (container: HTMLElement) => container.classList.add("manual");
  const disableManual = (container: HTMLElement) => container.classList.remove("manual");

  const attachDragScroll = (container: HTMLElement) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("dragging");
      startX = e.pageX - container.getBoundingClientRect().left;
      scrollLeft = container.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      container.classList.remove("dragging");
    };
    const onMouseUp = () => {
      isDown = false;
      container.classList.remove("dragging");
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.getBoundingClientRect().left;
      const walk = x - startX; // px moved
      container.scrollLeft = scrollLeft - walk;
    };

    // Touch support
    let touchStartX = 0;
    let touchScrollLeft = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].pageX - container.getBoundingClientRect().left;
      touchScrollLeft = container.scrollLeft;
    };
    const onTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - container.getBoundingClientRect().left;
      const walk = x - touchStartX;
      container.scrollLeft = touchScrollLeft - walk;
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  };

  // Track refs to each film container for cleanup
  const containerRefs = useRef<HTMLElement[]>([]);
  containerRefs.current = [];

  const setContainerRef = (el: HTMLElement | null) => {
    if (!el) return;
    containerRefs.current.push(el);
    if (!(el as any)._dragScrollAttached) {
      const cleanup = attachDragScroll(el);
      (el as any)._dragScrollAttached = true;
      (el as any)._dragScrollCleanup = cleanup;
    }
  };

  useEffect(() => {
    return () => {
      containerRefs.current.forEach((el) => {
        const cleanup = (el as any)._dragScrollCleanup as (() => void) | undefined;
        if (cleanup) cleanup();
      });
    };
  }, []);

  return (
    <div>
      <Navbar2 />
      <div className="events-overlay-container">
        <header className="retro-header">
          <div className="header-left">
            <img
              className="film-roll-left"
              src={`${S3_PREFIX}/images/events2/filmrollbbox.PNG`}
              alt="Film roll"
            />
          </div>
          <div className="tape-title">EVENTS</div>
          <div className="header-right">
            <div className="camera-wrap">
              <img className="camera-frame" src={`${S3_PREFIX}/images/events2/digi.PNG`} alt="Digital camera" />
              <div className="camera-screen">
                {allPastImages.length > 0 ? (
                  <img
                    src={allPastImages[cameraImageIndex]}
                    alt={`Past event photo ${cameraImageIndex + 1}`}
                    key={cameraImageIndex}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    draggable={false}
                  />
                ) : (
                  <div className="screen-placeholder">No Image</div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main>
          {loading && (
            <div className="events-loading">Loading events...</div>
          )}

          {error && (
            <div className="events-error">Error: {error}</div>
          )}

          {!loading && !error && (
            <>
              {/* Upcoming */}
              {upcomingEvents.length > 0 && (
                <div className="events-category">
                  <h2 className="category-title">
                    Upcoming Events
                  </h2>
                  <div className="event-cards-container">
                    {[...upcomingEvents]
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((event, index) => {
                        const image = event.images[0];
                        const imageUrl = image
                          ? image.startsWith("http")
                            ? image.replace("asquared-images.s3.amazonaws.com", "cdn.asquaredmag.org")
                            : `${S3_PREFIX}/images/events2/upcoming/${event.slug}/${image}`
                          : undefined;
                        return (
                          <div
                            key={`upcoming-${index}`}
                            className="event-card"
                          >
                            {imageUrl && (
                              <img
                                src={imageUrl}
                                alt={event.title}
                                className="event-card-image"
                                draggable={false}
                              />
                            )}
                            <h3 className="event-card-title">
                              {capitalizeTitle(event.title)}
                            </h3>
                            <p className="event-card-date">
                              {formatDate(event.date)}
                            </p>
                            {event.location && (
                              <p className="event-card-location">
                                Where: {event.location}
                              </p>
                            )}
                            <p className="event-card-description">
                              {event.description}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Past */}
              {events.length > 0 && (
                <div className="events-category">
                  <h2 className="category-title">
                    Past Events
                  </h2>

                  {events.map((event, index) => {
                    // build a seamless, continuous row by duplicating the list inline
                    const imgs = event.images.map((image) =>
                      image.startsWith("http")
                        ? image.replace("asquared-images.s3.amazonaws.com", "cdn.asquaredmag.org")
                        : `${S3_PREFIX}/images/events2/${event.slug}/${image}`
                    );
                    const doubled = imgs.concat(imgs);

                    return (
                      <div key={`past-${index}`} className="event-section">
                        <div className="event-header">
                          <h2 className="event-title">{capitalizeTitle(event.title)}</h2>
                          <p className="event-date">{formatDate(event.date)}</p>
                          {event.location && <p className="event-location">{event.location}</p>}
                        </div>

                        <div
                          className="film-roll-container"
                          ref={setContainerRef}
                          onMouseEnter={(e) => enableManual(e.currentTarget as HTMLElement)}
                          onMouseLeave={(e) => disableManual(e.currentTarget as HTMLElement)}
                        >
                          <div className="film-track">
                            {doubled.map((src, i) => (
                              <img
                                key={i}
                                src={src}
                                alt={`${event.title} - Image ${(i % imgs.length) + 1}`}
                                className="film-photo"
                                draggable={false}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="past-event-description">
                          {event.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {upcomingEvents.length === 0 && events.length === 0 && (
                <div className="no-events-message">
                  No events found. Check back soon!
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Bottom />
    </div>
  );
};

export default Events;
