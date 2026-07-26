/* ==========================================================================
   Flowchart Game Engine - Levels 1 to 5 Logic & Interactions
   ========================================================================== */

const GameEngine = (() => {
  let currentLevel = 1;
  let levelScore = 0;
  let totalScore = 0;
  let timerInterval = null;
  let timeLeft = 0;
  let currentStudent = null;

  // Render SVG Symbol Helper with high clarity & visual badges
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
      case 'parallelogram':
      case 'input_output':
        shapePath = `<polygon points="22,5 115,5 98,53 5,53" fill="${color}" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.25))"/>`;
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
        textNode = lines.map((l, i) => `<text x="60" y="${startY + (i * 13)}" fill="#ffffff" font-size="10" font-weight="bold" text-anchor="middle" font-family="'Sarabun', sans-serif">${l}</text>`).join('');
      }
    }

    return `
      <svg class="svg-shape" viewBox="0 0 120 60" style="width: ${width}px; height: ${height}px;" xmlns="http://www.w3.org/2000/svg">
        ${shapePath}
        ${textNode}
      </svg>
    `;
  }

  // Level Data (Elementary Science & Technology Curriculum)
  const LEVEL_DATA = {
    1: {
      title: 'ด่านที่ 1: จับคู่ชื่อสัญลักษณ์กับรูปทรง',
      instructions: 'คลิกเลือก “ชื่อสัญลักษณ์” ให้ตรงกับรูปทรงสีสวยๆ ที่เห็นอยู่บนการ์ด',
      items: [
        { id: 's1', name: 'Start / Stop (จุดเริ่มต้น / จุดสิ้นสุด)', shape: 'oval', color: '#ecab37' },
        { id: 's2', name: 'Process (การทำงาน / การคำนวณ)', shape: 'rectangle', color: '#3d4f97' },
        { id: 's3', name: 'Decision (การตัดสินใจ / เช็กเงื่อนไข)', shape: 'diamond', color: '#f68d1f' },
        { id: 's4', name: 'Flow Line (ลูกศรบอกทิศทาง)', shape: 'arrow', color: '#206479' }
      ]
    },
    2: {
      title: 'ด่านที่ 2: จับคู่สัญลักษณ์กับหน้าที่การทำงาน',
      instructions: 'เลือกหน้าที่ของสัญลักษณ์ Flowchart แต่ละรูปทรงให้ถูกต้อง',
      items: [
        { id: 'f1', name: 'Manual Input (คีย์บอร์ด)', shape: 'trapezoid', color: '#acace7', desc: '⌨️ ป้อนข้อมูลด้วยการคีย์ทางแป้นพิมพ์' },
        { id: 'f2', name: 'Display (จอภาพ)', shape: 'display', color: '#8ba1d4', desc: '🖥️ แสดงผลข้อความหรือภาพออกทางหน้าจอ' },
        { id: 'f3', name: 'Connector (จุดเชื่อม)', shape: 'circle', color: '#e60012', desc: '🔴 จุดเชื่อมต่อเส้นทางของผังงาน' },
        { id: 'f4', name: 'Input / Output (รับ/แสดงผล)', shape: 'parallelogram', color: '#206479', desc: '📥 รับและแสดงข้อมูลทั่วไปไม่ระบุอุปกรณ์' }
      ]
    },
    3: {
      title: 'ด่านที่ 3: เกมเรียงลำดับขั้นตอน "การแปรงฟันอย่างถูกวิธี"',
      instructions: 'กดปุ่ม ▲ ขึ้น หรือ ▼ ลง เพื่อเรียงลำดับตั้งแต่ "เริ่มต้น" จนถึง "สิ้นสุด"',
      steps: [
        { id: 1, text: '1. เริ่มต้น (Start)', shape: 'oval' },
        { id: 2, text: '2. บีบยาสีฟันลงบนแปรงสีฟัน', shape: 'rectangle' },
        { id: 3, text: '3. แปรงฟันให้ทั่วทุกซี่นาน 2 นาที', shape: 'rectangle' },
        { id: 4, text: '4. บ้วนปากและล้างแปรงด้วยน้ำสะอาด', shape: 'rectangle' },
        { id: 5, text: '5. เช็ดปากให้แห้ง', shape: 'rectangle' },
        { id: 6, text: '6. สิ้นสุด (Stop)', shape: 'oval' }
      ]
    },
    4: {
      title: 'ด่านที่ 4: แบบทดสอบความไว (4 ช้อยส์ง่ายๆ มีรูปภาพชัดเจน)',
      instructions: 'อ่านคำถามแล้วคลิกเลือกคำตอบที่ถูกต้องก่อนหมดเวลา 15 วินาที!',
      questions: [
        {
          q: '1. รูปทรง "วงรี (Oval)" 🟢 มีหน้าที่อะไรในผังงาน Flowchart?',
          options: [
            { text: 'จุดเริ่มต้น (Start) หรือ จุดสิ้นสุด (Stop)', correct: true },
            { text: 'การคำนวณบวกเลข', correct: false },
            { text: 'การป้อนรหัสคีย์บอร์ด', correct: false }
          ]
        },
        {
          q: '2. สัญลักษณ์ "สี่เหลี่ยมผืนผ้า (Process)" 🟦 ใช้กับขั้นตอนใด?',
          options: [
            { text: 'การปฏิบัติงาน / คำนวณ (เช่น "ถูสบู่บนฝ่ามือ")', correct: true },
            { text: 'จุดสิ้นสุดของผังงาน', correct: false },
            { text: 'การตรวจสอบเงื่อนไข ใช่/ไม่ใช่', correct: false }
          ]
        },
        {
          q: '3. รูปทรง "สี่เหลี่ยมข้าวหลามตัด (Diamond)" 🔶 มีไว้ใช้ทำอะไร?',
          options: [
            { text: 'การตัดสินใจ / ตรวจสอบเงื่อนไข (ใช่ หรือ ไม่ใช่)', correct: true },
            { text: 'แสดงข้อความออกหน้าจอภาพ', correct: false },
            { text: 'ป้อนข้อมูลทางแป้นพิมพ์', correct: false }
          ]
        },
        {
          q: '4. หากต้องการบอกทิศทางกระแสการทำงานจากบนลงล่าง ต้องใช้สิ่งใด?',
          options: [
            { text: 'ลูกศรบอกทิศทาง (Flow Line) ➔', correct: true },
            { text: 'วงกลมจุดเชื่อมต่อ 🔴', correct: false },
            { text: 'สี่เหลี่ยมคางหมู 📐', correct: false }
          ]
        }
      ]
    },
    5: {
      title: 'ด่านที่ 5: Mini Challenge - สร้าง Flowchart ระบบถอนเงินตู้ ATM',
      instructions: 'เลือกลำดับบล็อกขั้นตอนตั้งแต่เริ่มต้นจนจบให้สมบูรณ์',
      blocks: [
        { slot: 1, expected: 'Start (เริ่มต้น)', options: ['Start (เริ่มต้น)', 'Process ATM', 'Input PIN'] },
        { slot: 2, expected: 'กรอกรหัส PIN คีย์บอร์ด', options: ['กรอกรหัส PIN คีย์บอร์ด', 'รับเงินสดทันที', 'เช็คยอดเงิน'] },
        { slot: 3, expected: 'รหัสถูกต้องหรือไม่?', options: ['รหัสถูกต้องหรือไม่?', 'กดถอนเงินเลย', 'ปิดตู้ ATM'] },
        { slot: 4, expected: 'รับเงินสดและบัตรคืน', options: ['รับเงินสดและบัตรคืน', 'รอ 24 ชม.', 'ยกเลิกรายการ'] },
        { slot: 5, expected: 'Stop (สิ้นสุด)', options: ['Stop (สิ้นสุด)', 'Pause', 'End Task'] }
      ]
    }
  };

  // State trackers
  let l1Selections = {};
  let l2Selections = {};
  let l3CurrentOrder = [];
  let l4CurrentQuestionIdx = 0;
  let l5UserChoices = {};

  function startLevel(levelNum) {
    // Remove any existing level complete modal
    closeModal();

    currentLevel = levelNum;
    levelScore = 0;
    SoundEngine.playClick();

    currentStudent = StorageEngine.getCurrentStudent() || {
      name: 'ผู้เล่นทั่วไป',
      grade: 'ทั่วไป',
      score: 0,
      stars: 0,
      levelsCompleted: []
    };

    let levels = currentStudent.levelsCompleted || [];
    if (typeof levels === 'string') {
      try { levels = JSON.parse(levels); } catch (e) { levels = []; }
    }
    if (!Array.isArray(levels)) levels = [];
    currentStudent.levelsCompleted = levels;

    const container = document.getElementById('game-stage-container');
    if (!container) return;
    container.innerHTML = '';

    // Render Progress Bar Header
    const headerHTML = `
      <div class="game-progress-header">
        <div>
          <strong style="color: var(--nav-gold);">${LEVEL_DATA[levelNum].title}</strong>
          <div style="font-size: 11px; opacity: 0.8;">ผู้เล่น: ${currentStudent.name} (${currentStudent.grade})</div>
        </div>
        <div style="text-align: right;">
          <div class="star-rating">
            <span id="star-1">★</span><span id="star-2">★</span><span id="star-3">★</span>
          </div>
          <div style="font-size: 12px; font-weight: bold; color: var(--amber);">คะแนนด่านนี้: <span id="level-score-val">0</span></div>
        </div>
      </div>
      <div class="inset-panel" style="margin-bottom: 16px;">
        <span style="color: var(--signal); font-weight: bold;">💡 คำอธิบาย:</span> ${LEVEL_DATA[levelNum].instructions}
      </div>
    `;

    container.insertAdjacentHTML('beforeend', headerHTML);

    switch (levelNum) {
      case 1: renderLevel1(container); break;
      case 2: renderLevel2(container); break;
      case 3: renderLevel3(container); break;
      case 4: renderLevel4(container); break;
      case 5: renderLevel5(container); break;
    }
  }

  // --- LEVEL 1 RENDERER ---
  function renderLevel1(container) {
    l1Selections = {};
    const data = LEVEL_DATA[1];

    const html = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <!-- Left: Names -->
        <div>
          <h4 style="margin-bottom: 8px; color: var(--ink-soft);">🏷️ เลือกชื่อสัญลักษณ์:</h4>
          <div id="l1-names" style="display: flex; flex-direction: column; gap: 8px;">
            ${data.items.map(item => `
              <div class="btn-y2k btn-amber l1-name-btn" data-id="${item.id}" onclick="GameEngine.handleL1SelectName('${item.id}')">
                ${item.name}
              </div>
            `).join('')}
          </div>
        </div>
        <!-- Right: Shapes -->
        <div>
          <h4 style="margin-bottom: 8px; color: var(--ink-soft);">📐 รูปทรงสัญลักษณ์:</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            ${data.items.map(item => `
              <div class="flowchart-symbol-card l1-shape-card" id="l1-target-${item.id}" onclick="GameEngine.handleL1TargetClick('${item.id}')">
                ${getSymbolSVG(item.shape, item.color)}
                <div class="l1-assigned-name" style="font-size: 11px; font-weight: bold; color: var(--signal); margin-top: 4px;">[ยังไม่ได้เลือก]</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn-y2k btn-signal btn-lg" onclick="GameEngine.checkLevel1()">ตรวจคำตอบ ➔</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  let selectedL1NameId = null;

  function handleL1SelectName(id) {
    SoundEngine.playClick();
    selectedL1NameId = id;
    document.querySelectorAll('.l1-name-btn').forEach(btn => {
      btn.style.outline = (btn.getAttribute('data-id') === id) ? '3px solid var(--primary)' : 'none';
    });
  }

  function handleL1TargetClick(targetId) {
    if (!selectedL1NameId) {
      alert('กรุณาแตะเลือก "ชื่อสัญลักษณ์" ทางซ้ายมือก่อนครับ');
      return;
    }
    SoundEngine.playClick();
    const nameItem = LEVEL_DATA[1].items.find(i => i.id === selectedL1NameId);
    l1Selections[targetId] = selectedL1NameId;

    const targetCard = document.getElementById(`l1-target-${targetId}`);
    const labelDiv = targetCard.querySelector('.l1-assigned-name');
    labelDiv.textContent = `✓ ${nameItem.name.split(' ')[0]}`;
    targetCard.classList.add('selected');
  }

  function checkLevel1() {
    let correctCount = 0;
    const items = LEVEL_DATA[1].items;

    items.forEach(item => {
      if (l1Selections[item.id] === item.id) {
        correctCount++;
      }
    });

    if (correctCount === items.length) {
      levelScore = 100;
      SoundEngine.playCorrect();
      finishLevel(1, 100, 3);
    } else {
      SoundEngine.playWrong();
      alert(`คุณตอบถูกต้อง ${correctCount} จาก ${items.length} ข้อ ลองใหม่อีกครั้งนะครับ!`);
    }
  }

  // --- LEVEL 2 RENDERER (Interactive Symbol & Duty Matching Cards) ---
  let selectedL2DescId = null;

  function renderLevel2(container) {
    l2Selections = {};
    selectedL2DescId = null;
    const items = LEVEL_DATA[2].items;

    // Shuffle descs for left display
    const shuffledDescs = [...items].sort(() => Math.random() - 0.5);

    const html = `
      <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 16px; align-items: start;">
        <!-- Left: Duty Descriptions -->
        <div>
          <h4 style="margin-bottom: 10px; color: var(--carbon); font-size: 15px;">📜 1. แตะเลือกหน้าที่การทำงาน:</h4>
          <div id="l2-descs" style="display: flex; flex-direction: column; gap: 10px;">
            ${shuffledDescs.map(item => `
              <div class="btn-y2k btn-amber l2-desc-btn" data-id="${item.id}" onclick="GameEngine.handleL2SelectDesc('${item.id}')" style="text-align: left; padding: 12px 14px; font-size: 13px; line-height: 1.4;">
                📌 ${item.desc}
              </div>
            `).join('')}
          </div>
        </div>
        <!-- Right: Symbol Shapes -->
        <div>
          <h4 style="margin-bottom: 10px; color: var(--carbon); font-size: 15px;">📐 2. แตะสัญลักษณ์เพื่อวางหน้าที่:</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            ${items.map(item => `
              <div class="flowchart-symbol-card l2-shape-card" id="l2-target-${item.id}" onclick="GameEngine.handleL2TargetClick('${item.id}')" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px 10px; background: #ffffff; border: 2.5px dashed var(--chrome-indigo); border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
                <div class="svg-shape-wrapper">
                  ${getSymbolSVG(item.shape, item.color, item.name, 120, 60)}
                </div>
                <div class="l2-assigned-desc" style="font-size: 11px; font-weight: 700; color: #64748b; margin-top: 8px; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; text-align: center;">[ แตะวางหน้าที่ ]</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn-y2k btn-signal btn-lg" onclick="GameEngine.checkLevel2()">ส่งคำตอบด่านที่ 2 ➔</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  function handleL2SelectDesc(id) {
    SoundEngine.playClick();
    selectedL2DescId = id;
    document.querySelectorAll('.l2-desc-btn').forEach(btn => {
      btn.style.outline = (btn.getAttribute('data-id') === id) ? '3px solid var(--primary)' : 'none';
    });
  }

  function handleL2TargetClick(targetSymbolId) {
    if (!selectedL2DescId) {
      alert('กรุณาแตะเลือก "หน้าที่การทำงาน" ทางซ้ายมือก่อนครับ');
      return;
    }
    SoundEngine.playClick();
    const descItem = LEVEL_DATA[2].items.find(i => i.id === selectedL2DescId);
    const targetItem = LEVEL_DATA[2].items.find(i => i.id === targetSymbolId);
    l2Selections[targetSymbolId] = selectedL2DescId;

    const targetCard = document.getElementById(`l2-target-${targetSymbolId}`);

    targetCard.innerHTML = `
      <div class="svg-shape-wrapper">
        ${getSymbolSVG(targetItem.shape, targetItem.color, targetItem.name, 120, 60)}
      </div>
      <div class="l2-assigned-desc" style="font-size: 11px; font-weight: 700; color: #15803d; margin-top: 8px; background: #dcfce7; padding: 4px 8px; border-radius: 6px; border: 1px solid #86efac; text-align: center;">
        ✓ ${descItem.desc}
      </div>
    `;
    targetCard.style.borderColor = '#15803d';
    targetCard.style.background = '#f0fdf4';
    targetCard.classList.add('selected');
  }

  function checkLevel2() {
    const items = LEVEL_DATA[2].items;
    let correctCount = 0;

    items.forEach(item => {
      if (l2Selections[item.id] === item.id) {
        correctCount++;
      }
    });

    if (correctCount === items.length) {
      levelScore = 120;
      SoundEngine.playCorrect();
      finishLevel(2, 120, 3);
    } else {
      SoundEngine.playWrong();
      alert(`คุณจับคู่ถูกต้อง ${correctCount} จาก ${items.length} ข้อ ลองปรับทบทวนหน้าที่สัญลักษณ์อีกครั้งครับ!`);
    }
  }

  // --- LEVEL 3 RENDERER ---
  function renderLevel3(container) {
    // Shuffle steps for level 3
    const originalSteps = [...LEVEL_DATA[3].steps];
    l3CurrentOrder = originalSteps.sort(() => Math.random() - 0.5);

    const html = `
      <div id="l3-steps-list" style="display: flex; flex-direction: column; gap: 8px;">
        ${renderL3CardsHTML()}
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn-y2k btn-signal btn-lg" onclick="GameEngine.checkLevel3()">ตรวจสอบลำดับ Flowchart ➔</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  function renderL3CardsHTML() {
    return l3CurrentOrder.map((step, idx) => `
      <div class="content-card" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
        <div style="display: flex; align-items: center; gap: 14px;">
          <span class="btn-y2k btn-amber btn-sm" style="font-size: 14px; font-weight: bold; width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%;">${idx + 1}</span>
          ${getSymbolSVG(step.shape, step.shape === 'oval' ? '#ecab37' : '#3d4f97', step.text, 180, 50)}
        </div>
        <div style="display: flex; gap: 6px;">
          <button class="btn-y2k btn-carbon btn-sm" onclick="GameEngine.moveL3Step(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>▲ ขึ้น</button>
          <button class="btn-y2k btn-carbon btn-sm" onclick="GameEngine.moveL3Step(${idx}, 1)" ${idx === l3CurrentOrder.length - 1 ? 'disabled' : ''}>▼ ลง</button>
        </div>
      </div>
    `).join('');
  }

  function moveL3Step(idx, direction) {
    SoundEngine.playClick();
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= l3CurrentOrder.length) return;

    const temp = l3CurrentOrder[idx];
    l3CurrentOrder[idx] = l3CurrentOrder[targetIdx];
    l3CurrentOrder[targetIdx] = temp;

    document.getElementById('l3-steps-list').innerHTML = renderL3CardsHTML();
  }

  function checkLevel3() {
    let isCorrect = true;
    for (let i = 0; i < l3CurrentOrder.length; i++) {
      if (l3CurrentOrder[i].id !== i + 1) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      levelScore = 150;
      SoundEngine.playCorrect();
      finishLevel(3, 150, 3);
    } else {
      SoundEngine.playWrong();
      alert('ลำดับขั้นตอนยังไม่ถูกต้อง ลองสังเกตจุดเริ่มต้น (Start) และจุดสิ้นสุด (Stop) แล้วสลับตำแหน่งใหม่นะครับ!');
    }
  }

  // --- LEVEL 4 RENDERER (Timed Challenge) ---
  function renderLevel4(container) {
    l4CurrentQuestionIdx = 0;
    renderL4Question(container);
  }

  function renderL4Question(container) {
    const qData = LEVEL_DATA[4].questions[l4CurrentQuestionIdx];
    timeLeft = 15;

    const html = `
      <div id="l4-q-wrapper">
        <div class="timer-bar-container">
          <div id="timer-bar" class="timer-bar-fill"></div>
        </div>
        <div style="text-align: right; font-weight: bold; color: var(--primary); margin-bottom: 8px;">
          ⏱️ เวลาเหลือ: <span id="timer-sec">15</span> วินาที | ข้อที่ ${l4CurrentQuestionIdx + 1} / ${LEVEL_DATA[4].questions.length}
        </div>
        <div class="content-card" style="margin-bottom: 16px;">
          <h3 style="color: var(--ink); margin-bottom: 16px;">${qData.q}</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${qData.options.map((opt, idx) => `
              <button class="btn-y2k btn-amber" style="text-align: left; justify-content: flex-start;" onclick="GameEngine.handleL4Answer(${opt.correct})">
                ${String.fromCharCode(65 + idx)}. ${opt.text}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    container.innerHTML = '';
    // Re-add progress header
    const headerHTML = `
      <div class="game-progress-header">
        <div>
          <strong style="color: var(--nav-gold);">${LEVEL_DATA[4].title}</strong>
        </div>
        <div class="star-rating">★★★</div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', headerHTML + html);

    startL4Timer();
  }

  function startL4Timer() {
    clearInterval(timerInterval);
    const bar = document.getElementById('timer-bar');
    const text = document.getElementById('timer-sec');

    timerInterval = setInterval(() => {
      timeLeft--;
      if (text) text.textContent = timeLeft;
      if (bar) {
        bar.style.width = `${(timeLeft / 15) * 100}%`;
        if (timeLeft <= 5) bar.classList.add('warning');
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        SoundEngine.playWrong();
        alert('หมดเวลาสำหรับข้อนี้! ไปยังข้อถัดไป');
        advanceL4Next();
      }
    }, 1000);
  }

  function handleL4Answer(isCorrect) {
    clearInterval(timerInterval);
    if (isCorrect) {
      SoundEngine.playCorrect();
      levelScore += 30 + timeLeft * 2;
    } else {
      SoundEngine.playWrong();
    }
    advanceL4Next();
  }

  function advanceL4Next() {
    l4CurrentQuestionIdx++;
    if (l4CurrentQuestionIdx < LEVEL_DATA[4].questions.length) {
      const container = document.getElementById('game-stage-container');
      renderL4Question(container);
    } else {
      finishLevel(4, levelScore, 3);
    }
  }

  // --- LEVEL 5 RENDERER (Mini Challenge) ---
  function renderLevel5(container) {
    l5UserChoices = {};
    const blocks = LEVEL_DATA[5].blocks;

    const html = `
      <div class="metal-plate" style="background-color: var(--canvas-soft);">
        <h4 style="margin-bottom: 12px; color: var(--carbon);">🏧 โจทย์: จงเลือกสร้างผังงาน "ขั้นตอนการถอนเงินตู้ ATM"</h4>
        
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          ${blocks.map(b => `
            <div style="display: flex; align-items: center; gap: 12px; width: 100%; max-width: 450px;">
              <span class="btn-y2k btn-carbon btn-sm">บล็อก ${b.slot}</span>
              <select class="form-select" onchange="GameEngine.handleL5Select(${b.slot}, this.value)">
                <option value="">-- เลือกขั้นตอนที่ถูกต้อง --</option>
                ${b.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
              </select>
            </div>
            ${b.slot < 5 ? `<div style="font-size: 18px; color: var(--signal);">▼</div>` : ''}
          `).join('')}
        </div>
      </div>
      <div style="margin-top: 24px; text-align: center;">
        <button class="btn-y2k btn-signal btn-lg" onclick="GameEngine.checkLevel5()">ส่งผังงานสมบูรณ์ ➔</button>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
  }

  function handleL5Select(slot, value) {
    SoundEngine.playClick();
    l5UserChoices[slot] = value;
  }

  function checkLevel5() {
    const blocks = LEVEL_DATA[5].blocks;
    let correctCount = 0;

    blocks.forEach(b => {
      if (l5UserChoices[b.slot] === b.expected) {
        correctCount++;
      }
    });

    if (correctCount === blocks.length) {
      levelScore = 200;
      SoundEngine.playVictory();
      finishLevel(5, 200, 3);
    } else {
      SoundEngine.playWrong();
      alert(`คุณต่อผังงานถูกต้อง ${correctCount} จาก ${blocks.length} บล็อก ลองทบทวนลำดับตู้ ATM อีกครั้งครับ!`);
    }
  }

  // --- FINISH LEVEL & RECORD PROGRESS ---
  function finishLevel(levelNum, score, stars) {
    SoundEngine.playVictory();

    // Update Student Record
    const current = StorageEngine.getCurrentStudent() || {
      name: 'นักเรียนทดสอบ',
      grade: 'ป.4/1',
      score: 0,
      stars: 0,
      levelsCompleted: []
    };

    let levels = current.levelsCompleted || [];
    if (typeof levels === 'string') {
      try { levels = JSON.parse(levels); } catch (e) { levels = []; }
    }
    if (!Array.isArray(levels)) levels = [];
    current.levelsCompleted = levels;

    if (!current.levelsCompleted.includes(levelNum)) {
      current.levelsCompleted.push(levelNum);
    }
    current.score = (current.score || 0) + score;
    current.stars = (current.stars || 0) + stars;

    if (current.levelsCompleted.length === 5) {
      current.certificateIssued = true;
    }

    StorageEngine.saveStudentProgress(current);

    // Ensure previous modal is closed before inserting new one
    closeModal();

    // Show Victory Modal
    const modalHTML = `
      <div class="modal-overlay active" id="level-complete-modal">
        <div class="modal-card">
          <div class="section-header-bar">
            <span>🎉 ผ่านด่านที่ ${levelNum} สำเร็จ!</span>
          </div>
          <div style="padding: 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 8px;">🏆</div>
            <h2 class="hero-display-title" style="font-size: 24px; color: var(--carbon); text-shadow: none;">ยอดเยี่ยมมาก!</h2>
            <p style="margin-bottom: 16px;">คุณได้รับ <strong>+${score} คะแนน</strong> และ <span style="color: var(--amber);">★★★ ดาว</span></p>

            <div style="display: flex; gap: 8px; justify-content: center;">
              <button class="btn-y2k btn-carbon" onclick="GameEngine.closeModal(); App.showScreen('student-map-screen')">กลับหน้าแผนที่</button>
              ${levelNum < 5 ? `<button class="btn-y2k btn-signal" onclick="GameEngine.closeModal(); GameEngine.startLevel(${levelNum + 1})">เล่นด่านถัดไป ➔</button>` : `<button class="btn-y2k btn-amber" onclick="GameEngine.closeModal(); App.showCertificate()">🎓 รับประกาศนียบัตร</button>`}
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  function closeModal() {
    const modals = document.querySelectorAll('#level-complete-modal');
    modals.forEach(modal => modal.remove());
  }

  return {
    closeModal,
    startLevel,
    handleL1SelectName,
    handleL1TargetClick,
    checkLevel1,
    handleL2SelectDesc,
    handleL2TargetClick,
    checkLevel2,
    moveL3Step,
    checkLevel3,
    handleL4Answer,
    handleL5Select,
    checkLevel5
  };
})();
