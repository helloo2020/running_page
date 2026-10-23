import { useTheme } from '@/hooks/useTheme';
import { getMapPalette } from '@/utils/mapPalette';
import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import Map, {
  Layer,
  Source,
  FullscreenControl,
  NavigationControl,
  MapRef,
} from 'react-map-gl/maplibre';
import type { Map as MapLibreMap, FilterSpecification } from 'maplibre-gl';
import useActivities from '@/hooks/useActivities';
import {
  USE_DASH_LINE,
  LINE_OPACITY,
  PRIVACY_MODE,
  LIGHTS_ON,
} from '@/utils/const';
import { Coordinate, IViewState, geoJsonForMap } from '@/utils/utils';
import RunMarker from './RunMarker';
import styles from './style.module.css';
import { FeatureCollection } from 'geojson';
import { RPGeometry } from '@/static/run_countries';
import 'maplibre-gl/dist/maplibre-gl.css';
import './mapbox.css';
import LightsControl from '@/components/RunMap/LightsControl';

interface IRunMapProps {
  title: string;
  viewState: IViewState;
  setViewState: (_viewState: IViewState) => void;
  geoData: FeatureCollection<RPGeometry>;
}

const MAP_STYLE = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#fdfdfb',
      },
    },
  ],
} as const;

const RunMap = ({ title, viewState, setViewState, geoData }: IRunMapProps) => {
  const { theme } = useTheme();
  const mapColors = getMapPalette(theme);
  const mapStyle = useMemo(
    () => ({
      ...MAP_STYLE,
      layers: [
        {
          id: 'background',
          type: 'background' as const,
          paint: { 'background-color': mapColors.background },
        },
      ],
    }),
    [mapColors]
  );
  const { countries, provinces } = useActivities();
  const mapRef = useRef<MapRef>();
  const [lights, setLights] = useState(PRIVACY_MODE ? false : LIGHTS_ON);
  const keepWhenLightsOff = ['background', 'runs2'];
  function switchLayerVisibility(map: MapLibreMap, lights: boolean) {
    // Privacy mode already uses a local, empty base style; keep its public summary layers.
    if (PRIVACY_MODE) return;
    const styleJson = map.getStyle();
    if (!styleJson?.layers) return;
    styleJson.layers.forEach((it) => {
      if (!keepWhenLightsOff.includes(it.id)) {
        if (lights) map.setLayoutProperty(it.id, 'visibility', 'visible');
        else map.setLayoutProperty(it.id, 'visibility', 'none');
      }
    });
  }
  const mapRefCallback = useCallback(
    (ref: MapRef) => {
      if (ref !== null) {
        mapRef.current = ref;
        const map = ref.getMap();
        // all style resources have been downloaded
        // and the first visually complete rendering of the base style has occurred.
        map.on('style.load', () => {
          mapRef.current = ref;
          switchLayerVisibility(map, lights);
        });
      }
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        switchLayerVisibility(map, lights);
      }
    },
    [mapRef, lights]
  );
  const filterProvinces: FilterSpecification = ['in', 'name', ...provinces];
  const filterCountries: FilterSpecification = ['in', 'name', ...countries];

  const isBigMap = (viewState.zoom ?? 0) <= 3;

  const isSingleRun =
    geoData.features.length === 1 &&
    geoData.features[0].geometry.coordinates.length > 1;
  let startLon = 0;
  let startLat = 0;
  let endLon = 0;
  let endLat = 0;
  if (isSingleRun) {
    const points = geoData.features[0].geometry.coordinates as Coordinate[];
    [startLon, startLat] = points[0];
    [endLon, endLat] = points[points.length - 1];
  }
  let dash = USE_DASH_LINE && !isSingleRun && !isBigMap ? [2, 2] : [2, 0];
  const onMove = React.useCallback(
    ({ viewState }: { viewState: IViewState }) => {
      setViewState(viewState);
    },
    []
  );
  const style: React.CSSProperties = {
    width: '100%',
    height: 'clamp(290px, 48vw, 440px)',
    borderRadius: '8px',
    backgroundColor: mapColors.background,
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (mapRef.current) {
        mapRef.current.getMap().resize();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Map
      {...viewState}
      onMove={onMove}
      style={style}
      minZoom={-2}
      locale={{
        'NavigationControl.ZoomIn': '放大地图',
        'NavigationControl.ZoomOut': '缩小地图',
        'FullscreenControl.Enter': '全屏地图',
        'FullscreenControl.Exit': '退出全屏',
      }}
      mapStyle={mapStyle}
      renderWorldCopies={false}
      ref={mapRefCallback}
    >
      {
        <Source id="geography" type="geojson" data={geoJsonForMap()}>
          <Layer
            id="land"
            type="fill"
            paint={{ 'fill-color': mapColors.land, 'fill-opacity': 1 }}
          />
          <Layer
            id="countries"
            type="fill"
            filter={filterCountries}
            paint={{
              'fill-color': mapColors.visited,
              'fill-opacity': [
                'case',
                ['==', ['get', 'name'], '中国'],
                0.35,
                1,
              ],
            }}
          />
          <Layer
            id="province"
            type="fill"
            filter={filterProvinces}
            paint={{ 'fill-color': mapColors.visited, 'fill-opacity': 1 }}
          />
          <Layer
            id="boundaries"
            type="line"
            paint={{
              'line-color': mapColors.border,
              'line-width': 0.55,
              'line-opacity': 0.7,
            }}
            layout={{ 'line-join': 'round', 'line-cap': 'round' }}
          />
        </Source>
      }
      <Source id="data" type="geojson" data={geoData}>
        <Layer
          id="runs2"
          type="line"
          paint={{
            'line-color': [
              'case',
              ['!=', ['geometry-type'], 'LineString'],
              mapColors.border,
              ['has', 'color'],
              [
                'match',
                ['get', 'color'],
                ['rgb(224,237,94)', '#e0ed5e', '#e1ed5e'],
                mapColors.route,
                ['rgb(51,255,87)'],
                '#518ba0',
                ['rgb(255,153,51)'],
                '#b77d38',
                ['rgb(151,51,255)'],
                '#8e709d',
                ['rgb(255,51,51)'],
                '#b55e65',
                ['#000000', '#000', 'black'],
                mapColors.border,
                ['get', 'color'],
              ],
              mapColors.border,
            ],
            'line-width': isBigMap ? 1.1 : 2,
            'line-dasharray': dash,
            'line-opacity':
              isSingleRun || isBigMap || !lights ? 1 : LINE_OPACITY,
            'line-blur': 0,
          }}
          layout={{
            'line-join': 'round',
            'line-cap': 'round',
          }}
        />
      </Source>
      {isSingleRun && (
        <RunMarker
          startLat={startLat}
          startLon={startLon}
          endLat={endLat}
          endLon={endLon}
        />
      )}
      <span className={styles.runTitle}>{title}</span>
      <FullscreenControl position="top-right" />
      {!PRIVACY_MODE && <LightsControl setLights={setLights} lights={lights} />}
      <NavigationControl
        showCompass={false}
        position={'bottom-right'}
        style={{ opacity: 1 }}
      />
    </Map>
  );
};

export default RunMap;
