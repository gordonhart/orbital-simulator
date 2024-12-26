import { Belt, CelestialBody, CelestialBodyType } from './types.ts';
import { estimateAsteroidMass } from './physics.ts';

export const G = 6.6743e-11; // gravitational constant, N⋅m2⋅kg−2
export const AU = 1.496e11; // meters
export const g = 9.807; // earth gravity

export enum Time {
  SECOND = 1,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
}

const DEFAULT_MOON_COLOR = '#aaaaaa';
export const DEFAULT_ASTEROID_COLOR = '#6b6b6b'; // dark gray, typical for S-type asteroids

export const SOL: CelestialBody = {
  type: CelestialBodyType.STAR,
  name: 'Sol',
  influencedBy: [],
  elements: {
    wrt: null,
    epoch: 'J2000',
    eccentricity: 0,
    semiMajorAxis: 0,
    inclination: 0,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.9885e30,
  radius: 6.957e8,
  siderealRotationPeriod: 609.12 * Time.HOUR, // 609 hours at 16º latitude; true period varies by latitude
  color: '#fa0',
};

export const MERCURY: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Mercury',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.20563,
    semiMajorAxis: 57909050e3, // meters
    inclination: 7.005, // degrees
    longitudeAscending: 48.331, // degrees
    argumentOfPeriapsis: 29.124, // degrees
    meanAnomaly: 174.796, // degrees
  },
  mass: 3.3011e23,
  radius: 2439.7e3,
  siderealRotationPeriod: 58.6467 * Time.DAY,
  color: '#b3aeae',
};

// TODO: add pseudo-moon Zoozve?
export const VENUS: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Venus',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.006772,
    semiMajorAxis: 108208000e3,
    inclination: 3.39458,
    longitudeAscending: 76.6799,
    argumentOfPeriapsis: 54.884,
    meanAnomaly: 50.115,
  },
  mass: 4.8675e24,
  radius: 6051.8e3,
  siderealRotationPeriod: -243.02 * Time.DAY, // negative for retrograde rotation
  color: '#e6b667',
};

export const EARTH: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Earth',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.0167086,
    semiMajorAxis: 149597870.7e3, // 1 AU
    inclination: 0.00005, // shouldn't this be 0 (plane of the ecliptic)?
    longitudeAscending: -11.26064,
    argumentOfPeriapsis: 114.20783,
    meanAnomaly: 358.617,
  },
  mass: 5.972168e24,
  radius: 6371e3,
  siderealRotationPeriod: 23 * Time.HOUR + 56 * Time.MINUTE + 4.1, // 23h 56 m 4.100s
  color: '#7e87dd',
};

export const LUNA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Luna',
  influencedBy: [SOL.name, EARTH.name],
  elements: {
    wrt: EARTH.name,
    epoch: 'J2000',
    eccentricity: 0.0549,
    semiMajorAxis: 384400e3,
    inclination: 5.145,
    longitudeAscending: 125.08,
    argumentOfPeriapsis: 318.15,
    meanAnomaly: 0, // TODO: find
  },
  mass: 7.342e22,
  radius: 1737.4e3,
  siderealRotationPeriod: 27.321661 * Time.DAY,
  color: DEFAULT_MOON_COLOR,
};

export const EARTH_SYSTEM = [EARTH, LUNA];

export const MARS: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Mars',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.0935,
    semiMajorAxis: 227939366e3,
    inclination: 1.85,
    longitudeAscending: 49.57854,
    argumentOfPeriapsis: 286.502,
    meanAnomaly: 19.412,
  },
  mass: 6.4171e23,
  radius: 3389.5e3,
  siderealRotationPeriod: Time.DAY + 37 * Time.MINUTE + 22.66, // 24 hr 37 min 22.66 sec
  color: '#c96c3c',
};

export const PHOBOS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Phobos',
  influencedBy: [SOL.name, MARS.name],
  elements: {
    wrt: MARS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0151,
    semiMajorAxis: 9376e3,
    inclination: 1.093,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.0659e16,
  radius: 11.2667e3,
  color: DEFAULT_MOON_COLOR,
};

export const DEIMOS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Deimos',
  influencedBy: [SOL.name, MARS.name],
  elements: {
    wrt: MARS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.00033,
    semiMajorAxis: 23458e3,
    inclination: 1.788,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.4762e15,
  radius: 6.2e3,
  color: DEFAULT_MOON_COLOR,
};

export const MARS_SYSTEM = [MARS, PHOBOS, DEIMOS];

// TODO: for these asteroids, we're using instantaneous orbital elements instead of 'proper' orbital elements
//  collected over time. Switch?
export const CERES: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '1 Ceres',
  shortName: 'Ceres',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459600.5', // TODO: find J2000
    eccentricity: 0.075823,
    semiMajorAxis: 413690250e3,
    inclination: 10.594,
    longitudeAscending: 80.305,
    argumentOfPeriapsis: 73.597,
    meanAnomaly: 291.4,
  },
  mass: 9.3839e20,
  radius: 966.2e3 / 2,
  color: DEFAULT_ASTEROID_COLOR,
};

export const VESTA: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '4 Vesta',
  shortName: 'Vesta',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2453300.5', // TODO: find J2000
    eccentricity: 0.0894,
    semiMajorAxis: 2.36 * AU,
    inclination: 7.1422,
    longitudeAscending: 103.71,
    argumentOfPeriapsis: 151.66,
    meanAnomaly: 169.4,
  },
  mass: 2.590271e20,
  radius: 278.6e3,
  color: DEFAULT_ASTEROID_COLOR,
};

export const PALLAS: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '2 Pallas',
  shortName: 'Pallas',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2453300.5', // TODO: find J2000
    eccentricity: 0.2302,
    semiMajorAxis: 4.14e11,
    inclination: 34.93,
    longitudeAscending: 172.9,
    argumentOfPeriapsis: 310.9,
    meanAnomaly: 40.6,
  },
  mass: 2.04e20,
  radius: 256e3,
  color: DEFAULT_ASTEROID_COLOR,
};
export const HYGIEA: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '10 Hygiea',
  shortName: 'Hygiea',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.1125,
    semiMajorAxis: 3.1415 * AU,
    inclination: 3.8316,
    longitudeAscending: 283.2,
    argumentOfPeriapsis: 312.32,
    meanAnomaly: 0,
  },
  mass: 8.74e19,
  radius: 215e3,
  color: DEFAULT_ASTEROID_COLOR,
};

export const JUNO: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '3 Juno',
  shortName: 'Juno',
  influencedBy: [SOL.name],
  mass: 2.67e19, // kg
  radius: 127e3, // m
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.2562,
    semiMajorAxis: 3.35 * AU, // meters
    inclination: 12.991, // degrees
    longitudeAscending: 169.84, // degrees
    argumentOfPeriapsis: 247.74, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const RYUGU: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '162173 Ryugu',
  shortName: 'Ryugu',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.1902,
    semiMajorAxis: 1.1896 * AU,
    inclination: 5.8837,
    longitudeAscending: 251.62,
    argumentOfPeriapsis: 211.43,
    meanAnomaly: 0,
  },
  mass: 4.5e11,
  radius: 448,
  color: DEFAULT_ASTEROID_COLOR,
};
export const LUTETIA: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '21 Lutetia',
  shortName: 'Lutetia',
  influencedBy: [SOL.name],
  mass: 1.7e18, // kg
  radius: 49e3, // m
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.16339,
    semiMajorAxis: 2.435 * 1.496e11, // AU to meters
    inclination: 3.064, // degrees
    longitudeAscending: 80.867, // degrees
    argumentOfPeriapsis: 249.997, // degrees
    meanAnomaly: 87.976, // degrees
  },
  siderealRotationPeriod: 8.1655 * Time.HOUR,
  color: DEFAULT_ASTEROID_COLOR,
};

export const CG67P: CelestialBody = {
  type: CelestialBodyType.COMET,
  name: '67P/Churyumov–Gerasimenko',
  shortName: '67P/C–G',
  influencedBy: [SOL.name],
  mass: 1e13, // kg
  radius: 2000, // m (average radius based on dimensions)
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.64,
    semiMajorAxis: 3.463 * 1.496e11, // AU to meters
    inclination: 7.04, // degrees
    longitudeAscending: 50.19, // degrees
    argumentOfPeriapsis: 12.78, // degrees
    meanAnomaly: 0, // degrees (value at perihelion)
  },
  siderealRotationPeriod: 12.4 * Time.HOUR,
  color: DEFAULT_ASTEROID_COLOR,
};

export const EROS: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '433 Eros',
  shortName: 'Eros',
  influencedBy: [SOL.name],
  mass: 6.687e15, // kg
  radius: 8420, // m, average (highly irregular)
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.2226,
    semiMajorAxis: 1.4579 * AU, // meters
    inclination: 10.828, // degrees
    longitudeAscending: 304.32, // degrees
    argumentOfPeriapsis: 178.82, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const MATHILDE: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '253 Mathilde',
  shortName: 'Mathilde',
  influencedBy: [SOL.name],
  mass: 1.033e17, // kg
  radius: 26.4e3, // m
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.26492652,
    semiMajorAxis: 2.648402147 * AU, // meters
    inclination: 6.7427122, // degrees
    longitudeAscending: 179.58936, // degrees
    argumentOfPeriapsis: 157.39642, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const NEREUS: CelestialBody = {
  type: CelestialBodyType.ASTEROID,
  name: '4660 Nereus',
  shortName: 'Nereus',
  influencedBy: [SOL.name],
  mass: estimateAsteroidMass(165), // not known
  radius: 165, // m
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459396.5',
    eccentricity: 0.36004,
    semiMajorAxis: 1.4889 * AU, // meters
    inclination: 1.4316, // degrees
    longitudeAscending: 314.41, // degrees
    argumentOfPeriapsis: 158.12, // degrees
    meanAnomaly: 0, // degrees (value at epoch)
  },
  siderealRotationPeriod: 15.16 * Time.HOUR,
  color: DEFAULT_ASTEROID_COLOR,
};

export const ASTEROIDS = [CERES, PALLAS, VESTA, HYGIEA, JUNO, RYUGU, LUTETIA, EROS, MATHILDE, NEREUS];
export const COMETS: Array<CelestialBody> = [CG67P];

export const PLUTO: CelestialBody = {
  name: '134340 Pluto',
  shortName: 'Pluto',
  type: CelestialBodyType.DWARF_PLANET,
  // TODO: Charon is large enough that Charon and Pluto co-orbit their central mass; this is not reflected by this
  //  parent-child relationship
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.2488,
    semiMajorAxis: 5906440628e3,
    inclination: 17.16,
    longitudeAscending: 110.299,
    argumentOfPeriapsis: 113.834,
    meanAnomaly: 14.53,
  },
  mass: 1.3025e22,
  radius: 1188.3e3,
  siderealRotationPeriod: 6 * Time.DAY + 9 * Time.HOUR + 17.6 * Time.MINUTE, // - 6 days 9 hr 17.6 min (sideways)
  color: '#E7C7A4',
};

export const CHARON: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Charon',
  influencedBy: [SOL.name, PLUTO.name],
  elements: {
    wrt: PLUTO.name,
    epoch: 'JD2452600.5', // TODO: find J2000
    eccentricity: 0.000161,
    semiMajorAxis: 19595.764e3,
    inclination: 0.08,
    longitudeAscending: 223.046,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0, // TODO: find
  },
  mass: 1.586e21,
  radius: 606e3,
  siderealRotationPeriod: 6 * Time.DAY + 9 * Time.HOUR + 17 * Time.MINUTE + 35.89, // mutually tidally locked w/ pluto
  color: DEFAULT_MOON_COLOR,
};

export const STYX: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Styx',
  influencedBy: [SOL.name, PLUTO.name],
  elements: {
    wrt: PLUTO.name,
    epoch: 'unknown', // TODO
    eccentricity: 0.005787,
    semiMajorAxis: 42656e3,
    inclination: 0.809,
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 7.5e15,
  radius: 12e3 / 2, // rough; not spherical
  siderealRotationPeriod: 3.24 * Time.DAY,
  color: DEFAULT_MOON_COLOR,
};

export const NIX: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Nix',
  influencedBy: [SOL.name, PLUTO.name],
  elements: {
    wrt: PLUTO.name,
    epoch: 'unknown', // TODO
    eccentricity: 0.002036,
    semiMajorAxis: 48694e3,
    inclination: 0.133,
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.6e16,
  radius: 35e3 / 2, // not spherical
  color: DEFAULT_MOON_COLOR,
};

export const KERBEROS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Kerberos',
  influencedBy: [SOL.name, PLUTO.name],
  elements: {
    wrt: PLUTO.name,
    epoch: 'unknown', // TODO
    eccentricity: 0.00328,
    semiMajorAxis: 57783e3,
    inclination: 0.389,
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.65e16,
  radius: 12e3 / 2, // not spherical
  siderealRotationPeriod: 5.31 * Time.DAY,
  color: DEFAULT_MOON_COLOR,
};

export const HYDRA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Hydra',
  influencedBy: [SOL.name, PLUTO.name],
  elements: {
    wrt: PLUTO.name,
    epoch: 'unknown', // TODO
    eccentricity: 0.005862,
    semiMajorAxis: 64738e3,
    inclination: 0.242,
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 3.01e16,
  radius: 19e3, // not spherical
  color: DEFAULT_MOON_COLOR,
};

export const PLUTO_SYSTEM = [PLUTO, CHARON, STYX, NIX, KERBEROS, HYDRA];

export const QUAOAR: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '50000 Quaoar',
  shortName: 'Quaoar',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459000.5', // TODO: find J2000
    eccentricity: 0.04106,
    semiMajorAxis: 43.694 * AU,
    inclination: 7.9895,
    longitudeAscending: 188.927,
    argumentOfPeriapsis: 147.48,
    meanAnomaly: 301.104,
  },
  mass: 1.2e21,
  radius: 545e3,
  color: DEFAULT_ASTEROID_COLOR,
};

export const SEDNA: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '90377 Sedna',
  shortName: 'Sedna',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2458900.5', // TODO: find J2000
    eccentricity: 0.8496,
    semiMajorAxis: 506 * AU,
    inclination: 11.9307,
    longitudeAscending: 144.248,
    argumentOfPeriapsis: 311.352,
    meanAnomaly: 358.117,
  },
  mass: 2.5e21, // very rough estimate
  radius: 906e3 / 2,
  color: DEFAULT_ASTEROID_COLOR,
};

export const ORCUS: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '90482 Orcus',
  shortName: 'Orcus',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459000.5', // TODO: find J2000
    eccentricity: 0.22701,
    semiMajorAxis: 39.174 * AU,
    inclination: 20.592,
    longitudeAscending: 268.799,
    argumentOfPeriapsis: 72.31,
    meanAnomaly: 181.735,
  },
  mass: 6.348e20, // very rough estimate
  radius: 910e3 / 2,
  color: DEFAULT_ASTEROID_COLOR,
};

export const ERIS: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '136199 Eris',
  shortName: 'Eris',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459000.5', // TODO: find J2000
    eccentricity: 0.43607,
    semiMajorAxis: 67.864 * AU,
    inclination: 44.04,
    longitudeAscending: 35.951,
    argumentOfPeriapsis: 151.639,
    meanAnomaly: 205.989,
  },
  mass: 1.6466e22,
  radius: 1163e3,
  color: DEFAULT_ASTEROID_COLOR,
};

export const HAUMEA: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '136108 Haumea',
  shortName: 'Haumea',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459200.5', // TODO: find J2000
    eccentricity: 0.19642,
    semiMajorAxis: 43.116 * AU,
    inclination: 28.2137,
    longitudeAscending: 122.167,
    argumentOfPeriapsis: 239.041,
    meanAnomaly: 218.205,
  },
  mass: 4.006e21,
  radius: 780e3,
  color: DEFAULT_ASTEROID_COLOR,
};

export const MAKEMAKE: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '136472 Makemake',
  shortName: 'Makemake',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'JD2458900.5', // TODO: find J2000
    eccentricity: 0.16126,
    semiMajorAxis: 45.43 * AU,
    inclination: 28.9835,
    longitudeAscending: 79.62,
    argumentOfPeriapsis: 294.834,
    meanAnomaly: 165.514,
  },
  mass: 3.1e21,
  radius: 715e3,
  color: DEFAULT_ASTEROID_COLOR,
};

export const ARROKOTH: CelestialBody = {
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '486958 Arrokoth', // also known as Ultima Thule
  shortName: 'Arrokoth',
  influencedBy: [SOL.name],
  mass: 7.485e14, // kg
  radius: 18e3, // m (average radius based on length of 36 km)
  elements: {
    wrt: SOL.name,
    epoch: 'JD2458600.5', // TODO: find J2000
    eccentricity: 0.04172,
    semiMajorAxis: 44.581 * AU,
    inclination: 2.4512, // degrees
    longitudeAscending: 158.998, // degrees
    argumentOfPeriapsis: 174.418, // degrees
    meanAnomaly: 316.551, // degrees
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const GONGGONG: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '225088 Gonggong',
  shortName: 'Gonggong',
  influencedBy: [SOL.name],
  mass: 1.75e21, // kg
  radius: 615e3, // m
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459200.5', // TODO: find J2000
    eccentricity: 0.49943,
    semiMajorAxis: 67.485 * AU,
    inclination: 30.6273, // degrees
    longitudeAscending: 336.8573, // degrees
    argumentOfPeriapsis: 207.6675, // degrees
    meanAnomaly: 106.496, // degrees
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const VP113: CelestialBody = {
  type: CelestialBodyType.DWARF_PLANET,
  name: '2012 VP133',
  influencedBy: [SOL.name],
  mass: 1e21, // very very rough guess -- not known
  radius: 574e3 / 2, // m
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459800.5', // TODO: find J2000
    eccentricity: 0.7036,
    semiMajorAxis: 271.5 * AU,
    inclination: 24.0563, // degrees
    longitudeAscending: 90.787, // degrees
    argumentOfPeriapsis: 293.8, // degrees
    meanAnomaly: 3.5, // degrees
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const LELEAKUHONUA: CelestialBody = {
  type: CelestialBodyType.TRANS_NEPTUNIAN_OBJECT,
  name: '541132 Leleākūhonua',
  shortName: 'Leleākūhonua',
  influencedBy: [SOL.name],
  mass: 1e20, // unknown, extremely rough guess
  radius: 110e3 / 2,
  elements: {
    wrt: SOL.name,
    epoch: 'JD2459000.5', // TODO: find J2000
    eccentricity: 0.93997,
    semiMajorAxis: 1085 * AU,
    inclination: 11.654, // degrees
    longitudeAscending: 300.78, // degrees
    argumentOfPeriapsis: 117.778, // degrees
    meanAnomaly: 359.418, // degrees
  },
  color: DEFAULT_ASTEROID_COLOR,
};

export const TRANS_NEPTUNIAN_OBJECTS: Array<CelestialBody> = [
  QUAOAR,
  SEDNA,
  ORCUS,
  ERIS,
  HAUMEA,
  MAKEMAKE,
  ARROKOTH,
  GONGGONG,
  VP113,
  LELEAKUHONUA,
];

export const JUPITER: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Jupiter',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.0489,
    semiMajorAxis: 778340821e3,
    inclination: 1.303,
    longitudeAscending: 100.464,
    argumentOfPeriapsis: 273.867,
    meanAnomaly: 20.02,
  },
  mass: 1.8982e27,
  radius: 69911e3,
  siderealRotationPeriod: 9 * Time.HOUR + 55 * Time.MINUTE + 30, // 9 hr 55 min 30 sec
  color: '#e9be76',
};

export const IO: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Io',
  influencedBy: [SOL.name, JUPITER.name],
  elements: {
    wrt: JUPITER.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0041,
    semiMajorAxis: 421800e3,
    inclination: 0.036,
    longitudeAscending: 0, // approximate
    argumentOfPeriapsis: 0, // approximated for circular orbits
    meanAnomaly: 0,
  },
  mass: 8.931938e22,
  radius: 1821.6e3,
  color: DEFAULT_MOON_COLOR,
};

export const EUROPA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Europa',
  influencedBy: [SOL.name, JUPITER.name],
  elements: {
    wrt: JUPITER.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0094,
    semiMajorAxis: 671100e3,
    inclination: 0.466,
    longitudeAscending: 0, // approximate
    argumentOfPeriapsis: 0, // approximated for circular orbits
    meanAnomaly: 0,
  },
  mass: 4.799844e22,
  radius: 1560.8e3,
  color: DEFAULT_MOON_COLOR,
};

export const GANYMEDE: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Ganymede',
  influencedBy: [SOL.name, JUPITER.name],
  elements: {
    wrt: JUPITER.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0013,
    semiMajorAxis: 1070400e3,
    inclination: 0.177,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.4819e23,
  radius: 2634.1e3,
  color: DEFAULT_MOON_COLOR,
};

export const CALLISTO: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Callisto',
  influencedBy: [SOL.name, JUPITER.name],
  elements: {
    wrt: JUPITER.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0074,
    semiMajorAxis: 1882700e3,
    inclination: 0.192,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.075938e23,
  radius: 2410.3e3,
  color: DEFAULT_MOON_COLOR,
};

// TODO: there are more moons
export const JUPITER_SYSTEM = [JUPITER, IO, EUROPA, GANYMEDE, CALLISTO];

export const SATURN: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Saturn',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.0565,
    semiMajorAxis: 1433.53e9,
    inclination: 2.485,
    longitudeAscending: 113.665,
    argumentOfPeriapsis: 339.392,
    meanAnomaly: 317.02,
  },
  mass: 5.6834e26,
  radius: 58232e3,
  siderealRotationPeriod: 10 * Time.HOUR + 32 * Time.MINUTE + 35, // 10 hr 32 min 35 sec
  color: '#d7be87',
};

export const MIMAS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Mimas',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0196,
    semiMajorAxis: 185540e3,
    inclination: 1.574,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 3.7493e19,
  radius: 198.2e3,
  color: DEFAULT_MOON_COLOR,
};

export const ENCELADUS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Enceladus',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0047,
    semiMajorAxis: 238040e3,
    inclination: 0.009,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.08022e20,
  radius: 252.1e3,
  color: DEFAULT_MOON_COLOR,
};

export const TETHYS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Tethys',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0001,
    semiMajorAxis: 294670e3,
    inclination: 1.091,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 6.17449e20,
  radius: 531.1e3,
  color: DEFAULT_MOON_COLOR,
};

export const DIONE: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Dione',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0022,
    semiMajorAxis: 377420e3,
    inclination: 0.028,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.095452e21,
  radius: 561.4e3,
  color: DEFAULT_MOON_COLOR,
};

export const RHEA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Rhea',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.001,
    semiMajorAxis: 527070e3,
    inclination: 0.345,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 2.306518e21,
  radius: 763.8e3,
  color: DEFAULT_MOON_COLOR,
};

export const TITAN: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Titan',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0288,
    semiMajorAxis: 1221870e3,
    inclination: 0.348,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.3452e23,
  radius: 2574.7e3,
  color: DEFAULT_MOON_COLOR,
};

export const IAPETUS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Iapetus',
  influencedBy: [SOL.name, SATURN.name],
  elements: {
    wrt: SATURN.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0286,
    semiMajorAxis: 3560820e3,
    inclination: 15.47,
    longitudeAscending: 0,
    argumentOfPeriapsis: 0,
    meanAnomaly: 0,
  },
  mass: 1.805635e21,
  radius: 734.5e3,
  color: DEFAULT_MOON_COLOR,
};

// TODO: there are more moons
export const SATURN_SYSTEM = [SATURN, MIMAS, ENCELADUS, TETHYS, DIONE, RHEA, TITAN, IAPETUS];

export const URANUS: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Uranus',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000',
    eccentricity: 0.04717,
    semiMajorAxis: 19.19126 * AU,
    inclination: 0.773,
    longitudeAscending: 74.006,
    argumentOfPeriapsis: 96.998857,
    meanAnomaly: 142.2386,
  },
  mass: 8.681e25,
  radius: 25362e3,
  siderealRotationPeriod: -17 * Time.HOUR + 14 * Time.MINUTE + 24, // -17 hr 14 min 24 sec
  color: '#9bcee6',
};

export const PUCK: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Puck',
  influencedBy: [SOL.name, URANUS.name],
  elements: {
    wrt: URANUS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.00012,
    semiMajorAxis: 86004.444e3,
    inclination: 0.31921, // TODO: to Uranus's equator, should this be adjusted?
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.91e18,
  radius: 81e3 / 2,
  color: DEFAULT_MOON_COLOR,
};

export const MIRANDA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Miranda',
  influencedBy: [SOL.name, URANUS.name],
  elements: {
    wrt: URANUS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0013,
    semiMajorAxis: 129390e3,
    inclination: 4.232, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 6.293e19,
  radius: 235.8e3,
  color: DEFAULT_MOON_COLOR,
};

export const ARIEL: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Ariel',
  influencedBy: [SOL.name, URANUS.name],
  elements: {
    wrt: URANUS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0012,
    semiMajorAxis: 190900e3,
    inclination: 0.26, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.2331e21,
  radius: 578.9e3,
  color: DEFAULT_MOON_COLOR,
};

export const UMBRIEL: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Umbriel',
  influencedBy: [SOL.name, URANUS.name],
  elements: {
    wrt: URANUS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0039,
    semiMajorAxis: 266000e3,
    inclination: 0.128, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.2885e21,
  radius: 584.7e3,
  color: DEFAULT_MOON_COLOR,
};

export const TITANIA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Titania',
  influencedBy: [SOL.name, URANUS.name],
  elements: {
    wrt: URANUS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0011,
    semiMajorAxis: 435910e3,
    inclination: 0.34, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 3.455e21,
  radius: 788.4e3,
  color: DEFAULT_MOON_COLOR,
};

export const OBERON: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Oberon',
  influencedBy: [SOL.name, URANUS.name],
  elements: {
    wrt: URANUS.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0014,
    semiMajorAxis: 583520e3,
    inclination: 0.058, // to Uranus's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 3.1104e21,
  radius: 761.4e3,
  color: DEFAULT_MOON_COLOR,
};

export const URANUS_SYSTEM = [URANUS, PUCK, MIRANDA, ARIEL, UMBRIEL, TITANIA, OBERON];

export const NEPTUNE: CelestialBody = {
  type: CelestialBodyType.PLANET,
  name: 'Neptune',
  influencedBy: [SOL.name],
  elements: {
    wrt: SOL.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.008678,
    semiMajorAxis: 4503443661e3,
    inclination: 1.77,
    longitudeAscending: 131.783,
    argumentOfPeriapsis: 273.187,
    meanAnomaly: 259.883,
  },
  mass: 1.02409e26,
  radius: 24622e3,
  siderealRotationPeriod: 16 * Time.HOUR + 6.6 * Time.MINUTE, // 16 hr 6.6 min
  color: '#5a7cf6',
};

const neptuneAxialTilt = 28.32; // relative to its orbit
export const TRITON: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Triton',
  influencedBy: [SOL.name, NEPTUNE.name],
  elements: {
    wrt: NEPTUNE.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.000016,
    semiMajorAxis: 354759e3,
    inclination: 129.608, // to Neptune's orbit -- is this the right inclination to use?
    longitudeAscending: 177.70910343, // TODO: some uncertainty with these two values
    argumentOfPeriapsis: 260.64357,
    meanAnomaly: 0,
  },
  mass: 2.1389e22,
  radius: 1353.4e3,
  siderealRotationPeriod: 5 * Time.DAY + 21 * Time.HOUR + 2 * Time.MINUTE + 53, // 5 d, 21 h, 2 min, 53 s
  color: DEFAULT_MOON_COLOR,
};

export const PROTEUS: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Proteus',
  influencedBy: [SOL.name, NEPTUNE.name],
  elements: {
    wrt: NEPTUNE.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.0005,
    semiMajorAxis: 117646e3,
    inclination: 0.524 - neptuneAxialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.5e19, // wide uncertainty bars
  radius: 209e3,
  color: DEFAULT_MOON_COLOR,
};

export const NEREID: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Nereid',
  influencedBy: [SOL.name, NEPTUNE.name],
  elements: {
    wrt: NEPTUNE.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.749,
    semiMajorAxis: 5504000e3,
    inclination: 5.8, // to the ecliptic
    longitudeAscending: 326.0,
    argumentOfPeriapsis: 290.3,
    meanAnomaly: 318.0,
  },
  mass: 3.57e19,
  radius: 357e3 / 2,
  color: DEFAULT_MOON_COLOR,
};

export const DESPINA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Despina',
  influencedBy: [SOL.name, NEPTUNE.name],
  elements: {
    wrt: NEPTUNE.name,
    epoch: 'J2000', // TODO: verify
    eccentricity: 0.00038,
    semiMajorAxis: 52525.95e3,
    inclination: 0.216 - neptuneAxialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 1.1e18, // high uncertainty
  radius: 75e3,
  color: DEFAULT_MOON_COLOR,
};

export const LARISSA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Larissa',
  influencedBy: [SOL.name, NEPTUNE.name],
  elements: {
    wrt: NEPTUNE.name,
    epoch: 'Epoch 18 August 1989', // TODO: find J2000
    eccentricity: 0.001393,
    semiMajorAxis: 73548.26e3,
    inclination: 0.251 - neptuneAxialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.5e18, // very high uncertainty
  radius: 97e3,
  color: DEFAULT_MOON_COLOR,
};

export const GALATEA: CelestialBody = {
  type: CelestialBodyType.MOON,
  name: 'Galatea',
  influencedBy: [SOL.name, NEPTUNE.name],
  elements: {
    wrt: NEPTUNE.name,
    epoch: 'Epoch 18 August 1989', // TODO: find J2000
    eccentricity: 0.00022,
    semiMajorAxis: 61952.57e3,
    inclination: 0.052 - neptuneAxialTilt, // to Neptune's equator
    longitudeAscending: 0, // TODO
    argumentOfPeriapsis: 0, // TODO
    meanAnomaly: 0, // TODO
  },
  mass: 2.5e18, // very high uncertainty
  radius: 97e3,
  color: DEFAULT_MOON_COLOR,
};

// TODO: there are more moons
export const NEPTUNE_SYSTEM = [NEPTUNE, GALATEA, LARISSA, DESPINA, NEREID, PROTEUS, TRITON];

export const SOLAR_SYSTEM = [
  SOL,
  MERCURY,
  VENUS,
  ...EARTH_SYSTEM,
  ...ASTEROIDS,
  ...COMETS,
  ...MARS_SYSTEM,
  ...JUPITER_SYSTEM,
  ...SATURN_SYSTEM,
  ...URANUS_SYSTEM,
  ...NEPTUNE_SYSTEM,
  ...PLUTO_SYSTEM,
  ...TRANS_NEPTUNIAN_OBJECTS,
];
export const SOLAR_SYSTEM_BY_NAME = SOLAR_SYSTEM.reduce<Record<string, CelestialBody>>(
  (acc, b) => ({ ...acc, [b.name]: b }),
  {}
);

export const ASTEROID_BELT: Belt = { min: 2.2 * AU, max: 3.2 * AU };
export const KUIPER_BELT: Belt = { min: 30 * AU, max: 55 * AU };

export const CELESTIAL_BODY_NAMES: Array<string> = SOLAR_SYSTEM.map(({ name }) => name);
export const CELESTIAL_BODY_SHORT_NAMES: Array<string | undefined> = SOLAR_SYSTEM.map(({ shortName }) => shortName);
export const CELESTIAL_BODY_CLASSES: Array<CelestialBodyType> = SOLAR_SYSTEM.map(({ type }) => type);