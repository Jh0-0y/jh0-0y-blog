import { SearchBar } from './SearchBar';
import { ProfileCard } from './ProfileCard';
import { StackList } from './StackList';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  return (
      <div className={styles.sidebar} >
        {/* 프로필 카드 */}
        <ProfileCard />

        {/* 검색 */}
        <SearchBar />

        {/* 스크롤 영역 */}
        <StackList />
      </div>
  );
};