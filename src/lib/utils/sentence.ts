import type { Action } from "svelte/action";

/* Words moving between lines */
const wrap = {
  duration: 300,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
};

/* Words shifting when a widget expands or contracts */
const move = {
  duration: 400,
  easing: "cubic-bezier(0.34, 1.85, 0.64, 1)",
};

type Piece = {
  left: number;
  top: number;
  width: number;
  height: number;
  text: string;
  clone: HTMLElement;
};

export const sentenceLayout: Action<HTMLElement> = (root) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let previous = new Map<HTMLElement, Piece>();
  const animations = new Map<HTMLElement, Animation>();
  const ghosts = new Set<HTMLElement>();
  const observed = new Set<HTMLElement>();

  let frame = 0;
  let destroyed = false;

  function play(
    node: HTMLElement,
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
  ) {
    animations.get(node)?.cancel();

    const animation = node.animate(keyframes, options);
    animations.set(node, animation);

    const cleanup = () => {
      if (animations.get(node) !== animation) return;

      animations.delete(node);

      if (ghosts.delete(node)) {
        node.remove();
      }
    };

    animation.onfinish = cleanup;
    animation.oncancel = cleanup;
  }

  function schedule() {
    if (!frame && !destroyed) {
      frame = requestAnimationFrame(update);
    }
  }

  /*
   * ResizeObserver runs before paint. Updating here avoids showing
   * the new layout for a frame before applying the animation.
   */
  const resizeObserver = new ResizeObserver(() => update());

  function update() {
    cancelAnimationFrame(frame);
    frame = 0;

    if (destroyed) return;

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sentence-piece]"),
    );
    const present = new Set(nodes);
    const current = new Map<HTMLElement, Piece>();

    /*
     * Offset measurements ignore transforms, so running animations
     * don't have to be cancelled to measure the target layout.
     * The positioned .sentence is the widgets' offset parent.
     */
    for (const node of nodes) {
      current.set(node, {
        left: node.offsetLeft,
        top: node.offsetTop,
        width: node.offsetWidth,
        height: node.offsetHeight,
        text: node.textContent ?? "",
        clone: node.cloneNode(true) as HTMLElement,
      });

      if (!observed.has(node)) {
        observed.add(node);

        // Padding changes the border box, not the content box.
        resizeObserver.observe(node, { box: "border-box" });
      }
    }

    for (const node of observed) {
      if (!present.has(node)) {
        resizeObserver.unobserve(node);
        observed.delete(node);
      }
    }

    if (!reducedMotion.matches) {
      for (const [node, next] of current) {
        const old = previous.get(node);

        if (!old) {
          play(
            node,
            [
              { opacity: 0, transform: "translateY(.16em)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 300, easing: wrap.easing },
          );
          continue;
        }

        /*
         * Follow the horizontal centre, not just the left edge.
         * Symmetric padding changes shouldn't make the expanding
         * widget's own label jump sideways.
         */
        const dx = old.left + old.width / 2 - (next.left + next.width / 2);
        const dy = old.top - next.top;
        const changed = old.text !== next.text;

        // Leave an existing animation alone if its target is unchanged.
        if (dx === 0 && dy === 0 && !changed) continue;

        const style = getComputedStyle(node);
        const matrix =
          style.transform === "none"
            ? new DOMMatrixReadOnly()
            : new DOMMatrixReadOnly(style.transform);

        const opacity = Number(style.opacity);

        play(
          node,
          [
            {
              transform: `translate(${dx + matrix.m41}px, ${dy + matrix.m42}px)`,
              opacity: changed ? Math.min(opacity, 0.35) : opacity,
            },
            {
              transform: "translate(0, 0)",
              opacity: 1,
            },
          ],
          dy !== 0 ? wrap : move,
        );
      }
    }

    for (const [node, old] of previous) {
      if (present.has(node)) continue;

      animations.get(node)?.cancel();
      animations.delete(node);

      if (reducedMotion.matches) continue;

      // Departing words no longer occupy space in the sentence.
      const ghost = old.clone;
      ghost.setAttribute("data-sentence-ghost", "");
      ghost.inert = true;
      ghost.setAttribute("aria-hidden", "true");

      ghost.removeAttribute("data-sentence-piece");
      ghost.removeAttribute("id");

      ghost.querySelectorAll("[id], [data-sentence-piece]").forEach((child) => {
        child.removeAttribute("id");
        child.removeAttribute("data-sentence-piece");
      });

      Object.assign(ghost.style, {
        position: "absolute",
        left: `${old.left}px`,
        top: `${old.top}px`,
        width: `${old.width}px`,
        height: `${old.height}px`,
        boxSizing: "border-box",
        margin: "0",
        pointerEvents: "none",
      });

      root.appendChild(ghost);
      ghosts.add(ghost);

      play(
        ghost,
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(-.12em)" },
        ],
        {
          duration: 160,
          easing: "ease-out",
        },
      );
    }

    previous = current;
  }

  function isGhost(node: Node) {
    const element = node instanceof Element ? node : node.parentElement;

    return !!element?.closest("[data-sentence-ghost]");
  }

  const mutationObserver = new MutationObserver((records) => {
    // Our exit clones must not trigger another layout update.
    const relevant = records.some((record) => {
      if (isGhost(record.target)) return false;

      if (record.type === "childList") {
        return [...record.addedNodes, ...record.removedNodes].some(
          (node) => !isGhost(node),
        );
      }

      return true;
    });

    if (relevant) schedule();
  });

  mutationObserver.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  resizeObserver.observe(root, { box: "border-box" });

  function clearAnimations() {
    for (const animation of animations.values()) {
      animation.cancel();
    }
    animations.clear();

    for (const ghost of ghosts) {
      ghost.remove();
    }
    ghosts.clear();
  }

  function motionChanged() {
    clearAnimations();
    schedule();
  }

  reducedMotion.addEventListener("change", motionChanged);
  schedule();

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);

      mutationObserver.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", motionChanged);

      clearAnimations();
      previous.clear();
      observed.clear();
    },
  };
};
