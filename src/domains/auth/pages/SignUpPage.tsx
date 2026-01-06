import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useSignUp } from '../hooks';
import styles from './SignUpPage.module.css';

export const SignUpPage = () => {
  const { isLoading, error, fieldErrors, signUp, clearError } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 길이 검증
    if (password.length < 8 || password.length > 20) {
      setLocalError('비밀번호는 8~20자로 입력해주세요.');
      return;
    }

    await signUp({ email, password, nickname });
  };

  const handleInputChange = () => {
    if (error) clearError();
    if (localError) setLocalError(null);
  };

  const displayError = localError || error;

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        {/* 헤더 */}
        <div className={styles.header}>
          <h1 className={styles.title}>회원가입</h1>
          <p className={styles.subtitle}>새로운 계정을 만들어보세요</p>
        </div>

        {/* 에러 메시지 */}
        {displayError && (
          <div className={styles.errorAlert}>
            <svg className={styles.errorIcon} viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{displayError}</span>
          </div>
        )}

        {/* 회원가입 폼 */}
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

          {/* 닉네임 */}
          <div className={styles.inputGroup}>
            <label htmlFor="nickname" className={styles.label}>
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                handleInputChange();
              }}
              className={`${styles.input} ${fieldErrors?.nickname ? styles.inputError : ''}`}
              placeholder="2~20자로 입력하세요"
              required
              disabled={isLoading}
              minLength={2}
              maxLength={20}
            />
            {fieldErrors?.nickname && (
              <p className={styles.fieldError}>{fieldErrors.nickname}</p>
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
              placeholder="8~20자로 입력하세요"
              required
              disabled={isLoading}
            />
            {fieldErrors?.password && (
              <p className={styles.fieldError}>{fieldErrors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                handleInputChange();
              }}
              className={`${styles.input} ${
                confirmPassword && password !== confirmPassword ? styles.inputError : ''
              }`}
              placeholder="비밀번호를 다시 입력하세요"
              required
              disabled={isLoading}
            />
            {confirmPassword && password !== confirmPassword && (
              <p className={styles.fieldError}>비밀번호가 일치하지 않습니다</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
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
                가입 중...
              </span>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className={styles.link}>
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};