import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { siteConfig } from "../config/site";

export default function HangUpModal(props: { onClose: () => void }) {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
    onClose: props.onClose,
  });

  return (
    <Modal
      hideCloseButton
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      isKeyboardDismissDisabled
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Disconnected
            </ModalHeader>
            <ModalBody>
              <p>The other user has left the room.</p>
            </ModalBody>
            <ModalFooter>
              <Button
                as={Link}
                href={siteConfig.pages.home}
                color="primary"
                onPress={onClose}
              >
                Go to Home
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
