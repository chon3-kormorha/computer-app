import path from 'path';
import fs from 'fs';
import { SupabaseClient } from './supabase';

let dbInstance = null;

class SupabaseDbBridge {
  constructor(dataDir) {
    this.dataDir = dataDir;
    this.studentsFile = path.join(dataDir, 'students.json');
    this.configFile = path.join(dataDir, 'config.json');
    this.classroomsFile = path.join(dataDir, 'classrooms.json');

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.studentsFile)) {
      const seed = [
        { id: 'std_001', name: 'เด็กชาย ดนัย สุขเจริญ', grade: 'ป.4/1', score: 450, stars: 12, levelsCompleted: '[1,2,3,4]', lastActive: '2026-07-25 10:15', certificateIssued: 0, hasCompletedTutorial: 1 },
        { id: 'std_002', name: 'เด็กหญิง พิมพ์มาดา ใจดี', grade: 'ป.4/1', score: 550, stars: 15, levelsCompleted: '[1,2,3,4,5]', lastActive: '2026-07-26 09:30', certificateIssued: 1, hasCompletedTutorial: 1 }
      ];
      fs.writeFileSync(this.studentsFile, JSON.stringify(seed, null, 2), 'utf8');
    }

    if (!fs.existsSync(this.configFile)) {
      const cfg = [
        { key: 'studentPasscode', value: '1234' },
        { key: 'adminUsername', value: 'admin' },
        { key: 'adminPassword', value: 'admin1234' }
      ];
      fs.writeFileSync(this.configFile, JSON.stringify(cfg, null, 2), 'utf8');
    }

    if (!fs.existsSync(this.classroomsFile)) {
      const cls = ['ป.4/1', 'ป.4/2', 'ป.4/3', 'ป.5/1', 'ป.5/2', 'ป.5/3', 'ป.6/1', 'ป.6/2'];
      fs.writeFileSync(this.classroomsFile, JSON.stringify(cls, null, 2), 'utf8');
    }
  }

  getLocalStudents() {
    try {
      return JSON.parse(fs.readFileSync(this.studentsFile, 'utf8'));
    } catch (e) {
      return [];
    }
  }

  saveLocalStudents(students) {
    fs.writeFileSync(this.studentsFile, JSON.stringify(students, null, 2), 'utf8');
  }

  getLocalConfig() {
    try {
      return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
    } catch (e) {
      return [];
    }
  }

  saveLocalConfig(cfg) {
    fs.writeFileSync(this.configFile, JSON.stringify(cfg, null, 2), 'utf8');
  }

  getLocalClassrooms() {
    try {
      return JSON.parse(fs.readFileSync(this.classroomsFile, 'utf8'));
    } catch (e) {
      return ['ป.4/1', 'ป.4/2', 'ป.5/1', 'ป.5/2', 'ม.1/1', 'ม.1/2'];
    }
  }

  saveLocalClassrooms(cls) {
    fs.writeFileSync(this.classroomsFile, JSON.stringify(cls, null, 2), 'utf8');
  }

  prepare(sql) {
    const self = this;
    const lower = sql.toLowerCase();

    return {
      get(...args) {
        if (lower.includes('from students') && lower.includes('where name =') && lower.includes('grade =')) {
          const [name, grade] = args;
          const local = self.getLocalStudents().find(s => s.name === name && s.grade === grade);
          return local || null;
        }
        if (lower.includes('from students') && (lower.includes('where (id =') || lower.includes('id = ?'))) {
          const [id, name, grade] = args;
          const local = self.getLocalStudents().find(s => s.id === id || (s.name === name && s.grade === grade));
          return local || null;
        }
        if (lower.includes('from config')) {
          return { count: self.getLocalConfig().length };
        }
        if (lower.includes('from students')) {
          return { count: self.getLocalStudents().length };
        }
        return null;
      },

      all(...args) {
        if (lower.includes('from config')) {
          return self.getLocalConfig();
        }
        if (lower.includes('from classrooms')) {
          return self.getLocalClassrooms().map(c => ({ name: c }));
        }
        if (lower.includes('from students')) {
          return self.getLocalStudents();
        }
        return [];
      },

      run(...args) {
        if (lower.includes('insert or replace into students') || lower.includes('insert into students')) {
          const [id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued, hasCompletedTutorial] = args;
          const students = self.getLocalStudents();
          const idx = students.findIndex(s => s.id === id || (s.name === name && s.grade === grade));
          const row = { id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued, hasCompletedTutorial };
          if (idx >= 0) {
            students[idx] = row;
          } else {
            students.push(row);
          }
          self.saveLocalStudents(students);

          // Async sync to Supabase Cloud
          SupabaseClient.upsertStudent(row).catch(() => {});
          return { changes: 1 };
        }
        if (lower.includes('insert or replace into config')) {
          const [key, value] = args;
          const cfg = self.getLocalConfig();
          const idx = cfg.findIndex(c => c.key === key);
          if (idx >= 0) cfg[idx].value = value;
          else cfg.push({ key, value });
          self.saveLocalConfig(cfg);

          SupabaseClient.upsertConfig(key, value).catch(() => {});
          return { changes: 1 };
        }
        if (lower.includes('insert or ignore into classrooms')) {
          const [name] = args;
          const cls = self.getLocalClassrooms();
          if (!cls.includes(name)) {
            cls.push(name);
            self.saveLocalClassrooms(cls);
          }

          SupabaseClient.addClassroom(name).catch(() => {});
          return { changes: 1 };
        }
        if (lower.includes('delete from classrooms')) {
          const [name] = args;
          const cls = self.getLocalClassrooms().filter(c => c !== name);
          self.saveLocalClassrooms(cls);

          SupabaseClient.deleteClassroom(name).catch(() => {});
          return { changes: 1 };
        }
        if (lower.includes('delete from students') && lower.includes('where id =')) {
          const [id] = args;
          const students = self.getLocalStudents().filter(s => s.id !== id);
          self.saveLocalStudents(students);

          SupabaseClient.deleteStudent(id).catch(() => {});
          return { changes: 1 };
        }
        if (lower.includes('delete from students')) {
          self.saveLocalStudents([]);
          SupabaseClient.deleteStudent(null).catch(() => {});
          return { changes: 1 };
        }
        return { changes: 0 };
      }
    };
  }
}

export function getDb() {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), 'data');
  dbInstance = new SupabaseDbBridge(dataDir);
  return dbInstance;
}
