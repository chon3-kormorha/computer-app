/* ==========================================================================
   Data Persistence Layer - SQLite Database Engine (sql.js / WebAssembly)
   ========================================================================== */

const StorageEngine = (() => {
  const DB_STORAGE_KEY = 'flowchart_sqlite_db';
  const KEYS = {
    CURRENT_STUDENT: 'flowchart_current_student'
  };

  // Default seed student roster for realistic teacher dashboard demonstration
  const SEED_STUDENTS = [
    {
      id: 'std_001',
      name: 'เด็กชาย ดนัย สุขเจริญ',
      grade: 'ป.4/1',
      score: 450,
      stars: 12,
      levelsCompleted: [1, 2, 3, 4],
      timeSpentSec: 240,
      lastActive: '2026-07-25 10:15',
      certificateIssued: false
    },
    {
      id: 'std_002',
      name: 'เด็กหญิง พิมพ์มาดา ใจดี',
      grade: 'ป.4/1',
      score: 550,
      stars: 15,
      levelsCompleted: [1, 2, 3, 4, 5],
      timeSpentSec: 195,
      lastActive: '2026-07-26 09:30',
      certificateIssued: true
    },
    {
      id: 'std_003',
      name: 'เด็กชาย กิตติศักดิ์ พรหมมณี',
      grade: 'ป.4/2',
      score: 280,
      stars: 8,
      levelsCompleted: [1, 2, 3],
      timeSpentSec: 320,
      lastActive: '2026-07-26 11:05',
      certificateIssued: false
    },
    {
      id: 'std_004',
      name: 'เด็กหญิง อารียา สายชล',
      grade: 'ม.1/1',
      score: 580,
      stars: 15,
      levelsCompleted: [1, 2, 3, 4, 5],
      timeSpentSec: 180,
      lastActive: '2026-07-26 14:20',
      certificateIssued: true
    }
  ];

  // Default Configuration
  const DEFAULT_CONFIG = {
    studentPasscode: '1234',
    adminUsername: 'admin',
    adminPassword: 'password123',
    availableGrades: ['ป.4/1', 'ป.4/2', 'ป.5/1', 'ป.5/2', 'ม.1/1', 'ม.1/2']
  };

  let db = null;
  let isReady = false;

  // Initialize SQLite Database
  function initDatabase() {
    try {
      if (typeof window.initSqlJs === 'function') {
        window.initSqlJs({
          locateFile: file => `./lib/${file}`
        }).then(SQL => {
          setupDb(SQL);
        }).catch(err => {
          console.warn('SQLite Wasm load failed, initializing in-memory SQL fallback', err);
          createFallbackDb();
        });
      } else {
        createFallbackDb();
      }
    } catch (e) {
      console.error('Error initializing SQLite:', e);
      createFallbackDb();
    }
  }

  function setupDb(SQL) {
    const savedData = localStorage.getItem(DB_STORAGE_KEY);
    if (savedData) {
      try {
        const u8Array = new Uint8Array(JSON.parse(savedData));
        db = new SQL.Database(u8Array);
      } catch (e) {
        console.error('Failed to load saved SQLite DB, creating new database:', e);
        db = new SQL.Database();
      }
    } else {
      db = new SQL.Database();
    }

    createTablesAndSeed();
    isReady = true;
  }

  function createTablesAndSeed() {
    if (!db) return;

    // Create SQLite Tables
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        grade TEXT NOT NULL,
        score INTEGER DEFAULT 0,
        stars INTEGER DEFAULT 0,
        levelsCompleted TEXT DEFAULT '[]',
        timeSpentSec INTEGER DEFAULT 0,
        lastActive TEXT,
        certificateIssued INTEGER DEFAULT 0
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS classrooms (
        name TEXT PRIMARY KEY
      );
    `);

    // Seed Config if empty
    const cfgRes = db.exec("SELECT COUNT(*) FROM config");
    if (!cfgRes.length || cfgRes[0].values[0][0] === 0) {
      db.run("INSERT OR REPLACE INTO config (key, value) VALUES ('studentPasscode', ?)", [DEFAULT_CONFIG.studentPasscode]);
      db.run("INSERT OR REPLACE INTO config (key, value) VALUES ('adminUsername', ?)", [DEFAULT_CONFIG.adminUsername]);
      db.run("INSERT OR REPLACE INTO config (key, value) VALUES ('adminPassword', ?)", [DEFAULT_CONFIG.adminPassword]);

      DEFAULT_CONFIG.availableGrades.forEach(g => {
        db.run("INSERT OR IGNORE INTO classrooms (name) VALUES (?)", [g]);
      });
    }

    // Seed Students if empty
    const stdRes = db.exec("SELECT COUNT(*) FROM students");
    if (!stdRes.length || stdRes[0].values[0][0] === 0) {
      SEED_STUDENTS.forEach(s => {
        db.run(
          `INSERT INTO students (id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            s.id,
            s.name,
            s.grade,
            s.score,
            s.stars,
            JSON.stringify(s.levelsCompleted),
            s.timeSpentSec,
            s.lastActive,
            s.certificateIssued ? 1 : 0
          ]
        );
      });
    }

    persistDb();
  }

  // Save SQLite Database state to LocalStorage
  function persistDb() {
    if (!db) return;
    try {
      const data = db.export();
      const array = Array.from(data);
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(array));
    } catch (e) {
      console.error('Failed to persist SQLite DB:', e);
    }
  }

  // Fallback in case WebAssembly isn't available
  function createFallbackDb() {
    let mockStudents = JSON.parse(localStorage.getItem('flowchart_student_roster')) || SEED_STUDENTS;
    let mockConfig = JSON.parse(localStorage.getItem('flowchart_app_config')) || DEFAULT_CONFIG;

    db = {
      exec: (sql, params = []) => {
        if (sql.includes('SELECT COUNT(*) FROM config') || sql.includes('SELECT COUNT(*) FROM students')) {
          return [{ values: [[1]] }];
        }
        if (sql.includes('SELECT * FROM students') || sql.includes('SELECT * FROM students WHERE')) {
          return [{
            columns: ['id', 'name', 'grade', 'score', 'stars', 'levelsCompleted', 'timeSpentSec', 'lastActive', 'certificateIssued'],
            values: mockStudents.map(s => [
              s.id, s.name, s.grade, s.score, s.stars, JSON.stringify(s.levelsCompleted || []), s.timeSpentSec, s.lastActive, s.certificateIssued ? 1 : 0
            ])
          }];
        }
        if (sql.includes('SELECT key, value FROM config')) {
          return [{
            columns: ['key', 'value'],
            values: [
              ['studentPasscode', mockConfig.studentPasscode],
              ['adminUsername', mockConfig.adminUsername],
              ['adminPassword', mockConfig.adminPassword]
            ]
          }];
        }
        if (sql.includes('SELECT name FROM classrooms')) {
          return [{
            columns: ['name'],
            values: (mockConfig.availableGrades || []).map(g => [g])
          }];
        }
        return [];
      },
      run: (sql, params = []) => {
        // Simple fallback updates for standard ops
        if (sql.includes('INSERT OR REPLACE INTO students') || sql.includes('INSERT INTO students')) {
          const [id, name, grade, score, stars, levels, timeSpent, lastActive, cert] = params;
          const idx = mockStudents.findIndex(s => s.id === id || (s.name === name && s.grade === grade));
          const newObj = {
            id, name, grade, score, stars,
            levelsCompleted: JSON.parse(levels || '[]'),
            timeSpentSec: timeSpent,
            lastActive,
            certificateIssued: cert === 1
          };
          if (idx >= 0) mockStudents[idx] = newObj;
          else mockStudents.push(newObj);
          localStorage.setItem('flowchart_student_roster', JSON.stringify(mockStudents));
        } else if (sql.includes('DELETE FROM students')) {
          const [id] = params;
          mockStudents = mockStudents.filter(s => s.id !== id);
          localStorage.setItem('flowchart_student_roster', JSON.stringify(mockStudents));
        } else if (sql.includes('UPDATE students SET score = 0')) {
          const [id] = params;
          const s = mockStudents.find(st => st.id === id);
          if (s) {
            s.score = 0; s.stars = 0; s.levelsCompleted = []; s.timeSpentSec = 0; s.certificateIssued = false;
            localStorage.setItem('flowchart_student_roster', JSON.stringify(mockStudents));
          }
        }
      },
      export: () => new Uint8Array()
    };
    isReady = true;
  }

  // Trigger initialization
  initDatabase();

  return {
    // Check if SQLite Engine is ready
    isReady: () => isReady,

    // Config Management
    getConfig: () => {
      try {
        if (!db) return DEFAULT_CONFIG;
        const resConfig = db.exec("SELECT key, value FROM config");
        const resGrades = db.exec("SELECT name FROM classrooms");

        const configObj = { ...DEFAULT_CONFIG };

        if (resConfig.length && resConfig[0].values) {
          resConfig[0].values.forEach(([key, val]) => {
            configObj[key] = val;
          });
        }

        if (resGrades.length && resGrades[0].values) {
          configObj.availableGrades = resGrades[0].values.map(row => row[0]);
        }

        return configObj;
      } catch (e) {
        console.error('SQLite getConfig Error:', e);
        return DEFAULT_CONFIG;
      }
    },

    saveConfig: (config) => {
      try {
        if (!db) return;
        if (config.studentPasscode !== undefined) {
          db.run("INSERT OR REPLACE INTO config (key, value) VALUES ('studentPasscode', ?)", [config.studentPasscode]);
        }
        if (config.adminUsername !== undefined) {
          db.run("INSERT OR REPLACE INTO config (key, value) VALUES ('adminUsername', ?)", [config.adminUsername]);
        }
        if (config.adminPassword !== undefined) {
          db.run("INSERT OR REPLACE INTO config (key, value) VALUES ('adminPassword', ?)", [config.adminPassword]);
        }
        if (Array.isArray(config.availableGrades)) {
          db.run("DELETE FROM classrooms");
          config.availableGrades.forEach(g => {
            db.run("INSERT INTO classrooms (name) VALUES (?)", [g]);
          });
        }
        persistDb();
      } catch (e) {
        console.error('SQLite saveConfig Error:', e);
      }
    },

    // Current Student Session (Session Storage)
    getCurrentStudent: () => {
      try {
        return JSON.parse(sessionStorage.getItem(KEYS.CURRENT_STUDENT));
      } catch (e) {
        return null;
      }
    },
    setCurrentStudent: (student) => {
      sessionStorage.setItem(KEYS.CURRENT_STUDENT, JSON.stringify(student));
    },
    clearCurrentStudent: () => {
      sessionStorage.removeItem(KEYS.CURRENT_STUDENT);
    },

    // Roster Management (SQL SELECT)
    getRoster: () => {
      try {
        if (!db) return [];
        const res = db.exec("SELECT id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued FROM students");
        if (!res.length || !res[0].values) return [];

        return res[0].values.map(row => {
          let levels = [];
          try {
            levels = JSON.parse(row[5] || '[]');
          } catch (e) {
            levels = [];
          }

          return {
            id: row[0],
            name: row[1],
            grade: row[2],
            score: Number(row[3]) || 0,
            stars: Number(row[4]) || 0,
            levelsCompleted: levels,
            timeSpentSec: Number(row[6]) || 0,
            lastActive: row[7] || '',
            certificateIssued: Boolean(row[8])
          };
        });
      } catch (e) {
        console.error('SQLite getRoster Error:', e);
        return [];
      }
    },

    saveRoster: (roster) => {
      try {
        if (!db || !Array.isArray(roster)) return;
        roster.forEach(s => {
          db.run(
            `INSERT OR REPLACE INTO students (id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              s.id || ('std_' + Date.now()),
              s.name,
              s.grade,
              s.score || 0,
              s.stars || 0,
              JSON.stringify(s.levelsCompleted || []),
              s.timeSpentSec || 0,
              s.lastActive || '',
              s.certificateIssued ? 1 : 0
            ]
          );
        });
        persistDb();
      } catch (e) {
        console.error('SQLite saveRoster Error:', e);
      }
    },

    // Update or Insert Student Record via SQL
    saveStudentProgress: (studentData) => {
      try {
        const roster = StorageEngine.getRoster() || [];
        const existing = roster.find(s => (studentData.id && s.id === studentData.id) || (s.name === studentData.name && s.grade === studentData.grade));

        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

        const merged = {
          id: (existing && existing.id) ? existing.id : (studentData.id || 'std_' + Date.now()),
          name: studentData.name || (existing && existing.name) || 'นักเรียน',
          grade: studentData.grade || (existing && existing.grade) || 'ป.4/1',
          score: (studentData.score !== undefined) ? studentData.score : ((existing && existing.score) || 0),
          stars: (studentData.stars !== undefined) ? studentData.stars : ((existing && existing.stars) || 0),
          levelsCompleted: studentData.levelsCompleted || (existing && existing.levelsCompleted) || [],
          timeSpentSec: studentData.timeSpentSec || (existing && existing.timeSpentSec) || 0,
          lastActive: nowStr,
          certificateIssued: (studentData.certificateIssued !== undefined) ? studentData.certificateIssued : Boolean(existing && existing.certificateIssued),
          hasCompletedTutorial: (studentData.hasCompletedTutorial !== undefined) ? studentData.hasCompletedTutorial : Boolean(existing && existing.hasCompletedTutorial)
        };

        if (db) {
          db.run(
            `INSERT OR REPLACE INTO students (id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              merged.id,
              merged.name,
              merged.grade,
              merged.score || 0,
              merged.stars || 0,
              JSON.stringify(merged.levelsCompleted || []),
              merged.timeSpentSec || 0,
              merged.lastActive,
              merged.certificateIssued ? 1 : 0
            ]
          );
          persistDb();
        }

        StorageEngine.setCurrentStudent(merged);
        return merged;
      } catch (e) {
        console.error('SQLite saveStudentProgress Error:', e);
        StorageEngine.setCurrentStudent(studentData);
        return studentData;
      }
    },

    // Reset Student Record via SQL UPDATE
    resetStudentScore: (studentId) => {
      try {
        if (!db) return;
        db.run(
          `UPDATE students SET score = 0, stars = 0, levelsCompleted = '[]', timeSpentSec = 0, certificateIssued = 0 WHERE id = ?`,
          [studentId]
        );
        persistDb();
      } catch (e) {
        console.error('SQLite resetStudentScore Error:', e);
      }
    },

    // Delete Student Record via SQL DELETE
    deleteStudent: (studentId) => {
      try {
        if (!db) return;
        db.run(`DELETE FROM students WHERE id = ?`, [studentId]);
        persistDb();
      } catch (e) {
        console.error('SQLite deleteStudent Error:', e);
      }
    },

    // Classroom / Grade Management (CRUD via SQL)
    addClassroom: (gradeName) => {
      try {
        const config = StorageEngine.getConfig();
        const trimmed = (gradeName || '').trim();
        if (!trimmed) return { success: false, msg: 'กรุณากรอกชื่อชั้นเรียน' };
        if (config.availableGrades.includes(trimmed)) {
          return { success: false, msg: 'ชั้นเรียนนี้มีอยู่แล้วในระบบ' };
        }

        if (db) {
          db.run("INSERT OR IGNORE INTO classrooms (name) VALUES (?)", [trimmed]);
          persistDb();
        }
        return { success: true, msg: 'เพิ่มชั้นเรียนสำเร็จ' };
      } catch (e) {
        return { success: false, msg: 'เกิดข้อผิดพลาดในการเพิ่มชั้นเรียน' };
      }
    },

    updateClassroom: (oldGradeName, newGradeName) => {
      try {
        const config = StorageEngine.getConfig();
        const trimmedNew = (newGradeName || '').trim();
        if (!trimmedNew) return { success: false, msg: 'กรุณากรอกชื่อชั้นเรียนใหม่' };
        if (oldGradeName !== trimmedNew && config.availableGrades.includes(trimmedNew)) {
          return { success: false, msg: 'ชื่อชั้นเรียนใหม่นี้มีอยู่แล้วในระบบ' };
        }

        if (db) {
          db.run("DELETE FROM classrooms WHERE name = ?", [oldGradeName]);
          db.run("INSERT OR IGNORE INTO classrooms (name) VALUES (?)", [trimmedNew]);
          db.run("UPDATE students SET grade = ? WHERE grade = ?", [trimmedNew, oldGradeName]);
          persistDb();

          // Update current student session if matching
          const currentStudent = StorageEngine.getCurrentStudent();
          if (currentStudent && currentStudent.grade === oldGradeName) {
            currentStudent.grade = trimmedNew;
            StorageEngine.setCurrentStudent(currentStudent);
          }
        }
        return { success: true, msg: 'แก้ไขชื่อชั้นเรียนเรียบร้อย' };
      } catch (e) {
        return { success: false, msg: 'เกิดข้อผิดพลาดในการอัปเดตชั้นเรียน' };
      }
    },

    deleteClassroom: (gradeName) => {
      try {
        if (db) {
          db.run("DELETE FROM classrooms WHERE name = ?", [gradeName]);
          persistDb();
        }
        return { success: true, msg: 'ลบชั้นเรียนเรียบร้อย' };
      } catch (e) {
        return { success: false, msg: 'เกิดข้อผิดพลาดในการลบชั้นเรียน' };
      }
    }
  };
})();
