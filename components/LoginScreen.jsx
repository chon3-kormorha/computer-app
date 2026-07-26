'use client';

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { SoundEngine } from '@/lib/audio';

export default function LoginScreen({ onLoginSuccess, availableGrades = [], studentPasscode = '1234' }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(availableGrades[0] || 'ป.4/1');
  const [passcode, setPasscode] = useState('1234');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณากรอกชื่อ-นามสกุล',
        text: 'กรุณากรอกชื่อนักเรียนก่อนเข้าเล่นนะครับ',
        customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title' }
      });
      return;
    }

    if (passcode.trim() !== studentPasscode) {
      SoundEngine.playWrong();
      Swal.fire({
        icon: 'error',
        title: 'รหัสผ่านไม่ถูกต้อง!',
        text: `รหัสผ่านเริ่มต้นสำหรับนักเรียนคือ ${studentPasscode}`,
        customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title' }
      });
      return;
    }

    SoundEngine.playCorrect();
    onLoginSuccess({ name: name.trim(), grade });
  };

  return (
    <section className="screen-view">
      <div className="hero-panel">
        <h1 className="hero-display-title">WELCOME TO FLOWCHART GAME</h1>
        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
          ผจญภัยเรียนรู้สัญลักษณ์และขั้นตอน Flowchart สไตล์ Retro Game Console!
        </p>
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
        <div className="metal-plate plate-chamfered">
          <div className="section-header-bar" style={{ margin: '-16px -16px 16px -16px' }}>
            <span>≡ เข้าสู่ระบบนักเรียน (STUDENT LOGIN)</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-student-name">👤 ชื่อ-นามสกุล:</label>
              <input
                type="text"
                id="login-student-name"
                className="form-input"
                placeholder="เช่น เด็กชาย ดนัย สุขเจริญ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-student-grade">🏫 ชั้นเรียน / ห้องเรียน:</label>
              <select
                id="login-student-grade"
                className="form-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                {availableGrades.map((g) => (
                  <option key={g} value={g}>
                    ชั้นประถมศึกษาปีที่ {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-student-passcode">🔑 รหัสผ่านเข้าเกม (รหัสเริ่มต้น: 1234):</label>
              <input
                type="password"
                id="login-student-passcode"
                className="form-input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button type="submit" className="btn-y2k btn-signal btn-lg" style={{ width: '100%' }}>
                🎮 เริ่มการผจญภัย Flowchart ➔
              </button>
            </div>

            <div
              style={{
                marginTop: '16px',
                padding: '10px 14px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                textAlign: 'center',
                fontSize: '13px',
                color: '#ffffff',
                fontWeight: 'bold',
                border: '1.5px solid var(--amber)'
              }}
            >
              🏫 ระบบสร้างโดย ครูรัตนา โศภิตประสาน (โรงเรียนบ้าน กม.ห้า)
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
