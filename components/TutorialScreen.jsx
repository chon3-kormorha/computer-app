'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Swal from 'sweetalert2';
import { StorageEngine } from '../lib/storage';
import { SoundEngine } from '../lib/audio';

// ── Required topics per grade track ──────────────────────────────────────────
export const P4_TOPIC_IDS = ['p4_1','p4_2','p4_3','p4_4','p4_5','p4_6'];
export const P5_TOPIC_IDS = ['p5_1','p5_2','p5_3','p5_4','p5_5','p5_6'];

// ── Learning Content Data ─────────────────────────────────────────────────────
const P4_TOPICS = [
  {
    id: 'p4_1',
    emoji: '🖥️',
    title: 'คอมพิวเตอร์และระบบดิจิทัลรอบตัวเรา',
    color: '#1d4ed8',
    sections: [
      {
        type: 'intro',
        text: 'ลองมองรอบๆ ตัวคุณ — มีอุปกรณ์อะไรบ้างที่ทำงานโดยอัตโนมัติ? โทรศัพท์มือถือ ไฟจราจร ตู้ ATM หรือแม้แต่เครื่องซักผ้า ล้วนเป็น "ระบบดิจิทัล" ที่ทำงานตามคำสั่ง'
      },
      {
        type: 'concept_cards',
        title: 'คอมพิวเตอร์ทำงาน 4 ขั้นตอน:',
        items: [
          { icon: '⌨️', label: 'รับข้อมูลเข้า (Input)', desc: 'คีย์บอร์ด, เมาส์, ไมค์, กล้อง' },
          { icon: '⚙️', label: 'ประมวลผล (Processing)', desc: 'CPU คำนวณและตัดสินใจ' },
          { icon: '📦', label: 'จัดเก็บข้อมูล (Storage)', desc: 'HDD, SSD, Flash Drive' },
          { icon: '🖥️', label: 'แสดงผล (Output)', desc: 'จอภาพ, ลำโพง, เครื่องพิมพ์' }
        ]
      },
      {
        type: 'examples',
        title: '🔍 ตัวอย่างในชีวิตประจำวัน:',
        items: [
          'ตู้ ATM รับรหัส PIN → ตรวจสอบ → จ่ายเงิน',
          'ไฟจราจรนับเวลา → เปลี่ยนสี → รถวิ่งหรือหยุด',
          'โทรศัพท์รับเสียง → แปลงเป็นข้อมูล → ส่งหาเพื่อน'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ในหนึ่งวัน คุณใช้ระบบดิจิทัลอะไรบ้าง? มีอย่างน้อย 3 อย่างได้ไหม?'
      }
    ]
  },
  {
    id: 'p4_2',
    emoji: '📊',
    title: 'ข้อมูลและสารสนเทศ (Data & Information)',
    color: '#0284c7',
    sections: [
      {
        type: 'intro',
        text: '"ข้อมูล" กับ "สารสนเทศ" ต่างกันอย่างไร? ตัวเลข 38 คืนข้อมูล แต่เมื่อรู้ว่าคืออุณหภูมิร่างกาย และร่างกายปกติควรอยู่ที่ 36-37 องศา — ตอนนี้ 38 กลายเป็น "สารสนเทศ" ที่บอกว่าอาจมีไข้!'
      },
      {
        type: 'compare',
        leftTitle: '📥 ข้อมูล (Data)',
        leftItems: ['ตัวเลข ตัวอักษร ที่ยังไม่ผ่านการแปลความ', 'เช่น: 95, สีแดง, 2026-07-27'],
        rightTitle: '📤 สารสนเทศ (Information)',
        rightItems: ['ข้อมูลที่ผ่านการประมวลผลจนมีความหมาย', 'เช่น: คะแนน 95 = เกรด A']
      },
      {
        type: 'concept_cards',
        title: 'ประเภทของข้อมูล:',
        items: [
          { icon: '🔢', label: 'ตัวเลข (Number)', desc: 'คะแนน น้ำหนัก อายุ ราคา' },
          { icon: '📝', label: 'ข้อความ (Text)', desc: 'ชื่อ ที่อยู่ คำอธิบาย' },
          { icon: '🖼️', label: 'รูปภาพ (Image)', desc: 'ภาพถ่าย กราฟ แผนที่' },
          { icon: '🔊', label: 'เสียง (Audio)', desc: 'เพลง เสียงพูด สัญญาณเตือน' }
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: คะแนนสอบ 70 คือ "ข้อมูล" หรือ "สารสนเทศ"? แล้วถ้ารู้ว่าเกณฑ์ผ่านคือ 60 ล่ะ?'
      }
    ]
  },
  {
    id: 'p4_3',
    emoji: '📐',
    title: 'ผังงาน (Flowchart) สัญลักษณ์พื้นฐาน',
    color: '#d97706',
    sections: [
      {
        type: 'intro',
        text: 'ผังงาน (Flowchart) คือแผนภูมิที่ใช้แสดงลำดับขั้นตอนการทำงาน เราใช้ "สัญลักษณ์" มาตรฐานเพื่อให้ทุกคนเข้าใจตรงกัน ไม่ว่าจะอยู่ที่ไหนในโลก'
      },
      {
        type: 'symbol_grid',
        symbols: [
          { shape: 'oval',      color: '#d97706', name: 'Start / Stop',   desc: 'จุดเริ่มต้นและสิ้นสุดของผังงาน' },
          { shape: 'rectangle', color: '#1d4ed8', name: 'Process',        desc: 'การทำงาน คำนวณ หรือประมวลผล' },
          { shape: 'diamond',   color: '#ea580c', name: 'Decision',       desc: 'การตัดสินใจ มีทางแยก ใช่/ไม่ใช่' },
          { shape: 'arrow',     color: '#0284c7', name: 'Flow Line',      desc: 'ลูกศรบอกทิศทางการไหลของงาน' }
        ]
      },
      {
        type: 'flowchart_demo',
        title: '📖 ตัวอย่าง: ผังงานการเปิดประตูด้วยรหัส',
        steps: ['Start', 'กดรหัส 4 หลัก', 'รหัสถูกต้อง?', 'เปิดประตู', 'Stop']
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ถ้าสัญลักษณ์ที่ใช้ไม่เป็นมาตรฐาน จะเกิดปัญหาอะไรกับคนที่อ่านผังงาน?'
      }
    ]
  },
  {
    id: 'p4_4',
    emoji: '🔄',
    title: 'อัลกอริทึม — ขั้นตอนการแก้ปัญหา',
    color: '#15803d',
    sections: [
      {
        type: 'intro',
        text: 'อัลกอริทึม (Algorithm) คือชุดของคำสั่งที่ชัดเจน เรียงลำดับ และสิ้นสุดได้ เพื่อแก้ปัญหาใดปัญหาหนึ่ง เหมือนสูตรทำอาหาร — ถ้าขั้นตอนสลับกัน อาหารจะไม่อร่อย!'
      },
      {
        type: 'concept_cards',
        title: 'อัลกอริทึมที่ดีต้องมี 3 คุณสมบัติ:',
        items: [
          { icon: '✅', label: 'ชัดเจน (Clear)', desc: 'แต่ละขั้นตอนต้องไม่คลุมเครือ' },
          { icon: '🔢', label: 'เรียงลำดับ (Ordered)', desc: 'ทำตามลำดับจนครบทุกขั้น' },
          { icon: '🏁', label: 'สิ้นสุดได้ (Finite)', desc: 'ต้องมีจุดสิ้นสุด ไม่วนไม่รู้จบ' }
        ]
      },
      {
        type: 'examples',
        title: '🍳 ตัวอย่างอัลกอริทึมในชีวิตจริง:',
        items: [
          'การต้มข้าว: ล้างข้าว → ใส่น้ำ → ตั้งไฟ → รอสุก → ปิดไฟ',
          'การแปรงฟัน: บีบยาสีฟัน → แปรง 2 นาที → บ้วนปาก',
          'การข้ามถนน: มองซ้าย → มองขวา → มองซ้ายอีกครั้ง → ข้ามเมื่อปลอดภัย'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: เขียนอัลกอริทึมการล้างมือของตัวเองออกมาเป็นขั้นตอน ใช้กี่ขั้น?'
      }
    ]
  },
  {
    id: 'p4_5',
    emoji: '🌐',
    title: 'การสืบค้นข้อมูลบนอินเทอร์เน็ต',
    color: '#dc2626',
    sections: [
      {
        type: 'intro',
        text: 'อินเทอร์เน็ตมีข้อมูลมหาศาล แต่ไม่ใช่ทุกข้อมูลที่ถูกต้อง! การสืบค้นที่ดีต้องรู้จักเลือก Keyword ที่เหมาะสมและประเมินแหล่งข้อมูลก่อนเชื่อ'
      },
      {
        type: 'compare',
        leftTitle: '❌ Keyword ที่ไม่ดี',
        leftItems: ['"ต้องการข้อมูลเรื่องอากาศ"', '"ผลไม้อะไรกินแล้วดี"', '"อยากรู้เรื่องโรค"'],
        rightTitle: '✅ Keyword ที่ดี',
        rightItems: ['"พยากรณ์อากาศ กรุงเทพ วันนี้"', '"วิตามิน C ผลไม้ไทย"', '"ไข้หวัดใหญ่ สาเหตุ อาการ"']
      },
      {
        type: 'concept_cards',
        title: 'โดเมนบอกประเภทของเว็บไซต์:',
        items: [
          { icon: '🏛️', label: '.go.th', desc: 'หน่วยงานภาครัฐ — น่าเชื่อถือสูง' },
          { icon: '🎓', label: '.ac.th', desc: 'สถาบันการศึกษา — น่าเชื่อถือสูง' },
          { icon: '🏢', label: '.or.th', desc: 'องค์กรเอกชนไม่แสวงกำไร' },
          { icon: '🏪', label: '.co.th', desc: 'บริษัทเอกชน — ตรวจสอบก่อนเชื่อ' }
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ถ้าเจอข้อมูล "วัคซีนทำให้เป็นออทิสติก" บนเว็บไซต์ไม่รู้จัก ควรทำอย่างไรก่อนแชร์?'
      }
    ]
  },
  {
    id: 'p4_6',
    emoji: '🔒',
    title: 'ความปลอดภัยและจริยธรรมดิจิทัล',
    color: '#475569',
    sections: [
      {
        type: 'intro',
        text: 'ทักษะสำคัญในยุคดิจิทัลคือการ "ปกป้องตัวเอง" ออนไลน์ — รหัสผ่านที่แข็งแกร่ง ข้อมูลส่วนตัวที่ไม่แชร์สุ่มสี่สุ่มห้า และการปฏิบัติตนที่ดีต่อผู้อื่นในโลกออนไลน์'
      },
      {
        type: 'concept_cards',
        title: 'รหัสผ่านที่แข็งแกร่งต้องมี:',
        items: [
          { icon: '🔤', label: 'ตัวอักษรพิมพ์ใหญ่-เล็ก', desc: 'เช่น A, b, Z, m' },
          { icon: '🔢', label: 'ตัวเลข', desc: 'เช่น 0-9 อย่างน้อย 2 ตัว' },
          { icon: '✨', label: 'สัญลักษณ์พิเศษ', desc: 'เช่น @, #, !, %, $' },
          { icon: '📏', label: 'ความยาว ≥ 8 ตัวอักษร', desc: 'และไม่ใช่ชื่อหรือวันเกิดตัวเอง' }
        ]
      },
      {
        type: 'examples',
        title: '🛡️ หลักปฏิบัติออนไลน์ที่ดี:',
        items: [
          'ไม่บอกรหัสผ่านแก่ใครทั้งนั้น แม้แต่เพื่อนสนิท',
          'ไม่ส่งรูปหรือข้อมูลส่วนตัวให้คนแปลกหน้า',
          'ไม่แชร์ข่าวที่ยังไม่ได้ตรวจสอบ',
          'ปฏิบัติต่อคนอื่นออนไลน์เหมือนพบหน้ากัน'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ถ้าได้รับข้อความ "ส่งรหัสผ่านมาเพื่อปลดบัญชี" จากคนอ้างว่าเป็นทีมงาน ควรทำอย่างไร?'
      }
    ]
  }
];

const P5_TOPICS = [
  {
    id: 'p5_1',
    emoji: '🧮',
    title: 'การคิดเชิงคำนวณ (Computational Thinking)',
    color: '#1d4ed8',
    sections: [
      {
        type: 'intro',
        text: 'การคิดเชิงคำนวณ ไม่ได้หมายความว่าต้องคิดเลขเก่ง แต่หมายถึงการคิดวิเคราะห์ปัญหาอย่างเป็นระบบ — แบบที่คอมพิวเตอร์ (หรือนักวิทยาศาสตร์คอมพิวเตอร์) ใช้แก้ปัญหา'
      },
      {
        type: 'concept_cards',
        title: '4 หัวใจของการคิดเชิงคำนวณ:',
        items: [
          { icon: '✂️', label: 'การแยกย่อย (Decomposition)', desc: 'แบ่งปัญหาใหญ่ให้เป็นปัญหาเล็กๆ' },
          { icon: '🔍', label: 'การหารูปแบบ (Pattern Recognition)', desc: 'มองหาความซ้ำซากหรือความสัมพันธ์' },
          { icon: '🎯', label: 'การคิดแบบนามธรรม (Abstraction)', desc: 'ตัดรายละเอียดที่ไม่สำคัญออก' },
          { icon: '📋', label: 'การออกแบบอัลกอริทึม (Algorithm)', desc: 'วางขั้นตอนแก้ปัญหาอย่างมีระบบ' }
        ]
      },
      {
        type: 'examples',
        title: '🌟 ตัวอย่าง CT ในชีวิตจริง:',
        items: [
          'การแบ่งงานโปรเจกต์กลุ่ม = Decomposition',
          'สังเกตว่าไข้มักมาพร้อมอาการอื่น = Pattern Recognition',
          'แผนที่ตัดรายละเอียดบ้านทุกหลังออก เหลือแค่ถนน = Abstraction'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: การสั่งพิซซ่าออนไลน์ใช้ CT ทั้ง 4 อย่างอย่างไรบ้าง?'
      }
    ]
  },
  {
    id: 'p5_2',
    emoji: '📐',
    title: 'สัญลักษณ์ Flowchart ขั้นสูงทั้งหมด',
    color: '#d97706',
    sections: [
      {
        type: 'intro',
        text: 'ผังงานในระดับที่ซับซ้อนขึ้นต้องใช้สัญลักษณ์เพิ่มเติมนอกจาก 4 อย่างพื้นฐาน เพื่อแสดงการรับข้อมูล, การแสดงผล และจุดเชื่อมต่อ'
      },
      {
        type: 'symbol_grid',
        symbols: [
          { shape: 'oval',      color: '#d97706', name: 'Start / Stop',   desc: 'จุดเริ่มต้น/สิ้นสุด' },
          { shape: 'rectangle', color: '#1d4ed8', name: 'Process',        desc: 'ประมวลผล/คำนวณ' },
          { shape: 'diamond',   color: '#ea580c', name: 'Decision',       desc: 'ตัดสินใจ/เงื่อนไข' },
          { shape: 'trapezoid', color: '#6366f1', name: 'Manual Input',   desc: 'ป้อนข้อมูลทางคีย์บอร์ด' },
          { shape: 'display',   color: '#0284c7', name: 'Display',        desc: 'แสดงผลบนจอภาพ' },
          { shape: 'circle',    color: '#dc2626', name: 'Connector',      desc: 'จุดเชื่อมต่อผังงาน' },
          { shape: 'arrow',     color: '#0f766e', name: 'Flow Line',      desc: 'ทิศทางการไหล' }
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ระหว่าง "Manual Input" กับ "Process" ต่างกันอย่างไร? ให้ยกตัวอย่างประกอบ'
      }
    ]
  },
  {
    id: 'p5_3',
    emoji: '💻',
    title: 'ผังงานกับการวิเคราะห์เงื่อนไขซับซ้อน',
    color: '#15803d',
    sections: [
      {
        type: 'intro',
        text: 'ผังงานขั้นสูงมักมี "เงื่อนไขซ้อน" (Nested Decision) และ "วงวน" (Loop) เช่น โปรแกรมถามรหัสผ่านซ้ำจนกว่าจะถูก — เราต้องอ่านผังงานแบบ "เดินตามลูกศร" ไปทีละขั้น'
      },
      {
        type: 'concept_cards',
        title: 'โครงสร้างพื้นฐานในผังงาน:',
        items: [
          { icon: '➡️', label: 'Sequential (ลำดับ)', desc: 'ทำทีละขั้นตอนจากบนลงล่าง' },
          { icon: '↙️↗️', label: 'Selection (เลือก)', desc: 'IF-THEN-ELSE แยกทางตามเงื่อนไข' },
          { icon: '🔁', label: 'Repetition (วน)', desc: 'LOOP วนซ้ำจนตรงตามเงื่อนไข' }
        ]
      },
      {
        type: 'examples',
        title: '📖 ตัวอย่าง: ผังงานระบบตรวจสอบอายุ',
        items: [
          'รับอายุ → อายุ ≥ 18 หรือไม่? → ใช่: เข้าได้ / ไม่ใช่: ไม่อนุญาต',
          'ระบบ ATM: กรอก PIN → ถูกต้อง? → ไม่ใช่: กรอกใหม่ (วน 3 ครั้ง) → ล็อกบัตร'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ผังงานต้มบะหมี่ที่มีเงื่อนไข "ต้มครบ 3 นาทีหรือยัง?" เป็นโครงสร้างแบบใด?'
      }
    ]
  },
  {
    id: 'p5_4',
    emoji: '🔍',
    title: 'การประเมินและเปรียบเทียบข้อมูลออนไลน์',
    color: '#ea580c',
    sections: [
      {
        type: 'intro',
        text: 'ในยุคที่ข้อมูลท่วมโลก ทักษะสำคัญคือ "วิเคราะห์ข้อมูลก่อนเชื่อ" — ไม่ใช่ทุกข้อมูลที่แชร์มาจากเพื่อนสนิทจะถูกต้อง และไม่ใช่ทุกเว็บไซต์ที่สวยงามจะน่าเชื่อถือ'
      },
      {
        type: 'concept_cards',
        title: '5 เกณฑ์ตรวจสอบข้อมูล (5C Framework):',
        items: [
          { icon: '👤', label: 'Creator (ผู้สร้าง)', desc: 'ใครเขียน? มีความน่าเชื่อถือไหม?' },
          { icon: '⏰', label: 'Currency (ความทันสมัย)', desc: 'ข้อมูลเก่าเกินไปหรือเปล่า?' },
          { icon: '📌', label: 'Coverage (ครอบคลุม)', desc: 'พูดถึงเรื่องนี้ครบถ้วนไหม?' },
          { icon: '🎯', label: 'Credibility (น่าเชื่อถือ)', desc: 'มีแหล่งอ้างอิงหรือเปล่า?' }
        ]
      },
      {
        type: 'compare',
        leftTitle: '⚠️ สัญญาณ Fake News:',
        leftItems: ['หัวข้อเกินจริง ตัวใหญ่พิมพ์ใหญ่ทั้งหมด', 'ไม่ระบุชื่อผู้เขียน', 'กระตุ้นให้รีบแชร์ทันที', 'ขัดกับสื่อกระแสหลักหลายแห่ง'],
        rightTitle: '✅ สัญญาณข้อมูลน่าเชื่อถือ:',
        rightItems: ['ระบุชื่อผู้เขียนและองค์กร', 'อ้างอิงแหล่งข้อมูล', 'วันที่เผยแพร่ชัดเจน', 'สอดคล้องกับแหล่งอื่น']
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: เพื่อนส่งข่าวว่า "กินกล้วยตอนเช้าทำให้ IQ สูงขึ้น 20%" คุณจะตรวจสอบอย่างไร?'
      }
    ]
  },
  {
    id: 'p5_5',
    emoji: '🛡️',
    title: 'Cyberbullying และการปกป้องตัวเองออนไลน์',
    color: '#dc2626',
    sections: [
      {
        type: 'intro',
        text: 'Cyberbullying คือการกลั่นแกล้งผ่านช่องทางดิจิทัล — ส่งข้อความด่าทอ แชร์รูปโดยไม่ยินยอม หรือโพสต์เรื่องราวเท็จ ผลกระทบร้ายแรงไม่แพ้การกลั่นแกล้งในชีวิตจริง'
      },
      {
        type: 'concept_cards',
        title: 'รูปแบบ Cyberbullying ที่พบบ่อย:',
        items: [
          { icon: '💬', label: 'Harassment', desc: 'ส่งข้อความด่าทอ ข่มขู่ ซ้ำๆ' },
          { icon: '📸', label: 'Image Shaming', desc: 'แชร์รูปหรือวิดีโอโดยไม่ยินยอม' },
          { icon: '👤', label: 'Impersonation', desc: 'แอบอ้างเป็นคนอื่นเพื่อทำร้าย' },
          { icon: '🚪', label: 'Exclusion', desc: 'จงใจกีดกันออกจากกลุ่ม' }
        ]
      },
      {
        type: 'examples',
        title: '🆘 เมื่อเผชิญ Cyberbullying ให้:',
        items: [
          'บันทึกหลักฐาน (screenshot) ไว้ก่อน',
          'ไม่โต้ตอบด้วยความโกรธ — ยิ่งตอบยิ่งแย่',
          'รายงาน (Report) และบล็อก (Block) คนนั้น',
          'แจ้งผู้ปกครองหรือครูที่ไว้วางใจได้ทันที'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ถ้าเห็นเพื่อนถูกกลั่นแกล้งในกลุ่มไลน์ห้อง คุณจะทำอะไรได้บ้าง?'
      }
    ]
  },
  {
    id: 'p5_6',
    emoji: '⚖️',
    title: 'สิทธิ์ ลิขสิทธิ์ และจริยธรรมดิจิทัล',
    color: '#0284c7',
    sections: [
      {
        type: 'intro',
        text: 'ข้อมูล รูปภาพ เพลง หรือโค้ดที่คนอื่นสร้างขึ้น ล้วนมี "ลิขสิทธิ์" คุ้มครอง — การนำไปใช้โดยไม่ได้รับอนุญาตถือเป็นการละเมิดกฎหมาย แม้จะทำบนโลกดิจิทัล'
      },
      {
        type: 'concept_cards',
        title: 'ประเภทของลิขสิทธิ์ที่ควรรู้:',
        items: [
          { icon: '©️', label: 'Copyright', desc: 'สงวนสิทธิ์ทุกอย่าง ต้องขออนุญาตก่อนใช้' },
          { icon: '🌐', label: 'Creative Commons', desc: 'ผู้สร้างกำหนดเงื่อนไขการใช้งานเอง' },
          { icon: '🔓', label: 'Public Domain', desc: 'ใช้ได้เสรี ไม่มีลิขสิทธิ์แล้ว' },
          { icon: '📂', label: 'Open Source', desc: 'ใช้ แก้ไข และแบ่งปันโค้ดได้' }
        ]
      },
      {
        type: 'examples',
        title: '✅ จริยธรรมดิจิทัลที่ดี:',
        items: [
          'อ้างอิงแหล่งที่มาทุกครั้งที่ใช้ข้อมูลของผู้อื่น',
          'ขออนุญาตก่อนแชร์รูปถ่ายที่มีคนอื่นอยู่ด้วย',
          'ไม่ดาวน์โหลดซอฟต์แวร์หรือเนื้อหาละเมิดลิขสิทธิ์',
          'เคารพความเป็นส่วนตัวของผู้อื่นทั้งออนไลน์และออฟไลน์'
        ]
      },
      {
        type: 'think',
        question: '🤔 ลองคิดดู: ถ้าต้องทำรายงานและเอารูปจากอินเทอร์เน็ตมาใช้ ควรทำอะไรก่อน?'
      }
    ]
  }
];

// ── SVG Symbol Renderer ───────────────────────────────────────────────────────
function SymbolSVG({ shape, color, size = 100 }) {
  let path = '';
  const h = size * 0.5;
  switch (shape) {
    case 'oval':      path = `<rect x="5" y="${h*0.1}" width="${size-10}" height="${h*0.8}" rx="${h*0.4}" fill="${color}" stroke="#fff" stroke-width="2.5"/>`; break;
    case 'rectangle': path = `<rect x="5" y="${h*0.1}" width="${size-10}" height="${h*0.8}" rx="6" fill="${color}" stroke="#fff" stroke-width="2.5"/>`; break;
    case 'diamond':   path = `<polygon points="${size/2},4 ${size-4},${h} ${size/2},${size-4} 4,${h}" fill="${color}" stroke="#fff" stroke-width="2.5"/>`; break;
    case 'trapezoid': path = `<polygon points="15,${h*0.1} ${size-5},${h*0.1} ${size-15},${h*0.9} 5,${h*0.9}" fill="${color}" stroke="#fff" stroke-width="2.5"/>`; break;
    case 'display':   path = `<path d="M5,${h*0.1} L${size-15},${h*0.1} C${size},${h*0.1} ${size},${h*0.9} ${size-15},${h*0.9} L5,${h*0.9} Q${size*0.25},${h} 5,${h*0.1} Z" fill="${color}" stroke="#fff" stroke-width="2.5"/>`; break;
    case 'circle':    path = `<circle cx="${size/2}" cy="${h}" r="${h*0.4}" fill="${color}" stroke="#fff" stroke-width="2.5"/>`; break;
    case 'arrow':     path = `<path d="M8,${h} L${size-16},${h} M${size-30},${h*0.6} L${size-8},${h} L${size-30},${h*1.4}" fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`; break;
    default:          path = `<rect x="5" y="${h*0.1}" width="${size-10}" height="${h*0.8}" rx="6" fill="${color}" stroke="#fff" stroke-width="2.5"/>`;
  }
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} xmlns="http://www.w3.org/2000/svg"
      dangerouslySetInnerHTML={{ __html: path }} />
  );
}

// ── Section Renderers High Contrast ──────────────────────────────────────────
function renderSection(section, idx) {
  switch (section.type) {
    case 'intro':
      return (
        <div key={idx} style={{ background: '#f8fafc', borderLeft: '5px solid #0284c7', border: '1px solid #cbd5e1', borderLeftWidth: '5px', borderRadius: '12px', padding: '18px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#0f172a', fontWeight: '500', margin: 0 }}>{section.text}</p>
        </div>
      );
    case 'concept_cards':
      return (
        <div key={idx} style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>{section.title}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {section.items.map((item, i) => (
              <div key={i} style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>{item.label}</div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'examples':
      return (
        <div key={idx} style={{ background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#14532d', marginBottom: '10px' }}>{section.title}</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {section.items.map((item, i) => (
              <li key={i} style={{ fontSize: '15px', color: '#14532d', marginBottom: '6px', lineHeight: 1.5, fontWeight: '500' }}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case 'compare':
      return (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '12px', padding: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#7f1d1d', marginBottom: '8px' }}>{section.leftTitle}</h4>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {section.leftItems.map((item, i) => <li key={i} style={{ fontSize: '13px', color: '#7f1d1d', marginBottom: '4px', fontWeight: '500' }}>{item}</li>)}
            </ul>
          </div>
          <div style={{ background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '12px', padding: '14px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#14532d', marginBottom: '8px' }}>{section.rightTitle}</h4>
            <ul style={{ margin: 0, paddingLeft: '18px' }}>
              {section.rightItems.map((item, i) => <li key={i} style={{ fontSize: '13px', color: '#14532d', marginBottom: '4px', fontWeight: '500' }}>{item}</li>)}
            </ul>
          </div>
        </div>
      );
    case 'symbol_grid':
      return (
        <div key={idx} style={{ marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
            {section.symbols.map((sym, i) => (
              <div key={i} style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
                <SymbolSVG shape={sym.shape} color={sym.color} size={70} />
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a', marginTop: '6px' }}>{sym.name}</div>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '3px' }}>{sym.desc}</div>
              </div>
            ))}
          </div>
        </div>
      );
    case 'think':
      return (
        <div key={idx} style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#78350f', margin: 0, lineHeight: 1.6 }}>{section.question}</p>
        </div>
      );
    default:
      return null;
  }
}

// ── Main TutorialScreen Component ─────────────────────────────────────────────
export default function TutorialScreen({ student, onGoToMap, onOpenCertificate }) {
  const gradeTrack = student?.grade?.startsWith('ป.5') || student?.grade?.startsWith('ป.6') ? 'p5' : 'p4';
  const topics = gradeTrack === 'p5' ? P5_TOPICS : P4_TOPICS;
  const requiredIds = gradeTrack === 'p5' ? P5_TOPIC_IDS : P4_TOPIC_IDS;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [confirmedIds, setConfirmedIds] = useState([]);
  const [timeOnTopic, setTimeOnTopic] = useState(0);
  const timerRef = useRef(null);

  const currentTopic = topics[currentIdx];
  const isCurrentConfirmed = confirmedIds.includes(currentTopic?.id);
  const allDone = requiredIds.every(id => confirmedIds.includes(id));
  const canReadNext = isCurrentConfirmed && currentIdx < topics.length - 1;

  // Initialize confirmedIds from student data
  useEffect(() => {
    const saved = student?.tutorialTopicsCompleted || [];
    setConfirmedIds(Array.isArray(saved) ? saved : []);
  }, [student]);

  // Timer for current topic
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isCurrentConfirmed) {
      setTimeOnTopic(0);
      timerRef.current = setInterval(() => {
        setTimeOnTopic(prev => prev + 1);
      }, 1000);
    } else {
      setTimeOnTopic(61);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIdx, isCurrentConfirmed]);

  const handleConfirm = useCallback(async () => {
    if (timeOnTopic < 60) return;
    SoundEngine.playCorrect();
    const newConfirmed = [...new Set([...confirmedIds, currentTopic.id])];
    setConfirmedIds(newConfirmed);
    if (timerRef.current) clearInterval(timerRef.current);

    await StorageEngine.saveStudentProgress({ tutorialTopicsCompleted: newConfirmed });

    if (newConfirmed.length >= requiredIds.length) {
      Swal.fire({
        icon: 'success',
        title: '🎉 เรียนรู้ครบทุกบทแล้ว!',
        text: 'ยอดเยี่ยมมาก! ตอนนี้คุณสามารถเล่นด่านเกมส์ทั้งหมดได้แล้ว',
        confirmButtonText: 'ไปหน้าแผนที่ด่าน ➔',
        customClass: { popup: 'swal-y2k-popup', title: 'swal-y2k-title', confirmButton: 'btn-y2k btn-signal' }
      }).then(() => onGoToMap());
    } else if (currentIdx < topics.length - 1) {
      setTimeout(() => setCurrentIdx(prev => prev + 1), 400);
    }
  }, [timeOnTopic, confirmedIds, currentTopic, currentIdx, topics.length, requiredIds.length, onGoToMap]);

  const handleSelectTopic = (idx) => {
    const isUnlocked = idx === 0 || confirmedIds.includes(topics[idx - 1]?.id);
    if (!isUnlocked) {
      Swal.fire({
        icon: 'warning',
        title: 'ล็อกอยู่!',
        text: 'กรุณาเรียนรู้บทก่อนหน้าและยืนยันให้ครบก่อนนะครับ',
        customClass: { popup: 'swal-y2k-popup' }
      });
      return;
    }
    setCurrentIdx(idx);
  };

  const secondsRemaining = Math.max(0, 60 - timeOnTopic);
  const timerPercent = Math.min(100, (timeOnTopic / 60) * 100);

  return (
    <section className="screen-view" style={{ background: '#f1f5f9', padding: '20px', borderRadius: '16px' }}>
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '2px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <button className="btn-y2k btn-carbon btn-sm" onClick={onGoToMap}>◀ กลับหน้าแผนที่</button>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span className="status-badge ready" style={{ fontSize: '13px', background: '#2563eb', color: '#ffffff', border: 'none' }}>
            {gradeTrack === 'p5' ? '🎒 ป.5 - ป.6' : '🎒 ป.4'}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
            เรียนรู้แล้ว {confirmedIds.filter(id => requiredIds.includes(id)).length} / {requiredIds.length} บท
          </span>
        </div>
      </div>

      {/* HERO TITLE */}
      <div className="hero-panel" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: '2px solid #334155', borderRadius: '12px', marginBottom: '20px', padding: '18px 24px' }}>
        <h2 className="hero-display-title" style={{ fontSize: '22px', margin: 0, color: '#ffffff', textShadow: 'none' }}>📚 คลังเรียนรู้วิทยาการคำนวณ</h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px', fontWeight: '500' }}>
          เรียนรู้ให้ครบทุกบทเพื่อปลดล็อกด่านเกมส์ — ต้องใช้เวลาอย่างน้อย 60 วินาทีต่อบท และยืนยันการเรียนรู้ก่อน
        </p>
      </div>

      {/* MAIN LAYOUT: Top Selector Tabs + Main Content Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* TOP TOPIC SELECTOR (Horizontal Tabs) */}
        <div style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '14px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginBottom: '10px', paddingLeft: '4px' }}>
            📋 ลำดับบทเรียน (ต้องเรียนตามลำดับ):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
            {topics.map((topic, idx) => {
              const isUnlocked = idx === 0 || confirmedIds.includes(topics[idx - 1]?.id);
              const isConfirmed = confirmedIds.includes(topic.id);
              const isCurrent = idx === currentIdx;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(idx)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 8px',
                    borderRadius: '10px',
                    border: isCurrent ? '3px solid #2563eb' : '2px solid #cbd5e1',
                    background: isCurrent ? '#eff6ff' : isConfirmed ? '#f0fdf4' : isUnlocked ? '#ffffff' : '#f8fafc',
                    cursor: isUnlocked ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                    opacity: isUnlocked ? 1 : 0.6
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                    {isConfirmed ? '✅' : isUnlocked ? topic.emoji : '🔒'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: isCurrent ? '#1d4ed8' : '#0f172a' }}>
                    บทที่ {idx + 1}
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                    {topic.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT CONTAINER (No Inner Scrollbar - High Contrast) */}
        <div style={{ background: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>

          {/* TOPIC HEADER CARD */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: '#f8fafc',
            border: `2px solid ${currentTopic.color}`,
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '38px' }}>{currentTopic.emoji}</span>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                บทที่ {currentIdx + 1} จาก {topics.length}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: '2px 0 0 0' }}>
                {currentTopic.title}
              </h3>
            </div>
          </div>

          {/* ALL SECTIONS (Rendered full height, no scroll box) */}
          <div style={{ marginBottom: '24px' }}>
            {currentTopic.sections.map((section, idx) => renderSection(section, idx))}
          </div>

          {/* TIMER & CONFIRMATION BOX */}
          <div style={{
            background: isCurrentConfirmed ? '#f0fdf4' : '#fffbeb',
            border: `2px solid ${isCurrentConfirmed ? '#22c55e' : '#f59e0b'}`,
            borderRadius: '14px',
            padding: '20px'
          }}>
            {isCurrentConfirmed ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '4px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#14532d' }}>คุณได้ศึกษาและยืนยันบทเรียนนี้แล้ว</div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '14px' }}>
                  {canReadNext && (
                    <button className="btn-y2k btn-signal btn-lg" onClick={() => setCurrentIdx(prev => prev + 1)}>
                      ไปยังบทถัดไป ➔
                    </button>
                  )}
                  {allDone && (
                    <button className="btn-y2k btn-signal btn-lg" onClick={onGoToMap}>
                      🎮 เข้าสู่แผนที่เล่นเกม
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#78350f' }}>⏱️ เวลาศึกษาบทเรียน:</span>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: secondsRemaining > 0 ? '#b45309' : '#15803d' }}>
                      {secondsRemaining > 0 ? `อีก ${secondsRemaining} วินาที` : '✅ พร้อมยืนยันแล้ว!'}
                    </span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '999px', height: '14px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                    <div style={{
                      width: `${timerPercent}%`,
                      height: '100%',
                      background: timerPercent >= 100 ? '#22c55e' : '#f59e0b',
                      borderRadius: '999px',
                      transition: 'width 1s linear'
                    }} />
                  </div>
                </div>

                <button
                  className={`btn-y2k btn-lg ${timeOnTopic >= 60 ? 'btn-signal' : 'btn-carbon'}`}
                  onClick={handleConfirm}
                  disabled={timeOnTopic < 60}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    opacity: timeOnTopic < 60 ? 0.5 : 1,
                    cursor: timeOnTopic < 60 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {timeOnTopic >= 60 ? '✅ ยืนยันการเรียนรู้บทนี้' : `📖 กรุณาอ่านศึกษาเนื้อหา... (อีก ${secondsRemaining} วินาที)`}
                </button>
                <p style={{ fontSize: '12px', color: '#78350f', marginTop: '8px', textAlign: 'center', fontWeight: '500' }}>
                  ศึกษาเนื้อหาอย่างน้อย 60 วินาที แล้วกดยืนยันเพื่อปลดล็อกบทถัดไป
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
