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

export default function HangUpModal(props: { onHangUp: () => void }) {
  const { onHangUp } = props;
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
    onChange: onHangUp,
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
              <Button color="primary" onPress={onClose}>
                Go to Home
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
