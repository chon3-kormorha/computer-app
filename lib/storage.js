/* Client-side Storage API Bridge with Offline LocalStorage Backup */

const KEYS = {
  CURRENT_STUDENT: 'flowchart_current_student',
  LOCAL_ROSTER: 'flowchart_local_roster',
  LOCAL_CONFIG: 'flowchart_local_config'
};

const DEFAULT_CONFIG = {
  studentPasscode: '1234',
  adminUsername: 'admin',
  adminPassword: 'admin1234',
  availableGrades: ['ป.4/1', 'ป.4/2', 'ป.5/1', 'ป.5/2', 'ม.1/1', 'ม.1/2']
};

export const StorageEngine = {
  getCurrentStudent: () => {
    if (typeof window === 'undefined') return null;
    const data = sessionStorage.getItem(KEYS.CURRENT_STUDENT);
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return (parsed && parsed.name) ? parsed : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentStudent: (student) => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(KEYS.CURRENT_STUDENT, JSON.stringify(student));
  },

  clearCurrentStudent: () => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(KEYS.CURRENT_STUDENT);
  },

  fetchConfig: async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data.success && data.config) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(KEYS.LOCAL_CONFIG, JSON.stringify(data.config));
        }
        return data.config;
      }
    } catch (e) {
      // Offline fallback
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(KEYS.LOCAL_CONFIG);
      if (saved) return JSON.parse(saved);
    }
    return DEFAULT_CONFIG;
  },

  addClassroom: async (newGrade) => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newGrade })
      });
    } catch (e) {}
    return await StorageEngine.fetchConfig();
  },

  updateClassroom: async (oldGrade, newGrade) => {
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldGrade, newGrade })
      });
    } catch (e) {}
    return await StorageEngine.fetchConfig();
  },

  deleteClassroom: async (grade) => {
    try {
      await fetch(`/api/config?grade=${encodeURIComponent(grade)}`, {
        method: 'DELETE'
      });
    } catch (e) {}
    return await StorageEngine.fetchConfig();
  },

  fetchRoster: async () => {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success && data.students) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(KEYS.LOCAL_ROSTER, JSON.stringify(data.students));
        }
        return data.students;
      }
    } catch (e) {
      // Offline fallback
    }
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(KEYS.LOCAL_ROSTER);
      if (saved) return JSON.parse(saved);
    }
    return [];
  },

  clearAllStudents: async () => {
    try {
      await fetch('/api/students', { method: 'DELETE' });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem(KEYS.LOCAL_ROSTER);
    }
    return [];
  },

  deleteStudent: async (id) => {
    try {
      await fetch(`/api/students?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}
    return await StorageEngine.fetchRoster();
  },

  saveStudentProgress: async (studentData) => {
    if (typeof window === 'undefined') return studentData;
    const current = StorageEngine.getCurrentStudent() || {};
    const merged = { ...current, ...studentData };

    StorageEngine.setCurrentStudent(merged);

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(merged)
      });
      const data = await res.json();
      if (data.success && data.student) {
        StorageEngine.setCurrentStudent(data.student);
        return data.student;
      }
    } catch (e) {
      console.warn('API save student progress offline:', e);
    }
    return merged;
  }
};
