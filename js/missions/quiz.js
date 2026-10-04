/**
 * Mission 4: Quiz Arena
 * Malaysian Year 6 KSSR Mathematics - Circle Quest
 */

(function () {
  'use strict';

  if (!window.CircleQuest) return;

  // Base Question Bank Definitions (Fixed order Q1 to Q10)
  const QUESTION_BANK = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Which part is the middle point of a circle?',
      options: ['Centre', 'Radius', 'Diameter', 'Edge'],
      correctAnswer: 'Centre',
      topic: 'Centre',
      explanation: 'The centre is the middle point of the circle.'
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: 'Which line goes from the centre to the edge of a circle?',
      options: ['Radius', 'Diameter', 'Centre', 'Curve'],
      correctAnswer: 'Radius',
      topic: 'Radius',
      explanation: 'The radius goes from the centre to the edge.'
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: 'Which line goes across a circle and passes through the centre?',
      options: ['Diameter', 'Radius', 'Centre', 'Edge'],
      correctAnswer: 'Diameter',
      topic: 'Diameter',
      explanation: 'The diameter goes across the circle through the centre.'
    },
    {
      id: 4,
      type: 'multiple-choice',
      question: 'Which statement is true?',
      options: [
        'Diameter = 2 x radius',
        'Radius = 2 x diameter',
        'Diameter = radius + 2',
        'Diameter = radius'
      ],
      correctAnswer: 'Diameter = 2 x radius',
      topic: 'Diameter',
      explanation: 'The diameter is twice the radius.'
    },
    {
      id: 5,
      type: 'true-false',
      question: 'A radius is half of a diameter.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      topic: 'Radius',
      explanation: 'The diameter is 2 x the radius, so the radius is half of the diameter.'
    },
    {
      id: 6,
      type: 'true-false',
      question: 'Every line inside a circle is a diameter.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      topic: 'Diameter',
      explanation: 'A diameter must pass through the centre.'
    },
    {
      id: 7,
      type: 'true-false',
      question: 'All radii of the same circle have the same length.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      topic: 'Radius',
      explanation: 'Every point on the circle is the same distance from the centre.'
    },
    {
      id: 8,
      type: 'number',
      question: 'A circle has a radius of 7 cm. What is its diameter?',
      correctAnswer: '14',
      unit: 'cm',
      topic: 'Diameter',
      explanation: 'Diameter = 2 x 7 = 14 cm.'
    },
    {
      id: 9,
      type: 'number',
      question: 'A circle has a diameter of 18 cm. What is its radius?',
      correctAnswer: '9',
      unit: 'cm',
      topic: 'Radius',
      explanation: 'Radius = 18 / 2 = 9 cm.'
    },
    {
      id: 10,
      type: 'ordering',
      question: 'Put the steps of drawing a circle with a compass in the correct order.',
      correctOrder: [
        'Mark the centre point.',
        'Open the compass to the radius.',
        'Put the needle on the centre and turn the pencil 360 degrees.',
        'Label the centre, radius and diameter.'
      ],
      topic: 'Drawing',
      explanation: 'First mark the centre, then set the radius, then turn the compass a full 360 degrees, then label the parts.'
    }
  ];

  // Helper function to shuffle array in-place (Fisher-Yates)
  function shuffleArray(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  // Helper to fetch team name from localStorage state
  function getTeamName() {
    try {
      const data = localStorage.getItem('circle_quest_state_v1');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.teamName && parsed.teamName.trim()) {
          return parsed.teamName.trim();
        }
      }
    } catch (e) {
      console.warn('Could not read team name from localStorage:', e);
    }
    return 'Your team';
  }

  // Mission State Variables
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let streak = 0;
  let wrongQuestions = [];
  let currentSelection = null; // Stores user answer selection / text / ordered list
  let isChecked = false;
  let mainContainer = null;

  // Initialize and start quiz
  function initQuiz(container) {
    mainContainer = container;
    currentIndex = 0;
    score = 0;
    streak = 0;
    wrongQuestions = [];
    isChecked = false;
    currentSelection = null;

    // Prepare questions (keep question order Q1-Q10; shuffle options for MC and steps for ordering)
    currentQuestions = QUESTION_BANK.map(q => {
      const qCopy = { ...q };
      if (q.type === 'multiple-choice') {
        qCopy.options = shuffleArray(q.options);
      } else if (q.type === 'ordering') {
        // Scramble the 4 steps
        let scrambled = shuffleArray(q.correctOrder);
        // Ensure initial order is scrambled if random shuffle gave exact order
        if (JSON.stringify(scrambled) === JSON.stringify(q.correctOrder)) {
          scrambled = [scrambled[1], scrambled[2], scrambled[3], scrambled[0]];
        }
        qCopy.unplaced = scrambled;
        qCopy.placed = [];
      }
      return qCopy;
    });

    renderCurrentQuestion();
  }

  // Render question UI
  function renderCurrentQuestion() {
    if (!mainContainer) return;

    if (currentIndex >= currentQuestions.length) {
      renderResultsScreen();
      return;
    }

    isChecked = false;
    currentSelection = null;

    const q = currentQuestions[currentIndex];
    const totalQ = currentQuestions.length;
    const progressPercent = Math.round(((currentIndex + 1) / totalQ) * 100);

    mainContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'm4-quiz-wrapper';

    // Header Meta Area (Progress Bar, Question X of Y, Score, Streak)
    const header = document.createElement('div');
    header.className = 'm4-quiz-header';
    header.innerHTML = `
      <div class="m4-progress-bar-container">
        <div class="m4-progress-bar-fill" style="width: ${progressPercent}%;"></div>
      </div>
      <div class="m4-meta-row">
        <span>Question ${currentIndex + 1} of ${totalQ}</span>
        <span class="m4-streak-badge">🔥 Streak: ${streak}</span>
        <span>Score: ${score}</span>
      </div>
    `;
    wrapper.appendChild(header);

    // Question Card
    const card = document.createElement('div');
    card.className = 'm4-card';

    const title = document.createElement('div');
    title.className = 'm4-question-title';
    title.textContent = q.question;
    card.appendChild(title);

    // Interactive Body according to question type
    if (q.type === 'multiple-choice' || q.type === 'true-false') {
      const optionsList = document.createElement('div');
      optionsList.className = 'm4-options-list';

      q.options.forEach(optText => {
        const btn = document.createElement('button');
        btn.className = 'm4-option-btn';
        btn.textContent = optText;

        const handleSelect = function (e) {
          if (e) e.preventDefault();
          if (isChecked) return;

          currentSelection = optText;
          // Highlight selected option button
          const allBtns = optionsList.querySelectorAll('.m4-option-btn');
          allBtns.forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          // Enable Check button
          const checkBtn = card.querySelector('#m4-check-btn');
          if (checkBtn) checkBtn.disabled = false;
        };

        btn.addEventListener('pointerdown', handleSelect);
        btn.addEventListener('click', handleSelect);

        optionsList.appendChild(btn);
      });

      card.appendChild(optionsList);

    } else if (q.type === 'number') {
      const numGroup = document.createElement('div');
      numGroup.className = 'm4-number-input-group';
      numGroup.innerHTML = `
        <input type="text" inputmode="decimal" id="m4-num-input" class="m4-number-input" placeholder="?" autocomplete="off">
        <span class="m4-unit-label">${q.unit || ''}</span>
      `;

      card.appendChild(numGroup);

      const numInput = numGroup.querySelector('#m4-num-input');
      if (numInput) {
        numInput.addEventListener('input', function (e) {
          if (isChecked) return;
          currentSelection = e.target.value;
          const checkBtn = card.querySelector('#m4-check-btn');
          if (checkBtn) {
            checkBtn.disabled = !currentSelection || currentSelection.trim() === '';
          }
        });
      }

    } else if (q.type === 'ordering') {
      const orderingContainer = document.createElement('div');
      orderingContainer.className = 'm4-ordering-container';

      // 4 Numbered Slots
      const slotsList = document.createElement('div');
      slotsList.className = 'm4-slots-list';

      for (let i = 0; i < 4; i++) {
        const slot = document.createElement('div');
        slot.className = `m4-slot ${q.placed[i] ? 'filled' : ''}`;
        slot.innerHTML = `
          <span class="m4-slot-num">${i + 1}.</span>
          <span class="m4-slot-text">${q.placed[i] ? escapeHtml(q.placed[i]) : '<i style="color:var(--color-text-muted);">Tap a step below</i>'}</span>
        `;
        slotsList.appendChild(slot);
      }
      orderingContainer.appendChild(slotsList);

      // Unplaced items tray
      const unplacedList = document.createElement('div');
      unplacedList.className = 'm4-unplaced-list';

      if (q.unplaced.length > 0) {
        q.unplaced.forEach((stepText, idx) => {
          const itemBtn = document.createElement('button');
          itemBtn.className = 'm4-order-item-btn';
          itemBtn.textContent = stepText;

          const handleTapStep = function (e) {
            if (e) e.preventDefault();
            if (isChecked) return;

            // Move step from unplaced to placed
            q.placed.push(stepText);
            q.unplaced.splice(idx, 1);

            renderCurrentQuestion();
          };

          itemBtn.addEventListener('pointerdown', handleTapStep);
          itemBtn.addEventListener('click', handleTapStep);

          unplacedList.appendChild(itemBtn);
        });
      }

      orderingContainer.appendChild(unplacedList);

      // Reset order button
      const resetBtn = document.createElement('button');
      resetBtn.className = 'btn btn-secondary';
      resetBtn.style.marginTop = '8px';
      resetBtn.textContent = 'Reset order';

      const handleResetOrder = function (e) {
        if (e) e.preventDefault();
        if (isChecked) return;

        // Reset ordering step arrays
        q.unplaced = shuffleArray(q.correctOrder);
        q.placed = [];
        renderCurrentQuestion();
      };

      resetBtn.addEventListener('pointerdown', handleResetOrder);
      resetBtn.addEventListener('click', handleResetOrder);

      orderingContainer.appendChild(resetBtn);

      card.appendChild(orderingContainer);
    }

    // Feedback area container
    const feedbackBox = document.createElement('div');
    feedbackBox.id = 'm4-feedback-box';
    feedbackBox.style.display = 'none';
    card.appendChild(feedbackBox);

    // Button Row (Check / Next)
    const btnRow = document.createElement('div');
    btnRow.className = 'm4-btn-row';

    const checkBtn = document.createElement('button');
    checkBtn.id = 'm4-check-btn';
    checkBtn.className = 'btn btn-primary m4-btn';
    checkBtn.textContent = 'Check';

    // Disable Check button initially until input is given
    if (q.type === 'ordering') {
      checkBtn.disabled = q.placed.length < 4;
    } else {
      checkBtn.disabled = true;
    }

    const nextBtn = document.createElement('button');
    nextBtn.id = 'm4-next-btn';
    nextBtn.className = 'btn btn-primary m4-btn';
    nextBtn.style.display = 'none';
    nextBtn.textContent = (currentIndex === totalQ - 1) ? 'See results' : 'Next';

    const handleCheck = function (e) {
      if (e) e.preventDefault();
      if (isChecked) return;
      evaluateQuestion(q, card, checkBtn, nextBtn);
    };

    const handleNext = function (e) {
      if (e) e.preventDefault();
      currentIndex++;
      renderCurrentQuestion();
    };

    checkBtn.addEventListener('pointerdown', handleCheck);
    checkBtn.addEventListener('click', handleCheck);

    nextBtn.addEventListener('pointerdown', handleNext);
    nextBtn.addEventListener('click', handleNext);

    btnRow.appendChild(checkBtn);
    btnRow.appendChild(nextBtn);
    card.appendChild(btnRow);

    wrapper.appendChild(card);
    mainContainer.appendChild(wrapper);
  }

  // Evaluate student answer
  function evaluateQuestion(q, card, checkBtn, nextBtn) {
    isChecked = true;
    let isCorrect = false;

    if (q.type === 'multiple-choice' || q.type === 'true-false') {
      isCorrect = (currentSelection === q.correctAnswer);

      // Disable option buttons and highlight correct/wrong
      const allBtns = card.querySelectorAll('.m4-option-btn');
      allBtns.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === q.correctAnswer) {
          btn.classList.add('correct');
        } else if (btn.textContent === currentSelection && !isCorrect) {
          btn.classList.add('wrong');
        }
      });

    } else if (q.type === 'number') {
      const cleanInput = (currentSelection || '').toString().trim();
      isCorrect = (cleanInput === q.correctAnswer);

      const inputEl = card.querySelector('#m4-num-input');
      if (inputEl) inputEl.disabled = true;

    } else if (q.type === 'ordering') {
      isCorrect = JSON.stringify(q.placed) === JSON.stringify(q.correctOrder);

      // Disable ordering buttons
      const orderBtns = card.querySelectorAll('.m4-order-item-btn, .btn-secondary');
      orderBtns.forEach(b => b.disabled = true);
    }

    // Update score, streak, and wrong questions record
    if (isCorrect) {
      score++;
      streak++;
      checkStreakCelebration(streak);
    } else {
      streak = 0;
      wrongQuestions.push(q);
    }

    // Update header meta text
    const streakEl = mainContainer.querySelector('.m4-streak-badge');
    if (streakEl) streakEl.textContent = `🔥 Streak: ${streak}`;

    const scoreMetaEl = mainContainer.querySelectorAll('.m4-meta-row span');
    if (scoreMetaEl && scoreMetaEl[2]) {
      scoreMetaEl[2].textContent = `Score: ${score}`;
    }

    // Show Feedback Box
    const feedbackBox = card.querySelector('#m4-feedback-box');
    if (feedbackBox) {
      feedbackBox.style.display = 'flex';
      feedbackBox.className = `m4-feedback-box ${isCorrect ? 'correct' : 'wrong'}`;

      let correctAnsDisplay = '';
      if (!isCorrect) {
        if (q.type === 'ordering') {
          correctAnsDisplay = `<div class="m4-correct-answer-text">Correct order: 1. ${escapeHtml(q.correctOrder[0])} 2. ${escapeHtml(q.correctOrder[1])} 3. ${escapeHtml(q.correctOrder[2])} 4. ${escapeHtml(q.correctOrder[3])}</div>`;
        } else if (q.type === 'number') {
          correctAnsDisplay = `<div class="m4-correct-answer-text">Correct answer: ${escapeHtml(q.correctAnswer)} ${q.unit || ''}</div>`;
        } else {
          correctAnsDisplay = `<div class="m4-correct-answer-text">Correct answer: ${escapeHtml(q.correctAnswer)}</div>`;
        }
      }

      feedbackBox.innerHTML = `
        <div class="m4-feedback-header">
          ${isCorrect ? '✅ Correct!' : '💡 Not quite.'}
        </div>
        <div class="m4-feedback-text">${escapeHtml(q.explanation)}</div>
        ${correctAnsDisplay}
      `;
    }

    // Switch buttons
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'inline-flex';
  }

  // Show streak celebration popup on 3, 5, 7 streaks
  function checkStreakCelebration(currentStreak) {
    if (currentStreak === 3 || currentStreak === 5 || currentStreak === 7) {
      const popup = document.createElement('div');
      popup.className = 'm4-streak-popup';
      popup.textContent = `🔥 ${currentStreak} in a row! Keep going!`;

      document.body.appendChild(popup);

      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 2000);
    }
  }

  // Render Quiz Results Screen
  function renderResultsScreen() {
    if (!mainContainer) return;

    // Calculate Stars based on score:
    // 9-10 correct = 3 stars, 7-8 = 2 stars, 4-6 = 1 star, below 4 = 0 stars
    let stars = 0;
    if (score >= 9) stars = 3;
    else if (score >= 7) stars = 2;
    else if (score >= 4) stars = 1;
    else stars = 0;

    // Award stars via CircleQuest global API once
    CircleQuest.awardStars('quiz', stars);

    // Get unique list of topics to review from wrong questions
    const topicsToReview = [];
    wrongQuestions.forEach(q => {
      if (q.topic && !topicsToReview.includes(q.topic)) {
        topicsToReview.push(q.topic);
      }
    });

    const teamName = getTeamName();

    mainContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'm4-results-wrapper';

    const card = document.createElement('div');
    card.className = 'm4-results-card';

    // Stars HTML
    let starsHtml = '';
    for (let i = 1; i <= 3; i++) {
      starsHtml += `<span class="m4-star ${i <= stars ? 'filled' : ''}">★</span>`;
    }

    // Topics to review HTML
    let reviewHtml = '';
    if (topicsToReview.length > 0) {
      const chips = topicsToReview.map(t => `<li class="m4-review-chip">${escapeHtml(t)}</li>`).join('');
      reviewHtml = `
        <div class="m4-review-box">
          <h3>Topics to review:</h3>
          <ul class="m4-review-list">${chips}</ul>
        </div>
      `;
    } else {
      reviewHtml = `
        <div class="m4-review-box" style="text-align: center;">
          <div class="m4-review-perfect">🎉 Great job! No topics to review.</div>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="font-size: 56px; line-height: 1;">🏆</div>
      <div class="m4-team-title">${escapeHtml(teamName)}</div>
      <div class="m4-score-display">Score: ${score} out of 10</div>
      <div class="m4-stars-row">${starsHtml}</div>
      ${reviewHtml}
      <div class="m4-btn-row" style="margin-top: 10px;">
        <button id="m4-restart-btn" class="btn btn-primary m4-btn">Play again</button>
        <button id="m4-home-btn" class="btn btn-secondary m4-btn">Back to menu</button>
      </div>
    `;

    // Restart event listeners
    const restartBtn = card.querySelector('#m4-restart-btn');
    if (restartBtn) {
      const handleRestart = function (e) {
        if (e) e.preventDefault();
        initQuiz(mainContainer);
      };
      restartBtn.addEventListener('pointerdown', handleRestart);
      restartBtn.addEventListener('click', handleRestart);
    }

    // Home event listeners
    const homeBtn = card.querySelector('#m4-home-btn');
    if (homeBtn) {
      const handleHome = function (e) {
        if (e) e.preventDefault();
        CircleQuest.goHome();
      };
      homeBtn.addEventListener('pointerdown', handleHome);
      homeBtn.addEventListener('click', handleHome);
    }

    wrapper.appendChild(card);
    mainContainer.appendChild(wrapper);
  }

  // HTML escape helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Register Mission 4 in CircleQuest
  CircleQuest.registerMission({
    id: 'quiz',
    title: 'Mission 4: Quiz Arena',
    start: function (container) {
      initQuiz(container);
    }
  });

})();
