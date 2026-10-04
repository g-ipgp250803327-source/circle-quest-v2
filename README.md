# Circle Quest

**Circle Quest** is a gamified learning web application designed for Malaysian Year 6 students following the KSSR Mathematics curriculum (Topic 6.2 Circles: 6.2.1 recognise centre, radius, and diameter; 6.2.2 draw a circle given a radius and label centre, radius, and diameter).

All student-facing text is written in English.

---

## Technical Constraints & Stack
- **Plain HTML, CSS, and Vanilla JavaScript**: Built without any frameworks, build tools, or `npm` dependencies. Compatible with static site hosting (e.g. Vercel) or directly opening `index.html` in a web browser.
- **No ES Module Imports**: Uses standard script tags to ensure offline/local file system capability (`file://`).
- **Mobile-First & Responsive**: Designed for mobile phones in portrait mode as well as desktop/laptop screens.
- **Pointer Events**: Pointer events (`pointerdown`, `click`) are used across interactive elements for touch and mouse support.

---

## File Structure

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   └── missions/
│       ├── explore.js
│       ├── reallife.js
│       ├── draw.js
│       └── quiz.js
└── README.md
```

- **`index.html`**: Main HTML container loading stylesheet and scripts in non-module order.
- **`css/style.css`**: CSS styling with custom variables, mobile-first layouts, minimum 16px font sizes, rounded buttons, and animations.
- **`js/app.js`**: Core global object (`CircleQuest`), UI rendering, navigation, star progress tracking, `localStorage` persistence, and game reset functionality.
- **`js/missions/*.js`**: Self-registering mission modules that extend `CircleQuest`.

---

## Shared Global API (`CircleQuest`)

`js/app.js` exposes the `CircleQuest` global object:

1. **`CircleQuest.registerMission({ id, title, start(container) })`**
   Registers a mission module. `start(container)` is called when a student launches the mission, receiving the mission view DOM container element.

2. **`CircleQuest.awardStars(missionId, stars)`**
   Awards stars (0 to 3) for a given mission. It keeps the student team's best score and marks the mission as completed.

3. **`CircleQuest.goHome()`**
   Navigates back to the main menu/home screen and updates the score displays.

---

## How to Add a New Mission

To create a new mission (e.g., `Mission 5: Extra Challenge`):

1. **Create the Mission JavaScript File**
   Add a new file under `js/missions/`, for example `js/missions/extra.js`:

   ```javascript
   (function () {
     'use strict';

     if (!window.CircleQuest) return;

     CircleQuest.registerMission({
       id: 'extra',
       title: 'Mission 5: Extra Challenge',
       start: function (container) {
         // Render mission HTML into container
         container.innerHTML = `
           <h2 class="mission-view-title">Mission 5: Extra Challenge</h2>
           <p>Your interactive mission content here...</p>
           <button id="finish-btn" class="btn btn-primary">Complete Mission</button>
         `;

         // Handle mission completion
         const btn = container.querySelector('#finish-btn');
         if (btn) {
           btn.addEventListener('pointerdown', function (e) {
             e.preventDefault();
             CircleQuest.awardStars('extra', 3);
             CircleQuest.goHome();
           });
         }
       }
     });
   })();
   ```

2. **Include Script in `index.html`**
   Add a script tag at the bottom of `index.html` after `js/app.js`:

   ```html
   <script src="js/missions/extra.js"></script>
   ```

3. *(Optional)* If the mission needs to be tracked on the home screen card grid, include its definition in the `REQUIRED_MISSIONS` array inside `js/app.js`.
