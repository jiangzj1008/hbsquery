<h1 align="center">hbsquery</h1>

<h5 align="center">Manipulate html attributes in handlebars</h5>

## Installation

`npm install hbsquery`

## API

### load

```js
import { load } from 'hbsquery';

const $ = load('{{#if valid}}<div>bar</div>{{/if}}');

$.template();
//=> {{#if valid}}<div>bar</div>{{/if}}
```

### addClass

```js
import { load } from 'hbsquery';

const code = '<div></div>';
const $ = load(code);
$('div').addClass('newClass');

$.template();
//=> <div class="newClass"></div>
```

### removeClass

```js
import { load } from 'hbsquery';

const code = '<div class="show {{layout}}-show"></div>';
const $ = load(code);
$('div').removeClass('show');

$.template();
//=> <div class="{{layout}}-show"></div>
```

### hasClass

```js
import { load } from 'hbsquery';

const code = '<div class="show {{layout}}-show"></div>';
const $ = load(code);

$('div').hasClass('show');
//=> true
```

### attr

```js
import { load } from 'hbsquery';

const code = '<div class="show {{cls}}"></div>';
const $ = load(code);

$('.show').attr('id', 'id');
$.template();
//=> <div id="id" class="show {{cls}}"></div>

$('.show').attr('id', null);
$.template();
//=> <div class="show {{cls}}"></div>

$('.show').attr({
  id: 'id',
  'data-type': 'button',
});
$.template();
//=> <div id="id" data-type="button" class="show {{cls}}"></div>
```

### for loop

```js
import { load } from 'hbsquery';

const code = '<div class="first"></div><div></div>';
const $ = load(code);
const $divs = $('div');

$divs.forEach((el) => {
  const $el = $(el);
  if ($el.hasClass('first')) {
    $el.attr({ 'data-type': 'first' });
  } else {
    $el.attr({ 'data-type': 'normal' });
  }
});

$.template();
//=> <div data-type="first" class="first"></div><div data-type="normal"></div>
```