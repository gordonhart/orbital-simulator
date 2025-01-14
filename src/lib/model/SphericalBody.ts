import {
  Color,
  Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Scene,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';
import { asCdnUrl } from '../images.ts';
import { degreesToRadians } from '../physics.ts';
import { CelestialBody, CelestialBodyType } from '../types.ts';
import { HOVER_SCALE_FACTOR, SCALE_FACTOR } from './constants.ts';
import { RingObject } from './RingObject.ts';

export class SphericalBody {
  private readonly scene: Scene;
  private readonly body: CelestialBody;
  private readonly sphere: Mesh;
  private readonly rings: Array<RingObject>;

  private readonly spherePoints: number = 144;

  constructor(scene: Scene, body: CelestialBody, position: Vector3) {
    this.scene = scene;
    this.body = body;

    const positionScaled = position.clone().divideScalar(SCALE_FACTOR);
    const sphereGeometry = new SphereGeometry(body.radius / SCALE_FACTOR, this.spherePoints, this.spherePoints);
    const sphereMaterial = this.getShapeMaterial();
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    const inclination = degreesToRadians(body.elements.inclination);
    const axialTilt = body.rotation != null ? degreesToRadians(body.rotation.axialTilt) : 0;
    this.sphere.rotation.x = Math.PI / 2 + inclination + axialTilt;
    this.sphere.position.set(positionScaled.x, positionScaled.y, positionScaled.z);
    this.sphere.renderOrder = 1;
    scene.add(this.sphere);

    this.rings = (body.rings ?? []).map(ring => new RingObject(scene, body, ring, position));
  }

  update(position: Vector3, rotation: number, visible: boolean) {
    this.sphere.updateWorldMatrix(true, false);
    this.sphere.position.copy(position).divideScalar(SCALE_FACTOR);
    this.sphere.rotation.y = degreesToRadians(rotation);
    this.sphere.visible = visible;
    this.rings.forEach(ring => ring.update(position, visible));
  }

  setHover(hovered: boolean) {
    if (hovered) {
      this.sphere.scale.multiplyScalar(HOVER_SCALE_FACTOR);
    } else {
      this.sphere.scale.divideScalar(HOVER_SCALE_FACTOR);
    }
    this.rings.forEach(ring => ring.setHover(hovered));
  }

  dispose() {
    this.sphere.geometry.dispose();
    (this.sphere.material as Material).dispose();
    this.scene.remove(this.sphere);
    this.rings.forEach(ring => ring.dispose());
  }

  private getShapeMaterial(): Material {
    const color = new Color(this.body.color);
    const texture = this.body.assets?.texture;
    const emissive = this.body.type === CelestialBodyType.STAR;

    if (texture != null) {
      const textureLoader = new TextureLoader();
      const textureMap = textureLoader.load(asCdnUrl(texture));
      if (emissive) {
        // TODO: better parameterization of this?
        return new MeshStandardMaterial({
          map: textureMap,
          emissive: color, // Emissive color (same as base for glow)
          emissiveIntensity: 0.5, // Intensity of the emissive glow
          roughness: 0.2, // Lower roughness for more shine
          metalness: 0.1, // Lower metalness for less reflection
        });
      }
      return new MeshStandardMaterial({ map: textureMap, metalness: 0, roughness: 1 });
    }
    return new MeshBasicMaterial({ color });
  }
}
