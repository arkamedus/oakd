import React, { useMemo, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import GLRenderer from "./GLRenderer";
import GLContextProvider from "../GLContextProvider/GLContextProvider";
import { OakMDocument, oakMToMeshData } from "../../Utils";
import Card from "../Card/Card";
import Content from "../../Layout/Content/Content";
import Page from "../../Layout/Page/Page";
import Row from "../../Layout/Row/Row";
import Col from "../../Layout/Column/Column";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Title from "../Title/Title";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Select from "../Select/Select";
import ColorField from "../ColorField/ColorField";
import { ColorValue } from "../ColorField/ColorField.types";
import VectorField from "../VectorField/VectorField";
import { VectorValue } from "../VectorField/VectorField.types";
import ScrollArea from "../../Layout/ScrollArea/ScrollArea";

const meta: Meta<typeof GLRenderer> = {
  title: "Design System/Atomic/GLRenderer",
  component: GLRenderer,
};

export default meta;
type Story = StoryObj<typeof GLRenderer>;

const stageScene = (
  seed = 0,
  cubeScale = 1,
  cubeMaterial = 3,
  cubeColor = { r: 0.92, g: 0.95, b: 1, a: 1 },
): OakMDocument => {
  const offset = (seed % 7) * 0.1;
  return {
    name: `stage-${seed}`,
    primitives: [
      {
        id: `floor-${seed}`,
        name: "floor",
        type: "plane",
        position: { x: 0, y: 0, z: -0.6 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 5, y: 5, z: 1 },
        material: 2,
        color: {
          r: 0.72 + offset * 0.2,
          g: 0.76 + offset * 0.1,
          b: 0.84,
          a: 1,
        },
      },
      {
        id: `cube-main-${seed}`,
        name: "cube_main",
        type: "cube",
        position: { x: 0, y: 0, z: 0.1 },
        rotationDeg: { x: seed * 4, y: seed * 7, z: seed * 3 },
        scale: { x: cubeScale, y: cubeScale, z: cubeScale },
        material: cubeMaterial,
        color: cubeColor,
      },
      {
        id: `cube-side-${seed}`,
        name: "cube_side",
        type: "cube",
        position: { x: -0.95, y: 0.7, z: -0.1 },
        rotationDeg: { x: seed * 2, y: seed * 6 + 35, z: 15 },
        scale: { x: 0.45, y: 0.45, z: 0.45 },
        material: (cubeMaterial % 4) + 1,
        color: { r: 0.96, g: 0.9, b: 0.75 + (seed % 3) * 0.05, a: 1 },
      },
    ],
  };
};

const qualityGridScene = (meshQuality: 0 | 1): OakMDocument => ({
  name: `quality-grid-${meshQuality}`,
  primitives: [
    {
      id: `floor-grid-${meshQuality}`,
      name: "floor",
      type: "plane",
      position: { x: 0, y: 0, z: -0.75 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 7, y: 7, z: 1 },
      material: 2,
      color: { r: 0.75, g: 0.78, b: 0.85, a: 1 },
    },
    {
      id: `sphere-pxp-${meshQuality}`,
      name: "sphere",
      type: "sphere",
      position: { x: 1, y: 1, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 0.93, y: 0.93, z: 0.93 },
      material: 3,
      color: { r: 0.88, g: 0.92, b: 1, a: 1 },
    },
    {
      id: `cylinder-nxp-${meshQuality}`,
      name: "cylinder",
      type: "cylinder",
      position: { x: -1, y: 1, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 12 },
      scale: { x: 0.87, y: 0.87, z: 1.2 },
      material: 4,
      color: { r: 0.96, g: 0.82, b: 0.5, a: 1 },
    },
    {
      id: `cone-nxn-${meshQuality}`,
      name: "cone",
      type: "cone",
      position: { x: -1, y: -1, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 15 },
      scale: { x: 0.93, y: 0.93, z: 1.28 },
      material: 1,
      color: { r: 0.78, g: 0.97, b: 0.67, a: 1 },
    },
    {
      id: `icosphere-pxn-${meshQuality}`,
      name: "icosphere",
      type: "icosphere",
      position: { x: 1, y: -1, z: 0 },
      rotationDeg: { x: 8, y: 16, z: 0 },
      scale: { x: 0.9, y: 0.9, z: 0.9 },
      material: 3,
      color: { r: 0.86, g: 0.9, b: 1, a: 1 },
    },
  ],
});

const cornellRoomScene = (): OakMDocument => ({
  name: "cornell-room",
  primitives: [
    {
      id: "room-floor",
      name: "floor",
      type: "cube",
      position: { x: 0, y: 0, z: -1.25 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 4, y: 4, z: 0.1 },
      material: 2,
      color: { r: 0.83, g: 0.83, b: 0.82, a: 1 },
    },
    {
      id: "room-ceiling",
      name: "ceiling",
      type: "cube",
      position: { x: 0, y: 0, z: 1.25 },
      rotationDeg: { x: 180, y: 0, z: 0 },
      scale: { x: 4, y: 4, z: 0.1 },
      material: 2,
      color: { r: 0.86, g: 0.86, b: 0.84, a: 1 },
    },
    {
      id: "room-back",
      name: "back-wall",
      type: "cube",
      position: { x: 0, y: 2, z: 0 },
      rotationDeg: { x: 90, y: 0, z: 0 },
      scale: { x: 4, y: 2.5, z: 0.1 },
      material: 2,
      color: { r: 0.84, g: 0.84, b: 0.83, a: 1 },
    },
    {
      id: "room-left",
      name: "left-wall",
      type: "cube",
      position: { x: -2, y: 0, z: 0 },
      rotationDeg: { x: 0, y: -90, z: 0 },
      scale: { x: 2.5, y: 4.14, z: 0.1 },
      material: 2,
      color: { r: 0.96, g: 0.45, b: 0.42, a: 1 },
    },
    {
      id: "room-right",
      name: "right-wall",
      type: "cube",
      position: { x: 2, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 90, z: 0 },
      scale: { x: 2.5, y: 4.14, z: 0.1 },
      material: 2,
      color: { r: 0.42, g: 0.9, b: 0.54, a: 1 },
    },
    {
      id: "room-block",
      name: "center-block",
      type: "cube",
      position: { x: -0.85, y: 0.45, z: -0.55 },
      rotationDeg: { x: 0, y: 0, z: 16 },
      scale: { x: 0.85, y: 0.85, z: 1.35 },
      material: 0,
      color: { r: 0.86, g: 0.85, b: 0.82, a: 1 },
    },
    {
      id: "room-cylinder",
      name: "cylinder",
      type: "cylinder",
      position: { x: 0.92, y: -0.15, z: -0.5 },
      rotationDeg: { x: 0, y: 0, z: 6 },
      scale: { x: 0.75, y: 0.75, z: 1.45 },
      material: 3,
      color: { r: 0.8, g: 0.9, b: 1, a: 1 },
    },
    {
      id: "room-sphere",
      name: "sphere",
      type: "sphere",
      position: { x: 0.5, y: 0.9, z: -0.55 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 0.6, y: 0.6, z: 0.6 },
      material: 1,
      color: { r: 1, g: 0.88, b: 0.68, a: 1 },
    },
  ],
});

export const BasicCube: Story = {
  render: () => {
    const mesh = useMemo(
      () => oakMToMeshData(stageScene(2, 1.2, 3), { meshQuality: 1 }),
      [],
    );

    return (
      <GLContextProvider>
        <Card pad wide>
          <Space direction="vertical" gap wide>
            <Paragraph>
              <strong>OakM Stage Render</strong>
            </Paragraph>
            <GLRenderer
              mesh={mesh}
              height={260}
              autoRotate={false}
              cameraOrbitSpeed={0.12}
              rendering={{
                pixelRatio: "default",
                maxFPS: 60,
                shadowMapSize: 1024,
                meshQuality: 1,
              }}
            />
          </Space>
        </Card>
      </GLContextProvider>
    );
  },
};

export const SharedContextThirtyTwoRenderers: Story = {
  render: () => {
    const renderCases = useMemo(() => {
      const materials = [0, 1, 2, 3, 4] as const;
      const colors = [
        { name: "ice", rgba: { r: 0.86, g: 0.93, b: 1, a: 1 } },
        { name: "amber", rgba: { r: 0.98, g: 0.76, b: 0.32, a: 1 } },
        { name: "mint", rgba: { r: 0.54, g: 0.92, b: 0.67, a: 1 } },
        { name: "orchid", rgba: { r: 0.9, g: 0.62, b: 0.96, a: 1 } },
        { name: "coral", rgba: { r: 0.98, g: 0.58, b: 0.52, a: 1 } },
        { name: "steel", rgba: { r: 0.72, g: 0.8, b: 0.9, a: 1 } },
      ] as const;

      const cases: Array<{
        mesh: ReturnType<typeof oakMToMeshData>;
        label: string;
      }> = [];
      let seed = 0;
      for (const material of materials) {
        for (const color of colors) {
          cases.push({
            mesh: oakMToMeshData(stageScene(seed, 0.86, material, color.rgba), {
              meshQuality: 1,
            }),
            label: `m${material} · ${color.name}`,
          });
          seed += 1;
        }
      }
      const extras = [
        {
          name: "lime",
          rgba: { r: 0.8, g: 0.95, b: 0.45, a: 1 },
          material: 3,
        },
        {
          name: "rose",
          rgba: { r: 0.95, g: 0.68, b: 0.81, a: 1 },
          material: 4,
        },
      ] as const;
      for (const extra of extras) {
        cases.push({
          mesh: oakMToMeshData(
            stageScene(seed, 0.86, extra.material, extra.rgba),
            { meshQuality: 1 },
          ),
          label: `m${extra.material} · ${extra.name}`,
        });
        seed += 1;
      }
      return cases;
    }, []);

    return (
      <GLContextProvider>
        <Row gap wide>
          {renderCases.map((entry, index) => (
            <Col key={entry.label} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Space direction="vertical" gap wide>
                <Card wide>
                  <GLRenderer
                    mesh={entry.mesh}
                    height={160}
                    autoRotate={false}
                    cameraOrbitSpeed={0.08 + (index % 6) * 0.01}
                    rendering={{
                      pixelRatio: "default",
                      maxFPS: 24,
                      shadowMapSize: 128,
                      shadowSoftness: 8.0,
                      shadowSamples: 8,
                      shadowOrthoSize: 2,
                      meshQuality: 1,
                    }}
                  />
                </Card>
                <Paragraph className="muted">
                  <small>{entry.label}</small>
                </Paragraph>
              </Space>
            </Col>
          ))}
        </Row>
      </GLContextProvider>
    );
  },
};

export const SphereMeshQualityComparison: Story = {
  render: () => {
    const lowQualityMesh = useMemo(
      () => oakMToMeshData(qualityGridScene(0), { meshQuality: 0 }),
      [],
    );
    const highQualityMesh = useMemo(
      () => oakMToMeshData(qualityGridScene(1), { meshQuality: 1 }),
      [],
    );

    return (
      <GLContextProvider>
        <Row gap wide>
          <Col xs={24} md={12}>
            <Card pad wide>
              <ScrollArea
                orientation="vertical"
                wide
                style={{ maxHeight: "var(--oakd-surface-height-xl)" }}
              >
                <Space direction="vertical" gap wide>
                  <Paragraph>
                    <strong>Mesh Quality 0 · 2x2 Primitive Grid</strong>
                  </Paragraph>
                  <GLRenderer
                    mesh={lowQualityMesh}
                    height={260}
                    autoRotate={false}
                    cameraOrbitSpeed={0.1}
                    cameraDistance={4.2}
                    rendering={{
                      pixelRatio: "default",
                      maxFPS: 60,
                      shadowMapSize: 1024,
                      meshQuality: 0,
                      shadowMapSize: 128,
                      shadowSoftness: 8.0,
                      shadowSamples: 8,
                      shadowOrthoSize: 2,
                    }}
                  />
                </Space>
              </ScrollArea>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card pad wide>
              <Space direction="vertical" gap wide>
                <Paragraph>
                  <strong>Mesh Quality 1 · 2x2 Primitive Grid</strong>
                </Paragraph>
                <GLRenderer
                  mesh={highQualityMesh}
                  height={260}
                  autoRotate={false}
                  cameraOrbitSpeed={0.1}
                  cameraDistance={4.2}
                  rendering={{
                    pixelRatio: "default",
                    maxFPS: 60,
                    shadowMapSize: 1024,
                    meshQuality: 1,
                    shadowMapSize: 128,
                    shadowSoftness: 8.0,
                    shadowSamples: 8,
                    shadowOrthoSize: 2,
                  }}
                />
              </Space>
            </Card>
          </Col>
        </Row>
      </GLContextProvider>
    );
  },
};

export const CornellRoomRenderingTuner: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const [useDefaultPixelRatio, setUseDefaultPixelRatio] = useState(true);
    const [pixelRatio, setPixelRatio] = useState(1);
    const [maxFPS, setMaxFPS] = useState(45);
    const [shadowMapSize, setShadowMapSize] = useState(1024);
    const [meshQuality, setMeshQuality] = useState<0 | 1>(1);
    const [clearColor, setClearColor] = useState<ColorValue>({
      r: 0.06,
      g: 0.06,
      b: 0.08,
      a: 1,
    });
    const [lightDirection, setLightDirection] = useState<VectorValue>({
      x: -0.29,
      y: -0.98,
      z: 0.11,
    });
    const [shadowsEnabled, setShadowsEnabled] = useState(true);
    const [shadowMode, setShadowMode] = useState<"hard" | "soft">("soft");
    const [shadowBias, setShadowBias] = useState(0.0002);
    const [shadowNormalBias, setShadowNormalBias] = useState(0.00012);
    const [shadowSoftness, setShadowSoftness] = useState(1.5);
    const [shadowSamples, setShadowSamples] = useState(9);
    const [shadowOrthoSize, setShadowOrthoSize] = useState(24);
    const [shadowNear, setShadowNear] = useState(1);
    const [shadowFar, setShadowFar] = useState(120);
    const [renderLayer, setRenderLayer] = useState<
      | "final"
      | "diffuse"
      | "specular"
      | "lighting"
      | "emission"
      | "ssao"
      | "bloom"
      | "depth"
      | "normals"
      | "shadow"
    >("final");
    const [ssaoEnabled, setSsaoEnabled] = useState(false);
    const [ssaoRadius, setSsaoRadius] = useState(0.35);
    const [ssaoIntensity, setSsaoIntensity] = useState(1.0);
    const [ssaoBias, setSsaoBias] = useState(0.002);
    const [ssaoSamples, setSsaoSamples] = useState(16);
    const [bloomEnabled, setBloomEnabled] = useState(false);
    const [bloomThreshold, setBloomThreshold] = useState(0.7);
    const [bloomIntensity, setBloomIntensity] = useState(0.3);
    const [bloomRadius, setBloomRadius] = useState(3.0);
    const [ambientColor, setAmbientColor] = useState<ColorValue>({
      r: 0.92,
      g: 0.97,
      b: 1,
    });
    const [ambientIntensity, setAmbientIntensity] = useState(0.34);
    const [rimColor, setRimColor] = useState<ColorValue>({
      r: 1,
      g: 0.96,
      b: 0.9,
    });
    const [rimIntensity, setRimIntensity] = useState(0.18);
    const [rimPower, setRimPower] = useState(2.1);
    const [emissionStrength, setEmissionStrength] = useState(0.24);

    const mesh = useMemo(
      () => oakMToMeshData(cornellRoomScene(), { meshQuality }),
      [meshQuality],
    );

    return (
      <GLContextProvider>
        <Page fixed gap>
          <Content pad wide>
            <Space direction="vertical" gap>
              <Title>Cornell room rendering tuner</Title>
              <Paragraph>
                Stretch the preview surface while the control panel owns its
                scroll region.
              </Paragraph>
            </Space>
          </Content>
          <Content pad grow fill>
            <Row gap fill>
              <Col xs={24} lg={11}>
                <Card pad wide fill>
                  <Space direction="vertical" gap wide fill align="stretch">
                    <Title size="small">Cornell Room Rendering Controls</Title>
                    <Space direction="horizontal" gap wide>
                      <Button
                        variant={useDefaultPixelRatio ? "active" : "default"}
                        onClick={() =>
                          setUseDefaultPixelRatio((value) => !value)
                        }
                      >
                        <Paragraph>Device Pixel Ratio</Paragraph>
                      </Button>
                      <Button
                        variant={meshQuality === 1 ? "active" : "default"}
                        onClick={() =>
                          setMeshQuality((value) => (value === 1 ? 0 : 1))
                        }
                      >
                        <Paragraph>Mesh Quality {meshQuality}</Paragraph>
                      </Button>
                      <Button
                        variant={shadowsEnabled ? "active" : "default"}
                        onClick={() => setShadowsEnabled((value) => !value)}
                      >
                        <Paragraph>Shadows</Paragraph>
                      </Button>
                      <Button
                        variant={ssaoEnabled ? "active" : "default"}
                        onClick={() => setSsaoEnabled((value) => !value)}
                      >
                        <Paragraph>SSAO</Paragraph>
                      </Button>
                      <Button
                        variant={bloomEnabled ? "active" : "default"}
                        onClick={() => setBloomEnabled((value) => !value)}
                      >
                        <Paragraph>Bloom</Paragraph>
                      </Button>
                    </Space>
                    <Select
                      value={renderLayer}
                      onChange={(value) => setRenderLayer(value)}
                      options={[
                        {
                          value: "final",
                          element: <Paragraph>Final</Paragraph>,
                        },
                        {
                          value: "diffuse",
                          element: <Paragraph>Diffuse</Paragraph>,
                        },
                        {
                          value: "specular",
                          element: <Paragraph>Specular</Paragraph>,
                        },
                        {
                          value: "lighting",
                          element: <Paragraph>Lighting</Paragraph>,
                        },
                        {
                          value: "emission",
                          element: <Paragraph>Emission</Paragraph>,
                        },
                        { value: "ssao", element: <Paragraph>SSAO</Paragraph> },
                        {
                          value: "bloom",
                          element: <Paragraph>Bloom</Paragraph>,
                        },
                        {
                          value: "depth",
                          element: <Paragraph>Depth</Paragraph>,
                        },
                        {
                          value: "normals",
                          element: <Paragraph>Normals</Paragraph>,
                        },
                        {
                          value: "shadow",
                          element: <Paragraph>Shadow</Paragraph>,
                        },
                      ]}
                      placeholder={<Paragraph>Render layer</Paragraph>}
                      direction="bottom-left"
                      wide
                    />
                    <ScrollArea grow fill wide>
                      <Row gap wide>
                        <Col xs={24} md={12}>
                          <Space direction="vertical" gap wide>
                            <Paragraph>
                              Pixel ratio{" "}
                              {!useDefaultPixelRatio
                                ? pixelRatio.toFixed(2)
                                : "default"}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0.5}
                              max={2}
                              step={0.05}
                              value={pixelRatio}
                              disabled={useDefaultPixelRatio}
                              onChange={(event) =>
                                setPixelRatio(Number(event.target.value))
                              }
                            />
                            <Paragraph>Max FPS {maxFPS}</Paragraph>
                            <Input
                              type="range"
                              min={5}
                              max={60}
                              step={1}
                              value={maxFPS}
                              onChange={(event) =>
                                setMaxFPS(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow map size {shadowMapSize}
                            </Paragraph>
                            <Input
                              type="range"
                              min={256}
                              max={2048}
                              step={128}
                              value={shadowMapSize}
                              onChange={(event) =>
                                setShadowMapSize(Number(event.target.value))
                              }
                            />
                            <Paragraph>Shadow mode: {shadowMode}</Paragraph>
                            <Select
                              value={shadowMode}
                              onChange={(value) => setShadowMode(value)}
                              options={[
                                {
                                  value: "hard",
                                  element: <Paragraph>Hard</Paragraph>,
                                },
                                {
                                  value: "soft",
                                  element: <Paragraph>Soft</Paragraph>,
                                },
                              ]}
                              placeholder={<Paragraph>Shadow mode</Paragraph>}
                              direction="bottom-left"
                              wide
                            />
                            <Paragraph>
                              Shadow bias {shadowBias.toFixed(5)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={0.002}
                              step={0.00001}
                              value={shadowBias}
                              onChange={(event) =>
                                setShadowBias(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow normal bias {shadowNormalBias.toFixed(5)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={0.003}
                              step={0.00001}
                              value={shadowNormalBias}
                              onChange={(event) =>
                                setShadowNormalBias(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow softness {shadowSoftness.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={32}
                              step={0.05}
                              value={shadowSoftness}
                              onChange={(event) =>
                                setShadowSoftness(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow samples {shadowSamples}
                            </Paragraph>
                            <Input
                              type="range"
                              min={1}
                              max={25}
                              step={1}
                              value={shadowSamples}
                              onChange={(event) =>
                                setShadowSamples(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow ortho size {shadowOrthoSize.toFixed(1)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={4}
                              max={60}
                              step={0.5}
                              value={shadowOrthoSize}
                              onChange={(event) =>
                                setShadowOrthoSize(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow near {shadowNear.toFixed(1)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0.1}
                              max={20}
                              step={0.1}
                              value={shadowNear}
                              onChange={(event) =>
                                setShadowNear(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Shadow far {shadowFar.toFixed(1)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={20}
                              max={220}
                              step={1}
                              value={shadowFar}
                              onChange={(event) =>
                                setShadowFar(Number(event.target.value))
                              }
                            />
                          </Space>
                        </Col>
                        <Col xs={24} md={12}>
                          <Space direction="vertical" gap wide>
                            <Paragraph>Clear color</Paragraph>
                            <ColorField
                              value={clearColor}
                              onChange={setClearColor}
                              defaultMode="rgb"
                              alpha
                              eyeDropper={false}
                              randomize={false}
                            />
                            <VectorField
                              label={<Paragraph>Light direction</Paragraph>}
                              value={lightDirection}
                              onChange={setLightDirection}
                              layout="grid"
                              axisOptions={{
                                x: { min: -1, max: 1, step: 0.01 },
                                y: { min: -1, max: 1, step: 0.01 },
                                z: { min: -1, max: 1, step: 0.01 },
                              }}
                              showActions={false}
                            />
                            <Paragraph>Ambient color</Paragraph>
                            <ColorField
                              value={ambientColor}
                              onChange={setAmbientColor}
                              defaultMode="rgb"
                              eyeDropper={false}
                              randomize={false}
                            />
                            <Paragraph>
                              Ambient intensity {ambientIntensity.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={1.25}
                              step={0.01}
                              value={ambientIntensity}
                              onChange={(event) =>
                                setAmbientIntensity(Number(event.target.value))
                              }
                            />
                            <Paragraph>Rim color</Paragraph>
                            <ColorField
                              value={rimColor}
                              onChange={setRimColor}
                              defaultMode="rgb"
                              eyeDropper={false}
                              randomize={false}
                            />
                            <Paragraph>
                              Rim intensity {rimIntensity.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={rimIntensity}
                              onChange={(event) =>
                                setRimIntensity(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Rim power {rimPower.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0.1}
                              max={8}
                              step={0.05}
                              value={rimPower}
                              onChange={(event) =>
                                setRimPower(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              SSAO radius {ssaoRadius.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={1.2}
                              step={0.01}
                              value={ssaoRadius}
                              onChange={(event) =>
                                setSsaoRadius(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              SSAO intensity {ssaoIntensity.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={ssaoIntensity}
                              onChange={(event) =>
                                setSsaoIntensity(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              SSAO bias {ssaoBias.toFixed(3)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={1}
                              step={0.005}
                              value={ssaoBias}
                              onChange={(event) =>
                                setSsaoBias(Number(event.target.value))
                              }
                            />
                            <Paragraph>SSAO samples {ssaoSamples}</Paragraph>
                            <Input
                              type="range"
                              min={1}
                              max={32}
                              step={1}
                              value={ssaoSamples}
                              onChange={(event) =>
                                setSsaoSamples(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Bloom threshold {bloomThreshold.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={bloomThreshold}
                              onChange={(event) =>
                                setBloomThreshold(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Bloom intensity {bloomIntensity.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={2}
                              step={0.01}
                              value={bloomIntensity}
                              onChange={(event) =>
                                setBloomIntensity(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Bloom radius {bloomRadius.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={3}
                              step={0.05}
                              value={bloomRadius}
                              onChange={(event) =>
                                setBloomRadius(Number(event.target.value))
                              }
                            />
                            <Paragraph>
                              Emission strength {emissionStrength.toFixed(2)}
                            </Paragraph>
                            <Input
                              type="range"
                              min={0}
                              max={2}
                              step={0.01}
                              value={emissionStrength}
                              onChange={(event) =>
                                setEmissionStrength(Number(event.target.value))
                              }
                            />
                          </Space>
                        </Col>
                      </Row>
                    </ScrollArea>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} lg={13}>
                <Card pad wide fill>
                  <Space direction="vertical" gap wide fill align="stretch">
                    <Title size="small">Cornell Room Preview</Title>
                    <Content grow fill wide>
                      <GLRenderer
                        mesh={mesh}
                        autoRotate={false}
                        grow
                        fill
                        cameraDistance={4.8}
                        camera={{
                          from: [0, -8.5, 0],
                          to: [0, 0, 0],
                          up: [0, 0, 1],
                          fov: 0.6,
                        }}
                        rendering={{
                          pixelRatio: useDefaultPixelRatio
                            ? "default"
                            : pixelRatio,
                          maxFPS,
                          shadowMapSize,
                          meshQuality,
                          clearColor: [
                            clearColor.r,
                            clearColor.g,
                            clearColor.b,
                            clearColor.a ?? 1,
                          ],
                          lightDirection: [
                            lightDirection.x,
                            lightDirection.y,
                            lightDirection.z ?? 0,
                          ],
                          shadowsEnabled,
                          shadowMode,
                          shadowBias,
                          shadowNormalBias,
                          shadowSoftness,
                          shadowSamples,
                          shadowOrthoSize,
                          shadowNear,
                          shadowFar,
                          renderLayer,
                          ssaoEnabled,
                          ssaoRadius,
                          ssaoIntensity,
                          ssaoBias,
                          ssaoSamples,
                          bloomEnabled,
                          bloomThreshold,
                          bloomIntensity,
                          bloomRadius,
                          ambientColor: [
                            ambientColor.r,
                            ambientColor.g,
                            ambientColor.b,
                          ],
                          ambientIntensity,
                          rimColor: [rimColor.r, rimColor.g, rimColor.b],
                          rimIntensity,
                          rimPower,
                          emissionStrength,
                        }}
                      />
                    </Content>
                  </Space>
                </Card>
              </Col>
            </Row>
          </Content>
        </Page>
      </GLContextProvider>
    );
  },
};
