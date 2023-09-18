import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputRightElement,
  TagLabel,
  TagCloseButton,
  Input,
  Button,
  Box,
  Text,
  Flex,
  FormLabel,
  Tag,
  Spinner,
  useToast,
  useDisclosure,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";

// import fs from "fs";
import checkOS from "@/src/utils/checkOS";
import planIntegers from "@/src/config/planIntegers";
import fetchLocalConfigs from "../functions/fetchLocalConfigs";
import countFilesInDirectory from "@/src/utils/countFilesInDirectory";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useAuthContext } from "@/src/context";
import TechStack from "@/src/components/global/sidebar/elements/TechStack";
import checkIfPremium from "@/src/utils/checkIfPremium";
import saveRepo from "../functions/saveRepo";
import saveTechStack from "../functions/saveTechStack";
import saveContext from "../functions/saveContext";
import getUserSubscription from "@/src/utils/getUserSubscription";
import Context from "./Context";
import UpgradeModal from "../../UpgradeModal";
import getCode from "@/src/utils/github/getCode";
import getUserRepositories from "@/src/utils/github/getUserRepositories";
import exchangeAccessToken from "@/src/utils/github/exchangeAccessToken";

interface SettingsModalProps {
  viewingTargetRepo?: boolean;
  isSettingsOpen: boolean;
  onSettingsClose: () => void;
}

const SettingsModal = ({
  viewingTargetRepo,
  isSettingsOpen,
  onSettingsClose,
}: SettingsModalProps) => {
  const [localRepoDirectory, setLocalRepoDirectory] = useState("");
  const [technologiesUsed, setTechnologiesUsed] = useState("");
  const [fileTypesToRemove, setFileTypesToRemove] = useState("");
  const [context, setContext] = useState("");

  const [userIsPremium, setUserIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCounting, setIsCounting] = useState(false);

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { user, session } = useAuthContext();
  const toast = useToast();

  const setPlan = async () => {
    const premium = await getUserSubscription(user.id);
    if (premium.activeSubscription) {
      setUserIsPremium(true);
    } else {
      setUserIsPremium(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPlan();
    }
  }, []);

  useEffect(() => {
    fetchLocalConfigs({
      setTechnologiesUsed,
      setContext,
      setLocalRepoDirectory,
      user,
    });
  }, []);

  const SaveAndCancelButtons = ({ onSave }) => {
    return (
      <Flex justifyContent="flex-end" pb={4} mt={4}>
        {!loading && (
          <Flex pl={4}>
            <Button mr={3} onClick={onSettingsClose}>
              Cancel
            </Button>
            <Button
              bgGradient={"linear(to-r, blue.500, teal.500)"}
              onClick={() => {
                onSave();
              }}
            >
              Save
            </Button>
          </Flex>
        )}
      </Flex>
    );
  };

  const RepositoryOptions = () => {
    const {
      isOpen: isUpgradeOpen,
      onOpen: onUpgradeOpen,
      onClose: onUpgradeClose,
    } = useDisclosure();

    return (
      <Box>
        <InputGroup flexDirection="column">
          <Input
            pr="8rem"
            isDisabled={true}
            placeholder={checkOS("Users/me/my-repo", "C:/Users/me/my-repo")}
            value={localRepoDirectory}
            onChange={(e) => {
              setLocalRepoDirectory(e.target.value);
            }}
          />
          <InputRightElement width="7rem">
            <Button
              mr={2}
              size="sm"
              bgGradient={"linear(to-r, blue.500, teal.500)"}
              id="dirs"
              onClick={() => {
                setLoading(true);

                window.postMessage({
                  type: "select-dirs",
                });
              }}
            >
              Select Folder
            </Button>
          </InputRightElement>
        </InputGroup>
        <Text fontSize={14} mr={2} mt={2} color="gray.400">
          Your code is secure and never saved. We're open-source; view our
          GitHub for transparency.
        </Text>

        <UpgradeModal
          isUpgradeOpen={isUpgradeOpen}
          onUpgradeClose={onUpgradeClose}
        />
      </Box>
    );
  };

  // console.log(session);

  const fetchGithubInformation = async () => {
    // const repos = await getUserRepositories(session?.access_token);
    const owner = user?.identities?.[0]?.identity_data?.user_name;
    const token = session?.provider_token;
    const path = "";
    const repo = "";

    console.log({
      owner,
      token,
      path,
      repo
    });

    exchangeAccessToken(session?.access_token)
      .then((result) => {
        console.log({ result });
      })
      .catch((error) => {
        console.error(error.message);
      });


    // getUserRepositories(session?.provider_token)
    //   .then((data) => {
    //     if (data) {
    //       console.log("File Names:");
    //       console.log(data);
    //     } else {
    //       console.error("Error: Data not found or API request failed.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(`Error: ${error.message}`);
    //   });

    // getCode(owner, repo, path, token)
    //   .then((data) => {
    //     if (data) {
    //       console.log("File Names:");
    //       console.log(data);
    //     } else {
    //       console.error("Error: Data not found or API request failed.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(`Error: ${error.message}`);
    //   });
  };

  useEffect(() => {
    if (session) {
      fetchGithubInformation();
    }
  }, [session]);

  return (
    <Modal
      isCentered={true}
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isSettingsOpen}
      onClose={onSettingsClose}
      size={"xl"}
    >
      <ModalOverlay
        bg="blackAlpha.700"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent>
        <Box pl={6} pt={6} pb={3}>
          <Text fontSize="xl" fontWeight={"bold"}>
            {!viewingTargetRepo && !loading
              ? "Project Settings"
              : loading
                ? "Loading..."
                : "Set up your project."}
          </Text>
        </Box>
        {!loading && <ModalCloseButton />}
        {loading ? (
          <Flex flexDirection="row" p={6}>
            <Spinner />
          </Flex>
        ) : (
          <>
            <Box px={6} pt={2}>
              {/* <RepositoryOptions /> */}
              <Text>Pick from a list of github</Text>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem>Download</MenuItem>
                  <MenuItem>Create a Copy</MenuItem>
                  <MenuItem>Mark as Draft</MenuItem>
                  <MenuItem>Delete</MenuItem>
                  <MenuItem>Attend a Workshop</MenuItem>
                </MenuList>
              </Menu>
              <Divider mt={4} />
              <TechStack
                technologiesUsed={technologiesUsed}
                setTechnologiesUsed={setTechnologiesUsed}
              />
              <Divider mt={4} />
              <Context context={context} setContext={setContext} />
              <SaveAndCancelButtons
                onSave={() => {
                  if (context.length > 3 && technologiesUsed.length > 3) {
                    alert("fs has been removed by ash");
                    //todo fix me
                    // fs.access(localRepoDirectory, (err) => {
                    //   if (err) {
                    //     toast({
                    //       title: "Error",
                    //       position: "top-right",
                    //       description: "Directory does not exist",
                    //       status: "error",
                    //       duration: 5000,
                    //       isClosable: true,
                    //     });
                    //     return;
                    //   } else {
                    //     saveRepo({
                    //       onSettingsClose,
                    //       userIsPremium,
                    //       localRepoDirectory,
                    //       toast,
                    //       user,
                    //     });
                    //   }
                    // });

                    saveTechStack({
                      onSettingsClose,
                      technologiesUsed,
                      toast,
                      user,
                    });

                    saveContext({
                      context,
                      toast,
                      user,
                    });

                    toast({
                      title: "Saved!",
                      description:
                        "Your local environment settings have been saved.",
                      status: "success",
                      duration: 6000,
                      position: "top-right",
                      isClosable: true,
                    });

                    onSettingsClose();
                  } else {
                    toast({
                      title: "You haven't completed your project settings",
                      description:
                        "Please write your tech stack and what you're currently working on to continue.",
                      status: "error",
                      duration: 6000,
                      position: "top-right",
                      isClosable: true,
                    });
                  }
                }}
              />
            </Box>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SettingsModal;
