import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/authAtom";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

const Header = () => {
	const { colorMode, toggleColorMode } = useColorMode();
	const user = useRecoilValue(userAtom);
	const logout = useLogout();
	const setAuthScreen = useSetRecoilState(authScreenAtom);

	return (
		<Flex justifyContent="space-between" mt={6} mb={12} alignItems="center">
			{user ? (
				<Link as={RouterLink} to="/">
					<AiFillHome size={24} aria-label="Home" />
				</Link>
			) : (
				<Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("login")}>
					Login
				</Link>
			)}

			<Image
				cursor="pointer"
				alt="Logo"
				w={6}
				src={colorMode === "dark" ? "/bulb-3662.svg" : "/light-on-bulb-dark-mode-21622.svg"}
				onClick={toggleColorMode}
				aria-label="Toggle color mode"
			/>

			{user ? (
				<Flex alignItems="center" gap={4}>
					<Link as={RouterLink} to={`/${user.username}`} aria-label="Profile">
						<RxAvatar size={24} />
					</Link>
					<Link as={RouterLink} to="/chat" aria-label="Chat">
						<BsFillChatQuoteFill size={20} />
					</Link>
					<Link as={RouterLink} to="/settings" aria-label="Settings">
						<MdOutlineSettings size={20} />
					</Link>
					<Button size="xs" onClick={logout} aria-label="Logout">
						<FiLogOut size={20} />
					</Button>
				</Flex>
			) : (
				<Link as={RouterLink} to="/auth" onClick={() => setAuthScreen("signup")}>
					Sign up
				</Link>
			)}
		</Flex>
	);
};

export default Header;
