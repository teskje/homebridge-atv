import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { AtvPlatform } from './platform';

export = (api: API) => {
  api.registerPlatform(PLATFORM_NAME, AtvPlatform);
};
