# Camera Planner

A static website for planning a home CCTV setup: set a budget, mix camera types, get an approximate cost, then visualize coverage in 2D or in AR.

## Features

- **Budget & cameras:** budget slider and text input; choose HD camera + DVR or IP camera + NVR; wired, WiFi or battery; add dome, bullet and turret cameras in any mix. The cost table updates live and stops you adding cameras that would exceed the budget or the recorder limit (4 for DVR, 7 for NVR).
- **Visualize (2D):** the floor-plan coverage tool is embedded in the main page. Draw walls, place indoor and outdoor cameras and see their coverage cones.
- **Visualize (3D):** opens the WebXR page, where you mount cameras on a real wall through your phone camera.
- The cost estimate is optional. You can go straight to Visualize.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main page: budget, camera cart, cost estimate, embedded 2D plan, footer |
| `flat_camera_coverage_floor_plan.html` | 2D floor plan and coverage tool (loaded inside `index.html`) |
| `google AR/wall-cameras-ar.html` | 3D AR wall-camera tool (opened as a separate page) |
| `.gitignore` | Ignores `*.json`, such as downloaded plan files |

Keep this folder layout, because `index.html` links to the other two files by relative path.

## Run locally

There is no build step. Serve the folder over HTTP, for example:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deploy

Upload all files, with the same structure, to any static host that serves **HTTPS**. The 3D view needs HTTPS, plus Chrome on an Android phone with Google Play Services for AR (ARCore).

## Pricing

All prices are approximate and exclude GST. Most come from the project owner's price list; the DVR bullet and turret prices are web estimates. Every price can be edited in the "Edit price list" section of the page.

## Data and privacy

No accounts, analytics or tracking, and nothing entered is sent to a server. Budget, cameras, prices and floor plans are saved only in the visitor's browser (local storage). The 3D page uses the device camera and motion sensors locally and loads three.js from the jsDelivr CDN.

## Author

Made by Sourabh · [Portfolio](https://sourabhkumarsingh-portfolio.lovable.app/)
