'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function StudentMap({ student, onPlayLevel, onOpenTutorial, onOpenCertificate }) {
  const [selectedTrack, setSelectedTrack] = useState('p4'); // 'p4' | 'p5'

  useEffect(() => {
    if (student && student.grade) {
      if (student.grade.startsWith('ป.5')) setSelectedTrack('p5');
      else setSelectedTrack('p4');
    }
  }, [student]);

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

  const p4Levels = [
    { id: 1, name: 'ด่านที่ 1 (ป.4)', desc: 'จับคู่สัญลักษณ์กับรูปทรง', bg: '#ecab37' },
    { id: 2, name: 'ด่านที่ 2 (ป.4)', desc: 'จับคู่สัญลักษณ์กับหน้าที่', bg: '#3d4f97' },
    { id: 3, name: 'ด่านที่ 3 (ป.4)', desc: 'เรียงลำดับขั้นตอนแปรงฟัน', bg: '#206479' },
    { id: 4, name: 'ด่านที่ 4 (ป.4)', desc: 'ขั้นตอนการล้างมือ 7 ขั้นตอน', bg: '#15803d' },
    { id: 5, name: 'ด่านที่ 5 (ป.4)', desc: 'คาดการณ์ผลลัพธ์เกม OX', bg: '#f68d1f' },
    { id: 6, name: 'ด่านที่ 6 (ป.4)', desc: 'ทดสอบความไวเชิงคำนวณ', bg: '#e60012' },
    { id: 7, name: 'ด่านที่ 7 (ป.4)', desc: 'สืบค้น Keyword และเว็บ .go.th', bg: '#206479' },
    { id: 8, name: 'ด่านที่ 8 (ป.4)', desc: 'ตารางสารสนเทศ Spreadsheet', bg: '#3d4f97' },
    { id: 9, name: 'ด่านที่ 9 (ป.4)', desc: 'การตั้งรหัสผ่านปลอดภัย', bg: '#1e293b' },
    { id: 10, name: 'ด่านที่ 10 (ป.4)', desc: 'Mini Challenge: เดินทางมาโรงเรียน', bg: '#ecab37' }
  ];

  const p5Levels = [
    { id: 1, name: 'ด่านที่ 1 (ป.5)', desc: 'แก้ปัญหาเกมตาราง Sudoku', bg: '#ecab37' },
    { id: 2, name: 'ด่านที่ 2 (ป.5)', desc: 'เลือกสัญลักษณ์ตามโจทย์', bg: '#f68d1f' },
    { id: 3, name: 'ด่านที่ 3 (ป.5)', desc: 'ผังงานต้มบะหมี่สำเร็จรูป (3 นาที)', bg: '#15803d' },
    { id: 4, name: 'ด่านที่ 4 (ป.5)', desc: 'ผังงานระบบถอนเงินตู้ ATM', bg: '#3d4f97' },
    { id: 5, name: 'ด่านที่ 5 (ป.5)', desc: 'ผังงานตรวจดัชนีมวลกาย BMI', bg: '#206479' },
    { id: 6, name: 'ด่านที่ 6 (ป.5)', desc: 'ผังงานระบบตัดเกรดวิชาคำนวณ', bg: '#e60012' },
    { id: 7, name: 'ด่านที่ 7 (ป.5)', desc: 'เปรียบเทียบข้อดี-ข้อเสียสารสนเทศ', bg: '#206479' },
    { id: 8, name: 'ด่านที่ 8 (ป.5)', desc: 'ประเมินความน่าเชื่อถือ Fake News', bg: '#3d4f97' },
    { id: 9, name: 'ด่านที่ 9 (ป.5)', desc: 'การรับมือการกลั่นแกล้ง Cyberbullying', bg: '#1e293b' },
    { id: 10, name: 'ด่านที่ 10 (ป.5)', desc: 'Grand Challenge: ตู้สมาร์ทการ์ด', bg: '#ecab37' }
  ];

  const activeLevels = selectedTrack === 'p5' ? p5Levels : p4Levels;

  return (
    <section className="screen-view">
      <div className="hero-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2 className="hero-display-title" style={{ margin: 0 }}>🎮 แผนที่ 10 ด่านการเรียนรู้ (ประถมศึกษา)</h2>
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

      {/* TRACK SWITCHER TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
        <button
          className={`btn-y2k ${selectedTrack === 'p4' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => setSelectedTrack('p4')}
          style={{ fontSize: '14px', padding: '10px 18px' }}
        >
          🎒 10 ด่านสำหรับ ชั้นประถมศึกษาปีที่ 4 (ป.4)
        </button>
        <button
          className={`btn-y2k ${selectedTrack === 'p5' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => setSelectedTrack('p5')}
          style={{ fontSize: '14px', padding: '10px 18px' }}
        >
          🎒 10 ด่านสำหรับ ชั้นประถมศึกษาปีที่ 5 (ป.5)
        </button>
      </div>

      <div className="section-header-bar">
        <span>ผจญภัยในแผนที่ 10 ด่านของ {selectedTrack === 'p5' ? 'ชั้นประถมศึกษาปีที่ 5' : 'ชั้นประถมศึกษาปีที่ 4'}</span>
      </div>

      <div className="level-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {activeLevels.map((lvl) => {
          const levelKey = selectedTrack === 'p5' ? (lvl.id + 10) : lvl.id;
          const isUnlocked = lvl.id === 1 || completed.includes(levelKey - 1);
          const isPassed = completed.includes(levelKey);

          return (
            <div
              key={lvl.id}
              className={`level-card ${isPassed ? 'passed' : isUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleLevelClick(levelKey, isUnlocked)}
              style={{ cursor: isUnlocked ? 'pointer' : 'not-allowed', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: lvl.bg, color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                {selectedTrack.toUpperCase()}
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
