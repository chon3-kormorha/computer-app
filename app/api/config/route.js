import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  try {
    const db = getDb();
    if (!db) {
      return NextResponse.json({
        success: true,
        config: { studentPasscode: '1234', adminUsername: 'admin', adminPassword: 'admin1234', availableGrades: ['ป.4/1', 'ป.4/2', 'ป.5/1', 'ป.5/2', 'ม.1/1', 'ม.1/2'] }
      });
    }

    const rows = db.prepare("SELECT key, value FROM config").all();
    const configMap = {};
    rows.forEach(r => { configMap[r.key] = r.value; });

    const classrooms = db.prepare("SELECT name FROM classrooms").all().map(c => c.name);

    return NextResponse.json({
      success: true,
      config: {
        studentPasscode: configMap.studentPasscode || '1234',
        adminUsername: configMap.adminUsername || 'admin',
        adminPassword: configMap.adminPassword || 'admin1234',
        availableGrades: classrooms.length ? classrooms : ['ป.4/1', 'ป.4/2', 'ป.5/1', 'ป.5/2', 'ม.1/1', 'ม.1/2']
      }
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ success: false }, { status: 500 });

    const body = await request.json();
    const { studentPasscode, adminUsername, adminPassword, newGrade } = body;

    if (studentPasscode) db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('studentPasscode', ?)").run(studentPasscode);
    if (adminUsername) db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('adminUsername', ?)").run(adminUsername);
    if (adminPassword) db.prepare("INSERT OR REPLACE INTO config (key, value) VALUES ('adminPassword', ?)").run(adminPassword);

    if (newGrade) {
      db.prepare("INSERT OR IGNORE INTO classrooms (name) VALUES (?)").run(newGrade.trim());
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ success: false }, { status: 500 });

    const body = await request.json();
    const { oldGrade, newGrade } = body;

    if (oldGrade && newGrade) {
      db.prepare("DELETE FROM classrooms WHERE name = ?").run(oldGrade);
      db.prepare("INSERT OR IGNORE INTO classrooms (name) VALUES (?)").run(newGrade.trim());
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const db = getDb();
    if (!db) return NextResponse.json({ success: false }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    if (grade) {
      db.prepare("DELETE FROM classrooms WHERE name = ?").run(grade);
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
