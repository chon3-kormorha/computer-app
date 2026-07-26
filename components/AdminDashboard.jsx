'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { StorageEngine } from '../lib/storage';
import { SoundEngine } from '../lib/audio';

export default function AdminDashboard({ onBackToMap, onConfigChange }) {
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'classrooms' | 'password'
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newGradeInput, setNewGradeInput] = useState('');

  // Password Change state
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('');
  const [adminPassConfirm, setAdminPassConfirm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const roster = await StorageEngine.fetchRoster();
    setStudents(roster || []);

    const cfg = await StorageEngine.fetchConfig();
    if (cfg) {
      if (cfg.availableGrades) setClassrooms(cfg.availableGrades);
      if (cfg.adminUsername) setAdminUser(cfg.adminUsername);
      if (onConfigChange) onConfigChange(cfg);
    }
  };

  const handleClearAllStudents = () => {
    Swal.fire({
      title: '⚠️ ยืนยันการล้างข้อมูลนักเรียนทั้งหมด?',
      text: 'ประวัตินักเรียน คะแนน ดาว และเกียรติบัตรทั้งหมดจะถูกลบทิ้งอย่างถาวร!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '🧹 ยืนยันล้างข้อมูลทั้งหมด',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-primary' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        SoundEngine.playWrong();
        const cleared = await StorageEngine.clearAllStudents();
        setStudents(cleared || []);
        Swal.fire({ icon: 'success', title: 'ล้างข้อมูลสำเร็จ!', text: 'ลบประวัตินักเรียนทั้งหมดเรียบร้อยแล้ว', customClass: { popup: 'swal-y2k-popup' } });
      }
    });
  };

  const handleDeleteSingleStudent = (id, name) => {
    Swal.fire({
      title: `🗑️ ลบประวัตินักเรียน: ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-primary' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        SoundEngine.playWrong();
        const updated = await StorageEngine.deleteStudent(id);
        setStudents(updated || []);
        Swal.fire({ icon: 'success', title: 'ลบข้อมูลสำเร็จ!', text: `ลบข้อมูล ${name} เรียบร้อยแล้ว`, customClass: { popup: 'swal-y2k-popup' } });
      }
    });
  };

  const handleAddClassroom = async (e) => {
    e.preventDefault();
    const val = newGradeInput.trim();
    if (!val) return;

    if (classrooms.includes(val)) {
      Swal.fire({ icon: 'warning', title: 'มีชั้นเรียนนี้อยู่แล้ว!', text: `ชั้นเรียน ${val} มีอยู่ในระบบแล้ว`, customClass: { popup: 'swal-y2k-popup' } });
      return;
    }

    SoundEngine.playCorrect();
    const updatedCfg = await StorageEngine.addClassroom(val);
    setNewGradeInput('');
    if (updatedCfg && updatedCfg.availableGrades) {
      setClassrooms(updatedCfg.availableGrades);
      if (onConfigChange) onConfigChange(updatedCfg);
    }

    Swal.fire({ icon: 'success', title: 'เพิ่มชั้นเรียนสำเร็จ!', text: `เพิ่ม ${val} เข้าสู่ระบบเรียบร้อยแล้ว`, customClass: { popup: 'swal-y2k-popup' } });
  };

  const handleEditClassroom = (oldGrade) => {
    Swal.fire({
      title: `✏️ แก้ไขชื่อชั้นเรียน: ${oldGrade}`,
      input: 'text',
      inputValue: oldGrade,
      showCancelButton: true,
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-signal' },
      inputValidator: (value) => {
        if (!value.trim()) {
          return 'กรุณากรอกชื่อชั้นเรียน!';
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newGrade = result.value.trim();
        if (newGrade === oldGrade) return;

        SoundEngine.playCorrect();
        const updatedCfg = await StorageEngine.updateClassroom(oldGrade, newGrade);
        if (updatedCfg && updatedCfg.availableGrades) {
          setClassrooms(updatedCfg.availableGrades);
          if (onConfigChange) onConfigChange(updatedCfg);
        }
        Swal.fire({ icon: 'success', title: 'แก้ไขสำเร็จ!', text: `เปลี่ยนจาก ${oldGrade} เป็น ${newGrade} เรียบร้อยแล้ว`, customClass: { popup: 'swal-y2k-popup' } });
      }
    });
  };

  const handleDeleteClassroom = (grade) => {
    Swal.fire({
      title: `🗑️ ยืนยันการลบชั้นเรียน ${grade}?`,
      text: 'นักเรียนจะไม่สามารถเลือกชั้นเรียนนี้ตอนเข้าสู่ระบบได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยันลบ',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-primary' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        SoundEngine.playWrong();
        const updatedCfg = await StorageEngine.deleteClassroom(grade);
        if (updatedCfg && updatedCfg.availableGrades) {
          setClassrooms(updatedCfg.availableGrades);
          if (onConfigChange) onConfigChange(updatedCfg);
        }
        Swal.fire({ icon: 'success', title: 'ลบชั้นเรียนแล้ว!', text: `ลบชั้นเรียน ${grade} เรียบร้อยแล้ว`, customClass: { popup: 'swal-y2k-popup' } });
      }
    });
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!adminUser.trim()) {
      Swal.fire({ icon: 'warning', title: 'กรุณากรอกชื่อผู้ใช้งานครู!', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    if (!adminPass) {
      Swal.fire({ icon: 'warning', title: 'กรุณากรอกรหัสผ่านใหม่!', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    if (adminPass !== adminPassConfirm) {
      Swal.fire({ icon: 'warning', title: 'รหัสผ่านใหม่สองช่องไม่ตรงกัน!', text: 'กรุณาตรวจสอบรหัสผ่านใหม่อีกครั้ง', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }

    SoundEngine.playCorrect();
    const updatedCfg = await StorageEngine.updateAdminCredentials(adminUser.trim(), adminPass);
    if (onConfigChange) onConfigChange(updatedCfg);

    setAdminPass('');
    setAdminPassConfirm('');

    Swal.fire({
      icon: 'success',
      title: '🔐 เปลี่ยนรหัสผ่านสำเร็จ!',
      text: `อัปเดตรหัสผ่านใหม่สำหรับชื่อผู้ใช้ ${adminUser.trim()} เรียบร้อยแล้ว`,
      customClass: { popup: 'swal-y2k-popup' }
    });
  };

  return (
    <section className="screen-view">
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-y2k btn-carbon btn-sm" onClick={onBackToMap}>
          ◀ ออกจากระบบครู
        </button>
        <span style={{ color: 'var(--amber)', fontWeight: 'bold', fontSize: '14px' }}>
          🔑 ระบบบริหารจัดการสำหรับครูผู้สอน
        </span>
      </div>

      <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <h2 className="hero-display-title">📊 ระบบครูผู้สอน (ADMIN CONTROL)</h2>
        <p style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '4px' }}>
          ระบบสร้างโดย ครูรัตนา โศภิตประสาน (โรงเรียนบ้าน กม.ห้า)
        </p>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn-y2k ${activeTab === 'roster' ? 'btn-amber' : 'btn-carbon'}`}
            onClick={() => setActiveTab('roster')}
          >
            📋 รายนามและผลการเรียนนักเรียน ({students.length})
          </button>
          <button
            className={`btn-y2k ${activeTab === 'classrooms' ? 'btn-amber' : 'btn-carbon'}`}
            onClick={() => setActiveTab('classrooms')}
          >
            🏫 จัดการชั้นเรียน (CRUD) ({classrooms.length})
          </button>
          <button
            className={`btn-y2k ${activeTab === 'password' ? 'btn-amber' : 'btn-carbon'}`}
            onClick={() => setActiveTab('password')}
          >
            🔐 ตั้งค่ารหัสผ่านครู
          </button>
        </div>

        {activeTab === 'roster' && students.length > 0 && (
          <button className="btn-y2k btn-primary btn-sm" onClick={handleClearAllStudents}>
            🧹 ล้างข้อมูลนักเรียนทั้งหมด
          </button>
        )}
      </div>

      {/* TAB 1: STUDENT ROSTER */}
      {activeTab === 'roster' && (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อ - นามสกุล</th>
                <th>ชั้นเรียน</th>
                <th>คะแนนรวม</th>
                <th>ดาว</th>
                <th>ด่านที่ผ่าน</th>
                <th>เกียรติบัตร</th>
                <th>ใช้งานล่าสุด</th>
                <th style={{ textAlign: 'right' }}>ลบ</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                    ยังไม่มีข้อมูลนักเรียนในระบบ
                  </td>
                </tr>
              ) : (
                students.map((st, idx) => (
                  <tr key={st.id || idx}>
                    <td>{idx + 1}</td>
                    <td><strong>{st.name}</strong></td>
                    <td><span className="status-badge ready" style={{ fontSize: '11px', padding: '2px 8px' }}>{st.grade}</span></td>
                    <td><strong style={{ color: 'var(--signal)' }}>{st.score || 0}</strong></td>
                    <td><strong style={{ color: 'var(--amber)' }}>{st.stars || 0} ★</strong></td>
                    <td>{(st.levelsCompleted || []).join(', ') || '-'}</td>
                    <td>{st.certificateIssued ? '✓ ออกแล้ว' : 'ยังไม่ออก'}</td>
                    <td>{st.lastActive || '-'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-y2k btn-primary btn-sm"
                        onClick={() => handleDeleteSingleStudent(st.id, st.name)}
                        title="ลบเฉพาะนักเรียนคนนี้"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: CLASSROOM MANAGEMENT (CRUD) */}
      {activeTab === 'classrooms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="content-card" style={{ background: '#ffffff', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
              ➕ เพิ่มชั้นเรียนใหม่ (Create Classroom)
            </h3>
            <form onSubmit={handleAddClassroom} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="ระบุชื่อชั้นเรียน เช่น ป.4/3 หรือ ม.2/1"
                value={newGradeInput}
                onChange={(e) => setNewGradeInput(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-y2k btn-signal">
                ➕ เพิ่มชั้นเรียน
              </button>
            </form>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ชื่อชั้นเรียน</th>
                  <th>จำนวนนักเรียนในระบบ</th>
                  <th style={{ textAlign: 'right' }}>จัดการ (Actions)</th>
                </tr>
              </thead>
              <tbody>
                {classrooms.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                      ยังไม่มีชั้นเรียนในระบบ
                    </td>
                  </tr>
                ) : (
                  classrooms.map((cls, idx) => {
                    const count = students.filter(s => s.grade === cls).length;
                    return (
                      <tr key={cls}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong style={{ fontSize: '15px', color: 'var(--chrome-indigo)' }}>{cls}</strong>
                        </td>
                        <td>
                          <span className="status-badge passed" style={{ fontSize: '12px' }}>
                            {count} คน
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-y2k btn-amber btn-sm"
                            onClick={() => handleEditClassroom(cls)}
                            style={{ marginRight: '6px' }}
                          >
                            ✏️ แก้ไขชื่อ
                          </button>
                          <button
                            className="btn-y2k btn-primary btn-sm"
                            onClick={() => handleDeleteClassroom(cls)}
                          >
                            🗑️ ลบ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ADMIN PASSWORD CHANGE */}
      {activeTab === 'password' && (
        <div className="content-card" style={{ background: '#ffffff', borderRadius: '14px', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', marginBottom: '14px', textAlign: 'center' }}>
            🔐 ตั้งค่าและเปลี่ยนรหัสผ่านเข้าสู่ระบบครูผู้สอน
          </h3>

          <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
                ชื่อผู้ใช้งาน (Admin Username):
              </label>
              <input
                type="text"
                className="form-input"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                placeholder="ชื่อผู้ใช้งานครู"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
                รหัสผ่านใหม่ (New Password):
              </label>
              <input
                type="password"
                className="form-input"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#334155' }}>
                ยืนยันรหัสผ่านใหม่ (Confirm New Password):
              </label>
              <input
                type="password"
                className="form-input"
                value={adminPassConfirm}
                onChange={(e) => setAdminPassConfirm(e.target.value)}
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                required
              />
            </div>

            <button type="submit" className="btn-y2k btn-signal btn-lg" style={{ marginTop: '10px' }}>
              💾 บันทึกเปลี่ยนรหัสผ่านครูผู้สอน
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
