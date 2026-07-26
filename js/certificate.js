/* ==========================================================================
   Certificate Generation Engine (Print & PDF/PNG Download)
   ========================================================================== */

const CertificateEngine = (() => {
  function renderCertificate(student, containerId = 'certificate-render-target') {
    const target = document.getElementById(containerId);
    if (!target) return;

    const todayStr = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const certHTML = `
      <div class="certificate-frame">
        <div style="border: 2px solid #c5a059; padding: 20px;">
          <!-- Header Logo / Watermark -->
          <div style="font-family: 'Press Start 2P', monospace; font-size: 14px; color: #7a8aba; margin-bottom: 8px;">★ FLOWCHART MASTER ACADEMY ★</div>
          <h1 style="font-family: 'Kanit', sans-serif; font-size: 26px; color: #21242e; margin-bottom: 4px;">ประกาศนียบัตรเชิดชูเกียรติ</h1>
          <p style="font-size: 14px; color: #5a5f8c; margin-bottom: 20px;">CERTIFICATE OF FLOWCHART EXCELLENCE</p>

          <p style="font-size: 14px; color: #333;">มอบให้ไว้เพื่อแสดงว่า</p>

          <!-- Student Name -->
          <h2 style="font-family: 'Kanit', sans-serif; font-size: 28px; color: #e60012; border-bottom: 2px dashed #c5a059; display: inline-block; padding: 0 20px 4px 20px; margin: 12px 0;">
            ${student.name || 'เด็กหญิง/เด็กชาย นักเรียนทดสอบ'}
          </h2>
          <p style="font-size: 14px; font-weight: bold; color: #3d4f97; margin-bottom: 16px;">ชั้นเรียน: ${student.grade || 'ป.4/1'}</p>

          <p style="font-size: 13px; max-width: 500px; margin: 0 auto 20px auto; line-height: 1.6; color: #444;">
            ได้ผ่านการทดสอบทักษะกระบวนการคิดเชิงคำนวณและสัญลักษณ์ Flowchart <br>
            <strong>ครบทั้ง 5 ด่านการเรียนรู้</strong> ด้วยคะแนนสะสม 
            <span style="color: #f68d1f; font-weight: bold;">${student.score || 0} คะแนน</span> 
            และได้รับดาวสะสม <span style="color: #ecab37; font-weight: bold;">${student.stars || 15} ★</span>
          </p>

          <!-- Seal Icon -->
          <div style="display: flex; justify-content: space-around; align-items: center; margin-top: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 11px; color: #666; border-top: 1px solid #aaa; padding-top: 4px; width: 140px;">วันที่ออกประกาศนียบัตร</div>
              <div style="font-size: 12px; font-weight: bold; color: #21242e;">${todayStr}</div>
            </div>

            <div style="width: 70px; height: 70px; border-radius: 50%; background-color: #ecab37; border: 4px double #ffffff; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
              🎖️
            </div>

            <div style="text-align: center;">
              <div style="font-size: 11px; color: #666; border-top: 1px solid #aaa; padding-top: 4px; width: 160px;">ผู้รับรอง / ครูผู้สอน</div>
              <div style="font-size: 12px; font-weight: bold; color: #21242e;">ครูรัตนา โศภิตประสาน</div>
              <div style="font-size: 10px; color: #555;">โรงเรียนบ้าน กม.ห้า</div>
            </div>
          </div>
        </div>
      </div>
    `;

    target.innerHTML = certHTML;
  }

  function printCertificate() {
    window.print();
  }

  return {
    renderCertificate,
    printCertificate
  };
})();
