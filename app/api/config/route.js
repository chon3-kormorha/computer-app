import { NextResponse } from 'next/server';
import { SupabaseClient } from '../../../lib/supabase';

const DEFAULT_GRADES = [
  'ป.4/1', 'ป.4/2', 'ป.4/3',
  'ป.5/1', 'ป.5/2', 'ป.5/3',
  'ป.6/1', 'ป.6/2'
];

export async function GET() {
  try {
    let studentPasscode = '1234';
    let adminUsername   = 'admin';
    let adminPassword   = 'admin1234';
    let availableGrades = DEFAULT_GRADES;

    const spConfig = await SupabaseClient.getConfig();
    if (spConfig && Array.isArray(spConfig)) {
      spConfig.forEach(r => {
        if (r.key === 'studentPasscode') studentPasscode = r.value;
        if (r.key === 'adminUsername')   adminUsername   = r.value;
        if (r.key === 'adminPassword')   adminPassword   = r.value;
      });
    }

    const spClassrooms = await SupabaseClient.getClassrooms();
    if (spClassrooms && Array.isArray(spClassrooms) && spClassrooms.length) {
      availableGrades = spClassrooms;
    }

    return NextResponse.json({
      success: true,
      config: { studentPasscode, adminUsername, adminPassword, availableGrades }
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentPasscode, adminUsername, adminPassword, newGrade } = body;

    if (studentPasscode) await SupabaseClient.upsertConfig('studentPasscode', studentPasscode);
    if (adminUsername)   await SupabaseClient.upsertConfig('adminUsername',   adminUsername);
    if (adminPassword)   await SupabaseClient.upsertConfig('adminPassword',   adminPassword);
    if (newGrade)        await SupabaseClient.addClassroom(newGrade.trim());

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { oldGrade, newGrade } = body;

    if (oldGrade && newGrade) {
      await SupabaseClient.deleteClassroom(oldGrade);
      await SupabaseClient.addClassroom(newGrade.trim());
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    if (grade) await SupabaseClient.deleteClassroom(grade);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
