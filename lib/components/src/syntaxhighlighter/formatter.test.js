// @ts-check

import dedent from 'ts-dedent';

import { formatter } from './formatter';

test('handles empty string', async () => {
  const input = '';
  const result = await formatter(input, undefined);

  expect(result).toBe(input);
});

test('handles single line', async () => {
  const input = 'console.log("hello world")';
  const result = await formatter(input, undefined);

  expect(result).toBe(input);
});

test('does not transform correct code', async () => {
  const input = dedent`
    console.log("hello");
    console.log("world");
  `;
  const result = await formatter(input, undefined);

  expect(result).toBe(input);
});

test('does transform incorrect code', async () => {
  const input = `
    console.log("hello");
    console.log("world");
  `;
  const result = await formatter(input, undefined);

  expect(result).toBe(`console.log("hello");
console.log("world");`);
});

test('more indentations - skip first line', async () => {
  const input = `
    test('handles empty string', () => {
      const input = '';
      const result = formatter(input);
    
      expect(result).toBe(input);
    });
  `;
  const result = await formatter(input, undefined);

  expect(result).toBe(`test('handles empty string', () => {
  const input = '';
  const result = formatter(input);

  expect(result).toBe(input);
});`);
});

test('more indentations - code on first line', async () => {
  const input = `// some comment
    test('handles empty string', () => {
      const input = '';
      const result = formatter(input);
    
      expect(result).toBe(input);
    });
  `;
  const result = await formatter(input, undefined);

  expect(result).toBe(`// some comment
test('handles empty string', () => {
  const input = '';
  const result = formatter(input);

  expect(result).toBe(input);
});`);
});

test('removes whitespace in empty line completely', async () => {
  const input = `
    console.log("hello");

    console.log("world");
  `;
  const result = await formatter(input, undefined);

  expect(result).toBe(`console.log("hello");

console.log("world");`);
});

test('aligns whitespace JavaScript is specified', async () => {
  const input = `console.log(1); console.log(2); console.log(3);
    console.log(4)
      const x = 5;`;

  const result = await formatter(input, 'js');

  expect(result).toBe(`console.log(1);
console.log(2);
console.log(3);
console.log(4);
const x = 5;
`);
});

test('formats JSX', async () => {
  const input = `
function HelloWorld({greeting = "hello", greeted = '"World"', silent = false, onMouseOver,}) {

  if(!greeting){return null};

      // TODO: Don't use random in render
  let num = Math.floor (Math.random() * 1E+7).toString().replace(/\\.\\d+/ig, "")

  return <div className='HelloWorld' title={\`You are visitor number \${num}\`} onMouseOver={onMouseOver}>

    <strong>{ greeting.slice( 0, 1 ).toUpperCase() + greeting.slice(1).toLowerCase() }</strong>
    {greeting.endsWith(",") ? " " : <span style={{color: '\\grey'}}>", "</span> }
    <em>
  { greeted }
  </em>
    { (silent)
      ? "."
      : "!"}

    </div>;

} 
`;

  const expected = `function HelloWorld({
  greeting = "hello",
  greeted = '"World"',
  silent = false,
  onMouseOver,
}) {
  if (!greeting) {
    return null;
  }

  // TODO: Don't use random in render
  let num = Math.floor(Math.random() * 1e7)
    .toString()
    .replace(/\\.\\d+/gi, "");

  return (
    <div
      className="HelloWorld"
      title={\`You are visitor number \${num}\`}
      onMouseOver={onMouseOver}
    >
      <strong>
        {greeting.slice(0, 1).toUpperCase() +
          greeting.slice(1).toLowerCase()}
      </strong>
      {greeting.endsWith(",") ? (
        " "
      ) : (
        <span style={{ color: "grey" }}>", "</span>
      )}
      <em>{greeted}</em>
      {silent ? "." : "!"}
    </div>
  );
}
`;

  expect(await formatter(input, 'jsx')).toBe(expected);
});

test('formats CSS', async () => {
  const input = `
  @media (max-width: 480px) {
    .bd-examples {margin-right: -.75rem;margin-left: -.75rem
    }
    
   .bd-examples>[class^="col-"]  {
      padding-right: .75rem;
      padding-left: .75rem;
    
    }
  }
`;

  const expected = `@media (max-width: 480px) {
  .bd-examples {
    margin-right: -0.75rem;
    margin-left: -0.75rem;
  }

  .bd-examples > [class^="col-"] {
    padding-right: 0.75rem;
    padding-left: 0.75rem;
  }
}
`;

  expect(await formatter(input, 'css')).toBe(expected);
});

test('formats SCSS', async () => {
  const input = `
@function color-yiq($color) {
  $r: red($color);$g: green($color);$b: blue($color);

  $yiq: (($r * 299) + ($g * 587) + ($b * 114)) / 1000;

  @if ($yiq >= $yiq-contrasted-threshold) {
    @return $yiq-text-dark;
} @else {
    @return $yiq-text-light;
  }
}

@each $color, $value in $colors {
  .swatch-#{$color} {
    color: color-yiq($value);
    background-color: #{$value};
  }
}`;

  const expected = `@function color-yiq($color) {
  $r: red($color);
  $g: green($color);
  $b: blue($color);

  $yiq: (($r * 299) + ($g * 587) + ($b * 114)) / 1000;

  @if ($yiq >= $yiq-contrasted-threshold) {
    @return $yiq-text-dark;
  } @else {
    @return $yiq-text-light;
  }
}

@each $color, $value in $colors {
  .swatch-#{$color} {
    color: color-yiq($value);
    background-color: #{$value};
  }
}
`;

  expect(await formatter(input, 'scss')).toBe(expected);
});

test('formats HTML', async () => {
  const input = `
<!DOCTYPE html>
<HTML CLASS="no-js mY-ClAsS">
  <HEAD>
    <META CHARSET="utf-8">
    <TITLE>My tITlE</TITLE>
    <META NAME="description" content="My CoNtEnT">
  </HEAD>
  <body>
    <P>Hello world!<BR> This is HTML5 Boilerplate.</P>
    <SCRIPT src="https://www.google-analytics.com/analytics.js" ASYNC DEFER></SCRIPT>
  </body>
</HTML>
  `;

  const expected = `<!DOCTYPE html>
<html class="no-js mY-ClAsS">
  <head>
    <meta charset="utf-8" />
    <title>My tITlE</title>
    <meta name="description" content="My CoNtEnT" />
  </head>
  <body>
    <p>
      Hello world!<br />
      This is HTML5 Boilerplate.
    </p>
    <script
      src="https://www.google-analytics.com/analytics.js"
      async
      defer
    ></script>
  </body>
</html>
`;

  expect(await formatter(input, 'html')).toBe(expected);
});

test('formats Vue', async () => {
  const input = `
    <template>
    <p>Templates are formatted as well...
      </p>
  </template>
  
  <script>
  let Prettier = format => { your.js('though') }
  </script>
  
  <style>
  .and { css: too !important }
  </style>
`;

  const expected = `<template>
  <p>Templates are formatted as well...</p>
</template>

<script>
let Prettier = (format) => {
  your.js("though");
};
</script>

<style>
.and {
  css: too !important;
}
</style>
`;

  expect(await formatter(input, 'vue')).toBe(expected);
});

test('formats Angular templates', async () => {
  const input = `<div *ngIf="hero">

  <h2>{{hero.name | uppercase}} Details</h2>
<div><span>id: 


</span>{{hero.id}}</div>
<div>
<label>
name:
<input 
  [(ngModel)]="hero.name" 
  
  
  placeholder="name"
  
/>
    </label>
</div>

</div>`;

  const expected = `<div *ngIf="hero">
  <h2>{{ hero.name | uppercase }} Details</h2>
  <div><span>id: </span>{{ hero.id }}</div>
  <div>
    <label>
      name:
      <input [(ngModel)]="hero.name" placeholder="name" />
    </label>
  </div>
</div>
`;

  expect(await formatter(input, 'angular')).toBe(expected);
});
