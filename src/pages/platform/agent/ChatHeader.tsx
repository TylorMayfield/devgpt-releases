import { Text, Flex, useColorMode, Tag } from "@chakra-ui/react";

//stores
import repoStore from "@/store/Repos";

//components
import Logo from "@/components/Logo";

const ChatHeader = () => {
  const { repo }: any = repoStore();
  const { colorMode } = useColorMode();
  return (
    <Flex
      justifyContent="space-between"
      borderBottom={
        colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"
      }
      p={5}
      w="full"
      alignItems="center"
    >
      <Logo />
      <Text>{repo.repo && <Tag>{repo.repo}</Tag>}</Text>
    </Flex>
  );
};

export default ChatHeader;
