import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import styles from './Share.module.css';

/* Needs the three package:  npm i three */

/* ================================================================
   CONTENT
   ================================================================ */
const SHARE_TEXT = 'Find scholarships, jobs and campus news for Wollo University on Wollo-Info:';

const ICONS = {
  telegram: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  whatsapp: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
};

const buildTargets = (url) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(SHARE_TEXT);
  return [
    { name: 'Telegram', icon: ICONS.telegram, href: `https://t.me/share/url?url=${u}&text=${t}` },
    { name: 'WhatsApp', icon: ICONS.whatsapp, href: `https://wa.me/?text=${t}%20${u}` },
    { name: 'Facebook', icon: ICONS.facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: 'X', icon: ICONS.x, href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { name: 'LinkedIn', icon: ICONS.linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
  ];
};

/* ================================================================
   THREE.JS ROBOT
   ================================================================ */
const HEAD_GLB = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172206_0181329a-86e2-41c9-8ab8-c496f29aaa53.glb';
const ARM_GLB = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261018_172137_cd6086ec-07ef-44dc-bd15-95a450ddaa8c.glb';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const TOP_GAP = 24; // space above the robot on phones (this section has no fixed navbar)

function radialTexture(stops, size = 256) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([o, col]) => gr.addColorStop(o, col));
  g.fillStyle = gr;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* Dark studio built from round emissive "softboxes" (no planes, no point lights) */
function buildEnvironment(renderer) {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x030305);
  const boxes = [
    [0xffffff, 5, 3.2, [-3, 4.5, 4], 3.2],
    [0xffffff, 1.2, 6, [6, 0.5, 2], 1.1],
    [0xffffff, 3, 1, [1.5, 5, -1], 0.8],
    [0x7c4dff, 4, 5, [-5, 0, -4], 1.0],
    [0x7c4dff, 4, 5, [5, 0, -4], 1.0],
    [0x5b30ff, 6, 3, [0, -5, 1], 0.35],
  ];
  boxes.forEach(([color, w, h, pos, k]) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 16),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k) })
    );
    m.scale.set(w, h, 0.3);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    envScene.add(m);
  });
  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromScene(envScene, 0.02);
  pmrem.dispose();
  envScene.traverse((o) => {
    if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); }
  });
  return target;
}

/* Fresnel rim light (lavender edge) */
function rimMaterial(color, power, strength) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uStrength: { value: strength },
    },
    vertexShader: `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uStrength;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), uPower);
        gl_FragColor = vec4(uColor * f * uStrength, f);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function prepareModel(root, { glossy, rim, tint, useMap, smooth }) {
  /* collect first, then modify (adding children inside traverse would recurse forever) */
  const meshes = [];
  root.traverse((o) => { if (o.isMesh) meshes.push(o); });

  meshes.forEach((mesh) => {
    if (smooth) {
      let g = mesh.geometry.clone();
      ['normal', 'uv', 'uv1', 'tangent', 'color'].forEach((a) => g.deleteAttribute(a));
      g = mergeVertices(g, 1e-3);
      g.computeVertexNormals();
      mesh.geometry = g;
    }
    const old = mesh.material;
    const params = glossy
      ? { metalness: 0.1, roughness: 0.3, clearcoat: 1.0, clearcoatRoughness: 0.16, envMapIntensity: 0.9 }
      : { metalness: 0, roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.4, envMapIntensity: 0.55 };
    mesh.material = new THREE.MeshPhysicalMaterial({
      map: useMap && old && old.map ? old.map : null,
      color: new THREE.Color(tint),
      ...params,
    });
    if (rim) {
      const shell = new THREE.Mesh(mesh.geometry, rimMaterial(rim.color, rim.power, rim.strength));
      shell.renderOrder = 2;
      mesh.add(shell);
    }
  });
}

function normaliseHead(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  root.scale.multiplyScalar(2 / size.z);
  const b2 = new THREE.Box3().setFromObject(root);
  const c = b2.getCenter(new THREE.Vector3());
  root.position.set(-c.x, -(b2.min.y + 1), -c.z);
}

function normaliseArm(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  root.scale.multiplyScalar(0.78 / size.y);
  const b2 = new THREE.Box3().setFromObject(root);
  root.position.sub(b2.getCenter(new THREE.Vector3()));
  const g = new THREE.Group();
  g.add(root);
  return g;
}

/* ── Fallbacks if a GLB fails to load ── */
function fallbackHead() {
  const g = new THREE.Group();
  const mat = () => new THREE.MeshPhysicalMaterial({ color: 0x2c2c35, roughness: 0.26, clearcoat: 1 });
  g.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), mat()));
  [-1, 1].forEach((s) => {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.16, 32), mat());
    cap.rotation.z = Math.PI / 2;
    cap.position.set(s * 1.02, 0, 0);
    g.add(cap);
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 12), mat());
    rod.position.set(s * 0.42, 1.05, 0);
    g.add(rod);
  });
  return g;
}
function fallbackArm() {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.42, 8, 24), new THREE.MeshPhysicalMaterial({ color: 0x1b1b21 })));
  return g;
}

/* ── Visor (rounded rectangle wrapped onto the head sphere) ── */
function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function subdivide(pos) {
  const out = [];
  for (let i = 0; i < pos.length; i += 9) {
    const a = [pos[i], pos[i + 1], pos[i + 2]];
    const b = [pos[i + 3], pos[i + 4], pos[i + 5]];
    const c = [pos[i + 6], pos[i + 7], pos[i + 8]];
    const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2];
    const ab = mid(a, b);
    const bc = mid(b, c);
    const ca = mid(c, a);
    [[a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]].forEach((t) => t.forEach((p) => out.push(...p)));
  }
  return out;
}

function visorGeometry(w, h, corner, cy, radius) {
  const base = new THREE.ShapeGeometry(roundedRectShape(w, h, corner), 48).toNonIndexed();
  let pos = Array.from(base.getAttribute('position').array);
  base.dispose();
  for (let i = 0; i < 3; i += 1) pos = subdivide(pos);

  const p = new Float32Array(pos.length);
  const n = new Float32Array(pos.length);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i];
    const y = pos[i + 1] + cy;
    const z = Math.sqrt(Math.max(0, radius * radius - x * x - y * y));
    p[i] = x; p[i + 1] = y; p[i + 2] = z;
    v.set(x, y, z).normalize();
    n[i] = v.x; n[i + 1] = v.y; n[i + 2] = v.z;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(n, 3));
  return g;
}

function addVisor(head, R) {
  const bezel = new THREE.Mesh(
    visorGeometry(1.86, 1.12, 0.46, -0.07, R * 1.03),
    new THREE.MeshPhysicalMaterial({
      color: 0x0c0c10, roughness: 0.3, metalness: 0.3, clearcoat: 0.8,
      polygonOffset: true, polygonOffsetFactor: -6, polygonOffsetUnits: -6,
    })
  );
  bezel.renderOrder = 3;
  const glass = new THREE.Mesh(
    visorGeometry(1.74, 1.0, 0.4, -0.07, R * 1.036),
    new THREE.MeshPhysicalMaterial({
      color: 0x000000, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 0.9,
      polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -8,
    })
  );
  glass.renderOrder = 4;
  head.add(bezel, glass);
}

/* ── Eyes (procedural, so the pupils can track the cursor) ── */
function makeEye(R, x, y, glowTex, irisTex) {
  const z = Math.sqrt(Math.max(0, (R * 1.055) ** 2 - x * x - y * y));
  const eye = new THREE.Group();
  eye.position.set(x, y, z);
  eye.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), eye.position.clone().normalize());

  const mat = (o) => new THREE.MeshBasicMaterial({
    transparent: true, toneMapped: false, depthWrite: false, depthTest: false, ...o,
  });
  const put = (mesh, z0, order) => {
    mesh.position.z = z0;
    mesh.renderOrder = order;
    return mesh;
  };

  const halo = put(new THREE.Mesh(
    new THREE.CircleGeometry(0.42, 48),
    mat({ map: glowTex, color: 0x8a5cff, opacity: 0.24, blending: THREE.AdditiveBlending })
  ), -0.004, 10);
  const ring = put(new THREE.Mesh(
    new THREE.RingGeometry(0.168, 0.212, 64),
    mat({ color: new THREE.Color(1.1, 0.88, 2.0) })
  ), 0, 11);
  const iris = put(new THREE.Mesh(
    new THREE.CircleGeometry(0.17, 48),
    mat({ map: irisTex, color: new THREE.Color(1.0, 0.95, 1.15) })
  ), 0.001, 12);

  const pupilWrap = new THREE.Group();
  const pupil = put(new THREE.Mesh(new THREE.CircleGeometry(0.083, 32), mat({ color: 0x07040f })), 0.003, 13);
  const glint = put(new THREE.Mesh(new THREE.CircleGeometry(0.022, 16), mat({ color: 0xffffff })), 0.005, 14);
  glint.position.x = 0.032;
  glint.position.y = 0.034;
  pupilWrap.add(pupil, glint);

  eye.add(halo, ring, iris, pupilWrap);
  return { eye, pupilWrap };
}

/* head-local vertices: [x, y, z] for every mesh under root */
function headVertices(head, root, visit) {
  head.updateMatrixWorld(true);
  const inv = head.matrixWorld.clone().invert();
  const v = new THREE.Vector3();
  root.traverse((o) => {
    if (!o.isMesh) return;
    const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld);
    const pos = o.geometry.getAttribute('position');
    for (let i = 0; i < pos.count; i += 1) {
      v.fromBufferAttribute(pos, i).applyMatrix4(m);
      visit(v, o, i, m);
    }
  });
}

function mountHead(head, headRoot, glowTex) {
  head.updateMatrixWorld(true);

  /* a) sphere radius, from a ray shot at the front */
  const ray = new THREE.Raycaster(new THREE.Vector3(0, 0, 5), new THREE.Vector3(0, 0, -1));
  const hit = ray.intersectObject(headRoot, true)[0];
  const R = clamp(hit ? hit.point.length() : 1, 0.85, 1.1);

  /* b) perfectly smooth normals over the sphere part of the mesh */
  const touched = new Set();
  headVertices(head, headRoot, (v, mesh, i, m) => {
    if (Math.abs(v.length() - R) > R * 0.07) return;
    const nAttr = mesh.geometry.getAttribute('normal');
    if (!nAttr) return;
    const nm = new THREE.Matrix3().getNormalMatrix(m).invert();
    const n = v.clone().normalize().applyMatrix3(nm).normalize();
    nAttr.setXYZ(i, n.x, n.y, n.z);
    touched.add(nAttr);
  });
  touched.forEach((a) => { a.needsUpdate = true; });

  /* c) visor */
  addVisor(head, R);

  /* d) eyes */
  const irisTex = radialTexture([[0, '#d7c9ff'], [0.45, '#a07bff'], [0.8, '#7646f2'], [1, '#5c2fe0']]);
  const eyes = [-0.43, 0.43].map((x) => {
    const e = makeEye(R, x, -0.08, glowTex, irisTex);
    head.add(e.eye);
    return e;
  });

  /* e) glowing antenna balls */
  const tops = { left: null, right: null };
  const pts = { left: [], right: [] };
  headVertices(head, headRoot, (v) => {
    if (v.y > 0.75 && Math.abs(v.x) > 0.15) {
      const side = v.x < 0 ? 'left' : 'right';
      pts[side].push(v.clone());
      if (!tops[side] || v.y > tops[side].y) tops[side] = v.clone();
    }
  });
  const antGlows = [];
  ['left', 'right'].forEach((side) => {
    const top = tops[side];
    if (!top) return;
    const near = pts[side].filter((p) => p.distanceTo(top) < 0.2);
    const c = new THREE.Vector3();
    near.forEach((p) => c.add(p));
    c.divideScalar(Math.max(near.length, 1));
    c.y = Math.max(c.y, top.y - 0.1);

    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.118, 32, 16),
      new THREE.MeshPhysicalMaterial({
        color: 0x8b62ff, emissive: 0x6a3dff, emissiveIntensity: 1.5,
        roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.14,
      })
    );
    ball.position.copy(c);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color: 0x9a6bff, opacity: 0.85, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    glow.scale.setScalar(0.5);
    glow.position.copy(c);
    head.add(ball, glow);
    antGlows.push(glow);
  });

  return { eyes, antGlows };
}

function createRobotScene({ hero, canvas, copy, loader }) {
  let disposed = false;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    loader.style.display = 'none'; // no WebGL: the section still works without the robot
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  /* Renders as #0b1219 (the footer colour) after ACES tone mapping + sRGB output.
     A plain 0x0b1219 here would come out almost black, so the linear value is pre-compensated. */
  scene.background = new THREE.Color().setRGB(0.01202, 0.01794, 0.02491, THREE.LinearSRGBColorSpace);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

  const envTarget = buildEnvironment(renderer);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 1.0;

  scene.add(new THREE.HemisphereLight(0xdcd8f0, 0x1a0f3a, 2.3));
  const dir = new THREE.DirectionalLight(0xffffff, 0.55);
  dir.position.set(-3, 4, 5);
  scene.add(dir);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.4, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const glowTex = radialTexture([
    [0, 'rgba(160,120,255,1)'],
    [0.25, 'rgba(124,77,255,.55)'],
    [0.6, 'rgba(90,50,230,.12)'],
    [1, 'rgba(60,30,200,0)'],
  ]);

  /* rig: robot (float / intro) → body (partial turn, holds arms) → head (full turn) */
  const robot = new THREE.Group();
  const body = new THREE.Group();
  const head = new THREE.Group();
  body.add(head);
  robot.add(body);
  scene.add(robot);
  robot.scale.setScalar(0.001);

  /* background haze + floor glow */
  const haze = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: 0x7a55ff, opacity: 0.06, transparent: true,
    blending: THREE.AdditiveBlending, toneMapped: false, depthWrite: false,
  }));
  haze.scale.setScalar(7.5);
  haze.position.set(0, 0.1, -3);
  scene.add(haze);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: glowTex, color: 0x8f6bff, opacity: 0.95, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  floor.position.set(0, -2.05, -0.6);
  floor.scale.set(3.4, 0.42, 1);
  scene.add(floor);

  /* ── layout: where the robot sits and how big it is ── */
  const anchor = { x: 0, y: 0 };
  const look = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let isMobile = false;
  let lastMove = -1e9;

  const layout = () => {
    const W = hero.clientWidth;
    const H = hero.clientHeight;
    if (!W || !H) return;
    isMobile = W <= 860;
    renderer.setSize(W, H, false);
    composer.setSize(W, H);
    bloom.setSize(W, H);
    camera.aspect = W / H;

    let robotPx;
    if (!isMobile) {
      robotPx = Math.min(H * 0.62, W * 0.4, 640);
      anchor.x = W * 0.695;
      anchor.y = H * 0.5 + 8;
    } else {
      const copyTop = copy.getBoundingClientRect().top - hero.getBoundingClientRect().top;
      const room = Math.max(copyTop - TOP_GAP, 220);
      robotPx = Math.min(room * 0.92, W * 0.82);
      anchor.x = W / 2;
      anchor.y = TOP_GAP + room * 0.5;
    }
    camera.position.z = (3.4 * H) / (robotPx * 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    camera.setViewOffset(W, H, W / 2 - anchor.x, H / 2 - anchor.y, W, H);
    camera.updateProjectionMatrix();

    loader.style.left = `${anchor.x}px`;
    loader.style.top = `${anchor.y}px`;
  };

  const ro = new ResizeObserver(layout);
  ro.observe(hero);
  ro.observe(copy);
  layout();

  /* ── pointer ── */
  const onPointer = (clientX, clientY) => {
    const r = hero.getBoundingClientRect();
    const W = r.width;
    const H = r.height;
    const rx = isMobile ? W * 0.5 : Math.max(W * 0.55, 500);
    const ry = isMobile ? H * 0.5 : Math.max(H * 0.55, 400);
    target.x = clamp((clientX - r.left - anchor.x) / rx, -1.2, 1.2);
    target.y = clamp((clientY - r.top - anchor.y) / ry, -1.2, 1.2);
    lastMove = performance.now();
  };
  const onMove = (e) => onPointer(e.clientX, e.clientY);
  const onTouch = (e) => {
    if (e.touches[0]) onPointer(e.touches[0].clientX, e.touches[0].clientY);
  };
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerdown', onMove);
  window.addEventListener('touchmove', onTouch, { passive: true });

  /* ── visibility ── */
  let visible = true;
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  io.observe(hero);

  /* ── animated parts, filled in once the models are ready ── */
  let eyes = [];
  let antGlows = [];
  const arms = [];
  let started = false;
  let intro = 0;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const m = reduce ? 0.25 : 1;
  let nextBlink = 2.5 + Math.random() * 3.5;
  let blinkStart = -1;

  const clock = new THREE.Clock();
  let t = 0;
  let raf = 0;

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    t += dt;

    /* idle look-around when nobody moves the mouse */
    if (performance.now() - lastMove > 3500) {
      target.x = Math.sin(t * 0.45) * 0.45;
      target.y = Math.sin(t * 0.31 + 1.2) * 0.2;
    }
    const k = 1 - Math.pow(0.0025, dt);
    look.x += (target.x - look.x) * k;
    look.y += (target.y - look.y) * k;

    /* intro pop (ease-out-back) */
    if (started && intro < 1) intro = Math.min(1, intro + dt * 1.4);
    const k1 = intro - 1;
    robot.scale.setScalar(started ? Math.max(0.001, 1 + 2.4 * k1 ** 3 + 1.4 * k1 ** 2) : 0.001);

    const bob = Math.sin(t * 1.6) * 0.09 * m;
    robot.position.y = bob;

    head.rotation.y = look.x * 0.5;
    head.rotation.x = look.y * 0.42;
    head.rotation.z = -look.x * 0.06 + Math.sin(t * 1.1) * 0.015 * m;
    body.rotation.y = look.x * 0.28;
    body.rotation.x = look.y * 0.12;

    arms.forEach((a) => {
      const w = Math.sin(t * 2.0 + a.phase);
      a.group.position.y = a.restY + w * 0.13 * m - bob * 0.35;
      a.group.position.x = a.restX + a.sign * look.x * -0.04;
      a.group.rotation.z = a.restRz + w * 0.12 * a.sign * m;
      a.group.rotation.x = Math.sin(t * 1.3 + a.phase) * 0.08;
    });

    /* pupils follow the cursor */
    const px = clamp(look.x * 0.075, -0.07, 0.07);
    const py = clamp(-look.y * 0.06, -0.06, 0.06);
    eyes.forEach((e) => e.pupilWrap.position.set(px, py, 0));

    /* blink */
    if (blinkStart < 0 && t > nextBlink) blinkStart = t;
    let sy = 1;
    if (blinkStart >= 0) {
      const p = (t - blinkStart) / 0.32;
      if (p >= 1) {
        blinkStart = -1;
        nextBlink = t + 2.5 + Math.random() * 3.5;
      } else {
        sy = 1 - 0.92 * Math.sin(p * Math.PI);
      }
    }
    eyes.forEach((e) => { e.eye.scale.y = sy; });

    /* floor glow + antenna glow follow the bob */
    floor.scale.set(3.4 - bob * 3, 0.42 - bob * 0.4, 1);
    floor.material.opacity = 0.7 + (0.09 - bob) * 1.5;
    const ao = 0.7 * (0.85 + Math.sin(t * 1.6) * 0.15) + 0.15;
    antGlows.forEach((g) => { g.material.opacity = ao; });

    composer.render();
  };
  raf = requestAnimationFrame(tick);

  /* ── load the models ── */
  (async () => {
    const gltfLoader = new GLTFLoader();
    const [headRes, armRes] = await Promise.allSettled([
      gltfLoader.loadAsync(HEAD_GLB),
      gltfLoader.loadAsync(ARM_GLB),
    ]);
    if (disposed) return;

    /* head */
    let headRoot;
    if (headRes.status === 'fulfilled') {
      headRoot = headRes.value.scene;
      normaliseHead(headRoot);
    } else {
      headRoot = fallbackHead();
    }
    prepareModel(headRoot, {
      glossy: true,
      rim: { color: 0x8a5cff, power: 4.5, strength: 0.32 },
      tint: '#4a4a56',
      useMap: false,
      smooth: false,
    });
    head.add(headRoot);
    robot.updateMatrixWorld(true);
    const mounted = mountHead(head, headRoot, glowTex);
    eyes = mounted.eyes;
    antGlows = mounted.antGlows;

    /* arms (copies are made BEFORE normalising) */
    const tpl = armRes.status === 'fulfilled' ? armRes.value.scene : fallbackArm();
    prepareModel(tpl, {
      glossy: false,
      rim: { color: 0x8a5cff, power: 2.6, strength: 1.05 },
      tint: '#1d1d23',
      useMap: false,
      smooth: true,
    });
    const copies = [tpl, tpl.clone(true)];
    const poses = [
      { x: -1.32, rz: -0.62, phase: 0 },
      { x: 1.32, rz: 0.62, phase: Math.PI * 0.85 },
    ];
    copies.forEach((root, i) => {
      const group = normaliseArm(root);
      const p = poses[i];
      group.position.set(p.x, -0.72, 0.15);
      group.rotation.z = p.rz;
      body.add(group);
      arms.push({ group, restX: p.x, restY: -0.72, restRz: p.rz, phase: p.phase, sign: Math.sign(p.x) });
    });

    loader.style.opacity = '0';
    layout();
    started = true;
  })();

  /* ── cleanup ── */
  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onMove);
    window.removeEventListener('touchmove', onTouch);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((mt) => {
          if (mt.map) mt.map.dispose();
          mt.dispose();
        });
      }
    });
    glowTex.dispose();
    envTarget.dispose();
    composer.dispose();
    renderer.dispose();
  };
}

/* ================================================================
   COMPONENT
   ================================================================ */
function Share() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const loaderRef = useRef(null);
  const copyRef = useRef(null);
  const timerRef = useRef(0);

  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  const url = typeof window !== 'undefined' ? window.location.origin : '';
  const targets = buildTargets(url);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  useEffect(() => {
    const dispose = createRobotScene({
      hero: heroRef.current,
      canvas: canvasRef.current,
      copy: copyRef.current,
      loader: loaderRef.current,
    });
    return dispose;
  }, []);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      /* older browsers: hidden textarea fallback */
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* ignore */ }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title: 'Wollo-Info', text: SHARE_TEXT, url });
    } catch (err) {
      /* user closed the share sheet */
    }
  };

  return (
    <section className={styles.share} ref={heroRef} aria-labelledby="share-title">
      <canvas className={styles.stage} ref={canvasRef} aria-hidden="true" />
      <div className={styles.loader} ref={loaderRef} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy} ref={copyRef}>
          <h2 id="share-title" className={`${styles.title} ${styles.reveal} ${styles.d1}`}>
            Share Wollo-Info<br />with Your Friends
          </h2>
          <p className={`${styles.sub} ${styles.reveal} ${styles.d2}`}>
            Scholarships, jobs and campus news are better together.<br />
            Send the link to classmates, colleagues and alumni.
          </p>

          <div className={`${styles.actions} ${styles.reveal} ${styles.d3}`}>
            <button type="button" className={styles.btnPrimary} onClick={copyLink}>
              {copied ? 'Link copied' : 'Copy link'}
            </button>
            {canShare && (
              <button type="button" className={styles.btnGhost} onClick={nativeShare}>
                Share…
              </button>
            )}
          </div>

          <div className={`${styles.social} ${styles.reveal} ${styles.d3}`}>
            <span className={styles.socialLabel}>Or share on</span>
            <ul className={styles.socialList}>
              {targets.map((s) => (
                <li key={s.name}>
                  <a
                    className={styles.socialLink}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${s.name}`}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                      <path d={s.icon} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <span className={styles.srOnly} role="status" aria-live="polite">
            {copied ? 'Link copied to clipboard' : ''}
          </span>
        </div>
      </div>
    </section>
  );
}

export default Share;