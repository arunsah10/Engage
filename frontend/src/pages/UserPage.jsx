import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
	const { user, loading } = useGetUserProfile();
	const { username } = useParams();
	const showToast = useShowToast();
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [fetchingPosts, setFetchingPosts] = useState(true);

	useEffect(() => {
		const getPosts = async () => {
			if (!user) return;
			setFetchingPosts(true);
			try {
				const res = await fetch(`/api/posts/user/${username}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					setPosts([]);
				} else {
					setPosts(data);
				}
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setFetchingPosts(false);
			}
		};

		getPosts();
	}, [username, showToast, setPosts, user]);

	if (loading) {
		return (
			<Flex justifyContent={"center"} alignItems={"center"} height={"100vh"}>
				<Spinner size={"xl"} />
			</Flex>
		);
	}

	if (!user) return <Text fontSize="xl" textAlign="center">User not found</Text>;

	return (
		<>
			<UserHeader user={user} />

			{fetchingPosts ? (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			) : posts.length === 0 ? (
				<Flex justifyContent={"center"} my={12}>
					<Text fontSize="xl">This user has no posts yet.</Text>
				</Flex>
			) : (
				posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))
			)}
		</>
	);
};

export default UserPage;
