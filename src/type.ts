type PartialNativeConsolePropertiesName = Extract<
  keyof Console,
  'log' | 'info' | 'debug' | 'warn' | 'error' | 'time' | 'timeEnd' | 'timeLog'
>;

type PartialNativeConsole = {
  [Name in PartialNativeConsolePropertiesName]: (
    ...data: Console[Name] extends (...args: any) => any
      ? Parameters<Console[Name]>
      : any
  ) => LightConsole;
};

interface ExtensiveConsole {
  /**
   * Set the title for current output stream.
   * @param data as title
   */
  title: (title: string) => LightConsole;
  /**
   * Output blank line.
   * @param linesNumber the count of blank lines.
   */
  blankLine: (linesNumber?: number) => LightConsole;
  /**
   * Create a group, equal to console.group().
   */
  start: (...label: any[]) => LightConsole;
  /**
   * End a group, equal to console.groupEnd().
   */
  end: () => LightConsole;
  /**
   * Same as $$.start().log(data).end(), you can easily
   * create one group.
   */
  fold: (...data: any[]) => LightConsole;
  /**
   * Output a separate line, use `separator` or `-` by default.
   * @param separator
   * @param maxFillCharacters One line with character count.
   */
  separate: (separator?: string, maxFillCharacters?: number) => LightConsole;
}

export type LightConsole = PartialNativeConsole & ExtensiveConsole;

export enum PointCut {
  intercept = 'intercept',
  before = 'before',
  after = 'after',
  batchIntercept = 'batchIntercept',
  batchBefore = 'batchBefore',
  batchAfter = 'batchAfter',
}

type InterceptHook = Partial<{
  [K in keyof LightConsole as `${PointCut.intercept}${Capitalize<K>}`]: () => boolean;
}>;

type BeforeHook = Partial<{
  [K in keyof LightConsole as `${PointCut.before}${Capitalize<K>}`]: () => void;
}>;

type AfterHook = Partial<{
  [K in keyof LightConsole as `${PointCut.after}${Capitalize<K>}`]: () => void;
}>;

export type BatchInterceptHook = () => boolean;
export type BatchBeforeOrAfterHook = () => void;

export type BatchHook = Partial<{
  [PointCut.batchIntercept]:
    | {
        batchInterceptHook: BatchInterceptHook;
      }
    | {
        batchInterceptHook: BatchInterceptHook;
        include: Array<keyof LightConsole>;
      }
    | {
        batchInterceptHook: BatchInterceptHook;
        exclude: Array<keyof LightConsole>;
      };

  [PointCut.batchBefore]:
    | {
        batchBeforeHook: BatchBeforeOrAfterHook;
        include?: Array<keyof LightConsole>;
      }
    | {
        batchBeforeHook: BatchBeforeOrAfterHook;
        exclude?: Array<keyof LightConsole>;
      };
  [PointCut.batchAfter]:
    | {
        batchAfterHook: BatchBeforeOrAfterHook;
        include?: Array<keyof LightConsole>;
      }
    | {
        batchAfterHook: BatchBeforeOrAfterHook;
        exclude?: Array<keyof LightConsole>;
      };
}>;

/**
 * Hooks in prefix with `after-` `before-` didn't side effect for main logic.
 * Meanwhile, hooks in `intercept-` will block main logic if `intercept-` condition is true.
 */
export type ConsoleLifeCycle = InterceptHook &
  BeforeHook &
  AfterHook &
  BatchHook;

export type LightConsoleConfig = ConsoleLifeCycle;
