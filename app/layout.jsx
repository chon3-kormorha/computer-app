import './globals.css';

export const metadata = {
  title: 'Flowchart Game - แอปเรียนรู้ผังงานสำหรับนักเรียน (PWA)',
  description: 'สื่อการเรียนรู้สาระเทคโนโลยี (วิทยาการคำนวณ) ระดับชั้นประถมศึกษาปีที่ 4 และ 5 โรงเรียนบ้าน กม.ห้า',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body class="bg-halftone">
        <div id="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
