export const handleRandomName = (setForm, setIsNameError) => {
  const adjectives = [
    "꾸준한",
    "잘생긴",
    "멋진",
    "못생긴",
    "얌전한",
    "발랄한",
    "신중한",
    "용감한",
    "영리한",
    "행복한",
    "즐거운",
    "고독한",
    "친절한",
    "냉철한",
    "화끈한",
    "차분한",
    "활기찬",
    "유연한",
    "강력한",
    "온화한",
    "예리한",
    "평화로운",
    "열정적인",
    "듬직한",
    "날렵한",
    "똑똑한",
    "인자한",
    "순수한",
    "진지한",
    "유쾌한",
  ];

  const nouns = [
    "개구리",
    "할아버지",
    "마피아",
    "호랑이",
    "사자",
    "토끼",
    "다람쥐",
    "독수리",
    "거북이",
    "고래",
    "펭귄",
    "판다",
    "기린",
    "코끼리",
    "원숭이",
    "강아지",
    "고양이",
    "너구리",
    "여우",
    "늑대",
    "요리사",
    "탐험가",
    "낚시꾼",
    "우주인",
    "과학자",
    "해적",
    "닌자",
    "기사",
    "마법사",
    "도사",
    "나무",
    "구름",
    "태양",
    "달빛",
    "바람",
    "바다",
    "산울림",
    "별똥별",
    "불꽃",
    "번개",
    "자동차",
    "비행기",
    "자전거",
    "기차",
    "로봇",
    "드론",
    "컴퓨터",
    "키보드",
    "안경",
    "시계",
  ];

  // 형용사 랜덤 선택
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  // 명사 랜덤 선택
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  // 숫자 0~99 랜덤 생성 (두 자리 숫자로 맞춤)
  const num = Math.floor(Math.random() * 100);

  // 최종 조합: "형용사 명사 숫자" (예: "꾸준한 개구리 45")
  // 만약 띄어쓰기 없이 6글자 내외를 맞추고 싶다면 아래 형식을 조정하세요.
  const randomName = `${adj}${noun}${num}`;

  setForm((prev) => ({ ...prev, name: randomName }));
  if (setIsNameError) setIsNameError(false);
};
