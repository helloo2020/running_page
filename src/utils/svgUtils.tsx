import { ComponentType, useLayoutEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

type SvgComponent = {
  default: ComponentType<any>;
};

const FailedLoadSvg = () => {
  console.log('Failed to load SVG component');
  return <div></div>;
};

export const loadSvgComponent = async (
  stats: Record<string, () => Promise<unknown>>,
  path: string
): Promise<SvgComponent> => {
  try {
    const module = await stats[path]();
    const Svg = module as ComponentType<any>;
    const ThemedSvg = (props: Record<string, unknown>) => {
      const ref = useRef<HTMLDivElement>(null);
      const { theme } = useTheme();
      useLayoutEffect(() => {
        const root = ref.current;
        if (!root) return;
        const colors = getComputedStyle(document.documentElement);
        const mappings: Record<string, string> = {
          '#e1ed5e': colors.getPropertyValue('--accent').trim(),
          '#444444': colors.getPropertyValue('--border').trim(),
          gray: colors.getPropertyValue('--muted').trim(),
          '#e0ed5e': colors.getPropertyValue('--accent').trim(),
          '#d8ff5f': colors.getPropertyValue('--accent').trim(),
          '#222': colors.getPropertyValue('--page').trim(),
          '#444': colors.getPropertyValue('--border').trim(),
          '#222222': colors.getPropertyValue('--page').trim(),
          '#1a1a1a': colors.getPropertyValue('--page').trim(),
          '#cccccc': colors.getPropertyValue('--muted').trim(),
          '#ffffff': colors.getPropertyValue('--ink').trim(),
          '#fff': colors.getPropertyValue('--ink').trim(),
        };
        root
          .querySelectorAll<SVGElement>('[fill], [stroke]')
          .forEach((node) => {
            for (const attr of ['fill', 'stroke']) {
              const key = 'data-original-' + attr;
              const original =
                node.getAttribute(key) ?? node.getAttribute(attr);
              if (!original) continue;
              node.setAttribute(key, original);
              const replacement = mappings[original.toLowerCase()];
              if (replacement) node.setAttribute(attr, replacement);
            }
          });
      }, [theme]);
      return (
        <div ref={ref} style={{ display: 'contents' }}>
          <Svg {...props} />
        </div>
      );
    };
    return { default: ThemedSvg };
  } catch (error) {
    console.error(error);
    return { default: FailedLoadSvg };
  }
};
