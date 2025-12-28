import { useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();

  return {
    goToLogin: () => navigate("/LoginPage"),
    goToSignUp: () => navigate("/SignUpPage"),
    goToFindAccount: () => navigate("/FindAccountPage"),
    goToAddressHome: () => navigate("/AddressHomePage"),
    goToAddressSearch: () => navigate("/AddressSearchPage"),
    goBack: () => navigate(-1), // 이전 페이지로
    goToMain: () => navigate("/"),
    // 인자가 필요한 경우
    goToProfile: (userId) => navigate(`/profile/${userId}`),
  };
}
