/**
 * Mission 2: Real-Life Mission
 * Malaysian Year 6 KSSR Mathematics
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  // Scenario definitions
  const SCENARIOS = [
    {
      id: 'pizza',
      type: 'number',
      title: 'Pizza Box',
      story: 'The pizza has a radius of 15 cm.',
      question: 'How wide is the box it needs? (the diameter)',
      correctAnswer: 30,
      unit: 'cm',
      hint: 'The diameter is twice the radius.',
      wrongExplanation1: 'Remember, diameter = 2 × radius. Try multiplying the radius by 2!',
      wrongExplanation2: 'The diameter is 2 × 15 cm = 30 cm. The box needs to be 30 cm wide.',
      correctReason: 'Because diameter = 2 × radius (15 cm × 2 = 30 cm).'
    },
    {
      id: 'wheel',
      type: 'number',
      title: 'Bicycle Wheel',
      story: 'The wheel has a diameter of 60 cm.',
      question: 'How long is one spoke from the centre to the tyre? (the radius)',
      correctAnswer: 30,
      unit: 'cm',
      hint: 'The radius is half of the diameter.',
      wrongExplanation1: 'Remember, radius = diameter / 2. Try dividing the diameter by 2!',
      wrongExplanation2: 'The radius is 60 cm / 2 = 30 cm. One spoke is 30 cm long.',
      correctReason: 'Because radius = diameter / 2 (60 cm ÷ 2 = 30 cm).'
    },
    {
      id: 'table',
      type: 'tap_centre',
      title: 'Round Table',
      story: 'Where should the vase be placed so that it is exactly in the middle of the table?',
      question: 'Tap on the table drawing to place the vase.',
      hint: 'The middle of a circle is its centre point.',
      wrongExplanation1: 'The middle of the table is its centre point. Try tapping closer to the centre!',
      wrongExplanation2: 'The vase belongs at the centre point in the middle of the table.',
      correctReason: 'You placed the vase right at the centre of the round table!'
    },
    {
      id: 'coin',
      type: 'tap_line',
      title: 'Coin Lines',
      story: 'Three lines are drawn across a coin.',
      question: 'Which line is the diameter of the coin?',
      correctLineId: 'line-a',
      hint: 'The diameter is a straight line going from edge to edge through the centre.',
      wrongExplanation1: 'Remember, the diameter goes straight through the centre from edge to edge. Try another line!',
      wrongExplanation2: 'Line A is the diameter because it passes through the centre from edge to edge.',
      correctReason: 'Line A is the diameter because it goes from edge to edge through the centre!'
    },
    {
      id: 'clock',
      type: 'number',
      title: 'Wall Clock',
      story: 'The minute hand is 10 cm long and goes from the centre to the edge of the clock.',
      question: 'What is the diameter of the clock?',
      correctAnswer: 20,
      unit: 'cm',
      hint: 'The minute hand is the radius. The diameter is twice the radius.',
      wrongExplanation1: 'The minute hand is the radius (10 cm). Remember, diameter = 2 × radius!',
      wrongExplanation2: 'The diameter is 2 × 10 cm = 20 cm.',
      correctReason: 'Because the minute hand is the radius (10 cm), the diameter is 2 × 10 cm = 20 cm!'
    }
  ];

  // Mission State
  let state = {
    currentScenarioIndex: 0,
    firstTryCorrectCount: 0,
    attempts: 0, // 0 = no attempt yet, 1 = 1st wrong attempt, 2 = 2nd attempt or solved
    isAnsweredCorrectly: false,
    isCompletedScenario: false,
    hintVisible: false,
    userInputValue: '',
    tappedPoint: null, // { x, y } in SVG coordinates
    tappedLineId: null,
    pairTalkText: '',
    feedbackMessage: '',
    feedbackType: '' // 'success', 'error', 'info'
  };

  // Helper: Reset mission state
  function resetMissionState() {
    state = {
      currentScenarioIndex: 0,
      firstTryCorrectCount: 0,
      attempts: 0,
      isAnsweredCorrectly: false,
      isCompletedScenario: false,
      hintVisible: false,
      userInputValue: '',
      tappedPoint: null,
      tappedLineId: null,
      pairTalkText: '',
      feedbackMessage: '',
      feedbackType: ''
    };
  }

  // Reset scenario specific variables
  function resetScenarioState() {
    state.attempts = 0;
    state.isAnsweredCorrectly = false;
    state.isCompletedScenario = false;
    state.hintVisible = false;
    state.userInputValue = '';
    state.tappedPoint = null;
    state.tappedLineId = null;
    state.pairTalkText = '';
    state.feedbackMessage = '';
    state.feedbackType = '';
  }

  // Render SVG illustrations based on scenario ID
  function renderScenarioSvg(scenario) {
    const size = 280;
    const cx = size / 2;
    const cy = size / 2;

    if (scenario.id === 'pizza') {
      const boxSize = 220;
      const boxX = (size - boxSize) / 2;
      const boxY = (size - boxSize) / 2;
      const pizzaR = 95;

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="m2-svg">
          <rect x="${boxX}" y="${boxY}" width="${boxSize}" height="${boxSize}" fill="#FFF7ED" stroke="#C2410C" stroke-width="4" rx="8" />
          <text x="${boxX + 10}" y="${boxY + 24}" fill="#9A3412" font-size="14" font-weight="700">Pizza Box</text>

          <circle cx="${cx}" cy="${cy}" r="${pizzaR}" fill="#FDE047" stroke="#D97706" stroke-width="5" />

          <circle cx="${cx - 40}" cy="${cy - 30}" r="12" fill="#DC2626" />
          <circle cx="${cx + 35}" cy="${cy - 40}" r="12" fill="#DC2626" />
          <circle cx="${cx - 20}" cy="${cy + 45}" r="12" fill="#DC2626" />
          <circle cx="${cx + 40}" cy="${cy + 30}" r="12" fill="#DC2626" />
          <circle cx="${cx}" cy="${cy - 50}" r="10" fill="#DC2626" />

          <line x1="${cx}" y1="${cy}" x2="${cx + pizzaR}" y2="${cy}" stroke="#2563EB" stroke-width="4" stroke-dasharray="4 2" />
          <circle cx="${cx}" cy="${cy}" r="5" fill="#1E293B" />

          <rect x="${cx + 15}" y="${cy - 28}" width="75" height="22" fill="#FFFFFF" rx="4" stroke="#2563EB" stroke-width="1"/>
          <text x="${cx + 22}" y="${cy - 13}" fill="#1E40AF" font-size="13" font-weight="700">r = 15 cm</text>
        </svg>
      `;
    }

    if (scenario.id === 'wheel') {
      const r = 100;
      let spokes = '';
      for (let angle = 0; angle < 360; angle += 30) {
        const rad = (angle * Math.PI) / 180;
        const x2 = cx + r * Math.cos(rad);
        const y2 = cy + r * Math.sin(rad);
        spokes += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#94A3B8" stroke-width="2"/>`;
      }

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="m2-svg">
          <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="none" stroke="#1E293B" stroke-width="14" />
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="#F8FAFC" stroke="#64748B" stroke-width="4" />

          ${spokes}

          <circle cx="${cx}" cy="${cy}" r="12" fill="#475569" stroke="#0F172A" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="5" fill="#FFFFFF" />

          <line x1="${cx - r}" y1="${cy + 60}" x2="${cx + r}" y2="${cy + 60}" stroke="#0EA5E9" stroke-width="3" />
          <line x1="${cx - r}" y1="${cy + 52}" x2="${cx - r}" y2="${cy + 68}" stroke="#0EA5E9" stroke-width="3" />
          <line x1="${cx + r}" y1="${cy + 52}" x2="${cx + r}" y2="${cy + 68}" stroke="#0EA5E9" stroke-width="3" />

          <rect x="${cx - 55}" y="${cy + 46}" width="110" height="24" fill="#FFFFFF" rx="4" stroke="#0EA5E9" stroke-width="1.5"/>
          <text x="${cx}" y="${cy + 63}" fill="#0369A1" font-size="13" font-weight="700" text-anchor="middle">diameter = 60 cm</text>
        </svg>
      `;
    }

    if (scenario.id === 'table') {
      const tableR = 100;

      let vaseSvg = '';
      if (state.tappedPoint) {
        vaseSvg = `
          <g transform="translate(${state.tappedPoint.x}, ${state.tappedPoint.y - 12})">
            <path d="M-8,16 C-12,8 -4,0 -6,-10 L6,-10 C4,0 12,8 8,16 Z" fill="#8B5CF6" stroke="#5B21B6" stroke-width="2"/>
            <circle cx="0" cy="-12" r="4" fill="#F472B6" />
          </g>
        `;
      }

      let trueCentreSvg = '';
      if (state.isCompletedScenario || state.attempts >= 2) {
        trueCentreSvg = `
          <circle cx="${cx}" cy="${cy}" r="6" fill="#10B981" stroke="#FFFFFF" stroke-width="2"/>
          <text x="${cx}" y="${cy + 22}" fill="#065F46" font-size="12" font-weight="800" text-anchor="middle">True Centre</text>
        `;
      }

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="m2-svg" id="m2-table-svg" style="cursor: pointer; touch-action: manipulation;">
          <circle cx="${cx}" cy="${cy}" r="${tableR + 8}" fill="#78350F" stroke="#451A03" stroke-width="4"/>
          <circle cx="${cx}" cy="${cy}" r="${tableR}" fill="#FDE68A" stroke="#D97706" stroke-width="3"/>

          <circle cx="${cx}" cy="${cy}" r="75" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="10 15"/>
          <circle cx="${cx}" cy="${cy}" r="45" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="8 12"/>

          ${vaseSvg}
          ${trueCentreSvg}
        </svg>
      `;
    }

    if (scenario.id === 'coin') {
      const coinR = 100;

      const isLineA = state.tappedLineId === 'line-a';
      const isLineB = state.tappedLineId === 'line-b';
      const isLineC = state.tappedLineId === 'line-c';

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="m2-svg">
          <circle cx="${cx}" cy="${cy}" r="${coinR}" fill="#FEF08A" stroke="#CA8A04" stroke-width="6"/>
          <circle cx="${cx}" cy="${cy}" r="${coinR - 12}" fill="none" stroke="#EAB308" stroke-width="2" stroke-dasharray="4 4"/>

          <circle cx="${cx}" cy="${cy}" r="5" fill="#1E293B"/>

          <g id="line-a" class="m2-coin-line-group" style="cursor: pointer;">
            <line x1="${cx - coinR}" y1="${cy}" x2="${cx + coinR}" y2="${cy}" stroke="transparent" stroke-width="28"/>
            <line x1="${cx - coinR}" y1="${cy}" x2="${cx + coinR}" y2="${cy}" stroke="${isLineA ? '#10B981' : '#2563EB'}" stroke-width="${isLineA ? 5 : 3}"/>
            <rect x="${cx - 20}" y="${cy - 22}" width="40" height="18" fill="#FFFFFF" rx="4" stroke="${isLineA ? '#10B981' : '#2563EB'}" stroke-width="1.5"/>
            <text x="${cx}" y="${cy - 9}" fill="${isLineA ? '#065F46' : '#1E40AF'}" font-size="12" font-weight="800" text-anchor="middle">Line A</text>
          </g>

          <g id="line-b" class="m2-coin-line-group" style="cursor: pointer;">
            <line x1="${cx - 70}" y1="${cy - 50}" x2="${cx + 70}" y2="${cy - 50}" stroke="transparent" stroke-width="28"/>
            <line x1="${cx - 70}" y1="${cy - 50}" x2="${cx + 70}" y2="${cy - 50}" stroke="${isLineB ? '#EF4444' : '#D97706'}" stroke-width="${isLineB ? 5 : 3}"/>
            <rect x="${cx - 20}" y="${cy - 72}" width="40" height="18" fill="#FFFFFF" rx="4" stroke="${isLineB ? '#EF4444' : '#D97706'}" stroke-width="1.5"/>
            <text x="${cx}" y="${cy - 59}" fill="${isLineB ? '#991B1B' : '#92400E'}" font-size="12" font-weight="800" text-anchor="middle">Line B</text>
          </g>

          <g id="line-c" class="m2-coin-line-group" style="cursor: pointer;">
            <line x1="${cx}" y1="${cy}" x2="${cx + 70}" y2="${cy + 70}" stroke="transparent" stroke-width="28"/>
            <line x1="${cx}" y1="${cy}" x2="${cx + 70}" y2="${cy + 70}" stroke="${isLineC ? '#EF4444' : '#7C3AED'}" stroke-width="${isLineC ? 5 : 3}"/>
            <rect x="${cx + 35}" y="${cy + 25}" width="40" height="18" fill="#FFFFFF" rx="4" stroke="${isLineC ? '#EF4444' : '#7C3AED'}" stroke-width="1.5"/>
            <text x="${cx + 55}" y="${cy + 38}" fill="${isLineC ? '#991B1B' : '#5B21B6'}" font-size="12" font-weight="800" text-anchor="middle">Line C</text>
          </g>
        </svg>
      `;
    }

    if (scenario.id === 'clock') {
      const clockR = 95;
      let ticks = '';
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = cx + (clockR - 12) * Math.sin(angle);
        const y1 = cy - (clockR - 12) * Math.cos(angle);
        const x2 = cx + clockR * Math.sin(angle);
        const y2 = cy - clockR * Math.cos(angle);
        ticks += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#334155" stroke-width="3"/>`;
      }

      return `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="m2-svg">
          <circle cx="${cx}" cy="${cy}" r="${clockR + 8}" fill="#0EA5E9" stroke="#0284C7" stroke-width="4"/>
          <circle cx="${cx}" cy="${cy}" r="${clockR}" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>

          ${ticks}

          <line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 50}" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>
          <line x1="${cx}" y1="${cy}" x2="${cx + clockR}" y2="${cy}" stroke="#DC2626" stroke-width="5" stroke-linecap="round"/>

          <circle cx="${cx}" cy="${cy}" r="7" fill="#1E293B"/>

          <rect x="${cx + 15}" y="${cy + 10}" width="75" height="22" fill="#FFFFFF" rx="4" stroke="#DC2626" stroke-width="1.5"/>
          <text x="${cx + 22}" y="${cy + 25}" fill="#991B1B" font-size="13" font-weight="700">10 cm hand</text>
        </svg>
      `;
    }

    return '';
  }

  // Render input control element according to scenario type
  function renderScenarioControl(scenario) {
    if (scenario.type === 'number') {
      return `
        <div class="m2-input-group">
          <input type="text" inputmode="decimal" id="m2-number-input" class="m2-number-input" placeholder="Enter number" value="${escapeHtml(state.userInputValue)}" ${state.isCompletedScenario ? 'disabled' : ''}>
          <span class="m2-unit-tag">${scenario.unit}</span>
        </div>
      `;
    }

    if (scenario.type === 'tap_centre') {
      return `
        <div class="m2-tap-instruction">
          ${state.tappedPoint ? 'Vase placed! Tap Check or tap on the table again to adjust.' : 'Tap anywhere on the table above to place the vase.'}
        </div>
      `;
    }

    if (scenario.type === 'tap_line') {
      return `
        <div class="m2-tap-instruction">
          ${state.tappedLineId ? 'Line selected! Tap Check to verify.' : 'Tap on Line A, B, or C on the coin above.'}
        </div>
      `;
    }

    return '';
  }

  // Check user answer logic
  function checkAnswer(scenario) {
    let isCorrect = false;

    if (scenario.type === 'number') {
      const cleanedInput = state.userInputValue.trim();
      const numVal = parseFloat(cleanedInput);
      if (!isNaN(numVal) && numVal === scenario.correctAnswer) {
        isCorrect = true;
      }
    } else if (scenario.type === 'tap_centre') {
      if (state.tappedPoint) {
        const size = 280;
        const cx = size / 2;
        const cy = size / 2;
        const tableR = 100;
        const dist = Math.hypot(state.tappedPoint.x - cx, state.tappedPoint.y - cy);
        // Accept within 15% of table radius (15px)
        if (dist <= tableR * 0.15) {
          isCorrect = true;
        }
      }
    } else if (scenario.type === 'tap_line') {
      if (state.tappedLineId === scenario.correctLineId) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      if (state.attempts === 0) {
        state.firstTryCorrectCount++;
      }
      state.isAnsweredCorrectly = true;
      state.isCompletedScenario = true;
      state.feedbackMessage = `✅ Correct! ${scenario.correctReason}`;
      state.feedbackType = 'success';
    } else {
      state.attempts++;
      if (state.attempts === 1) {
        // First wrong attempt
        state.feedbackMessage = scenario.wrongExplanation1;
        state.feedbackType = 'error';
      } else {
        // Second wrong attempt - reveal answer
        state.isCompletedScenario = true;
        state.feedbackMessage = `Incorrect. ${scenario.wrongExplanation2}`;
        state.feedbackType = 'error';
      }
    }
  }

  // Attach pointer events
  function attachScenarioInteractions(wrapper, container, scenario) {
    if (scenario.id === 'table') {
      const tableSvg = wrapper.querySelector('#m2-table-svg');
      if (tableSvg) {
        function handleTableTap(e) {
          if (state.isCompletedScenario) return;
          e.preventDefault();

          const rect = tableSvg.getBoundingClientRect();
          const clientX = e.clientX || (e.touches && e.touches[0].clientX);
          const clientY = e.clientY || (e.touches && e.touches[0].clientY);

          if (clientX === undefined || clientY === undefined) return;

          const size = 280;
          const svgX = ((clientX - rect.left) / rect.width) * size;
          const svgY = ((clientY - rect.top) / rect.height) * size;

          state.tappedPoint = { x: svgX, y: svgY };
          renderScenarioView(container);
        }

        tableSvg.addEventListener('pointerdown', handleTableTap);
      }
    }

    if (scenario.id === 'coin') {
      const lineGroups = wrapper.querySelectorAll('.m2-coin-line-group');
      lineGroups.forEach(group => {
        function handleLineTap(e) {
          if (state.isCompletedScenario) return;
          e.preventDefault();
          state.tappedLineId = group.id;
          renderScenarioView(container);
        }

        group.addEventListener('pointerdown', handleLineTap);
      });
    }

    // Number input listener
    const numInput = wrapper.querySelector('#m2-number-input');
    if (numInput) {
      numInput.addEventListener('input', function (e) {
        state.userInputValue = e.target.value;
      });
    }

    // Pair talk input listener
    const pairTalkInput = wrapper.querySelector('#m2-pairtalk-input');
    if (pairTalkInput) {
      pairTalkInput.addEventListener('input', function (e) {
        state.pairTalkText = e.target.value;
      });
    }

    // Hint button listener
    const hintBtn = wrapper.querySelector('#m2-hint-btn');
    if (hintBtn) {
      const handleHint = function (e) {
        if (e) e.preventDefault();
        state.hintVisible = !state.hintVisible;
        renderScenarioView(container);
      };
      hintBtn.addEventListener('pointerdown', handleHint);
      hintBtn.addEventListener('click', handleHint);
    }

    // Check / Next button listener
    const actionBtn = wrapper.querySelector('#m2-action-btn');
    if (actionBtn) {
      const handleAction = function (e) {
        if (e) e.preventDefault();

        if (state.isCompletedScenario) {
          // Go to next scenario or complete mission
          state.currentScenarioIndex++;
          resetScenarioState();
          renderMissionView(container);
        } else {
          // Validate input presence before checking
          if (scenario.type === 'number' && state.userInputValue.trim() === '') {
            state.feedbackMessage = 'Please enter a number first.';
            state.feedbackType = 'info';
            renderScenarioView(container);
            return;
          }
          if (scenario.type === 'tap_centre' && !state.tappedPoint) {
            state.feedbackMessage = 'Please tap on the table to place the vase first.';
            state.feedbackType = 'info';
            renderScenarioView(container);
            return;
          }
          if (scenario.type === 'tap_line' && !state.tappedLineId) {
            state.feedbackMessage = 'Please tap on one of the lines on the coin first.';
            state.feedbackType = 'info';
            renderScenarioView(container);
            return;
          }

          checkAnswer(scenario);
          renderScenarioView(container);
        }
      };

      actionBtn.addEventListener('pointerdown', handleAction);
      actionBtn.addEventListener('click', handleAction);
    }
  }

  // Render scenario view
  function renderScenarioView(container) {
    container.innerHTML = '';
    const scenario = SCENARIOS[state.currentScenarioIndex];

    const wrapper = document.createElement('div');
    wrapper.className = 'm2-mission-wrapper';
    wrapper.innerHTML = `
      <div class="m2-header">
        <span class="m2-progress-badge">Scenario ${state.currentScenarioIndex + 1} of ${SCENARIOS.length}</span>
        <h2 class="m2-title">Mission 2: Real-Life Mission</h2>
      </div>

      <div class="m2-card">
        <h3 class="m2-scenario-title">${scenario.title}</h3>
        <p class="m2-story">${scenario.story}</p>

        <div class="m2-svg-container">
          ${renderScenarioSvg(scenario)}
        </div>

        <p class="m2-question"><strong>${scenario.question}</strong></p>

        <div class="m2-control-container">
          ${renderScenarioControl(scenario)}
        </div>

        <!-- Buttons row: Hint & Check/Next -->
        <div class="m2-btn-row">
          <button id="m2-hint-btn" class="btn btn-secondary m2-btn">
            💡 ${state.hintVisible ? 'Hide Hint' : 'Hint'}
          </button>
          <button id="m2-action-btn" class="btn btn-primary m2-btn">
            ${state.isCompletedScenario ? 'Next Scenario →' : 'Check'}
          </button>
        </div>

        <!-- Hint Banner -->
        ${
          state.hintVisible
            ? `<div class="m2-hint-box">💡 <strong>Hint:</strong> ${scenario.hint}</div>`
            : ''
        }

        <!-- Feedback Message -->
        ${
          state.feedbackMessage
            ? `<div class="m2-feedback-box ${state.feedbackType}">${state.feedbackMessage}</div>`
            : ''
        }

        <!-- Pair Talk Section -->
        <div class="m2-pairtalk-section">
          <label for="m2-pairtalk-input" class="m2-pairtalk-label">Explain your answer</label>
          <input type="text" id="m2-pairtalk-input" class="m2-pairtalk-input" placeholder="e.g. Because diameter is 2 times the radius" value="${escapeHtml(state.pairTalkText)}">
          <span class="m2-pairtalk-sub">Tell your partner how you know.</span>
        </div>
      </div>
    `;

    container.appendChild(wrapper);
    attachScenarioInteractions(wrapper, container, scenario);
  }

  // Render completion screen with star scoring
  function renderCompletionScreen(container) {
    container.innerHTML = '';

    let stars = 1;
    if (state.firstTryCorrectCount === 5) {
      stars = 3;
    } else if (state.firstTryCorrectCount >= 3) {
      stars = 2;
    } else {
      stars = 1;
    }

    // Award stars using CircleQuest API
    CircleQuest.awardStars('reallife', stars);

    let starIconsHtml = '';
    for (let i = 1; i <= 3; i++) {
      starIconsHtml += `<span class="m2-star ${i <= stars ? 'filled' : ''}">★</span>`;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'm2-completion-wrapper';

    wrapper.innerHTML = `
      <div class="m2-completion-card">
        <div class="m2-completion-header">
          <div class="m2-trophy-icon">🏆</div>
          <h2>Mission Complete!</h2>
          <p class="m2-completion-subtitle">Mission 2: Real-Life Mission Passed!</p>
        </div>

        <div class="m2-stars-row">
          ${starIconsHtml}
        </div>

        <div class="m2-score-badge">
          Correct on first try: <strong>${state.firstTryCorrectCount} / 5</strong>
        </div>

        <div class="m2-summary-box">
          <h3>Summary</h3>
          <p>The radius goes from the centre to the edge. The diameter goes across the circle through the centre. The diameter is twice the radius.</p>
        </div>

        <div class="m2-completion-footer">
          <button id="m2-home-btn" class="btn btn-primary m2-btn-large">
            Back to Menu
          </button>
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    // Back to Menu event listener
    const homeBtn = wrapper.querySelector('#m2-home-btn');
    if (homeBtn) {
      const goHome = function (e) {
        if (e) e.preventDefault();
        CircleQuest.goHome();
      };
      homeBtn.addEventListener('pointerdown', goHome);
      homeBtn.addEventListener('click', goHome);
    }
  }

  // Router for mission views
  function renderMissionView(container) {
    if (state.currentScenarioIndex >= SCENARIOS.length) {
      renderCompletionScreen(container);
    } else {
      renderScenarioView(container);
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

  // Register Mission 2
  CircleQuest.registerMission({
    id: 'reallife',
    title: 'Mission 2: Real-Life Mission',
    start: function (container) {
      resetMissionState();
      renderMissionView(container);
    }
  });
})();
