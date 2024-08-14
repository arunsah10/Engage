import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewImg = () => {
	const [imgUrl, setImgUrl] = useState(null);
	const showToast = useShowToast();

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				showToast("Invalid file type", "Please select an image file", "error");
				setImgUrl(null);
				return;
			}
			
			// Optional: Check for file size (e.g., max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				showToast("File too large", "Image size should be less than 5MB", "error");
				setImgUrl(null);
				return;
			}

			const reader = new FileReader();

			reader.onloadend = () => {
				setImgUrl(reader.result);
			};

			reader.onerror = () => {
				showToast("Error", "Failed to read the file", "error");
				setImgUrl(null);
			};

			reader.readAsDataURL(file);
		}
	};

	const clearPreview = () => {
		setImgUrl(null);
	};

	return { handleImageChange, imgUrl, setImgUrl, clearPreview };
};

export default usePreviewImg;
