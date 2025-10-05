import React, { useState, useEffect } from 'react';
import Navbar2 from "../components/Navbar2";
const API_URL = import.meta.env.VITE_API_URL;

interface TeamMember {
  name: string;
  position: string;
  team: string;     // slug (e.g., 'executive-board')
  image?: string;
}

type TeamOption = { value: string; label: string };

// Keep these slugs EXACTLY matching Team.tsx filters
const TEAM_OPTIONS: TeamOption[] = [
  { value: 'executive-board', label: 'Executive Board' },
  { value: 'creative-team',   label: 'Creative Team' },
  { value: 'events-team',     label: 'Events Team' },
  { value: 'pr-team',         label: 'PR Team' },
  { value: 'finance-team',    label: 'Finance Team' },
  { value: 'copy-team',       label: 'Copy Team' },
  { value: 'video-team',      label: 'Video Team' },
  { value: 'marketing-team',  label: 'Marketing Team' },
  { value: 'design-team',     label: 'Design Team' },
  { value: 'other',           label: 'Other' }, // optional catch-all
];

const teamLabelFromSlug = (slug: string) =>
  TEAM_OPTIONS.find(t => t.value === slug)?.label ?? slug;

const MemberUpload: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.add('memberupload-page');
    fetchMembers();
    return () => {
      document.body.classList.remove('memberupload-page');
    };
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/team-list`, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setMembers(data.members.flat());
      }
    } catch (err) {
      console.error('Error fetching members:', err);
    }
  };

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [team, setTeam] = useState<string>(TEAM_OPTIONS[0].value);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/auth/get-cookie`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setToken(data.token))
      .catch(() => setToken(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name || !team || !image) {
      setError("Name, team, and image are required.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    formData.append("team", team);         // server uses this slug for foldering
    formData.append("image", image);

    try {
      const res = await fetch(`${API_URL}/api/member-upload`, {
        method: "POST",
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Upload failed: Invalid response from server");
        return;
      }

      if (res.ok && data.success) {
        setSuccess("Member uploaded successfully!");
        setName("");
        setPosition("");
        setTeam(TEAM_OPTIONS[0].value);
        setImage(null);
        fetchMembers(); // Refresh list
      } else {
        setError(data.error || "Upload failed");
      }
    } catch (err) {
      setError("Network error: " + err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (teamSlug: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${memberName}?`)) return;

    const folderPath = `${teamSlug}/${memberName.replace(/\s+/g, '_')}`;
    setDeleteLoading(folderPath);

    try {
      const response = await fetch(`${API_URL}/api/member-delete/${folderPath}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: 'include',
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(`Successfully deleted ${memberName}`);
        fetchMembers();
      } else {
        setError(data.error || 'Failed to delete member');
      }
    } catch (err) {
      setError('Error deleting member: ' + err);
    } finally {
      setDeleteLoading(null);
    }
  };

  // Utility: render a single team's list block
  const renderTeamBlock = (teamSlug: string) => {
    const list = members.filter(m => m.team === teamSlug);
    return (
      <div key={teamSlug} style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#444', fontSize: '1.4rem', marginBottom: '1rem' }}>
          {teamLabelFromSlug(teamSlug)}
        </h3>
        {list.length === 0 ? (
          <div style={{ color: '#777', fontSize: '.95rem', padding: '.25rem 0' }}>
            No members in this team yet.
          </div>
        ) : (
          list.map((member, index) => {
            const isRowBusy = deleteLoading === `${member.team}/${member.name.replace(/\s+/g, '_')}`;
            return (
              <div
                key={`${member.team}-${member.name}-${index}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.8rem',
                  borderBottom: '1px solid #eee',
                  background: index % 2 === 0 ? '#f8f9fa' : 'transparent',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* tiny thumbnail if available */}
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 40, height: 40, borderRadius: 6, background: '#e9ecef',
                        display: 'grid', placeItems: 'center', color: '#999', fontSize: 12
                      }}
                    >
                      N/A
                    </div>
                  )}
                  <div>
                    <p style={{ margin: 0, fontWeight: 500 }}>{member.name}</p>
                    <p style={{ margin: 0, fontSize: '.9rem', color: '#666' }}>{member.position}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(member.team, member.name)}
                  disabled={!!deleteLoading}
                  style={{
                    padding: '0.4rem 0.8rem',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    opacity: isRowBusy ? 0.7 : 1
                  }}
                  title="Delete member"
                >
                  {isRowBusy ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar2 />

      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '90vh',
          paddingTop: '4.5rem'
        }}
      >
        {/* Upload Card */}
        <div
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '2.5rem 2rem',
            maxWidth: 520,
            width: '100%',
            margin: '2rem 0',
            background: 'transparent'
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333', fontSize: '1.8rem', fontWeight: 700 }}>
            Upload Team Member
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Name:
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full name"
                required
                style={{
                  marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px',
                  border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222'
                }}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Position:
              <input
                type="text"
                value={position}
                onChange={e => setPosition(e.target.value)}
                placeholder="Position (e.g. Co-President, VP Events, N/A)"
                style={{
                  marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px',
                  border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222'
                }}
              />
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Team:
              <select
                value={team}
                onChange={e => setTeam(e.target.value)}
                required
                style={{
                  marginTop: '0.5rem', padding: '0.5rem', borderRadius: '6px',
                  border: '1px solid #bbb', fontSize: '1rem', background: '#f5f6fa', color: '#222'
                }}
              >
                {TEAM_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </label>

            <label style={{ fontWeight: 500, display: 'flex', flexDirection: 'column' }}>
              Member Photo:
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files?.[0] || null)}
                required
                style={{ display: 'block', marginTop: '0.5rem' }}
              />
            </label>

            {image && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.95rem', color: '#888' }}>Photo Preview:</span><br />
                <img
                  src={URL.createObjectURL(image)}
                  alt="Member Preview"
                  style={{
                    maxWidth: "100px", margin: "10px 0", borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                  }}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              style={{
                background: uploading ? '#aaa' : '#2d72d9',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.7rem',
                fontWeight: 600,
                fontSize: '1.08rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
                transition: 'background 0.2s'
              }}
            >
              {uploading ? "Uploading..." : "Upload Member"}
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{success}</p>}
        </div>

        {/* Current Members (all teams) */}
        <div
          style={{
            borderRadius: '16px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            padding: '2.5rem 2rem',
            maxWidth: 700,
            width: '100%',
            margin: '2rem 0',
            background: 'transparent'
          }}
        >
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333', fontSize: '1.8rem', fontWeight: 700 }}>
            Current Members
          </h2>

          {TEAM_OPTIONS
            .filter(t => t.value !== 'other') // usually we don’t list “Other”; include if you need it
            .map(opt => renderTeamBlock(opt.value))}
        </div>
      </main>
    </div>
  );
};

export default MemberUpload;
