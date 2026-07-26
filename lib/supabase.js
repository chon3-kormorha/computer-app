const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cllnwbegfunhmttplovv.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsbG53YmVnZnVuaG10dHBsb3Z2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwNzk3NDYsImV4cCI6MjEwMDY1NTc0Nn0.TqRr8k0Hbh9qWv29ceNr-KKiQibBmMO2wLcxUn7YYCI";

const getHeaders = (extra = {}) => ({
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  ...extra
});

export const SupabaseClient = {
  url: SUPABASE_URL,
  key: SUPABASE_ANON_KEY,

  // STUDENTS CRUD
  getStudents: async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/students?select=*&order=lastActive.desc`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Supabase fetch students error:', e);
      return null;
    }
  },

  getStudentByNameAndGrade: async (name, grade) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/students?name=eq.${encodeURIComponent(name)}&grade=eq.${encodeURIComponent(grade)}&select=*`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) return null;
      const list = await res.json();
      return list.length ? list[0] : null;
    } catch (e) {
      return null;
    }
  },

  upsertStudent: async (student) => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
        method: 'POST',
        headers: getHeaders({
          'Prefer': 'resolution=merge-duplicates,return=representation'
        }),
        body: JSON.stringify(student)
      });
      if (!res.ok) {
        // Fallback put/patch if upsert header unsupported on table without primary key constraint
        const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${encodeURIComponent(student.id)}`, {
          method: 'PATCH',
          headers: getHeaders({ 'Prefer': 'return=representation' }),
          body: JSON.stringify(student)
        });
        if (patchRes.ok) {
          const updated = await patchRes.json();
          if (updated && updated.length) return updated[0];
        }
      } else {
        const data = await res.json();
        if (data && data.length) return data[0];
      }
    } catch (e) {
      console.warn('Supabase upsert student error:', e);
    }
    return student;
  },

  deleteStudent: async (id) => {
    try {
      if (id) {
        await fetch(`${SUPABASE_URL}/rest/v1/students?id=eq.${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: getHeaders()
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/students?id=neq.0`, {
          method: 'DELETE',
          headers: getHeaders()
        });
      }
    } catch (e) {}
  },

  // CONFIG & CLASSROOMS
  getConfig: async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/config?select=*`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  upsertConfig: async (key, value) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/config`, {
        method: 'POST',
        headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({ key, value })
      });
    } catch (e) {}
  },

  getClassrooms: async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/classrooms?select=*`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!res.ok) return null;
      const list = await res.json();
      return list.map(c => c.name);
    } catch (e) {
      return null;
    }
  },

  addClassroom: async (name) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/classrooms`, {
        method: 'POST',
        headers: getHeaders({ 'Prefer': 'resolution=merge-duplicates' }),
        body: JSON.stringify({ name })
      });
    } catch (e) {}
  },

  deleteClassroom: async (name) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/classrooms?name=eq.${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (e) {}
  }
};
