'use client';

import React from 'react';
import Swal from 'sweetalert2';

export default function StudentMap({ student, onPlayLevel, onOpenTutorial, onOpenCertificate }) {
  const completed = Array.isArray(student?.levelsCompleted) ? student.levelsCompleted : [];

  const handleLevelClick = (levelNum, isUnlocked) => {
    if (isUnlocked) {
      onPlayLevel(levelNum);
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'ด่านนี้ล็อกอยู่!',
        text: 'กรุณาเล่นด่านก่อนหน้าให้ผ่านก่อนครับ',
        customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title' }
      });
    }
  };

  const levelTitles = [
    { id: 1, name: 'ด่านที่ 1', desc: 'จับคู่ชื่อกับรูปทรง' },
    { id: 2, name: 'ด่านที่ 2', desc: 'จับคู่สัญลักษณ์กับหน้าที่' },
    { id: 3, name: 'ด่านที่ 3', desc: 'เรียงลำดับขั้นตอน' },
    { id: 4, name: 'ด่านที่ 4', desc: 'ทดสอบความไว (จับเวลา)' },
    { id: 5, name: 'ด่านที่ 5', desc: 'Mini Challenge สมบูรณ์' }
  ];

  return (
    <section className="screen-view">
      <div className="hero-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2 className="hero-display-title" style={{ margin: 0 }}>🎮 แผนที่ด่านการเรียนรู้</h2>
            <p style={{ fontSize: '15px', fontWeight: 'bold', marginTop: '6px', color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
              ยินดีต้อนรับ! <span style={{ color: '#ffeb3b', textDecoration: 'underline' }}>{student?.name || 'นักเรียน'}</span> ({student?.grade || 'ป.4/1'})
            </p>
          </div>
          <div
            className="inset-panel"
            style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'var(--amber)', textAlign: 'right', color: 'white' }}
          >
            <div>
              คะแนนรวม: <strong style={{ color: 'var(--signal)', fontSize: '18px' }}>{student?.score || 0}</strong>
            </div>
            <div>
              ดาวรวม: <strong style={{ color: 'var(--amber)', fontSize: '18px' }}>{student?.stars || 0} ★</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header-bar">
        <span>เลือกด่านเพื่อเริ่มเล่น (5 LEVELS OF FLOWCHART)</span>
      </div>

      <div className="level-grid">
        {levelTitles.map((lvl) => {
          const isUnlocked = lvl.id === 1 || completed.includes(lvl.id - 1);
          const isPassed = completed.includes(lvl.id);

          return (
            <div
              key={lvl.id}
              className={`level-card ${isUnlocked ? '' : 'locked'}`}
              onClick={() => handleLevelClick(lvl.id, isUnlocked)}
            >
              <div className="level-number-badge">{lvl.id}</div>
              <h4 style={{ color: '#1e293b', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{lvl.name}</h4>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '12px', lineHeight: 1.3 }}>
                {lvl.desc}
              </p>
              <div style={{ marginTop: '4px' }}>
                {isPassed ? (
                  <span className="status-badge passed">✓ ผ่านแล้ว (★★★)</span>
                ) : isUnlocked ? (
                  <span className="status-badge ready">▶ เริ่มเล่น</span>
                ) : (
                  <span className="status-badge locked-badge">🔒 ล็อกอยู่</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn-y2k btn-amber" onClick={onOpenTutorial}>
          📖 ทบทวนสัญลักษณ์
        </button>
        <button className="btn-y2k btn-signal" onClick={onOpenCertificate}>
          🎓 ดูประกาศนียบัตร
        </button>
      </div>
    </section>
  );
}
