/**
 * Custom lightweight console.
 */
import { LightConsole, LightConsoleConfig } from './type';
import { addLifeCycleHooks, isEmptyObject } from './utils';

class DoDollar implements LightConsole {
  constructor(lightConsoleConfig?: LightConsoleConfig) {
    if (!isEmptyObject(lightConsoleConfig)) {
      const $$ = new DoDollar();
      return addLifeCycleHooks($$, lightConsoleConfig!);
    }
  }
  error(...data: any[]) {
    console.error(...data);
    return this;
  }
  info(...data: any[]) {
    console.info(...data);
    return this;
  }
  log(...data: any[]) {
    console.log(...data);
    return this;
  }
  warn(...data: any[]) {
    console.warn(...data);
    return this;
  }
  debug(...data: any[]) {
    console.debug(...data);
    return this;
  }
  title(title: string) {
    console.log(`# ${title}`);
    return this;
  }
  blankLine(linesNumber: number = 1) {
    new Array(linesNumber).fill('\n').map((val) => console.log(val));
    return this;
  }
  start(...label: any[]) {
    console.group(...label);
    return this;
  }
  end() {
    console.groupEnd();
    return this;
  }
  separate(separator?: string, maxFillCharacters = 80) {
    let separatorArray = ['-'];
    if (separator !== undefined && separator.length > 0) {
      separatorArray = separator.split('');
    }

    const composedSeparator = [];
    for (let i = 0; i < maxFillCharacters; i++) {
      composedSeparator.push(separatorArray[i % separatorArray.length]);
    }
    composedSeparator.push('\n');

    console.log(composedSeparator.join(''));
    return this;
  }
}

export default new DoDollar();

export { DoDollar };

const $$ = new DoDollar({
  beforeLog: () => {
    // $$.log('>>>>>> beforeLog');
  },
});

$$.log('a');
