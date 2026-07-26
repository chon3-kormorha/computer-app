'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { SoundEngine } from '../lib/audio';

function getSymbolSVG(shapeType, color = '#3d4f97', text = '', width = 120, height = 60) {
  let shapePath = '';
  switch (shapeType) {
    case 'oval':
    case 'terminal':
      shapePath = `<rect x="5" y="5" width="110" height="50" rx="25" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    case 'rectangle':
    case 'process':
      shapePath = `<rect x="5" y="5" width="110" height="50" rx="6" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    case 'diamond':
    case 'decision':
      shapePath = `<polygon points="60,2 118,30 60,58 2,30" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    case 'arrow':
    case 'flowline':
      shapePath = `<path d="M10 30 L95 30 M75 16 L105 30 L75 44" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    case 'trapezoid':
    case 'manual_input':
      shapePath = `<polygon points="18,5 115,5 98,53 5,53" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    case 'display':
      shapePath = `<path d="M5 5 L95 5 C115 5 115 53 95 53 L5 53 Q25 29 5 5 Z" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    case 'circle':
    case 'connector':
      shapePath = `<circle cx="60" cy="30" r="24" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
      break;
    default:
      shapePath = `<rect x="5" y="5" width="110" height="50" rx="6" fill="${color}" stroke="#ffffff" stroke-width="3"/>`;
  }

  let textNode = '';
  if (text) {
    const lines = String(text).split('\n');
    if (lines.length === 1) {
      textNode = `<text x="60" y="34" fill="#ffffff" font-size="11" font-weight="bold" text-anchor="middle" font-family="'Sarabun', sans-serif">${text}</text>`;
    } else {
      const startY = 34 - ((lines.length - 1) * 7);
      textNode = lines.map((l, i) => `<text key="${i}" x="60" y="${startY + (i * 13)}" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="'Sarabun', sans-serif">${l}</text>`).join('');
    }
  }

  return (
    <svg className="svg-shape" viewBox="0 0 120 60" style={{ width: `${width}px`, height: `${height}px` }} xmlns="http://www.w3.org/2000/svg" dangerouslySetInnerHTML={{ __html: shapePath + textNode }} />
  );
}

export default function GameStage({ levelNum, student, onFinishLevel, onBackToMap }) {
  // Generic Selection & Sequence States
  const [l1SelectedNameId, setL1SelectedNameId] = useState(null);
  const [l1Selections, setL1Selections] = useState({});

  const [l2SelectedDescId, setL2SelectedDescId] = useState(null);
  const [l2Selections, setL2Selections] = useState({});

  const [sequenceOrder, setSequenceOrder] = useState([]);

  const [quizIdx, setQuizIdx] = useState(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState(15);

  const [l5Selections, setL5Selections] = useState({});

  const LEVEL_DATA = {
    1: {
      title: 'ด่านที่ 1: จับคู่ชื่อสัญลักษณ์กับรูปทรง (ระดับ ป.4)',
      gradeTag: 'ป.4',
      instructions: 'คลิกเลือก “ชื่อสัญลักษณ์” ทางซ้าย แล้วแตะการ์ดรูปทรงทางขวาเพื่อวางชื่อให้ถูกต้อง',
      items: [
        { id: 's1', name: 'Start / Stop (จุดเริ่มต้น / จุดสิ้นสุด)', shape: 'oval', color: '#ecab37' },
        { id: 's2', name: 'Process (การทำงาน / การคำนวณ)', shape: 'rectangle', color: '#3d4f97' },
        { id: 's3', name: 'Decision (การตัดสินใจ / เช็กเงื่อนไข)', shape: 'diamond', color: '#f68d1f' },
        { id: 's4', name: 'Flow Line (ลูกศรบอกทิศทาง)', shape: 'arrow', color: '#206479' }
      ]
    },
    2: {
      title: 'ด่านที่ 2: จับคู่สัญลักษณ์กับหน้าที่การทำงาน (ระดับ ป.4)',
      gradeTag: 'ป.4',
      instructions: 'เลือกหน้าที่การทำงานทางซ้าย แล้วแตะวางลงในการ์ดสัญลักษณ์ทางขวาให้ถูกต้อง',
      items: [
        { id: 'f1', name: 'Start / Stop', shape: 'oval', color: '#ecab37', desc: 'จุดเริ่มต้นหรือสิ้นสุดการทำงานของผังงาน' },
        { id: 'f2', name: 'Process', shape: 'rectangle', color: '#3d4f97', desc: 'การประมวลผล คำนวณ หรือกำหนดค่าข้อมูล' },
        { id: 'f3', name: 'Decision', shape: 'diamond', color: '#f68d1f', desc: 'การตัดสินใจ หรือการตรวจสอบเงื่อนไข' },
        { id: 'f4', name: 'Manual Input', shape: 'trapezoid', color: '#acace7', desc: 'รับข้อมูลเข้าทางคีย์บอร์ดโดยผู้ใช้' }
      ]
    },
    3: {
      title: 'ด่านที่ 3: เรียงลำดับขั้นตอนแปรงฟัน (ระดับ ป.4)',
      gradeTag: 'ป.4',
      instructions: 'กดปุ่ม ▲ ขึ้น หรือ ▼ ลง เพื่อเรียงลำดับขั้นตอนการแปรงฟันให้ถูกต้องตั้งแต่เริ่มต้นจนสิ้นสุด',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. บีบยาสีฟันลงบนแปรง', shape: 'rectangle' },
        { id: 3, text: '3. แปรงฟันให้สะอาด 2 นาที', shape: 'rectangle' },
        { id: 4, text: '4. บ้วนปากด้วยน้ำสะอาด', shape: 'rectangle' },
        { id: 5, text: '5. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    },
    4: {
      title: 'ด่านที่ 4: ทดสอบความไวเชิงตรรกะ (ระดับ ป.4)',
      gradeTag: 'ป.4',
      instructions: 'อ่านโจทย์สัญลักษณ์แล้วเลือกคำตอบที่ถูกต้องก่อนเวลาหมด!',
      questions: [
        { q: 'สัญลักษณ์รูปข้าวหลามตัด (Diamond) หมายถึงอะไร?', options: ['การประมวลผล', 'การตัดสินใจ / เงื่อนไข', 'จุดเริ่มต้น', 'การป้อนข้อมูล'], correct: 1 },
        { q: 'สัญลักษณ์วงกลม (Circle) มีไว้ใช้ทำอะไร?', options: ['จุดเชื่อมต่อผังงาน', 'ต้มบะหมี่', 'แสดงผลทางจอภาพ', 'จบผังงาน'], correct: 0 },
        { q: 'ลูกศรทิศทาง (Flow Line) ทำหน้าที่อะไร?', options: ['กำหนดราคา', 'บอกทิศทางการทำงาน', 'ลบข้อมูล', 'หยุดทำงาน'], correct: 1 }
      ]
    },
    5: {
      title: 'ด่านที่ 5: การเลือกสัญลักษณ์ตามโจทย์ (ระดับ ป.5)',
      gradeTag: 'ป.5',
      instructions: 'เลือกสัญลักษณ์ Flowchart ที่ถูกต้องสำหรับสถานการณ์แต่ละข้อ',
      items: [
        { id: 'c1', label: 'หน้าจอแสดงผลตัวเลขอุณหภูมิห้อง', shape: 'display', options: ['oval', 'display', 'rectangle'], correct: 'display' },
        { id: 'c2', label: 'จุดรวมทางเดินนัดพบหลังเคารพธงชาติ', shape: 'circle', options: ['diamond', 'circle', 'trapezoid'], correct: 'circle' },
        { id: 'c3', label: 'คำนวณราคาขายสินค้า = ราคาทุน + กำไร', shape: 'rectangle', options: ['rectangle', 'display', 'oval'], correct: 'rectangle' }
      ]
    },
    6: {
      title: 'ด่านที่ 6: ผังงานการต้มบะหมี่สำเร็จรูป (ระดับ ป.5)',
      gradeTag: 'ป.5',
      instructions: 'เรียงลำดับผังงานการต้มบะหมี่ให้ถูกต้องตั้งแต่เริ่มต้น เงื่อนไขต้ม 3 นาที จนถึงใส่ชามพร้อมทาน',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. ต้มน้ำในหม้อให้เดือด', shape: 'rectangle' },
        { id: 3, text: '3. ใส่บะหมี่และเครื่องปรุงลงหม้อ', shape: 'rectangle' },
        { id: 4, text: '4. ต้มครบ 3 นาทีหรือไม่? (Decision)', shape: 'diamond' },
        { id: 5, text: '5. เทใส่ชามพร้อมรับประทาน', shape: 'rectangle' },
        { id: 6, text: '6. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    },
    7: {
      title: 'ด่านที่ 7: ผังงานระบบถอนเงินตู้ ATM (ระดับ ป.5)',
      gradeTag: 'ป.5',
      instructions: 'เรียงลำดับขั้นตอนระบบถอนเงินตู้ ATM ให้ถูกต้องสมบูรณ์',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. เสียบบัตร & กรอกรหัส PIN', shape: 'trapezoid' },
        { id: 3, text: '3. ตรวจสอบรหัสผ่านถูกต้องหรือไม่?', shape: 'diamond' },
        { id: 4, text: '4. หักยอดเงินในบัญชี', shape: 'rectangle' },
        { id: 5, text: '5. จ่ายเงินสด & พิมพ์สลิป', shape: 'display' },
        { id: 6, text: '6. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    },
    8: {
      title: 'ด่านที่ 8: ผังงานตรวจดัชนีมวลกาย BMI (ระดับ ป.5)',
      gradeTag: 'ป.5',
      instructions: 'เรียงลำดับการคำนวณและประเมินค่า BMI ของร่างกาย',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. รับค่า น้ำหนัก (kg) และ ส่วนสูง (m)', shape: 'trapezoid' },
        { id: 3, text: '3. คำนวณ BMI = น้ำหนัก / (ส่วนสูง × ส่วนสูง)', shape: 'rectangle' },
        { id: 4, text: '4. BMI > 23 หรือไม่? (เกณฑ์เริ่มอ้วน)', shape: 'diamond' },
        { id: 5, text: '5. แสดงผลการประเมินทางหน้าจอ', shape: 'display' },
        { id: 6, text: '6. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    },
    9: {
      title: 'ด่านที่ 9: ผังงานระบบยืนยันตัวตน เข้าสู่ระบบ (ระดับ ม.1)',
      gradeTag: 'ม.1',
      instructions: 'เรียงลำดับผังงานการตรวจสอบสิทธิ์การใช้งานและการล็อกอิน',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. กรอก Username และ Password', shape: 'trapezoid' },
        { id: 3, text: '3. ค้นหาผู้ใช้ในฐานข้อมูล', shape: 'rectangle' },
        { id: 4, text: '4. ชื่อและรหัสผ่านถูกต้องหรือไม่?', shape: 'diamond' },
        { id: 5, text: '5. เข้าสู่ระบบสำเร็จ แสดงหน้าต้อนรับ', shape: 'display' },
        { id: 6, text: '6. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    },
    10: {
      title: 'ด่านที่ 10: ผังงานการตัดสินใจเดินทางไปโรงเรียน (ระดับ ม.1)',
      gradeTag: 'ม.1',
      instructions: 'เรียงลำดับผังงานการตัดสินใจเลือกพาหนะตามสภาพอากาศ',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. สังเกตสภาพอากาศนอกบ้าน', shape: 'rectangle' },
        { id: 3, text: '3. ฝนตกหรือไม่? (Decision)', shape: 'diamond' },
        { id: 4, text: '4. พกร่ม และขึ้นรถประจำทาง', shape: 'rectangle' },
        { id: 5, text: '5. ถึงโรงเรียนอย่างปลอดภัย', shape: 'display' },
        { id: 6, text: '6. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    }
  };

  const currentLevel = LEVEL_DATA[levelNum] || LEVEL_DATA[1];

  useEffect(() => {
    if ([3, 6, 7, 8, 9, 10].includes(levelNum)) {
      const steps = [...(currentLevel.steps || [])];
      setSequenceOrder(steps.sort(() => Math.random() - 0.5));
    }
  }, [levelNum]);

  // LEVEL 1: Matching Names
  const handleL1TargetClick = (targetId) => {
    if (!l1SelectedNameId) {
      Swal.fire({ icon: 'info', title: 'คำแนะนำ', text: 'กรุณาแตะเลือก "ชื่อสัญลักษณ์" ทางซ้ายมือก่อนครับ', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    SoundEngine.playClick();
    setL1Selections(prev => ({ ...prev, [targetId]: l1SelectedNameId }));
  };

  const checkLevel1 = () => {
    const items = LEVEL_DATA[1].items;
    let count = 0;
    items.forEach(item => {
      if (l1Selections[item.id] === item.id) count++;
    });

    if (count === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(1, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ยังไม่ถูกต้อง', text: `คุณจับคู่ถูก ${count} จาก ${items.length} ข้อ ลองใหม่อีกครั้งครับ!`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // LEVEL 2: Matching Descs
  const handleL2TargetClick = (targetId) => {
    if (!l2SelectedDescId) {
      Swal.fire({ icon: 'info', title: 'คำแนะนำ', text: 'กรุณาแตะเลือก "คำอธิบายหน้าที่" ทางซ้ายมือก่อนครับ', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    SoundEngine.playClick();
    setL2Selections(prev => ({ ...prev, [targetId]: l2SelectedDescId }));
  };

  const checkLevel2 = () => {
    const items = LEVEL_DATA[2].items;
    let count = 0;
    items.forEach(item => {
      if (l2Selections[item.id] === item.id) count++;
    });

    if (count === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(2, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ยังไม่ถูกต้อง', text: `คุณจับคู่ถูก ${count} จาก ${items.length} ข้อ ลองอีกครั้งครับ!`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // SEQUENCE LEVELS (3, 6, 7, 8, 9, 10)
  const moveSequenceStep = (index, direction) => {
    const newArr = [...sequenceOrder];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    SoundEngine.playClick();
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setSequenceOrder(newArr);
  };

  const checkSequenceLevel = (lvlId) => {
    let isCorrect = true;
    for (let i = 0; i < sequenceOrder.length; i++) {
      if (sequenceOrder[i].id !== i + 1) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      SoundEngine.playCorrect();
      onFinishLevel(lvlId, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ลำดับยังไม่ถูกต้อง', text: 'ลองสังเกตตัวเลขลำดับและคำอธิบาย แล้วจัดเรียงใหม่อีกครั้งครับ!', customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // QUIZ LEVEL (4)
  const handleQuizAnswer = (selectedOpt) => {
    const qData = LEVEL_DATA[4].questions[quizIdx];
    if (selectedOpt === qData.correct) {
      SoundEngine.playCorrect();
      if (quizIdx + 1 < LEVEL_DATA[4].questions.length) {
        setQuizIdx(prev => prev + 1);
        setQuizTimeLeft(15);
      } else {
        onFinishLevel(4, 100, 3);
      }
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ตอบผิดครับ!', text: 'ลองเลือกคำตอบข้อใหม่อีกครั้ง', customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // LEVEL 5: Option selection
  const handleL5Choice = (itemId, shapeChoice) => {
    SoundEngine.playClick();
    setL5Selections(prev => ({ ...prev, [itemId]: shapeChoice }));
  };

  const checkLevel5 = () => {
    const items = LEVEL_DATA[5].items;
    let correctCount = 0;
    items.forEach(it => {
      if (l5Selections[it.id] === it.correct) correctCount++;
    });

    if (correctCount === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(5, 100, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'error', title: 'ตอบถูกไม่ครบ!', text: `คุณตอบถูก ${correctCount} จาก ${items.length} ข้อ ลองเลือกรูปทรงที่เหมาะสมอีกครั้งครับ`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  return (
    <section className="screen-view">
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn-y2k btn-carbon btn-sm" onClick={onBackToMap}>
          ◀ กลับหน้าแผนที่ด่าน
        </button>
        <span className="status-badge ready" style={{ fontSize: '12px' }}>
          สายชั้น: {currentLevel.gradeTag || 'ป.4'}
        </span>
      </div>

      <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)' }}>
        <h2 className="hero-display-title">{currentLevel.title}</h2>
        <p style={{ fontSize: '13px', color: '#ffffff', marginTop: '4px' }}>
          {currentLevel.instructions}
        </p>
      </div>

      {/* LEVEL 1 VIEW */}
      {levelNum === 1 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>1. แตะเลือกชื่อสัญลักษณ์:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LEVEL_DATA[1].items.map(item => (
                  <button
                    key={item.id}
                    className={`btn-y2k ${l1SelectedNameId === item.id ? 'btn-amber active' : 'btn-carbon'}`}
                    onClick={() => { SoundEngine.playClick(); setL1SelectedNameId(item.id); }}
                    style={{ textAlign: 'left', fontSize: '12px' }}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>2. วางลงในการ์ดรูปทรง:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {LEVEL_DATA[1].items.map(item => {
                  const assignedId = l1Selections[item.id];
                  const assignedItem = LEVEL_DATA[1].items.find(x => x.id === assignedId);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleL1TargetClick(item.id)}
                      style={{
                        padding: '10px',
                        border: '2px dashed var(--chrome-indigo)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#f8fafc'
                      }}
                    >
                      {getSymbolSVG(item.shape, item.color, '', 90, 45)}
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: assignedItem ? 'var(--signal)' : '#94a3b8' }}>
                        {assignedItem ? assignedItem.name : 'แตะเพื่อวางชื่อที่นี่...'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkLevel1}>
              ✓ ตรวจคำตอบด่านที่ 1
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 2 VIEW */}
      {levelNum === 2 && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>1. เลือกคำอธิบายหน้าที่:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LEVEL_DATA[2].items.map(item => (
                  <button
                    key={item.id}
                    className={`btn-y2k ${l2SelectedDescId === item.id ? 'btn-amber active' : 'btn-carbon'}`}
                    onClick={() => { SoundEngine.playClick(); setL2SelectedDescId(item.id); }}
                    style={{ textAlign: 'left', fontSize: '12px', lineHeight: 1.4 }}
                  >
                    • {item.desc}
                  </button>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>2. วางลงในสัญลักษณ์:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {LEVEL_DATA[2].items.map(item => {
                  const assignedId = l2Selections[item.id];
                  const assignedItem = LEVEL_DATA[2].items.find(x => x.id === assignedId);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleL2TargetClick(item.id)}
                      style={{
                        padding: '10px',
                        border: '2px dashed var(--amber)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#fffbe6'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getSymbolSVG(item.shape, item.color, item.name, 90, 45)}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: assignedItem ? 'var(--signal)' : '#94a3b8', maxWidth: '180px', textAlign: 'right' }}>
                        {assignedItem ? assignedItem.desc : 'แตะวางคำอธิบายที่นี่...'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkLevel2}>
              ✓ ตรวจคำตอบด่านที่ 2
            </button>
          </div>
        </div>
      )}

      {/* SEQUENCE LEVELS (3, 6, 7, 8, 9, 10) */}
      {[3, 6, 7, 8, 9, 10].includes(levelNum) && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="content-card" style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
              กดปุ่ม ▲ / ▼ เพื่อจัดเรียงขั้นตอนผังงานให้ถูกต้อง:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sequenceOrder.map((step, idx) => (
                <div
                  key={step.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: '#ffffff',
                    border: '2px solid #cbd5e1',
                    borderRadius: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getSymbolSVG(step.shape || 'rectangle', '#3d4f97', '', 40, 24)}
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>{step.text}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-y2k btn-carbon btn-sm"
                      onClick={() => moveSequenceStep(idx, -1)}
                      disabled={idx === 0}
                      style={{ opacity: idx === 0 ? 0.4 : 1 }}
                    >
                      ▲ ขึ้น
                    </button>
                    <button
                      className="btn-y2k btn-carbon btn-sm"
                      onClick={() => moveSequenceStep(idx, 1)}
                      disabled={idx === sequenceOrder.length - 1}
                      style={{ opacity: idx === sequenceOrder.length - 1 ? 0.4 : 1 }}
                    >
                      ▼ ลง
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={() => checkSequenceLevel(levelNum)}>
              ✓ ตรวจลำดับผังงานด่านที่ {levelNum}
            </button>
          </div>
        </div>
      )}

      {/* LEVEL 4: TIMED QUIZ */}
      {levelNum === 4 && (
        <div style={{ maxWidth: '550px', margin: '0 auto' }}>
          <div className="content-card" style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{ fontSize: '13px', color: 'var(--systems-teal)', fontWeight: 'bold', marginBottom: '8px' }}>
              ข้อที่ {quizIdx + 1} จาก {LEVEL_DATA[4].questions.length}
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>
              {LEVEL_DATA[4].questions[quizIdx].q}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {LEVEL_DATA[4].questions[quizIdx].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  className="btn-y2k btn-amber"
                  onClick={() => handleQuizAnswer(oIdx)}
                  style={{ padding: '12px', fontSize: '14px', textAlign: 'center' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL 5: SCENARIO SYMBOL CHOICE */}
      {levelNum === 5 && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {LEVEL_DATA[5].items.map((item, idx) => (
              <div key={item.id} className="content-card" style={{ background: '#ffffff', borderRadius: '10px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', marginBottom: '10px' }}>
                  ข้อ {idx + 1}: {item.label}
                </h4>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {item.options.map(sh => (
                    <button
                      key={sh}
                      className={`btn-y2k ${l5Selections[item.id] === sh ? 'btn-amber active' : 'btn-carbon'}`}
                      onClick={() => handleL5Choice(item.id, sh)}
                      style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      {getSymbolSVG(sh, '#3d4f97', '', 40, 24)}
                      <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{sh}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkLevel5}>
              ✓ ตรวจคำตอบด่านที่ 5
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
