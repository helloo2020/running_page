import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MapView, {
  MapRef,
  Source,
  Layer,
  Marker,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl/maplibre';
import { useTheme } from '@/hooks/useTheme';
import { getMapPalette } from '@/utils/mapPalette';
import { Coordinate, geoJsonForMap } from '@/utils/utils';
import { LogEntry } from '@/utils/activityLog';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../RunMap/mapbox.css';

const geography = geoJsonForMap();
// Bound each GPU line segment without discarding GPS points. Adjacent chunks
// share their endpoint, keeping the visible path continuous at every zoom.
const routeFeatures = (entry: LogEntry) => {
  const features = [];
  for (let start = 0; start < entry.points.length - 1; start += 1999) {
    features.push({
      type: 'Feature' as const,
      properties: { id: entry.id },
      geometry: {
        type: 'LineString' as const,
        coordinates: entry.points.slice(start, start + 2000),
      },
    });
  }
  return features;
};
export default function LogMap({
  entries,
  selected,
  onPlace,
  showRoutes,
  onRoute,
}: {
  entries: LogEntry[];
  selected?: LogEntry;
  onPlace: (_place: string) => void;
  showRoutes: boolean;
  onRoute: (_id: string) => void;
}) {
  const ref = useRef<MapRef>(null);
  const [, setViewport] = useState({ zoom: 2, width: 0 });
  const [ready, setReady] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setReady(false), [theme]);
  const mapColors = getMapPalette(theme);
  const rankedPlaces = useMemo(() => {
    const result = new Map<
      string,
      { key: string; label: string; point: Coordinate | null; count: number }
    >();
    (selected ? [selected] : entries).forEach((entry) => {
      const previous = result.get(entry.placeKey);
      if (previous) {
        previous.count++;
        previous.point ||= entry.center;
      } else
        result.set(entry.placeKey, {
          key: entry.placeKey,
          label: entry.place,
          point: entry.center,
          count: 1,
        });
    });
    return [...result.values()].sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label, 'zh-CN')
    );
  }, [entries, selected]);
  const places = useMemo(
    () =>
      rankedPlaces.filter(
        (place): place is typeof place & { point: Coordinate } =>
          place.point !== null
      ),
    [rankedPlaces]
  );
  const routes = useMemo(
    () => entries.filter((entry) => entry.hasRoute),
    [entries]
  );
  const routeData = useMemo(
    () => ({
      type: 'FeatureCollection' as const,
      features: routes.flatMap(routeFeatures),
    }),
    [routes]
  );
  const selectedData = useMemo(
    () =>
      selected?.hasRoute
        ? {
            type: 'FeatureCollection' as const,
            features: routeFeatures(selected),
          }
        : null,
    [selected]
  );
  const routeBounds = useMemo(() => {
    let west = Infinity,
      south = Infinity,
      east = -Infinity,
      north = -Infinity;
    for (const feature of routeData.features) {
      for (const [lng, lat] of feature.geometry.coordinates) {
        west = Math.min(west, lng);
        east = Math.max(east, lng);
        south = Math.min(south, lat);
        north = Math.max(north, lat);
      }
    }
    return routeData.features.length
      ? ([
          [west, south],
          [east, north],
        ] as [Coordinate, Coordinate])
      : null;
  }, [routeData]);
  // Group nearby labels in screen space so narrow maps remain readable.
  const clusters: {
    point: Coordinate;
    count: number;
    places: typeof places;
    x: number;
    y: number;
  }[] = [];
  places.forEach((place) => {
    const pixel = ref.current?.project(place.point);
    const group =
      pixel &&
      clusters.find(
        (item) => Math.hypot(item.x - pixel.x, item.y - pixel.y) < 44
      );
    if (group) {
      group.places.push(place);
      group.count += place.count;
    } else
      clusters.push({
        point: place.point,
        count: place.count,
        places: [place],
        x: pixel?.x ?? 0,
        y: pixel?.y ?? 0,
      });
  });
  const fit = useCallback(() => {
    const map = ref.current;
    if (!map) return;
    if (showRoutes && !selected) {
      if (routeBounds)
        map.fitBounds(routeBounds, { padding: 40, maxZoom: 13, duration: 0 });
      else map.jumpTo({ center: [0, 20], zoom: 0 });
      return;
    }
    const points = selected?.hasRoute
      ? selected.points
      : selected?.center
        ? [selected.center]
        : places.map((place) => place.point);
    if (!points.length) {
      map.jumpTo({ center: [105, 30], zoom: 2 });
      return;
    }
    const lngs = points.map((point) => point[0]);
    const lats = points.map((point) => point[1]);
    const west = Math.min(...lngs),
      east = Math.max(...lngs),
      south = Math.min(...lats),
      north = Math.max(...lats);
    if (west === east && south === north)
      map.jumpTo({ center: points[0], zoom: selected ? 9 : 6 });
    else
      map.fitBounds(
        [
          [west, south],
          [east, north],
        ],
        { padding: 55, maxZoom: selected ? 16 : 6, duration: 0 }
      );
  }, [places, selected, showRoutes, routeBounds]);
  useEffect(fit, [fit]);
  const style = useMemo(
    () => ({
      version: 8 as const,
      sources: {},
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
  return (
    <>
      <div
        className="log-map-canvas"
        style={{ backgroundColor: mapColors.background }}
        data-route-count={showRoutes && !selected ? routes.length : undefined}
        aria-label={
          selected
            ? `${selected.date} ${selected.place} 路线图`
            : showRoutes
              ? `当前筛选的 ${routes.length} 条跑步轨迹叠加地图`
              : '当前筛选的跑步地点分布'
        }
      >
        <MapView
          ref={ref}
          initialViewState={{ longitude: 105, latitude: 30, zoom: 2 }}
          onLoad={fit}
          onIdle={() => setReady(true)}
          onMove={(event) =>
            setViewport({
              zoom: event.viewState.zoom,
              width: ref.current?.getCanvas().clientWidth || 0,
            })
          }
          onResize={() => {
            fit();
            setViewport({
              zoom: ref.current?.getZoom() || 2,
              width: ref.current?.getCanvas().clientWidth || 0,
            });
          }}
          mapStyle={style}
          renderWorldCopies={false}
          minZoom={-2}
          interactiveLayerIds={
            showRoutes && !selected ? ['log-overview-routes'] : []
          }
          onClick={(event) => {
            const id = event.features?.[0]?.properties?.id;
            if (id) onRoute(String(id));
          }}
          maxZoom={18}
          scrollZoom={false}
          style={{ width: '100%', height: '100%' }}
          locale={{
            'NavigationControl.ZoomIn': '放大地图',
            'NavigationControl.ZoomOut': '缩小地图',
          }}
        >
          <Source id="log-geography" type="geojson" data={geography}>
            <Layer
              id="log-land"
              type="fill"
              paint={{ 'fill-color': mapColors.land }}
            />
            <Layer
              id="log-boundaries"
              type="line"
              paint={{
                'line-color': mapColors.border,
                'line-width': 0.65,
              }}
            />
          </Source>
          {showRoutes && !selected && (
            <Source
              id="log-overview"
              type="geojson"
              data={routeData}
              tolerance={0}
            >
              <Layer
                id="log-overview-halo"
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                  'line-color': mapColors.halo,
                  'line-width': 4,
                  'line-opacity': 0.65,
                }}
              />
              <Layer
                id="log-overview-routes"
                type="line"
                layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                paint={{
                  'line-color': mapColors.route,
                  'line-width': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    0,
                    2.5,
                    10,
                    1.8,
                    15,
                    3,
                  ],
                  'line-opacity': 1,
                }}
              />
            </Source>
          )}
          {selected?.hasRoute ? (
            <>
              <Source id="log-route" type="geojson" data={selectedData!}>
                <Layer
                  id="log-route-halo"
                  type="line"
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                  paint={{
                    'line-color': mapColors.halo,
                    'line-width': 6,
                  }}
                />
                <Layer
                  id="log-route-line"
                  type="line"
                  layout={{ 'line-cap': 'round', 'line-join': 'round' }}
                  paint={{
                    'line-color': mapColors.route,
                    'line-width': 3,
                  }}
                />
              </Source>
              <Marker
                longitude={selected.points[0][0]}
                latitude={selected.points[0][1]}
              >
                <span className="log-route-endpoint">起</span>
              </Marker>
              <Marker
                longitude={selected.points[selected.points.length - 1][0]}
                latitude={selected.points[selected.points.length - 1][1]}
              >
                <span className="log-route-endpoint is-end">终</span>
              </Marker>
            </>
          ) : !showRoutes || selected ? (
            clusters.map((group) => (
              <Marker
                key={group.places.map((item) => item.key).join('|')}
                longitude={group.point[0]}
                latitude={group.point[1]}
              >
                <button
                  className="log-place-marker"
                  type="button"
                  onClick={() => {
                    if (group.places.length === 1) onPlace(group.places[0].key);
                    else
                      ref.current?.easeTo({
                        center: group.point,
                        zoom: (ref.current.getZoom() || 2) + 2,
                        duration: window.matchMedia(
                          '(prefers-reduced-motion: reduce)'
                        ).matches
                          ? 0
                          : 300,
                      });
                  }}
                  aria-label={
                    group.places.length === 1
                      ? `${group.places[0].label}，${group.count} 次活动，筛选此地点`
                      : `${group.places.length} 个地点，${group.count} 次活动，放大查看`
                  }
                >
                  <b>{group.count}</b>
                  <span>
                    {group.places.length === 1
                      ? group.places[0].label
                      : group.places.length + ' 个地点'}
                  </span>
                </button>
              </Marker>
            ))
          ) : null}
          <NavigationControl showCompass={false} position="bottom-right" />
          <ScaleControl position="bottom-left" unit="metric" />
        </MapView>
        {!ready && (
          <p className="log-map-empty" role="status">
            正在加载地图…
          </p>
        )}
        {ready &&
          (showRoutes && !selected
            ? !routeData.features.length
            : !places.length && !selected?.hasRoute) && (
            <p className="log-map-empty">
              {entries.length
                ? showRoutes
                  ? '这些记录暂无 GPS 轨迹，可在下方查看清单'
                  : '这些记录暂无可显示的位置信息'
                : '没有符合条件的记录'}
            </p>
          )}
        {selected && (
          <span className="log-map-label">
            {selected.place} ·{' '}
            {selected.hasRoute ? '单次路线轮廓' : '暂无路线轨迹'}
          </span>
        )}
      </div>
      {!selected && rankedPlaces.length > 0 && (
        <div
          className="log-place-list"
          role="group"
          aria-label="地点按记录次数排序"
        >
          {rankedPlaces.map((place) => (
            <button key={place.key} onClick={() => onPlace(place.key)}>
              {place.label}
              <span>{place.count} 次</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
