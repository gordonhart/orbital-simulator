import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Group } from '@mantine/core';
import { AppState, clampState, initialState } from '../lib/state.ts';
import { Controls } from './Controls/Controls.tsx';
import { getInitialState, incrementState } from '../lib/physics.ts';
import { SOL } from '../lib/bodies.ts';
import { useSolarSystemRenderer } from '../lib/draw3D/useSolarSystemRenderer.ts';
import { useCursorControls3D } from '../hooks/useCursorControls3D.ts';

export function SolarSystem() {
  const [appState, setAppState] = useState(initialState);
  const appStateRef = useRef(appState);
  const systemStateRef = useRef(getInitialState(null, SOL));
  const { ref: containerRef, renderer, initialize: initializeRender, update: updateRender } = useSolarSystemRenderer();

  const updateState = useCallback(
    (newState: Partial<AppState>) => {
      setAppState(prev => clampState({ ...prev, ...newState }));
    },
    [setAppState]
  );

  const cursorControls = useCursorControls3D(renderer, updateState);

  const resetState = useCallback(() => {
    updateState(initialState);
    systemStateRef.current = getInitialState(null, SOL);
  }, [updateState]);

  // set the mutable state ref (accessed by animation callback) on state update
  useEffect(() => {
    appStateRef.current = appState;
  }, [JSON.stringify(appState)]);

  // TODO: pretty sure there's an issue with dev reloads spawning multiple animation loops
  function animationFrame() {
    const { play, dt } = appStateRef.current;
    if (play) {
      setAppState(prev => ({ ...prev, time: prev.time + dt }));
      systemStateRef.current = incrementState(systemStateRef.current, dt);
    }
    updateRender(appStateRef.current, systemStateRef.current);
    window.requestAnimationFrame(animationFrame);
  }

  useEffect(() => {
    const frameId = window.requestAnimationFrame(animationFrame);
    initializeRender(appStateRef.current, systemStateRef.current);
    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <Group align="center" justify="center" w="100vw" h="100vh">
      <Box ref={containerRef} pos="absolute" top={0} right={0} {...cursorControls} />
      <Controls state={appState} updateState={updateState} systemState={systemStateRef.current} reset={resetState} />
    </Group>
  );
}
