import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE

  const { isOpen, onClose, onOpen } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState('');

  function handleViewImage(url: string): void {
    setSelectedImage(url);
    onOpen();
  }

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid columns={3} spacing="40px">
        {cards?.map(card => (
          <Card key={card.id} data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      {!!selectedImage && (
        <ModalViewImage
          imgUrl={selectedImage}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
}
