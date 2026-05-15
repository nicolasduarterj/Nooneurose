// Route-tree transformer
// ---------------------------------------------------------------------------
 
// `as const` makes all values readonly, so we need to accept readonly trees.
type RouteValue = string | RouteTree;
type RouteTree = { readonly [key: string]: RouteValue };
 
// Every value in the tree — string or nested object — becomes () => string.
// Nested objects are recursed into; strings become () => string.
type TransformedRoutes<T extends RouteTree> = {
  readonly [K in keyof T]: T[K] extends RouteTree
    ? TransformedRoutes<T[K]>
    : () => string;
};
 
/**
 * Recursively transform a route tree into callable path functions.
 * Each function returns the fully-resolved absolute path.
 *
 * - `_` keys define the prefix for their level and are callable themselves.
 * - String leaves return prefix + their own segment.
 * - Object nodes are recursed into, passing the accumulated prefix down.
 *
 * @param tree   - The raw route-tree object (use `as const` at the call site).
 * @param prefix - Accumulated path prefix from ancestor `_` segments.
 */
export default function transformPaths<T extends RouteTree>(
  tree: T,
  prefix: string = ""
): TransformedRoutes<T> {
  const localSegment = typeof tree._ === "string" ? tree._ : "";
  const currentPrefix = prefix + localSegment;
 
  const result: Record<string, unknown> = {};
 
  for (const key of Object.keys(tree) as (keyof T & string)[]) {
    const value = tree[key];
 
    if (key === "_") {
      result[key] = () => currentPrefix;
    } else if (typeof value === "string") {
      result[key] = () => currentPrefix + value;
    } else if (typeof value === "object" && value !== null) {
      result[key] = transformPaths(value, currentPrefix);
    }
  }
 
  return result as TransformedRoutes<T>;
}
 
