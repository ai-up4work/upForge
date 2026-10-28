"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const vert = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vL; varying vec3 vW;
  void main() {
    vL = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vW = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

// Outer face: deep glossy blue with cyan rim light and fine grooves. Inner face: warm orange → pink → magenta.
const shellFrag = /* glsl */ `
  uniform float uTime;
  varying vec3 vN; varying vec3 vV; varying vec3 vL; varying vec3 vW;
  void main() {
    vec3 N = normalize(vN);
    if (!gl_FrontFacing) N = -N;
    vec3 V = normalize(vV);
    float ndv = max(dot(N, V), 0.0);
    float fres = pow(1.0 - ndv, 2.6);
    vec3 L = normalize(vec3(-0.15, 1.0, 0.55));
    vec3 L2 = normalize(vec3(0.9, -0.2, 0.5));
    float diff = max(dot(N, L), 0.0);
    float diff2 = max(dot(N, L2), 0.0);
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 70.0);
    vec3 col;
    if (gl_FrontFacing) {
      vec3 deep = vec3(0.025, 0.035, 0.14);
      vec3 mid  = vec3(0.07, 0.16, 0.48);
      vec3 hi   = vec3(0.18, 0.50, 0.95);
      col = mix(deep, mid, smoothstep(0.0, 0.9, diff));
      col = mix(col, hi, pow(diff, 3.0) * 0.6);
      col += vec3(0.25, 0.72, 1.0) * fres * 1.05;
      col += vec3(0.9, 0.95, 1.0) * spec * 0.55;
      float lower = smoothstep(-0.1, -0.8, vL.y);
      float groove = smoothstep(0.35, 0.5, abs(fract(vL.y * 70.0) - 0.5));
      col *= 1.0 - 0.22 * lower * groove;
    } else {
      float t = clamp(0.30 + 0.62 * (vW.x * 0.7 - vW.y * 0.75) + 0.04 * sin(uTime * 0.6), 0.0, 1.0);
      vec3 orange = vec3(1.0, 0.60, 0.34);
      vec3 pink   = vec3(1.0, 0.24, 0.42);
      vec3 mag    = vec3(0.86, 0.07, 0.64);
      col = t < 0.5 ? mix(orange, pink, t * 2.0) : mix(pink, mag, (t - 0.5) * 2.0);
      col *= 0.78 + 0.32 * diff + 0.18 * diff2;
      col += vec3(1.0, 0.9, 0.85) * spec * 0.45;
      col += vec3(0.55, 0.45, 1.0) * fres * 0.35;
    }
    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const glassFrag = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vL; varying vec3 vW;
  void main() {
    vec3 N = normalize(vN);
    if (!gl_FrontFacing) N = -N;
    float ndv = abs(dot(N, normalize(vV)));
    float fres = pow(1.0 - ndv, 1.6);
    vec3 col = mix(vec3(1.0, 0.82, 0.88), vec3(0.75, 0.9, 1.0), clamp(vL.y * 0.5 + 0.5, 0.0, 1.0));
    gl_FragColor = vec4(col, 0.10 + fres * 0.75);
  }
`;

/** WebGL hero object. Falls back to a CSS rendering if WebGL is unavailable. */
export default function Orb() {
  const host = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
      camera.position.set(0, 0, 4.95);

      const uniforms = { uTime: { value: 0 } };
      const shellMat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: shellFrag, uniforms, side: THREE.DoubleSide });
      const glassMat = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: glassFrag, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });

      // An open band (both poles open) so the background shows through the middle, like the reference ring.
      const spinGroup = new THREE.Group();
      const top = 1.0;
      const bottom = 1.02;
      const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 220, 140, 0, Math.PI * 2, top, Math.PI - top - bottom), shellMat);
      spinGroup.add(shell);
      // Outer layered bands on the equator.
      const band = new THREE.Mesh(new THREE.SphereGeometry(1.05, 220, 50, 0, Math.PI * 2, 1.25, 0.6), shellMat);
      band.rotation.z = 0.12;
      spinGroup.add(band);
      const band2 = new THREE.Mesh(new THREE.SphereGeometry(1.1, 220, 40, 0, Math.PI * 2, 1.38, 0.3), shellMat);
      band2.rotation.z = 0.2;
      spinGroup.add(band2);
      // Rim lips at both openings.
      const lipTop = new THREE.Mesh(new THREE.TorusGeometry(Math.sin(top), 0.03, 24, 220), shellMat);
      lipTop.material = glassMat;
      lipTop.rotation.x = Math.PI / 2;
      lipTop.position.y = Math.cos(top);
      spinGroup.add(lipTop);
      const lipBottom = new THREE.Mesh(new THREE.TorusGeometry(Math.sin(bottom), 0.03, 24, 220), shellMat);
      lipBottom.material = glassMat;
      lipBottom.rotation.x = Math.PI / 2;
      lipBottom.position.y = -Math.cos(bottom);
      spinGroup.add(lipBottom);
      // Clear glass ring floating inside the front opening.
      const glass = new THREE.Mesh(new THREE.TorusGeometry(Math.sin(top) * 0.97, 0.055, 32, 240), glassMat);
      glass.rotation.x = Math.PI / 2 + 0.16;
      glass.rotation.y = 0.12;
      glass.position.y = Math.cos(top) * 0.72;
      spinGroup.add(glass);
      const glassBand = new THREE.Mesh(new THREE.SphereGeometry(0.95, 200, 30, 0, Math.PI * 2, top + 0.08, 0.36), glassMat);
      spinGroup.add(glassBand);

      // Point the band's axis at the viewer, tilted up and to the right.
      const group = new THREE.Group();
      group.add(spinGroup);
      group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.5, 0.52, 0.69).normalize());
      group.rotateY(0.6);
      const pivot = new THREE.Group();
      pivot.add(group);
      scene.add(pivot);

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let tx = 0, ty = 0, cx = 0, cy = 0;
      const onMove = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 0.35;
        ty = (e.clientY / window.innerHeight - 0.5) * 0.25;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);
      const clock = new THREE.Clock();
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const t = clock.getElapsedTime();
        uniforms.uTime.value = t;
        cx += (tx - cx) * 0.04;
        cy += (ty - cy) * 0.04;
        const spin = reduce ? 0 : t * 0.16;
        spinGroup.rotation.y = spin;
        pivot.rotation.y = cx;
        pivot.rotation.x = cy + (reduce ? 0 : Math.sin(t * 0.5) * 0.03);
        pivot.position.y = reduce ? 0 : Math.sin(t * 0.8) * 0.025;
        glass.rotation.z = reduce ? 0 : -t * 0.22;
        renderer.render(scene, camera);
      };
      loop();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onMove);
        scene.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>;
          if (m.geometry) m.geometry.dispose();
        });
        shellMat.dispose();
        glassMat.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => setFailed(true));

    return () => {
      disposed = true;
      cleanup();
    };
  }, [reduce]);

  return (
    <motion.div
      className="orb"
      ref={host}
      initial={reduce ? false : { opacity: 0, scale: 0.86, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      {failed && <div className="orb-fallback" />}
    </motion.div>
  );
}
