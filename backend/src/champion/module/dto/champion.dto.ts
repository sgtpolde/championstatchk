import { passiveDTO } from './spell.dto';

export interface ChampionImageDTO {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChampionSkinDTO {
  id: string;
  num: number;
  name: string;
  chromas: boolean;
}

export interface ChampionSpellDTO {
  spellKey: string;
  name: string;
  abilityIconPath: string;
  abilityVideoPath: string;
  abilityVideoImagePath: string;
  cost: string;
  cooldown: string;
  description: string;
  dynamicDescription: string;
  formulas: Record<string, any>; // You might want to define a proper type for formulas
  range: number[];
  costCoefficients: number[];
  cooldownCoefficients: number[];
  coefficients: {
    coefficient1: number;
    coefficient2: number;
    // Add more coefficients as needed
  };
  effectAmounts: {
    Effect1Amount: number[];
    Effect2Amount: number[];
    Effect3Amount: number[];
    Effect4Amount: number[];
    Effect5Amount: number[];
    Effect6Amount: number[];
    Effect7Amount: number[];
    Effect8Amount: number[];
    Effect9Amount: number[];
    Effect10Amount: number[];
  };
  ammo: {
    ammoRechargeTime: number[];
    maxAmmo: number[];
  };
  maxLevel: number;
}

export interface ChampionStatsDTO {
  hp: number;
  hpperlevel: number;
  mp: number;
  mpperlevel: number;
  movespeed: number;
  armor: number;
  armorperlevel: number;
  spellblock: number;
  spellblockperlevel: number;
  attackrange: number;
  hpregen: number;
  hpregenperlevel: number;
  mpregen: number;
  mpregenperlevel: number;
  crit: number;
  critperlevel: number;
  attackdamage: number;
  attackdamageperlevel: number;
  attackspeedperlevel: number;
  attackspeed: number;
}

export interface ChampionDTO {
  id: string;
  key: string;
  name: string;
  title: string;
  image: ChampionImageDTO;
  skins: ChampionSkinDTO[];
  lore: string;
  blurb: string;
  allytips: string[];
  enemytips: string[];
  tags: string[];
  partype: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  stats: ChampionStatsDTO[];
  spells: ChampionSpellDTO[];
  passive: passiveDTO[];
  recommended: any[]; // Define the correct type for recommended items
}

// Include all properties from ChampionDTO in ChampionDataDTO
export interface ChampionDataDTO {
  [championId: string]: ChampionDTO;
}

export interface ChampionResponseDTO {
  data: ChampionDataDTO;
}

// Example interface for the API response
export interface ChampionAPIResponse {
  type: string;
  format: string;
  version: string;
  data: ChampionDataDTO;
}
