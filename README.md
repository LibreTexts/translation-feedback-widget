# LibreTexts Translation Feedback Widget
This repository hosts the codebase for the LibreTexts Translation Feedback Widget
for use on the LibreTexts Libraries.

## Prerequisites
The Translation Feedback widget relies on jQuery and will not initialize if the
library is missing. jQuery should already be available on LibreTexts
library pages.

## How to Use
1. Download the `dist` folder.
2. Include the `libreTranslationFeedback.js` script at the end of the `<body>`
section in standard fashion. *Note that while only the JS file needs to be
explicitly included, the font files must be available in the same
relative folder path.*
```
<script type='text/javascript' src='./dist/libreTranslationFeedback.js'></script>
```
3. Create a "Submit Translation Feedback" button and register an *onClick* function
that calls `window.libreTranslationFeedback.init()`. For example:
```
$("#libreTranslationFeedbackBtn").click(function() {
    window.libreTranslationFeedback.init();
});
```
That's it!

## Conflict Considerations
Several steps have been taken to avoid HTML, Javascript, and CSS conflicts with
pre-existing code on the LibreTexts libraries. Only the minimum amount of
Semantic UI files necessary are included in the bundle.

### HTML & CSS
* Element IDs generally follow the `libreTF-internal-name` scheme.
* Class names generally follow the `tf-internal-class` scheme, save for Semantic
UI classes that generally follow the `ui <element>` scheme.

### Javascript/jQuery
* The underlying JS code does NOT make any use of the standard jQuery `$`
reference name/variable. All jQuery usage relies on the global `window.jQuery`
object/property and references are often passed internally.

## Security/Access Control Considerations
Conductor, the platform that handles Translation Feedback submissions, only accepts
AJAX requests from pages hosted on the `libretexts.org` domain. Further security
features are incoming.

## Attributions
The Translation Feedback Widget makes use of a stripped-down version of
[Semantic UI 2.4.1](https://semantic-ui.com/), which is available under the
[MIT license](https://opensource.org/licenses/MIT).
