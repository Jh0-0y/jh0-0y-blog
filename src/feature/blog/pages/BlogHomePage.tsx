import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { formatDate } from '../utils';
import { Pagination } from '@/components/pagination/Pagination';
import type { PostType } from '../types/post.enums';
import { TypingBanner } from '../components/typingBanner/TypingBanner';
import styles from './BlogHomePage.module.css';

const POST_TYPE_TABS: { value: PostType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CORE', label: 'Core' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'TROUBLESHOOTING', label: 'Troubleshooting' },
  { value: 'ESSAY', label: 'Essay' },
];

// PostType별 색상
const POST_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  CORE: { bg: 'linear-gradient(135deg, #1a3a1a 0%, #0d1117 100%)', text: '#6ee7b7' },
  ARCHITECTURE: { bg: 'linear-gradient(135deg, #1a2a3a 0%, #0d1117 100%)', text: '#60a5fa' },
  TROUBLESHOOTING: { bg: 'linear-gradient(135deg, #3a2a1a 0%, #0d1117 100%)', text: '#f97316' },
  ESSAY: { bg: 'linear-gradient(135deg, #2a1a3a 0%, #0d1117 100%)', text: '#a78bfa' },
};

// PostType 아이콘
const POST_TYPE_ICONS: Record<string, string> = {
  CORE: '{ }',
  ARCHITECTURE: '⚙',
  TROUBLESHOOTING: '🔧',
  ESSAY: '✎',
};

export const BlogHomePage = () => {
  const navigate = useNavigate();
  const params = useParams<{ postType?: string; group?: string; stack?: string }>();
  const [searchParams] = useSearchParams();
  const { posts, pagination, isLoading, error, filter, setPage } = usePosts();

  // 현재 선택된 postType
  const currentPostType = filter.postType || 'ALL';

  // postType 탭 클릭 핸들러
  const handleTabClick = (type: PostType | 'ALL') => {
    const keyword = searchParams.get('q');
    const { group, stack } = params;

    let basePath = '';

    if (group && stack) {
      if (type === 'ALL') {
        basePath = `/${group}/${stack}`;
      } else {
        basePath = `/${group}/${stack}/${type.toLowerCase()}`;
      }
    } else {
      if (type === 'ALL') {
        basePath = '/';
      } else {
        basePath = `/${type.toLowerCase()}`;
      }
    }

    navigate(keyword ? `${basePath}?q=${keyword}` : basePath);
  };

  // 로딩 상태
  if (isLoading && posts.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>포스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* 배너 */}
      <TypingBanner />

      {/* 섹션 */}
      <section className={styles.sectionWrap} >
        <div className={styles.filterHeader}>
          <h2 className={styles.title}>
            Latest Posts <span className={styles.count}>({pagination.totalElements})</span>
          </h2>
          <nav className={styles.filterTabs}>
            {POST_TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                className={`${styles.filterBtn} ${currentPostType === tab.value ? styles.active : ''}`}
                onClick={() => handleTabClick(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 게시글 목록 */}
        {posts.length === 0 ? (
          <div className={styles.noResults}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <h3>검색 결과가 없습니다</h3>
            <p>다른 검색어나 필터를 시도해보세요.</p>
          </div>
        ) : (
          <div className={styles.postGrid}>
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={styles.postCard}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`post/${post.id}`} className={styles.postLink}>
                  {/* 썸네일 영역 (2/5) */}
                  <div
                    className={styles.thumbnail}
                    style={{
                      background: post.thumbnailUrl
                        ? `url(${post.thumbnailUrl}) center/cover`
                        : POST_TYPE_COLORS[post.postType]?.bg,
                    }}
                  >
                    {!post.thumbnailUrl && (
                      <span
                        className={styles.thumbnailIcon}
                        style={{ color: POST_TYPE_COLORS[post.postType]?.text }}
                      >
                        {POST_TYPE_ICONS[post.postType]}
                      </span>
                    )}
                  </div>

                  {/* 콘텐츠 영역 (3/5) */}
                  <div className={styles.cardContent}>
                    {/* 제목 */}
                    <h3 className={styles.postTitle}>{post.title}</h3>

                    {/* 설명 */}
                    <p className={styles.postExcerpt}>{post.excerpt}</p>

                    {/* 스택 */}
                    {post.stacks.length > 0 && (
                      <div className={styles.postStacks}>
                        {post.stacks.slice(0, 3).map((stack) => (
                          <span key={stack} className={styles.stackBadge}>
                            {stack}
                          </span>
                        ))}
                        {post.stacks.length > 3 && (
                          <span className={styles.stackMore}>+{post.stacks.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* 하단: 태그 + 날짜 */}
                    <div className={styles.cardFooter}>
                      <div className={styles.postTags}>
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className={styles.tagText}>
                            #{tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className={styles.tagMore}>...</span>
                        )}
                      </div>
                      <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {pagination.totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              hasNext={pagination.hasNext}
              hasPrevious={pagination.hasPrevious}
            />
          </div>
        )}
      </section>
    </div>
  );
};