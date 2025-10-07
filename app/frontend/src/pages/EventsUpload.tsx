import React, { useState, useEffect } from 'react';
import Navbar2 from "../components/Navbar2";
import "../assets/css/eventsupload.css";
const API_URL = import.meta.env.VITE_API_URL;

interface Event {
  title: string;
  slug: string;
  description: string;
  date: string;
  location: string;
  createdAt: string;
  isUpcoming: boolean;
  images: string[];
  folderPath: string;
}

const EventsUpload: React.FC = () => {
  React.useEffect(() => {
    document.body.classList.add('eventsupload-page');
    return () => {
      document.body.classList.remove('eventsupload-page');
    };
  }, []);

  // Event state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [isUpcoming, setIsUpcoming] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Event management state
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<'all' | 'upcoming' | 'past'>('all');
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);
  
  // Editing state
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  // Load events
  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const response = await fetch(`${API_URL}/api/event-list?type=${selectedEventType}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedEventType]);

  // Delete event
  const deleteEvent = async (folderPath: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeletingEvent(folderPath);
    try {
      const response = await fetch(`${API_URL}/api/event-delete/${encodeURIComponent(folderPath)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess(`Event "${eventTitle}" deleted successfully`);
        loadEvents(); // Refresh the event list
      } else {
        setError(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete event');
    } finally {
      setDeletingEvent(null);
    }
  };

  // Start editing an event
  const startEditing = (event: Event) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditDescription(event.description);
    setEditDate(event.date);
    setEditLocation(event.location || '');
    setEditImages([...event.images]);
    setError(null);
    setSuccess(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingEvent(null);
    setEditTitle('');
    setEditDescription('');
    setEditDate('');
    setEditLocation('');
    setEditImages([]);
    setError(null);
    setSuccess(null);
  };

  // Save edited event
  const saveEditedEvent = async () => {
    if (!editingEvent || !editTitle || !editDescription || !editDate) {
      setError('Title, description, and date are required');
      return;
    }

    setSavingEdit(true);
    try {
      const response = await fetch(`${API_URL}/api/event-edit/${editingEvent.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          date: editDate,
          location: editLocation,
          isUpcoming: editingEvent.isUpcoming,
          images: editImages
        }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess('Event updated successfully');
        loadEvents(); // Refresh the event list
        cancelEditing();
      } else {
        setError(data.error || 'Failed to update event');
      }
    } catch (err) {
      console.error('Edit error:', err);
      setError('Failed to update event');
    } finally {
      setSavingEdit(false);
    }
  };

  // Move image up in order
  const moveImageUp = (index: number) => {
    if (index > 0) {
      const newImages = [...editImages];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      setEditImages(newImages);
    }
  };

  // Move image down in order
  const moveImageDown = (index: number) => {
    if (index < editImages.length - 1) {
      const newImages = [...editImages];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setEditImages(newImages);
    }
  };

  // Allowed image types (excluding HEIC)
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  // Handlers for images
  const handleImagesChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      fileArray.forEach(file => {
        if (allowedImageTypes.includes(file.type.toLowerCase())) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        setError(`Unsupported file types: ${invalidFiles.join(', ')}. Please use JPEG, PNG, GIF, or WebP images only.`);
      } else {
        setError(null);
      }

      // Append new valid files to existing images
      setImages(prev => [...prev, ...validFiles]);
    }
    // Do not clear images if nothing is selected
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title || !description || !date || images.length === 0) {
      setError("Title, description, date, and at least one image are required.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("location", location);
    formData.append("isUpcoming", isUpcoming.toString());
    
    // Add all images
    images.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      const res = await fetch(`${API_URL}/api/event-upload`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", jsonErr);
        const text = await res.text();
        console.error("Raw response text:", text);
        setError("Upload failed: Invalid response from server");
        return;
      }
      if (res.ok) {
        setSuccess(data.message || "Event uploaded successfully!");
        setTitle("");
        setDescription("");
        setDate("");
        setLocation("");
        setIsUpcoming(false);
        setImages([]);
        loadEvents(); // Refresh the event list
      } else {
        console.error("Upload error response:", data);
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: " + err);
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#e95a51' }}>
      <Navbar2 />
      <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '90vh', paddingTop: '4.5rem' }}>
        
        {/* Upload Form */}
        <div className="events-upload-container" style={{ 
          borderRadius: '16px', 
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)', 
          padding: '2.5rem 2rem', 
          maxWidth: 520, 
          width: '100%', 
          margin: '2rem 0', 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#333', 
            fontSize: '1.8rem', 
            fontWeight: 700 
          }}>
            Upload New Event
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Event Title:
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Event title"
                required
                style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '2px solid #ddd', 
                  fontSize: '1rem', 
                  background: '#fff', 
                  color: '#333',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e95a51'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Event Date:
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '2px solid #ddd', 
                  fontSize: '1rem', 
                  background: '#fff', 
                  color: '#333',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e95a51'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Location (Optional):
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Event location"
                style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '2px solid #ddd', 
                  fontSize: '1rem', 
                  background: '#fff', 
                  color: '#333',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e95a51'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </label>

            {/* Upcoming Event Toggle */}
            <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                checked={isUpcoming}
                onChange={e => setIsUpcoming(e.target.checked)}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  accentColor: '#e95a51'
                }}
              />
              <span>This is an upcoming event</span>
              <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 400 }}>
                (Will be stored in upcoming events folder)
              </span>
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Description:
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the event..."
                required
                rows={4}
                style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '2px solid #ddd', 
                  fontSize: '1rem', 
                  background: '#fff', 
                  color: '#333', 
                  resize: 'vertical', 
                  minHeight: '100px',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#e95a51'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Event Images:
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                multiple
                onChange={e => handleImagesChange(e.target.files)}
                required
                style={{
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '2px dashed #ddd',
                  fontSize: '1rem',
                  background: '#f9f9f9',
                  color: '#333',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.3rem' }}>
                Upload multiple images (JPEG, PNG, GIF, WebP only - HEIC not supported)
              </span>
            </label>

            {images.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: '1rem',
                marginTop: '1rem'
              }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: 'relative', textAlign: 'center' }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx + 1}`}
                      style={{ 
                        width: '100%', 
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px', 
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeImage(idx)} 
                      style={{ 
                        position: 'absolute', 
                        top: '-8px', 
                        right: '-8px', 
                        background: '#e74c3c', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '50%', 
                        width: 24, 
                        height: 24, 
                        cursor: 'pointer', 
                        fontWeight: 700, 
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button 
              type="submit" 
              disabled={uploading} 
              style={{
                background: uploading ? '#bbb' : '#e95a51',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.9rem',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                marginTop: '1rem',
                transition: 'all 0.2s',
                boxShadow: uploading ? 'none' : '0 4px 12px rgba(233, 90, 81, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!uploading) {
                  e.currentTarget.style.background = '#d44638';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!uploading) {
                  e.currentTarget.style.background = '#e95a51';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {uploading ? "Uploading..." : "Upload Event"}
            </button>
          </form>
          
          {error && (
            <p style={{ 
              color: '#e74c3c', 
              marginTop: '1rem', 
              textAlign: 'center',
              background: 'rgba(231, 76, 60, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(231, 76, 60, 0.2)'
            }}>
              {error}
            </p>
          )}
          {success && (
            <p style={{ 
              color: '#27ae60', 
              marginTop: '1rem', 
              textAlign: 'center',
              background: 'rgba(39, 174, 96, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid rgba(39, 174, 96, 0.2)'
            }}>
              {success}
            </p>
          )}
        </div>

        {/* Event Management Section */}
        <div className="events-management-container" style={{ 
          borderRadius: '16px', 
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)', 
          padding: '2.5rem 2rem', 
          maxWidth: '90%', 
          width: '100%', 
          margin: '2rem 0', 
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '2rem', 
            color: '#333', 
            fontSize: '1.8rem', 
            fontWeight: 700 
          }}>
            Manage Events
          </h2>

          {/* Event Type Filter */}
          <div className="event-filter-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { key: 'all', label: 'All Events' },
              { key: 'upcoming', label: 'Upcoming Events' },
              { key: 'past', label: 'Past Events' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedEventType(key as typeof selectedEventType)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedEventType === key ? '#e95a51' : '#f0f0f0',
                  color: selectedEventType === key ? '#fff' : '#333',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: selectedEventType === key ? 600 : 400
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Events List */}
          {loadingEvents ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No events found for "{selectedEventType}" category.
            </div>
          ) : (
            <div className="events-grid" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {events.map((event, idx) => (
                <div key={idx} className="event-card" style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  border: '1px solid #eee'
                }}>
                  {editingEvent?.slug === event.slug ? (
                    /* Edit Mode */
                    <div>
                      <h3 style={{ margin: '0 0 1rem 0', color: '#333', fontSize: '1.2rem' }}>
                        Edit Event
                      </h3>
                      
                      {/* Edit Form */}
                      <div className="event-edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Event title"
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }}
                        />
                        
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }}
                        />
                        
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          placeholder="Location (optional)"
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }}
                        />
                        
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          placeholder="Event description"
                          rows={3}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            resize: 'vertical'
                          }}
                        />
                        
                        {/* Image Reordering */}
                        <div>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#333' }}>
                            Reorder Images:
                          </h4>
                          <div className="image-reorder-grid" style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                            gap: '0.5rem',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            border: '1px solid #eee',
                            padding: '0.5rem',
                            borderRadius: '4px'
                          }}>
                            {editImages.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} style={{ 
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <img
                                  src={imgUrl}
                                  alt={`Image ${imgIdx + 1}`}
                                  style={{
                                    width: '80px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                  }}
                                />
                                <div style={{ display: 'flex', gap: '2px' }}>
                                  <button
                                    onClick={() => moveImageUp(imgIdx)}
                                    disabled={imgIdx === 0}
                                    style={{
                                      background: imgIdx === 0 ? '#ccc' : '#3498db',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: '3px',
                                      padding: '2px 6px',
                                      fontSize: '0.7rem',
                                      cursor: imgIdx === 0 ? 'not-allowed' : 'pointer'
                                    }}
                                  >
                                    ↑
                                  </button>
                                  <button
                                    onClick={() => moveImageDown(imgIdx)}
                                    disabled={imgIdx === editImages.length - 1}
                                    style={{
                                      background: imgIdx === editImages.length - 1 ? '#ccc' : '#3498db',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: '3px',
                                      padding: '2px 6px',
                                      fontSize: '0.7rem',
                                      cursor: imgIdx === editImages.length - 1 ? 'not-allowed' : 'pointer'
                                    }}
                                  >
                                    ↓
                                  </button>
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>#{imgIdx + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Save/Cancel Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button
                            onClick={saveEditedEvent}
                            disabled={savingEdit}
                            style={{
                              background: savingEdit ? '#bbb' : '#27ae60',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem',
                              cursor: savingEdit ? 'not-allowed' : 'pointer',
                              flex: 1
                            }}
                          >
                            {savingEdit ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            style={{
                              background: '#95a5a6',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.5rem 1rem',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              flex: 1
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <h3 style={{ 
                          margin: 0, 
                          color: '#333', 
                          fontSize: '1.2rem', 
                          fontWeight: 600,
                          flex: 1 
                        }}>
                          {event.title}
                        </h3>
                        <span style={{
                          background: event.isUpcoming ? '#3498db' : '#95a5a6',
                          color: '#fff',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          marginLeft: '1rem'
                        }}>
                          {event.isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                      
                      <p style={{ color: '#666', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                        <strong>Date:</strong> {formatDate(event.date)}
                      </p>
                      
                      {event.location && (
                        <p style={{ color: '#666', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                          <strong>Location:</strong> {event.location}
                        </p>
                      )}
                      
                      <p style={{ color: '#666', margin: '0.5rem 0', fontSize: '0.9rem' }}>
                        <strong>Images:</strong> {event.images.length}
                      </p>
                      
                      <p style={{ 
                        color: '#666', 
                        margin: '1rem 0', 
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        maxHeight: '3.6em',
                        overflow: 'hidden'
                      }}>
                        {event.description}
                      </p>
                      
                      {/* Action Buttons */}
                      <div className="event-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => startEditing(event)}
                          style={{
                            background: '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Edit Event
                        </button>
                        <button
                          onClick={() => deleteEvent(event.folderPath, event.title)}
                          disabled={deletingEvent === event.folderPath}
                          style={{
                            background: deletingEvent === event.folderPath ? '#bbb' : '#e74c3c',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            cursor: deletingEvent === event.folderPath ? 'not-allowed' : 'pointer',
                            flex: 1
                          }}
                        >
                          {deletingEvent === event.folderPath ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventsUpload;
