import { DoDollar } from '..';

const $$ = new DoDollar();

test('log', () => {
  expect($$.log('a')).toBe($$);
  $$.separate();
});

test('info', () => {
  expect($$.info('info')).toBe($$);
  $$.separate().blankLine();
});

test('debug', () => {
  expect($$.debug('debug')).toBe($$);
  $$.separate().blankLine();
});

test('warn', () => {
  expect($$.warn('warn')).toBe($$);
  $$.separate().blankLine();
});

test('error', () => {
  expect($$.error('error')).toBe($$);
  $$.separate().blankLine();
});
