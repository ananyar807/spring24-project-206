import {
  Box,
  Grid,
  IconButton,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useInteractable } from '../../../../classes/TownController';
import useTownController from '../../../../hooks/useTownController';
import Inventory from './Inventory';
import closeButton from './petshop-images/x_btn.png';
import inventoryBackground from './inventory-images/inventory_bg.png';
import unequippedSlot from './inventory-images/inventory_slot_bg.png';
import equippedSlot from './inventory-images/inventory_slot_bg_equipped.png';
import { Pet } from './types/pet';
import emptyPet from './inventory-images/inventory_slot_bg_empty.png';
import dog from './inventory-images/pet.png';
import equippedButton from './inventory-images/equip_btn.png';
import unequippedButton from './inventory-images/unequip_btn.png';
import coin_count from './inventory-images/coin_count.png';
import forward_btn from './inventory-images/forward_btn.png';
import back_btn from './inventory-images/back_btn.png';

function PetInventorySlot({ type, equipped }: Pet): JSX.Element {
  let petImage = <Image src={emptyPet.src} />;
  let slotImage = <></>;
  let equipButton = <></>;
  if (equipped) {
    equipButton = <IconButton icon={<Image src={unequippedButton.src} />} aria-label={''} />;
    slotImage = <Image src={equippedSlot.src} />;
  } else {
    equipButton = <IconButton icon={<Image src={equippedButton.src} />} aria-label={''} />;
    slotImage = <Image src={unequippedSlot.src} />;
  }
  if (type === 'dog') {
    petImage = <Image src={dog.src} boxSize='50px'></Image>;
  }

  return (
    <Box position='relative' top='110px' left='45px' boxSize='100px'>
      <Box position='relative'>
        {slotImage}
        <Box position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>
          {petImage}
        </Box>
      </Box>
      <Box>{equipButton}</Box>
    </Box>
  );
}

function InventoryArea(): JSX.Element {
  // Array of pets
  const pets = [
    { petID: 1, type: 'dog', playerID: 1, speed: 1.5, equipped: false },
    { petID: 1, type: 'dog', playerID: 1, speed: 1.5, equipped: true },
    { petID: 1, type: 'dog', playerID: 1, speed: 1.5, equipped: false },
    { petID: 1, type: 'dog', playerID: 1, speed: 1.5, equipped: true },
    { petID: 1, type: 'dog', playerID: 1, speed: 1.5, equipped: false },
    { petID: 1, type: 'dog', playerID: 1, speed: 1.5, equipped: true },
  ];

  return (
    <Box position='relative'>
      {/* Inventory Background */}
      <Image src={inventoryBackground.src} position='absolute' />

      {/* Grid of Pets */}
      <Grid templateColumns='repeat(3, 1fr)' gap={4} gridAutoFlow='row dense' gridRowGap={10}>
        {pets.map((pet, index) => (
          <PetInventorySlot key={index} {...pet} />
        ))}
      </Grid>

      {/* Coin Count Image */}
      <Box position='absolute' right='50' top='0' boxSize='100px'>
        <Image src={coin_count.src} />
      </Box>

      {/* back button */}
      <Box position='absolute' left='0' top='400' boxSize='50px'>
        <Image src={back_btn.src} />
      </Box>

      {/* forward button */}
      <Box position='absolute' right='0' top='400' boxSize='50px'>
        <Image src={forward_btn.src} />
      </Box>
    </Box>
  );
}

/**
 * Using the player ID, renders the pet options that the player can buy
 * @param PlayerID the player ID of the current player
 */
export default function InventoryAreaWrapper(): JSX.Element {
  // fetch the player ID
  const townController = useTownController();
  const inventoryArea = useInteractable<Inventory>('inventory');
  const currentID = townController.ourPlayer.id;
  const closeModal = useCallback(() => {
    if (inventoryArea) {
      townController.interactEnd(inventoryArea);
    }
  }, [townController, inventoryArea]);
  const open = true;
  if (open) {
    return (
      <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false} size='xl'>
        <ModalOverlay />
        <ModalContent bgColor='transparent'>
          <ModalCloseButton
            bgImage={closeButton.src}
            objectFit='fill'
            bgSize='contain'
            onClick={closeModal}
          />
          <InventoryArea />
          {/* <ModalBody>
            <Image src={shop_bg} boxSize='lg' onClick={() => console.log('clicked!')}></Image>
          </ModalBody> */}
        </ModalContent>
      </Modal>
    );
  }
  return <img alt='Inventory' src='/inventory-images/inventory_bg.png'></img>;
}
