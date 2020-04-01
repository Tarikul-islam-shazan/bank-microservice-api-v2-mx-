import { CountryController } from './../controllers/country-controller';
import { asyncWrapper } from '../../../middleware/asyncWrapper';

// TODO: add validation
// TODO: all of these routes are accessible from outside of orchestration
// so they will require MeedAuthorization only not bank auth
export const countryRoutes = [
  {
    path: 'v1.0.0/meed/signup/countries',
    method: 'get',
    handler: [asyncWrapper(CountryController.findCountries)]
  }
];
