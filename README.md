<h1 align="center">🌟💲 Dodollar 💲🌟 </h1>

<br />

<h2 align="center">Lightweight, Method Chaining, Extended, Well-encapsulated output CONSOLE</h2>

<br />

![boy](public/boy.png)

## Table of Contents
- [Docs](#docs)
  - [Installation](#installation)
  - [Basic Usage](#basic-usage)
  - [Method Chaining](#method-chaining)
  - [Extended Utilities](#extended-utilities)
    - [`title` method](#title-method)
    - [`blankLine` method](#blankline-method)
    - [`start` and `end` methods](#start-and-end-methods)
    - [`separate`](#separate)
  - [Road Map](#road-map)
  - [Author](#author)
  - [License](#license)

# Docs

## Installation

1. npm

```shell
npm i dodollar
```

2. yarn

```shell
yarn add dodollar
```

3. bun

```shell
bun add dodollar
// or
bun a dodollar
```

## Basic Usage
Act like `console.log`.

```ts
import $$ from 'dodollar';

$$.log('foo');
//> foo
```

> Dodollar compatible with commonly used five methods:
> 1. `log`
> 2. `info`
> 3. `debug`
> 4. `warn`
> 5. `error`

## Method Chaining

```ts
$$.log('foo')
  .warn('baz')
  .error('xyzzy');
```

Output:

![method chaining](public/method%20chaining.png)



## Extended Utilities

There are some extended utilities for convenience.

```ts
$$.separate()
  .title('Debug point')
  .blankLine()
  .log('foo')
  .separate();
```

Output:
![extended utilities](public/extended%20utilities.png)

### `title` method
Output a title.
```ts
$$.title('Hello DoDollar');

// Output
//> # Hello DoDollar
```

### `blankLine` method
Output blank lines. accept a number to indicate count of blank line.

### `start` and `end` methods
Same as `console.group()` and `console.groupEnd()` make the multiply output line becomes a group and you can easily collapse it:

```ts
$$.start('Start')
   .title('Hello DoDollar')
   .separate()
   .end();
```

Output:

![start and end](public/start%20and%20end.png)

### `separate`
Output one line separator， dash( `-` ) as separator character and maximum number is `80` by default.

```ts
$$.separate()
   .separate('*')
   .separate('_-', 150);
```

Output:

![separate](public/separate.png)



## Road Map

The list below should give some indication of our plans for the next major release, and for the future.

1. Complete user docs.
2. Support setting same hook in one time according to different environment.

## Author

| [![Pandy](https://avatars.githubusercontent.com/u/68799055?v=4)](https://github.com/Penggeor) |
| :-------------------------------------------------------------------------------------------: |
|                             [Pandy](https://github.com/Penggeor)                              |

## License

MIT © [Pandy](https://avatars.githubusercontent.com/u/68799055?v=4)
