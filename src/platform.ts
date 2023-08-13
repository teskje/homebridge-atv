import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { AtvAccessory } from './accessory';

export class AtvPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  private cachedAccessories: PlatformAccessory[] = [];

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {
    api.on('didFinishLaunching', () => {
      this.removeCachedAccessories();
      this.installAccessory();
    });
  }

  configureAccessory(accessory: PlatformAccessory) {
    // We can't unregister accessories here, so we need to remember them
    // until after `didFinishLaunching`.
    this.cachedAccessories.push(accessory);
  }

  removeCachedAccessories() {
    this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, this.cachedAccessories);
    this.cachedAccessories = [];
  }

  installAccessory() {
    const deviceId = this.config.deviceId;
    const deviceName = this.config.deviceName;
    const credentials = this.config.credentials;

    this.log.info('Adding new accessory:', deviceName);

    const uuid = this.api.hap.uuid.generate(deviceId);
    const accessory = new this.api.platformAccessory(deviceName, uuid);

    accessory.context.deviceId = deviceId;
    accessory.context.deviceName = deviceName;
    accessory.context.credentials = credentials;

    new AtvAccessory(this, accessory);
    this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
  }
}
