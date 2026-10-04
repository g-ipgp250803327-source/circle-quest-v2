/**
 * Mission 3: Draw It!
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  CircleQuest.registerMission({
    id: 'draw',
    title: 'Mission 3: Draw It!',
    start: function (container) {
      container.innerHTML = `
        <h2 class="mission-view-title">Mission 3: Draw It!</h2>
        <p style="font-size: 18px; color: var(--color-text-muted); max-width: 500px;">
          Practice drawing circles given a radius, and label the centre, radius, and diameter accurately!
        </p>
        <button id="complete-draw-btn" class="btn btn-primary" style="margin-top: 20px;">
          Complete (test)
        </button>
      `;

      const btn = container.querySelector('#complete-draw-btn');
      if (btn) {
        const handleComplete = function (e) {
          if (e) e.preventDefault();
          CircleQuest.awardStars('draw', 3);
          CircleQuest.goHome();
        };

        btn.addEventListener('pointerdown', handleComplete);
        btn.addEventListener('click', handleComplete);
      }
    }
  });
})();
