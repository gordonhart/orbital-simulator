import { memo } from 'react';
import { Settings, UpdateSettings } from '../../lib/state.ts';
import { CelestialBody, isCelestialBody, isOrbitalRegime, OrbitalRegime } from '../../lib/types.ts';
import { CelestialBodyFactSheet } from './CelestialBodyFactSheet.tsx';
import { OrbitalRegimeFactSheet } from './OrbitalRegimeFactSheet.tsx';

// TODO: there's some pretty serious prop drilling going on here
type Props = {
  item: CelestialBody | OrbitalRegime;
  settings: Settings;
  updateSettings: UpdateSettings;
  addBody: (body: CelestialBody) => void;
  removeBody: (id: string) => void;
};
export const FactSheet = memo(function FactSheetComponent({
  item,
  settings,
  updateSettings,
  addBody,
  removeBody,
}: Props) {
  return isCelestialBody(item) ? (
    <CelestialBodyFactSheet body={item} bodies={settings.bodies} updateSettings={updateSettings} />
  ) : isOrbitalRegime(item) ? (
    <OrbitalRegimeFactSheet
      regime={item}
      settings={settings}
      updateSettings={updateSettings}
      addBody={addBody}
      removeBody={removeBody}
    />
  ) : (
    <></>
  );
});
