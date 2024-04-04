import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import Player from '../lib/Player';
import { Pet } from '../lib/Pet';
import {
  BoundingBox,
  InteractableCommand,
  InteractableCommandReturnType,
  PetShopArea as PetShopAreaModel,
  TownEmitter,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';
import { updateCounterForPet } from '../pet-shop/pets-catalog-dao';
import { createPet } from '../pets/pets-dao';
import { findOnePlayerCurrency, findPetPrice } from './Database';
import { updateOnePlayerCurrency } from '../leaderboard/leaderboard-dao';

export default class PetShopArea extends InteractableArea {
  public pets?: Pet[];

  private _emitter: TownEmitter;

  public constructor(
    { pets, id }: Omit<PetShopAreaModel, 'type'>,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this._emitter = townEmitter;
    this.pets = pets;
  }

  public toModel(): PetShopAreaModel {
    return {
      id: this.id,
      occupants: this.occupants.map(player => player.id),
      pets: this.pets,
      type: 'PetShopArea',
    };
  }

  public static fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): PetShopArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed viewing area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new PetShopArea({ id: name, occupants: [] }, rect, broadcastEmitter);
  }

  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
    player: Player,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'AdoptPet') {
      this._adoptPet(player.id, command.petType);
      this._emitAreaChanged();
    }
    return undefined as InteractableCommandReturnType<CommandType>;
  }

  // back end is throwing the error, the front end should catch it and then throw it again
  // relay the error message from the front end to the back end - look at the control flow
  /**
   * Awaits the update counter method from the backend
   * @param type The type of the pet
   */
  private async _incrementPopularity(type: string) {
    try {
      await updateCounterForPet(type);
    } catch (error) {
      throw new Error(`Could not update popularity counter: ${(error as Error).message}`);
    }
  }

  /**
   * Awaits the deduct currency method from the backend
   * @param type The type of the pet
   */
  private async _updateCurrency(playerID: string, newValue: number) {
    try {
      await updateOnePlayerCurrency(playerID, newValue);
    } catch (error) {
      throw new Error(`Could not update currency: ${(error as Error).message}`);
    }
  }

  /**
   * Attempts to adopt the pet
   * @param playerID the ID of the current player
   * @param petType the type of the pet being adopted
   */
  private async _adoptPet(playerID: string, petType: string) {
    const currency = await findOnePlayerCurrency(playerID);
    const petPrice = await findPetPrice(petType);

    if (currency === null || petPrice === null) {
      throw new Error('why null');
    }

    if (currency < petPrice) {
      // emit an insufficient currency event to the front end
      this._emitter.emit('insufficientCurrency');
    } else {
      const newPet = await createPet({
        type: petType,
        playerID,
        equipped: false,
      });
      await this._updateCurrency(playerID, currency - petPrice);
      await this._incrementPopularity(petType);
      this.pets?.push(newPet);
    }
  }
}
