/**
 * Mission 4: Quiz Arena
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  CircleQuest.registerMission({
    id: 'quiz',
    title: 'Mission 4: Quiz Arena',
    start: function (container) {
      container.innerHTML = `
        <h2 class="mission-view-title">Mission 4: Quiz Arena</h2>
        <p style="font-size: 18px; color: var(--color-text-muted); max-width: 500px;">
          Test your knowledge on circle centre, radius, and diameter in a timed quiz challenge!
        </p>
        <button id="complete-quiz-btn" class="btn btn-primary" style="margin-top: 20px;">
          Complete (test)
        </button>
      `;

      const btn = container.querySelector('#complete-quiz-btn');
      if (btn) {
        const handleComplete = function (e) {
          if (e) e.preventDefault();
          CircleQuest.awardStars('quiz', 3);
          CircleQuest.goHome();
        };

        btn.addEventListener('pointerdown', handleComplete);
        btn.addEventListener('click', handleComplete);
      }
    }
  });
})();
