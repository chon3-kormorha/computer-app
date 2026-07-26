/* ==========================================================================
   Main Application Controller & Navigation
   ========================================================================== */

// --- SweetAlert2 Custom Y2K Popup Overrides ---
const nativeAlert = window.alert;

window.alert = function (message) {
  if (typeof Swal !== 'undefined') {
    let title = 'แจ้งเตือนระบบ';
    let icon = 'info';
    let btnColor = '#f68d1f';

    if (typeof message === 'string') {
      if (message.includes('ถูกต้อง') || message.includes('สำเร็จ') || message.includes('ผ่าน')) {
        title = '🎉 ยอดเยี่ยมมาก!';
        icon = 'success';
        btnColor = '#28a745';
      } else if (message.includes('ปรับ') || message.includes('ลอง') || message.includes('ไม่ถูกต้อง') || message.includes('สลับตำแหน่ง') || message.includes('ผิด')) {
        title = '💡 ลองใหม่อีกครั้งนะ!';
        icon = 'warning';
        btnColor = '#f68d1f';
      } else if (message.includes('หมดเวลา')) {
        title = '⏱️ หมดเวลา!';
        icon = 'error';
        btnColor = '#e60012';
      }
    }

    Swal.fire({
      title: title,
      html: `<div style="font-size: 15px; font-weight: bold; color: #21242e; padding: 6px 0;">${message}</div>`,
      icon: icon,
      confirmButtonText: 'ตกลง ➔',
      confirmButtonColor: btnColor,
      background: '#f7f9fd',
      customClass: {
        popup: 'swal-y2k-popup',
        title: 'swal-y2k-title',
        confirmButton: 'btn-y2k btn-signal'
      },
      buttonsStyling: false
    });
  } else {
    nativeAlert(message);
  }
};

window.showConfirmModal = function (title, text, onConfirm) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: title,
      html: `<div style="font-size: 14px; font-weight: 500; color: #21242e; padding: 4px 0;">${text}</div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ดำเนินการ!',
      cancelButtonText: 'ยกเลิก',
      background: '#f7f9fd',
      customClass: {
        popup: 'swal-y2k-popup',
        title: 'swal-y2k-title',
        confirmButton: 'btn-y2k btn-signal',
        cancelButton: 'btn-y2k btn-carbon'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed && typeof onConfirm === 'function') {
        onConfirm();
      }
    });
  } else {
    if (confirm(`${title}\n${text}`)) {
      if (typeof onConfirm === 'function') onConfirm();
    }
  }
};

const App = (() => {
  let deferredInstallPrompt = null;

  function init() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
          .catch(err => console.warn('[PWA] Service Worker registration failed:', err));
      });
    }

    // Capture PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const installBtn = document.getElementById('pwa-install-btn');
      if (installBtn) installBtn.style.display = 'inline-flex';
    });

    populateGradeSelect();

    // Check existing student session
    const currentStudent = StorageEngine.getCurrentStudent();
    if (currentStudent && currentStudent.name) {
      showScreen('student-map-screen', true);
    } else {
      showScreen('login-screen', true);
    }

    updateSoundUI();
  }

  function populateGradeSelect() {
    const select = document.getElementById('login-student-grade');
    if (!select) return;
    const config = StorageEngine.getConfig();
    select.innerHTML = (config.availableGrades || []).map(g => `<option value="${g}">${g}</option>`).join('');
  }


  function showScreen(screenId, silent = false) {
    if (!silent && typeof SoundEngine !== 'undefined' && SoundEngine.playClick) {
      SoundEngine.playClick();
    }
    if (typeof GameEngine !== 'undefined' && GameEngine.closeModal) {
      GameEngine.closeModal();
    }
    document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
    }
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (screenId === 'student-map-screen') {
      renderStudentMap();
    } else if (screenId === 'admin-screen') {
      AdminEngine.renderDashboard();
    } else if (screenId === 'tutorial-screen') {
      const student = StorageEngine.getCurrentStudent();
      if (student) {
        student.hasCompletedTutorial = true;
        StorageEngine.saveStudentProgress(student);
      }
    }
  }

  function renderStudentMap() {
    const student = StorageEngine.getCurrentStudent() || {
      name: 'ผู้เล่นทั่วไป',
      grade: 'ทั่วไป',
      score: 0,
      stars: 0,
      levelsCompleted: []
    };

    const nameEl = document.getElementById('map-student-name');
    const gradeEl = document.getElementById('map-student-grade');
    const scoreEl = document.getElementById('map-student-score');
    const starsEl = document.getElementById('map-student-stars');

    if (nameEl) nameEl.textContent = student.name || 'นักเรียน';
    if (gradeEl) gradeEl.textContent = student.grade || 'ป.4/1';
    if (scoreEl) scoreEl.textContent = student.score || 0;
    if (starsEl) starsEl.textContent = student.stars || 0;

    let completed = student.levelsCompleted || [];
    if (typeof completed === 'string') {
      try { completed = JSON.parse(completed); } catch (e) { completed = []; }
    }
    if (!Array.isArray(completed)) completed = [];

    // Render Level Cards
    const levelGrid = document.getElementById('level-select-grid');
    if (!levelGrid) return;
    levelGrid.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
      const isUnlocked = (i === 1) || completed.includes(i - 1);
      const isPassed = completed.includes(i);

      const cardHTML = `
        <div class="level-card ${isUnlocked ? '' : 'locked'}" onclick="${isUnlocked ? `App.playLevel(${i})` : `alert('กรุณาเล่นด่านก่อนหน้าให้ผ่านก่อนครับ!')`}">
          <div class="level-number-badge">${i}</div>
          <h4 style="color: #1e293b; font-size: 16px; font-weight: 700; margin-bottom: 6px;">ด่านที่ ${i}</h4>
          <p style="font-size: 12px; font-weight: 600; color: #334155; margin-bottom: 12px; line-height: 1.3;">
            ${i === 1 ? 'จับคู่ชื่อกับรูปทรง' : ''}
            ${i === 2 ? 'จับคู่สัญลักษณ์กับหน้าที่' : ''}
            ${i === 3 ? 'เรียงลำดับขั้นตอน' : ''}
            ${i === 4 ? 'ทดสอบความไว (จับเวลา)' : ''}
            ${i === 5 ? 'Mini Challenge สมบูรณ์' : ''}
          </p>
          <div style="margin-top: 4px;">
            ${isPassed 
              ? '<span class="status-badge passed">✓ ผ่านแล้ว (★★★)</span>' 
              : (isUnlocked 
                  ? '<span class="status-badge ready">▶ เริ่มเล่น</span>' 
                  : '<span class="status-badge locked-badge">🔒 ล็อกอยู่</span>')}
          </div>
        </div>
      `;
      levelGrid.insertAdjacentHTML('beforeend', cardHTML);
    }
  }

  function playLevel(levelNum) {
    showScreen('game-stage-screen');
    GameEngine.startLevel(levelNum);
  }

  function handleLoginSubmit(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('login-student-name').value.trim();
    const grade = document.getElementById('login-student-grade').value;
    const passcode = document.getElementById('login-student-passcode').value.trim();

    if (!name) {
      alert('กรุณากรอกชื่อ-นามสกุลของคุณ!');
      return;
    }

    const config = StorageEngine.getConfig();
    if (passcode !== config.studentPasscode) {
      SoundEngine.playWrong();
      alert(`รหัสผ่านไม่ถูกต้อง! (รหัสผ่านเริ่มต้นคือ ${config.studentPasscode})`);
      return;
    }

    // Save/Get Student Record
    const student = StorageEngine.saveStudentProgress({
      name,
      grade
    });

    SoundEngine.playCorrect();
    showScreen('student-map-screen');
  }

  function showAdminLoginModal() {
    const modalHTML = `
      <div class="modal-overlay active" id="admin-login-modal">
        <div class="modal-card">
          <div class="section-header-bar">
            <span>🔑 เข้าสู่ระบบครูผู้สอน (Admin Login)</span>
          </div>
          <div style="padding: 16px;">
            <div class="form-group">
              <label class="form-label">Username:</label>
              <input type="text" id="admin-user-input" class="form-input" value="admin">
            </div>
            <div class="form-group">
              <label class="form-label">Password:</label>
              <input type="password" id="admin-pass-input" class="form-input" value="password123">
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="btn-y2k btn-carbon" onclick="document.getElementById('admin-login-modal').remove()">ยกเลิก</button>
              <button class="btn-y2k btn-signal" onclick="App.processAdminLogin()">เข้าสู่ระบบ ➔</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function processAdminLogin() {
    const u = document.getElementById('admin-user-input').value.trim();
    const p = document.getElementById('admin-pass-input').value.trim();

    if (AdminEngine.login(u, p)) {
      document.getElementById('admin-login-modal').remove();
      showScreen('admin-screen');
    } else {
      alert('Username หรือ Password ครูผู้สอนไม่ถูกต้อง!');
    }
  }

  function toggleSound() {
    const muted = SoundEngine.toggleMute();
    updateSoundUI();
    if (!muted) SoundEngine.playClick();
  }

  function updateSoundUI() {
    const muted = SoundEngine.isMuted();
    const btn = document.getElementById('sound-toggle-btn');
    if (btn) {
      btn.textContent = muted ? '🔇 ปิดเสียง' : '🔊 เปิดเสียง';
    }
  }

  function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    SoundEngine.playClick();
  }

  function installPWA() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        }
        deferredInstallPrompt = null;
      });
    }
  }

  function showCertificate() {
    const student = StorageEngine.getCurrentStudent();
    const completedLevels = (student && student.levelsCompleted) ? student.levelsCompleted : [];
    const hasAll5Levels = [1, 2, 3, 4, 5].every(lvl => completedLevels.includes(lvl));
    const hasReadTutorial = Boolean(student && student.hasCompletedTutorial);

    // Condition 1: Must complete all 5 game levels
    if (!hasAll5Levels) {
      const count = completedLevels.length;
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '🎓 ยังไม่สามารถรับประกาศนียบัตรได้',
          html: `
            <div style="font-size: 15px; color: #21242e; text-align: center; line-height: 1.6;">
              <p style="margin-bottom: 8px;">น้องๆ ต้องเล่นเกมให้ผ่าน <strong>ครบทั้ง 5 ด่าน</strong> ก่อนครับ!</p>
              <div style="background: #fff3cd; border: 1px solid #ffeba2; padding: 8px 14px; border-radius: 8px; font-weight: bold; color: #856404; display: inline-block; margin-top: 6px;">
                🎮 ความคืบหน้าปัจจุบัน: ผ่านไป ${count} / 5 ด่าน
              </div>
            </div>
          `,
          icon: 'warning',
          confirmButtonText: 'ไปเล่นด่านเกม ➔',
          confirmButtonColor: '#f68d1f',
          background: '#f7f9fd',
          customClass: {
            popup: 'swal-y2k-popup',
            title: 'swal-y2k-title',
            confirmButton: 'btn-y2k btn-signal'
          },
          buttonsStyling: false
        }).then(() => {
          showScreen('student-map-screen');
        });
      } else {
        alert(`น้องๆ ต้องเล่นเกมให้ผ่านครบทั้ง 5 ด่านก่อนครับ (ขณะนี้ผ่านไป ${count}/5 ด่าน)`);
        showScreen('student-map-screen');
      }
      return;
    }

    // Condition 2: Must have visited / read the tutorial
    if (!hasReadTutorial) {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          title: '📖 ขาดอีกเพียง 1 เงื่อนไข!',
          html: `
            <div style="font-size: 15px; color: #21242e; text-align: center; line-height: 1.6;">
              <p style="margin-bottom: 8px; color: #28a745; font-weight: bold;">🎉 เล่นผ่านครบ 5 ด่านแล้ว!</p>
              <p style="margin-bottom: 12px;">แต่น้องๆ ต้องกดเข้าไปอ่านทบทวน <strong>"📖 คลังความรู้วิชาวิทยาการคำนวณ"</strong> อย่างน้อย 1 ครั้ง เพื่อออกประกาศนียบัตรครับ!</p>
            </div>
          `,
          icon: 'info',
          confirmButtonText: 'ไปทบทวนคลังความรู้ตอนนี้ ➔',
          confirmButtonColor: '#206479',
          background: '#f7f9fd',
          customClass: {
            popup: 'swal-y2k-popup',
            title: 'swal-y2k-title',
            confirmButton: 'btn-y2k btn-signal'
          },
          buttonsStyling: false
        }).then(() => {
          showScreen('tutorial-screen');
        });
      } else {
        alert('น้องๆ ต้องกดเข้าไปดู "คลังความรู้วิชาวิทยาการคำนวณ" อย่างน้อย 1 ครั้งก่อนออกประกาศนียบัตรครับ!');
        showScreen('tutorial-screen');
      }
      return;
    }

    // All conditions met -> Issue & Show Certificate
    if (student) {
      student.certificateIssued = true;
      StorageEngine.saveStudentProgress(student);
    }

    showScreen('certificate-screen');
    CertificateEngine.renderCertificate(student || { name: 'นักเรียน', grade: 'ป.4/1', score: 500, stars: 15 });
  }

  function logoutStudent() {
    StorageEngine.clearCurrentStudent();
    showScreen('login-screen');
  }

  function switchTutorialTab(tabId) {
    SoundEngine.playClick();
    document.querySelectorAll('.tutorial-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tutorial-tab-btn').forEach(btn => {
      btn.classList.remove('btn-amber', 'active');
      btn.classList.add('btn-carbon');
    });

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
      targetTab.style.display = 'block';
    }

    // Highlight clicked button
    const event = window.event;
    if (event && event.currentTarget) {
      event.currentTarget.classList.remove('btn-carbon');
      event.currentTarget.classList.add('btn-amber', 'active');
    }
  }

  return {
    init,
    populateGradeSelect,
    showScreen,
    switchTutorialTab,
    playLevel,
    handleLoginSubmit,
    showAdminLoginModal,
    processAdminLogin,
    toggleSound,
    toggleTheme,
    installPWA,
    showCertificate,
    logoutStudent
  };
})();

// Launch app on load
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
