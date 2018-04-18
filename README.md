# nicolocarpignoli.github.io
Actually just a playground for AR.js

## Actual working setup for AR.js

Using [AR.js](https://github.com/jeromeetienne/AR.js) we can achieve augmented reality using custom-markers.

The following are workarounds for actual known AR.js bugs with custom markers:

- Please use following attributes and a remote url for the pattern url:

    ```
        <a-marker-camera preset='custom' type="pattern" url='https://raw.githubusercontent.com/nicolocarpignoli/nicolocarpignoli.github.io/master/ar-playground/pattern-marker.patt'>

    ```

**Important**: Images cannot have white/transparent background! Background must be a light grey like rbg(240,240,240) (`F0F0F0`).

[This tool](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html) is used for generate a custom marker from an image. Then the generated marked has to be referenced on the `<a-marker>` element.

## Demo

Visit http://nicolocarpignoli.github.io; this is the app that contains AR logic and will use the camera. Please visit that on a mobile device.

Print on a paper or show on a screen the custom marker. The marker has to be exactly the same that the previously used tool has generated (it has generated a .patt file and and image to download).

When the camera will focus on the custom marker, the default 3D model will appear.

## Custom Markers

Custom markers must be simple images, much better if they are symbols/text. A custom market will contain a pattern (as you can see on file `pattern-marker.js`) that 'sintetize' the input image. Background of input image has to be light grey and not white or transparent (like `F0F0F0`).

Useful links: https://github.com/jeromeetienne/AR.js/issues/234

