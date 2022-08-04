import {
  BatchBeforeOrAfterHook,
  BatchHook,
  BatchInterceptHook,
  ConsoleLifeCycle,
  LightConsole,
  PointCut,
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
    throw new Error(`${o} isn't an object.`);
  }

  if (o === null) {
    return true;
  }

  return Object.keys(o).length <= 0;
}

/**
 * Add life cycle hooks for every method by AOP.
 * @param target
 * @param hooks [function interceptXxx(){}..., function afterXxx(){}, ..., function beforeXxx(){}, ..., function batchInterceptXxx(){},..., function batchXxxXxx(){},...]
 */
export function addLifeCycleHooks(
  target: LightConsole,
  hooks: ConsoleLifeCycle,
) {
  // Shadow clone target.
  const targetWithHooks = { ...target };
  Object.setPrototypeOf(targetWithHooks, Object.getPrototypeOf(target));

  if (!hooks || Object.keys(hooks).length <= 0) return targetWithHooks;

  // Iterate all method to attach hooks.
  for (const methodName of Object.keys(Object.getPrototypeOf(target)) as Array<keyof LightConsole>) {
    const interceptHooks: Array<BatchInterceptHook> = [];
    const beforeHooks: Array<BatchBeforeOrAfterHook> = [];
    const afterHooks: Array<BatchBeforeOrAfterHook> = [];

    // Decompose batch hooks.
    const { batchIntercept, batchBefore, batchAfter } = hooks;
    const passBatchIntercept = executeRule(batchIntercept, methodName);
    const passBatchBefore = executeRule(batchBefore, methodName);
    const passBatchAfter = executeRule(batchAfter, methodName);
    if (passBatchIntercept) {
      interceptHooks.push(passBatchIntercept.batchInterceptHook);
    }
    if (passBatchBefore) {
      beforeHooks.push(passBatchBefore.batchBeforeHook);
    }
    if (passBatchAfter) {
      afterHooks.push(passBatchAfter.batchAfterHook);
    }

    // Decompose intercept, before, after hooks.
    if (hooks[`${PointCut.intercept}${capitalize(methodName)}`] !== undefined) {
      interceptHooks.push(
        hooks[`${PointCut.intercept}${capitalize(methodName)}`]!,
      );
    }
    if (hooks[`${PointCut.before}${capitalize(methodName)}`] !== undefined) {
      beforeHooks.push(hooks[`${PointCut.before}${capitalize(methodName)}`]!);
    }
    if (hooks[`${PointCut.after}${capitalize(methodName)}`] !== undefined) {
      afterHooks.push(hooks[`${PointCut.after}${capitalize(methodName)}`]!);
    }

    // Attach hook to each lifecycle.
    targetWithHooks[methodName] = (...data: any[]) => {
      if (interceptHooks && interceptHooks.some((hook) => hook())) {
        return targetWithHooks;
      }

      beforeHooks && beforeHooks.map((hook) => hook());

      target[methodName].apply(target, data);

      afterHooks && afterHooks.map((hook) => hook());

      return targetWithHooks;
    };
  }

  return targetWithHooks;
}

function executeRule<
  H extends
    | BatchHook[PointCut.batchIntercept]
    | BatchHook[PointCut.batchBefore]
    | BatchHook[PointCut.batchAfter],
>(oneOfBatchHook: H, methodName: keyof LightConsole): H | undefined {
  if (oneOfBatchHook) {
    // Conditional attach batch hooks according to rules.
    if ('include' in oneOfBatchHook && 'exclude' in oneOfBatchHook) {
      throw Error('Not allow exist include and exclude rule at the same time.');
    } else if ('include' in oneOfBatchHook) {
      // methodName should in the include rule
      if (oneOfBatchHook.include && oneOfBatchHook.include.length > 0) {
        if (oneOfBatchHook.include.includes(methodName)) {
          return oneOfBatchHook;
        }
      }
    } else if ('exclude' in oneOfBatchHook) {
      // methodName should not in the exclude rule
      if (oneOfBatchHook.exclude && oneOfBatchHook.exclude.length > 0) {
        if (!oneOfBatchHook.exclude.includes(methodName)) {
          return oneOfBatchHook;
        }
      }
    } else {
      // Default to include if there no any rules setting.
      return oneOfBatchHook;
    }
  }
}
