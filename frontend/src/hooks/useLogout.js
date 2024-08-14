import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import useShowToast from "./useShowToast";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();
	const navigate = useNavigate(); // Initialize navigate for redirection

	const logout = async () => {
		try {
			const res = await fetch("/api/users/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (!res.ok || data.error) {
				showToast("Error", data.error || "An error occurred during logout", "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);

			// Optional: Clear cookies if applicable
			// document.cookie.split(";").forEach((c) => (document.cookie = c.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"));

			navigate("/login"); // Redirect to login page or any other page
		} catch (error) {
			showToast("Error", error.message || "An unexpected error occurred", "error");
		}
	};

	return logout;
};

export default useLogout;
