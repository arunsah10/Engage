import { Button, Text, useDisclosure, Spinner, Flex } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { useState } from "react";

export const SettingsPage = () => {
	const showToast = useShowToast();
	const logout = useLogout();
	const [loading, setLoading] = useState(false);

	const freezeAccount = async () => {
		if (!window.confirm("Are you sure you want to freeze your account?")) return;

		setLoading(true);
		try {
			const res = await fetch("/api/users/freeze", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
			});
			const data = await res.json();

			if (data.error) {
				showToast("Error", data.error, "error");
			} else if (data.success) {
				await logout();
				showToast("Success", "Your account has been frozen", "success");
			}
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Flex direction="column" align="center" p={4}>
			<Text my={4} fontWeight={"bold"} fontSize="lg">
				Freeze Your Account
			</Text>
			<Text my={2} textAlign="center">
				You can unfreeze your account anytime by logging in.
			</Text>
			<Button
				size={"sm"}
				colorScheme='red'
				onClick={freezeAccount}
				isLoading={loading}
				loadingText="Freezing"
			>
				Freeze
			</Button>
		</Flex>
	);
};
