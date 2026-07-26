'use client';

import React from 'react';
import Swal from 'sweetalert2';

export default function CertificateModal({ student, onBackToMap }) {
  const completed = Array.isArray(student?.levelsCompleted) ? student.levelsCompleted : [];
  const has5Levels = completed.length >= 5;
  const hasTutorial = Boolean(student?.hasCompletedTutorial);

  if (!has5Levels || !hasTutorial) {
    let msg = 'คุณต้องทำตามเงื่อนไขต่อไปนี้ก่อนจึงจะสามารถออกประกาศนียบัตรได้ครับ:\n\n';
    if (!has5Levels) {
      msg += `• เล่นผ่านครบทั้ง 5 ด่าน (ปัจจุบันผ่าน ${completed.length}/5 ด่าน)\n`;
    }
    if (!hasTutorial) {
      msg += `• เข้าทบทวนความรู้ในหน้า "📖 เรียนรู้สัญลักษณ์" อย่างน้อย 1 ครั้ง\n`;
    }

    return (
      <section className="screen-view">
        <div style={{ marginBottom: '16px' }}>
          <button className="btn-y2k btn-carbon btn-sm" onClick={onBackToMap}>
            ◀ กลับหน้าแผนที่
          </button>
        </div>

        <div className="content-card" style={{ textAlign: 'center', padding: '30px', background: '#ffffff', borderRadius: '12px' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '12px' }}>🔒 ยังไม่สามารถออกประกาศนียบัตรได้</h2>
          <p style={{ whiteSpace: 'pre-line', fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{msg}</p>
          <div style={{ marginTop: '20px' }}>
            <button className="btn-y2k btn-amber" onClick={onBackToMap}>
              🎮 กลับไปสะสมด่านและทบทวนความรู้
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section className="screen-view">
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-y2k btn-carbon btn-sm" onClick={onBackToMap}>
          ◀ กลับหน้าแผนที่
        </button>
        <button className="btn-y2k btn-signal" onClick={handlePrint}>
          🖨️ พิมพ์ / พิมพ์เป็น PDF
        </button>
      </div>

      <div className="certificate-frame">
        <h1 style={{ fontFamily: 'Sarabun, sans-serif', color: '#c5a059', fontSize: '26px', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
          ประกาศนียบัตรสัมฤทธิผล
        </h1>
        <p style={{ fontSize: '14px', color: '#666', marginTop: '6px' }}>CERTIFICATE OF COMPUTATIONAL THINKING ACHIEVEMENT</p>

        <p style={{ marginTop: '24px', fontSize: '15px' }}>ขอมอบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า</p>
        <h2 style={{ fontSize: '28px', color: '#1e293b', margin: '14px 0', textDecoration: 'underline', fontWeight: 700 }}>
          {student?.name || 'นักเรียน'}
        </h2>
        <p style={{ fontSize: '15px' }}>
          นักเรียนชั้นประถมศึกษาปีที่ <strong>{student?.grade || 'ป.4/1'}</strong>
        </p>

        <p style={{ marginTop: '16px', fontSize: '14px', lineHeight: 1.6, maxWidth: '600px', margin: '16px auto 0 auto' }}>
          ได้ผ่านการทดสอบหลักสูตรสาระเทคโนโลยี (วิทยาการคำนวณ) ระดับชั้นประถมศึกษาปีที่ 4 และ 5
          ครบถ้วนทั้ง 5 ด่านผังงาน (Flowchart) ด้วยคะแนนรวม <strong>{student?.score || 500}</strong> คะแนน ({student?.stars || 15} ★)
        </p>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderBottom: '2px solid #333', width: '200px', margin: '0 auto 6px auto', fontWeight: 'bold' }}>
              ครูรัตนา โศภิตประสาน
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>ครูผู้สอนวิชาวิทยาการคำนวณ</div>
            <div style={{ fontSize: '12px', color: '#666', fontWeight: 'bold' }}>โรงเรียนบ้าน กม.ห้า</div>
          </div>
        </div>
      </div>
    </section>
  );
}
