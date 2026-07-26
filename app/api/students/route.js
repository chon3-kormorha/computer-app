import { NextResponse } from 'next/server';
import { SupabaseClient } from '../../../lib/supabase';
import { getDb } from '../../../lib/db';

function formatStudent(s) {
  if (!s) return null;
  let levels = s.levelsCompleted;
  if (typeof levels === 'string') {
    try { levels = JSON.parse(levels); } catch (e) { levels = []; }
  }
  return {
    ...s,
    score: Number(s.score || 0),
    stars: Number(s.stars || 0),
    levelsCompleted: Array.isArray(levels) ? levels : [],
    certificateIssued: Boolean(s.certificateIssued),
    hasCompletedTutorial: Boolean(s.hasCompletedTutorial)
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const grade = searchParams.get('grade');

    // 1. Try Supabase Cloud Database first
    if (name && grade) {
      const spStudent = await SupabaseClient.getStudentByNameAndGrade(name, grade);
      if (spStudent) {
        return NextResponse.json({ success: true, student: formatStudent(spStudent) });
      }
    } else {
      const spStudents = await SupabaseClient.getStudents();
      if (spStudents && Array.isArray(spStudents)) {
        return NextResponse.json({ success: true, students: spStudents.map(formatStudent) });
      }
    }

    // 2. Fallback to Local DB
    const db = getDb();
    if (name && grade) {
      const student = db.prepare("SELECT * FROM students WHERE name = ? AND grade = ?").get(name, grade);
      return NextResponse.json({ success: true, student: formatStudent(student) });
    }

    const students = db.prepare("SELECT * FROM students ORDER BY lastActive DESC").all();
    return NextResponse.json({ success: true, students: students.map(formatStudent) });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, grade, score, stars, levelsCompleted, timeSpentSec, certificateIssued, hasCompletedTutorial } = body;

    if (!name || !grade) {
      return NextResponse.json({ success: false, error: 'Name and grade are required' }, { status: 400 });
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Fetch existing from Supabase or Local DB
    let existing = await SupabaseClient.getStudentByNameAndGrade(name, grade);
    if (!existing) {
      const db = getDb();
      existing = db.prepare("SELECT * FROM students WHERE (id = ?) OR (name = ? AND grade = ?)").get(id || '', name, grade);
    }

    const studentId = existing ? existing.id : (id || 'std_' + Date.now());

    let existingLevels = [];
    if (existing && existing.levelsCompleted) {
      if (typeof existing.levelsCompleted === 'string') {
        try { existingLevels = JSON.parse(existing.levelsCompleted); } catch (e) {}
      } else if (Array.isArray(existing.levelsCompleted)) {
        existingLevels = existing.levelsCompleted;
      }
    }

    const newLevels = Array.isArray(levelsCompleted) ? levelsCompleted : existingLevels;
    const mergedLevels = Array.from(new Set([...existingLevels, ...newLevels]));

    const payload = {
      id: studentId,
      name,
      grade,
      score: score !== undefined ? Number(score) : Number(existing?.score || 0),
      stars: stars !== undefined ? Number(stars) : Number(existing?.stars || 0),
      levelsCompleted: JSON.stringify(mergedLevels),
      timeSpentSec: timeSpentSec !== undefined ? Number(timeSpentSec) : Number(existing?.timeSpentSec || 0),
      lastActive: nowStr,
      certificateIssued: certificateIssued !== undefined ? (certificateIssued ? 1 : 0) : Number(existing?.certificateIssued || 0),
      hasCompletedTutorial: hasCompletedTutorial !== undefined ? (hasCompletedTutorial ? 1 : 0) : Number(existing?.hasCompletedTutorial || 1)
    };

    // Save to Supabase Cloud Database & await
    const savedSp = await SupabaseClient.upsertStudent(payload);

    // Backup to local DB
    try {
      const db = getDb();
      db.prepare(`
        INSERT OR REPLACE INTO students 
        (id, name, grade, score, stars, levelsCompleted, timeSpentSec, lastActive, certificateIssued, hasCompletedTutorial)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        payload.id, payload.name, payload.grade, payload.score, payload.stars,
        payload.levelsCompleted, payload.timeSpentSec, payload.lastActive,
        payload.certificateIssued, payload.hasCompletedTutorial
      );
    } catch (e) {}

    return NextResponse.json({ success: true, student: formatStudent(savedSp || payload) });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await SupabaseClient.deleteStudent(id);

    try {
      const db = getDb();
      if (id) db.prepare("DELETE FROM students WHERE id = ?").run(id);
      else db.prepare("DELETE FROM students").run();
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
