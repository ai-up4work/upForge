"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type * as T from "three";

/**
 * HERO LAB (private demo, not used in production).
 * Four candidate replacements for the hero ring. The canvas fills the whole hero and paints the hero's own
 * background, so the glass objects can refract it. The object is placed where the ring sits today
 * (same box on the 1600 × 1200 stage on desktop, same box on phones).
 */
export type LabVariant = 1 | 2 | 3 | 4 | 5;

// Traced from the current nav logo (U with an arrow). For production, paste the exact path from Logo.tsx.
export const LOGO_PATH = "M8 18H20V40A12 12 0 0 0 44 40V18H38L50 3L62 18H56V40A24 24 0 0 1 8 40Z";
const EMBER_AT = { x: 32, y: 24 }; // svg units, inside the cup of the U

const BACKDROP_GLSL = /* glsl */ `
  uniform float uTime, uCy, uR, uK; uniform vec2 uRes; varying vec2 vS;
  // the .hero CSS background, redrawn so canvas and page match exactly
  vec3 heroBg(vec2 s){
    float x = s.x, yt = 1. - s.y;
    vec3 c2 = mix(vec3(6.,34.,70.)/255., vec3(2.,20.,48.)/255., smoothstep(0., .55, length(vec2((x-.5)/.9, (yt-.45)/.8))));
    c2 = mix(c2, vec3(0.,11.,40.)/255., smoothstep(.55, 1., length(vec2((x-.5)/.9, (yt-.45)/.8))));
    float d1 = length(vec2((x-.5)/.7, yt/.55));
    vec3 top = mix(vec3(23.,68.,105.)/255., vec3(14.,50.,86.)/255., smoothstep(0., .3, d1));
    float a1 = mix(1., .85, smoothstep(0., .3, d1)) * (1. - smoothstep(.3, .7, d1));
    return mix(c2, top, a1);
  }
  vec3 glow(vec2 s){
    float asp = uRes.x / uRes.y; vec2 g = vec2((s.x-.5)*asp, (1.-s.y)-uCy); float r = length(g) / (uR*.62);
    float a = atan(g.y, g.x) + uTime*.18;
    vec3 c = mix(vec3(1.,.5,.26), vec3(1.,.2,.55), .5+.5*sin(a)); c = mix(c, vec3(.16,.42,1.), .5+.5*cos(a+2.4));
    return c * exp(-r*r*2.2) * uK * .7;
  }
`;

type Built = {
  scene: T.Scene;
  root?: T.Object3D; // positioned and scaled by layout()
  size?: number; // object's nominal diameter in world units
  camera?: T.Camera;
  update: (t: number, mx: number, my: number) => void;
  layout?: (cy: number, box: number, w: number, h: number) => void;
};

export default function LabObject({ variant, onStep }: { variant: LabVariant; onStep?: (i: number) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const stepCb = useRef(onStep);
  stepCb.current = onStep;

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let stopped = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { RoundedBoxGeometry } = await import("three/examples/jsm/geometries/RoundedBoxGeometry.js");
      if (stopped) return;

      let renderer: T.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the hero's CSS background stays visible
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.localClippingEnabled = true;
      el.appendChild(renderer.domElement);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const glass = (o: Partial<T.MeshPhysicalMaterialParameters> = {}) =>
        new THREE.MeshPhysicalMaterial({
          color: 0xd6e4ff, metalness: 0, roughness: 0.06, transmission: 1, thickness: 1.6, ior: 1.5,
          iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 720], clearcoat: 1, clearcoatRoughness: 0.05,
          envMap: envTex, envMapIntensity: 1.25, ...o,
        });

      const backdropMat = (k: number) =>
        new THREE.ShaderMaterial({
          depthWrite: false, depthTest: false,
          uniforms: { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uCy: { value: 0.5 }, uR: { value: 0.6 }, uK: { value: k } },
          vertexShader: "varying vec2 vS; void main(){ vS = position.xy*.5+.5; gl_Position = vec4(position.xy, .9999, 1.); }",
          fragmentShader: BACKDROP_GLSL + "void main(){ gl_FragColor = vec4(heroBg(vS) + glow(vS), 1.); }",
        });
      const addBackdrop = (scene: T.Scene, k = 0.8) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), backdropMat(k));
        m.frustumCulled = false;
        m.renderOrder = -10;
        scene.add(m);
        return m.material;
      };
      const lights = (scene: T.Scene) => {
        scene.add(new THREE.AmbientLight(0x6070c0, 0.35));
        const a = new THREE.PointLight(0xff9a5a, 30, 20); a.position.set(-3, 2, 3);
        const b = new THREE.PointLight(0xff3d9a, 26, 20); b.position.set(3.2, -1.5, 2.5);
        const c = new THREE.PointLight(0x4f8bff, 22, 20); c.position.set(0, 3, -2);
        const d = new THREE.DirectionalLight(0xffffff, 1.2); d.position.set(-1, 3, 4);
        scene.add(a, b, c, d);
      };

      // ---------------- 1 · glass logo ----------------
      const glassLogo = (): Built => {
        const scene = new THREE.Scene(); lights(scene);
        const bg = addBackdrop(scene, 0.85);
        const shapes = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${LOGO_PATH}"/></svg>`).paths.flatMap((p) => SVGLoader.createShapes(p));
        const raw = new THREE.ExtrudeGeometry(shapes, { depth: 12 });
        raw.computeBoundingBox();
        const bb = raw.boundingBox!;
        const cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, span = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y);
        raw.dispose();
        const geo = new THREE.ExtrudeGeometry(shapes, { depth: 12, bevelEnabled: true, bevelThickness: 3, bevelSize: 2.2, bevelSegments: 10, curveSegments: 64 });
        geo.center();
        const logo = new THREE.Mesh(geo, glass({ thickness: 2.4, attenuationColor: new THREE.Color(0x8fb0ff), attenuationDistance: 4 }));
        const ember = new THREE.Mesh(new THREE.OctahedronGeometry(3.6, 0), new THREE.MeshStandardMaterial({ color: 0xffb27a, emissive: 0xff7a3a, emissiveIntensity: 2.4, roughness: 0.25, metalness: 0.2 }));
        ember.position.set(EMBER_AT.x - cx, EMBER_AT.y - cy, 0);
        const emberLight = new THREE.PointLight(0xff8a4a, 6, 3); ember.add(emberLight);
        const g = new THREE.Group(); g.add(logo, ember); g.scale.set(2 / span, -2 / span, 2 / span); // ~2 units across
        const spin = new THREE.Group(); spin.add(g);
        const root = new THREE.Group(); root.add(spin); scene.add(root);
        return { scene, root, size: 2.2, update(t, mx, my) {
          (bg.uniforms.uTime.value as number) = t;
          spin.rotation.y = Math.sin(t * 0.35) * 0.55 + mx * 0.45;
          spin.rotation.x = Math.sin(t * 0.27) * 0.12 + my * 0.25;
          spin.position.y = Math.sin(t * 0.8) * 0.04;
          ember.rotation.y = t * 1.2;
          emberLight.intensity = 5 + Math.sin(t * 3) * 1.5;
        } };
      };

      // ---------------- 2 · molten crucible ----------------
      const NOISE = /* glsl */ `
        vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;} vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
        vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
        float snoise(vec3 v){ const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
          vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx); vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g;
          vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy); vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
          i=mod289(i); vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
          float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
          vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
          vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.)); vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
          vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
          vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
          vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
          return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); }`;
      const crucible = (): Built => {
        const scene = new THREE.Scene(); lights(scene);
        const bg = addBackdrop(scene, 0.7);
        const moltenMat = new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 } },
          vertexShader: NOISE + `uniform float uTime; varying float vN; varying vec3 vNorm; varying vec3 vView;
            void main(){ float n = snoise(position*1.6 + vec3(0., uTime*.35, uTime*.2)); vN = n;
              vec3 p = position + normal * n * .14; vec4 mv = modelViewMatrix*vec4(p,1.);
              vNorm = normalize(normalMatrix*normal); vView = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }`,
          fragmentShader: `varying float vN; varying vec3 vNorm; varying vec3 vView;
            void main(){ float f = pow(1.-max(dot(vNorm,vView),0.),2.5); float vein = pow(1.-abs(vN), 6.);
              vec3 c = mix(vec3(.16,.01,.08), vec3(.62,.04,.26), smoothstep(-.6,.4,vN)); c = mix(c, vec3(1.,.42,.1), vein); c = mix(c, vec3(1.,.9,.6), pow(vein,4.));
              c += f*vec3(1.,.3,.55)*.5; gl_FragColor = vec4(c,1.); }`,
        });
        const molten = new THREE.Mesh(new THREE.IcosahedronGeometry(0.9, 64), moltenMat);
        const vessel = new THREE.Mesh(new THREE.SphereGeometry(1.32, 96, 64), glass({ color: 0xffffff, thickness: 0.25, roughness: 0.02, iridescence: 0.35, envMapIntensity: 0.55 }));
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.075, 32, 220), glass({ thickness: 0.3 }));
        ring.rotation.set(Math.PI * 0.42, 0.35, 0);
        const heat = new THREE.PointLight(0xff7040, 12, 6);
        const spin = new THREE.Group(); spin.add(molten, vessel, ring, heat);
        const root = new THREE.Group(); root.add(spin); scene.add(root);
        return { scene, root, size: 4.0, update(t, mx, my) {
          (bg.uniforms.uTime.value as number) = t; (moltenMat.uniforms.uTime.value as number) = t;
          molten.rotation.y = t * 0.2; ring.rotation.z = t * 0.25;
          spin.rotation.y = mx * 0.5; spin.rotation.x = my * 0.3; spin.position.y = Math.sin(t * 0.8) * 0.05;
          heat.intensity = 11 + Math.sin(t * 2.3) * 2;
        } };
      };

      // ---------------- 3 · code to glass ----------------
      const codeToGlass = (): Built => {
        const scene = new THREE.Scene(); lights(scene);
        const bg = addBackdrop(scene, 0.8);
        const S = 2.1, h = S / 2, N = 5;
        const cut = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
        const cutUp = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const block = new THREE.Mesh(new RoundedBoxGeometry(S, S, S, 6, 0.16), glass({ color: 0xeaf1ff, thickness: 1.2, roughness: 0.03, iridescence: 0.6, envMapIntensity: 0.6, clippingPlanes: [cut] }));
        const pts: number[] = [];
        for (let i = 0; i <= N; i++) {
          const v = -h + (S * i) / N;
          for (const s of [-h, h]) {
            pts.push(-h, v, s, h, v, s, v, -h, s, v, h, s);
            pts.push(s, v, -h, s, v, h, s, -h, v, s, h, v);
            pts.push(-h, s, v, h, s, v, v, s, -h, v, s, h);
          }
        }
        const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
        const wire = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x7fd8ff, transparent: true, opacity: 0.75, clippingPlanes: [cutUp] }));
        const panels = new THREE.Group();
        ([[0.95, 0.62, 0.35, 0xff8a5a], [0.8, 0.5, -0.05, 0x4fa3ff], [0.7, 0.42, -0.42, 0xff3d9a]] as const).forEach(([w, ph, z, c], i) => {
          const m = new THREE.Mesh(new RoundedBoxGeometry(w, ph, 0.04, 2, 0.03), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.1, roughness: 0.4 }));
          m.position.set((i - 1) * 0.18, (1 - i) * 0.14, z); panels.add(m);
        });
        const scan = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => new THREE.Vector3(x * h * 1.06, 0, z * h * 1.06))), new THREE.LineBasicMaterial({ color: 0xffc896 }));
        const glowP = new THREE.Mesh(new THREE.PlaneGeometry(S * 1.06, S * 1.06), new THREE.MeshBasicMaterial({ color: 0xff9a6a, transparent: true, opacity: 0.18, side: THREE.DoubleSide, depthWrite: false }));
        glowP.rotation.x = -Math.PI / 2; scan.add(glowP);
        const spin = new THREE.Group(); spin.add(block, wire, panels, scan); spin.rotation.set(0.42, 0.6, 0);
        const root = new THREE.Group(); root.add(spin); scene.add(root);
        const tmp = new THREE.Vector3(), q = new THREE.Quaternion();
        return { scene, root, size: 3.4, update(t, mx, my) {
          (bg.uniforms.uTime.value as number) = t;
          const P = 7.6, c = t % P;
          let p = c < 3.2 ? c / 3.2 : c < 5.8 ? 1 : c < 6.6 ? 1 - (c - 5.8) / 0.8 : 0;
          p = p * p * (3 - 2 * p);
          const y = -h * 1.02 + p * S * 1.04;
          scan.position.y = y; scan.visible = p > 0.001 && p < 0.999;
          spin.rotation.y = 0.6 + t * 0.18 + mx * 0.4; spin.rotation.x = 0.42 + my * 0.2;
          spin.position.y = Math.sin(t * 0.8) * 0.04;
          root.updateMatrixWorld(true);
          const n = new THREE.Vector3(0, 1, 0).applyQuaternion(spin.getWorldQuaternion(q));
          const pt = spin.localToWorld(tmp.set(0, y, 0));
          cut.setFromNormalAndCoplanarPoint(n.clone().negate(), pt);
          cutUp.setFromNormalAndCoplanarPoint(n, pt);
          panels.children.forEach((m, i) => (m.position.y = (1 - i) * 0.14 + Math.sin(t * 1.1 + i) * 0.05));
        } };
      };

      // ---------------- 5 · AI core (JARVIS-style particle orb) ----------------
      const aiCore = (): Built => {
        const scene = new THREE.Scene();
        const bg = addBackdrop(scene, 0.6);
        // dots spread evenly over a sphere (fibonacci lattice); fewer on phones
        const COUNT = window.innerWidth < 700 ? 7000 : 14000;
        const pos = new Float32Array(COUNT * 3);
        const golden = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < COUNT; i++) {
          const y = 1 - (i / (COUNT - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
          pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
        }
        const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const dotMat = new THREE.ShaderMaterial({
          transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
          uniforms: { uTime: { value: 0 }, uAmp: { value: 1 }, uSize: { value: 3 } },
          vertexShader: NOISE + `uniform float uTime, uAmp, uSize; varying vec3 vC; varying float vA;
            void main(){
              vec3 d = normalize(position);
              // slow swell plus a faster "speaking" ripple
              float talk = .55 + .45*sin(uTime*2.1)*sin(uTime*.73+1.);
              float n = snoise(d*1.35 + vec3(0., uTime*.22, uTime*.15))*.6 + snoise(d*3.2 + uTime*.55)*.22*talk;
              vec3 p = d * (1. + n*.2*uAmp);
              vec4 mv = modelViewMatrix * vec4(p, 1.);
              float facing = dot(normalize(normalMatrix*d), vec3(0.,0.,1.));
              vA = (.22 + .78*smoothstep(-.55, .65, facing)) * (.75 + .5*smoothstep(-.2,.6,n));
              float k = smoothstep(-.9, .95, d.y*.85 + n*.8 + d.x*.25);
              vec3 blue = vec3(.24,.42,1.), violet = vec3(.62,.3,1.), pink = vec3(1.,.32,.72), peach = vec3(1.,.66,.55);
              vC = mix(blue, violet, smoothstep(0.,.35,k)); vC = mix(vC, pink, smoothstep(.35,.75,k)); vC = mix(vC, peach, smoothstep(.85,1.,k)*.6);
              gl_PointSize = uSize * (1. + n*.7) * (8. / -mv.z);
              gl_Position = projectionMatrix * mv; }`,
          fragmentShader: `varying vec3 vC; varying float vA;
            void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard;
              float a = smoothstep(.5, .12, d) * vA * 1.25; gl_FragColor = vec4(vC * a, a); }`,
        });
        const dots = new THREE.Points(geo, dotMat);
        // HUD rings around the core, as on an assistant's interface
        const hud = new THREE.Group();
        const ringMat = (o: number, c = 0x9fb4ff) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, side: THREE.DoubleSide });
        const r1 = new THREE.Mesh(new THREE.RingGeometry(1.42, 1.425, 160), ringMat(0.35));
        const r2 = new THREE.Mesh(new THREE.RingGeometry(1.58, 1.585, 160, 1, 0, Math.PI * 1.35), ringMat(0.5, 0xff8fd0));
        const r3 = new THREE.Mesh(new THREE.RingGeometry(1.66, 1.664, 160, 1, Math.PI * 0.2, Math.PI * 0.5), ringMat(0.35, 0x8fd4ff));
        const tickPts: number[] = [];
        for (let i = 0; i < 120; i++) {
          const a = (i / 120) * Math.PI * 2, L = i % 10 === 0 ? 0.07 : 0.03;
          tickPts.push(Math.cos(a) * 1.48, Math.sin(a) * 1.48, 0, Math.cos(a) * (1.48 + L), Math.sin(a) * (1.48 + L), 0);
        }
        const tg = new THREE.BufferGeometry(); tg.setAttribute("position", new THREE.Float32BufferAttribute(tickPts, 3));
        const ticks = new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthTest: false }));
        const blip = new THREE.Mesh(new THREE.CircleGeometry(0.025, 16), ringMat(0.95, 0xffc0e8));
        hud.add(r1, r2, r3, ticks, blip);
        const spin = new THREE.Group(); spin.add(dots);
        const root = new THREE.Group(); root.add(spin, hud); scene.add(root);
        let amp = 1;
        return { scene, root, size: 3.0, update(t, mx, my) {
          (bg.uniforms.uTime.value as number) = t; (dotMat.uniforms.uTime.value as number) = t;
          // the core "listens": it gets livelier as the pointer approaches the middle of the screen
          const near = 1 - Math.min(1, Math.hypot(mx, my) / 1.2);
          amp += (1 + near * 0.9 - amp) * 0.04; dotMat.uniforms.uAmp.value = amp;
          spin.rotation.y = t * 0.12 + mx * 0.35; spin.rotation.x = my * 0.2;
          r2.rotation.z = t * 0.35; r3.rotation.z = -t * 0.22; ticks.rotation.z = -t * 0.05;
          blip.position.set(Math.cos(t * 0.6) * 1.42, Math.sin(t * 0.6) * 1.42, 0);
          hud.rotation.x = my * 0.08; hud.rotation.y = mx * 0.1;
        }, layout(_cy, box) {
          dotMat.uniforms.uSize.value = Math.max(1.8, (box / 235) * renderer.getPixelRatio());
        } };
      };

      // ---------------- 4 · shape shift (ray-marched liquid chrome) ----------------
      const shapeShift = (): Built => {
        const scene = new THREE.Scene();
        const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const bg = addBackdrop(scene, 0.55);
        const mat = new THREE.ShaderMaterial({
          transparent: true, depthTest: false, depthWrite: false,
          uniforms: { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2() }, uA: { value: 0 }, uB: { value: 1 }, uK: { value: 0 }, uCy: { value: 0.5 }, uBox: { value: 0.6 } },
          vertexShader: "varying vec2 vS; void main(){ vS = position.xy*.5+.5; gl_Position = vec4(position.xy,0.,1.); }",
          fragmentShader: /* glsl */ `precision highp float; varying vec2 vS; uniform float uTime, uA, uB, uK, uCy, uBox; uniform vec2 uRes, uMouse;
            mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
            float sdRBox(vec3 p, vec3 b, float r){ vec3 q=abs(p)-b+r; return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r; }
            float sdTri(vec2 p, vec2 q){ p.x=abs(p.x); vec2 a=p-q*clamp(dot(p,q)/dot(q,q),0.,1.); vec2 b=p-q*vec2(clamp(p.x/q.x,0.,1.),1.);
              float s=-sign(q.y); vec2 d=min(vec2(dot(a,a),s*(p.x*q.y-p.y*q.x)),vec2(dot(b,b),s*(p.y-q.y))); return -sqrt(d.x)*sign(d.y); }
            float sdU(vec3 p){ vec2 q=p.xy+vec2(0.,.12); float R=.5, w=.15, H=.42; float d;
              if(q.y<0.) d=abs(length(q)-R)-w; else d=max(abs(abs(q.x)-R)-w, q.y-H);
              d=min(d, sdTri(vec2(q.x-R, -(q.y-(H+.36))), vec2(.27,.38)));
              vec2 e=vec2(d, abs(p.z)-.16); return min(max(e.x,e.y),0.)+length(max(e,0.))-.03; }
            float shape(float i, vec3 p){
              if(i<.5) return length(p)-.82;
              if(i<1.5) return sdRBox(p, vec3(.44,.86,.07), .13);
              if(i<2.5) return sdRBox(p, vec3(1.02,.66,.06), .08);
              return sdU(p); }
            float map(vec3 p){ p.xz *= rot(sin(uTime*.4)*.55 + uMouse.x*.6); p.yz *= rot(sin(uTime*.3)*.15 + uMouse.y*.3);
              return mix(shape(uA,p), shape(uB,p), uK); }
            vec3 nrm(vec3 p){ vec2 e=vec2(.0015,0.); return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx))); }
            vec3 env(vec3 r){ float y=r.y; vec3 c=mix(vec3(.04,.1,.28), vec3(.45,.65,1.), smoothstep(-.7,.8,y));
              c=mix(c, vec3(1.,.55,.3), smoothstep(.15,.0,abs(r.x+.45))*.9*smoothstep(-.2,.4,y));
              c=mix(c, vec3(1.,.22,.6), smoothstep(.18,.0,abs(r.x-.55))*.85);
              c+=vec3(1.)*smoothstep(.985,1.,dot(r, normalize(vec3(-.3,.8,.5))))*1.5; return c; }
            void main(){
              float asp=uRes.x/uRes.y; vec2 uv=vec2((vS.x-.5)*asp, vS.y-(1.-uCy))/uBox;
              vec3 ro=vec3(0.,0.,3.4), rd=normalize(vec3(uv*.95,-1.)); float t=0., hit=0.;
              for(int i=0;i<90;i++){ vec3 p=ro+rd*t; float d=map(p); if(d<.001){hit=1.;break;} t+=d*.9; if(t>8.) break; }
              if(hit<.5){ gl_FragColor=vec4(0.); return; }
              vec3 p=ro+rd*t, n=nrm(p), r=reflect(rd,n); float f=pow(1.-max(dot(n,-rd),0.),3.);
              vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+f*1.4+dot(n,vec3(.3,.5,.2))));
              vec3 col=env(r)*mix(vec3(.95,.97,1.), irid, .5)*1.15 + f*vec3(.7,.8,1.)*.7;
              gl_FragColor=vec4(pow(col,vec3(.9)),1.); }`,
        });
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); quad.frustumCulled = false; scene.add(quad);
        let last = -1;
        return { scene, camera: cam, update(t, mx, my) {
          (bg.uniforms.uTime.value as number) = t;
          mat.uniforms.uTime.value = t; (mat.uniforms.uMouse.value as T.Vector2).set(mx, my);
          const HOLD = 2.2, MOVE = 1.3, P = HOLD + MOVE, c = t % (P * 4), i = Math.floor(c / P), k = c - i * P;
          const rawK = k < HOLD ? 0 : (k - HOLD) / MOVE, e = rawK * rawK * (3 - 2 * rawK);
          mat.uniforms.uA.value = i; mat.uniforms.uB.value = (i + 1) % 4; mat.uniforms.uK.value = e;
          const step = e > 0.5 ? (i + 1) % 4 : i;
          if (step !== last) { last = step; stepCb.current?.(step); }
        }, layout(cy, box, w, h) {
          mat.uniforms.uCy.value = cy; mat.uniforms.uBox.value = box / h; (mat.uniforms.uRes.value as T.Vector2).set(w, h);
        } };
      };

      const build = { 1: glassLogo, 2: crucible, 3: codeToGlass, 4: shapeShift, 5: aiCore }[variant];
      const built = build();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0, 8);

      const layout = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        // where the current ring sits: desktop stage box, or the phone box
        let cyPx: number, box: number, fill = 0.78;
        if (w >= 900 && w / h > 0.8) {
          fill = 0.66;
          const s = Math.min(w / 1600, h / 1200), top = (h - 1200 * s) / 2;
          box = 860 * s; cyPx = top + (182 + 400) * s;
        } else {
          box = Math.min(w, 0.62 * h); cyPx = 0.12 * h + box / 2;
        }
        built.scene.traverse((o) => {
          const m = (o as T.Mesh).material as T.ShaderMaterial | undefined;
          if (m?.uniforms?.uCy && m.uniforms.uR) { m.uniforms.uCy.value = cyPx / h; m.uniforms.uR.value = box / h; (m.uniforms.uRes.value as T.Vector2).set(w, h); }
        });
        if (built.root && built.size) {
          const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
          const wpp = visH / h;
          built.root.position.y = (h / 2 - cyPx) * wpp;
          built.root.scale.setScalar((box * fill * wpp) / built.size);
        }
        built.layout?.(cyPx / h, box, w, h);
      };
      layout();
      const ro = new ResizeObserver(layout); ro.observe(el);

      let tx = 0, ty = 0, mx = 0, my = 0;
      const onMove = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; };
      window.addEventListener("pointermove", onMove, { passive: true });
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el);
      const clock = new THREE.Clock();
      renderer.setAnimationLoop(() => {
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime() * (reduce ? 0.15 : 1);
        mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
        built.update(t, mx, my);
        renderer.render(built.scene, built.camera ?? camera);
      });

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect(); io.disconnect();
        window.removeEventListener("pointermove", onMove);
        built.scene.traverse((o) => {
          const m = o as T.Mesh;
          m.geometry?.dispose();
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x?.dispose());
        });
        envTex.dispose(); pmrem.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
      if (stopped) cleanup();
    })();

    return () => { stopped = true; cleanup(); };
  }, [variant, reduce]);

  return <div ref={host} className="lab-gl" aria-hidden="true" />;
}
