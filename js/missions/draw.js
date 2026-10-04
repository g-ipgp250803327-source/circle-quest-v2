/**
 * Mission 3: Draw It!
 * Malaysian Year 6 KSSR Mathematics
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  // Level Definitions
  const LEVELS = [
    {
      id: 1,
      title: "Level 1",
      instruction: "Draw a circle with a radius of 3 cm.",
      requiredRadius: 3,
      guided: true
    },
    {
      id: 2,
      title: "Level 2",
      instruction: "Draw a circle with a radius of 4 cm.",
      requiredRadius: 4,
      guided: false
    },
    {
      id: 3,
      title: "Level 3 - Challenge",
      instruction: "The diameter is 10 cm. Draw the circle.",
      requiredRadius: 5,
      guided: false,
      givenDiameter: 10
    }
  ];

  // Overall Mission State
  let levelScores = { 1: 0, 2: 0, 3: 0 };
  let currentLevelIndex = 0;

  /**
   * Reset mission state to start from Level 1
   */
  function resetMission() {
    levelScores = { 1: 0, 2: 0, 3: 0 };
    currentLevelIndex = 0;
  }

  /**
   * Interactive Level Engine: runLevel(container, config, onFinished)
   */
  function runLevel(container, config, onFinished) {
    let state = {
      step: 1, // 1: Mark Centre, 2: Set Radius, 3: Draw Circle, 4: Complete
      centrePlaced: false,
      compassRadius: 2.0, // default slider value
      lockedRadius: null,
      circleDrawn: false,
      attempts: 0,
      hintVisible: false,
      feedbackMessage: '',
      feedbackType: '', // 'success' or 'error'
      isCompleted: false,
      starsEarned: 0,
      isAnimatingDraw: false
    };

    function resetLevelState() {
      state.step = 1;
      state.centrePlaced = false;
      state.compassRadius = 2.0;
      state.lockedRadius = null;
      state.circleDrawn = false;
      state.attempts = 0;
      state.hintVisible = false;
      state.feedbackMessage = '';
      state.feedbackType = '';
      state.isCompleted = false;
      state.starsEarned = 0;
      state.isAnimatingDraw = false;
    }

    resetLevelState();

    function render() {
      container.innerHTML = '';

      const wrapper = document.createElement('div');
      wrapper.className = 'm3-level-wrapper';

      // Header with Progress & Title
      const headerHtml = `
        <div class="m3-header">
          <span class="m3-progress-badge">Level ${config.id} of ${LEVELS.length}</span>
          <h2 class="m3-title">${escapeHtml(config.title)}</h2>
          <p class="m3-instruction">${escapeHtml(config.instruction)}</p>
        </div>
      `;

      // Step indicator bar
      const stepIndicatorHtml = `
        <div class="m3-step-indicator-bar">
          <div class="m3-step-chip ${state.step >= 1 ? 'active' : ''}">1. Mark Centre</div>
          <div class="m3-step-chip ${state.step >= 2 ? 'active' : ''}">2. Set Radius</div>
          <div class="m3-step-chip ${state.step >= 3 ? 'active' : ''}">3. Draw Circle</div>
        </div>
      `;

      // Compass & Ruler Drawing Canvas SVG
      const canvasSvgHtml = renderDrawingCanvasSvg(config, state);

      // Interactive Controls based on current step
      const controlsHtml = renderLevelControls(config, state);

      // Hint Banner (if non-guided and hint is toggled)
      let hintHtml = '';
      if (!config.guided && state.hintVisible) {
        let hintText = '';
        if (config.id === 2) {
          hintText = "Set the compass opening to the radius.";
        } else if (config.id === 3) {
          hintText = "The radius is half of the diameter.";
        }
        hintHtml = `<div class="m3-hint-box">💡 <strong>Hint:</strong> ${hintText}</div>`;
      }

      // Feedback Box
      let feedbackHtml = '';
      if (state.feedbackMessage) {
        feedbackHtml = `<div class="m3-feedback-box ${state.feedbackType}">${escapeHtml(state.feedbackMessage)}</div>`;
      }

      // Action Buttons
      let buttonsHtml = '';
      if (!state.isCompleted) {
        buttonsHtml = `
          <div class="m3-btn-row">
            ${
              !config.guided
                ? `<button id="m3-hint-btn" class="btn btn-secondary m3-btn">💡 ${state.hintVisible ? 'Hide Hint' : 'Hint'}</button>`
                : ''
            }
            <button id="m3-restart-btn" class="btn btn-secondary m3-btn">Start again</button>
            ${renderStepActionButton(config, state)}
          </div>
        `;
      } else {
        // Level completed view buttons
        const isLastLevel = config.id === LEVELS.length;
        buttonsHtml = `
          <div class="m3-completed-card">
            <div class="m3-completed-stars">
              ${renderStarIcons(state.starsEarned)}
            </div>
            <p class="m3-completed-msg">Level Complete! You earned ${state.starsEarned} star${state.starsEarned > 1 ? 's' : ''}.</p>
            <div class="m3-btn-row">
              <button id="m3-try-again-btn" class="btn btn-secondary m3-btn">Try again</button>
              <button id="m3-next-level-btn" class="btn btn-primary m3-btn">${isLastLevel ? 'See results' : 'Next level →'}</button>
            </div>
          </div>
        `;
      }

      wrapper.innerHTML = `
        ${headerHtml}
        ${stepIndicatorHtml}
        <div class="m3-canvas-card">
          ${canvasSvgHtml}
        </div>
        ${controlsHtml}
        ${hintHtml}
        ${feedbackHtml}
        ${buttonsHtml}
      `;

      container.appendChild(wrapper);
      attachInteractions(wrapper);
    }

    function attachInteractions(wrapper) {
      // Step 1: Mark Centre
      const markCentreBtn = wrapper.querySelector('#m3-mark-centre-btn');
      if (markCentreBtn) {
        const handleMark = function (e) {
          if (e) e.preventDefault();
          state.centrePlaced = true;
          state.step = 2;
          state.feedbackMessage = '';
          render();
        };
        markCentreBtn.addEventListener('pointerdown', handleMark);
        markCentreBtn.addEventListener('click', handleMark);
      }

      // Step 2: Slider input
      const slider = wrapper.querySelector('#m3-compass-slider');
      if (slider) {
        slider.addEventListener('input', function (e) {
          state.compassRadius = parseFloat(e.target.value);
          const liveValueEl = wrapper.querySelector('#m3-radius-live-val');
          if (liveValueEl) {
            liveValueEl.textContent = state.compassRadius.toFixed(1) + ' cm';
          }
          // Dynamic SVG update
          const needleArm = wrapper.querySelector('#m3-compass-pencil-arm');
          const radiusLine = wrapper.querySelector('#m3-ruler-radius-line');
          if (needleArm && radiusLine) {
            const pxPerCm = 24;
            const originX = 180;
            const pencilX = originX + state.compassRadius * pxPerCm;
            needleArm.setAttribute('x2', pencilX);
            radiusLine.setAttribute('x2', pencilX);
          }
        });
      }

      // Step 2: Lock Compass
      const lockRadiusBtn = wrapper.querySelector('#m3-lock-radius-btn');
      if (lockRadiusBtn) {
        const handleLock = function (e) {
          if (e) e.preventDefault();
          state.lockedRadius = state.compassRadius;
          state.step = 3;
          state.feedbackMessage = '';
          render();
        };
        lockRadiusBtn.addEventListener('pointerdown', handleLock);
        lockRadiusBtn.addEventListener('click', handleLock);
      }

      // Step 3: Draw Circle
      const drawCircleBtn = wrapper.querySelector('#m3-draw-circle-btn');
      if (drawCircleBtn) {
        const handleDraw = function (e) {
          if (e) e.preventDefault();
          if (state.isAnimatingDraw) return;

          state.isAnimatingDraw = true;
          state.circleDrawn = true;
          render();

          // After drawing animation finishes, validate level answer
          setTimeout(function () {
            state.isAnimatingDraw = false;
            validateLevelAnswer();
          }, 600);
        };
        drawCircleBtn.addEventListener('pointerdown', handleDraw);
        drawCircleBtn.addEventListener('click', handleDraw);
      }

      // Hint Toggle
      const hintBtn = wrapper.querySelector('#m3-hint-btn');
      if (hintBtn) {
        const handleHint = function (e) {
          if (e) e.preventDefault();
          state.hintVisible = !state.hintVisible;
          render();
        };
        hintBtn.addEventListener('pointerdown', handleHint);
        hintBtn.addEventListener('click', handleHint);
      }

      // Restart Level
      const restartBtn = wrapper.querySelector('#m3-restart-btn');
      if (restartBtn) {
        const handleRestart = function (e) {
          if (e) e.preventDefault();
          resetLevelState();
          render();
        };
        restartBtn.addEventListener('pointerdown', handleRestart);
        restartBtn.addEventListener('click', handleRestart);
      }

      // Try Again button (after completed level view)
      const tryAgainBtn = wrapper.querySelector('#m3-try-again-btn');
      if (tryAgainBtn) {
        const handleTryAgain = function (e) {
          if (e) e.preventDefault();
          resetLevelState();
          render();
        };
        tryAgainBtn.addEventListener('pointerdown', handleTryAgain);
        tryAgainBtn.addEventListener('click', handleTryAgain);
      }

      // Next Level / See Results button
      const nextLevelBtn = wrapper.querySelector('#m3-next-level-btn');
      if (nextLevelBtn) {
        const handleNext = function (e) {
          if (e) e.preventDefault();
          if (typeof onFinished === 'function') {
            onFinished(state.starsEarned);
          }
        };
        nextLevelBtn.addEventListener('pointerdown', handleNext);
        nextLevelBtn.addEventListener('click', handleNext);
      }
    }

    function validateLevelAnswer() {
      const radius = state.lockedRadius;
      const isCorrect = (radius === config.requiredRadius);

      if (isCorrect) {
        state.isCompleted = true;
        state.feedbackType = 'success';

        // Star calculation: 3 stars on first attempt, 2 stars on 2nd, 1 star on 3rd+
        if (state.attempts === 0) {
          state.starsEarned = 3;
        } else if (state.attempts === 1) {
          state.starsEarned = 2;
        } else {
          state.starsEarned = 1;
        }

        if (config.id === 3) {
          state.feedbackMessage = "The diameter is 10 cm, so the radius is 10 / 2 = 5 cm.";
        } else {
          state.feedbackMessage = `Great job! You drew a circle with a radius of ${radius} cm.`;
        }
      } else {
        state.attempts++;
        state.feedbackType = 'error';

        if (config.id === 3) {
          if (radius === 10) {
            state.feedbackMessage = "The compass opening is the radius, not the diameter. The radius is half of the diameter.";
          } else if (radius === 6) {
            state.feedbackMessage = "Remember: the radius is half of the diameter.";
          } else {
            state.feedbackMessage = `Your radius is ${radius} cm. Think: the diameter is 10 cm, so the radius is half of that.`;
          }
        } else {
          state.feedbackMessage = `Your radius is ${radius} cm. Set the compass opening to ${config.requiredRadius} cm.`;
        }
      }

      render();
    }

    render();
  }

  /**
   * Render Interactive Canvas SVG with Ruler, Compass & Circle
   */
  function renderDrawingCanvasSvg(config, state) {
    const width = 360;
    const height = 240;
    const originX = 180;
    const originY = 120;
    const pxPerCm = 24; // 1 cm = 24 pixels on canvas

    let centreDotHtml = '';
    if (state.centrePlaced) {
      centreDotHtml = `
        <circle cx="${originX}" cy="${originY}" r="5" fill="#1E293B" />
        <text x="${originX - 12}" y="${originY + 18}" font-size="14" font-weight="bold" fill="#1E293B">O</text>
      `;
    }

    // Ruler SVG (0 cm to 10 cm)
    let rulerTicksHtml = '';
    const rulerY = 200;
    const rulerStartX = 180;
    for (let i = 0; i <= 6; i++) {
      const x = rulerStartX + i * pxPerCm;
      rulerTicksHtml += `
        <line x1="${x}" y1="${rulerY}" x2="${x}" y2="${rulerY - 10}" stroke="#64748B" stroke-width="1.5" />
        <text x="${x}" y="${rulerY + 14}" font-size="11" text-anchor="middle" fill="#64748B">${i}</text>
      `;
      if (i < 6) {
        const midX = rulerStartX + (i + 0.5) * pxPerCm;
        rulerTicksHtml += `<line x1="${midX}" y1="${rulerY}" x2="${midX}" y2="${rulerY - 6}" stroke="#94A3B8" stroke-width="1" />`;
      }
    }

    const rulerHtml = `
      <g class="m3-ruler-group">
        <rect x="${rulerStartX - 10}" y="${rulerY - 15}" width="${6 * pxPerCm + 20}" height="32" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" rx="4"/>
        <line x1="${rulerStartX}" y1="${rulerY}" x2="${rulerStartX + 6 * pxPerCm}" y2="${rulerY}" stroke="#64748B" stroke-width="1.5"/>
        ${rulerTicksHtml}
        <text x="${rulerStartX + 6 * pxPerCm + 14}" y="${rulerY + 4}" font-size="11" font-weight="bold" fill="#64748B">cm</text>
      </g>
    `;

    // Compass SVG
    let compassHtml = '';
    const radiusCm = state.lockedRadius !== null ? state.lockedRadius : state.compassRadius;
    const pencilX = originX + radiusCm * pxPerCm;

    if (state.centrePlaced && state.step >= 2) {
      const pivotY = originY - 50;
      compassHtml = `
        <g class="m3-compass-group ${config.guided && state.step === 2 ? 'pulse-element' : ''}">
          <!-- Joint -->
          <circle cx="${originX}" cy="${pivotY}" r="6" fill="#4F46E5" />
          <!-- Needle Arm (Fixed at Centre O) -->
          <line x1="${originX}" y1="${pivotY}" x2="${originX}" y2="${originY}" stroke="#475569" stroke-width="3" stroke-linecap="round" />
          <!-- Pencil Arm (Adjustable to radius) -->
          <line id="m3-compass-pencil-arm" x1="${originX}" y1="${pivotY}" x2="${pencilX}" y2="${originY}" stroke="#4F46E5" stroke-width="3" stroke-linecap="round" />
          <!-- Pencil Tip -->
          <circle cx="${pencilX}" cy="${originY}" r="3" fill="#F59E0B" />
        </g>
      `;
    }

    // Guidance Arrow for Guided level
    let guidanceArrowHtml = '';
    if (config.guided && state.step === 2) {
      guidanceArrowHtml = `
        <g class="m3-guidance-arrow">
          <path d="M ${pencilX} ${originY - 25} L ${pencilX} ${originY - 10}" stroke="#F59E0B" stroke-width="3" marker-end="url(#arrowhead)"/>
          <text x="${pencilX}" y="${originY - 30}" font-size="12" font-weight="bold" fill="#D97706" text-anchor="middle">Radius = 3 cm</text>
        </g>
      `;
    }

    // Circle SVG
    let circleSvgHtml = '';
    if (state.circleDrawn) {
      const rPx = radiusCm * pxPerCm;
      circleSvgHtml = `
        <g class="m3-drawn-circle-group">
          <circle cx="${originX}" cy="${originY}" r="${rPx}" fill="none" stroke="#4F46E5" stroke-width="3.5" class="${state.isAnimatingDraw ? 'm3-circle-draw-anim' : ''}" />
          <!-- Radius Line -->
          <line x1="${originX}" y1="${originY}" x2="${originX + rPx}" y2="${originY}" stroke="#F59E0B" stroke-width="2.5" />
          <text x="${originX + rPx / 2}" y="${originY - 6}" font-size="12" font-weight="bold" fill="#D97706" text-anchor="middle">r = ${radiusCm} cm</text>
        </g>
      `;
    }

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="m3-canvas-svg">
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#F59E0B" />
          </marker>
        </defs>

        <!-- Background grid lines -->
        <line x1="20" y1="${originY}" x2="340" y2="${originY}" stroke="#E2E8F0" stroke-dasharray="4 4" />
        <line x1="${originX}" y1="10" x2="${originX}" y2="230" stroke="#E2E8F0" stroke-dasharray="4 4" />

        ${rulerHtml}
        ${circleSvgHtml}
        ${centreDotHtml}
        ${compassHtml}
        ${guidanceArrowHtml}
      </svg>
    `;
  }

  /**
   * Render Level Controls (Slider, step guidance)
   */
  function renderLevelControls(config, state) {
    if (state.step === 1) {
      return `
        <div class="m3-step-control-card">
          <p class="m3-step-instruction">Step 1: Mark the centre point <strong>O</strong> on your paper.</p>
          ${config.guided ? '<p class="m3-guided-hint">Tap "Mark Centre O" to place the centre point.</p>' : ''}
        </div>
      `;
    }

    if (state.step === 2) {
      return `
        <div class="m3-step-control-card">
          <div class="m3-slider-header">
            <label for="m3-compass-slider" class="m3-slider-label">Compass Opening (Radius):</label>
            <span id="m3-radius-live-val" class="m3-radius-badge">${state.compassRadius.toFixed(1)} cm</span>
          </div>
          <input type="range" id="m3-compass-slider" class="m3-slider ${config.guided ? 'pulse-element' : ''}" min="0" max="6" step="0.5" value="${state.compassRadius}">
          <div class="m3-slider-ticks">
            <span>0 cm</span>
            <span>2 cm</span>
            <span>4 cm</span>
            <span>6 cm</span>
          </div>
          ${config.guided ? '<p class="m3-guided-hint">Drag the slider to set the compass opening to 3 cm.</p>' : ''}
        </div>
      `;
    }

    if (state.step === 3) {
      return `
        <div class="m3-step-control-card">
          <p class="m3-step-instruction">Step 3: Rotate compass 360° to draw the circle with radius <strong>${state.lockedRadius} cm</strong>.</p>
          ${config.guided ? '<p class="m3-guided-hint">Tap "Draw Circle" to sweep the compass and draw the circle.</p>' : ''}
        </div>
      `;
    }

    return '';
  }

  /**
   * Render Step Primary Action Button
   */
  function renderStepActionButton(config, state) {
    if (state.step === 1) {
      return `<button id="m3-mark-centre-btn" class="btn btn-primary m3-btn ${config.guided ? 'pulse-element' : ''}">Mark Centre O</button>`;
    }
    if (state.step === 2) {
      return `<button id="m3-lock-radius-btn" class="btn btn-primary m3-btn">Lock Compass Radius</button>`;
    }
    if (state.step === 3) {
      return `<button id="m3-draw-circle-btn" class="btn btn-primary m3-btn ${config.guided ? 'pulse-element' : ''}" ${state.isAnimatingDraw ? 'disabled' : ''}>Draw Circle ✏️</button>`;
    }
    return '';
  }

  /**
   * Render Star Icons HTML
   */
  function renderStarIcons(count) {
    let html = '';
    for (let i = 1; i <= 3; i++) {
      html += `<span class="m3-star ${i <= count ? 'filled' : ''}">★</span>`;
    }
    return html;
  }

  /**
   * Render Final Summary Screen after Level 3
   */
  function renderSummaryScreen(container) {
    container.innerHTML = '';

    // Calculate Mission stars: average of 3 level stars, rounded to nearest whole number, minimum 1
    const total = levelScores[1] + levelScores[2] + levelScores[3];
    const missionStars = Math.max(1, Math.round(total / 3));

    // Award stars with CircleQuest API
    CircleQuest.awardStars('draw', missionStars);

    const wrapper = document.createElement('div');
    wrapper.className = 'm3-summary-wrapper';

    wrapper.innerHTML = `
      <div class="m3-summary-card">
        <div class="m3-summary-header">
          <div class="m3-trophy">🎨</div>
          <h2>Mission Complete!</h2>
          <p class="m3-summary-subtitle">Mission 3: Draw It! Passed</p>
        </div>

        <div class="m3-overall-stars">
          ${renderStarIcons(missionStars)}
          <span class="m3-star-score-text">(${missionStars} / 3 Stars)</span>
        </div>

        <!-- Level Breakdown -->
        <div class="m3-breakdown-box">
          <h3 class="m3-section-title">Level Breakdown</h3>
          <div class="m3-level-score-row">
            <span>Level 1 (Radius 3 cm):</span>
            <span>${renderStarIcons(levelScores[1])}</span>
          </div>
          <div class="m3-level-score-row">
            <span>Level 2 (Radius 4 cm):</span>
            <span>${renderStarIcons(levelScores[2])}</span>
          </div>
          <div class="m3-level-score-row">
            <span>Level 3 (Diameter 10 cm):</span>
            <span>${renderStarIcons(levelScores[3])}</span>
          </div>
        </div>

        <!-- Key Idea Box -->
        <div class="m3-keyidea-box">
          <h3>💡 Key Idea</h3>
          <p><strong>The diameter is 2 x the radius</strong></p>
        </div>

        <!-- SVG Diagram showing Centre, Radius, Diameter -->
        <div class="m3-diagram-box">
          <h3 class="m3-section-title">Circle Parts Diagram</h3>
          ${renderCirclePartsSvg()}
        </div>

        <!-- Navigation Buttons -->
        <div class="m3-btn-row" style="margin-top: 10px;">
          <button id="m3-play-again-btn" class="btn btn-secondary m3-btn-large">Play again</button>
          <button id="m3-menu-btn" class="btn btn-primary m3-btn-large">Back to menu</button>
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    // Play again listener
    const playAgainBtn = wrapper.querySelector('#m3-play-again-btn');
    if (playAgainBtn) {
      const handlePlayAgain = function (e) {
        if (e) e.preventDefault();
        resetMission();
        startMissionFlow(container);
      };
      playAgainBtn.addEventListener('pointerdown', handlePlayAgain);
      playAgainBtn.addEventListener('click', handlePlayAgain);
    }

    // Back to menu listener
    const menuBtn = wrapper.querySelector('#m3-menu-btn');
    if (menuBtn) {
      const handleMenu = function (e) {
        if (e) e.preventDefault();
        CircleQuest.goHome();
      };
      menuBtn.addEventListener('pointerdown', handleMenu);
      menuBtn.addEventListener('click', handleMenu);
    }
  }

  /**
   * Render SVG diagram with Centre, Radius, and Diameter labelled
   */
  function renderCirclePartsSvg() {
    const size = 220;
    const cx = size / 2;
    const cy = size / 2;
    const r = 70;

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display: block; margin: 0 auto;">
        <!-- Circle -->
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F8FAFC" stroke="#4F46E5" stroke-width="3" />

        <!-- Diameter line (Edge to Edge through Centre) -->
        <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#0EA5E9" stroke-width="3" stroke-dasharray="5 3" />

        <!-- Radius line (Centre to top edge) -->
        <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r}" stroke="#F59E0B" stroke-width="3.5" />

        <!-- Centre Dot O -->
        <circle cx="${cx}" cy="${cy}" r="5" fill="#1E293B" />

        <!-- Labels -->
        <text x="${cx + 8}" y="${cy + 22}" font-size="12" font-weight="bold" fill="#1E293B">Centre (O)</text>
        <text x="${cx + 8}" y="${cy - r / 2}" font-size="12" font-weight="bold" fill="#D97706">Radius</text>
        <text x="${cx - r + 10}" y="${cy - 8}" font-size="12" font-weight="bold" fill="#0284C7">Diameter</text>
      </svg>
    `;
  }

  /**
   * Main Level Runner Loop
   */
  function startMissionFlow(container) {
    if (currentLevelIndex >= LEVELS.length) {
      renderSummaryScreen(container);
    } else {
      runLevel(container, LEVELS[currentLevelIndex], function (starsEarned) {
        levelScores[LEVELS[currentLevelIndex].id] = starsEarned;
        currentLevelIndex++;
        startMissionFlow(container);
      });
    }
  }

  // Helper for escaping HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Register Mission 3
  CircleQuest.registerMission({
    id: 'draw',
    title: 'Mission 3: Draw It!',
    start: function (container) {
      resetMission();
      startMissionFlow(container);
    }
  });
})();
