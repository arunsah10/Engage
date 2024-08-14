import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null); // New state for handling errors
	const { username } = useParams();
	const showToast = useShowToast();

	useEffect(() => {
		const getUser = async () => {
			setLoading(true); // Start loading state
			setError(null);   // Reset error state
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "An error occurred"); // Throw error if response is not OK
				}
				if (data.isFrozen) {
					setUser(null);
					return;
				}
				setUser(data);
			} catch (error) {
				setError(error.message); // Set error message
				showToast("Error", error.message, "error");
			} finally {
				setLoading(false); // End loading state
			}
		};
		getUser();
	}, [username, showToast]);

	return { loading, user, error }; // Return error state
};

export default useGetUserProfile;
