import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as THREE from "three/webgpu";
import {
  Fn,
  vec4,
  uv,
  time,
  sin,
  vec2,
  positionLocal,
  vec3,
  fract,
  length,
  div,
  abs,
  float,
  cos,
} from "three/tsl";
import MathNode from "three/src/nodes/math/MathNode.js";
import OperatorNode from "three/src/nodes/math/OperatorNode.js";

export class Experience {
  private _canvas: HTMLCanvasElement;

  private _scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGPURenderer;
  private _controls: OrbitControls;
  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;

    this._camera = new THREE.PerspectiveCamera(
      25,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this._camera.position.set(0, 0, 5);

    this._scene = new THREE.Scene();

    this._renderer = new THREE.WebGPURenderer({
      antialias: true,
      canvas: this._canvas,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setAnimationLoop(this.animate);

    this._controls = new OrbitControls(this._camera, this._renderer.domElement);
    this._controls.enableDamping = true;
    this._controls.minDistance = 0.1;
    this._controls.maxDistance = 50;
    this._controls.target.y = 0;
    this._controls.target.z = 0;
    this._controls.target.x = 0;

    window.addEventListener("resize", this.onWindowResize);

    this.defaultPlane();
  }

  private defaultPlane = () => {
    const planeSize = { width: 2, height: 2 };
    const boxGeometry = new THREE.BoxGeometry(
      planeSize.width,
      planeSize.height,
      1,
      64,
      64,
      64
    );

    const boxMaterial = new THREE.MeshStandardNodeMaterial({
      transparent: false,
      side: THREE.FrontSide,
    });

    const samplerTexture = new THREE.TextureLoader().load("/uv_grid.jpg");
    samplerTexture.wrapS = THREE.RepeatWrapping;
    samplerTexture.colorSpace = THREE.SRGBColorSpace;

    const aspectUvs = () => {
      const uvs = uv();

      const planeAspect = float(planeSize.width).div(planeSize.height);
      const aspectUvs = uvs.mul(vec2(planeAspect, 1));
      return aspectUvs;
    };

    const repeatedUvsGen = (repeatation: number) => {
      const uvs = aspectUvs();
      const repeatedUvs = uvs.mul(repeatation);
      return repeatedUvs;
    };

    const scrollingUvs = (
      uvs: THREE.ShaderNodeObject<OperatorNode>,
      offset: THREE.ShaderNodeObject<THREE.Node>
    ) => {
      const scrollingUvs = uvs.add(time.mul(offset));
      return scrollingUvs;
    };

    const paletteNode = (uvs: THREE.ShaderNodeObject<MathNode>) => {
      const a = vec3(0.5, 0.5, 0.5);
      const b = vec3(0.5, 0.5, 0.5);
      const c = vec3(1, 1, 1);
      const d = vec3(0.263, 0.416, 0.557);
      const ab = a.add(b);

      const td = uvs.add(d);
      const ctd = c.mul(td).mul(6.28);
      const cosctd = cos(ctd);
      const palette = ab.add(cosctd);
      return palette;
    };

    boxMaterial.colorNode = Fn(() => {
      const scaledTime = time.mul(0.5);

      const repeatedUvs = scrollingUvs(repeatedUvsGen(10), vec2(0, 2));

      const fractUvs = vec2(
        repeatedUvs.x.fract().sub(0.5),
        repeatedUvs.y.fract().sub(0.5)
      );
      const len = float(0.02).div(
        abs(sin(length(fractUvs).add(scaledTime).mul(8.0)).div(8))
      );

      const uvs1 = length(uv());

      const palette = paletteNode(uvs1);

      const lenVec = vec3(len, len, len);
      const pl = palette.mul(lenVec);

      const vec4Pl = vec4(pl, 1.0);

      return vec4Pl;
    })();

    boxMaterial.positionNode = Fn(() => {
      const position = positionLocal.toVec3().toVar();
      const cosY = cos(position.y.mul(2));
      const sinY = sin(position.y.mul(2));
      const positionLocalVec = vec3(
        position.x.mul(cosY).sub(position.z.mul(sinY)),
        position.y.mul(1.5),
        position.x.mul(sinY).add(position.z.mul(cosY))
      );
      return positionLocalVec;
    })();

    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    this._scene.add(box);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 5, 5);
    this._scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, 5, 0);
    this._scene.add(directionalLight2);

    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight3.position.set(5, 5, 0);
    this._scene.add(directionalLight3);

    const directionalLight4 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight4.position.set(0, 5, -5);
    this._scene.add(directionalLight4);
  };

  private onWindowResize = () => {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize(window.innerWidth, window.innerHeight);
  };

  private animate = () => {
    this._controls.update();
    this._renderer.render(this._scene, this._camera);
  };
}
