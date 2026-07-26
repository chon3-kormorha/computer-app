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
  // Level 1 State
  const [l1SelectedNameId, setL1SelectedNameId] = useState(null);
  const [l1Selections, setL1Selections] = useState({});

  // Level 2 State
  const [l2SelectedDescId, setL2SelectedDescId] = useState(null);
  const [l2Selections, setL2Selections] = useState({});

  // Level 3 State
  const [l3Order, setL3Order] = useState([]);

  // Level 4 State
  const [l4Idx, setL4Idx] = useState(0);
  const [l4TimeLeft, setL4TimeLeft] = useState(15);

  // Level 5 State
  const [l5Selections, setL5Selections] = useState({});

  const LEVEL_DATA = {
    1: {
      title: 'ด่านที่ 1: จับคู่ชื่อสัญลักษณ์กับรูปทรง',
      instructions: 'คลิกเลือก “ชื่อสัญลักษณ์” ทางซ้าย แล้วแตะการ์ดรูปทรงทางขวาเพื่อวางชื่อให้ถูกต้อง',
      items: [
        { id: 's1', name: 'Start / Stop (จุดเริ่มต้น / จุดสิ้นสุด)', shape: 'oval', color: '#ecab37' },
        { id: 's2', name: 'Process (การทำงาน / การคำนวณ)', shape: 'rectangle', color: '#3d4f97' },
        { id: 's3', name: 'Decision (การตัดสินใจ / เช็กเงื่อนไข)', shape: 'diamond', color: '#f68d1f' },
        { id: 's4', name: 'Flow Line (ลูกศรบอกทิศทาง)', shape: 'arrow', color: '#206479' }
      ]
    },
    2: {
      title: 'ด่านที่ 2: จับคู่สัญลักษณ์กับหน้าที่การทำงาน',
      instructions: 'เลือกหน้าที่การทำงานทางซ้าย แล้วแตะวางลงในการ์ดสัญลักษณ์ทางขวาให้ถูกต้อง',
      items: [
        { id: 'f1', name: 'Start / Stop', shape: 'oval', color: '#ecab37', desc: 'จุดเริ่มต้นหรือสิ้นสุดการทำงานของผังงาน' },
        { id: 'f2', name: 'Process', shape: 'rectangle', color: '#3d4f97', desc: 'การประมวลผล คำนวณ หรือกำหนดค่าข้อมูล' },
        { id: 'f3', name: 'Decision', shape: 'diamond', color: '#f68d1f', desc: 'การตัดสินใจ หรือการตรวจสอบเงื่อนไข' },
        { id: 'f4', name: 'Manual Input', shape: 'trapezoid', color: '#acace7', desc: 'รับข้อมูลเข้าทางคีย์บอร์ดโดยผู้ใช้' }
      ]
    },
    3: {
      title: 'ด่านที่ 3: เรียงลำดับขั้นตอนอัลกอริทึม (Flowchart Sequence)',
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
      title: 'ด่านที่ 4: ทดสอบความไว (จับเวลา 15 วินาทีต่อข้อ)',
      instructions: 'อ่านโจทย์สัญลักษณ์แล้วเลือกคำตอบที่ถูกต้องก่อนเวลาหมด!',
      questions: [
        { q: 'สัญลักษณ์รูปข้าวหลามตัด (Diamond) หมายถึงอะไร?', options: ['การประมวลผล', 'การตัดสินใจ / เงื่อนไข', 'จุดเริ่มต้น', 'การป้อนข้อมูล'], correct: 1 },
        { q: 'สัญลักษณ์วงกลม (Circle) มีไว้ใช้ทำอะไร?', options: ['เชื่อมต่อผังงาน', 'ต้มบะหมี่', 'แสดงผลทางจอภาพ', 'จบผังงาน'], correct: 0 },
        { q: 'ลูกศรทิศทาง (Flow Line) ทำหน้าที่อะไร?', options: ['กำหนดราคา', 'บอกทิศทางการทำงาน', 'ลบข้อมูล', 'หยุดทำงาน'], correct: 1 }
      ]
    },
    5: {
      title: 'ด่านที่ 5: Mini Challenge (ระบบกดเงิน ATM)',
      instructions: 'เรียงลำดับบล็อกผังงานระบบตู้ ATM ให้ถูกต้องสมบูรณ์',
      blocks: [
        { id: 'b1', title: 'เริ่มต้น (Start)', shape: 'oval' },
        { id: 'b2', title: 'เสียบบัตร & กรอก PIN', shape: 'trapezoid' },
        { id: 'b3', title: 'ตรวจสอบรหัสผ่าน', shape: 'diamond' },
        { id: 'b4', title: 'จ่ายเงินสด & สลิป', shape: 'display' },
        { id: 'b5', title: 'สิ้นสุด (Stop)', shape: 'oval' }
      ]
    }
  };

  useEffect(() => {
    if (levelNum === 3) {
      const steps = [...LEVEL_DATA[3].steps];
      setL3Order(steps.sort(() => Math.random() - 0.5));
    }
  }, [levelNum]);

  // Level 1 Target Click
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
      Swal.fire({ icon: 'warning', title: 'ลองใหม่อีกครั้ง!', text: `คุณตอบถูกต้อง ${count} จาก ${items.length} ข้อครับ`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // Level 2 Handlers
  const handleL2TargetClick = (targetSymbolId) => {
    if (!l2SelectedDescId) {
      Swal.fire({ icon: 'info', title: 'คำแนะนำ', text: 'กรุณาแตะเลือก "หน้าที่การทำงาน" ทางซ้ายมือก่อนครับ', customClass: { popup: 'swal-y2k-popup' } });
      return;
    }
    SoundEngine.playClick();
    setL2Selections(prev => ({ ...prev, [targetSymbolId]: l2SelectedDescId }));
  };

  const checkLevel2 = () => {
    const items = LEVEL_DATA[2].items;
    let count = 0;
    items.forEach(item => {
      if (l2Selections[item.id] === item.id) count++;
    });

    if (count === items.length) {
      SoundEngine.playCorrect();
      onFinishLevel(2, 120, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'warning', title: 'ทบทวนอีกครั้ง!', text: `คุณจับคู่ถูกต้อง ${count} จาก ${items.length} ข้อครับ`, customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  // Level 3 Handlers
  const moveL3Step = (idx, dir) => {
    SoundEngine.playClick();
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= l3Order.length) return;
    const next = [...l3Order];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setL3Order(next);
  };

  const checkLevel3 = () => {
    let isCorrect = true;
    for (let i = 0; i < l3Order.length; i++) {
      if (l3Order[i].id !== i + 1) {
        isCorrect = false;
        break;
      }
    }
    if (isCorrect) {
      SoundEngine.playCorrect();
      onFinishLevel(3, 150, 3);
    } else {
      SoundEngine.playWrong();
      Swal.fire({ icon: 'warning', title: 'ลองสลับตำแหน่งอีกครั้ง!', text: 'สังเกตจุดเริ่มต้น (Start) และจุดสิ้นสุด (Stop) ให้ดีนะครับ', customClass: { popup: 'swal-y2k-popup' } });
    }
  };

  return (
    <section className="screen-view">
      <div style={{ marginBottom: '12px' }}>
        <button className="btn-y2k btn-carbon btn-sm" onClick={onBackToMap}>
          ◀ ออกจากด่าน
        </button>
      </div>

      <div className="game-progress-header">
        <div>
          <strong style={{ color: 'var(--nav-gold)' }}>{LEVEL_DATA[levelNum].title}</strong>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>
            ผู้เล่น: {student?.name || 'นักเรียน'} ({student?.grade || 'ป.4/1'})
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="star-rating">★ ★ ★</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--amber)' }}>ด่านที่ {levelNum}</div>
        </div>
      </div>

      <div className="inset-panel" style={{ marginBottom: '16px' }}>
        <span style={{ color: 'var(--signal)', fontWeight: 'bold' }}>💡 คำอธิบาย:</span> {LEVEL_DATA[levelNum].instructions}
      </div>

      {/* LEVEL 1 VIEW */}
      {levelNum === 1 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px', alignItems: 'start' }}>
            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--carbon)', fontSize: '15px' }}>🏷️ 1. เลือกชื่อสัญลักษณ์:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {LEVEL_DATA[1].items.map(item => (
                  <div
                    key={item.id}
                    className="btn-y2k btn-amber"
                    onClick={() => { SoundEngine.playClick(); setL1SelectedNameId(item.id); }}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: '13px',
                      outline: l1SelectedNameId === item.id ? '3px solid var(--primary)' : 'none'
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--carbon)', fontSize: '15px' }}>📐 2. วางลงในการ์ดสัญลักษณ์:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {LEVEL_DATA[1].items.map(item => {
                  const assignedId = l1Selections[item.id];
                  const assignedItem = LEVEL_DATA[1].items.find(i => i.id === assignedId);
                  const shortLabel = assignedItem ? assignedItem.name.split(' ')[0] : '';

                  return (
                    <div
                      key={item.id}
                      className={`flowchart-symbol-card ${assignedId ? 'selected' : ''}`}
                      onClick={() => handleL1TargetClick(item.id)}
                      style={{
                        padding: '16px 10px',
                        borderColor: assignedId ? '#15803d' : 'var(--chrome-indigo)',
                        background: assignedId ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div className="svg-shape-wrapper">
                        {getSymbolSVG(item.shape, item.color, shortLabel, 120, 60)}
                      </div>
                      <div
                        className="l1-assigned-name"
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: assignedId ? '#15803d' : '#64748b',
                          marginTop: '8px',
                          background: assignedId ? '#dcfce7' : '#f1f5f9',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}
                      >
                        {assignedItem ? `✓ ${assignedItem.name}` : '[ แตะวางชื่อ ]'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkLevel1}>
              ตรวจคำตอบด่านที่ 1 ➔
            </button>
          </div>
        </>
      )}

      {/* LEVEL 2 VIEW */}
      {levelNum === 2 && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '16px', alignItems: 'start' }}>
            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--carbon)', fontSize: '15px' }}>📜 1. แตะเลือกหน้าที่การทำงาน:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {LEVEL_DATA[2].items.map(item => (
                  <div
                    key={item.id}
                    className="btn-y2k btn-amber"
                    onClick={() => { SoundEngine.playClick(); setL2SelectedDescId(item.id); }}
                    style={{
                      textAlign: 'left',
                      padding: '12px 14px',
                      fontSize: '13px',
                      lineHeight: 1.4,
                      outline: l2SelectedDescId === item.id ? '3px solid var(--primary)' : 'none'
                    }}
                  >
                    📌 {item.desc}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '10px', color: 'var(--carbon)', fontSize: '15px' }}>📐 2. แตะสัญลักษณ์เพื่อวางหน้าที่:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {LEVEL_DATA[2].items.map(item => {
                  const assignedId = l2Selections[item.id];
                  const assignedItem = LEVEL_DATA[2].items.find(i => i.id === assignedId);

                  return (
                    <div
                      key={item.id}
                      className={`flowchart-symbol-card ${assignedId ? 'selected' : ''}`}
                      onClick={() => handleL2TargetClick(item.id)}
                      style={{
                        padding: '16px 10px',
                        borderColor: assignedId ? '#15803d' : 'var(--chrome-indigo)',
                        background: assignedId ? '#f0fdf4' : '#ffffff'
                      }}
                    >
                      <div className="svg-shape-wrapper">
                        {getSymbolSVG(item.shape, item.color, item.name, 120, 60)}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: assignedId ? '#15803d' : '#64748b',
                          marginTop: '8px',
                          background: assignedId ? '#dcfce7' : '#f1f5f9',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          textAlign: 'center'
                        }}
                      >
                        {assignedItem ? `✓ ${assignedItem.desc}` : '[ แตะวางหน้าที่ ]'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkLevel2}>
              ส่งคำตอบด่านที่ 2 ➔
            </button>
          </div>
        </>
      )}

      {/* LEVEL 3 VIEW */}
      {levelNum === 3 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {l3Order.map((step, idx) => (
              <div key={step.id} className="content-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#ffffff', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span className="btn-y2k btn-amber btn-sm" style={{ fontSize: '14px', fontWeight: 'bold', width: '32px', height: '32px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</span>
                  {getSymbolSVG(step.shape, step.shape === 'oval' ? '#ecab37' : '#3d4f97', step.text, 180, 50)}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-y2k btn-carbon btn-sm" onClick={() => moveL3Step(idx, -1)} disabled={idx === 0}>▲ ขึ้น</button>
                  <button className="btn-y2k btn-carbon btn-sm" onClick={() => moveL3Step(idx, 1)} disabled={idx === l3Order.length - 1}>▼ ลง</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button className="btn-y2k btn-signal btn-lg" onClick={checkLevel3}>
              ตรวจสอบลำดับ Flowchart ➔
            </button>
          </div>
        </>
      )}

      {/* LEVEL 4 & 5 VIEWS */}
      {(levelNum === 4 || levelNum === 5) && (
        <div style={{ textAlign: 'center', padding: '30px', background: '#ffffff', borderRadius: '12px', border: '2px solid var(--chrome-indigo)' }}>
          <h3>🎉 พร้อมลุยด่านที่ {levelNum}!</h3>
          <p style={{ margin: '12px 0', fontSize: '14px', color: '#475569' }}>ทดสอบความเข้าใจผังงานคำนวณเรียบร้อยแล้ว</p>
          <button className="btn-y2k btn-signal btn-lg" onClick={() => { SoundEngine.playCorrect(); onFinishLevel(levelNum, 200, 3); }}>
            ส่งคำตอบด่านที่ {levelNum} ➔
          </button>
        </div>
      )}
    </section>
  );
}
