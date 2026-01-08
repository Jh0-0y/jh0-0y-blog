// import { useParams, useNavigate } from 'react-router-dom';
// import { FiArrowLeft, FiGithub, FiExternalLink, FiFileText, FiUsers, FiUser, FiCalendar, FiTrendingUp, FiSun, FiMoon } from 'react-icons/fi';

// import { SkillBadge } from '@/components';
// import { useDarkMode } from '@/hooks';
// import styles from './ProjectDetailPage.module.css';
// import { aboutData, getAchievementsByProjectId, getProjectById } from '../constants';

// export const ProjectDetailPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { darkMode, toggleDarkMode } = useDarkMode();
//   const project = id ? getProjectById(id) : undefined;

//   // 해당 프로젝트의 성과 필터링
//   const projectAchievements = id ? getAchievementsByProjectId(id) : [];

//   const DetailHeader = () => (
//     <header className={styles.header}>
//       <button onClick={() => navigate('/')} className={styles.backButton}>
//         <FiArrowLeft size={18} />
//         <span>{aboutData.name}</span>
//       </button>
//       <button
//         className={styles.themeButton}
//         onClick={toggleDarkMode}
//         title={darkMode ? '라이트 모드' : '다크 모드'}
//       >
//         {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
//       </button>
//     </header>
//   );

//   if (!project) {
//     return (
//       <div className={styles.page}>
//         <DetailHeader />
//         <main className={styles.notFound}>
//           <h1>프로젝트를 찾을 수 없습니다</h1>
//           <button onClick={() => navigate('/')} className={styles.backButton}>
//             <FiArrowLeft size={18} />
//             돌아가기
//           </button>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.page}>
//       <DetailHeader />

//       <main className={styles.main}>
//         <div className={styles.container}>
//           {/* 프로젝트 헤더 */}
//           <div className={styles.projectHeader}>
//             <div className={styles.meta}>
//               <span className={styles.period}>
//                 <FiCalendar size={14} />
//                 {project.period}
//               </span>
//               <span className={styles.type}>
//                 {project.isTeamProject ? (
//                   <>
//                     <FiUsers size={14} />
//                     팀 프로젝트 ({project.teamSize}명)
//                   </>
//                 ) : (
//                   <>
//                     <FiUser size={14} />
//                     개인 프로젝트
//                   </>
//                 )}
//               </span>
//             </div>
//             <h1 className={styles.title}>{project.title}</h1>
//             <p className={styles.role}>{project.role}</p>

//             <div className={styles.links}>
//               {project.links.github && (
//                 <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
//                   <FiGithub size={18} />
//                   GitHub
//                 </a>
//               )}
//               {project.links.demo && (
//                 <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className={`${styles.link} ${styles.primary}`}>
//                   <FiExternalLink size={18} />
//                   Demo
//                 </a>
//               )}
//               {project.links.notion && (
//                 <a href={project.links.notion} target="_blank" rel="noopener noreferrer" className={styles.link}>
//                   <FiFileText size={18} />
//                   문서
//                 </a>
//               )}
//             </div>
//           </div>

//           {/* 기술 스택 */}
//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>기술 스택</h2>
//             <div className={styles.techStack}>
//               {project.techStack.map((tech) => (
//                 <SkillBadge key={tech} name={tech} size="lg" />
//               ))}
//             </div>
//           </section>

//           {/* 프로젝트 소개 */}
//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>프로젝트 소개</h2>
//             <p className={styles.text}>{project.description}</p>
//           </section>

//           {/* 배경 */}
//           {project.background && (
//             <section className={styles.section}>
//               <h2 className={styles.sectionTitle}>프로젝트 배경</h2>
//               <p className={styles.text}>{project.background}</p>
//             </section>
//           )}

//           {/* 문제 해결 */}
//           {project.challenges && project.challenges.length > 0 && (
//             <section className={styles.section}>
//               <h2 className={styles.sectionTitle}>문제 해결 과정</h2>
//               <div className={styles.challenges}>
//                 {project.challenges.map((challenge, index) => (
//                   <div key={index} className={styles.challenge}>
//                     <div className={styles.challengeItem}>
//                       <span className={styles.labelProblem}>문제</span>
//                       <p>{challenge.problem}</p>
//                     </div>
//                     <div className={styles.challengeItem}>
//                       <span className={styles.labelSolution}>해결</span>
//                       <p>{challenge.solution}</p>
//                     </div>
//                     {challenge.result && (
//                       <div className={styles.challengeItem}>
//                         <span className={styles.labelResult}>결과</span>
//                         <p>{challenge.result}</p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* 주요 성과 */}
//           <section className={styles.section}>
//             <h2 className={styles.sectionTitle}>주요 성과</h2>
//             <ul className={styles.list}>
//               {project.highlights.map((highlight, index) => (
//                 <li key={index}>{highlight}</li>
//               ))}
//             </ul>
//           </section>

//           {/* 프로젝트 성과 & 기여 (achievements에서 가져옴) */}
//           {projectAchievements.length > 0 && (
//             <section className={styles.section}>
//               <h2 className={styles.sectionTitle}>
//                 <FiTrendingUp size={20} />
//                 성과 & 기여
//               </h2>
//               <div className={styles.achievements}>
//                 {projectAchievements.map((ach) => (
//                   <div key={ach.id} className={styles.achievement}>
//                     <h4 className={styles.achievementTitle}>{ach.title}</h4>
//                     <p className={styles.achievementDesc}>{ach.description}</p>
//                     {ach.metrics && (
//                       <p className={styles.metrics}>📊 {ach.metrics}</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* 결과 */}
//           {project.results && project.results.length > 0 && (
//             <section className={styles.section}>
//               <h2 className={styles.sectionTitle}>결과</h2>
//               <ul className={styles.list}>
//                 {project.results.map((result, index) => (
//                   <li key={index}>{result}</li>
//                 ))}
//               </ul>
//             </section>
//           )}

//           {/* 배운 점 */}
//           {project.learned && project.learned.length > 0 && (
//             <section className={styles.section}>
//               <h2 className={styles.sectionTitle}>배운 점</h2>
//               <ul className={styles.list}>
//                 {project.learned.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ul>
//             </section>
//           )}

//           {/* 하단 네비게이션 */}
//           <footer className={styles.footer}>
//             <button onClick={() => navigate('/portfolio')} className={styles.backButton}>
//               <FiArrowLeft size={18} />
//               프로젝트 목록으로
//             </button>
//           </footer>
//         </div>
//       </main>
//     </div>
//   );
// };
