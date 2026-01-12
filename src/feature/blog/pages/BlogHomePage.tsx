import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import { formatDate } from '../utils';
import type { PostType } from '../types/post.enums';
import styles from './BlogHomePage.module.css';

const POST_TYPE_TABS: { value: PostType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'CORE', label: 'Core' },
  { value: 'ARCHITECTURE', label: 'Architecture' },
  { value: 'TROUBLESHOOTING', label: 'Troubleshooting' },
  { value: 'ESSAY', label: 'Essay' },
];

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
        <div className={styles.loading}>게시글을 불러오는 중...</div>
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
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.title}>Posts</h1>
          <span className={styles.count}>{pagination.totalElements}</span>
        </div>
        <p className={styles.description}>개발하면서 배운 것들을 기록합니다</p>
      </header>

      {/* PostType 탭 */}
      <nav className={styles.tabs}>
        {POST_TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tab} ${currentPostType === tab.value ? styles.active : ''}`}
            onClick={() => handleTabClick(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <div className={styles.empty}>
          <p>게시글이 없습니다</p>
        </div>
      ) : (
        <div className={styles.postList}>
          {posts.map((post) => (
            <article key={post.id} className={styles.postCard}>
              <Link to={`/post/${post.id}`} className={styles.postLink}>
                <div className={styles.postMeta}>
                  <span className={styles.postType}>{post.postType}</span>
                  <span className={styles.dot}>·</span>
                  <span className={styles.postDate}>{formatDate(post.createdAt)}</span>
                </div>

                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{post.excerpt}</p>

                {post.stacks.length > 0 && (
                  <div className={styles.postStacks}>
                    {post.stacks.map((stack) => (
                      <span key={stack} className={styles.postStack}>
                        {stack}
                      </span>
                    ))}
                  </div>
                )}

                {post.tags.length > 0 && (
                  <div className={styles.postTags}>
                    {post.tags.map((tag) => (
                      <span key={tag} className={styles.postTag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <nav className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={() => setPage(pagination.page - 1)}
            disabled={!pagination.hasPrevious}
          >
            이전
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i}
                className={`${styles.pageNumber} ${pagination.page === i ? styles.active : ''}`}
                onClick={() => setPage(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className={styles.pageButton}
            onClick={() => setPage(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            다음
          </button>
        </nav>
      )}
    </div>
  );
};