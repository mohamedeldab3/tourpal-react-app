// @ts-nocheck

export interface BasicListDto {
  id: number;
  name: string;
}

export interface RequiredDoc {
  id: number;
  name: string;
  isMandatory: boolean;
}

import { db } from '../data/staticDb'; // Import the static database

export const getCities = async (lang: number): Promise<BasicListDto[]> => {
  console.log(`Static getCities called with lang: ${lang}`);
  return Promise.resolve(db.cities);
};

export const getUserTypes = async (): Promise<BasicListDto[]> => {
  console.log('Static getUserTypes called');
  return Promise.resolve(db.userTypes);
};

export const getRequiredDocumentsPerUserType = async (userType: number, lang: number = 0): Promise<RequiredDoc[]> => {
  console.log(`Static getRequiredDocumentsPerUserType called for userType: ${userType}, lang: ${lang}`);
  // Simplify: return all static docs for any user type for demo purposes
  return Promise.resolve(db.requiredDocsTemplates);
};

export const getCarTypes = async (): Promise<BasicListDto[]> => {
  console.log('Static getCarTypes called');
  return Promise.resolve(db.carTypes);
};

export const getCarTypesList = getCarTypes; // alias

export const getCarFeatures = async (): Promise<BasicListDto[]> => {
  console.log('Static getCarFeatures called');
  return Promise.resolve(db.carFeatures);
};

export const getDocumentsTypes = async (): Promise<BasicListDto[]> => {
  console.log('Static getDocumentsTypes called');
  return Promise.resolve(db.documentTypes);
};

export const getAdvPostionsList = async (): Promise<BasicListDto[]> => {
  console.log('Static getAdvPostionsList called');
  return Promise.resolve(db.advPositions);
};
