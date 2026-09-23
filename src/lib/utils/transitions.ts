import { backOut, cubicOut, quintIn, quintOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";

type Easing = (t: number) => number;

export interface TextTransitionOptions {
  delay?: number;
  duration?: number;
  easing?: Easing;

  /** Compatibility with your existing API; useful for out: transitions. */
  reverse?: boolean;

  /** Blur radius in pixels. */
  blur?: number;

  /** Vertical offset in em, so movement follows the text size. */
  y?: number;

  /** Starting scale. */
  scale?: number;
}

interface Frame {
  opacity: number;
  blur?: number;
  y?: number;
  scale?: number;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Opacity finishes before the movement, keeping text feeling responsive. */
function appear(t: number) {
  return clamp(t * 1.5);
}

function createTransition(
  node: HTMLElement,
  options: TextTransitionOptions,
  defaults: { duration: number; easing: Easing },
  frame: (t: number, u: number) => Frame,
): TransitionConfig {
  const view = node.ownerDocument.defaultView;

  if (!view) return { duration: 0 };

  const style = view.getComputedStyle(node);
  const originalOpacity = Number.parseFloat(style.opacity);
  const originalTransform = style.transform === "none" ? "" : style.transform;
  const originalFilter = style.filter === "none" ? "" : style.filter;

  const reducedMotion = view.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (reducedMotion) {
    return { delay: 0, duration: 0 };
  }

  return {
    delay: options.delay ?? 0,
    duration: options.duration ?? defaults.duration,
    easing: options.easing ?? (options.reverse ? quintIn : defaults.easing),

    css: (t) => {
      const value = frame(t, 1 - t);

      const transforms = [
        originalTransform,
        value.y !== undefined ? `translateY(${value.y}em)` : "",
        value.scale !== undefined ? `scale(${value.scale})` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const filters = [
        originalFilter,
        value.blur !== undefined ? `blur(${Math.max(0, value.blur)}px)` : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        opacity: ${originalOpacity * clamp(value.opacity)};
        ${transforms ? `transform: ${transforms};` : ""}
        ${filters ? `filter: ${filters};` : ""}
      `;
    },
  };
}

/**
 * A quiet focus-in without changing position.
 * Good for changing labels or secondary information.
 */
export function blur(
  node: HTMLElement,
  options: TextTransitionOptions = {},
): TransitionConfig {
  return createTransition(
    node,
    options,
    { duration: 160, easing: cubicOut },
    (t, u) => ({
      opacity: t,
      blur: (options.blur ?? 3) * u,
    }),
  );
}

/**
 * A small upward arrival with blur clearing early.
 * The default choice for individual words.
 */
export function reveal(
  node: HTMLElement,
  options: TextTransitionOptions = {},
): TransitionConfig {
  return createTransition(
    node,
    options,
    { duration: 220, easing: quintOut },
    (t, u) => ({
      opacity: appear(t),
      y: (options.y ?? 0.16) * u,
      blur: (options.blur ?? 4) * u * u,
    }),
  );
}

/**
 * A restrained spring-like arrival.
 * Only scale overshoots; opacity and blur stay bounded.
 */
export function settle(
  node: HTMLElement,
  options: TextTransitionOptions = {},
): TransitionConfig {
  const startScale = options.scale ?? 0.96;

  return createTransition(
    node,
    options,
    { duration: 280, easing: cubicOut },
    (t, u) => ({
      opacity: appear(t),
      y: (options.y ?? 0.08) * u,
      scale: startScale + (1 - startScale) * backOut(t),
      blur: (options.blur ?? 2) * u * u,
    }),
  );
}

/**
 * Intended for out:dismiss.
 * Leaves quickly, without competing with arriving content.
 */
export function dismiss(
  node: HTMLElement,
  options: TextTransitionOptions = {},
): TransitionConfig {
  return createTransition(
    node,
    options,
    { duration: 120, easing: cubicOut },
    (t, u) => ({
      opacity: t,
      y: (options.y ?? -0.08) * u,
      blur: (options.blur ?? 2) * u,
    }),
  );
}

export function springSettle(
  node: HTMLElement,
  options: TextTransitionOptions = {},
): TransitionConfig {
  const startScale = options.scale ?? 0.9;

  return createTransition(
    node,
    options,
    { duration: 380, easing: (t) => t },
    (t, u) => {
      // Damped oscillation; the envelope reaches exactly zero at the end.
      const spring = 1 - Math.exp(-5 * t) * Math.cos(3 * Math.PI * t) * u;

      return {
        opacity: clamp(t * 5),
        y: (options.y ?? 0.12) * (1 - spring),
        scale: startScale + (1 - startScale) * spring,
        blur: (options.blur ?? 2) * Math.pow(1 - clamp(t * 3), 2),
      };
    },
  );
}
