var pixelSize = 16;

// Attach Interact.js logic to the .rainbow-pixel-canvas
interact('.rainbow-pixel-canvas')
  .draggable({
    max: Infinity,
    maxPerElement: Infinity,
    origin: 'self',
    modifiers: [
      interact.modifiers.snap({
        // snap to a grid
        targets: [
          interact.snappers.grid({ x: pixelSize, y: pixelSize })
        ]
      })
    ],
    listeners: {
      // draw colored squares on drag
      move: function (event) {
        var context = event.target.getContext('2d');
        // angle of drag direction
        var dragAngle = 180 * Math.atan2(event.dx, event.dy) / Math.PI;

        // set color based on drag angle & speed
        context.fillStyle =
          'hsl(' +
          dragAngle +
          ', 86%, ' +
          (30 + Math.min(event.speed / 1000, 1) * 50) +
          '%)';

        // draw squares
        context.fillRect(
          event.pageX - pixelSize / 2,
          event.pageY - pixelSize / 2,
          pixelSize,
          pixelSize
        );
      }
    }
  })
  // clear the canvas on doubletap
  .on('doubletap', function (event) {
    var context = event.target.getContext('2d');

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    resizeCanvases();
  });

// resize the canvas to match its CSS size
function resizeCanvases () {
  document.querySelectorAll('.rainbow-pixel-canvas').forEach(function (canvas) {
    // clear existing dimensions
    delete canvas.width;
    delete canvas.height;

    var rect = canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
  });
}

resizeCanvases();

// re-check size if the window changes
interact(window).on('resize', resizeCanvases);
