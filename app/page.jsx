'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Header from '../components/Header';
import LoginScreen from '../components/LoginScreen';
import StudentMap from '../components/StudentMap';
import GameStage from '../components/GameStage';
import TutorialScreen from '../components/TutorialScreen';
import AdminDashboard from '../components/AdminDashboard';
import CertificateModal from '../components/CertificateModal';
import { StorageEngine } from '../lib/storage';
import { SoundEngine } from '../lib/audio';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState('login-screen');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [activeLevel, setActiveLevel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState({
    studentPasscode: '1234',
    adminUsername: 'admin',
    adminPassword: 'admin1234',
    availableGrades: ['ป.4/1', 'ป.4/2', 'ป.4/3', 'ป.5/1', 'ป.5/2', 'ป.5/3', 'ป.6/1', 'ป.6/2']
  });

  useEffect(() => {
    setMounted(true);
    StorageEngine.fetchConfig().then(setConfig);

    const saved = StorageEngine.getCurrentStudent();
    if (saved && saved.name) {
      setCurrentStudent(saved);
      setCurrentScreen('student-map-screen');
    } else {
      setCurrentStudent(null);
      setCurrentScreen('login-screen');
    }
  }, []);

  const showScreen = (screenId) => {
    if ((screenId === 'student-map-screen' || screenId === 'game-stage-screen') && !currentStudent) {
      setCurrentScreen('login-screen');
      return;
    }
    setCurrentScreen(screenId);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handleLoginSuccess = async ({ name, grade }) => {
    const student = await StorageEngine.saveStudentProgress({ name, grade, hasCompletedTutorial: true });
    setCurrentStudent(student);
    showScreen('tutorial-screen');
  };

  const handlePlayLevel = (levelNum) => {
    setActiveLevel(levelNum);
    showScreen('game-stage-screen');
  };

  const handleFinishLevel = async (levelNum, score, stars) => {
    const completed = Array.isArray(currentStudent?.levelsCompleted) ? [...currentStudent.levelsCompleted] : [];
    if (!completed.includes(levelNum)) {
      completed.push(levelNum);
    }

    // P4 levels: 1-10, P5 levels: 11-20. Certificate when completed 10 in any single track.
    const p4Done = completed.filter(l => l >= 1 && l <= 10).length;
    const p5Done = completed.filter(l => l >= 11 && l <= 20).length;
    const earnedCert = p4Done >= 10 || p5Done >= 10;

    const updated = await StorageEngine.saveStudentProgress({
      score: (currentStudent?.score || 0) + score,
      stars: (currentStudent?.stars || 0) + stars,
      levelsCompleted: completed,
      certificateIssued: earnedCert
    });

    setCurrentStudent(updated);

    Swal.fire({
      icon: 'success',
      title: `🎉 ผ่านด่านที่ ${levelNum} สำเร็จ!`,
      text: `รับคะแนน +${score} แต้ม และดาว +${stars} ดวง!`,
      confirmButtonText: 'ไปหน้าแผนที่ ➔',
      customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-signal' }
    }).then(() => {
      showScreen('student-map-screen');
    });
  };

  const handleLogout = () => {
    StorageEngine.clearCurrentStudent();
    setCurrentStudent(null);
    showScreen('login-screen');
  };

  const handleOpenAdmin = () => {
    Swal.fire({
      title: '🔑 เข้าสู่ระบบครูผู้สอน',
      html: `
        <input id="admin-user" class="swal2-input" placeholder="ชื่อผู้ใช้งานครู">
        <input id="admin-pass" type="password" class="swal2-input" placeholder="รหัสผ่านเข้าสู่ระบบครู">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'เข้าสู่ระบบ',
      cancelButtonText: 'ยกเลิก',
      customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-primary', cancelButton: 'btn-y2k btn-carbon' },
      preConfirm: () => {
        const u = document.getElementById('admin-user').value.trim();
        const p = document.getElementById('admin-pass').value.trim();
        if (u === config.adminUsername && p === config.adminPassword) {
          return true;
        } else {
          Swal.showValidationMessage('ชื่อผู้ใช้งานหรือรหัสผ่านครูไม่ถูกต้อง!');
          return false;
        }
      }
    }).then((res) => {
      if (res.isConfirmed) {
        SoundEngine.playCorrect();
        showScreen('admin-screen');
      }
    });
  };

  if (!mounted) return null;

  return (
    <>
      <Header
        currentScreen={currentScreen}
        showScreen={showScreen}
        currentStudent={currentStudent}
        onLogout={handleLogout}
        onOpenAdmin={handleOpenAdmin}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentScreen === 'login-screen' && (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            availableGrades={config.availableGrades}
            studentPasscode={config.studentPasscode}
          />
        )}

        {currentScreen === 'student-map-screen' && (
          <StudentMap
            student={currentStudent}
            onPlayLevel={handlePlayLevel}
            onOpenTutorial={() => {
              if (currentStudent) {
                StorageEngine.saveStudentProgress({ hasCompletedTutorial: true }).then(setCurrentStudent);
              }
              showScreen('tutorial-screen');
            }}
            onOpenCertificate={() => showScreen('certificate-screen')}
          />
        )}

        {currentScreen === 'game-stage-screen' && (
          <GameStage
            levelNum={activeLevel}
            student={currentStudent}
            onFinishLevel={handleFinishLevel}
            onBackToMap={() => showScreen('student-map-screen')}
          />
        )}

        {currentScreen === 'tutorial-screen' && (
          <TutorialScreen
            student={currentStudent}
            onGoToMap={() => showScreen('student-map-screen')}
            onOpenCertificate={() => showScreen('certificate-screen')}
          />
        )}

        {currentScreen === 'admin-screen' && (
          <AdminDashboard
            onBackToMap={() => showScreen('student-map-screen')}
            onConfigChange={(newConfig) => {
              if (newConfig && newConfig.availableGrades) {
                setConfig(newConfig);
              }
            }}
          />
        )}

        {currentScreen === 'certificate-screen' && (
          <CertificateModal
            student={currentStudent}
            onBackToMap={() => showScreen('student-map-screen')}
          />
        )}
      </main>

      <footer
        style={{
          backgroundColor: 'var(--carbon)',
          color: '#ffffff',
          padding: '14px 18px',
          borderTop: '3px solid var(--chrome-indigo)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          fontWeight: 'bold'
        }}
      >
        <div>
          © 2026 NEXT.JS FLOWCHART GAME • <span style={{ color: '#ffeb3b' }}>ระบบสร้างโดย ครูรัตนา โศภิตประสาน (โรงเรียนบ้าน กม.ห้า)</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="btn-y2k btn-amber btn-sm" style={{ fontSize: '10px' }}>ESRB PRIVACY CERTIFIED</span>
          <span style={{ color: 'var(--nav-gold)', fontWeight: 'bold' }}>NEXT.JS + SQLITE 📱</span>
        </div>
      </footer>
    </>
  );
}
