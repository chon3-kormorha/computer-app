'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { SoundEngine } from '../lib/audio';

function getSymbolSVG(shapeType, color = '#3d4f97', text = '', width = 120, height = 60) {
  let shapePath = '';
  switch (shapeType) {
    case 'oval': case 'terminal':
      shapePath = `<rect x="5" y="5" width="110" height="50" rx="25" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
      break;
    case 'rectangle': case 'process':
      shapePath = `<rect x="5" y="5" width="110" height="50" rx="6" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
      break;
    case 'diamond': case 'decision':
      shapePath = `<polygon points="60,2 118,30 60,58 2,30" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
      break;
    case 'arrow': case 'flowline':
      shapePath = `<path d="M10 30 L95 30 M75 16 L105 30 L75 44" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
      break;
    case 'trapezoid': case 'manual_input':
      shapePath = `<polygon points="18,5 115,5 98,53 5,53" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
      break;
    case 'display':
      shapePath = `<path d="M5 5 L95 5 C115 5 115 53 95 53 L5 53 Q25 29 5 5 Z" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
      break;
    case 'circle': case 'connector':
      shapePath = `<circle cx="60" cy="30" r="24" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
      break;
    default:
      shapePath = `<rect x="5" y="5" width="110" height="50" rx="6" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
  }

  let textNode = '';
  if (text) {
    const lines = String(text).split('\n');
    if (lines.length === 1) {
      textNode = `<text x="60" y="34" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle" font-family="Sarabun,sans-serif">${text}</text>`;
    } else {
      const startY = 34 - ((lines.length - 1) * 7);
      textNode = lines.map((l, i) => `<text x="60" y="${startY + (i * 13)}" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="Sarabun,sans-serif">${l}</text>`).join('');
    }
  }

  return (
    <svg viewBox="0 0 120 60" style={{ width: `${width}px`, height: `${height}px` }} xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: shapePath + textNode }} />
  );
}

// ── Level Data Definitions ────────────────────────────────────────────────────

const P4_LEVELS = {
  1: {
    title: 'ด่านที่ 1 ป.4: จับคู่ชื่อสัญลักษณ์กับรูปทรง',
    gradeTag: 'ป.4', type: 'match_name',
    instructions: 'แตะเลือกชื่อสัญลักษณ์ทางซ้าย แล้วแตะวางลงในการ์ดรูปทรงทางขวา',
    items: [
      { id: 's1', name: 'Start / Stop (จุดเริ่มต้น/จุดสิ้นสุด)', shape: 'oval',      color: '#ecab37' },
      { id: 's2', name: 'Process (การทำงาน/การคำนวณ)',          shape: 'rectangle',  color: '#3d4f97' },
      { id: 's3', name: 'Decision (การตัดสินใจ/เงื่อนไข)',       shape: 'diamond',    color: '#f68d1f' },
      { id: 's4', name: 'Flow Line (ลูกศรบอกทิศทาง)',            shape: 'arrow',      color: '#206479' }
    ]
  },
  2: {
    title: 'ด่านที่ 2 ป.4: จับคู่สัญลักษณ์กับหน้าที่',
    gradeTag: 'ป.4', type: 'match_desc',
    instructions: 'เลือกคำอธิบายหน้าที่ทางซ้าย แล้วแตะวางในสัญลักษณ์ทางขวา',
    items: [
      { id: 'f1', name: 'Start / Stop', shape: 'oval',      color: '#ecab37', desc: 'จุดเริ่มต้นหรือสิ้นสุดการทำงานของผังงาน' },
      { id: 'f2', name: 'Process',      shape: 'rectangle', color: '#3d4f97', desc: 'การประมวลผล คำนวณ หรือกำหนดค่าข้อมูล' },
      { id: 'f3', name: 'Decision',     shape: 'diamond',   color: '#f68d1f', desc: 'การตัดสินใจ หรือการตรวจสอบเงื่อนไข' },
      { id: 'f4', name: 'Manual Input', shape: 'trapezoid', color: '#acace7', desc: 'รับข้อมูลเข้าทางคีย์บอร์ดโดยผู้ใช้' }
    ]
  },
  3: {
    title: 'ด่านที่ 3 ป.4: เรียงลำดับขั้นตอนแปรงฟัน',
    gradeTag: 'ป.4', type: 'sequence',
    instructions: 'กดปุ่ม ▲ / ▼ เรียงลำดับขั้นตอนให้ถูกต้องจากบนลงล่าง',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',               shape: 'oval'      },
      { id: 2, text: '2. บีบยาสีฟันลงบนแปรงฟัน',         shape: 'rectangle' },
      { id: 3, text: '3. แปรงฟันให้สะอาด 2 นาที',         shape: 'rectangle' },
      { id: 4, text: '4. บ้วนปากด้วยน้ำสะอาด',            shape: 'rectangle' },
      { id: 5, text: '5. สิ้นสุด (Stop)',                  shape: 'oval'      }
    ]
  },
  4: {
    title: 'ด่านที่ 4 ป.4: เรียงลำดับขั้นตอนการล้างมือ',
    gradeTag: 'ป.4', type: 'sequence',
    instructions: 'กดปุ่ม ▲ / ▼ เรียงลำดับขั้นตอนการล้างมือตามสุขอนามัยให้ถูกต้อง',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',                shape: 'oval'      },
      { id: 2, text: '2. ราดน้ำให้มือเปียก',               shape: 'rectangle' },
      { id: 3, text: '3. ถูสบู่ให้เกิดฟอง 20 วินาที',      shape: 'rectangle' },
      { id: 4, text: '4. ล้างมือด้วยน้ำสะอาด',             shape: 'rectangle' },
      { id: 5, text: '5. เช็ดมือให้แห้งด้วยผ้าสะอาด',     shape: 'rectangle' },
      { id: 6, text: '6. สิ้นสุด (Stop)',                   shape: 'oval'      }
    ]
  },
  5: {
    title: 'ด่านที่ 5 ป.4: คาดการณ์ผลลัพธ์เกม OX (ตรรกะ)',
    gradeTag: 'ป.4', type: 'quiz',
    instructions: 'เลือกคำตอบที่ถูกต้องตามสถานการณ์ที่กำหนด',
    questions: [
      { q: 'ถ้าช่องกลางตาราง OX วางตัว O แล้ว ผู้เล่น X ควรวางที่ใดเพื่อกีดขวาง?', options: ['ช่องมุมใดก็ได้', 'ช่องกลางด้านข้าง', 'ขึ้นอยู่กับเงื่อนไข', 'วางทุกช่อง'], correct: 0 },
      { q: 'สัญลักษณ์รูปข้าวหลามตัด (◇) ในผังงานหมายถึงอะไร?', options: ['การประมวลผล', 'การตัดสินใจ/เงื่อนไข', 'จุดเริ่มต้น', 'การป้อนข้อมูล'], correct: 1 },
      { q: 'สัญลักษณ์วงกลม (○) ในผังงานใช้ทำอะไร?', options: ['จุดเชื่อมต่อผังงาน', 'บันทึกข้อมูล', 'แสดงผลหน้าจอ', 'จบโปรแกรม'], correct: 0 }
    ]
  },
  6: {
    title: 'ด่านที่ 6 ป.4: จับคู่สัญลักษณ์เพิ่มเติม (Display & Connector)',
    gradeTag: 'ป.4', type: 'match_name',
    instructions: 'แตะเลือกชื่อสัญลักษณ์ทางซ้าย แล้วแตะวางลงในการ์ดรูปทรงทางขวา',
    items: [
      { id: 'x1', name: 'Display (แสดงผลบนจอภาพ)',          shape: 'display',   color: '#8ba1d4' },
      { id: 'x2', name: 'Connector (จุดเชื่อมต่อ)',           shape: 'circle',    color: '#e60012' },
      { id: 'x3', name: 'Manual Input (ป้อนข้อมูลด้วยมือ)',   shape: 'trapezoid', color: '#acace7' },
      { id: 'x4', name: 'Input/Output (รับเข้า/ส่งออกข้อมูล)', shape: 'trapezoid', color: '#206479' }
    ]
  },
  7: {
    title: 'ด่านที่ 7 ป.4: จับคู่สัญลักษณ์กับสถานการณ์',
    gradeTag: 'ป.4', type: 'scenario',
    instructions: 'เลือกสัญลักษณ์ Flowchart ที่ถูกต้องสำหรับสถานการณ์แต่ละข้อ',
    items: [
      { id: 'sc1', label: 'จุดที่รถรวมกันบนถนนหลัก',       correct: 'circle',    options: ['oval','circle','diamond'] },
      { id: 'sc2', label: 'หน้าจอแสดงอุณหภูมิ 38 องศา',   correct: 'display',   options: ['rectangle','display','arrow'] },
      { id: 'sc3', label: 'กดปุ่มตัวเลขบนเครื่องคิดเลข',   correct: 'trapezoid', options: ['oval','trapezoid','diamond'] }
    ]
  },
  8: {
    title: 'ด่านที่ 8 ป.4: ประเมินเว็บไซต์น่าเชื่อถือ (ICT)',
    gradeTag: 'ป.4', type: 'quiz',
    instructions: 'เลือกคำตอบที่ถูกต้องเกี่ยวกับการสืบค้นข้อมูลบนอินเทอร์เน็ต',
    questions: [
      { q: 'โดเมน .go.th หมายถึงหน่วยงานประเภทใด?', options: ['บริษัทเอกชน', 'หน่วยงานภาครัฐ', 'สถาบันการศึกษา', 'องค์กรเอกชนไม่แสวงกำไร'], correct: 1 },
      { q: 'การค้นหา Keyword ที่ดีควรเป็นอย่างไร?', options: ['ใช้คำยาวมากที่สุด', 'ใช้คำกว้างๆ ที่ไม่เจาะจง', 'ใช้คำสั้นและตรงประเด็น', 'ไม่ต้องใส่คำอะไรเลย'], correct: 2 },
      { q: 'เราควรตรวจสอบอะไรก่อนเชื่อข้อมูลบนอินเทอร์เน็ต?', options: ['สีของเว็บไซต์', 'ผู้เขียนและวันที่เผยแพร่', 'ความยาวของบทความ', 'จำนวนรูปภาพในหน้า'], correct: 1 }
    ]
  },
  9: {
    title: 'ด่านที่ 9 ป.4: การตั้งรหัสผ่านและสิทธิ์ดิจิทัล',
    gradeTag: 'ป.4', type: 'quiz',
    instructions: 'ตอบคำถามเกี่ยวกับการใช้งานอินเทอร์เน็ตอย่างปลอดภัย',
    questions: [
      { q: 'รหัสผ่านแบบใดปลอดภัยที่สุด?', options: ['12345678', 'วันเกิดของตัวเอง', 'ชื่อสัตว์เลี้ยง', 'ตัวอักษร+ตัวเลข+สัญลักษณ์ผสมกัน'], correct: 3 },
      { q: 'ควรบอกรหัสผ่านให้ใครได้บ้าง?', options: ['เพื่อนสนิท', 'ไม่ควรบอกใครทั้งนั้น', 'ครูทุกท่าน', 'ผู้ดูแลระบบแปลกหน้า'], correct: 1 },
      { q: 'หากได้รับข้อความลูกโซ่ควรทำอย่างไร?', options: ['ส่งต่อทันที', 'เก็บข้อมูลไว้ก่อน', 'ไม่ส่งต่อและแจ้งผู้ปกครอง', 'คลิกลิงก์ในข้อความ'], correct: 2 }
    ]
  },
  10: {
    title: 'ด่านที่ 10 ป.4: Mini Challenge เดินทางมาโรงเรียน',
    gradeTag: 'ป.4', type: 'sequence',
    instructions: 'เรียงลำดับผังงานการตัดสินใจเดินทางมาโรงเรียนให้ถูกต้อง',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',                     shape: 'oval'      },
      { id: 2, text: '2. ตื่นนอนและแต่งกายเครื่องแบบนักเรียน',  shape: 'rectangle' },
      { id: 3, text: '3. สังเกตสภาพอากาศนอกบ้าน',               shape: 'rectangle' },
      { id: 4, text: '4. ฝนตกหรือไม่?',                         shape: 'diamond'   },
      { id: 5, text: '5. พกร่มและขึ้นรถโรงเรียน',                shape: 'rectangle' },
      { id: 6, text: '6. ถึงโรงเรียนอย่างปลอดภัย',               shape: 'display'   },
      { id: 7, text: '7. สิ้นสุด (Stop)',                         shape: 'oval'      }
    ]
  }
};

const P5_LEVELS = {
  11: {
    title: 'ด่านที่ 1 ป.5: เลือกสัญลักษณ์ตามโจทย์',
    gradeTag: 'ป.5', type: 'scenario',
    instructions: 'เลือกสัญลักษณ์ Flowchart ที่ถูกต้องสำหรับสถานการณ์แต่ละข้อ',
    items: [
      { id: 'p1', label: 'หน้าจอแสดงผลตัวเลขอุณหภูมิห้อง',        correct: 'display',   options: ['oval','display','rectangle'] },
      { id: 'p2', label: 'จุดรวมทางเดินของนักเรียนหน้าเสาธง',      correct: 'circle',    options: ['diamond','circle','trapezoid'] },
      { id: 'p3', label: 'คำนวณราคาขาย = ราคาทุน + กำไร 20%',     correct: 'rectangle', options: ['rectangle','display','oval'] }
    ]
  },
  12: {
    title: 'ด่านที่ 2 ป.5: ผังงานต้มบะหมี่สำเร็จรูป',
    gradeTag: 'ป.5', type: 'sequence',
    instructions: 'เรียงลำดับผังงานการต้มบะหมี่สำเร็จรูปให้ถูกต้อง พร้อมเงื่อนไขต้มครบ 3 นาที',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',              shape: 'oval'      },
      { id: 2, text: '2. ต้มน้ำในหม้อให้เดือด',          shape: 'rectangle' },
      { id: 3, text: '3. ใส่บะหมี่และเครื่องปรุง',       shape: 'rectangle' },
      { id: 4, text: '4. ต้มครบ 3 นาทีหรือไม่?',         shape: 'diamond'   },
      { id: 5, text: '5. เทใส่ชามพร้อมรับประทาน',        shape: 'rectangle' },
      { id: 6, text: '6. สิ้นสุด (Stop)',                 shape: 'oval'      }
    ]
  },
  13: {
    title: 'ด่านที่ 3 ป.5: ผังงานระบบถอนเงินตู้ ATM',
    gradeTag: 'ป.5', type: 'sequence',
    instructions: 'เรียงลำดับขั้นตอนระบบถอนเงินตู้ ATM ให้ถูกต้องสมบูรณ์',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',                   shape: 'oval'      },
      { id: 2, text: '2. เสียบบัตร & กรอกรหัส PIN',           shape: 'trapezoid' },
      { id: 3, text: '3. ตรวจสอบรหัสผ่านถูกต้องหรือไม่?',    shape: 'diamond'   },
      { id: 4, text: '4. หักยอดเงินในบัญชี',                  shape: 'rectangle' },
      { id: 5, text: '5. จ่ายเงินสด & พิมพ์สลิป',            shape: 'display'   },
      { id: 6, text: '6. สิ้นสุด (Stop)',                      shape: 'oval'      }
    ]
  },
  14: {
    title: 'ด่านที่ 4 ป.5: ผังงานตรวจดัชนีมวลกาย BMI',
    gradeTag: 'ป.5', type: 'sequence',
    instructions: 'เรียงลำดับการคำนวณและประเมินค่า BMI ของร่างกาย',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',                              shape: 'oval'      },
      { id: 2, text: '2. รับค่าน้ำหนัก (kg) และส่วนสูง (m)',            shape: 'trapezoid' },
      { id: 3, text: '3. คำนวณ BMI = น้ำหนัก / (ส่วนสูง × ส่วนสูง)',   shape: 'rectangle' },
      { id: 4, text: '4. BMI > 23 หรือไม่? (เกณฑ์เริ่มอ้วน)',           shape: 'diamond'   },
      { id: 5, text: '5. แสดงผลการประเมินทางหน้าจอ',                    shape: 'display'   },
      { id: 6, text: '6. สิ้นสุด (Stop)',                                 shape: 'oval'      }
    ]
  },
  15: {
    title: 'ด่านที่ 5 ป.5: ผังงานระบบตัดเกรดวิชาคำนวณ',
    gradeTag: 'ป.5', type: 'sequence',
    instructions: 'เรียงลำดับผังงานตัดเกรดจากคะแนนสอบให้ถูกต้อง',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',            shape: 'oval'      },
      { id: 2, text: '2. รับคะแนนสอบจากนักเรียน',      shape: 'trapezoid' },
      { id: 3, text: '3. คะแนน ≥ 80 หรือไม่?',          shape: 'diamond'   },
      { id: 4, text: '4. แสดงเกรด "A" บนหน้าจอ',       shape: 'display'   },
      { id: 5, text: '5. ตรวจสอบเกณฑ์เกรดถัดไป',        shape: 'diamond'   },
      { id: 6, text: '6. สิ้นสุด (Stop)',               shape: 'oval'      }
    ]
  },
  16: {
    title: 'ด่านที่ 6 ป.5: เปรียบเทียบข้อดี-ข้อเสียสารสนเทศ',
    gradeTag: 'ป.5', type: 'quiz',
    instructions: 'ตอบคำถามเกี่ยวกับการประเมินและเปรียบเทียบข้อมูล',
    questions: [
      { q: 'ก่อนนำข้อมูลจากอินเทอร์เน็ตมาอ้างอิง ควรทำอะไรก่อน?', options: ['คัดลอกทันที', 'ตรวจสอบแหล่งที่มาและวันที่', 'แปลเป็นภาษาอื่น', 'พิมพ์เก็บไว้'], correct: 1 },
      { q: 'การเปรียบเทียบข้อมูลจากหลายแหล่งช่วยอะไร?', options: ['ทำให้งานยากขึ้น', 'ช่วยตรวจสอบความถูกต้องของข้อมูล', 'ทำให้เสียเวลา', 'ไม่มีประโยชน์'], correct: 1 },
      { q: 'Spreadsheet ช่วยในการจัดการข้อมูลอย่างไร?', options: ['เล่นเกม', 'คำนวณและสรุปข้อมูลอัตโนมัติ', 'วาดรูป', 'ส่งอีเมล'], correct: 1 }
    ]
  },
  17: {
    title: 'ด่านที่ 7 ป.5: จับคู่ประเมินความน่าเชื่อถือเว็บไซต์',
    gradeTag: 'ป.5', type: 'match_desc',
    instructions: 'จับคู่ประเภทเว็บไซต์กับคำอธิบายให้ถูกต้อง',
    items: [
      { id: 'w1', name: '.go.th',  shape: 'rectangle', color: '#3d4f97', desc: 'หน่วยงานภาครัฐของประเทศไทย' },
      { id: 'w2', name: '.ac.th',  shape: 'oval',       color: '#15803d', desc: 'สถาบันการศึกษาในประเทศไทย' },
      { id: 'w3', name: '.or.th',  shape: 'diamond',    color: '#f68d1f', desc: 'องค์กรเอกชนไม่แสวงกำไร' },
      { id: 'w4', name: '.co.th',  shape: 'display',    color: '#206479', desc: 'บริษัทเอกชนในประเทศไทย' }
    ]
  },
  18: {
    title: 'ด่านที่ 8 ป.5: ประเมินความน่าเชื่อถือ Fake News',
    gradeTag: 'ป.5', type: 'quiz',
    instructions: 'เลือกวิธีรับมือและตรวจสอบข่าวปลอมที่ถูกต้อง',
    questions: [
      { q: 'พบข่าว "ยาสีฟันรักษามะเร็งได้" ควรทำอย่างไร?', options: ['แชร์ทันที', 'ตรวจสอบจากแหล่งข่าวน่าเชื่อถือก่อน', 'เชื่อถือได้เลย', 'ไม่สนใจทุกข่าว'], correct: 1 },
      { q: 'ข่าวที่มาจากเว็บไซต์ที่ไม่มีผู้เขียนระบุ ควรระวังอะไร?', options: ['ระวังว่าจะอ่านนาน', 'อาจเป็นข่าวที่ไม่น่าเชื่อถือ', 'เชื่อถือได้เพราะไม่มีใครรับผิดชอบ', 'ดีกว่ามีผู้เขียน'], correct: 1 },
      { q: 'วิธีตรวจสอบ Fake News ที่ดีที่สุดคือ?', options: ['ส่งต่อให้เพื่อนตรวจ', 'เชื่อถ้าคนส่งให้เป็นคนรู้จัก', 'ค้นหาข้อมูลยืนยันจากหลายแหล่งน่าเชื่อถือ', 'ดูจำนวน Like'], correct: 2 }
    ]
  },
  19: {
    title: 'ด่านที่ 9 ป.5: รับมือ Cyberbullying และการกลั่นแกล้งออนไลน์',
    gradeTag: 'ป.5', type: 'quiz',
    instructions: 'เลือกวิธีปฏิบัติตนที่ถูกต้องในสถานการณ์ออนไลน์',
    questions: [
      { q: 'หากถูกกลั่นแกล้งออนไลน์ควรทำอย่างไร?', options: ['ตอบโต้ด้วยความรุนแรง', 'บันทึกหลักฐานและแจ้งผู้ปกครอง', 'เพิกเฉยและยอมรับ', 'ลบบัญชีตัวเอง'], correct: 1 },
      { q: 'การส่งรูปภาพของเพื่อนโดยไม่ได้รับอนุญาตถือว่าอย่างไร?', options: ['เป็นเรื่องปกติ', 'การละเมิดสิทธิส่วนบุคคล', 'ช่วยเผยแพร่ข้อมูล', 'ทำเพื่อความสนุก'], correct: 1 },
      { q: 'เมื่อเห็นเพื่อนถูกกลั่นแกล้งออนไลน์ควรทำอย่างไร?', options: ['กดไลค์โพสต์นั้น', 'แชร์โพสต์ต่อ', 'แจ้งครูหรือผู้ปกครองและให้กำลังใจเพื่อน', 'ไม่เกี่ยวข้อง'], correct: 2 }
    ]
  },
  20: {
    title: 'ด่านที่ 10 ป.5: Grand Challenge ตู้สมาร์ทการ์ด',
    gradeTag: 'ป.5', type: 'sequence',
    instructions: 'เรียงลำดับผังงานระบบยืนยันตัวตนด้วยบัตรสมาร์ทการ์ดให้สมบูรณ์',
    steps: [
      { id: 1, text: '1. เริ่มต้น (Start)',                      shape: 'oval'      },
      { id: 2, text: '2. แตะบัตรสมาร์ทการ์ดที่เครื่องอ่าน',      shape: 'trapezoid' },
      { id: 3, text: '3. ระบบอ่านข้อมูลในบัตร',                  shape: 'rectangle' },
      { id: 4, text: '4. ข้อมูลบัตรถูกต้องหรือไม่?',             shape: 'diamond'   },
      { id: 5, text: '5. แสดงชื่อและสิทธิ์การเข้าถึง',           shape: 'display'   },
      { id: 6, text: '6. บันทึกเวลาเข้าออกในระบบ',               shape: 'rectangle' },
      { id: 7, text: '7. สิ้นสุด (Stop)',                          shape: 'oval'      }
    ]
  }
};

const ALL_LEVELS = { ...P4_LEVELS, ...P5_LEVELS };

// ── GameStage Component ───────────────────────────────────────────────────────

export default function GameStage({ levelNum, student, onFinishLevel, onBackToMap }) {
  const [matchNameSelected, setMatchNameSelected] = useState(null);
  const [matchNameSelections, setMatchNameSelections] = useState({});

  const [matchDescSelected, setMatchDescSelected] = useState(null);
  const [matchDescSelections, setMatchDescSelections] = useState({});

  const [sequenceOrder, setSequenceOrder] = useState([]);

  const [quizIdx, setQuizIdx] = useState(0);

  const [scenarioSelections, setScenarioSelections] = useState({});

  const currentLevel = ALL_LEVELS[levelNum] || ALL_LEVELS[1];

  useEffect(() => {
    // Reset all state when levelNum changes
    setMatchNameSelected(null);
    setMatchNameSelections({});
    setMatchDescSelected(null);
    setMatchDescSelections({});
    setQuizIdx(0);
    setScenarioSelections({});

    if (currentLevel.type === 'sequence' && currentLevel.steps) {
      const shuffled = [...currentLevel.steps].sort(() => Math.random() - 0.5);
      setSequenceOrder(shuffled);
    }
  }, [levelNum]);

  // ── Match Name Handlers ────────────────────────────────────────────────────
  const handleMatchNameTarget = (targetId) => {
    if (!matchNameSelected) {
      Swal.fire({ icon: 'info', title: 'คำแนะนำ', text: 'กรุณาแตะเลือกชื่อสัญลักษณ์ทางซ้ายก่อน', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    SoundEngine.playClick();
    setMatchNameSelections(prev => ({ ...prev, [targetId]: matchNameSelected }));
  };

  const checkMatchName = () => {
    const items = currentLevel.items;
    let correct = 0;
    items.forEach(item => { if (matchNameSelections[item.id] === item.id) correct++; });
    if (correct === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(levelNum, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ยังไม่ถูกต้อง!', text: `ถูก ${correct} จาก ${items.length} ข้อ`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // ── Match Desc Handlers ────────────────────────────────────────────────────
  const handleMatchDescTarget = (targetId) => {
    if (!matchDescSelected) {
      Swal.fire({ icon: 'info', title: 'คำแนะนำ', text: 'กรุณาแตะเลือกคำอธิบายทางซ้ายก่อน', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    SoundEngine.playClick();
    setMatchDescSelections(prev => ({ ...prev, [targetId]: matchDescSelected }));
  };

  const checkMatchDesc = () => {
    const items = currentLevel.items;
    let correct = 0;
    items.forEach(item => { if (matchDescSelections[item.id] === item.id) correct++; });
    if (correct === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(levelNum, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ยังไม่ถูกต้อง!', text: `ถูก ${correct} จาก ${items.length} ข้อ`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // ── Sequence Handlers ──────────────────────────────────────────────────────
  const moveStep = (index, direction) => {
    const arr = [...sequenceOrder];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= arr.length) return;
    SoundEngine.playClick();
    [arr[index], arr[targetIdx]] = [arr[targetIdx], arr[index]];
    setSequenceOrder(arr);
  };

  const checkSequence = () => {
    const correct = sequenceOrder.every((step, i) => step.id === i + 1);
    if (correct) {
      SoundEngine.playCorrect();
      onFinishLevel(levelNum, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ลำดับยังไม่ถูกต้อง!', text: 'ลองสังเกตตัวเลขลำดับและปรับเรียงใหม่อีกครั้ง', customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // ── Quiz Handlers ──────────────────────────────────────────────────────────
  const handleQuizAnswer = (oIdx) => {
    const q = currentLevel.questions[quizIdx];
    if (oIdx === q.correct) {
      SoundEngine.playCorrect();
      if (quizIdx + 1 < currentLevel.questions.length) {
        setQuizIdx(prev => prev + 1);
      } else {
        onFinishLevel(levelNum, 100, 3);
      }
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ตอบผิดครับ!', text: 'ลองเลือกใหม่อีกครั้ง', customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // ── Scenario Handlers ──────────────────────────────────────────────────────
  const handleScenarioChoice = (itemId, shape) => {
    SoundEngine.playClick();
    setScenarioSelections(prev => ({ ...prev, [itemId]: shape }));
  };

  const checkScenario = () => {
    const items = currentLevel.items;
    let correct = 0;
    items.forEach(it => { if (scenarioSelections[it.id] === it.correct) correct++; });
    if (correct === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(levelNum, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ตอบถูกไม่ครบ!', text: `ถูก ${correct} จาก ${items.length} ข้อ`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  const bgGrad = currentLevel.gradeTag === 'ป.5'
    ? 'linear-gradient(135deg, #1b4332 0%, #1e5f74 100%)'
    : 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)';

  return (
    <section className="screen-view">
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-y2k btn-carbon btn-sm" onClick={onBackToMap}>◀ กลับหน้าแผนที่ด่าน</button>
        <span className="status-badge ready" style={{ fontSize: '12px' }}>ระดับ: {currentLevel.gradeTag}</span>
      </div>

      <div className="hero-panel" style={{ background: bgGrad }}>
        <h2 className="hero-display-title">{currentLevel.title}</h2>
        <p style={{ fontSize: '13px', color: '#ffffff', marginTop: '4px' }}>{currentLevel.instructions}</p>
      </div>

      {/* ── MATCH NAME ── */}
      {currentLevel.type === 'match_name' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>1. แตะเลือกชื่อสัญลักษณ์:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentLevel.items.map(item => (
                  <button key={item.id}
                    className={`btn-y2k ${matchNameSelected === item.id ? 'btn-amber active' : 'btn-carbon'}`}
                    onClick={() => { SoundEngine.playClick(); setMatchNameSelected(item.id); }}
                    style={{ textAlign: 'left', fontSize: '12px' }}
                  >{item.name}</button>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>2. วางชื่อลงในรูปทรง:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentLevel.items.map(item => {
                  const assigned = currentLevel.items.find(x => x.id === matchNameSelections[item.id]);
                  return (
                    <div key={item.id} onClick={() => handleMatchNameTarget(item.id)}
                      style={{ padding: '10px', border: '2px dashed var(--chrome-indigo)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                      {getSymbolSVG(item.shape, item.color, '', 90, 45)}
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: assigned ? 'var(--signal)' : '#94a3b8', maxWidth: '160px', textAlign: 'right' }}>
                        {assigned ? assigned.name : 'แตะเพื่อวางชื่อ...'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkMatchName}>✓ ตรวจคำตอบ</button>
          </div>
        </div>
      )}

      {/* ── MATCH DESC ── */}
      {currentLevel.type === 'match_desc' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>1. เลือกคำอธิบาย:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {currentLevel.items.map(item => (
                  <button key={item.id}
                    className={`btn-y2k ${matchDescSelected === item.id ? 'btn-amber active' : 'btn-carbon'}`}
                    onClick={() => { SoundEngine.playClick(); setMatchDescSelected(item.id); }}
                    style={{ textAlign: 'left', fontSize: '12px', lineHeight: 1.4 }}
                  >• {item.desc}</button>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>2. วางลงในสัญลักษณ์:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentLevel.items.map(item => {
                  const assigned = currentLevel.items.find(x => x.id === matchDescSelections[item.id]);
                  return (
                    <div key={item.id} onClick={() => handleMatchDescTarget(item.id)}
                      style={{ padding: '10px', border: '2px dashed var(--amber)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fffbe6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getSymbolSVG(item.shape, item.color, item.name || '', 90, 45)}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: assigned ? 'var(--signal)' : '#94a3b8', maxWidth: '180px', textAlign: 'right' }}>
                        {assigned ? assigned.desc : 'แตะวางคำอธิบาย...'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkMatchDesc}>✓ ตรวจคำตอบ</button>
          </div>
        </div>
      )}

      {/* ── SEQUENCE ── */}
      {currentLevel.type === 'sequence' && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>กดปุ่ม ▲ / ▼ เพื่อจัดเรียงขั้นตอนผังงาน:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sequenceOrder.map((step, idx) => (
                <div key={step.id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getSymbolSVG(step.shape || 'rectangle', '#3d4f97', '', 40, 24)}
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{step.text}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn-y2k btn-carbon btn-sm" onClick={() => moveStep(idx, -1)} disabled={idx === 0} style={{ opacity: idx === 0 ? 0.4 : 1 }}>▲</button>
                    <button className="btn-y2k btn-carbon btn-sm" onClick={() => moveStep(idx, 1)} disabled={idx === sequenceOrder.length - 1} style={{ opacity: idx === sequenceOrder.length - 1 ? 0.4 : 1 }}>▼</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkSequence}>✓ ตรวจลำดับผังงาน</button>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {currentLevel.type === 'quiz' && (
        <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          <div className="content-card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '13px', color: 'var(--systems-teal)', fontWeight: 'bold', marginBottom: '8px' }}>
              ข้อที่ {quizIdx + 1} จาก {currentLevel.questions.length}
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>
              {currentLevel.questions[quizIdx].q}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentLevel.questions[quizIdx].options.map((opt, oIdx) => (
                <button key={oIdx} className="btn-y2k btn-amber"
                  onClick={() => handleQuizAnswer(oIdx)}
                  style={{ padding: '12px', fontSize: '14px', textAlign: 'center' }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SCENARIO ── */}
      {currentLevel.type === 'scenario' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {currentLevel.items.map((item, idx) => (
              <div key={item.id} className="content-card" style={{ background: '#ffffff', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>
                  ข้อ {idx + 1}: {item.label}
                </h4>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {item.options.map(sh => (
                    <button key={sh}
                      className={`btn-y2k ${scenarioSelections[item.id] === sh ? 'btn-amber active' : 'btn-carbon'}`}
                      onClick={() => handleScenarioChoice(item.id, sh)}
                      style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getSymbolSVG(sh, '#3d4f97', '', 40, 24)}
                      <span style={{ fontSize: '12px' }}>{sh}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkScenario}>✓ ตรวจคำตอบ</button>
          </div>
        </div>
      )}
    </section>
  );
}
