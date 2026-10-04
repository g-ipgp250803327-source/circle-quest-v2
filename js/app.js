/**
 * Circle Quest - Core Application Logic
 * Malaysian Year 6 KSSR Mathematics Gamified Learning
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'circle_quest_state_v1';

  // Mission definitions order
  const REQUIRED_MISSIONS = [
    { id: 'explore', title: 'Mission 1: Explore Lab' },
    { id: 'reallife', title: 'Mission 2: Real-Life Mission' },
    { id: 'draw', title: 'Mission 3: Draw It!' },
    { id: 'quiz', title: 'Mission 4: Quiz Arena' }
  ];

  // Default initial state
  function getInitialState() {
    return {
      teamName: '',
      scores: {
        explore: 0,
        reallife: 0,
        draw: 0,
        quiz: 0
      },
      completed: {
        explore: false,
        reallife: false,
        draw: false,
        quiz: false
      }
    };
  }

  // Load state from localStorage
  function loadState() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          teamName: parsed.teamName || '',
          scores: { ...getInitialState().scores, ...parsed.scores },
          completed: { ...getInitialState().completed, ...parsed.completed }
        };
      }
    } catch (e) {
      console.warn('Could not load state from localStorage:', e);
    }
    return getInitialState();
  }

  // Save state to localStorage
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }

  // Global CircleQuest state
  const state = loadState();
  const registeredMissions = {};
  let currentMissionId = null;

  // Global CircleQuest Object
  window.CircleQuest = {
    // 1. Register a mission
    registerMission: function (mission) {
      if (!mission || !mission.id) {
        console.error('Invalid mission registration:', mission);
        return;
      }
      registeredMissions[mission.id] = mission;
    },

    // 2. Award stars (keeps best result)
    awardStars: function (missionId, stars) {
      if (typeof stars !== 'number' || stars < 0) stars = 0;
      if (stars > 3) stars = 3;

      const currentScore = state.scores[missionId] || 0;
      if (stars > currentScore) {
        state.scores[missionId] = stars;
      }
      state.completed[missionId] = true;
      saveState(state);
      this.updateHeaderStars();
    },

    // 3. Return to home screen
    goHome: function () {
      currentMissionId = null;
      const homeScreen = document.getElementById('home-screen');
      const missionContainer = document.getElementById('mission-container');
      const backBtn = document.getElementById('back-to-menu-btn');

      if (missionContainer) {
        missionContainer.style.display = 'none';
        missionContainer.innerHTML = '';
      }
      if (homeScreen) {
        homeScreen.style.display = 'flex';
      }
      if (backBtn) {
        backBtn.style.display = 'none';
      }

      this.renderHome();
      this.updateHeaderStars();
    },

    // Reset game progress
    resetGame: function () {
      if (confirm('Are you sure you want to reset all game progress?')) {
        const newState = getInitialState();
        state.teamName = newState.teamName;
        state.scores = newState.scores;
        state.completed = newState.completed;
        saveState(state);
        this.goHome();
      }
    },

    // Start a specific mission
    startMission: function (missionId) {
      const mission = registeredMissions[missionId];
      if (!mission || typeof mission.start !== 'function') {
        alert('Mission content is loading or unavailable.');
        return;
      }

      currentMissionId = missionId;

      const homeScreen = document.getElementById('home-screen');
      const missionContainer = document.getElementById('mission-container');
      const backBtn = document.getElementById('back-to-menu-btn');

      if (homeScreen) {
        homeScreen.style.display = 'none';
      }
      if (backBtn) {
        backBtn.style.display = 'inline-flex';
      }
      if (missionContainer) {
        missionContainer.style.display = 'flex';
        missionContainer.innerHTML = '';
        mission.start(missionContainer);
      }
    },

    // Calculate total stars
    getTotalStars: function () {
      return Object.values(state.scores).reduce((sum, score) => sum + (score || 0), 0);
    },

    // Check if all 4 missions are completed
    isAllCompleted: function () {
      return REQUIRED_MISSIONS.every(m => state.completed[m.id] === true);
    },

    // Update Header total stars UI
    updateHeaderStars: function () {
      const totalStarsEl = document.getElementById('total-stars-count');
      if (totalStarsEl) {
        totalStarsEl.textContent = this.getTotalStars();
      }
    },

    // Render Home screen
    renderHome: function () {
      const homeScreen = document.getElementById('home-screen');
      if (!homeScreen) return;

      homeScreen.innerHTML = '';

      // Hero Banner
      const hero = document.createElement('div');
      hero.className = 'hero-banner';
      hero.innerHTML = `
        <h1 class="app-title">Circle Quest</h1>
        <p class="app-tagline">Master circle centre, radius, and diameter together in pair missions!</p>
      `;
      homeScreen.appendChild(hero);

      // Team Name Section
      const teamSec = document.createElement('div');
      teamSec.className = 'team-section';
      teamSec.innerHTML = `
        <label for="team-name-input">Team Name (Pairs):</label>
        <div class="team-input-wrapper">
          <input type="text" id="team-name-input" class="team-input" placeholder="e.g. Maya & Adam" value="${escapeHtml(state.teamName)}">
        </div>
      `;
      homeScreen.appendChild(teamSec);

      // Event listener for team name change
      const teamInput = teamSec.querySelector('#team-name-input');
      if (teamInput) {
        teamInput.addEventListener('input', function (e) {
          state.teamName = e.target.value;
          saveState(state);
          // Update well-done card if displayed
          const teamNameDisplay = document.getElementById('well-done-team-name');
          if (teamNameDisplay) {
            teamNameDisplay.textContent = state.teamName.trim() || 'Students';
          }
        });
      }

      // Well Done Banner if all completed
      if (this.isAllCompleted()) {
        const wellDoneCard = document.createElement('div');
        wellDoneCard.className = 'well-done-card';
        const teamDisplayName = state.teamName.trim() || 'Students';
        wellDoneCard.innerHTML = `
          <h2>🎉 Well Done! 🎉</h2>
          <p>Fantastic job, <strong id="well-done-team-name">${escapeHtml(teamDisplayName)}</strong>!</p>
          <p>You have completed all 4 Circle Quest missions!</p>
          <div class="mission-stars-row" style="justify-content: center; margin-top: 10px;">
            <span>Total Stars: <strong>${this.getTotalStars()} / 12</strong> ⭐</span>
          </div>
        `;
        homeScreen.appendChild(wellDoneCard);
      }

      // Missions Header
      const missionsHeader = document.createElement('h2');
      missionsHeader.className = 'missions-header-title';
      missionsHeader.textContent = 'Select a Mission';
      homeScreen.appendChild(missionsHeader);

      // Missions Grid
      const grid = document.createElement('div');
      grid.className = 'missions-grid';

      REQUIRED_MISSIONS.forEach(req => {
        const isCompleted = state.completed[req.id];
        const stars = state.scores[req.id] || 0;
        const regMission = registeredMissions[req.id];
        const displayTitle = regMission ? regMission.title : req.title;

        const card = document.createElement('div');
        card.className = `mission-card ${isCompleted ? 'completed' : ''}`;

        // Create star icons HTML
        let starsHtml = '';
        for (let i = 1; i <= 3; i++) {
          starsHtml += `<span class="star ${i <= stars ? 'filled' : ''}">★</span>`;
        }

        card.innerHTML = `
          <div class="mission-card-header">
            <span class="mission-card-status">${isCompleted ? 'Completed ✅' : 'Not completed ⏳'}</span>
            <div class="mission-card-title">${escapeHtml(displayTitle)}</div>
            <div class="mission-stars-row">
              ${starsHtml}
              <span style="font-size: 14px; color: var(--color-text-muted); margin-left: 6px;">(${stars}/3 stars)</span>
            </div>
          </div>
          <div class="mission-card-footer">
            <button class="btn btn-primary start-mission-btn" data-mission-id="${req.id}">
              ${isCompleted ? 'Play Again' : 'Start Mission'}
            </button>
          </div>
        `;

        // Add pointer event listener for start button
        const startBtn = card.querySelector('.start-mission-btn');
        if (startBtn) {
          startBtn.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            CircleQuest.startMission(req.id);
          });
          // Fallback click listener for accessibility / keyboard navigation
          startBtn.addEventListener('click', function (e) {
            CircleQuest.startMission(req.id);
          });
        }

        grid.appendChild(card);
      });

      homeScreen.appendChild(grid);

      // Reset Game Section
      const resetSec = document.createElement('div');
      resetSec.className = 'reset-container';
      const resetBtn = document.createElement('button');
      resetBtn.className = 'btn btn-danger';
      resetBtn.textContent = 'Reset Game Progress';
      resetBtn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        CircleQuest.resetGame();
      });
      resetBtn.addEventListener('click', function () {
        CircleQuest.resetGame();
      });
      resetSec.appendChild(resetBtn);
      homeScreen.appendChild(resetSec);
    },

    // Initialization on page load
    init: function () {
      const appContainer = document.getElementById('app-container');
      if (!appContainer) return;

      // Create App Structure if empty
      appContainer.innerHTML = `
        <header class="app-header">
          <div class="total-stars-badge">
            <span class="star-icon">★</span>
            <span>Total Stars: <strong id="total-stars-count">0</strong> / 12</span>
          </div>
          <button id="back-to-menu-btn" class="btn btn-secondary" style="display: none;">
            ← Back to menu
          </button>
        </header>
        <main id="main-content" style="flex: 1; width: 100%;">
          <div id="home-screen" class="home-screen"></div>
          <div id="mission-container" class="mission-view" style="display: none;"></div>
        </main>
      `;

      // Back to menu event listener
      const backBtn = document.getElementById('back-to-menu-btn');
      if (backBtn) {
        backBtn.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          CircleQuest.goHome();
        });
        backBtn.addEventListener('click', function () {
          CircleQuest.goHome();
        });
      }

      this.goHome();
    }
  };

  // HTML escaping helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Auto initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      CircleQuest.init();
    });
  } else {
    CircleQuest.init();
  }
})();
