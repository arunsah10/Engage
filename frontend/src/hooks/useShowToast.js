import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
	const toast = useToast();

	const showToast = useCallback(
		(title, description, status, duration = 3000, isClosable = true) => {
			toast({
				title,
				description,
				status,
				duration,
				isClosable,
			});
		},
		[toast]
	);

	return showToast;
};

export default useShowToast;
