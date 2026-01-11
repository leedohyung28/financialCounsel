// [인증] 버튼 -> 최종 완료
export const handleVerifyOtp = async (timer, otp, setIsCompleted) => {
  if (timer === 0) {
    alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
    return false;
  }

  if (otp === "000000") {
    return true;
  } else {
    alert("인증번호가 일치하지 않습니다.");
    return false;
  }
};

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? `0${s}` : s}`;
};

// [전송 / 재전송] 버튼
export const handleSendOtp = (phoneNum, setIsOtpSent, setTimer) => {
  if (!phoneNum) {
    alert("전화번호를 입력해주세요.");
    return;
  }
  setIsOtpSent(true);
  setTimer(180);
  alert("인증번호가 발송되었습니다.");
};

// [인증 확인 핸들러] 수정
export const onVerifyOtp = async (otp, timer) => {
  // 1. 먼저 OTP 번호가 입력되었는지 확인
  if (!otp) {
    alert("인증번호를 입력해주세요.");
    return;
  }

  // 인증 시도 (기존 handleVerifyOtp 로직 활용)
  const isSuccess = await handleVerifyOtp(timer, otp, () => {});

  if (isSuccess) {
    return true;
  } else {
    return false;
  }
};
