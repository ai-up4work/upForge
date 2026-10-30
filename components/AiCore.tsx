"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import type * as T from "three";

/**
 * Hero object: the "AI core", a JARVIS-style orb of glowing dots that swells and ripples as if it is
 * thinking and speaking, inside a quiet interface ring. It gets livelier as the pointer nears the centre.
 *
 * The canvas fills the whole hero and paints the hero's own background (same gradient as `.hero` in
 * globals.css) plus a soft colour glow, so canvas and page match exactly. The orb sits where the
 * 1600 × 1200 stage puts it on desktop, and in the upper part of the screen on phones.
 * Without WebGL nothing renders and the CSS background stays.
 */
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

const BACKDROP = /* glsl */ `
  uniform float uTime, uCy, uR; uniform vec2 uRes; varying vec2 vS;
  vec3 heroBg(vec2 s){
    float x = s.x, yt = 1. - s.y;
    float d2 = length(vec2((x-.5)/.9, (yt-.45)/.8));
    vec3 c = mix(vec3(6.,34.,70.)/255., vec3(2.,20.,48.)/255., smoothstep(0., .55, d2));
    c = mix(c, vec3(0.,11.,40.)/255., smoothstep(.55, 1., d2));
    float d1 = length(vec2((x-.5)/.7, yt/.55));
    vec3 top = mix(vec3(23.,68.,105.)/255., vec3(14.,50.,86.)/255., smoothstep(0., .3, d1));
    return mix(c, top, mix(1., .85, smoothstep(0., .3, d1)) * (1. - smoothstep(.3, .7, d1)));
  }
  void main(){
    float asp = uRes.x / uRes.y; vec2 g = vec2((vS.x-.5)*asp, (1.-vS.y)-uCy); float r = length(g) / (uR*.62);
    float a = atan(g.y, g.x) + uTime*.18;
    vec3 glow = mix(vec3(1.,.5,.26), vec3(1.,.2,.55), .5+.5*sin(a)); glow = mix(glow, vec3(.16,.42,1.), .5+.5*cos(a+2.4));
    gl_FragColor = vec4(heroBg(vS) + glow * exp(-r*r*2.2) * .42, 1.);
  }`;

export default function AiCore() {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let stopped = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (stopped) return;
      let renderer: T.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 0, 8);

      // background + glow
      const bgMat = new THREE.ShaderMaterial({
        depthWrite: false, depthTest: false,
        uniforms: { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uCy: { value: 0.5 }, uR: { value: 0.6 } },
        vertexShader: "varying vec2 vS; void main(){ vS = position.xy*.5+.5; gl_Position = vec4(position.xy, .9999, 1.); }",
        fragmentShader: BACKDROP,
      });
      const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bgMat);
      bg.frustumCulled = false; bg.renderOrder = -10; scene.add(bg);

      // the orb: dots spread evenly over a sphere (fibonacci lattice); fewer on phones
      const COUNT = window.innerWidth < 700 ? 7000 : 14000;
      const pos = new Float32Array(COUNT * 3);
      const golden = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < COUNT; i++) {
        const y = 1 - (i / (COUNT - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
        pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r;
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const dotMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uAmp: { value: 1 }, uSize: { value: 3 } },
        vertexShader: NOISE + `uniform float uTime, uAmp, uSize; varying vec3 vC; varying float vA;
          void main(){
            vec3 d = normalize(position);
            float talk = .55 + .45*sin(uTime*2.1)*sin(uTime*.73+1.);  // slow swell plus a "speaking" ripple
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

      // interface ring around the orb
      const ringMat = (o: number, c = 0x9fb4ff) =>
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, side: THREE.DoubleSide });
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
      const hud = new THREE.Group(); hud.add(r1, r2, r3, ticks, blip);
      const spin = new THREE.Group(); spin.add(dots);
      const root = new THREE.Group(); root.add(spin, hud); scene.add(root);
      const SIZE = 3.0; // orb + ring diameter in world units

      const layout = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
        let cyPx: number, box: number, fill = 0.78;
        if (w >= 900 && w / h > 0.8) {
          const s = Math.min(w / 1600, h / 1200), top = (h - 1200 * s) / 2;
          box = 860 * s; cyPx = top + 582 * s; fill = 0.66;
        } else {
          box = Math.min(w, 0.62 * h); cyPx = 0.12 * h + box / 2;
        }
        bgMat.uniforms.uCy.value = cyPx / h; bgMat.uniforms.uR.value = box / h; (bgMat.uniforms.uRes.value as T.Vector2).set(w, h);
        const wpp = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z) / h;
        root.position.y = (h / 2 - cyPx) * wpp;
        root.scale.setScalar((box * fill * wpp) / SIZE);
        dotMat.uniforms.uSize.value = Math.max(1.8, (box / 235) * renderer.getPixelRatio());
      };
      layout();
      const ro = new ResizeObserver(layout); ro.observe(el);

      let tx = 0, ty = 0, mx = 0, my = 0, amp = 1;
      const onMove = (e: PointerEvent) => { tx = (e.clientX / window.innerWidth - 0.5) * 2; ty = (e.clientY / window.innerHeight - 0.5) * 2; };
      window.addEventListener("pointermove", onMove, { passive: true });
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(el);
      const clock = new THREE.Clock();

      renderer.setAnimationLoop(() => {
        if (!visible || document.hidden) return;
        const t = clock.getElapsedTime() * (reduce ? 0.15 : 1);
        mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
        bgMat.uniforms.uTime.value = t; dotMat.uniforms.uTime.value = t;
        const near = 1 - Math.min(1, Math.hypot(mx, my) / 1.2); // livelier as the pointer nears the centre
        amp += (1 + near * 0.9 - amp) * 0.04; dotMat.uniforms.uAmp.value = amp;
        spin.rotation.y = t * 0.12 + mx * 0.35; spin.rotation.x = my * 0.2;
        r2.rotation.z = t * 0.35; r3.rotation.z = -t * 0.22; ticks.rotation.z = -t * 0.05;
        blip.position.set(Math.cos(t * 0.6) * 1.42, Math.sin(t * 0.6) * 1.42, 0);
        hud.rotation.x = my * 0.08; hud.rotation.y = mx * 0.1;
        renderer.render(scene, camera);
      });

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect(); io.disconnect();
        window.removeEventListener("pointermove", onMove);
        scene.traverse((o) => {
          const m = o as T.Mesh;
          m.geometry?.dispose();
          (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x?.dispose());
        });
        renderer.dispose(); renderer.domElement.remove();
      };
      if (stopped) cleanup();
    }).catch(() => {});

    return () => { stopped = true; cleanup(); };
  }, [reduce]);

  return <div ref={host} className="ai-core" aria-hidden="true" />;
}
