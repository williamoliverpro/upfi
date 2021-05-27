import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bgColor="pGray.900">
        <Image src={imgUrl} maxHeight="600px" maxWidth="900px" alt={imgUrl} />
        <ModalBody display="flex" height="2rem" alignItems="center">
          <Link href={imgUrl} isExternal>
            Abrir original
          </Link>
        </ModalBody>

        <ModalFooter />
      </ModalContent>
    </Modal>
  );
}
