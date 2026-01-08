import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '@/hooks/auth';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const { isLoading, error, fieldErrors, login, clearError } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleInputChange = () => {
    if (error) clearError();
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.subtitle}>블로그에 오신 것을 환영합니다</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className={styles.errorAlert}>
            <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* 로그인 폼 */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* 이메일 */}
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange();
              }}
              className={`${styles.input} ${fieldErrors?.email ? styles.inputError : ''}`}
              placeholder="example@email.com"
              required
              disabled={isLoading}
            />
            {fieldErrors?.email && (
              <p className={styles.fieldError}>{fieldErrors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleInputChange();
              }}
              className={`${styles.input} ${fieldErrors?.password ? styles.inputError : ''}`}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={isLoading}
            />
            {fieldErrors?.password && (
              <p className={styles.fieldError}>{fieldErrors.password}</p>
            )}
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.loadingWrapper}>
                <svg className={styles.spinner} viewBox="0 0 24 24">
                  <circle
                    className={styles.spinnerCircle}
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                로그인 중...
              </span>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            계정이 없으신가요?{' '}
            <Link to="/signup" className={styles.link}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};