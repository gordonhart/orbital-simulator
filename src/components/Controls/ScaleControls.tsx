import { AppStateControlProps, buttonGap } from './constants.ts';
import { ScaleIndicator } from './ScaleIndicator.tsx';
import { memo } from 'react';
import { AppState } from '../../lib/state.ts';
import { Stack } from '@mantine/core';
import { DirectionIndicator } from './DirectionIndicator.tsx';

type Props = Pick<AppStateControlProps, 'updateState'> & Pick<AppState, 'metersPerPx' | 'vernalEquinox'>;
export const ScaleControls = memo(function ScaleControlsComponent({ metersPerPx, vernalEquinox }: Props) {
  // TODO: add back buttons here to alter scale? difficult as scale is managed internally via renderer; metersPerPx in
  //  app state is a readonly translation of this value
  return (
    <Stack gap={buttonGap} align="flex-end">
      <ScaleIndicator metersPerPx={metersPerPx} />
      <DirectionIndicator vernalEquinox={vernalEquinox} />
    </Stack>
  );
});
