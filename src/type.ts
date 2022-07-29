export type PartialNativeConsolePropertiesName = Extract<
  keyof Console,
  'log' | 'info' | 'debug' | 'warn' | 'error'
>;

export type PartialNativeConsole = {
  [Name in PartialNativeConsolePropertiesName]: (
    ...data: any[]
  ) => LightConsole;
};

export interface ExtensiveConsole {
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
   * Output a separate line, use `separator` or `-` by default.
   * @param separator
   * @param maxFillCharacters One line with character count.
   */
  separate: (separator?: string, maxFillCharacters?: number) => LightConsole;
}

export interface LightConsole extends PartialNativeConsole, ExtensiveConsole {}

export enum ConsoleLifeCyclePointCuts {
  intercept = 'intercept',
  before = 'before',
  after = 'after',
}

export type Intercept = Partial<{
  [K in keyof LightConsole as `${ConsoleLifeCyclePointCuts.intercept}${Capitalize<K>}`]: () => boolean;
}>;

export type Before = Partial<{
  [K in keyof LightConsole as `${ConsoleLifeCyclePointCuts.before}${Capitalize<K>}`]: () => void;
}>;

export type After = Partial<{
  [K in keyof LightConsole as `${ConsoleLifeCyclePointCuts.after}${Capitalize<K>}`]: () => void;
}>;

/**
 * Hooks in prefix with `after-` `before-` didn't side effect for main logic.
 * Meanwhile, hooks in `intercept-` will block main logic if `intercept-` condition is true.
 */
export interface ConsoleLifeCycle extends Intercept, Before, After {}

export interface LightConsoleConfig extends ConsoleLifeCycle {}
