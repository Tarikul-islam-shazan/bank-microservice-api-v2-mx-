import { createClient } from '@google/maps';
import config from '../config/config';

export const GMapClient = createClient({
  key: config.googleMap.apiKey,
  Promise
});
