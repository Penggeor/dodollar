import { DoDollar } from '..';

const $$ = new DoDollar({
  beforeLog: () => {
    // $$.log('>>>>>> beforeLog');
  },
});

$$.log('a');

test('log', () => {
  expect($$.log('b')).toBe($$);
  $$.separate().blankLine();
});
