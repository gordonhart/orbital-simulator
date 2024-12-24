import { MouseEvent } from 'react';
import { SolarSystemRenderer } from '../lib/draw3D/SolarSystemRenderer.ts';
import { Point2 } from '../lib/types.ts';
import { AppState } from '../lib/state.ts';
import { SOL } from '../lib/bodies.ts';

export function useCursorControls3D(
  renderer: SolarSystemRenderer | null,
  updateAppState: (state: Partial<AppState>) => void
) {
  function onMouseDown() {
    updateAppState({ center: SOL.name });
  }

  function onClick(event: MouseEvent<HTMLElement>) {
    if (renderer == null) return;
    const eventPx: Point2 = [event.clientX, event.clientY];
    const closeBody = renderer.findCloseBody(eventPx, 25);
    if (closeBody != null) {
      updateAppState({ center: closeBody.body.name });
    }
  }

  function onMouseMove(event: MouseEvent<HTMLElement>) {
    if (renderer == null) return;
    const eventPx: Point2 = [event.clientX, event.clientY];
    const closeBody = renderer.findCloseBody(eventPx, 25);
    updateAppState({ hover: closeBody?.body?.name ?? null });
  }

  return { onClick, onMouseMove, onMouseDown };
}
