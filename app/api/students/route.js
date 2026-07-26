import { NextResponse } from 'next/server';
import { SupabaseClient } from '../../../lib/supabase';

function parseJsonArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch (e) { return []; }
  }
  return [];
}

function formatStudent(s) {
  if (!s) return null;
  return {
    ...s,
    score: Number(s.score || 0),
    stars: Number(s.stars || 0),
    levelsCompleted: parseJsonArray(s.levelsCompleted),
    tutorialTopicsCompleted: parseJsonArray(s.tutorialTopicsCompleted),
    certificateIssued: Boolean(s.certificateIssued),
    hasCompletedTutorial: Boolean(s.hasCompletedTutorial)
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const grade = searchParams.get('grade');

    if (name && grade) {
      const student = await SupabaseClient.getStudentByNameAndGrade(name, grade);
      return NextResponse.json({ success: true, student: formatStudent(student) });
    }

    const students = await SupabaseClient.getStudents();
    return NextResponse.json({ success: true, students: (students || []).map(formatStudent) });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, name, grade, score, stars, levelsCompleted, tutorialTopicsCompleted,
            timeSpentSec, certificateIssued, hasCompletedTutorial } = body;

    if (!name || !grade) {
      return NextResponse.json({ success: false, error: 'Name and grade are required' }, { status: 400 });
    }

    // Fetch existing record from Supabase
    const existing = await SupabaseClient.getStudentByNameAndGrade(name, grade);
    const studentId = existing?.id || (id || 'std_' + Date.now());
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Merge levelsCompleted (accumulate, never shrink)
    const existingLevels = parseJsonArray(existing?.levelsCompleted);
    const mergedLevels = Array.from(new Set([
      ...existingLevels,
      ...(Array.isArray(levelsCompleted) ? levelsCompleted : [])
    ]));

    // Merge tutorialTopicsCompleted (accumulate, never shrink)
    const existingTopics = parseJsonArray(existing?.tutorialTopicsCompleted);
    const mergedTopics = Array.from(new Set([
      ...existingTopics,
      ...(Array.isArray(tutorialTopicsCompleted) ? tutorialTopicsCompleted : [])
    ]));

    const payload = {
      id: studentId,
      name,
      grade,
      score:                  score !== undefined ? Number(score) : Number(existing?.score || 0),
      stars:                  stars !== undefined ? Number(stars) : Number(existing?.stars || 0),
      levelsCompleted:        JSON.stringify(mergedLevels),
      tutorialTopicsCompleted: JSON.stringify(mergedTopics),
      timeSpentSec:           timeSpentSec !== undefined ? Number(timeSpentSec) : Number(existing?.timeSpentSec || 0),
      lastActive:             nowStr,
      certificateIssued:      certificateIssued !== undefined ? (certificateIssued ? 1 : 0) : Number(existing?.certificateIssued || 0),
      hasCompletedTutorial:   hasCompletedTutorial !== undefined ? (hasCompletedTutorial ? 1 : 0) : Number(existing?.hasCompletedTutorial || 0)
    };

    const saved = await SupabaseClient.upsertStudent(payload);
    return NextResponse.json({ success: true, student: formatStudent(saved || payload) });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await SupabaseClient.deleteStudent(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
