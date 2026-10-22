# Contributing to Camera Planner

Thanks for your interest in improving Camera Planner (`Sourabh06/home-security-planner`), a static website for planning a home CCTV setup: set a budget, mix camera types, get an approximate cost, then visualize coverage in 2D or in AR.

Live site (linked from the repository): <https://home-security-planner-nu.vercel.app>

## Our privacy promise

Camera Planner is privacy-first, and we want it to stay that way. Today the site has **no accounts, no analytics and no tracking**, and nothing a visitor enters is sent to a server. Budget, cameras, prices and floor plans stay in the visitor's own browser (local storage). The AR page uses the device camera and motion sensors locally.

Because this tool deals with people's homes and security setups, please treat this as a core rule for every contribution:

- Do not add analytics, trackers, ad scripts, fingerprinting, session recording or third-party embeds that phone home.
- Do not add accounts, logins or any server-side storage of user data.
- Do not send floor plans, camera positions, budgets or camera feed data anywhere off the device.
- Be careful with new external resources (CDN scripts, fonts, images). Each one means the visitor's browser contacts another server. The AR page already loads three.js from the jsDelivr CDN; avoid adding more unless there is a strong reason, and say so in your pull request.
- If you believe a change that affects privacy is truly needed, open an issue and discuss it first. If a privacy-affecting change is ever accepted, the "Data and privacy" section of the README must be updated in the same pull request.

Pull requests that weaken these guarantees will not be merged.

## Project layout

There is no build step. Everything is plain static files.

| File | Purpose |
|------|---------|
| `index.html` | Main page: budget, camera cart, cost estimate, embedded 2D plan, footer |
| `additional-info.html` | Extra buying and setup information, opened from the "Know your camera" guide |
| `flat_camera_coverage_floor_plan.html` | 2D floor plan and coverage tool (loaded inside `index.html`) |
| `google-ar/wall-cameras-ar.html` | 3D AR wall-camera tool (opened as a separate page) |
| `google-ar/ar-intro.gif`, `ar-walkthrough.gif`, `ar-style.gif` | Animations used on the AR page |
| `.gitignore` | Ignores `*.json`, such as downloaded plan files |

**Keep this folder layout.** `index.html` links to the other pages by relative path, so moving or renaming files will break the site.

## Ways to contribute

- Report bugs or confusing behavior
- Suggest features or improvements
- Fix or improve the cost estimate, camera information or other content
- Improve usability, accessibility or documentation
- Test on more devices and browsers and share your results

## Reporting bugs

Please open an issue at <https://github.com/Sourabh06/home-security-planner/issues> with:

1. Which page or tool is affected (main page, 2D plan, AR page, additional info)
2. What you expected and what happened
3. Steps to reproduce
4. Device, OS and browser with versions
5. For the AR page: the message shown on the start screen (for example `AR failed: ...`, `Setup failed: ...` or `Render error: ...`) and whether your phone supports ARCore
6. Screenshots or a screen recording, if helpful

Please do not attach screenshots or recordings that show private details of your home or security setup.

## Running locally

Serve the repository folder over HTTP from its root, for example:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. This is enough for the main page and the 2D tool.

### Testing the AR page on your phone

The AR page needs **HTTPS**, plus Chrome on an Android phone with Google Play Services for AR (ARCore). A plain `http://` address on your local network will not work, so the easiest way to test on a real phone is [ngrok](https://ngrok.com), which gives your local server a public HTTPS URL:

1. Install ngrok and sign in following the instructions on <https://ngrok.com> (a free account and auth token are needed).
2. Start the local server as above (`python3 -m http.server 8000`).
3. In a second terminal, run:

   ```
   ngrok http 8000
   ```

4. Open the `https://...` forwarding URL that ngrok prints on your Android phone, then go to `google-ar/wall-cameras-ar.html`.

Things to keep in mind:

- Anyone who has the ngrok URL can open your local server while the tunnel is running. Stop ngrok (`Ctrl+C`) when you finish, and do not serve a folder that contains anything private.
- The AR page loads three.js from the jsDelivr CDN, so an internet connection is required.

## Making changes

1. Fork the repository and create a branch from `main` (for example `fix/cost-table-rounding`).
2. Keep the project a static site. Please open an issue to discuss before adding a build step, framework or package manager.
3. Keep each pull request focused on one fix or feature.
4. There is no automated test suite, so test your change manually on the pages it touches, and on a real device if it affects the AR page.
5. Open a pull request describing what changed, why, and how you tested it.

### Guidelines

- **Privacy:** see "Our privacy promise" above. This comes first.
- **Performance:** the "Know your camera" guide is built from plain HTML and CSS and is only added to the page when opened, so it does not slow page load. Keep it that way for similar content.
- **Pricing:** all prices are approximate and exclude GST. Most come from the project owner's price list; the DVR bullet and turret prices are web estimates. If you change prices or defaults, say where the figures come from in your pull request. The recorder limits in the README (4 cameras for DVR, 7 for NVR) and the budget check should keep working.
- **Documentation:** if you add, rename or remove a file, update the file table in `README.md` and in this guide.
- **Saved plans:** `.gitignore` contains `*.json`, so every `.json` file is ignored, including plans downloaded from the 2D tool. Do not commit personal plans, since they describe real homes. If you genuinely need to add a JSON file (for example a sample plan), you must force-add it with `git add -f` or change the ignore rule, and explain why in your pull request.
- **Media:** the GIFs in `google-ar/` can be replaced with your own recordings. Keep file names unless you also update the pages that reference them, and keep file sizes reasonable.

## Pull request tips

- Describe the problem and your fix in plain language.
- Include screenshots or a short recording for visual changes.
- Mention the devices and browsers you tested on.
- Say whether your change adds any new external request or stores any new data. If it does not, say so.
- Be open to feedback; review is about the code, not you.

## Code of conduct

Be respectful and constructive. Harassment or discrimination of any kind is not welcome.

## License

The repository does not currently include a license file. Until the maintainer adds one, please ask in an issue before assuming how contributions will be licensed.

## Questions

Open an issue at <https://github.com/Sourabh06/home-security-planner/issues>.
