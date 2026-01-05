/**
 * 이메일 유효성 검사 정규식
 * 형식: test@example.com
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 비밀번호 유효성 검사 정규식
 * 규칙: 영문, 숫자, 특수문자 포함 8자 이상
 */
export const pwRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

/**
 * 휴대폰 번호 자동 포매팅 함수
 * @param {string} value - 입력된 문자열
 * @returns {string} - 숫자만 추출하여 000-000-0000 또는 000-0000-0000 형식으로 반환
 */
export const formatPhone = (value) => {
  // 숫자 이외의 문자 제거
  const nums = value.replace(/[^\d]/g, "");

  if (nums.length <= 3) return nums;
  // 4~6자: 000-000
  if (nums.length <= 6) return `${nums.slice(0, 3)}-${nums.slice(3)}`;
  // 7~10자: 000-000-0000 (구형 번호 대응)
  if (nums.length <= 10) {
    return `${nums.slice(0, 3)}-${nums.slice(3, 6)}-${nums.slice(6)}`;
  }
  // 11자 이상: 000-0000-0000 (표준 번호)
  return `${nums.slice(0, 3)}-${nums.slice(3, 7)}-${nums.slice(7, 11)}`;
};

/**
 * 생년월일 자동 포매팅 함수
 * @param {string} value - 입력된 문자열
 * @returns {string} - 숫자만 추출하여 XXXX-XX-XX 형식으로 반환
 */
export const formatBirth = (value) => {
  // 숫자 이외의 문자 제거
  const nums = value.replace(/[^\d]/g, "");

  if (nums.length <= 4) return nums;
  // 5~6자: XXXX-XX
  if (nums.length <= 6) return `${nums.slice(0, 4)}-${nums.slice(4)}`;
  // 7~8자: XXXX-XX-XX
  return `${nums.slice(0, 4)}-${nums.slice(4, 6)}-${nums.slice(6, 8)}`;
};

/**
 * 생년월일 논리 유효성 검증 함수
 * @param {string} birth - XXXX-XX-XX 형식의 날짜 문자열
 * @returns {boolean} - 실제 존재하는 날짜이며 범위(1900년~현재)가 맞는지 여부
 */
export const validateBirth = (birth) => {
  // 1차: 정규식 기본 형식 체크
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(birth)) return false;

  // 년, 월, 일을 숫자로 분리
  const [year, month, day] = birth.split("-").map(Number);
  // 자바스크립트 Date 객체 생성 (Month는 0부터 시작하므로 -1)
  const date = new Date(year, month - 1, day);

  /**
   * Date 객체의 자동 보정 기능 방지 검증
   * 예: '2023-02-31' 입력 시 Date 객체는 자동으로 '2023-03-03'으로 변환됨.
   * 이를 원래 입력값과 비교하여 존재하지 않는 날짜(윤달 등)를 판별함.
   */
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    year > 1900 && // 1900년 이후 출생자만 허용
    year <= new Date().getFullYear() // 미래 날짜 방지
  );
};

/**
 * 파일 업로드 용량 제한 체크 함수
 * @param {File} file - input 태그를 통해 선택된 파일 객체
 * @param {number} maxSizeMB - 허용할 최대 용량 (기본값: 10MB)
 * @returns {boolean} - 제한 용량 준수 여부 (초과 시 경고창 노출)
 */
export const checkFileSize = (file, maxSizeMB = 10) => {
  if (!file) return false;

  // MB 단위를 Byte 단위로 환산
  const maxSize = maxSizeMB * 1024 * 1024;

  if (file.size > maxSize) {
    alert(`${maxSizeMB}MB 이하의 파일을 업로드해주세요.`);
    return false;
  }
  return true;
};
