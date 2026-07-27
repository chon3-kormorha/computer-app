'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { P4_TOPIC_IDS, P5_TOPIC_IDS } from './TutorialScreen';

export default function StudentMap({ student, onPlayLevel, onOpenTutorial, onOpenCertificate }) {
  const [selectedTrack, setSelectedTrack] = useState('p4'); // 'p4' | 'p5'

  useEffect(() => {
    if (student && student.grade) {
      if (student.grade.startsWith('ป.5') || student.grade.startsWith('ป.6')) setSelectedTrack('p5');
      else setSelectedTrack('p4');
    }
  }, [student]);

  const completedLevels = Array.isArray(student?.levelsCompleted) ? student.levelsCompleted : [];
  const completedTopics = Array.isArray(student?.tutorialTopicsCompleted) ? student.tutorialTopicsCompleted : [];

  // Check if ALL required tutorial topics for current grade track are completed
  const p4TutorialDone = P4_TOPIC_IDS.every(id => completedTopics.includes(id));
  const p5TutorialDone = P5_TOPIC_IDS.every(id => completedTopics.includes(id));

  const isCurrentTrackTutorialDone = selectedTrack === 'p5' ? p5TutorialDone : p4TutorialDone;

  const handleLevelClick = (levelNum, isUnlocked) => {
    if (!isCurrentTrackTutorialDone) {
      Swal.fire({
        icon: 'warning',
        title: '🔒 ยังเข้าเล่นด่านไม่ได้!',
        text: `คุณยังเรียนรู้บทเรียน ${selectedTrack.toUpperCase()} ไม่ครบทั้งหมด กรุณาเรียนรู้ใน "คลังความรู้" ให้ครบทุกบทก่อนนะครับ`,
        confirmButtonText: '📖 ไปเรียนรู้ในคลังความรู้ ➔',
        showCancelButton: true,
        cancelButtonText: 'ยกเลิก',
        customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-signal' }
      }).then((res) => {
        if (res.isConfirmed) {
          onOpenTutorial();
        }
      });
      return;
    }

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
    { id: 1, name: 'ด่านที่ 1 (ป.4)', desc: 'จับคู่สัญลักษณ์กับรูปทรง', bg: '#d97706' },
    { id: 2, name: 'ด่านที่ 2 (ป.4)', desc: 'จับคู่สัญลักษณ์กับหน้าที่', bg: '#1d4ed8' },
    { id: 3, name: 'ด่านที่ 3 (ป.4)', desc: 'เรียงลำดับขั้นตอนแปรงฟัน', bg: '#0284c7' },
    { id: 4, name: 'ด่านที่ 4 (ป.4)', desc: 'ขั้นตอนการล้างมือ 7 ขั้นตอน', bg: '#15803d' },
    { id: 5, name: 'ด่านที่ 5 (ป.4)', desc: 'คาดการณ์ผลลัพธ์เกม OX', bg: '#ea580c' },
    { id: 6, name: 'ด่านที่ 6 (ป.4)', desc: 'ทดสอบความไวเชิงคำนวณ', bg: '#dc2626' },
    { id: 7, name: 'ด่านที่ 7 (ป.4)', desc: 'สืบค้น Keyword และเว็บ .go.th', bg: '#0284c7' },
    { id: 8, name: 'ด่านที่ 8 (ป.4)', desc: 'ตารางสารสนเทศ Spreadsheet', bg: '#1d4ed8' },
    { id: 9, name: 'ด่านที่ 9 (ป.4)', desc: 'การตั้งรหัสผ่านปลอดภัย', bg: '#475569' },
    { id: 10, name: 'ด่านที่ 10 (ป.4)', desc: 'Mini Challenge: เดินทางมาโรงเรียน', bg: '#d97706' }
  ];

  const p5Levels = [
    { id: 1, name: 'ด่านที่ 1 (ป.5)', desc: 'เลือกสัญลักษณ์ตามโจทย์', bg: '#d97706' },
    { id: 2, name: 'ด่านที่ 2 (ป.5)', desc: 'ผังงานต้มบะหมี่สำเร็จรูป (3 นาที)', bg: '#ea580c' },
    { id: 3, name: 'ด่านที่ 3 (ป.5)', desc: 'ผังงานระบบถอนเงินตู้ ATM', bg: '#15803d' },
    { id: 4, name: 'ด่านที่ 4 (ป.5)', desc: 'ผังงานตรวจดัชนีมวลกาย BMI', bg: '#1d4ed8' },
    { id: 5, name: 'ด่านที่ 5 (ป.5)', desc: 'ผังงานระบบตัดเกรดวิชาคำนวณ', bg: '#0284c7' },
    { id: 6, name: 'ด่านที่ 6 (ป.5)', desc: 'เปรียบเทียบข้อดี-ข้อเสียสารสนเทศ', bg: '#dc2626' },
    { id: 7, name: 'ด่านที่ 7 (ป.5)', desc: 'ประเมินความน่าเชื่อถือเว็บไซต์', bg: '#0284c7' },
    { id: 8, name: 'ด่านที่ 8 (ป.5)', desc: 'ประเมินความน่าเชื่อถือ Fake News', bg: '#1d4ed8' },
    { id: 9, name: 'ด่านที่ 9 (ป.5)', desc: 'การรับมือการกลั่นแกล้ง Cyberbullying', bg: '#475569' },
    { id: 10, name: 'ด่านที่ 10 (ป.5)', desc: 'Grand Challenge: ตู้สมาร์ทการ์ด', bg: '#d97706' }
  ];

  const activeLevels = selectedTrack === 'p5' ? p5Levels : p4Levels;

  return (
    <section className="screen-view" style={{ background: '#f1f5f9', padding: '20px', borderRadius: '16px' }}>
      <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '2px solid #334155', borderRadius: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h2 className="hero-display-title" style={{ margin: 0, fontSize: '22px', color: '#ffffff', textShadow: 'none' }}>🎮 แผนที่ 10 ด่านการเรียนรู้ (ประถมศึกษา)</h2>
            <p style={{ fontSize: '15px', fontWeight: '500', marginTop: '6px', color: '#cbd5e1' }}>
              ยินดีต้อนรับ! <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{student?.name || 'นักเรียน'}</span> ({student?.grade || 'ป.4/1'})
            </p>
          </div>
          <div
            className="inset-panel"
            style={{ background: '#334155', borderColor: '#475569', textAlign: 'right', color: 'white', borderRadius: '10px' }}
          >
            <div>
              คะแนนรวม: <strong style={{ color: '#f59e0b', fontSize: '18px' }}>{student?.score || 0}</strong>
            </div>
            <div>
              ดาวรวม: <strong style={{ color: '#fbbf24', fontSize: '18px' }}>{student?.stars || 0} ★</strong>
            </div>
          </div>
        </div>
      </div>

      {/* TUTORIAL REQUIREMENT ALERT BANNER */}
      {!isCurrentTrackTutorialDone && (
        <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🔒</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>ยังไม่ได้ปลดล็อกด่านเกมส์!</div>
              <div style={{ fontSize: '13px', color: '#92400e' }}>คุณต้องเข้าเรียนรู้ใน "คลังความรู้" ให้ครบทุกบทเรียนก่อน จึงจะสามารถเริ่มเล่นด่านเกมส์ได้</div>
            </div>
          </div>
          <button className="btn-y2k btn-signal btn-sm" onClick={onOpenTutorial}>
            📖 ไปคลังความรู้ ➔
          </button>
        </div>
      )}

      {/* TRACK SWITCHER TABS */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
        <button
          className={`btn-y2k ${selectedTrack === 'p4' ? 'btn-signal active' : 'btn-carbon'}`}
          onClick={() => setSelectedTrack('p4')}
          style={{ fontSize: '14px', padding: '10px 18px' }}
        >
          🎒 10 ด่านสำหรับ ชั้นประถมศึกษาปีที่ 4 (ป.4)
        </button>
        <button
          className={`btn-y2k ${selectedTrack === 'p5' ? 'btn-signal active' : 'btn-carbon'}`}
          onClick={() => setSelectedTrack('p5')}
          style={{ fontSize: '14px', padding: '10px 18px' }}
        >
          🎒 10 ด่านสำหรับ ชั้นประถมศึกษาปีที่ 5 (ป.5)
        </button>
      </div>

      <div className="section-header-bar" style={{ background: '#0f172a', color: '#ffffff', borderRadius: '8px', border: 'none', padding: '10px 16px', marginBottom: '16px' }}>
        <span>ผจญภัยในแผนที่ 10 ด่านของ {selectedTrack === 'p5' ? 'ชั้นประถมศึกษาปีที่ 5' : 'ชั้นประถมศึกษาปีที่ 4'}</span>
      </div>

      <div className="level-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {activeLevels.map((lvl) => {
          const levelKey = selectedTrack === 'p5' ? (lvl.id + 10) : lvl.id;
          const isLevelPassed = completedLevels.includes(levelKey);
          const isLevelUnlocked = isCurrentTrackTutorialDone && (lvl.id === 1 || completedLevels.includes(levelKey - 1));

          return (
            <div
              key={lvl.id}
              className={`level-card ${isLevelPassed ? 'passed' : isLevelUnlocked ? 'unlocked' : 'locked'}`}
              onClick={() => handleLevelClick(levelKey, isLevelUnlocked)}
              style={{
                cursor: isLevelUnlocked ? 'pointer' : 'not-allowed',
                position: 'relative',
                overflow: 'hidden',
                background: '#ffffff',
                border: '2px solid #cbd5e1',
                opacity: isLevelUnlocked ? 1 : 0.65
              }}
            >
              <div style={{ position: 'absolute', top: '8px', right: '8px', background: lvl.bg, color: '#fff', fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                {selectedTrack.toUpperCase()}
              </div>

              <div className="level-number-badge">{lvl.id}</div>
              <h3 className="level-name" style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a' }}>{lvl.name}</h3>
              <p className="level-desc" style={{ fontSize: '13px', color: '#475569' }}>{lvl.desc}</p>
              <div style={{ marginTop: '10px' }}>
                {isLevelPassed ? (
                  <span className="status-badge passed">✓ ผ่านแล้ว</span>
                ) : isLevelUnlocked ? (
                  <span className="status-badge ready">พร้อมเล่น ➔</span>
                ) : (
                  <span className="status-badge locked-badge">🔒 ล็อก</span>
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
