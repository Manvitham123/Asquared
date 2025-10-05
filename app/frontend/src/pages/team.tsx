import React, { useEffect, useState } from "react";
import Navbar2 from "../components/Navbar2";
import Bottom from "../components/Bottom";
import "../assets/css/team.css";

const S3_PREFIX = "https://cdn.asquaredmag.org";
const API_URL = import.meta.env.VITE_API_URL;

// Team member interface
interface TeamMember {
  name: string;
  position: string;
  image?: string;  // Make image optional since some members might not have photos
  team: string;
}

const Team: React.FC = () => {
  const [executiveBoard, setExecutiveBoard] = useState<TeamMember[]>([]);
  const [creativeTeam, setCreativeTeam] = useState<TeamMember[]>([]);
  const [eventsTeam, setEventsTeam] = useState<TeamMember[]>([]);
  const [prTeam, setPrTeam] = useState<TeamMember[]>([]);
  const [financeTeam, setFinanceTeam] = useState<TeamMember[]>([]);
  const [copyTeam, setCopyTeam] = useState<TeamMember[]>([]);
  const [videoTeam, setVideoTeam] = useState<TeamMember[]>([]);
  const [marketingTeam, setMarketingTeam] = useState<TeamMember[]>([]);
  const [designTeam, setDesignTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("team-page");
    return () => {
      document.body.classList.remove("team-page");
    };
  }, []);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/team-list`);
        const data = await response.json();
        
        if (data.success) {
          // Flatten the nested array structure and organize members by team
          const allMembers = data.members.flat();
          
          // Filter executive board members and sort them
          const execBoard = allMembers
            .filter((member: TeamMember) => member.team === 'executive-board')
            .sort((a: TeamMember, b: TeamMember) => {
              // Check if position includes president/co-president (case insensitive)
              const isPresidentA = a.position.toLowerCase().includes('president');
              const isPresidentB = b.position.toLowerCase().includes('president');
              
              if (isPresidentA && !isPresidentB) return -1; // a is president, b is not
              if (!isPresidentA && isPresidentB) return 1;  // b is president, a is not
              if (isPresidentA && isPresidentB) {
                // Both are presidents, sort by position text
                return a.position.localeCompare(b.position);
              }
              // Neither are presidents, maintain their order
              return 0;
            });

          // Filter members for each team
          const creative = allMembers.filter((member: TeamMember) => member.team === 'creative-team');
          const events = allMembers.filter((member: TeamMember) => member.team === 'events-team');
          const pr = allMembers.filter((member: TeamMember) => member.team === 'pr-team');
          const finance = allMembers.filter((member: TeamMember) => member.team === 'finance-team');
          const copy = allMembers.filter((member: TeamMember) => member.team === 'copy-team');
          const video = allMembers.filter((member: TeamMember) => member.team === 'video-team');
          const marketing = allMembers.filter((member: TeamMember) => member.team === 'marketing-team');
          const design = allMembers.filter((member: TeamMember) => member.team === 'design-team');
          
          setExecutiveBoard(execBoard);
          setCreativeTeam(creative);
          setEventsTeam(events);
          setPrTeam(pr);
          setFinanceTeam(finance);
          setCopyTeam(copy);
          setVideoTeam(video);
          setMarketingTeam(marketing);
          setDesignTeam(design);
        } else {
          setError('Failed to load team members');
        }
      } catch (err) {
        setError('Error loading team members');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return (
      <div className="team-page">
        <Navbar2 />
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading team members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="team-page">
        <Navbar2 />
        <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="team-page">
      <Navbar2 />
      
      {/* Meet the Team Header */}
      <section className="team-header">
        <img 
          src={`${S3_PREFIX}/images/team/main.jpeg`} 
          alt="Meet the Team" 
          className="header-image"
        />
        <img 
          src={`${S3_PREFIX}/images/team/chalkboard.v2.png`} 
          alt="Chalkboard separator" 
          className="section-separator-one"
        />
      </section>

      {/* Executive Board Section */}
      <section className="team-section executive-board">
        <div 
          className="section-background"
          style={{ backgroundImage: `url(${S3_PREFIX}/images/team/teams.jpeg)` }}
        >
          <div className="section-content">
            <img 
              src={`${S3_PREFIX}/images/team/board.png`}
              alt="Executive Board"
              className="creative-team-title"
            />
            <div className="team-grid">
              {executiveBoard.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No executive board members found.
                </div>
              ) : (
                executiveBoard.map((member, index) => (
                  <div key={index} className="team-member">
                    <div className="photo-container">
                      <img 
                        src={`${S3_PREFIX}/images/team/white-tape.png`}
                        alt="Tape" 
                        className="tape-center-top"
                      />
                      <div className="photo-placeholder">
                        {member.image ? (
                          <img 
                            src={member.image} 
                            alt={member.name}
                            className="member-photo"
                          />
                        ) : (
                          <div className="placeholder-photo"></div>
                        )}
                      </div>
                    </div>
                    <div className="member-info">
                      <h3 className="member-name chalk-text">{member.name}</h3>
                      <p className="member-position chalk-text">{member.position}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <img 
            src={`${S3_PREFIX}/images/team/chalkboard.v2.png`} 
            alt="Chalkboard separator" 
            className="section-separator"
          />
        </div>
      </section>

      {/* Team Sections */}
      {[
        { title: 'Creative Team', members: creativeTeam, imageKey: 'Creative Team' },
        { title: 'Events Team', members: eventsTeam, imageKey: 'Events Team' },
        { title: 'PR Team', members: prTeam, imageKey: 'PR team' },
        { title: 'Finance Team', members: financeTeam, imageKey: 'Finance Team' },
        { title: 'Copy Team', members: copyTeam, imageKey: 'Copy Team' },
        { title: 'Video Team', members: videoTeam, imageKey: 'Video Team' },
        { title: 'Marketing Team', members: marketingTeam, imageKey: 'Marketing team' },
        { title: 'Design Team', members: designTeam, imageKey: 'Design Team' }
      ].map((team) => (
        <section key={team.title} className={`team-section ${team.title.toLowerCase().replace(' ', '-')}`}>
          <div 
            className="section-background"
            style={{ backgroundImage: `url(${S3_PREFIX}/images/team/teams.jpeg)` }}
          >
            <div className="section-content">
              <img 
                src={`${S3_PREFIX}/images/team/${team.imageKey}.png`}
                alt={team.title}
                className="creative-team-title"
              />
              
              <div className="team-grid">
                {team.members.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No {team.title.toLowerCase()} members found.
                  </div>
                ) : (
                  team.members.map((member, index) => (
                    <div key={index} className="team-member">
                      <div className="photo-container">
                        <img 
                          src={`${S3_PREFIX}/images/team/white-tape.png`}
                          alt="Tape" 
                          className="tape-center-top"
                        />
                        <div className="photo-placeholder">
                          {member.image ? (
                            <img 
                              src={member.image} 
                              alt={member.name}
                              className="member-photo"
                            />
                          ) : (
                            <div className="placeholder-photo"></div>
                          )}
                        </div>
                      </div>
                      <div className="member-info">
                        <h3 className="member-name chalk-text">{member.name}</h3>
                        <p className="member-position chalk-text">{member.position}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <img 
              src={`${S3_PREFIX}/images/team/chalkboard.v2.png`} 
              alt="Chalkboard separator" 
              className="section-separator"
            />
          </div>
        </section>
      ))}

      <Bottom />
    </div>
  );
};

export default Team;
