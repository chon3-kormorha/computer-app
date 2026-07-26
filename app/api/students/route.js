import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET(request) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const grade = searchParams.get('grade');

    if (name && grade) {
      const student = db.prepare("SELECT * FROM students WHERE name = ? AND grade = ?").get(name, grade);
      if (student) {
        student.levelsCompleted = JSON.parse(student.levelsCompleted || '[]');
        student.certificateIssued = Boolean(student.certificateIssued);
        student.hasCompletedTutorial = Boolean(student.hasCompletedTutorial);
      }
      return NextResponse.json({ success: true, student: student || null });
    }

    const students = db.prepare("SELECT * FROM students ORDER BY lastActive DESC").all();
    const formatted = students.map(s => ({
      ...s,
      levelsCompleted: JSON.parse(s.levelsCompleted || '[]'),
      certificateIssued: Boolean(s.certificateIssued),
      hasCompletedTutorial: Boolean(s.hasCompletedTutorial)
    }));

    return NextResponse.json({ success: true, students: formatted });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 500 });
    }

    const body = await request.json();
    const { id, name, grade, score, stars, levelsCompleted, timeSpentSec, certificateIssued, hasCompletedTutorial } = body;

    if (!name || !grade) {
      return NextResponse.json({ success: false, error: 'Name and grade are required' }, { status: 400 });
    }

    // Check existing
    const existing = db.prepare("SELECT * FROM students WHERE (id = ?) OR (name = ? AND grade = ?)").get(id || '', name, grade);

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const studentId = existing ? existing.id : (id || 'std_' + Date.now());

    let existingLevels = [];
    if (existing && existing.levelsCompleted) {
      try { existingLevels = JSON.parse(existing.levelsCompleted); } catch (e) {}
    }

    const mergedLevels = Array.isArray(levelsCompleted) ? levelsCompleted : existingLevels;

    const merged = {
      id: studentId,
      name: name || (existing ? existing.name : 'นักเรียน'),
      grade: grade || (existing ? existing.grade : 'ป.4/1'),
      score: (score !== undefined) ? score : (existing ? existing.score : 0),
      stars: (stars !== undefined) ? stars : (existing ? existing.stars : 0),
      levelsCompleted: JSON.stringify(mergedLevels),
      timeSpentSec: timeSpentSec || (existing ? existing.timeSpentSec : 0),
      lastActive: nowStr,
      certificateIssued: (certificateIssued !== undefined) ? (certificateIssued ? 1 : 0) : (existing ? existing.certificateIssued : 0),
      hasCompletedTutorial: (hasCompletedTutorial !== undefined) ? (hasCompletedTutorial ? 1 : 0) : (existing ? existing.hasCompletedTutorial : 0)
    };

    db.prepare(`
      INSERT OR REPLACE INTO students (id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued, hasCompletedTutorial)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      merged.id,
      merged.name,
      merged.grade,
      merged.score,
      merged.stars,
      merged.levelsCompleted,
      merged.timeSpentSec,
      merged.lastActive,
      merged.certificateIssued,
      merged.hasCompletedTutorial
    );

    const result = {
      ...merged,
      levelsCompleted: mergedLevels,
      certificateIssued: Boolean(merged.certificateIssued),
      hasCompletedTutorial: Boolean(merged.hasCompletedTutorial)
    };

    return NextResponse.json({ success: true, student: result });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ success: false }, { status: 500 });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      db.prepare("DELETE FROM students WHERE id = ?").run(id);
    } else {
      db.prepare("DELETE FROM students").run();
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
