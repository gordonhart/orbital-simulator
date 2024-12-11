import {MantineProvider} from '@mantine/core';
import {SolarSystem} from './components/SolarSystem';
import {theme} from "./theme.tsx";

export function App() {
  return (
    <MantineProvider theme={theme}>
      <SolarSystem />
    </MantineProvider>
  )
}
