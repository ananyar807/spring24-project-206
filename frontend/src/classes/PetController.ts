import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';
import {
  EquippedPet as PetModel,
  PetLocation,
  PlayerID,
} from '../../../shared/types/CoveyTownSocket';

export const PET_LABEL_X_OFFSET = 20;

export const PET_LABEL_Y_OFFSET = 30;

export const PET_OFFSET = 40;

export const PET_BASELINE_OFFSET = 15;

export type PetEvents = {
  petMovement: (newLocation: PetLocation) => void;
};

export type PetGameObjects = {
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  label: Phaser.GameObjects.Text;
  locationManagedByGameScene: boolean;
};

export default class PetController extends (EventEmitter as new () => TypedEmitter<PetEvents>) {
  private _location: PetLocation;

  private readonly _type: string;

  private readonly _playerID: PlayerID;

  private readonly _imgID: number;

  public gameObjects?: PetGameObjects;

  constructor(type: string, playerID: PlayerID, location: PetLocation, imgID: number) {
    super();
    this._type = type;
    this._playerID = playerID;
    this._location = location;
    this._imgID = imgID;
  }

  set location(newLocation: PetLocation) {
    this._location = newLocation;
    console.log(`PetController for ${this._type}: location`);
    console.log(this._location);
    this._updateGameComponentLocation();
    this.emit('petMovement', newLocation);
  }

  get location(): PetLocation {
    return this._location;
  }

  get type(): string {
    return this._type;
  }

  get playerID(): PlayerID {
    return this._playerID;
  }

  get imgID(): number {
    return this._imgID;
  }

  toPetModel(): PetModel {
    return { type: this.type, playerID: this.playerID, location: this.location, imgID: this.imgID };
  }

  private _updateGameComponentLocation() {
    if (this.gameObjects && !this.gameObjects.locationManagedByGameScene) {
      const { sprite, label } = this.gameObjects;
      sprite.setX(this.location.x);
      sprite.setY(this.location.y);
      switch (this.location.rotation) {
        case 'left':
          sprite.flipX = true;
          break;
        default:
          sprite.flipX = false;
          break;
      }

      label.setX(this.location.x - PET_LABEL_X_OFFSET);
      label.setY(this.location.y - PET_LABEL_Y_OFFSET);
    }
  }

  static fromPetModel(modelPet: PetModel): PetController {
    return new PetController(modelPet.type, modelPet.playerID, modelPet.location, modelPet.imgID);
  }
}
