import { useState } from "react";
import useShowToast from "./useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

const useFollowUnfollow = (user) => {
	const currentUser = useRecoilValue(userAtom);
	const [isFollowing, setIsFollowing] = useState(user.followers.includes(currentUser?._id));
	const [isUpdating, setIsUpdating] = useState(false);
	const showToast = useShowToast();

	const handleFollowUnfollow = async () => {
		if (!currentUser) {
			showToast("Error", "Please login to follow", "error");
			return;
		}
		if (isUpdating) return;

		setIsUpdating(true);
		try {
			const res = await fetch(`/api/users/follow/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}

			setIsFollowing((prev) => !prev);
			showToast("Success", isFollowing ? `Unfollowed ${user.name}` : `Followed ${user.name}`, "success");

			// Consider refetching user data to keep state in sync
			// Example: const updatedUser = await fetchUser(user._id);
			// setUser(updatedUser);

		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setIsUpdating(false);
		}
	};

	return { handleFollowUnfollow, isUpdating, isFollowing };
};

export default useFollowUnfollow;
