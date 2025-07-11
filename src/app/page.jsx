"use client";

/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, wrapEffect } from "@react-three/postprocessing";
import { Effect } from "postprocessing";
import * as THREE from "three";
import {
  ChevronRight,
  Trophy,
  Target,
  Brain,
  CheckCircle,
  XCircle,
  RotateCcw,
  Play,
  Square,
  Cloud,
  Server,
  Shield,
  Globe,
  Monitor,
  Star,
  GitBranch,
  Zap,
  DollarSign,
} from "lucide-react";
import { questionDatabase } from "../../lib/questions";
import "./globals.css";

// Updated Iridescence Component with Blue-Orange Theme
const Iridescence = ({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className = "",
  style = {},
  ...rest
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const uniformsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with Blue-Orange theme
    const fragmentShaderSource = `
      precision highp float;
      
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uResolution;
      uniform vec2 uMouse;
      uniform float uAmplitude;
      uniform float uSpeed;
      
      varying vec2 vUv;
      
      void main() {
        float mr = min(uResolution.x, uResolution.y);
        vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
        
        uv += (uMouse - vec2(0.5)) * uAmplitude;
        
        float d = -uTime * 0.5 * uSpeed;
        float a = 0.0;
        for (float i = 0.0; i < 7.0; ++i) {
          a += cos(i - d - a * uv.x);
          d += sin(uv.y * i + a);
        }
        d += uTime * 0.5 * uSpeed;
        float pattern = cos(uv.x * d + a) + sin(uv.y * a + d);
        
        // Blue and Orange color palette
        vec3 deepBlue = vec3(0.1, 0.3, 0.8);      // Rich blue
        vec3 lightBlue = vec3(0.4, 0.7, 1.0);     // Light blue
        vec3 orange = vec3(1.0, 0.6, 0.1);        // Vibrant orange
        vec3 lightOrange = vec3(1.0, 0.8, 0.4);   // Light orange
        vec3 white = vec3(0.95, 0.98, 1.0);       // Slightly blue-tinted white
        
        // Interpolate between colors based on pattern
        vec3 col;
        float normalizedPattern = (pattern + 2.0) / 7.0; // Normalize to 0-1
        
        if (normalizedPattern < 0.2) {
          col = mix(deepBlue, lightBlue, normalizedPattern * 5.0);
        } else if (normalizedPattern < 0.4) {
          col = mix(lightBlue, white, (normalizedPattern - 0.2) * 5.0);
        } else if (normalizedPattern < 0.6) {
          col = mix(white, lightOrange, (normalizedPattern - 0.4) * 5.0);
        } else if (normalizedPattern < 0.8) {
          col = mix(lightOrange, orange, (normalizedPattern - 0.6) * 7.0);
        } else {
          col = mix(orange, deepBlue, (normalizedPattern - 0.8) * 5.0);
        }
        
        col *= uColor;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Create shader
    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    // Create program
    function createProgram(gl, vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }

      return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    const program = createProgram(gl, vertexShader, fragmentShader);

    if (!program) return;

    // Create geometry (full screen quad)
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);

    const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

    // Create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "position");
    const uvLocation = gl.getAttribLocation(program, "uv");

    const uniforms = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uColor: gl.getUniformLocation(program, "uColor"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uMouse: gl.getUniformLocation(program, "uMouse"),
      uAmplitude: gl.getUniformLocation(program, "uAmplitude"),
      uSpeed: gl.getUniformLocation(program, "uSpeed"),
    };

    uniformsRef.current = uniforms;

    // Resize function
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      if (!mouseReact) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      mousePos.current = { x, y };
    };

    // Animation loop
    const animate = (time) => {
      gl.useProgram(program);

      // Set uniforms
      gl.uniform1f(uniforms.uTime, time * 0.001);
      gl.uniform3f(uniforms.uColor, color[0], color[1], color[2]);
      gl.uniform3f(
        uniforms.uResolution,
        canvas.width,
        canvas.height,
        canvas.width / canvas.height
      );
      gl.uniform2f(uniforms.uMouse, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uniforms.uAmplitude, amplitude);
      gl.uniform1f(uniforms.uSpeed, speed);

      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

      // Clear and draw
      gl.clearColor(1, 1, 1, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);

      // Cleanup WebGL resources
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(program);
    };
  }, [color, speed, amplitude, mouseReact]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={style}
      {...rest}
    />
  );
};

// Original Three.js Dithered Waves with White Background
const waveVertexShader = `
precision highp float;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 8;
float fbm(vec2 p) {
  float value = 0.0;
  float amp = 1.0;
  float freq = waveFrequency;
  for (int i = 0; i < OCTAVES; i++) {
    value += amp * abs(cnoise(p));
    p *= freq;
    amp *= waveAmplitude;
  }
  return value;
}

float pattern(vec2 p) {
  vec2 p2 = p - time * waveSpeed;
  return fbm(p - fbm(p + fbm(p2)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  uv -= 0.5;
  uv.x *= resolution.x / resolution.y;
  float f = pattern(uv);
  if (enableMouseInteraction == 1) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(uv - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
    f -= 0.5 * effect;
  }
  vec3 col = mix(vec3(1.0), waveColor, f);
  gl_FragColor = vec4(col, 1.0);
}
`;

const ditherFragmentShader = `
precision highp float;
uniform float colorNum;
uniform float pixelSize;
const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
  vec2 scaledCoord = floor(uv * resolution / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
  float step = 1.0 / (colorNum - 1.0);
  color += threshold * step;
  float bias = 0.2;
  color = clamp(color - bias, 0.0, 1.0);
  return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void mainImage(in vec4 inputColor, in vec2 uv, out vec4 outputColor) {
  vec2 normalizedPixelSize = pixelSize / resolution;
  vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);
  vec4 color = texture2D(inputBuffer, uvPixel);
  color.rgb = dither(uv, color.rgb);
  outputColor = color;
}
`;

class RetroEffectImpl extends Effect {
  constructor() {
    const uniforms = new Map([
      ["colorNum", new THREE.Uniform(8.0)],
      ["pixelSize", new THREE.Uniform(4.0)],
    ]);
    super("RetroEffect", ditherFragmentShader, { uniforms });
    this.uniforms = uniforms;
  }

  set colorNum(v) {
    this.uniforms.get("colorNum").value = v;
  }
  get colorNum() {
    return this.uniforms.get("colorNum").value;
  }
  set pixelSize(v) {
    this.uniforms.get("pixelSize").value = v;
  }
  get pixelSize() {
    return this.uniforms.get("pixelSize").value;
  }
}

const WrappedRetro = wrapEffect(RetroEffectImpl);

const RetroEffect = forwardRef((props, ref) => {
  const { colorNum, pixelSize } = props;
  return <WrappedRetro ref={ref} colorNum={colorNum} pixelSize={pixelSize} />;
});
RetroEffect.displayName = "RetroEffect";

function DitheredWaves({
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  waveColor,
  colorNum,
  pixelSize,
  disableAnimation,
  enableMouseInteraction,
  mouseRadius,
}) {
  const mesh = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { viewport, size, gl } = useThree();

  const waveUniformsRef = useRef({
    time: new THREE.Uniform(0),
    resolution: new THREE.Uniform(new THREE.Vector2(0, 0)),
    waveSpeed: new THREE.Uniform(waveSpeed),
    waveFrequency: new THREE.Uniform(waveFrequency),
    waveAmplitude: new THREE.Uniform(waveAmplitude),
    waveColor: new THREE.Uniform(new THREE.Color(...waveColor)),
    mousePos: new THREE.Uniform(new THREE.Vector2(0, 0)),
    enableMouseInteraction: new THREE.Uniform(enableMouseInteraction ? 1 : 0),
    mouseRadius: new THREE.Uniform(mouseRadius),
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    const w = Math.floor(size.width * dpr);
    const h = Math.floor(size.height * dpr);
    const res = waveUniformsRef.current.resolution.value;
    if (res.x !== w || res.y !== h) {
      res.set(w, h);
    }
  }, [size, gl]);

  useFrame(({ clock }) => {
    const u = waveUniformsRef.current;
    if (!disableAnimation) u.time.value = clock.getElapsedTime();
    u.waveSpeed.value = waveSpeed;
    u.waveFrequency.value = waveFrequency;
    u.waveAmplitude.value = waveAmplitude;
    u.waveColor.value.set(...waveColor);
    u.enableMouseInteraction.value = enableMouseInteraction ? 1 : 0;
    u.mouseRadius.value = mouseRadius;
    if (enableMouseInteraction) {
      u.mousePos.value.set(mousePos.x, mousePos.y);
    }
  });

  const handlePointerMove = (e) => {
    if (!enableMouseInteraction) return;
    const rect = gl.domElement.getBoundingClientRect();
    const dpr = gl.getPixelRatio();
    setMousePos({
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    });
  };

  return (
    <>
      <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          vertexShader={waveVertexShader}
          fragmentShader={waveFragmentShader}
          uniforms={waveUniformsRef.current}
          transparent={true}
        />
      </mesh>

      <EffectComposer>
        <RetroEffect colorNum={colorNum} pixelSize={pixelSize} />
      </EffectComposer>

      <mesh
        onPointerMove={handlePointerMove}
        position={[0, 0, 0.01]}
        scale={[viewport.width, viewport.height, 1]}
        visible={false}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

const DitherBackground = ({
  waveSpeed = 0.05,
  waveFrequency = 3,
  waveAmplitude = 0.3,
  waveColor = [0.5, 0.5, 0.5],
  colorNum = 4,
  pixelSize = 2,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 1,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-auto z-0">
      <Canvas
        className="w-full h-full relative"
        camera={{ position: [0, 0, 6] }}
        dpr={typeof window !== "undefined" ? window.devicePixelRatio : 1}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <DitheredWaves
          waveSpeed={waveSpeed}
          waveFrequency={waveFrequency}
          waveAmplitude={waveAmplitude}
          waveColor={waveColor}
          colorNum={colorNum}
          pixelSize={pixelSize}
          disableAnimation={disableAnimation}
          enableMouseInteraction={enableMouseInteraction}
          mouseRadius={mouseRadius}
        />
      </Canvas>
    </div>
  );
};

// Improved UI Components with Bigger Sizes for Landing
const Card = ({ children, className = "", selected = false, ...props }) => {
  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-200 rounded-lg cursor-pointer
        ${
          selected
            ? "bg-white/50 border-2 border-orange-500 shadow-lg shadow-orange-500/20"
            : "bg-white/20 border border-gray-300/60 hover:bg-white/30"
        }
        backdrop-blur-sm ${className}
      `}
      style={{
        boxShadow: selected
          ? "0 4px 15px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)"
          : "0 2px 8px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-orange-500 to-orange-600
      hover:from-orange-400 hover:to-orange-500
      text-white shadow-md
      disabled:from-gray-400 disabled:to-gray-500
    `,
    secondary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      hover:from-blue-400 hover:to-blue-500
      text-white shadow-md
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-400 hover:to-red-500
      text-white shadow-md
    `,
    outline: `
      border-2 border-orange-500 text-orange-700 bg-white/80
      hover:bg-orange-500 hover:text-white
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden font-medium transition-all duration-200 rounded-md
        ${variantClasses[variant]} ${className}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const ProgressBar = ({ progress, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full bg-white/40 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-white/50">
        <div
          className="h-2 bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700 relative rounded-full"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-white opacity-30 rounded-full" />
        </div>
      </div>
    </div>
  );
};

// Compact Header Component
const Header = () => {
  const [starData, setStarData] = useState({
    stars: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    const fetchStars = async () => {
      try {
        console.log("Fetching GitHub stars...");
        const response = await fetch("/api/github-stars", {
          cache: "no-store", // Always get fresh data
        });
        const data = await response.json();

        if (data.success) {
          console.log("Stars fetched successfully:", data.stars);
          setStarData({ stars: data.stars, loading: false, error: false });
        } else {
          console.error("API returned error:", data.error);
          setStarData({ stars: null, loading: false, error: true });
        }
      } catch (error) {
        console.error("Failed to fetch stars:", error);
        setStarData({ stars: null, loading: false, error: true });
      }
    };

    fetchStars();
  }, []);

  const formatStars = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  const renderStars = () => {
    if (starData.loading) return "...";
    if (starData.error || starData.stars === null) return "API problem";
    return `${formatStars(starData.stars)} stars`;
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
      <div className="bg-white/20 backdrop-blur-lg border border-gray-200/60 rounded-xl shadow-lg">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                <Cloud className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900">PrepMaster</h1>
                <p className="text-xs text-gray-700">AWS Cloud Practitioner</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>{renderStars()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact Footer Component
const Footer = () => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4">
    <div className="bg-white/20 backdrop-blur-lg border border-gray-200/60 rounded-xl shadow-lg">
      <div className="px-4 py-3">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-3 mb-2">
            <a
              href="https://github.com/thomas-x-69/prepmaster"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-800 hover:text-orange-600 transition-colors text-xs"
            >
              <GitBranch className="w-3 h-3" />
              <span>GitHub Repository</span>
            </a>
          </div>
          <p className="text-gray-900 text-xs font-medium">
            Created with ❤️ by{" "}
            <span className="font-bold text-orange-600">Thomas Ashraf</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Main Application Component
export default function PrepMaster() {
  const [currentScreen, setCurrentScreen] = useState("start");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]); // For multiple choice
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // AWS Cloud Practitioner Categories
  const categories = [
    {
      id: "fundamentals",
      name: "Cloud Fundamentals",
      count: questionDatabase.fundamentals?.length || 0,
      icon: Cloud,
      color: "from-blue-500 to-blue-600",
      description: "Core cloud concepts and AWS basics",
    },
    {
      id: "services",
      name: "AWS Services",
      count: questionDatabase.services?.length || 0,
      icon: Server,
      color: "from-green-500 to-green-600",
      description: "Key AWS services and use cases",
    },
    {
      id: "security",
      name: "Security & Compliance",
      count: questionDatabase.security?.length || 0,
      icon: Shield,
      color: "from-red-500 to-red-600",
      description: "AWS security best practices",
    },
    {
      id: "pricing",
      name: "Pricing & Billing",
      count: questionDatabase.pricing?.length || 0,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      description: "AWS pricing models and cost optimization",
    },
  ];

  const startQuiz = () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least one category to continue!");
      return;
    }

    let questions = [];
    selectedCategories.forEach((categoryId) => {
      const categoryQuestions = questionDatabase[categoryId] || [];
      questions = [
        ...questions,
        ...categoryQuestions.map((q) => ({ ...q, category: categoryId })),
      ];
    });

    const shuffledQuestions = shuffleArray(questions);
    setCurrentQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setSelectedAnswers([]);
    setUserAnswers([]);
    setScore(0);
    setShowExplanation(false);
    setCurrentScreen("quiz");
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Handle single choice questions
  const selectAnswer = (answerIndex) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (currentQuestion.type === "single") {
      if (selectedAnswer !== null) return;

      setSelectedAnswer(answerIndex);
      setShowExplanation(true);

      const isCorrect = answerIndex === currentQuestion.correct;

      if (isCorrect) {
        setScore(score + 1);
      }

      const newAnswer = {
        questionIndex: currentQuestionIndex,
        selectedAnswer: answerIndex,
        correct: currentQuestion.correct,
        isCorrect,
      };

      setUserAnswers([...userAnswers, newAnswer]);
    }
  };

  // Handle multiple choice questions
  const toggleMultipleAnswer = (answerIndex) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (currentQuestion.type === "multiple" && !showExplanation) {
      setSelectedAnswers((prev) => {
        if (prev.includes(answerIndex)) {
          return prev.filter((idx) => idx !== answerIndex);
        } else {
          return [...prev, answerIndex];
        }
      });
    }
  };

  // Submit multiple choice answer
  const submitMultipleAnswer = () => {
    const currentQuestion = currentQuestions[currentQuestionIndex];

    if (currentQuestion.type === "multiple") {
      setShowExplanation(true);

      const correctAnswers = Array.isArray(currentQuestion.correct)
        ? currentQuestion.correct
        : [currentQuestion.correct];

      const sortedSelected = [...selectedAnswers].sort();
      const sortedCorrect = [...correctAnswers].sort();

      const isCorrect =
        sortedSelected.length === sortedCorrect.length &&
        sortedSelected.every((val, idx) => val === sortedCorrect[idx]);

      if (isCorrect) {
        setScore(score + 1);
      }

      const newAnswer = {
        questionIndex: currentQuestionIndex,
        selectedAnswer: selectedAnswers,
        correct: currentQuestion.correct,
        isCorrect,
      };

      setUserAnswers([...userAnswers, newAnswer]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setSelectedAnswers([]);
      setShowExplanation(false);
    } else {
      setCurrentScreen("results");
    }
  };

  const restartQuiz = () => {
    setCurrentScreen("start");
    setSelectedCategories([]);
  };

  const endQuiz = () => {
    setCurrentScreen("results");
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (currentScreen === "start") {
    return (
      <div className="min-h-screen relative">
        {/* Iridescence Background */}
        <div className="fixed inset-0 z-0">
          <Iridescence
            color={[1.0, 0.9, 0.8]}
            speed={0.8}
            amplitude={0.15}
            mouseReact={true}
            className="w-full h-full"
          />
        </div>

        <Header />

        <div className="container mx-auto px-4 py-6 relative z-10 pt-32 pb-32">
          {/* BIGGER Hero Section */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
                AWS Cloud Practitioner
              </h1>
              <div className="text-xl md:text-2xl text-orange-600 font-semibold mb-4">
                Certification Exam Preparation
              </div>
              <p className="text-base md:text-lg text-gray-800 mb-6 max-w-3xl mx-auto leading-relaxed">
                Master the fundamentals of AWS Cloud with comprehensive practice
                questions. Prepare for the AWS Certified Cloud Practitioner
                certification with confidence.
              </p>
            </div>

            <div className="flex justify-center items-center space-x-6 md:space-x-8 text-gray-800 flex-wrap text-sm md:text-base">
              <div className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Core AWS Services</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="font-medium">Security Best Practices</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-500" />
                <span className="font-medium">Pricing & Billing</span>
              </div>
            </div>
          </div>

          {/* BIGGER Category Selection */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  Select Question Categories
                </h2>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() =>
                    setSelectedCategories(categories.map((cat) => cat.id))
                  }
                  variant="outline"
                  className="px-4 py-2 text-sm"
                >
                  Select All
                </Button>
                <Button
                  onClick={() => setSelectedCategories([])}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                >
                  Clear All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategories.includes(category.id);

                return (
                  <Card
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    selected={isSelected}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center shadow-md`}
                      >
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-orange-600" />
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-800 text-xs mb-3 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="text-orange-600 text-xs font-semibold">
                      {category.count} Questions
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-800 mb-4 text-sm">
                Selected:{" "}
                <span className="font-bold text-orange-600">
                  {selectedCategories.length} categories
                </span>{" "}
                • Total Questions:{" "}
                <span className="font-bold text-blue-600">
                  {selectedCategories.reduce((total, catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    return total + (cat ? cat.count : 0);
                  }, 0)}
                </span>
              </p>
            </div>
          </Card>

          {/* BIGGER Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: Brain,
                title: "Smart Practice",
                desc: "Comprehensive questions with detailed explanations",
              },
              {
                icon: Target,
                title: "Exam-Ready",
                desc: "Questions mirroring the actual certification exam",
              },
              {
                icon: Trophy,
                title: "Track Progress",
                desc: "Monitor performance and identify focus areas",
              },
            ].map((feature, i) => {
              const IconComponent = feature.icon;
              return (
                <Card key={i} className="p-6 text-center">
                  <IconComponent className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold mb-2 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-800 text-xs leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* BIGGER Start Button */}
          <div className="text-center">
            <Button
              onClick={startQuiz}
              disabled={selectedCategories.length === 0}
              className="px-8 py-3 text-lg font-bold"
              variant="primary"
            >
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5" />
                <span>
                  {selectedCategories.length === 0
                    ? "Select Categories to Start"
                    : "Begin Practice Exam"}
                </span>
              </div>
            </Button>

            {selectedCategories.length > 0 && (
              <p className="mt-4 text-gray-800 text-sm">
                Ready to ace your AWS Cloud Practitioner certification? 🚀
              </p>
            )}
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (currentScreen === "quiz") {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    const answeredCount = userAnswers.length;
    const currentCategory = categories.find(
      (cat) => cat.id === currentQuestion.category
    );

    return (
      <div className="min-h-screen relative">
        {/* Iridescence Background for Quiz */}
        <div className="fixed inset-0 z-0">
          <Iridescence
            color={[0.8, 0.9, 1.0]}
            speed={0.5}
            amplitude={0.08}
            mouseReact={false}
            className="w-full h-full"
          />
        </div>

        <Header />

        <div className="container mx-auto px-3 py-3 relative z-10 pt-32 pb-32 max-h-screen overflow-y-auto">
          {/* Progress Header */}
          <Card className="p-3 md:p-4 mb-3 md:mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-3 sm:space-y-0">
              <div className="flex flex-wrap items-center gap-3 md:gap-6">
                {[
                  {
                    label: "Question",
                    value: `${currentQuestionIndex + 1}/${
                      currentQuestions.length
                    }`,
                    color: "text-orange-600",
                  },
                  { label: "Correct", value: score, color: "text-green-600" },
                  {
                    label: "Score",
                    value: `${
                      answeredCount > 0
                        ? Math.round((score / answeredCount) * 100)
                        : 0
                    }%`,
                    color: "text-blue-600",
                  },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div
                      className={`text-lg md:text-xl font-bold ${stat.color}`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* BIGGER End Test Button */}
              <Button
                onClick={endQuiz}
                variant="danger"
                className="px-4 py-2 text-sm w-full sm:w-auto"
              >
                <div className="flex items-center justify-center space-x-1">
                  <span>End Exam</span>
                </div>
              </Button>
            </div>

            <ProgressBar progress={progress} />
          </Card>

          {/* Question */}
          <Card className="p-3 md:p-4">
            {/* Category Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
              <div
                className={`px-3 md:px-4 py-1 md:py-2 rounded-lg bg-gradient-to-r ${currentCategory?.color} text-white font-medium flex items-center space-x-1 shadow-md`}
              >
                {currentCategory?.icon && (
                  <currentCategory.icon className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                )}
                <span className="text-xs">{currentCategory?.name}</span>
              </div>
              <div className="text-gray-600 font-medium text-xs">
                AWS Cloud Practitioner •{" "}
                {currentQuestion.type === "multiple"
                  ? "Multiple Choice"
                  : "Single Choice"}
              </div>
            </div>

            {/* Question Text */}
            <div className="mb-4 md:mb-6">
              <h2 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-3 md:mb-4 leading-relaxed">
                {currentQuestion.question}
              </h2>
              {currentQuestion.type === "multiple" && (
                <p className="text-xs text-orange-600 font-medium mb-2">
                  Select all correct answers, then click Submit Answer
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-2 mb-4 md:mb-6">
              {currentQuestion.options.map((option, index) => {
                let optionClass =
                  "w-full p-3 md:p-4 rounded-lg text-left transition-all duration-200 cursor-pointer border-2 text-xs md:text-sm ";
                let isSelected = false;

                if (currentQuestion.type === "single") {
                  // Single choice logic
                  if (selectedAnswer === null) {
                    optionClass +=
                      "border-gray-300 bg-white/70 hover:border-orange-400 hover:bg-white/90 text-gray-900";
                  } else if (index === currentQuestion.correct) {
                    optionClass +=
                      "border-green-400 bg-green-50 text-green-800";
                  } else if (
                    index === selectedAnswer &&
                    selectedAnswer !== currentQuestion.correct
                  ) {
                    optionClass += "border-red-400 bg-red-50 text-red-800";
                  } else {
                    optionClass +=
                      "border-gray-300 bg-gray-50 opacity-60 text-gray-700";
                  }
                } else {
                  // Multiple choice logic
                  isSelected = selectedAnswers.includes(index);
                  const correctAnswers = Array.isArray(currentQuestion.correct)
                    ? currentQuestion.correct
                    : [currentQuestion.correct];

                  if (!showExplanation) {
                    if (isSelected) {
                      optionClass +=
                        "border-orange-400 bg-orange-50 text-orange-800";
                    } else {
                      optionClass +=
                        "border-gray-300 bg-white/70 hover:border-orange-400 hover:bg-white/90 text-gray-900";
                    }
                  } else {
                    if (correctAnswers.includes(index)) {
                      optionClass +=
                        "border-green-400 bg-green-50 text-green-800";
                    } else if (isSelected) {
                      optionClass += "border-red-400 bg-red-50 text-red-800";
                    } else {
                      optionClass +=
                        "border-gray-300 bg-gray-50 opacity-60 text-gray-700";
                    }
                  }
                }

                const handleClick = () => {
                  if (currentQuestion.type === "single") {
                    selectAnswer(index);
                  } else {
                    toggleMultipleAnswer(index);
                  }
                };

                return (
                  <button
                    key={index}
                    onClick={handleClick}
                    disabled={showExplanation}
                    className={optionClass}
                  >
                    <div className="flex items-start space-x-2 md:space-x-3">
                      {currentQuestion.type === "single" ? (
                        <div className="w-5 md:w-6 h-5 md:h-6 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px] md:text-xs flex-shrink-0 mt-0.5">
                          {String.fromCharCode(65 + index)}
                        </div>
                      ) : (
                        <div
                          className={`w-5 md:w-6 h-5 md:h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-orange-500 border-orange-500"
                              : "border-gray-400 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle className="w-3 md:w-4 h-3 md:h-4 text-white" />
                          )}
                        </div>
                      )}
                      <span className="flex-1 leading-relaxed">{option}</span>

                      {/* Show correct/incorrect indicators after submission */}
                      {showExplanation && (
                        <>
                          {(currentQuestion.type === "single" &&
                            index === currentQuestion.correct) ||
                          (currentQuestion.type === "multiple" &&
                            (Array.isArray(currentQuestion.correct)
                              ? currentQuestion.correct
                              : [currentQuestion.correct]
                            ).includes(index)) ? (
                            <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            ((currentQuestion.type === "single" &&
                              index === selectedAnswer &&
                              selectedAnswer !== currentQuestion.correct) ||
                              (currentQuestion.type === "multiple" &&
                                selectedAnswers.includes(index) &&
                                !(
                                  Array.isArray(currentQuestion.correct)
                                    ? currentQuestion.correct
                                    : [currentQuestion.correct]
                                ).includes(index))) && (
                              <XCircle className="w-4 md:w-5 h-4 md:h-5 text-red-600 flex-shrink-0" />
                            )
                          )}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Answer Button for Multiple Choice */}
            {currentQuestion.type === "multiple" &&
              !showExplanation &&
              selectedAnswers.length > 0 && (
                <div className="flex justify-center mb-4">
                  <Button
                    onClick={submitMultipleAnswer}
                    variant="secondary"
                    className="px-4 md:px-6 py-2 text-sm md:text-base font-bold"
                  >
                    Submit Answer
                  </Button>
                </div>
              )}

            {/* Explanation */}
            {showExplanation && (
              <Card className="p-3 md:p-4 mb-4 bg-blue-50/80">
                <h4 className="text-blue-700 font-bold mb-2 flex items-center text-xs md:text-sm">
                  <Brain className="w-3 md:w-4 h-3 md:h-4 mr-1 flex-shrink-0" />
                  Explanation:
                </h4>
                <p className="text-gray-900 leading-relaxed text-xs md:text-sm">
                  {currentQuestion.explanation}
                </p>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-center">
              {showExplanation && (
                <Button
                  onClick={nextQuestion}
                  variant="primary"
                  className="px-4 md:px-6 py-2 text-sm md:text-base font-bold w-full sm:w-auto"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>
                      {currentQuestionIndex === currentQuestions.length - 1
                        ? "View Results"
                        : "Next Question"}
                    </span>
                    <ChevronRight className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0" />
                  </div>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (currentScreen === "results") {
    const totalQuestions = userAnswers.length;
    const finalScore = Math.round((score / totalQuestions) * 100);
    const passed = finalScore >= 70;

    return (
      <div className="min-h-screen bg-transparent relative">
        <DitherBackground
          waveSpeed={0.04}
          waveFrequency={2}
          waveAmplitude={0.5}
          waveColor={passed ? [0.2, 0.8, 0.4] : [0.8, 0.5, 0.2]}
          colorNum={passed ? 8 : 6}
          pixelSize={4}
          enableMouseInteraction={true}
          mouseRadius={1.2}
        />

        <Header />

        <div className="container mx-auto px-3 py-6 relative z-10 pt-32 pb-32">
          {/* Results Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl ${
                  passed
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : "bg-gradient-to-r from-orange-500 to-orange-600"
                }`}
              >
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3 text-gray-900">
              Exam Complete!
            </h1>
            <p className="text-base text-gray-800">
              AWS Cloud Practitioner Practice Results
            </p>
          </div>

          {/* Score Display */}
          <div className="flex justify-center mb-6">
            <Card className="relative w-64 h-64 flex items-center justify-center rounded-full">
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-3">
                  {finalScore}%
                </div>
                <div
                  className={`text-xl font-semibold mb-2 ${
                    passed ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {passed ? "EXCELLENT WORK!" : "KEEP PRACTICING!"}
                </div>
                <div className="text-gray-700 text-base">
                  {score} out of {totalQuestions} correct
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Questions Correct",
                value: score,
                color: "text-green-600",
                icon: CheckCircle,
              },
              {
                label: "Questions Missed",
                value: totalQuestions - score,
                color: "text-red-600",
                icon: XCircle,
              },
              {
                label: "Total Questions",
                value: totalQuestions,
                color: "text-blue-600",
                icon: Target,
              },
              {
                label: "Pass Threshold",
                value: "70%",
                color: "text-purple-600",
                icon: Trophy,
              },
            ].map((stat, i) => {
              const IconComponent = stat.icon;
              return (
                <Card key={i} className="p-4 text-center">
                  <IconComponent
                    className={`w-6 h-6 ${stat.color} mx-auto mb-2`}
                  />
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-800 font-medium text-xs">
                    {stat.label}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Results Message */}
          <Card className="p-6 mb-6 text-center">
            <div className="mb-4">
              {passed ? (
                <div className="text-green-600">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-3">
                    Outstanding Performance! 🎉
                  </h3>
                  <p className="text-gray-900 text-sm leading-relaxed max-w-2xl mx-auto">
                    Congratulations! You're demonstrating strong mastery of AWS
                    Cloud Practitioner concepts. Your understanding shows you're
                    well-prepared for the certification exam.
                  </p>
                </div>
              ) : (
                <div className="text-orange-600">
                  <Target className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-3">
                    Great Progress! 📚
                  </h3>
                  <p className="text-gray-900 text-sm leading-relaxed max-w-2xl mx-auto">
                    You're building solid foundations in AWS Cloud concepts!
                    Continue practicing and focus on your growth areas. With
                    consistent effort, certification success is within reach!
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={restartQuiz}
              variant="primary"
              className="px-6 py-3 text-base font-bold"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Practice Again
            </Button>
            <Button
              onClick={() =>
                window.open(
                  "https://aws.amazon.com/certification/certified-cloud-practitioner/",
                  "_blank"
                )
              }
              variant="outline"
              className="px-6 py-3 text-base font-bold"
            >
              <Globe className="w-4 h-4 mr-2" />
              AWS Certification
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return null;
}
