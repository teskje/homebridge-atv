# homebridge-atv

A very simply Homebridge plugin for interfacing with an Apple TV.

At the moment it supports:

 * Powering an ATV on/off
 * Polling the power state

My main motivation for implementing this was being able to write automations
triggered by ATV power state changes. Things along the lines of "When ATV turns
on, turn on the audio system".

## Usage

1. Install [the `pyatv` Python library](https://pypi.org/project/pyatv/).

   ```
   $ pip install pyatv
   ```

   This also installs the `atvremote` command, which you'll need in the
   following steps.

2. Scan the network to find the ID of your ATV.

   ```
   $ atvremote scan
   [...]
          Name: Living Room
      Model/SW: Apple TV 4K (gen 3), tvOS 16.6
       Address: XXX.XXX.XXX.XXX
           MAC: XX:XX:XX:XX:XX:XX
    Deep Sleep: False
   Identifiers:
    - XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    - XX:XX:XX:XX:XX:XX
    - XXXXXXXXXXXX
   Services:
    - Protocol: Companion, Port: 49153, Credentials: None, Requires Password: False, Password: None, Pairing: Mandatory
    - Protocol: AirPlay, Port: 7000, Credentials: None, Requires Password: False, Password: None, Pairing: Mandatory
    - Protocol: RAOP, Port: 7000, Credentials: None, Requires Password: False, Password: None, Pairing: Mandatory
   [...]
   ```

   Find your ATV in the scan results and note down any of the IDs in the
   'Identifiers' list.

3. Pair with your ATV to establish pairing credentials.

   ```
   $ atvremote --id <ID> --protocol companion --remote-name "Homebridge" pair
   Enter PIN on screen: XXXX
   Pairing seems to have succeeded, yey!
   You may now use these credentials: [...]
   ```

   The `--remote-name` is optional, it will make your Homebridge connection show
   up under that name in the ATV settings.

   After entering the PIN and successfully pairing, the command spits out a long
   credential string. Note that down as well.

4. Install this plugin somewhere where your Homebridge installation will pick it
   up.

   ```
   $ npm install teskje/homebridge-atv
   ```

5. Configure the `atv` platform using the ID and credentials from steps (2) and
   (3), respectively.

   ```json
   "platforms": [
       {
           "name": "atv",
           "platform": "atv",
           "deviceId": "<ID>",
           "deviceName": "My Apple TV",
           "credentials": "<credentials>"
       }
   ]
   ```
