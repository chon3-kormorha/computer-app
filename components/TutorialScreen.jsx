'use client';

import React, { useState } from 'react';
import { SoundEngine } from '../lib/audio';

export default function TutorialScreen({ onGoToMap, onOpenCertificate }) {
  const [activeTab, setActiveTab] = useState('tab-flowchart');

  const switchTab = (tabId) => {
    SoundEngine.playClick();
    setActiveTab(tabId);
  };

  return (
    <section className="screen-view">
      <div
        className="hero-panel"
        style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #1e5f74 100%)', color: '#ffffff' }}
      >
        <h2 className="hero-display-title">📚 คลังความรู้วิชาวิทยาการคำนวณ (ป.4 - ป.5)</h2>
        <p style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '6px', lineHeight: 1.5 }}>
          💡 หลักสูตรสาระเทคโนโลยี (วิทยาการคำนวณ) มุ่งเน้นการยกระดับขีดความสามารถให้ผู้เรียนคิดแก้ปัญหาอย่างเป็นระบบ
          ตามคู่มือการจัดการเรียนรู้ สสวท. โรงเรียนบ้าน กม.ห้า
        </p>
      </div>

      {/* TUTORIAL TABS NAVIGATION */}
      <div className="tutorial-nav-container">
        <button
          className={`btn-y2k tutorial-tab-btn ${activeTab === 'tab-flowchart' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => switchTab('tab-flowchart')}
        >
          🔷 1. สัญลักษณ์ Flowchart (8 สัญลักษณ์)
        </button>
        <button
          className={`btn-y2k tutorial-tab-btn ${activeTab === 'tab-thinking' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => switchTab('tab-thinking')}
        >
          🧠 2. การคิดเชิงคำนวณ (4 ด้าน)
        </button>
        <button
          className={`btn-y2k tutorial-tab-btn ${activeTab === 'tab-curriculum' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => switchTab('tab-curriculum')}
        >
          📘 3. สรุปเนื้อหา ป.4 & ป.5
        </button>
        <button
          className={`btn-y2k tutorial-tab-btn ${activeTab === 'tab-safety' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => switchTab('tab-safety')}
        >
          🛡️ 4. ไอทีปลอดภัย & ไซเบอร์
        </button>
        <button
          className={`btn-y2k tutorial-tab-btn ${activeTab === 'tab-real-flowchart' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => switchTab('tab-real-flowchart')}
        >
          📊 5. ผังงานตัวอย่างแบบจริง
        </button>
        <button
          className={`btn-y2k tutorial-tab-btn ${activeTab === 'tab-rules' ? 'btn-amber active' : 'btn-carbon'}`}
          onClick={() => switchTab('tab-rules')}
        >
          ⚡ 6. กฎเหล็ก & เกณฑ์ประเมิน
        </button>
      </div>

      {/* TAB 1: FLOWCHART SYMBOLS */}
      {activeTab === 'tab-flowchart' && (
        <>
          <div
            style={{
              background: 'rgba(236,171,55,0.15)',
              border: '2px dashed #ecab37',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '13px',
              color: '#6b4400',
              fontWeight: '600'
            }}
          >
            🏡 <strong>พี่วิทยาการคำนวณบอกน้องๆ:</strong> สัญลักษณ์ Flowchart เปรียบเสมือน <strong>"ป้ายจราจรบอกทางชีวิตประจำวัน"</strong> ช่วยให้เราวางแผนการทำงานและแก้ปัญหาได้อย่างเป็นขั้นตอน!
          </div>

          <div className="symbol-grid">
            <div className="symbol-card" style={{ borderTop: '4px solid #ecab37' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <rect x="5" y="5" width="110" height="50" rx="25" fill="#ecab37" stroke="#ffffff" strokeWidth="4" />
                  <text x="60" y="35" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Start / Stop</text>
                </svg>
              </div>
              <h4 className="symbol-title">จุดเริ่มต้น / จุดสิ้นสุด (Terminal) 🏁</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> วงรี / สี่เหลี่ยมขอบมน (Oval)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> จุดเริ่มต้นออกตัว หรือ จุดสิ้นสุดผังงาน</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> จุดเริ่ม "ตื่นนอน 6 โมงเช้า" หรือ "เข้านอน"</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #3d4f97' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <rect x="5" y="5" width="110" height="50" rx="6" fill="#3d4f97" stroke="#ffffff" strokeWidth="4" />
                  <text x="60" y="35" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">Process</text>
                </svg>
              </div>
              <h4 className="symbol-title">การปฏิบัติงาน (Process) ⚙️</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> สี่เหลี่ยมผืนผ้า (Rectangle)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> ขั้นตอนการลงมือทำ การคำนวณ หรือการแปรรูป</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> "ถูสบู่ 20 วินาที" หรือ "ต้มน้ำให้เดือด"</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #f68d1f' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <polygon points="60,2 118,30 60,58 2,30" fill="#f68d1f" stroke="#ffffff" strokeWidth="4" />
                  <text x="60" y="35" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Decision</text>
                </svg>
              </div>
              <h4 className="symbol-title">การตัดสินใจ (Decision) ❓</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> สี่เหลี่ยมข้าวหลามตัด (Diamond)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> จุดแยกตัดสินใจ เช็กเงื่อนไข (ใช่ / ไม่ใช่)</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> "ฝนตกไหม?" ➔ ใช่: กางร่ม / ไม่ใช่: เดินต่อ</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #acace7' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <polygon points="20,5 115,5 95,55 5,55" fill="#acace7" stroke="#ffffff" strokeWidth="4" />
                  <text x="60" y="35" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Manual Input</text>
                </svg>
              </div>
              <h4 className="symbol-title">ป้อนข้อมูลด้วยตนเอง (Manual Input) ⌨️</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> สี่เหลี่ยมคางหมู (Trapezoid)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> รับข้อมูลผ่านคีย์บอร์ดหรือการพิมพ์มือ</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> กรอกรหัส PIN ตู้ ATM หรือกดเบอร์โทรศัพท์</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #8ba1d4' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <path d="M5 5 L95 5 C115 5 115 55 95 55 L5 55 Q25 30 5 5 Z" fill="#8ba1d4" stroke="#ffffff" strokeWidth="4" />
                  <text x="55" y="35" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Display</text>
                </svg>
              </div>
              <h4 className="symbol-title">แสดงผลบนหน้าจอ (Display) 📺</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> รูปทรงจอภาพ (Display)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> ฉายข้อความหรือภาพให้เรามองเห็นบนจอภาพ</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> หน้าจอแสดงตัวเลขอุณหภูมิ หรือ บอร์ดแสดงคะแนน</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #206479' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <polygon points="25,5 115,5 95,55 5,55" fill="#206479" stroke="#ffffff" strokeWidth="4" />
                  <text x="60" y="35" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Input / Output</text>
                </svg>
              </div>
              <h4 className="symbol-title">รับเข้า / ส่งออกข้อมูล (Input/Output) 📦</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> สี่เหลี่ยมด้านขนาน (Parallelogram)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> การยื่นส่งหรือรับวัตถุ/ข้อมูลทั่วไป</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> ยื่นเงิน 20 บาทให้แม่ค้า ➔ รับขนมกลับมา</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #e60012' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <circle cx="60" cy="30" r="22" fill="#e60012" stroke="#ffffff" strokeWidth="4" />
                  <text x="60" y="35" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Connect</text>
                </svg>
              </div>
              <h4 className="symbol-title">จุดเชื่อมต่อ (Connector) 🔴</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> วงกลม (Circle)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> จุดรวมเส้นทางผังงานเหมือนจุดนัดพบ</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> จุดรวมทางเดินของนักเรียนหลังเข้าแถวเคารพธงชาติ</div>
            </div>

            <div className="symbol-card" style={{ borderTop: '4px solid #21242e' }}>
              <div className="symbol-svg-wrapper">
                <svg viewBox="0 0 120 60" style={{ width: '100px', height: '50px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>
                  <path d="M10 30 L90 30 M75 15 L95 30 L75 45" fill="none" stroke="#21242e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h4 className="symbol-title">เส้นทิศทาง (Flow Line) ➡️</h4>
              <p className="symbol-detail"><strong>รูปทรง:</strong> เส้นตรงมีหัวลูกศร (Arrow Line)</p>
              <p className="symbol-detail"><strong>หน้าที่:</strong> ชี้บอกทิศทางการทำงานไปยังขั้นตอนถัดไป</p>
              <div className="symbol-example-box">💡 <strong>ตัวอย่างชีวิตจริง:</strong> ป้ายลูกศรบอกทางเดินขึ้นอาคารเรียน</div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: COMPUTATIONAL THINKING */}
      {activeTab === 'tab-thinking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: 'rgba(61,79,151,0.12)',
              border: '2px dashed #3d4f97',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              color: '#1e2c60',
              fontWeight: '600'
            }}
          >
            🧠 <strong>"การคิดเชิงคำนวณ" (Computational Thinking)</strong> คือ 4 หัวใจสำคัญในการแก้ปัญหาชีวิตประจำวัน ไม่ว่าจะเป็นเรื่องเรียน งานบ้าน หรือการเล่นเกม!
          </div>

          <div className="content-card" style={{ borderLeft: '6px solid #3d4f97' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              1. การย่อยปัญหา (Decomposition) 🧩
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              คือการ <strong>"แตกปัญหาใหญ่เป็นชิ้นเล็กๆ"</strong> เพื่อให้จัดการและทำทีละขั้นตอนได้ง่ายขึ้น ไม่ซับซ้อน
            </p>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', padding: '10px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '12px', fontWeight: 600 }}>
              💡 <strong>ตัวอย่าง:</strong> การจัดห้องนอน ➔ ย่อยงานออกเป็น 1. เก็บหมอน 2. พับผ้าห่ม 3. กวาดขยะ 4. ถูพื้น
            </div>
          </div>

          <div className="content-card" style={{ borderLeft: '6px solid #f68d1f' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              2. การตามล่าหารูปแบบ (Pattern Recognition) 🔍
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              คือการ <strong>"สังเกตสิ่งที่เกิดขึ้นซ้ำๆ หรือคล้ายๆ กัน"</strong> เพื่อนำวิธีการที่เคยใช้ได้ผลมาประยุกต์ใช้ใหม่โดยไม่ต้องเริ่มคิดใหม่ทั้งหมด!
            </p>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', padding: '10px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '12px', fontWeight: 600 }}>
              💡 <strong>ตัวอย่าง:</strong> การทอดไข่เจียว ➔ สังเกตว่าขั้นตอนเหมือนกันทุกครั้งคือ "ตอกไข่ ➔ ใส่ซีอิ๊ว ➔ เจียวไข่ ➔ เทลงกระทะ"
            </div>
          </div>

          <div className="content-card" style={{ borderLeft: '6px solid #e60012' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              3. การคัดแยกสาระสำคัญ (Abstraction) 💡
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              คือการ <strong>"มองหาเฉพาะสิ่งที่จำเป็น ละทิ้งรายละเอียดจิปาถะที่ไม่เกี่ยวข้องออกไป"</strong>
            </p>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '12px', fontWeight: 600 }}>
              💡 <strong>ตัวอย่าง:</strong> การวาดแผนที่บอกทางเพื่อน ➔ วาดเฉพาะถนนหลักกับร้านสะดวกซื้อ ไม่ต้องวาดก้อนเมฆหรือสุนัขริมถนน!
            </div>
          </div>

          <div className="content-card" style={{ borderLeft: '6px solid #206479' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              4. การแต่งสูตรบอกขั้นตอน (Algorithm Design) 📝
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              คือการ <strong>"เขียนสั่งงานเป็นข้อๆ ลำดับ 1, 2, 3"</strong> ให้คนอื่นหรือคอมพิวเตอร์ทำตามได้อย่างถูกต้องแม่นยำ
            </p>
            <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', color: '#155e75', padding: '10px 12px', borderRadius: '8px', marginTop: '10px', fontSize: '12px', fontWeight: 600 }}>
              💡 <strong>ตัวอย่าง:</strong> เขียนสูตรชงนม หรือขั้นตอนการพับกล่องกระดาษให้เพื่อนทำตามได้ทันที
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULUM SUMMARY G4 & G5 */}
      {activeTab === 'tab-curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="content-card" style={{ borderTop: '5px solid var(--primary)', background: '#ffffff' }}>
            <h3 style={{ color: '#0f172a', fontSize: '17px', fontWeight: 700, marginBottom: '10px' }}>
              📘 สรุปตารางเปรียบเทียบความก้าวหน้าหลักสูตร (ป.4 vs ป.5)
            </h3>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>หัวข้อหลัก</th>
                    <th>ขอบเขตเนื้อหาชั้น ป.4</th>
                    <th>ขอบเขตเนื้อหาชั้น ป.5 (การต่อยอด)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>การใช้เหตุผลเชิงตรรกะ</strong></td>
                    <td>คาดการณ์ผลลัพธ์จากปัญหาอย่างง่าย (เช่น เกม OX)</td>
                    <td>แก้ปัญหาที่มีสถานะเริ่มต้นซับซ้อนและเงื่อนไขมาก (เช่น Sudoku)</td>
                  </tr>
                  <tr>
                    <td><strong>การเขียนโปรแกรม</strong></td>
                    <td>เขียนโปรแกรมสร้างนิทาน/เรื่องราว และฝึก Debugging</td>
                    <td>ออกแบบด้วย <strong>ผังงาน (Flowchart)</strong> และใช้เงื่อนไขครอบคลุม (If-Else)</td>
                  </tr>
                  <tr>
                    <td><strong>การสืบค้นข้อมูล</strong></td>
                    <td>ใช้คำค้นที่ตรงประเด็นและดูโดเมน (.go.th, .ac.th)</td>
                    <td>ประเมินความสมบูรณ์ และเปรียบเทียบ <strong>ข้อดี-ข้อเสีย</strong> จากหลายแหล่ง</td>
                  </tr>
                  <tr>
                    <td><strong>การจัดการข้อมูล</strong></td>
                    <td>รวบรวมข้อมูลและประมวลผลพื้นฐาน (เช่น หาผลรวม)</td>
                    <td>สังเคราะห์สารสนเทศจากหลายแหล่งเพื่อใช้ในการตัดสินใจ</td>
                  </tr>
                  <tr>
                    <td><strong>ความปลอดภัยดิจิทัล</strong></td>
                    <td>เน้นการปกป้องรหัสผ่านและสิทธิหน้าที่ส่วนบุคคล</td>
                    <td>เน้นการรู้เท่าทันอาชญากรรมออนไลน์และการทำงานกลุ่มบนเครือข่าย</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="content-card" style={{ borderLeft: '6px solid var(--amber)' }}>
              <h4 style={{ color: '#1e293b', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                🏫 โครงสร้างหน่วยการเรียนรู้ ชั้น ป.4 (4 หน่วย)
              </h4>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <li><strong>หน่วยที่ 1:</strong> ขั้นตอนวิธีกับการแก้ปัญหา (Algorithms & Logic)</li>
                <li><strong>หน่วยที่ 2:</strong> เริ่มต้นสนุกลูกบอลกับ Scratch (สร้างนิทาน & Debugging)</li>
                <li><strong>หน่วยที่ 3:</strong> นักสืบอินเทอร์เน็ตและซอฟต์แวร์สารสนเทศ (Spreadsheet)</li>
                <li><strong>หน่วยที่ 4:</strong> พลเมืองดิจิทัลรุ่นเยาว์ (Digital Citizen & Passcode)</li>
              </ul>
            </div>

            <div className="content-card" style={{ borderLeft: '6px solid var(--systems-teal)' }}>
              <h4 style={{ color: '#1e293b', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                🏫 โครงสร้างหน่วยการเรียนรู้ ชั้น ป.5 (4 หน่วย)
              </h4>
              <ul style={{ paddingLeft: '18px', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                <li><strong>หน่วยที่ 1:</strong> ตรรกะและเงื่อนไขในการแก้ปัญหา (Sudoku & ถอดรหัส)</li>
                <li><strong>หน่วยที่ 2:</strong> การออกแบบและพัฒนาด้วยผังงาน (Flowchart & Coding)</li>
                <li><strong>หน่วยที่ 3:</strong> สารสนเทศทรงคุณค่าและการประเมินความน่าเชื่อถือ</li>
                <li><strong>หน่วยที่ 4:</strong> ปลอดภัยจากอาชญากรรมไซเบอร์ (Fake News & Cyberbullying)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CYBER SAFETY */}
      {activeTab === 'tab-safety' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="content-card" style={{ borderLeft: '6px solid #206479' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              🛡️ การตั้งรหัสผ่านและการรักษาข้อมูลส่วนตัว (Password Security)
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              • รหัสผ่านที่ดีควรจดจำง่ายสำหรับเรา แต่เดายากสำหรับคนอื่น ไม่ใช้ตัวเลขเรียงกัน เช่น 1234 หรือวันเกิด
              <br />
              • ห้ามบอกรหัสผ่านแก่เพื่อนหรือผู้อื่นเด็ดขาด ยกเว้นพ่อแม่หรือครูประจำชั้น
            </p>
          </div>

          <div className="content-card" style={{ borderLeft: '6px solid #e60012' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>
              ⚠️ การรู้เท่าทันข่าวปลอมและการกลั่นแกล้งออนไลน์ (Fake News & Cyberbullying)
            </h3>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
              • สังเกตเว็บไซต์น่าเชื่อถือ เช่น ลงท้ายด้วย <strong>.go.th</strong> (หน่วยงานรัฐ) หรือ <strong>.ac.th</strong> (สถาบันการศึกษา)
              <br />
              • ไม่ส่งต่อข้อความกลั่นแกล้ง หรือข้อความสร้างความเกลียดชังออนไลน์
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: REAL FLOWCHART DIAGRAMS */}
      {activeTab === 'tab-real-flowchart' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          <div className="content-card" style={{ width: '100%', borderTop: '5px solid var(--signal)', background: '#ffffff', borderRadius: '14px', padding: '20px' }}>
            <h3 style={{ color: '#0f172a', fontSize: '18px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}>
              💳 ผังงานแบบจริงที่ 1: ระบบตรวจสอบการถอนเงินตู้ ATM (พร้อมเงื่อนไข ใช่ / ไม่ใช่)
            </h3>
            <p style={{ fontSize: '13px', textAlign: 'center', color: '#64748b', marginBottom: '14px' }}>
              ตัวอย่างผังงานมาตรฐานที่มีจุดเริ่มต้น การป้อนรหัสคีย์บอร์ด การตัดสินใจ และทางแยก
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1.5px solid #e2e8f0' }}>
              <svg viewBox="0 0 550 710" style={{ maxWidth: '520px', width: '100%', height: 'auto', fontFamily: 'Sarabun, sans-serif' }}>
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#1e293b" />
                  </marker>
                  <marker id="arrowhead-red" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#e60012" />
                  </marker>
                  <marker id="arrowhead-green" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <polygon points="0 0, 8 4, 0 8" fill="#15803d" />
                  </marker>
                </defs>
                <g>
                  <rect x="200" y="20" width="150" height="50" rx="25" fill="#ecab37" stroke="#ffffff" strokeWidth="3" />
                  <text x="275" y="52" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">เริ่มต้น (Start)</text>
                </g>
                <line x1="275" y1="70" x2="275" y2="114" stroke="#1e293b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                <g>
                  <polygon points="200,120 350,120 325,170 175,170" fill="#acace7" stroke="#ffffff" strokeWidth="3" />
                  <text x="262" y="150" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">เสียบบัตร & กรอกรหัส PIN</text>
                </g>
                <line x1="262" y1="170" x2="262" y2="219" stroke="#1e293b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                <g>
                  <polygon points="262,225 375,280 262,335 149,280" fill="#f68d1f" stroke="#ffffff" strokeWidth="3" />
                  <text x="262" y="275" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">รหัสถูกต้อง</text>
                  <text x="262" y="295" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">หรือไม่?</text>
                </g>
                <line x1="149" y1="280" x2="75" y2="280" stroke="#e60012" strokeWidth="3" />
                <text x="110" y="268" fill="#e60012" fontSize="14" fontWeight="bold" textAnchor="middle">ไม่ใช่</text>
                <line x1="75" y1="280" x2="75" y2="145" stroke="#e60012" strokeWidth="3" />
                <line x1="75" y1="145" x2="188" y2="145" stroke="#e60012" strokeWidth="3" markerEnd="url(#arrowhead-red)" />
                <line x1="262" y1="335" x2="262" y2="384" stroke="#15803d" strokeWidth="3" markerEnd="url(#arrowhead-green)" />
                <text x="285" y="365" fill="#15803d" fontSize="14" fontWeight="bold">ใช่</text>
                <g>
                  <rect x="180" y="390" width="165" height="55" rx="8" fill="#3d4f97" stroke="#ffffff" strokeWidth="3" />
                  <text x="262" y="423" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">หักยอดเงินในบัญชี</text>
                </g>
                <line x1="262" y1="445" x2="262" y2="494" stroke="#1e293b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                <g>
                  <path d="M170 500 L335 500 C365 500 365 550 335 550 L170 550 Q195 525 170 500 Z" fill="#8ba1d4" stroke="#ffffff" strokeWidth="3" />
                  <text x="265" y="530" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">จ่ายเงินสด & พิมพ์สลิป</text>
                </g>
                <line x1="262" y1="550" x2="262" y2="599" stroke="#1e293b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                <g>
                  <rect x="187" y="605" width="150" height="50" rx="25" fill="#ecab37" stroke="#ffffff" strokeWidth="3" />
                  <text x="262" y="637" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">สิ้นสุด (Stop)</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RULES & RUBRICS */}
      {activeTab === 'tab-rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="content-card" style={{ borderLeft: '6px solid #e60012' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>
              ⚡ 5 กฎเหล็กการเขียนผังงาน (Flowchart Rules)
            </h3>
            <ol style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
              <li><strong>1. จุดเริ่มต้นและสิ้นสุด:</strong> ต้องมีอย่างละ 1 จุดเท่านั้น (Terminal Start/Stop)</li>
              <li><strong>2. ทิศทางการไหล:</strong> ไหลจาก บนลงล่าง (Top to Bottom) หรือ ซ้ายไปขวา (Left to Right)</li>
              <li><strong>3. การตัดสินใจ (Decision):</strong> ต้องมีทางออก 2 ทางเสมอคือ "ใช่" และ "ไม่ใช่"</li>
              <li><strong>4. ข้อความกระชับ:</strong> ใช้ประโยคกริยาสั้นๆ เช่น "ถูสบู่ 20 วินาที", "ตรวจรหัสผ่าน"</li>
              <li><strong>5. เลี่ยงเส้นตัดกัน:</strong> ใช้สัญลักษณ์วงกลม จุดเชื่อมต่อ (Connector) รวมเส้นทาง</li>
            </ol>
          </div>

          <div className="content-card" style={{ borderTop: '5px solid var(--amber)', background: '#ffffff' }}>
            <h3 style={{ color: '#0f172a', fontSize: '16px', fontWeight: 700, marginBottom: '10px' }}>
              📋 เกณฑ์การประเมินผลการเรียนรู้ (Rubric Assessment Criteria)
            </h3>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ประเด็นการประเมิน</th>
                    <th>ดีมาก (4)</th>
                    <th>ดี (3)</th>
                    <th>ผ่านเกณฑ์ (2)</th>
                    <th>ปรับปรุง (1)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>ความถูกต้องของสัญลักษณ์</strong></td>
                    <td>เลือกสัญลักษณ์ถูกต้องตามมาตรฐานทุกจุด</td>
                    <td>ผิดพลาด 1 จุด</td>
                    <td>ผิดพลาด 2-3 จุด</td>
                    <td>ใช้สัญลักษณ์ไม่ถูกต้องเกิน 3 จุด</td>
                  </tr>
                  <tr>
                    <td><strong>ทิศทางลำดับ (Flow Line)</strong></td>
                    <td>ลูกศรเชื่อมโยงถูกต้อง มีจุดเริ่มและจบชัดเจน</td>
                    <td>ทิศทางถูกต้อง ขาดจุดเริ่มหรือจบ 1 จุด</td>
                    <td>ทิศทางลูกศรสับสนบางจุด</td>
                    <td>ลูกศรไม่เชื่อมโยง ขาดทิศทางชัดเจน</td>
                  </tr>
                  <tr>
                    <td><strong>การใช้เงื่อนไข (Decision)</strong></td>
                    <td>เงื่อนไขชัดเจน ครบถ้วนทุกกรณี (Yes/No)</td>
                    <td>เงื่อนไขชัดเจน ขาดคำระบุผล 1 จุด</td>
                    <td>เงื่อนไขสับสน แต่ยังพอเข้าใจแนวคิด</td>
                    <td>เงื่อนไขไม่สมบูรณ์ นำไปประมวลผลไม่ได้</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-y2k btn-signal btn-lg" onClick={onGoToMap}>
          🎮 พร้อมแล้วไปผจญภัยเล่นเกม ➔
        </button>
        <button className="btn-y2k btn-amber btn-lg" onClick={onOpenCertificate}>
          🎓 ดูประกาศนียบัตร
        </button>
      </div>
    </section>
  );
}
