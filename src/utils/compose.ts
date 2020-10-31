export type ComposeResult<T> = T | Promise<T>;

export enum ComposeDirection {
  LEFT_TO_RIGHT = true,
  RIGHT_TO_LEFT = false
}

export interface ComposePlugin<R, T> {
  (next: () => ComposeResult<R>, arg: T): ComposeResult<R>;
}

export interface ComposeInstance<R, T> {
  add(...newPlugins: ComposePlugin<R, T>[]): ComposeInstance<R, T>;
  exec(options: T): ComposeResult<R>;
}

const ComposeFunc = <R, T>(
  direction: ComposeDirection,
  defaultAction: (options: T) => ComposeResult<R>,
  plugins: ComposePlugin<R, T>[]
): ComposeInstance<R, T> => ({
  add(...newPlugins) {
    return ComposeFunc(direction, defaultAction, [...plugins, ...newPlugins]);
  },
  exec(options) {
    const method =
      direction === ComposeDirection.LEFT_TO_RIGHT
        ? plugins.reduceRight
        : plugins.reduce;
    const func = method.call(
      plugins,
      (acc, x) => () => x(acc, options),
      () => defaultAction(options)
    ) as () => ComposeResult<R>;

    return func();
  }
});

export const compose: ComposeInstance<R, T> = <R, T>(
  defaultAction: (options: T) => ComposeResult<R>,
  ...plugins: ComposePlugin<R, T>[]
) => ComposeFunc<R, T>(ComposeDirection.LEFT_TO_RIGHT, defaultAction, plugins);
export const composeRight: ComposeInstance<R, T> = <R, T>(
  defaultAction: (options: T) => ComposeResult<R>,
  ...plugins: ComposePlugin<R, T>[]
) => ComposeFunc(ComposeDirection.RIGHT_TO_LEFT, defaultAction, plugins);

export default ComposeFunc;
