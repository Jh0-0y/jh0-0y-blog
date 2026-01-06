import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar, ToastContainer } from '../components';
import { useBlogData } from '../../../hooks/blog';
import { useBlogStore } from '../../../stores/blog';
import styles from './BlogLayout.module.css';

export const BlogLayout = () => {
  const navigate = useNavigate();
  const { tagsByGroup, popularTags } = useBlogData();
  const {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    isSidebarOpen,
    closeSidebar,
  } = useBlogStore();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    navigate(`/blog/tags/${tag}`);
  };

  const handleHomeClick = () => {
    setSelectedTag(null);
    setSearchQuery('');
    navigate('/blog');
  };

  const handleWriteClick = () => {
    navigate('/blog/write');
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        popularTags={popularTags}
        tagsByGroup={tagsByGroup}
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        onTagSelect={handleTagSelect}
        onHomeClick={handleHomeClick}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <main className={styles.main}>
        <Outlet />
      </main>

      {/* 모바일 메뉴 버튼 */}
      <MobileMenuButton />

      {/* 글쓰기 버튼 (FAB) */}
      <button onClick={handleWriteClick} className={styles.writeButton}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>글쓰기</span>
      </button>

      {/* 토스트 컨테이너 */}
      <ToastContainer />
    </div>
  );
};

const MobileMenuButton = () => {
  const { toggleSidebar } = useBlogStore();

  return (
    <button className={styles.mobileMenuButton} onClick={toggleSidebar}>
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};
