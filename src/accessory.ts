import { exec } from 'child_process';
import { Service, PlatformAccessory, Logger, CharacteristicValue } from 'homebridge';

import { AtvPlatform } from './platform';

export class AtvAccessory {
  private service: Service;
  private log: Logger;

  constructor(
    private readonly platform: AtvPlatform,
    private readonly accessory: PlatformAccessory,
  ) {
    this.log = platform.log;

    // Set accessory information.
    accessory.getService(platform.Service.AccessoryInformation)!
      .setCharacteristic(platform.Characteristic.Manufacturer, 'Apple')
      .setCharacteristic(platform.Characteristic.Model, 'Apple TV')
      .setCharacteristic(platform.Characteristic.SerialNumber, '00000');

    // Create the Television service.
    this.service = accessory.addService(platform.Service.Television);
    this.service.setCharacteristic(platform.Characteristic.Name, accessory.context.deviceName);

    this.service.getCharacteristic(platform.Characteristic.Active)
      .onSet(this.setActive.bind(this));

    this.pollPowerState();
  }

  setActive(value: CharacteristicValue) {
    const cmd = value ? 'turn_on' : 'turn_off';
    this.atvremoteExec(cmd, (result) => {
      if (result !== null) {
        this.log.debug('power command successful:', result);
      }
    });
  }

  pollPowerState() {
    this.atvremoteExec('power_state', (result) => {
      if (result !== null) {
        this.log.debug('power state:', result);

        const active = (result === 'PowerState.On');
        this.service.updateCharacteristic(this.platform.Characteristic.Active, active);
      }

      setTimeout(this.pollPowerState.bind(this), 500);
    });
  }

  atvremoteExec(cmd: string, callback: (result: string | null) => void) {
    const id = this.accessory.context.deviceId;
    const creds = this.accessory.context.credentials;
    const cmdline = `atvremote --id ${id} --companion-credentials ${creds} ${cmd}`;

    exec(cmdline, (error, stdout) => {
      if (error) {
        this.log.error('error executing atvremote command:', cmd);
        this.log.error(error.message);
        callback(null);
      } else {
        const result = stdout.trim();
        callback(result);
      }
    });
  }
}
