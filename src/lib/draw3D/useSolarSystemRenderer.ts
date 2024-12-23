import { useRef } from 'react';
import { SolarSystemRenderer } from './SolarSystemRenderer.ts';
import { CelestialBodyState } from '../types.ts';
import { AppState } from '../state.ts';
import { findCelestialBody } from '../utils.ts';
import { CelestialBody3D, createCelestialSystem } from './CelestialBody3D.ts';

export function useSolarSystemRenderer(appState: AppState) {
  // Refs to store instances that need to persist between renders
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SolarSystemRenderer | null>(null);
  const bodiesRef = useRef<Array<CelestialBody3D>>([]);

  function update(systemState: CelestialBodyState) {
    const renderer = rendererRef.current;
    if (renderer == null) return;
    renderer.updateFromAppState(appState);
    bodiesRef.current.forEach(body => {
      const bodyState = findCelestialBody(systemState, body.name);
      if (bodyState != null) {
        body.update(bodyState);
      }
    });
    renderer.render();
  }

  function initialize(systemState: CelestialBodyState) {
    if (containerRef.current == null) return;

    // Initialize Three.js scene
    if (rendererRef.current == null) {
      const renderer = new SolarSystemRenderer(containerRef.current);
      rendererRef.current = renderer;
      bodiesRef.current = createCelestialSystem(renderer.scene, systemState, appState.visibleTypes);
    }

    // Cleanup
    return () => {
      Object.values(bodiesRef.current).forEach(body => body.dispose());
      bodiesRef.current = [];
      if (rendererRef.current != null) {
        rendererRef.current?.dispose();
        rendererRef.current = null;
      }
    };
  }

  return {
    ref: containerRef,
    renderer: rendererRef.current,
    bodies: bodiesRef.current,
    initialize,
    update,
  };
}
