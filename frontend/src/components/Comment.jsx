import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

const Comment = ({ reply, lastReply }) => {
	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={reply.userProfilePic} size={"sm"} alt={`${reply.username}'s profile picture`} />
				<Flex gap={2} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize='sm' fontWeight='bold'>
							{reply.username}
						</Text>
					</Flex>
					<Text fontSize='md' color='gray.600'>
						{reply.text}
					</Text>
				</Flex>
			</Flex>
			{!lastReply && <Divider my={2} />}
		</>
	);
};

export default Comment;
