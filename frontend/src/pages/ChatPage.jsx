import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
	const [searchingUser, setSearchingUser] = useState(false);
	const [loadingConversations, setLoadingConversations] = useState(true);
	const [searchText, setSearchText] = useState("");
	const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
	const [conversations, setConversations] = useRecoilState(conversationsAtom);
	const currentUser = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const { socket, onlineUsers } = useSocket();

	useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);

	useEffect(() => {
		const getConversations = async () => {
			setLoadingConversations(true);
			try {
				const res = await fetch("/api/messages/conversations");
				if (!res.ok) throw new Error("Failed to fetch conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [showToast, setConversations]);

	const handleConversationSearch = async (e) => {
		e.preventDefault();
		if (!searchText.trim()) {
			showToast("Error", "Please enter a username to search", "error");
			return;
		}

		setSearchingUser(true);
		try {
			const res = await fetch(`/api/users/profile/${searchText}`);
			if (!res.ok) throw new Error("Failed to search for user");
			const searchedUser = await res.json();
			if (searchedUser.error) {
				showToast("Error", searchedUser.error, "error");
				return;
			}

			const messagingYourself = searchedUser._id === currentUser._id;
			if (messagingYourself) {
				showToast("Error", "You cannot message yourself", "error");
				return;
			}

			const conversationAlreadyExists = conversations.find(
				(conversation) => conversation.participants[0]._id === searchedUser._id
			);

			if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchedUser._id,
					username: searchedUser.username,
					userProfilePic: searchedUser.profilePic,
				});
				return;
			}

			const mockConversation = {
				mock: true,
				lastMessage: {
					text: "",
					sender: "",
				},
				_id: Date.now(),
				participants: [
					{
						_id: searchedUser._id,
						username: searchedUser.username,
						profilePic: searchedUser.profilePic,
					},
				],
			};
			setConversations((prevConvs) => [...prevConvs, mockConversation]);
			setSelectedConversation({
				_id: mockConversation._id,
				userId: searchedUser._id,
				username: searchedUser.username,
				userProfilePic: searchedUser.profilePic,
			});
		} catch (error) {
			showToast("Error", error.message, "error");
		} finally {
			setSearchingUser(false);
		}
	};

	return (
		<Box
			position="relative"
			maxW={{ base: "full", md: "85%", lg: "900px" }}
			mx="auto"
			p={6}
			py={8}
			borderRadius="lg"
			boxShadow="xl"
			bg={useColorModeValue("gray.50", "gray.800")}
		>
			<Flex
				direction={{ base: "column", md: "row" }}
				gap={6}
			>
				<Flex
					flex={1}
					direction="column"
					gap={6}
					maxW={{ base: "full", md: "300px" }}
					bg={useColorModeValue("white", "gray.700")}
					borderRadius="lg"
					boxShadow="md"
					p={4}
				>
					<Text fontWeight="bold" fontSize="lg" color={useColorModeValue("gray.700", "gray.300")}>
						Conversations
					</Text>
					<form onSubmit={handleConversationSearch}>
						<Flex align="center" gap={3}>
							<Input
								placeholder="Search for a user"
								value={searchText}
								onChange={(e) => setSearchText(e.target.value)}
								variant="outline"
								focusBorderColor={useColorModeValue("teal.500", "teal.300")}
								borderColor={useColorModeValue("gray.300", "gray.600")}
								rounded="md"
							/>
							<Button
								size="md"
								onClick={handleConversationSearch}
								isLoading={searchingUser}
								colorScheme="teal"
								leftIcon={<SearchIcon />}
							>
								Search
							</Button>
						</Flex>
					</form>

					{loadingConversations ? (
						[0, 1, 2, 3, 4].map((_, i) => (
							<Flex
								key={i}
								align="center"
								p={3}
								borderRadius="lg"
								bg={useColorModeValue("gray.100", "gray.800")}
								boxShadow="sm"
								gap={5}
							>
								<SkeletonCircle size="16" />
								<Flex direction="column" gap={3} flex="1">
									<Skeleton height="15px" width="100px" />
									<Skeleton height="12px" width="100%" />
								</Flex>
							</Flex>
						))
					) : (
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}
								isOnline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))
					)}
				</Flex>
				{!selectedConversation._id ? (
					<Flex
						flex={2}
						borderRadius="lg"
						p={6}
						align="center"
						justify="center"
						bg={useColorModeValue("gray.50", "gray.800")}
						height="500px"
						boxShadow="lg"
					>
						<GiConversation size={120} color={useColorModeValue("gray.500", "gray.400")} />
						<Text fontSize="xl" textAlign="center" mt={5} color={useColorModeValue("gray.600", "gray.300")}>
							Select a conversation to start messaging
						</Text>
					</Flex>
				) : (
					<MessageContainer />
				)}
			</Flex>
		</Box>
	);
};

export default ChatPage;
