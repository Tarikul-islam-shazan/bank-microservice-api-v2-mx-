import Joi from '@hapi/joi';
import { AtmLocationType } from '../../models/bank-atms/interface';
import { UnitOfMeasureType } from '../../models/meedservice';

const commonQuery = Joi.object({
  distance: Joi.number().required(),
  unitOfMeasure: Joi.string()
    .allow(...Object.values(UnitOfMeasureType))
    .optional(),
  locationType: Joi.string()
    .allow(...Object.values(AtmLocationType))
    .optional()
});

export const FindByGeoCode = commonQuery.append({
  latitude: Joi.number()
    .min(-90)
    .max(90)
    .required()
    .error(new Error('Latitude is out of bound')),
  longitude: Joi.number()
    .min(-180)
    .max(180)
    .required()
    .error(new Error('Longitude is out of bound'))
});

const FindByAddress = commonQuery.append({
  address: Joi.string().required()
});

export const FindAtmQuery = Joi.alternatives().try(FindByGeoCode, FindByAddress);

export const FindAtmParam = Joi.object({
  bankId: Joi.string().required()
});
