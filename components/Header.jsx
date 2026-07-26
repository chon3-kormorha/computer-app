'use client';

import React from 'react';
import { SoundEngine } from '../lib/audio';

export default function Header({ currentScreen, showScreen, currentStudent, onLogout, onOpenAdmin }) {
  const [isMuted, setIsMuted] = React.useState(false);

  const toggleSound = () => {
    const muted = SoundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <>
      <header className="console-header">
        <div
          className="brand-logo-pill"
          onClick={() => showScreen('student-map-screen')}
          style={{ cursor: 'pointer' }}
        >
          FLOWCHART <span>PWA</span>
        </div>

        <div className="header-controls">
          <button className="btn-y2k btn-amber btn-sm" onClick={toggleSound}>
            {isMuted ? '🔇 ปิดเสียง' : '🔊 เปิดเสียง'}
          </button>
          <button className="btn-y2k btn-primary btn-sm" onClick={onOpenAdmin}>
            🔑 ครูผู้สอน
          </button>
        </div>
      </header>

      <nav className="subnav-strip">
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span
            onClick={() => showScreen('student-map-screen')}
            style={{ cursor: 'pointer', color: currentScreen === 'student-map-screen' ? 'var(--primary)' : 'inherit' }}
          >
            🎮 ด่านเกม
          </span>
          <span>•</span>
          <span
            onClick={() => showScreen('tutorial-screen')}
            style={{ cursor: 'pointer', color: currentScreen === 'tutorial-screen' ? 'var(--primary)' : 'inherit' }}
          >
            📖 เรียนรู้สัญลักษณ์
          </span>
          <span>•</span>
          <span
            onClick={() => showScreen('certificate-screen')}
            style={{ cursor: 'pointer', color: currentScreen === 'certificate-screen' ? 'var(--primary)' : 'inherit' }}
          >
            🎓 ประกาศนียบัตร
          </span>
        </div>
        <div>
          {currentStudent && (
            <span onClick={onLogout} style={{ cursor: 'pointer', color: 'var(--primary)' }}>
              🚪 ออกจากระบบ ({currentStudent.name})
            </span>
          )}
        </div>
      </nav>
    </>
  );
}
