import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiOutlineMenuAlt2 } from 'react-icons/hi';
import { Sidebar, WriteButton } from '../components';
import styles from './BlogLayout.module.css';
import { Header } from '../components/header/header';

export const BlogLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <aside className={`${styles.aside} ${isSidebarOpen ? styles.open :''}`}>
        <Sidebar />
      </aside>

      {/* 모바일 오버레이 */}
      {isSidebarOpen && <div className={styles.overlay} onClick={handleCloseSidebar} />}

      {/* 모바일 메뉴 버튼 */}
      <button
        className={styles.mobileMenuButton}
        onClick={handleOpenSidebar}
        aria-label="메뉴 열기"
      >
        <HiOutlineMenuAlt2 />
      </button>
      {/* 글쓰기 버튼 (FAB) */}
      <WriteButton />
    </div>
  );
};