import {
  ConsoleLifeCycle,
  LightConsole,
  ConsoleLifeCyclePointCuts,
} from './type';

export function capitalize<T extends string = string>(
  originString: T,
): Capitalize<T> {
  const newString = originString;

  if (originString.length <= 0) return newString as Capitalize<T>;

  return (newString.charAt(0).toUpperCase() +
    newString.slice(1)) as Capitalize<T>;
}

/**
 * Check a object whether is empty.
 */
export function isEmptyObject(o: unknown) {
  if (o === undefined) {
    return true;
  }

  if (typeof o !== 'object') {
    throw new Error('');
  }

  if (o === null) {
    return true;
  }

  return Object.keys(o).length <= 0;
}

/**
 * Add life cycle hooks for every method by AOP.
 * @param target
 * @param hooks [function interceptXxx(){}..., function afterXxx(){}, ..., function beforeXxx(){}, ...]
 */
export function addLifeCycleHooks(
  target: LightConsole,
  hooks: ConsoleLifeCycle,
) {
  // Shadow clone target.
  const targetWithHooks = { ...target };
  Object.setPrototypeOf(targetWithHooks, Object.getPrototypeOf(target));

  if (!hooks || Object.keys(hooks).length <= 0) return targetWithHooks;

  // Collect all methods need to trigger hook
  const methods: Array<keyof LightConsole> = [];
  for (const hookName of Object.keys(hooks) as Array<keyof LightConsole>) {
    methods.push(
      hookName
        .replace(ConsoleLifeCyclePointCuts.intercept, '')
        .replace(ConsoleLifeCyclePointCuts.before, '')
        .replace(ConsoleLifeCyclePointCuts.after, '')
        .toLowerCase() as keyof LightConsole,
    );
  }

  // Attach the life cycle hooks.
  for (const funcName of methods) {
    const interceptHook =
      hooks[`${ConsoleLifeCyclePointCuts.intercept}${capitalize(funcName)}`];

    const beforeHook =
      hooks[`${ConsoleLifeCyclePointCuts.before}${capitalize(funcName)}`];

    const afterHook =
      hooks[`${ConsoleLifeCyclePointCuts.after}${capitalize(funcName)}`];

    targetWithHooks[funcName] = (...data: any[]) => {
      if (interceptHook && interceptHook()) {
        return targetWithHooks;
      }

      beforeHook && beforeHook();

      target[funcName].apply(target, data);

      afterHook && afterHook();

      return targetWithHooks;
    };
  }

  return targetWithHooks;
}
