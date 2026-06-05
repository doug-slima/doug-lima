# PRD — Shader-ASCII-Home

> Criado: 05 jun 2026   

---

## For Vue / Svelte / Other Frameworks

Create a container element and initialize dynamically:
```javascript
// On mount:
const scene = await UnicornStudio.addScene({
  elementId: "unicorn-container", // ID of your container element
  projectId: "dRS2ODhLzteESSqn3Qkm",
  scale: 1,
  dpi: 1.5,
  fps: 60,
  lazyLoad: true,
  initialVariables: {
    accentColor: "#88bbff",
    intensity: 0.75,
  },
});

// On unmount:
scene.destroy();
```

## Variables

If the scene exposes variables, use those first instead of changing layers directly. Read the available variable names and types with `scene.getVariableManifest()`, replace the example names below with real variable names, pass starting values with `initialVariables` or `data-us-vars`, and update live values with `scene.setVariable()` or `scene.setVariables()`.

```html
<div
  data-us-project="dRS2ODhLzteESSqn3Qkm"
  data-us-vars='{"accentColor":"#88bbff","intensity":0.75}'
  style="width: 100%; height: 400px;"
></div>
```

```javascript
console.table(scene.getVariableManifest());
scene.setVariable("intensity", 0.75);
scene.setVariables({ accentColor: "#88bbff" });
```

## Important Notes

- The container element needs explicit width and height to render properly
- Use `scale` (0.25-1) to improve performance on slower devices
- Set `lazyLoad: true` to defer loading until visible in viewport

