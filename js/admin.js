/* ==========================================================================
   Teacher Admin Dashboard Engine
   ========================================================================== */

const AdminEngine = (() => {
  let isAdminLoggedIn = false;
  let currentSearchQuery = '';
  let currentClassFilter = 'ALL';

  function login(username, password) {
    const config = StorageEngine.getConfig();
    if (username === config.adminUsername && password === config.adminPassword) {
      isAdminLoggedIn = true;
      SoundEngine.playCorrect();
      renderDashboard();
      return true;
    } else {
      SoundEngine.playWrong();
      return false;
    }
  }

  function renderDashboard() {
    const container = document.getElementById('admin-dashboard-container');
    if (!container) return;

    const roster = StorageEngine.getRoster();
    const config = StorageEngine.getConfig();

    // Calculate Dashboard Stats
    const totalStudents = roster.length;
    const totalCertificates = roster.filter(s => s.levelsCompleted && s.levelsCompleted.length === 5).length;
    const avgScore = totalStudents > 0 ? Math.round(roster.reduce((acc, s) => acc + (s.score || 0), 0) / totalStudents) : 0;

    // Filter Roster
    let filteredRoster = roster.filter(student => {
      const matchSearch = student.name.toLowerCase().includes(currentSearchQuery.toLowerCase());
      const matchClass = currentClassFilter === 'ALL' || student.grade === currentClassFilter;
      return matchSearch && matchClass;
    });

    const html = `
      <div class="hero-panel" style="background: linear-gradient(135deg, var(--carbon) 0%, var(--chrome-indigo) 100%);">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <div>
            <h2 class="hero-display-title" style="font-size: 22px; margin: 0;">📊 แดชบอร์ดครูผู้สอน (Admin Dashboard)</h2>
            <p style="font-size: 12px; opacity: 0.8;">ติดตามผลการเรียน การผ่านด่าน และส่งออกคะแนนของนักเรียน</p>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn-y2k btn-signal" onclick="AdminEngine.showClassroomManagerModal()">🏫 จัดการชั้นเรียน (CRUD)</button>
            <button class="btn-y2k btn-amber" onclick="AdminEngine.showPasscodeModal()">⚙️ ตั้งรหัสเข้าเล่นนักเรียน</button>
          </div>
        </div>
      </div>

      <!-- Quick Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 16px;">
        <div class="metal-plate" style="margin: 0; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; color: var(--ink-soft);">นักเรียนทั้งหมด</div>
          <div style="font-size: 28px; font-weight: bold; color: var(--primary);">${totalStudents} คน</div>
        </div>
        <div class="metal-plate" style="margin: 0; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; color: var(--ink-soft);">คะแนนเฉลี่ยรวม</div>
          <div style="font-size: 28px; font-weight: bold; color: var(--signal);">${avgScore} คะแนน</div>
        </div>
        <div class="metal-plate" style="margin: 0; padding: 12px; text-align: center;">
          <div style="font-size: 11px; font-weight: bold; color: var(--ink-soft);">ผ่านครบ 5 ด่าน (ได้ใบประกาศ)</div>
          <div style="font-size: 28px; font-weight: bold; color: var(--success);">${totalCertificates} คน</div>
        </div>
      </div>

      <!-- Chart Overview -->
      <div class="content-card" style="margin-bottom: 16px;">
        <h4 style="margin-bottom: 8px; color: var(--carbon);">📈 กราฟสรุปจำนวนผู้ผ่านแต่ละด่าน</h4>
        <div style="display: flex; gap: 8px; height: 120px; align-items: flex-end; padding-top: 10px;">
          ${[1, 2, 3, 4, 5].map(lvl => {
            const passedCount = roster.filter(s => s.levelsCompleted && s.levelsCompleted.includes(lvl)).length;
            const pct = totalStudents > 0 ? (passedCount / totalStudents) * 100 : 0;
            return `
              <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
                <div style="font-size: 10px; font-weight: bold; margin-bottom: 2px;">${passedCount}คน</div>
                <div style="width: 100%; height: ${Math.max(10, pct)}%; background-color: var(--signal); border-radius: 4px 4px 0 0; min-height: 8px;"></div>
                <div style="font-size: 10px; font-weight: bold; margin-top: 4px;">ด่าน ${lvl}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Controls: Filter & Search & Add & Export -->
      <div class="metal-plate" style="padding: 12px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; justify-content: space-between;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
          <input type="text" class="form-input" placeholder="🔍 ค้นหาชื่อนักเรียน..." style="width: 180px;" value="${currentSearchQuery}" oninput="AdminEngine.setSearch(this.value)">
          <select class="form-select" style="width: 130px;" onchange="AdminEngine.setClassFilter(this.value)">
            <option value="ALL">ทุกห้องเรียน</option>
            ${config.availableGrades.map(g => `<option value="${g}" ${currentClassFilter === g ? 'selected' : ''}>${g}</option>`).join('')}
          </select>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-y2k btn-amber btn-sm" onclick="AdminEngine.showAddStudentModal()">➕ เพิ่มรายชื่อ</button>
          <button class="btn-y2k btn-signal btn-sm" onclick="AdminEngine.exportCSV()">📥 ส่งออก CSV/Excel</button>
        </div>
      </div>

      <!-- Roster Table -->
      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ชื่อ-นามสกุล</th>
              <th>ชั้นเรียน</th>
              <th>คะแนน</th>
              <th>ดาว</th>
              <th>ด่านที่ผ่าน</th>
              <th>เวลาใช้งานล่าสุด</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            ${filteredRoster.length > 0 ? filteredRoster.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="btn-y2k btn-carbon btn-sm">${s.grade}</span></td>
                <td><strong style="color: var(--signal);">${s.score || 0}</strong></td>
                <td><span style="color: var(--amber);">★ ${s.stars || 0}</span></td>
                <td>${(s.levelsCompleted || []).map(l => `<span style="background: var(--success); color: white; border-radius: 50%; padding: 2px 6px; font-size: 10px; margin-right: 2px;">${l}</span>`).join('')}</td>
                <td style="font-size: 11px; color: #666;">${s.lastActive || '-'}</td>
                <td>
                  <button class="btn-y2k btn-amber btn-sm" onclick="AdminEngine.resetStudent('${s.id}')">🔄 รีเซ็ต</button>
                  <button class="btn-y2k btn-primary btn-sm" onclick="AdminEngine.deleteStudent('${s.id}')">🗑️ ลบ</button>
                </td>
              </tr>
            `).join('') : `
              <tr><td colspan="7" style="text-align: center; padding: 20px;">ไม่พบข้อมูลนักเรียน</td></tr>
            `}
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;
  }

  function setSearch(query) {
    currentSearchQuery = query;
    renderDashboard();
  }

  function setClassFilter(grade) {
    currentClassFilter = grade;
    renderDashboard();
  }

  function resetStudent(id) {
    window.showConfirmModal('ยืนยันรีเซ็ตคะแนน', 'คุณต้องการรีเซ็ตคะแนนของนักเรียนคนนี้ใช่หรือไม่?', () => {
      StorageEngine.resetStudentScore(id);
      renderDashboard();
    });
  }

  function deleteStudent(id) {
    window.showConfirmModal('ยืนยันลบนักเรียน', 'คุณต้องการลบรายชื่อนักเรียนคนนี้ใช่หรือไม่?', () => {
      StorageEngine.deleteStudent(id);
      renderDashboard();
    });
  }

  function exportCSV() {
    const roster = StorageEngine.getRoster();
    let csv = 'ID,Name,Grade,Score,Stars,LevelsCompleted,LastActive\n';

    roster.forEach(s => {
      const levels = (s.levelsCompleted || []).join(';');
      csv += `"${s.id}","${s.name}","${s.grade}",${s.score || 0},${s.stars || 0},"${levels}","${s.lastActive || ''}"\n`;
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowchart_student_scores_${new Date().toISOString().substring(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function showAddStudentModal() {
    const config = StorageEngine.getConfig();
    const modalHTML = `
      <div class="modal-overlay active" id="add-student-modal">
        <div class="modal-card">
          <div class="section-header-bar">
            <span>➕ เพิ่มรายชื่อนักเรียนใหม่</span>
          </div>
          <div style="padding: 16px;">
            <div class="form-group">
              <label class="form-label">ชื่อ-นามสกุล นักเรียน:</label>
              <input type="text" id="new-student-name" class="form-input" placeholder="เช่น เด็กชาย สมชาย มีสุข">
            </div>
            <div class="form-group">
              <label class="form-label">ชั้นเรียน:</label>
              <select id="new-student-grade" class="form-select">
                ${config.availableGrades.map(g => `<option value="${g}">${g}</option>`).join('')}
              </select>
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="btn-y2k btn-carbon" onclick="document.getElementById('add-student-modal').remove()">ยกเลิก</button>
              <button class="btn-y2k btn-signal" onclick="AdminEngine.saveNewStudent()">บันทึกรายชื่อ</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function saveNewStudent() {
    const name = document.getElementById('new-student-name').value.trim();
    const grade = document.getElementById('new-student-grade').value;

    if (!name) {
      alert('กรุณากรอกชื่อ-นามสกุล');
      return;
    }

    StorageEngine.saveStudentProgress({
      name,
      grade,
      score: 0,
      stars: 0,
      levelsCompleted: []
    });

    document.getElementById('add-student-modal').remove();
    renderDashboard();
  }

  function showPasscodeModal() {
    const config = StorageEngine.getConfig();
    const modalHTML = `
      <div class="modal-overlay active" id="passcode-modal">
        <div class="modal-card">
          <div class="section-header-bar">
            <span>⚙️ ตั้งค่ารหัสผ่านเข้าเล่นนักเรียน</span>
          </div>
          <div style="padding: 16px;">
            <div class="form-group">
              <label class="form-label">รหัสผ่านปัจจุบันของนักเรียน:</label>
              <input type="text" id="passcode-val" class="form-input" value="${config.studentPasscode}">
            </div>
            <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
              <button class="btn-y2k btn-carbon" onclick="document.getElementById('passcode-modal').remove()">ยกเลิก</button>
              <button class="btn-y2k btn-signal" onclick="AdminEngine.savePasscode()">บันทึกรหัสใหม่</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function savePasscode() {
    const input = document.getElementById('passcode-val');
    const val = input ? input.value.trim() : '';
    if (!val) {
      alert('กรุณากรอกรหัสผ่านนักเรียน');
      return;
    }
    const config = StorageEngine.getConfig();
    config.studentPasscode = val;
    StorageEngine.saveConfig(config);
    SoundEngine.playCorrect();
    alert('บันทึกรหัสผ่านนักเรียนเรียบร้อยแล้ว!');
    const modal = document.getElementById('passcode-modal');
    if (modal) modal.remove();
  }

  function showClassroomManagerModal() {
    const existingModal = document.getElementById('classroom-manager-modal');
    if (existingModal) existingModal.remove();

    const config = StorageEngine.getConfig();
    const roster = StorageEngine.getRoster();

    const modalHTML = `
      <div class="modal-overlay active" id="classroom-manager-modal">
        <div class="modal-card" style="max-width: 550px;">
          <div class="section-header-bar">
            <span>🏫 จัดการชั้นเรียน (CLASSROOM CRUD)</span>
          </div>
          <div style="padding: 16px;">
            <!-- Form to Add New Classroom -->
            <div class="inset-panel" style="margin-bottom: 16px; background-color: var(--surface);">
              <label class="form-label">➕ เพิ่มชั้นเรียนใหม่:</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="new-classroom-input" class="form-input" placeholder="เช่น ป.6/1 หรือ ม.2/1">
                <button class="btn-y2k btn-signal btn-sm" style="white-space: nowrap;" onclick="AdminEngine.addClassroomFromModal()">เพิ่มห้องเรียน</button>
              </div>
            </div>

            <!-- List of Existing Classrooms -->
            <h4 style="margin-bottom: 8px; color: var(--carbon);">📋 รายชื่อชั้นเรียนทั้งหมดในระบบ:</h4>
            <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--chrome-indigo); border-radius: 4px;">
              <table class="admin-table" style="margin: 0;">
                <thead>
                  <tr>
                    <th>ชื่อชั้นเรียน</th>
                    <th>จำนวนนักเรียน</th>
                    <th style="text-align: right;">จัดการ (Actions)</th>
                  </tr>
                </thead>
                <tbody>
                  ${config.availableGrades.map(g => {
                    const studentCount = roster.filter(s => s.grade === g).length;
                    return `
                      <tr>
                        <td><strong>${g}</strong></td>
                        <td><span class="btn-y2k btn-carbon btn-sm">${studentCount} คน</span></td>
                        <td style="text-align: right;">
                          <button class="btn-y2k btn-amber btn-sm" onclick="AdminEngine.editClassroomFromModal('${g}')">✏️ แก้ไข</button>
                          <button class="btn-y2k btn-primary btn-sm" onclick="AdminEngine.deleteClassroomFromModal('${g}')">🗑️ ลบ</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
              <button class="btn-y2k btn-carbon" onclick="document.getElementById('classroom-manager-modal').remove()">ปิดหน้าต่าง</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function addClassroomFromModal() {
    const input = document.getElementById('new-classroom-input');
    const val = input ? input.value.trim() : '';
    const res = StorageEngine.addClassroom(val);
    if (res.success) {
      SoundEngine.playCorrect();
      if (typeof App !== 'undefined' && App.populateGradeSelect) App.populateGradeSelect();
      renderDashboard();
      showClassroomManagerModal();
    } else {
      SoundEngine.playWrong();
      alert(res.msg);
    }
  }

  function editClassroomFromModal(oldGrade) {
    const newGrade = prompt(`แก้ไขชื่อชั้นเรียน "${oldGrade}" เป็น:`, oldGrade);
    if (newGrade === null) return; // User cancelled
    const res = StorageEngine.updateClassroom(oldGrade, newGrade);
    if (res.success) {
      SoundEngine.playCorrect();
      if (typeof App !== 'undefined' && App.populateGradeSelect) App.populateGradeSelect();
      renderDashboard();
      showClassroomManagerModal();
    } else {
      SoundEngine.playWrong();
      alert(res.msg);
    }
  }

  function deleteClassroomFromModal(gradeName) {
    const roster = StorageEngine.getRoster();
    const count = roster.filter(s => s.grade === gradeName).length;
    let warningMsg = `คุณต้องการลบชั้นเรียน "${gradeName}" ออกจากระบบใช่หรือไม่?`;
    if (count > 0) {
      warningMsg = `⚠️ คำเตือน: มีนักเรียนอยู่ในชั้นเรียน "${gradeName}" จำนวน ${count} คน\nคุณแน่ใจหรือไม่ว่าต้องการลบชั้นเรียนนี้?`;
    }

    window.showConfirmModal('ยืนยันการลบชั้นเรียน', warningMsg, () => {
      const res = StorageEngine.deleteClassroom(gradeName);
      if (res.success) {
        SoundEngine.playCorrect();
        if (typeof App !== 'undefined' && App.populateGradeSelect) App.populateGradeSelect();
        renderDashboard();
        showClassroomManagerModal();
      } else {
        SoundEngine.playWrong();
        alert(res.msg);
      }
    });
  }

  return {
    login,
    renderDashboard,
    setSearch,
    setClassFilter,
    resetStudent,
    deleteStudent,
    exportCSV,
    showAddStudentModal,
    saveNewStudent,
    showPasscodeModal,
    savePasscode,
    showClassroomManagerModal,
    addClassroomFromModal,
    editClassroomFromModal,
    deleteClassroomFromModal
  };
})();

