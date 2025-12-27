// [인증] 버튼 -> 최종 완료
export const handleVerifyOtp = (timer, otp, setIsCompleted) => {
  if (timer === 0) {
    alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    return;
  }
  if (otp === "000000") {
    // 예시 번호
    setIsCompleted(true);
  } else {
    alert("인증번호가 일치하지 않습니다.");
  }
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? `0${s}` : s}`;
};
