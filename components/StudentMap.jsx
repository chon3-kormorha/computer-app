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
    { id: 1, name: 'ด่านที่ 1', desc: 'จับคู่สัญลักษณ์กับรูปทรง', grade: 'ป.4', bg: '#ecab37' },
    { id: 2, name: 'ด่านที่ 2', desc: 'จับคู่สัญลักษณ์กับหน้าที่', grade: 'ป.4', bg: '#3d4f97' },
    { id: 3, name: 'ด่านที่ 3', desc: 'เรียงลำดับขั้นตอนแปรงฟัน', grade: 'ป.4', bg: '#206479' },
    { id: 4, name: 'ด่านที่ 4', desc: 'ทดสอบความไวเชิงตรรกะ', grade: 'ป.4', bg: '#e60012' },
    { id: 5, name: 'ด่านที่ 5', desc: 'เลือกสัญลักษณ์ตามโจทย์', grade: 'ป.5', bg: '#f68d1f' },
    { id: 6, name: 'ด่านที่ 6', desc: 'ผังงานต้มบะหมี่สำเร็จรูป', grade: 'ป.5', bg: '#15803d' },
    { id: 7, name: 'ด่านที่ 7', desc: 'ระบบถอนเงินตู้ ATM', grade: 'ป.5', bg: '#3d4f97' },
    { id: 8, name: 'ด่านที่ 8', desc: 'ตรวจดัชนีมวลกาย BMI', grade: 'ป.5', bg: '#206479' },
    { id: 9, name: 'ด่านที่ 9', desc: 'ระบบเข้าสู่ระบบยืนยันตัวตน', grade: 'ม.1', bg: '#1e293b' },
    { id: 10, name: 'ด่านที่ 10', desc: 'การเดินทางและสภาพอากาศ', grade: 'ม.1', bg: '#ecab37' }
  ];

  return (
    <section className="screen-view">
      <div className="hero-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2 className="hero-display-title" style={{ margin: 0 }}>🎮 แผนที่ด่านการเรียนรู้ (10 LEVELS)</h2>
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
        <span>เลือกด่านเพื่อเริ่มผจญภัย (ด่านที่ 1 ถึง 10 แยกตามระดับสายชั้น ป.4, ป.5, ม.1)</span>
      </div>

      <div className="level-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {levelTitles.map((lvl) => {
          const isUnlocked = lvl.id === 1 || completed.includes(lvl.id - 1);
          const isPassed = completed.includes(lvl.id);

          return (
            <div
              key={lvl.id}
              className={`level-card ${isPassed ? 'passed' : isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleLevelClick(lvl.id, isUnlocked)}
              style={{ cursor: isUnlocked ? 'pointer' : 'not-allowed', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: lvl.bg, color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                {lvl.grade}
              </div>

              <div className="level-number-badge">{lvl.id}</div>
              <h3 className="level-name">{lvl.name}</h3>
              <p className="level-desc">{lvl.desc}</p>
              <div style={{ marginTop: '10px' }}>
                {isPassed ? (
                  <span className="status-badge passed">✓ ผ่านแล้ว</span>
                ) : isUnlocked ? (
                  <span className="status-badge ready">พร้อมเล่น ➔</span>
                ) : (
                  <span className="status-badge locked">🔒 ล็อก</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn-y2k btn-amber btn-lg" onClick={onOpenTutorial}>
          📖 คลังความรู้วิชาวิทยาการคำนวณ
        </button>
        <button className="btn-y2k btn-signal btn-lg" onClick={onOpenCertificate}>
          🎓 รับเกียรติบัตร (เมื่อผ่านครบ 10 ด่าน)
        </button>
      </div>
    </section>
  );
}
