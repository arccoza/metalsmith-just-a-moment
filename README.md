# Metalsmith Just A Moment

A Metalsmith plugin which automatically converts all dates in files and metadata to [moment.js](https://github.com/moment/moment/) objects.

## Explanation
Automatically converting all your date objects to moment.js objects allows you to have very simple access to moment.js formatting inside your templates.

## Install

`npm install metalsmith-just-a-moment --save`

## Example

metalsmith.json config example:
```js
{
  "plugins": {
    // These are the default metalsmith-just-a-moment options, shown here only for demonstration.
    "metalsmith-just-a-moment": {
      pattern: ['**/*.md'],
      scanFiles: true,
      scanMetadata: true
    }
  }
}
```

Build script example:
```js
var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var justAMoment = require('metalsmith-just-a-moment');


metalsmith(__dirname)
  .source('src')
  .destination('pub')
  // These are the default metalsmith-just-a-moment options, shown here only for demonstration.
  .use(justAMoment({
    pattern: ['**/*.md'],
    scanFiles: true,
    scanMetadata: true
  }))
  .use(markdown({
    gfm: true,
    tables: true
  }))
  .build(function (err) {
    if (err) {
      throw err;
    }
  });
  
```

## Options

  - `pattern`
    - __Default value:__ `['**/*.md']`
    - __Description:__ Only process files that match this pattern, can be an array of multiple patterns, following [multimatch](https://github.com/sindresorhus/multimatch) rules.
  - `scanFiles`
    - __Default value:__ true
    - __Description:__ Should scan files for dates.
  - `scanMetadata`
    - __Default value:__ true
    - __Description:__ Should scan metadata object for dates.
  - `asUTC`
    - __Default value:__ false
    - __Description:__ Parse dates as UTC. If your date has a timezone it will be subtracted to get UTC, otherwise your date will be assumed to be UTC.

## Caveat

`metalsmith-permalinks` won't like that your dates are already moment.js objects, if you are using `metalsmith-permalinks` use `metalsmith-just-a-moment` after, not before, or use a patched version of `metalsmith-permalinks` (with other fixes) [here](https://github.com/arccoza/metalsmith-permalinks).
