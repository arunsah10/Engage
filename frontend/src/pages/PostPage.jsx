import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
	const { user, loading } = useGetUserProfile();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const showToast = useShowToast();
	const { pid } = useParams();
	const currentUser = useRecoilValue(userAtom);
	const navigate = useNavigate();

	const currentPost = posts[0];

	useEffect(() => {
		const getPost = async () => {
			setPosts([]);
			try {
				const res = await fetch(`/api/posts/${pid}`);
				if (!res.ok) throw new Error("Failed to fetch post");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};
		getPost();
	}, [showToast, pid, setPosts]);

	const handleDeletePost = async () => {
		try {
			if (!window.confirm("Are you sure you want to delete this post?")) return;

			const res = await fetch(`/api/posts/${currentPost._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post deleted", "success");
			navigate(`/${user.username}`);
		} catch (error) {
			showToast("Error", error.message, "error");
		}
	};

	if (!user && loading) {
		return (
			<Flex justifyContent={"center"} p={8}>
				<Spinner size={"xl"} color="teal.500" />
			</Flex>
		);
	}

	if (!currentPost) {
		return (
			<Flex justifyContent={"center"} p={8}>
				<Text fontSize="lg" color="gray.600">No post found</Text>
			</Flex>
		);
	}

	return (
		<Flex direction="column" p={6} maxW="800px" mx="auto" bg={useColorModeValue("white", "gray.800")} borderRadius="lg" boxShadow="md">
			<Flex mb={4} alignItems={"center"} gap={4}>
				<Avatar src={user.profilePic} size={"lg"} name={user.username} borderWidth="2px" borderColor="teal.500" />
				<Flex direction="column" flex="1">
					<Text fontSize={"lg"} fontWeight={"bold"} color={useColorModeValue("gray.800", "gray.300")}>
						{user.username}
					</Text>
					<Image src='/verified.png' w='5' h={5} ml={2} />
					<Text fontSize="sm" color="gray.500" mt={1}>
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
					</Text>
				</Flex>
				<Flex ml="auto" alignItems={"center"}>
					{currentUser?._id === user._id && (
						<DeleteIcon
							w={6}
							h={6}
							cursor={"pointer"}
							color={"red.500"}
							onClick={handleDeletePost}
							aria-label="Delete Post"
						/>
					)}
				</Flex>
			</Flex>

			<Text fontSize={"xl"} mb={3} color={useColorModeValue("gray.700", "gray.300")}>{currentPost.text}</Text>

			{currentPost.img && (
				<Box borderRadius={8} overflow={"hidden"} border={"1px solid"} borderColor={"gray.200"} mb={4}>
					<Image src={currentPost.img} w={"full"} objectFit="cover" borderRadius="lg" />
				</Box>
			)}

			<Flex gap={4} mb={4}>
				<Actions post={currentPost} />
			</Flex>

			<Divider mb={4} />

			

			<Divider mb={4} />

			{currentPost.replies.length > 0 && currentPost.replies.map((reply) => (
				<Comment
					key={reply._id}
					reply={reply}
					lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id}
				/>
			))}
		</Flex>
	);
};

export default PostPage;
