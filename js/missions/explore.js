/**
 * Mission 1: Explore Lab
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  CircleQuest.registerMission({
    id: 'explore',
    title: 'Mission 1: Explore Lab',
    start: function (container) {
      container.innerHTML = `
        <h2 class="mission-view-title">Mission 1: Explore Lab</h2>
        <p style="font-size: 18px; color: var(--color-text-muted); max-width: 500px;">
          Welcome to the Explore Lab! Here, students can interactively explore the centre, radius, and diameter of a circle.
        </p>
        <button id="complete-explore-btn" class="btn btn-primary" style="margin-top: 20px;">
          Complete (test)
        </button>
      `;

      const btn = container.querySelector('#complete-explore-btn');
      if (btn) {
        const handleComplete = function (e) {
          if (e) e.preventDefault();
          CircleQuest.awardStars('explore', 3);
          CircleQuest.goHome();
        };

        btn.addEventListener('pointerdown', handleComplete);
        btn.addEventListener('click', handleComplete);
      }
    }
  });
})();
