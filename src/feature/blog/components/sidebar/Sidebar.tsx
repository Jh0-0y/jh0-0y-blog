import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useStacksSidebar } from '../../hooks/useStacksSidebar';
import { STACK_GROUP_LABELS, STACK_GROUP_ORDER } from '../../types/stack.enums';
import type { StackGroup } from '../../types/stack.enums';
import { SearchBar } from './SearchBar';
import styles from './Sidebar.module.css';
import { LogoutButton } from '@/components/logoutButton/LogoutButton';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const params = useParams<{ postType?: string; group?: string; stack?: string }>();
  const [searchParams] = useSearchParams();
  const { popularStacks, groupedStacks, isLoading } = useStacksSidebar();

  // 현재 선택된 스택 (URL path에서 읽기)
  const selectedStack = params.stack || null;
  const selectedGroup = params.group || null;

  // 스택 클릭 핸들러
  const handleStackClick = (stackName: string, stackGroup: StackGroup) => {
    const groupPath = stackGroup.toLowerCase();
    const keyword = searchParams.get('q');

    // 이미 선택된 스택이면 해제 (홈으로)
    if (selectedStack === stackName) {
      navigate(keyword ? `/?q=${keyword}` : '/');
    } else {
      // 새 스택 선택
      const basePath = `/${groupPath}/${stackName}`;
      navigate(keyword ? `${basePath}?q=${keyword}` : basePath);
    }
  };

  // 인기 스택 클릭 (그룹 정보가 없으므로 groupedStacks에서 찾아야 함)
  const handlePopularStackClick = (stackName: string) => {
    if (selectedStack === stackName) {
      const keyword = searchParams.get('q');
      navigate(keyword ? `/?q=${keyword}` : '/');
      return;
    }

    // groupedStacks에서 해당 스택의 그룹 찾기
    if (groupedStacks) {
      for (const group of STACK_GROUP_ORDER) {
        const stacks = groupedStacks[group];
        if (stacks?.some((s) => s.name === stackName)) {
          const groupPath = group.toLowerCase();
          const keyword = searchParams.get('q');
          const basePath = `/${groupPath}/${stackName}`;
          navigate(keyword ? `${basePath}?q=${keyword}` : basePath);
          return;
        }
      }
    }
  };

  // 필터 초기화
  const handleClearFilter = () => {
    navigate('/');
  };

  // 활성 필터 여부
  const hasActiveFilter = !!selectedStack || !!params.postType || searchParams.has('q');

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* 프로필 카드 */}
        <div className={styles.profileCard}>
          <Link to="/" className={styles.profileLink}>
            <div className={styles.avatarWrapper}>
              <img src="/images/profile.png" alt="Profile" className={styles.avatar} />
            </div>
            <h1 className={styles.name}>정현영</h1>
            <p className={styles.role}>Junior Backend Developer</p>
          </Link>
          <LogoutButton />
        </div>

        {/* 검색 */}
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>

        {/* 스크롤 영역 */}
        <div className={styles.scrollArea}>
          {isLoading ? (
            <div className={styles.loading}>로딩중...</div>
          ) : (
            <>
              {/* 인기 스택 */}
              {popularStacks.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Popular Stacks</h3>
                  <div className={styles.popularStacks}>
                    {popularStacks.map((stack) => (
                      <button
                        key={stack.id}
                        className={`${styles.popularStack} ${
                          selectedStack === stack.name ? styles.active : ''
                        }`}
                        onClick={() => handlePopularStackClick(stack.name)}
                      >
                        <span className={styles.tagRank}>{stack.rank}</span>
                        <span className={styles.tagName}>{stack.name}</span>
                        <span className={styles.tagCount}>{stack.postCount}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 전체 스택 (그룹별) */}
              {groupedStacks && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>All Stacks</h3>

                  {STACK_GROUP_ORDER.map((group) => {
                    const stacks = groupedStacks[group];

                    // 해당 그룹에 스택이 없으면 스킵
                    if (!stacks || stacks.length === 0) return null;

                    return (
                      <div key={group} className={styles.tagGroup}>
                        <div className={styles.groupHeader}>
                          <span className={`${styles.groupDot} ${styles[group.toLowerCase()]}`} />
                          <span className={styles.groupLabel}>{STACK_GROUP_LABELS[group]}</span>
                        </div>
                        <div className={styles.groupStacks}>
                          {stacks.map((stack) => (
                            <button
                              key={stack.id}
                              className={`${styles.tag} ${
                                selectedStack === stack.name ? styles.active : ''
                              }`}
                              onClick={() => handleStackClick(stack.name, group)}
                            >
                              <span>{stack.name}</span>
                              <span className={styles.tagCountSmall}>{stack.postCount}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 필터 초기화 버튼 */}
              {hasActiveFilter && (
                <div className={styles.section}>
                  <button className={styles.clearFilter} onClick={handleClearFilter}>
                    필터 초기화
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 모바일 닫기 버튼 */}
        <button className={styles.closeButton} onClick={onClose}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </aside>
    </>
  );
};