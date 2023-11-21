export interface SpellDTO {
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


export interface passiveDTO {
  name: string;
  abilityIconPath: string;
  abilityVideoPath: string;
  abilityVideoImagePath: string;
  description: string;
}

export interface SpellDataDTO {
  [spellId: string]: SpellDTO;
}

export interface SpellResponseDTO {
  data: SpellDataDTO;
}
