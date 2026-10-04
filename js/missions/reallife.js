/**
 * Mission 2: Real-Life Mission
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  CircleQuest.registerMission({
    id: 'reallife',
    title: 'Mission 2: Real-Life Mission',
    start: function (container) {
      container.innerHTML = `
        <h2 class="mission-view-title">Mission 2: Real-Life Mission</h2>
        <p style="font-size: 18px; color: var(--color-text-muted); max-width: 500px;">
          Identify circular objects in everyday real-life scenarios and locate their centre, radius, and diameter!
        </p>
        <button id="complete-reallife-btn" class="btn btn-primary" style="margin-top: 20px;">
          Complete (test)
        </button>
      `;

      const btn = container.querySelector('#complete-reallife-btn');
      if (btn) {
        const handleComplete = function (e) {
          if (e) e.preventDefault();
          CircleQuest.awardStars('reallife', 3);
          CircleQuest.goHome();
        };

        btn.addEventListener('pointerdown', handleComplete);
        btn.addEventListener('click', handleComplete);
      }
    }
  });
})();
