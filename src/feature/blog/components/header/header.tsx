import { useState, useEffect } from 'react';
import { HiOutlineLogin, HiOutlineLogout } from 'react-icons/hi';
import { GiNautilusShell } from 'react-icons/gi';
import styles from './Header.module.css';

interface HeaderProps {
  isLoggedIn?: boolean;
  onLoginToggle?: () => void;
}

export const Header = ({ isLoggedIn = false, onLoginToggle }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (onLoginToggle) {
      onLoginToggle();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isScrolled ? styles.scrolled : ''}`}>
          <div className={styles.headerBg} />
          
          {/* 왼쪽 영역 - 아이콘과 네비게이션 */}
          <div className={styles.leftSection}>
            <div className={styles.logoWrapper}>
              <GiNautilusShell className={styles.shellIcon} />
            </div>

            <nav className={styles.nav}>
              <button className={styles.navButton}>Develop</button>
              <button className={styles.navButton}>DevOps</button>
              <button className={styles.navButton}>DevKit</button>
            </nav>
          </div>

          {/* 오른쪽 영역 - 페이지와 로그인/로그아웃 */}
          <div className={styles.rightSection}>
            <button
              onClick={handleLoginClick}
              className={`${styles.authButton} ${isLoggedIn ? styles.logout : styles.login}`}
            >
              {isLoggedIn ? (
                <>
                  <HiOutlineLogout className={styles.authIcon} />
                  <span>로그아웃</span>
                </>
              ) : (
                <>
                  <HiOutlineLogin className={styles.authIcon} />
                  <span>로그인</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};