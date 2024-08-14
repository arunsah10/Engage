import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Stack,
	useColorModeValue,
	Avatar,
	Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UpdateProfilePage() {
	const [user, setUser] = useRecoilState(userAtom);
	const [inputs, setInputs] = useState({
		name: user.name || "",
		username: user.username || "",
		email: user.email || "",
		bio: user.bio || "",
		password: "",
	});
	const fileRef = useRef(null);
	const [updating, setUpdating] = useState(false);

	const showToast = useShowToast();
	const { handleImageChange, imgUrl } = usePreviewImg();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (updating) return;
		setUpdating(true);
		try {
			const res = await fetch(`/api/users/update/${user._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Profile updated successfully", "success");
			setUser(data);
			localStorage.setItem("user-threads", JSON.stringify(data));
			// Optional: Reset form or redirect
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setUpdating(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<Flex align={"center"} justify={"center"} my={6} p={4}>
				<Stack
					spacing={4}
					w={"full"}
					maxW={"lg"}
					bg={useColorModeValue("white", "gray.700")}
					rounded={"xl"}
					boxShadow={"xl"}
					p={8}
					borderWidth={1}
					borderColor={useColorModeValue("gray.200", "gray.600")}
				>
					<Heading lineHeight={1.2} fontSize={{ base: "xl", sm: "2xl" }}>
						Update Profile
					</Heading>
					<FormControl>
						<Stack direction={["column", "row"]} spacing={4} align="center">
							<Center>
								<Avatar
									size='xl'
									boxShadow={"lg"}
									src={imgUrl || user.profilePic}
								/>
							</Center>
							<Center>
								<Button
									w='full'
									colorScheme="teal"
									onClick={() => fileRef.current.click()}
								>
									Change Avatar
								</Button>
								<Input
									type='file'
									hidden
									ref={fileRef}
									onChange={handleImageChange}
								/>
							</Center>
						</Stack>
					</FormControl>
					<FormControl>
						<FormLabel>Full Name</FormLabel>
						<Input
							placeholder='John Doe'
							value={inputs.name}
							onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
							borderRadius="md"
							borderColor={useColorModeValue("gray.300", "gray.600")}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Username</FormLabel>
						<Input
							placeholder='johndoe'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
							borderRadius="md"
							borderColor={useColorModeValue("gray.300", "gray.600")}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Email Address</FormLabel>
						<Input
							placeholder='your-email@example.com'
							value={inputs.email}
							onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='email'
							borderRadius="md"
							borderColor={useColorModeValue("gray.300", "gray.600")}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Bio</FormLabel>
						<Input
							placeholder='Your bio.'
							value={inputs.bio}
							onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='text'
							borderRadius="md"
							borderColor={useColorModeValue("gray.300", "gray.600")}
						/>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Input
							placeholder='New password'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							_placeholder={{ color: "gray.500" }}
							type='password'
							borderRadius="md"
							borderColor={useColorModeValue("gray.300", "gray.600")}
						/>
					</FormControl>
					<Stack spacing={4} direction={["column", "row"]}>
						<Button
							bg={"red.400"}
							color={"white"}
							w='full'
							_hover={{ bg: "red.500" }}
							borderRadius="md"
						>
							Cancel
						</Button>
						<Button
							bg={"green.400"}
							color={"white"}
							w='full'
							_hover={{ bg: "green.500" }}
							type='submit'
							isLoading={updating}
							borderRadius="md"
						>
							Submit
						</Button>
					</Stack>
				</Stack>
			</Flex>
		</form>
	);
}
