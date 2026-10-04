/**
 * Mission 1: Explore Lab
 * Gamified interactive mission exploring circle centre, radius, and diameter.
 */
(function () {
  'use strict';

  if (!window.CircleQuest) return;

  // Global State for Mission 1
  let state = {
    currentActivity: 1, // 1, 2, 3, or 'completion'
    wrongCount2: 0,
    wrongCount3: 0,

    // Activity 1 state
    act1Radius: 4, // 1 to 8 cm
    act1Angle: -Math.PI / 4, // angle in radians
    act1SliderChanges: 0,
    act1PointDragged: false,
    isDraggingAct1: false,

    // Activity 2 state
    act2Placed: {
      centre: false,
      radius: false,
      diameter: false
    },
    act2Feedback: '',
    act2FeedbackType: '',

    // Activity 3 state
    act3Options: [],
    act3SelectedIndex: null,
    act3SelectedCorrect: false,
    act3Feedback: '',
    act3FeedbackType: ''
  };

  // Helper: Reset mission state on launch
  function initMissionState() {
    state = {
      currentActivity: 1,
      wrongCount2: 0,
      wrongCount3: 0,

      act1Radius: 4,
      act1Angle: -Math.PI / 4,
      act1SliderChanges: 0,
      act1PointDragged: false,
      isDraggingAct1: false,

      act2Placed: {
        centre: false,
        radius: false,
        diameter: false
      },
      act2Feedback: '',
      act2FeedbackType: '',

      act3Options: generateAct3Options(),
      act3SelectedIndex: null,
      act3SelectedCorrect: false,
      act3Feedback: '',
      act3FeedbackType: ''
    };
  }

  // Shuffle array helper
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Generate options for Activity 3
  function generateAct3Options() {
    const rawOptions = [
      {
        id: 'diameter',
        isDiameter: true,
        title: 'Option A',
        feedback: 'Correct! The diameter goes edge to edge through the centre.'
      },
      {
        id: 'radius',
        isDiameter: false,
        title: 'Option B',
        feedback: 'This is a radius. It only goes from the centre to the edge.'
      },
      {
        id: 'chord',
        isDiameter: false,
        title: 'Option C',
        feedback: 'This line does not pass through the centre.'
      },
      {
        id: 'incomplete',
        isDiameter: false,
        title: 'Option D',
        feedback: 'This line does not touch the edge on one side.'
      }
    ];
    return shuffle(rawOptions);
  }

  // Render main mission view based on current activity
  function renderMission(container) {
    container.innerHTML = '';

    if (state.currentActivity === 1) {
      renderActivity1(container);
    } else if (state.currentActivity === 2) {
      renderActivity2(container);
    } else if (state.currentActivity === 3) {
      renderActivity3(container);
    } else if (state.currentActivity === 'completion') {
      renderCompletionScreen(container);
    }
  }

  /* ==========================================================================
     ACTIVITY 1: Move the points
     ========================================================================== */
  function renderActivity1(container) {
    container.innerHTML = '';

    const isNextEnabled = state.act1SliderChanges >= 3 && state.act1PointDragged;

    const wrapper = document.createElement('div');
    wrapper.className = 'm1-activity-wrapper';

    wrapper.innerHTML = `
      <div class="m1-header">
        <div class="m1-step-badge">Activity 1 of 3</div>
        <h2 class="m1-title">Activity 1: Move the Points</h2>
        <p class="m1-subtitle">Drag the handle around the circle and move the slider to explore the radius and diameter.</p>
      </div>

      <div class="m1-interactive-card">
        <div class="m1-svg-container" id="m1-act1-svg-wrap">
          <!-- SVG rendered dynamically -->
        </div>

        <div class="m1-live-info">
          <div class="m1-info-badge m1-info-primary">
            <span>Radius: <strong>${state.act1Radius} cm</strong></span>
            <span class="m1-sub-msg">Every radius is the same length!</span>
          </div>
          <div class="m1-info-badge m1-info-secondary">
            <span>Diameter = 2 × radius = <strong>${2 * state.act1Radius} cm</strong></span>
          </div>
        </div>

        <div class="m1-controls">
          <div class="m1-slider-group">
            <label for="m1-radius-slider" class="m1-label">
              Change Radius: <strong>${state.act1Radius} cm</strong>
            </label>
            <input type="range" id="m1-radius-slider" class="m1-slider" min="1" max="8" step="1" value="${state.act1Radius}">
          </div>
        </div>

        <div class="m1-task-checklist">
          <div class="m1-check-item ${state.act1PointDragged ? 'done' : ''}">
            ${state.act1PointDragged ? '✅' : '⚪'} Drag the point around the circle
          </div>
          <div class="m1-check-item ${state.act1SliderChanges >= 3 ? 'done' : ''}">
            ${state.act1SliderChanges >= 3 ? '✅' : '⚪'} Move the radius slider (${Math.min(state.act1SliderChanges, 3)}/3 times)
          </div>
        </div>
      </div>

      <div class="m1-footer">
        <button id="m1-act1-next" class="btn btn-primary m1-btn-large" ${isNextEnabled ? '' : 'disabled'}>
          Next Activity →
        </button>
      </div>
    `;

    container.appendChild(wrapper);

    // Render SVG
    updateAct1Svg();

    // Attach Slider Event
    const slider = wrapper.querySelector('#m1-radius-slider');
    if (slider) {
      slider.addEventListener('input', function (e) {
        const val = parseInt(e.target.value, 10);
        if (val !== state.act1Radius) {
          state.act1Radius = val;
          state.act1SliderChanges++;
          renderActivity1(container);
        }
      });
    }

    // Attach Next Event
    const nextBtn = wrapper.querySelector('#m1-act1-next');
    if (nextBtn) {
      const handleNext = function (e) {
        if (e) e.preventDefault();
        if (state.act1SliderChanges >= 3 && state.act1PointDragged) {
          state.currentActivity = 2;
          renderMission(container);
        }
      };
      nextBtn.addEventListener('pointerdown', handleNext);
      nextBtn.addEventListener('click', handleNext);
    }

    // Attach Drag Events on SVG handle
    attachAct1DragEvents(wrapper, container);
  }

  // Draw Activity 1 SVG
  function updateAct1Svg() {
    const svgWrap = document.getElementById('m1-act1-svg-wrap');
    if (!svgWrap) return;

    const size = 300;
    const cx = size / 2;
    const cy = size / 2;
    // Scale: 1 cm = 16 px (so 8 cm = 128 px, fits easily in 300x300)
    const pxPerCm = 16;
    const rPx = state.act1Radius * pxPerCm;

    const hx = cx + rPx * Math.cos(state.act1Angle);
    const hy = cy + rPx * Math.sin(state.act1Angle);

    // Diameter endpoints (horizontal line through centre)
    const dx1 = cx - rPx;
    const dy1 = cy;
    const dx2 = cx + rPx;
    const dy2 = cy;

    svgWrap.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="m1-svg">
        <!-- Background Grid Gridlines -->
        <defs>
          <pattern id="m1-grid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#E2E8F0" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#m1-grid)" rx="12" />

        <!-- Outer Main Circle -->
        <circle cx="${cx}" cy="${cy}" r="${rPx}" class="m1-svg-circle" />

        <!-- Diameter Line (edge to edge through centre) -->
        <line x1="${dx1}" y1="${dy1}" x2="${dx2}" y2="${dy2}" class="m1-svg-diameter-line" />

        <!-- Radius Line (centre to drag handle) -->
        <line x1="${cx}" y1="${cy}" x2="${hx}" y2="${hy}" class="m1-svg-radius-line" />

        <!-- Centre Dot (visible centre dot labelled by a small dot, no text label yet) -->
        <circle cx="${cx}" cy="${cy}" r="6" class="m1-svg-centre-dot" />

        <!-- Handle on Circle Edge -->
        <g id="m1-act1-handle" class="m1-svg-handle" style="touch-action: none; cursor: grab;">
          <circle cx="${hx}" cy="${hy}" r="22" fill="rgba(79, 70, 229, 0.2)" />
          <circle cx="${hx}" cy="${hy}" r="12" class="m1-svg-handle-inner" />
        </g>
      </svg>
    `;
  }

  // Pointer drag logic for Activity 1 handle
  function attachAct1DragEvents(wrapper, container) {
    const handle = wrapper.querySelector('#m1-act1-handle');
    const svgWrap = wrapper.querySelector('#m1-act1-svg-wrap');
    if (!handle || !svgWrap) return;

    function handlePointerMove(e) {
      if (!state.isDraggingAct1) return;
      e.preventDefault();

      const rect = svgWrap.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      if (clientX === undefined || clientY === undefined) return;

      const size = 300;
      const svgX = ((clientX - rect.left) / rect.width) * size;
      const svgY = ((clientY - rect.top) / rect.height) * size;

      const cx = size / 2;
      const cy = size / 2;

      state.act1Angle = Math.atan2(svgY - cy, svgX - cx);
      state.act1PointDragged = true;

      updateAct1Svg();

      // Update checkmark and Next button status live
      const checkItem = wrapper.querySelector('.m1-task-checklist .m1-check-item:first-child');
      if (checkItem) {
        checkItem.classList.add('done');
        checkItem.innerHTML = '✅ Drag the point around the circle';
      }

      const nextBtn = wrapper.querySelector('#m1-act1-next');
      if (nextBtn && state.act1SliderChanges >= 3 && state.act1PointDragged) {
        nextBtn.removeAttribute('disabled');
      }
    }

    function handlePointerUp(e) {
      if (state.isDraggingAct1) {
        state.isDraggingAct1 = false;
        try {
          if (handle.hasPointerCapture && e.pointerId !== undefined) {
            handle.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    }

    handle.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      state.isDraggingAct1 = true;
      try {
        if (handle.setPointerCapture && e.pointerId !== undefined) {
          handle.setPointerCapture(e.pointerId);
        }
      } catch (err) {}

      window.addEventListener('pointermove', handlePointerMove, { passive: false });
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
    });
  }

  /* ==========================================================================
     ACTIVITY 2: Label the circle
     ========================================================================== */
  function renderActivity2(container) {
    container.innerHTML = '';

    const isAllPlaced = state.act2Placed.centre && state.act2Placed.radius && state.act2Placed.diameter;

    const wrapper = document.createElement('div');
    wrapper.className = 'm1-activity-wrapper';

    wrapper.innerHTML = `
      <div class="m1-header">
        <div class="m1-step-badge">Activity 2 of 3</div>
        <h2 class="m1-title">Activity 2: Label the Circle</h2>
        <p class="m1-subtitle">Drag each label from the tray onto the matching drop zone on the circle diagram.</p>
      </div>

      <div class="m1-interactive-card">
        <!-- SVG Diagram with Drop Zones -->
        <div class="m1-diagram-stage" id="m1-act2-stage">
          <svg width="300" height="300" viewBox="0 0 300 300" class="m1-svg">
            <!-- Background -->
            <rect width="300" height="300" fill="#F8FAFC" rx="12" stroke="#E2E8F0" stroke-width="2"/>

            <!-- Circle -->
            <circle cx="150" cy="150" r="100" class="m1-svg-circle" />

            <!-- Diameter Line (horizontal edge to edge) -->
            <line x1="50" y1="150" x2="250" y2="150" class="m1-svg-diameter-line" />

            <!-- Radius Line (centre to top-right edge) -->
            <line x1="150" y1="150" x2="220.7" y2="79.3" class="m1-svg-radius-line" />

            <!-- Centre Dot -->
            <circle cx="150" cy="150" r="6" class="m1-svg-centre-dot" />
          </svg>

          <!-- Drop Targets Overlay -->
          <div class="m1-dropzone ${state.act2Placed.centre ? 'placed' : ''}" data-target="centre" style="left: 150px; top: 110px;">
            ${state.act2Placed.centre ? '<span class="m1-placed-label">Centre ✅</span>' : '<span class="m1-zone-hint">Centre Zone</span>'}
          </div>

          <div class="m1-dropzone ${state.act2Placed.radius ? 'placed' : ''}" data-target="radius" style="left: 215px; top: 85px;">
            ${state.act2Placed.radius ? '<span class="m1-placed-label">Radius ✅</span>' : '<span class="m1-zone-hint">Radius Zone</span>'}
          </div>

          <div class="m1-dropzone ${state.act2Placed.diameter ? 'placed' : ''}" data-target="diameter" style="left: 85px; top: 185px;">
            ${state.act2Placed.diameter ? '<span class="m1-placed-label">Diameter ✅</span>' : '<span class="m1-zone-hint">Diameter Zone</span>'}
          </div>
        </div>

        <!-- Feedback Message Area -->
        <div id="m1-act2-feedback" class="m1-feedback ${state.act2FeedbackType}">
          ${state.act2Feedback ? state.act2Feedback : 'Drag a label to its matching line or point!'}
        </div>

        <!-- Draggable Labels Tray -->
        <div class="m1-labels-tray">
          <div class="m1-tray-title">Available Labels:</div>
          <div class="m1-labels-container" id="m1-labels-container">
            ${!state.act2Placed.centre ? '<div class="m1-draggable-label" data-label="centre" style="touch-action: none;">Centre</div>' : ''}
            ${!state.act2Placed.radius ? '<div class="m1-draggable-label" data-label="radius" style="touch-action: none;">Radius</div>' : ''}
            ${!state.act2Placed.diameter ? '<div class="m1-draggable-label" data-label="diameter" style="touch-action: none;">Diameter</div>' : ''}
            ${isAllPlaced ? '<div class="m1-all-placed-msg">🎉 All labels placed correctly!</div>' : ''}
          </div>
        </div>
      </div>

      <div class="m1-footer">
        <button id="m1-act2-next" class="btn btn-primary m1-btn-large" ${isAllPlaced ? '' : 'disabled'}>
          Next Activity →
        </button>
      </div>
    `;

    container.appendChild(wrapper);

    // Attach Drag Logic to Labels
    attachAct2DragEvents(wrapper, container);

    // Attach Next Event
    const nextBtn = wrapper.querySelector('#m1-act2-next');
    if (nextBtn) {
      const handleNext = function (e) {
        if (e) e.preventDefault();
        if (state.act2Placed.centre && state.act2Placed.radius && state.act2Placed.diameter) {
          state.currentActivity = 3;
          renderMission(container);
        }
      };
      nextBtn.addEventListener('pointerdown', handleNext);
      nextBtn.addEventListener('click', handleNext);
    }
  }

  // Pointer drag-and-drop logic for Activity 2
  function attachAct2DragEvents(wrapper, container) {
    const draggables = wrapper.querySelectorAll('.m1-draggable-label');
    const dropzones = wrapper.querySelectorAll('.m1-dropzone');

    draggables.forEach(elem => {
      let activePointerId = null;
      let startX = 0;
      let startY = 0;
      let isDragging = false;

      function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.clientX || (e.touches && e.touches[0].clientX);
        const currentY = e.clientY || (e.touches && e.touches[0].clientY);

        const dx = currentX - startX;
        const dy = currentY - startY;

        elem.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
      }

      function onPointerUp(e) {
        if (!isDragging) return;
        isDragging = false;

        const currentX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
        const currentY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);

        elem.style.transform = '';
        elem.classList.remove('dragging');

        // Check intersection with dropzones
        let matchedZone = null;
        dropzones.forEach(zone => {
          const rect = zone.getBoundingClientRect();
          if (
            currentX >= rect.left &&
            currentX <= rect.right &&
            currentY >= rect.top &&
            currentY <= rect.bottom
          ) {
            matchedZone = zone.getAttribute('data-target');
          }
        });

        const labelType = elem.getAttribute('data-label');

        if (matchedZone) {
          if (matchedZone === labelType) {
            // Correct drop!
            state.act2Placed[labelType] = true;
            state.act2Feedback = `Great job! "${capitalize(labelType)}" is placed correctly.`;
            state.act2FeedbackType = 'success';
            renderActivity2(container);
          } else {
            // Wrong drop
            state.wrongCount2++;
            state.act2Feedback = 'Incorrect drop. The diameter passes through the centre.';
            state.act2FeedbackType = 'error';

            // Play shake animation before re-rendering
            elem.classList.add('shake');
            setTimeout(() => {
              renderActivity2(container);
            }, 400);
          }
        } else {
          // Dropped outside dropzones
          state.act2Feedback = 'Drag the label directly onto one of the drop zones.';
          state.act2FeedbackType = '';
          renderActivity2(container);
        }

        // Cleanup listeners
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);
      }

      elem.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        isDragging = true;
        activePointerId = e.pointerId;

        startX = e.clientX || (e.touches && e.touches[0].clientX);
        startY = e.clientY || (e.touches && e.touches[0].clientY);

        elem.classList.add('dragging');

        window.addEventListener('pointermove', onPointerMove, { passive: false });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
      });
    });
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ==========================================================================
     ACTIVITY 3: Spot the diameter
     ========================================================================== */
  function renderActivity3(container) {
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'm1-activity-wrapper';

    wrapper.innerHTML = `
      <div class="m1-header">
        <div class="m1-step-badge">Activity 3 of 3</div>
        <h2 class="m1-title">Activity 3: Spot the Diameter</h2>
        <p class="m1-subtitle">Tap the circle diagram that shows a true diameter.</p>
      </div>

      <div class="m1-interactive-card">
        <div class="m1-quiz-grid">
          ${state.act3Options
            .map((opt, index) => {
              const isSelected = state.act3SelectedIndex === index;
              let statusClass = '';
              if (isSelected) {
                statusClass = opt.isDiameter ? 'correct' : 'wrong';
              }
              return `
                <div class="m1-quiz-card ${statusClass}" data-index="${index}" style="touch-action: manipulation; cursor: pointer;">
                  <div class="m1-quiz-svg-wrap">
                    ${renderAct3OptionSvg(opt.id)}
                  </div>
                  <div class="m1-quiz-card-label">Circle ${index + 1}</div>
                </div>
              `;
            })
            .join('')}
        </div>

        <!-- Feedback Box -->
        <div class="m1-feedback ${state.act3FeedbackType}" id="m1-act3-feedback">
          ${state.act3Feedback ? state.act3Feedback : 'Tap one of the circles above!'}
        </div>
      </div>

      <div class="m1-footer">
        <button id="m1-act3-next" class="btn btn-primary m1-btn-large" ${state.act3SelectedCorrect ? '' : 'disabled'}>
          Finish Mission 🌟
        </button>
      </div>
    `;

    container.appendChild(wrapper);

    // Attach click/pointer handlers to option cards
    const cards = wrapper.querySelectorAll('.m1-quiz-card');
    cards.forEach(card => {
      const handleSelect = function (e) {
        if (e) e.preventDefault();
        const index = parseInt(card.getAttribute('data-index'), 10);
        const opt = state.act3Options[index];

        state.act3SelectedIndex = index;
        if (opt.isDiameter) {
          state.act3SelectedCorrect = true;
          state.act3Feedback = opt.feedback;
          state.act3FeedbackType = 'success';
        } else {
          state.wrongCount3++;
          state.act3Feedback = opt.feedback;
          state.act3FeedbackType = 'error';
        }
        renderActivity3(container);
      };

      card.addEventListener('pointerdown', handleSelect);
      card.addEventListener('click', handleSelect);
    });

    // Attach Next / Finish button handler
    const nextBtn = wrapper.querySelector('#m1-act3-next');
    if (nextBtn) {
      const handleFinish = function (e) {
        if (e) e.preventDefault();
        if (state.act3SelectedCorrect) {
          state.currentActivity = 'completion';
          renderMission(container);
        }
      };
      nextBtn.addEventListener('pointerdown', handleFinish);
      nextBtn.addEventListener('click', handleFinish);
    }
  }

  // Render SVG diagrams for Activity 3 options
  function renderAct3OptionSvg(type) {
    const size = 130;
    const cx = size / 2;
    const cy = size / 2;
    const r = 48;

    let lineSvg = '';

    if (type === 'diameter') {
      // True diameter: through centre, edge to edge
      lineSvg = `<line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>`;
    } else if (type === 'radius') {
      // Radius: centre to edge only
      lineSvg = `<line x1="${cx}" y1="${cy}" x2="${cx + r}" y2="${cy}" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>`;
    } else if (type === 'chord') {
      // Chord not through centre
      lineSvg = `<line x1="${cx - r * 0.7}" y1="${cy - r * 0.6}" x2="${cx + r * 0.7}" y2="${cy - r * 0.6}" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>`;
    } else if (type === 'incomplete') {
      // Incomplete line: from edge past centre, but stopping before opposite edge
      lineSvg = `<line x1="${cx - r}" y1="${cy}" x2="${cx + r * 0.4}" y2="${cy}" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/>`;
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="display: block; margin: 0 auto;">
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FFFFFF" stroke="#64748B" stroke-width="2"/>
        <circle cx="${cx}" cy="${cy}" r="4" fill="#1E293B"/>
        ${lineSvg}
      </svg>
    `;
  }

  /* ==========================================================================
     COMPLETION SCREEN & SCORING
     ========================================================================== */
  function renderCompletionScreen(container) {
    container.innerHTML = '';

    const totalWrong = state.wrongCount2 + state.wrongCount3;
    let stars = 3;
    if (totalWrong === 0) {
      stars = 3;
    } else if (totalWrong <= 3) {
      stars = 2;
    } else {
      stars = 1;
    }

    // Award stars using CircleQuest API
    CircleQuest.awardStars('explore', stars);

    let starIconsHtml = '';
    for (let i = 1; i <= 3; i++) {
      starIconsHtml += `<span class="m1-star ${i <= stars ? 'filled' : ''}">★</span>`;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'm1-completion-wrapper';

    wrapper.innerHTML = `
      <div class="m1-completion-card">
        <div class="m1-completion-header">
          <div class="m1-trophy-icon">🎉</div>
          <h2>Mission Complete!</h2>
          <p class="m1-completion-subtitle">Mission 1: Explore Lab Passed!</p>
        </div>

        <div class="m1-stars-row">
          ${starIconsHtml}
        </div>

        <div class="m1-summary-box">
          <h3>Summary</h3>
          <p>The centre is the middle of the circle. The radius goes from the centre to the edge. The diameter goes across the circle through the centre. The diameter is twice the radius.</p>
        </div>

        <div class="m1-completion-footer">
          <button id="m1-home-btn" class="btn btn-primary m1-btn-large">
            Back to Menu
          </button>
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    // Event listener for Home button
    const homeBtn = wrapper.querySelector('#m1-home-btn');
    if (homeBtn) {
      const goHome = function (e) {
        if (e) e.preventDefault();
        CircleQuest.goHome();
      };
      homeBtn.addEventListener('pointerdown', goHome);
      homeBtn.addEventListener('click', goHome);
    }
  }

  // Register Mission 1 with CircleQuest
  CircleQuest.registerMission({
    id: 'explore',
    title: 'Mission 1: Explore Lab',
    start: function (container) {
      initMissionState();
      renderMission(container);
    }
  });
})();
