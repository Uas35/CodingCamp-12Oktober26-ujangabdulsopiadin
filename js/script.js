// ===========================================
// TO-DO LIST LIFE DASHBOARD
// Focus Timer Implementation (Pomodoro 25-minute timer)
// ===========================================

// ===========================================
// DOM ELEMENTS - FOCUS TIMER
// ===========================================
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const stopTimerBtn = document.getElementById('stop-timer');
const resetTimerBtn = document.getElementById('reset-timer');
const timerStatus = document.getElementById('timer-status');

// ===========================================
// FOCUS TIMER VARIABLES
// ===========================================
let timerInterval = null;
let totalSeconds = 25 * 60; // 25 minutes in seconds
let isRunning = false;
let originalTime = 25 * 60; // Store original time for reset

// ===========================================
// FOCUS TIMER FUNCTIONS
// ===========================================

/**
 * Format seconds to MM:SS display
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string (MM:SS)
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Update the timer display
 */
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
}

/**
 * Start the focus timer
 */
function startTimer() {
    if (isRunning) return; // Prevent multiple intervals
    
    isRunning = true;
    timerStatus.textContent = 'Focusing... Time is running!';
    timerStatus.style.color = '#10b981'; // Green color for active
    
    // Update button states
    startTimerBtn.disabled = true;
    startTimerBtn.innerHTML = '<i class="fas fa-play"></i> Running';
    startTimerBtn.classList.remove('btn-primary');
    startTimerBtn.classList.add('btn-secondary');
    
    stopTimerBtn.disabled = false;
    stopTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    // Start the countdown interval
    timerInterval = setInterval(() => {
        if (totalSeconds <= 0) {
            completeTimer();
            return;
        }
        
        totalSeconds--;
        updateTimerDisplay();
        
        // Update status for last 5 minutes
        if (totalSeconds === 5 * 60) {
            timerStatus.textContent = '5 minutes remaining! Keep going!';
        } else if (totalSeconds === 60) {
            timerStatus.textContent = '1 minute left! Almost there!';
        } else if (totalSeconds <= 10) {
            timerStatus.textContent = `${totalSeconds} seconds remaining!`;
            timerStatus.style.color = '#ef4444'; // Red color for urgency
        }
    }, 1000);
}

/**
 * Pause the focus timer
 */
function pauseTimer() {
    if (!isRunning) return;
    
    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    
    timerStatus.textContent = 'Timer paused. Click Start to continue.';
    timerStatus.style.color = '#64748b'; // Neutral color
    
    // Update button states
    startTimerBtn.disabled = false;
    startTimerBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    startTimerBtn.classList.remove('btn-secondary');
    startTimerBtn.classList.add('btn-primary');
    
    stopTimerBtn.disabled = true;
    stopTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Paused';
}

/**
 * Reset the focus timer to original time
 */
function resetTimer() {
    // Clear any running interval
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset variables
    isRunning = false;
    totalSeconds = originalTime;
    
    // Update display
    updateTimerDisplay();
    timerStatus.textContent = 'Ready to focus!';
    timerStatus.style.color = '#64748b'; // Neutral color
    
    // Reset button states
    startTimerBtn.disabled = false;
    startTimerBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    startTimerBtn.classList.remove('btn-secondary');
    startTimerBtn.classList.add('btn-primary');
    
    stopTimerBtn.disabled = false;
    stopTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

/**
 * Handle timer completion
 */
function completeTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    
    // Play completion sound (if browser allows)
    playCompletionSound();
    
    // Update display
    timerDisplay.textContent = '00:00';
    timerStatus.textContent = 'Time\'s up! Take a 5-minute break! 🎉';
    timerStatus.style.color = '#10b981'; // Green color for completion
    
    // Show notification
    showTimerNotification();
    
    // Reset button states
    startTimerBtn.disabled = false;
    startTimerBtn.innerHTML = '<i class="fas fa-redo"></i> Restart';
    startTimerBtn.classList.remove('btn-secondary');
    startTimerBtn.classList.add('btn-primary');
    
    stopTimerBtn.disabled = true;
    stopTimerBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

/**
 * Play a subtle completion sound
 */
function playCompletionSound() {
    try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
        console.log('Audio not supported or blocked by browser');
    }
}

/**
 * Show a browser notification (if supported and allowed)
 */
function showTimerNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Timer Complete!', {
            body: '25 minutes of focused work completed! Take a 5-minute break.',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
        });
    }
}

/**
 * Request notification permission
 */
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

// ===========================================
// GREETING AND DATETIME FUNCTIONS
// ===========================================
const greetingText = document.getElementById('greeting-text');
const datetimeDisplay = document.getElementById('datetime-display');

// User name for personalized greeting
const USER_NAME = 'Ujang Abdul Sopiadin';
const USER_SETTINGS_KEY = 'lifeDashboard_userSettings';

/**
 * Get appropriate greeting based on time of day with Indonesian variations
 * @returns {string} Greeting message in Indonesian
 */
function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return 'Selamat pagi';
    } else if (hour >= 12 && hour < 15) {
        return 'Selamat siang';
    } else if (hour >= 15 && hour < 18) {
        return 'Selamat sore';
    } else if (hour >= 18 && hour < 24) {
        return 'Selamat malam';
    } else {
        return 'Selamat beristirahat';
    }
}

/**
 * Format date and time for display with Indonesian locale
 * @returns {string} Formatted datetime string in Indonesian
 */
function getFormattedDateTime() {
    const now = new Date();
    
    // Format day of week in Indonesian
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayOfWeek = days[now.getDay()];
    
    // Format date in Indonesian
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    
    // Format time with leading zeros
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    // Add leading zeros
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    return `${dayOfWeek}, ${date} ${month} ${year} • ${hours}:${minutes}:${seconds}`;
}

/**
 * Get greeting emoji based on time of day
 * @returns {string} Emoji for greeting
 */
function getGreetingEmoji() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return '☀️'; // Morning sun
    } else if (hour >= 12 && hour < 15) {
        return '🌤️'; // Day sun
    } else if (hour >= 15 && hour < 18) {
        return '🌇'; // Sunset
    } else if (hour >= 18 && hour < 24) {
        return '🌙'; // Moon
    } else {
        return '✨'; // Stars
    }
}

/**
 * Get greeting message with personalized name and emoji
 * @returns {string} Complete greeting message
 */
function getCompleteGreeting() {
    const greeting = getGreeting();
    const emoji = getGreetingEmoji();
    const hour = new Date().getHours();
    
    // Add additional message based on time
    let additionalMessage = '';
    if (hour >= 5 && hour < 12) {
        additionalMessage = 'Semoga harimu menyenangkan!';
    } else if (hour >= 12 && hour < 15) {
        additionalMessage = 'Semangat untuk aktivitas siang ini!';
    } else if (hour >= 15 && hour < 18) {
        additionalMessage = 'Selamat menikmati sore hari!';
    } else if (hour >= 18 && hour < 21) {
        additionalMessage = 'Selamat beristirahat di malam hari!';
    } else {
        additionalMessage = 'Waktunya istirahat yang berkualitas!';
    }
    
    return `${greeting}, ${USER_NAME}! ${emoji}<br><span class="greeting-subtext">${additionalMessage}</span>`;
}

/**
 * Load user settings from Local Storage
 */
function loadUserSettings() {
    const settings = loadFromLocalStorage(USER_SETTINGS_KEY);
    
    if (settings && settings.userName) {
        // You could load custom user name here if needed
        console.log('Loaded user settings:', settings);
    } else {
        // Save default settings
        const defaultSettings = {
            userName: USER_NAME,
            greetingLanguage: 'id', // Indonesian
            createdAt: new Date().toISOString()
        };
        saveToLocalStorage(USER_SETTINGS_KEY, defaultSettings);
    }
}

/**
 * Update greeting and datetime display
 */
function updateGreetingAndDateTime() {
    greetingText.innerHTML = getCompleteGreeting();
    datetimeDisplay.textContent = getFormattedDateTime();
    
    // Add dynamic styling based on time of day
    updateGreetingStyles();
    
    // Add pulse animation to time display every minute
    const now = new Date();
    if (now.getSeconds() === 0) {
        datetimeDisplay.classList.add('pulse');
        setTimeout(() => {
            datetimeDisplay.classList.remove('pulse');
        }, 1000);
    }
}

/**
 * Update greeting styles based on time of day
 */
function updateGreetingStyles() {
    const hour = new Date().getHours();
    const greetingSection = document.querySelector('.greeting-section');
    
    // Remove existing time-based classes
    greetingSection.classList.remove('morning', 'afternoon', 'evening', 'night');
    
    // Add appropriate class based on time
    if (hour >= 5 && hour < 12) {
        greetingSection.classList.add('morning');
    } else if (hour >= 12 && hour < 15) {
        greetingSection.classList.add('afternoon');
    } else if (hour >= 15 && hour < 18) {
        greetingSection.classList.add('evening');
    } else {
        greetingSection.classList.add('night');
    }
}

// ===========================================
// EVENT LISTENERS SETUP
// ===========================================

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Focus Timer Events
    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);
    
    // Disable pause button initially
    stopTimerBtn.disabled = false;
}

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('To-Do List Life Dashboard initialized');
    
    // Initialize theme first (for proper color scheme)
    initializeTheme();
    
    // Initialize timer display
    updateTimerDisplay();
    
    // Update greeting and datetime
    updateGreetingAndDateTime();
    
    // Update greeting and datetime every second for real-time clock
    setInterval(updateGreetingAndDateTime, 1000);
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize To-Do List
    initializeTodoList();
    
    // Initialize Quick Links
    initializeQuickLinks();
    
    // Request notification permission
    requestNotificationPermission();
    
    // Log initialization
    console.log('Theme system ready with auto-detection');
    console.log('Focus Timer ready: 25-minute Pomodoro timer');
    console.log('To-Do List ready with Local Storage');
    console.log('Quick Links ready with favicon detection');
    console.log('Local Storage available:', typeof localStorage !== 'undefined');
}

// ===========================================
// KEYBOARD SHORTCUTS
// ===========================================

/**
 * Add keyboard shortcuts for timer control
 */
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Spacebar to start/pause timer
        if (event.code === 'Space' && !event.target.matches('input, textarea')) {
            event.preventDefault();
            
            if (isRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
        }
        
        // 'R' key to reset timer
        if (event.code === 'KeyR' && event.ctrlKey && !event.target.matches('input, textarea')) {
            event.preventDefault();
            resetTimer();
        }
    });
}

// ===========================================
// START APPLICATION
// ===========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    initializeKeyboardShortcuts();
    
    // Add CSS for timer animations
    const style = document.createElement('style');
    style.textContent = `
        .timer-display {
            transition: color 0.3s ease;
        }
        
        .timer-display.pulse {
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        
        .timer-status {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// ===========================================
// TO-DO LIST IMPLEMENTATION
// ===========================================

// ===========================================
// DOM ELEMENTS - TO-DO LIST
// ===========================================
const todoInput = document.getElementById('todo-input');
const addTodoBtn = document.getElementById('add-todo');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const duplicateWarning = document.getElementById('duplicate-warning');
const showDuplicatesBtn = document.getElementById('show-duplicates');

// ===========================================
// TO-DO LIST VARIABLES
// ===========================================
let todos = [];
let currentFilter = 'all';
let duplicateCheckEnabled = true; // Default: prevent duplicates
const STORAGE_KEY = 'lifeDashboard_todos';
const SETTINGS_STORAGE_KEY = 'lifeDashboard_settings';

// ===========================================
// TO-DO LIST FUNCTIONS
// ===========================================

/**
 * Generate a unique ID for todo items
 * @returns {string} Unique ID
 */
function generateTodoId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new todo object
 * @param {string} text - Todo text content
 * @returns {object} Todo object
 */
function createTodo(text) {
    return {
        id: generateTodoId(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

/**
 * Normalize text for duplicate comparison (case-insensitive, trim, remove extra spaces)
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/[^\w\s]/g, ''); // Remove punctuation (optional)
}

/**
 * Check if a task is a duplicate
 * @param {string} text - Task text to check
 * @param {string} excludeId - Optional ID to exclude (for editing)
 * @returns {object|null} Duplicate todo object or null
 */
function findDuplicate(text, excludeId = null) {
    const normalizedText = normalizeText(text);
    
    return todos.find(todo => {
        // Skip the task being edited
        if (excludeId && todo.id === excludeId) {
            return false;
        }
        
        const normalizedTodoText = normalizeText(todo.text);
        return normalizedTodoText === normalizedText;
    });
}

/**
 * Show duplicate warning
 * @param {string} duplicateText - Duplicate task text
 */
function showDuplicateWarning(duplicateText) {
    duplicateWarning.style.display = 'flex';
    duplicateWarning.querySelector('span').textContent = `"${duplicateText}" already exists!`;
    todoInput.classList.add('duplicate');
    
    // Add shake animation
    todoInput.classList.add('shake');
    setTimeout(() => {
        todoInput.classList.remove('shake');
    }, 500);
}

/**
 * Hide duplicate warning
 */
function hideDuplicateWarning() {
    duplicateWarning.style.display = 'none';
    todoInput.classList.remove('duplicate');
}

/**
 * Check for duplicate in real-time as user types
 */
function checkDuplicateInRealTime() {
    const text = todoInput.value.trim();
    
    if (!text) {
        hideDuplicateWarning();
        return;
    }
    
    const duplicate = findDuplicate(text);
    
    if (duplicate) {
        showDuplicateWarning(duplicate.text);
    } else {
        hideDuplicateWarning();
    }
}

/**
 * Show all duplicate tasks in the list
 */
function showAllDuplicates() {
    // Create a map to track duplicates
    const textMap = new Map();
    const duplicates = [];
    
    todos.forEach(todo => {
        const normalizedText = normalizeText(todo.text);
        
        if (textMap.has(normalizedText)) {
            // This is a duplicate
            const original = textMap.get(normalizedText);
            duplicates.push(original, todo);
        } else {
            // First occurrence
            textMap.set(normalizedText, todo);
        }
    });
    
    if (duplicates.length === 0) {
        showToast('No duplicate tasks found', 'info');
        return;
    }
    
    // Highlight duplicate items in the list
    const duplicateIds = [...new Set(duplicates.map(d => d.id))];
    
    // Remove previous highlighting
    document.querySelectorAll('.todo-duplicate-item').forEach(item => {
        item.classList.remove('todo-duplicate-item');
    });
    
    // Add highlighting to duplicates
    duplicateIds.forEach(id => {
        const todoItem = document.querySelector(`.todo-item[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.add('todo-duplicate-item');
        }
    });
    
    // Scroll to first duplicate
    const firstDuplicate = document.querySelector('.todo-duplicate-item');
    if (firstDuplicate) {
        firstDuplicate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showToast(`Found ${duplicates.length / 2} pairs of duplicate tasks`, 'warning');
}

/**
 * Load settings from Local Storage
 */
function loadSettings() {
    const settings = loadFromLocalStorage(SETTINGS_STORAGE_KEY);
    if (settings) {
        duplicateCheckEnabled = settings.duplicateCheckEnabled !== false; // Default to true
    }
    console.log('Loaded settings:', { duplicateCheckEnabled });
}

/**
 * Save settings to Local Storage
 */
function saveSettings() {
    const settings = {
        duplicateCheckEnabled,
        updatedAt: new Date().toISOString()
    };
    saveToLocalStorage(SETTINGS_STORAGE_KEY, settings);
    console.log('Settings saved:', settings);
}

/**
 * Toggle duplicate checking
 * @param {boolean} enabled - Whether duplicate checking should be enabled
 */
function toggleDuplicateChecking(enabled) {
    duplicateCheckEnabled = enabled;
    saveSettings();
    
    if (enabled) {
        showToast('Duplicate checking enabled', 'success');
        // Re-check current input
        checkDuplicateInRealTime();
    } else {
        showToast('Duplicate checking disabled', 'warning');
        hideDuplicateWarning();
    }
}

/**
 * Save todos to Local Storage
 */
function saveTodos() {
    saveToLocalStorage(STORAGE_KEY, todos);
}

/**
 * Load todos from Local Storage
 */
function loadTodos() {
    const savedTodos = loadFromLocalStorage(STORAGE_KEY);
    if (savedTodos && Array.isArray(savedTodos)) {
        todos = savedTodos;
    } else {
        todos = [];
    }
    console.log(`Loaded ${todos.length} todos from storage`);
}

/**
 * Render todo items based on current filter
 */
function renderTodos() {
    // Clear current list
    todoList.innerHTML = '';
    
    // Filter todos based on current filter
    let filteredTodos = [];
    
    switch (currentFilter) {
        case 'active':
            filteredTodos = todos.filter(todo => !todo.completed);
            break;
        case 'completed':
            filteredTodos = todos.filter(todo => todo.completed);
            break;
        default: // 'all'
            filteredTodos = [...todos];
    }
    
    // Sort todos: incomplete first, then by creation date
    filteredTodos.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Render each todo
    if (filteredTodos.length === 0) {
        // Show empty state
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-clipboard-list"></i>
            <p>No ${currentFilter === 'all' ? '' : currentFilter} tasks yet</p>
        `;
        todoList.appendChild(emptyState);
    } else {
        filteredTodos.forEach(todo => {
            const todoItem = createTodoElement(todo);
            todoList.appendChild(todoItem);
        });
    }
    
    // Update task count
    updateTaskCount();
}

/**
 * Create a todo element from todo object
 * @param {object} todo - Todo object
 * @returns {HTMLElement} Todo list item element
 */
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;
    
    li.innerHTML = `
        <div class="todo-item-content">
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                aria-label="Mark task as ${todo.completed ? 'incomplete' : 'complete'}"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <div class="todo-item-actions">
            <button class="icon-btn edit-btn" aria-label="Edit task">
                <i class="fas fa-edit"></i>
            </button>
            <button class="icon-btn delete-btn" aria-label="Delete task">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return li;
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Add a new todo
 */
function addTodo() {
    const text = todoInput.value.trim();
    
    if (!text) {
        showToast('Please enter a task', 'warning');
        todoInput.focus();
        return;
    }
    
    // Check for duplicate if enabled
    if (duplicateCheckEnabled) {
        const duplicate = findDuplicate(text);
        
        if (duplicate) {
            showDuplicateWarning(duplicate.text);
            showToast(`Task already exists: "${duplicate.text}"`, 'warning');
            
            // Focus and select the text for easy editing
            todoInput.focus();
            todoInput.select();
            return;
        }
    }
    
    // Create new todo
    const newTodo = createTodo(text);
    todos.unshift(newTodo); // Add to beginning
    
    // Save and render
    saveTodos();
    renderTodos();
    
    // Clear input and hide warning
    todoInput.value = '';
    hideDuplicateWarning();
    todoInput.focus();
    
    // Show success message
    showToast('Task added successfully', 'success');
    
    console.log('Added todo:', newTodo);
}

/**
 * Toggle todo completion status
 * @param {string} id - Todo ID
 */
function toggleTodo(id) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex !== -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
        todos[todoIndex].updatedAt = new Date().toISOString();
        
        saveTodos();
        renderTodos();
        
        const status = todos[todoIndex].completed ? 'completed' : 'active';
        showToast(`Task marked as ${status}`, 'info');
    }
}

/**
 * Edit todo text
 * @param {string} id - Todo ID
 * @param {string} newText - New todo text
 */
function editTodo(id, newText) {
    const text = newText.trim();
    
    if (!text) {
        showToast('Task text cannot be empty', 'warning');
        return;
    }
    
    // Check for duplicate if enabled (excluding current task)
    if (duplicateCheckEnabled) {
        const duplicate = findDuplicate(text, id);
        
        if (duplicate) {
            showToast(`Cannot update: Task "${duplicate.text}" already exists`, 'warning');
            
            // Highlight the duplicate in the list
            const duplicateItem = document.querySelector(`.todo-item[data-id="${duplicate.id}"]`);
            if (duplicateItem) {
                duplicateItem.classList.add('todo-duplicate-item');
                setTimeout(() => {
                    duplicateItem.classList.remove('todo-duplicate-item');
                }, 3000);
                duplicateItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
    }
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex !== -1) {
        todos[todoIndex].text = text;
        todos[todoIndex].updatedAt = new Date().toISOString();
        
        saveTodos();
        renderTodos();
        
        showToast('Task updated successfully', 'success');
    }
}

/**
 * Delete todo
 * @param {string} id - Todo ID
 */
function deleteTodo(id) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex !== -1) {
        const deletedTodo = todos.splice(todoIndex, 1)[0];
        
        saveTodos();
        renderTodos();
        
        showToast('Task deleted', 'info');
        console.log('Deleted todo:', deletedTodo);
    }
}

/**
 * Clear all completed todos
 */
function clearCompletedTodos() {
    const completedCount = todos.filter(todo => todo.completed).length;
    
    if (completedCount === 0) {
        showToast('No completed tasks to clear', 'info');
        return;
    }
    
    if (!confirm(`Clear ${completedCount} completed task${completedCount > 1 ? 's' : ''}?`)) {
        return;
    }
    
    todos = todos.filter(todo => !todo.completed);
    
    saveTodos();
    renderTodos();
    
    showToast(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`, 'success');
}

/**
 * Update task count display
 */
function updateTaskCount() {
    const activeCount = todos.filter(todo => !todo.completed).length;
    const totalCount = todos.length;
    
    if (totalCount === 0) {
        taskCount.textContent = 'No tasks';
    } else if (activeCount === 0) {
        taskCount.textContent = 'All tasks completed!';
    } else {
        taskCount.textContent = `${activeCount} ${activeCount === 1 ? 'task' : 'tasks'} remaining`;
    }
    
    // Show/hide clear completed button
    const hasCompleted = todos.some(todo => todo.completed);
    clearCompletedBtn.style.display = hasCompleted ? 'inline-block' : 'none';
}

/**
 * Change todo filter
 * @param {string} filter - Filter type ('all', 'active', 'completed')
 */
function changeFilter(filter) {
    if (filter === currentFilter) return;
    
    currentFilter = filter;
    
    // Update active button
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTodos();
}

/**
 * Initialize todo list event listeners
 */
function initializeTodoEventListeners() {
    // Add todo button click
    addTodoBtn.addEventListener('click', addTodo);
    
    // Add todo on Enter key
    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
    
    // Real-time duplicate checking
    todoInput.addEventListener('input', checkDuplicateInRealTime);
    
    // Show duplicates button
    showDuplicatesBtn.addEventListener('click', showAllDuplicates);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeFilter(btn.dataset.filter);
        });
    });
    
    // Clear completed button
    clearCompletedBtn.addEventListener('click', clearCompletedTodos);
    
    // Delegated events for todo items
    todoList.addEventListener('click', (event) => {
        const todoItem = event.target.closest('.todo-item');
        if (!todoItem) return;
        
        const todoId = todoItem.dataset.id;
        
        // Checkbox toggle
        if (event.target.classList.contains('todo-checkbox')) {
            toggleTodo(todoId);
        }
        
        // Edit button
        if (event.target.closest('.edit-btn')) {
            const todoTextElement = todoItem.querySelector('.todo-text');
            const currentText = todoTextElement.textContent;
            
            const newText = prompt('Edit task:', currentText);
            if (newText !== null && newText !== currentText) {
                editTodo(todoId, newText);
            }
        }
        
        // Delete button
        if (event.target.closest('.delete-btn')) {
            deleteTodo(todoId);
        }
        
        // Double-click to edit
        if (event.target.classList.contains('todo-text')) {
            if (event.detail === 2) { // Double click
                const currentText = event.target.textContent;
                const newText = prompt('Edit task:', currentText);
                if (newText !== null && newText !== currentText) {
                    const todoId = todoItem.dataset.id;
                    editTodo(todoId, newText);
                }
            }
        }
    });
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type ('success', 'error', 'warning', 'info')
 */
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    const style = document.createElement('style');
    if (!document.querySelector('#toast-styles')) {
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: var(--radius-md);
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
                animation-fill-mode: forwards;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 300px;
            }
            .toast-success { background-color: var(--accent-color); }
            .toast-error { background-color: var(--danger-color); }
            .toast-warning { background-color: var(--warning-color); }
            .toast-info { background-color: var(--secondary-color); }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
}

/**
 * Initialize todo list
 */
function initializeTodoList() {
    console.log('Initializing To-Do List...');
    
    // Load settings first
    loadSettings();
    
    // Load todos from storage
    loadTodos();
    
    // Render initial todos
    renderTodos();
    
    // Initialize event listeners
    initializeTodoEventListeners();
    
    console.log('To-Do List ready with', todos.length, 'tasks');
    console.log('Duplicate checking:', duplicateCheckEnabled ? 'Enabled' : 'Disabled');
}

// ===========================================
// LIGHT/DARK MODE IMPLEMENTATION
// ===========================================

// ===========================================
// DOM ELEMENTS - THEME TOGGLE
// ===========================================
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// ===========================================
// THEME VARIABLES
// ===========================================
const THEME_STORAGE_KEY = 'lifeDashboard_theme';
const DEFAULT_THEME = 'light';

// ===========================================
// THEME FUNCTIONS
// ===========================================

/**
 * Get current theme from Local Storage or system preference
 * @returns {string} Current theme ('light' or 'dark')
 */
function getCurrentTheme() {
    // Check Local Storage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    if (savedTheme) {
        return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    
    // Default to light
    return DEFAULT_THEME;
}

/**
 * Save theme preference to Local Storage
 * @param {string} theme - Theme to save ('light' or 'dark')
 */
function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    console.log(`Theme saved: ${theme}`);
}

/**
 * Apply theme to document
 * @param {string} theme - Theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
    // Set data attribute on document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update toggle button appearance
    updateThemeToggle(theme);
    
    // Show toast notification
    showToast(`${theme === 'dark' ? 'Dark' : 'Light'} mode activated`, 'info');
    
    console.log(`Theme applied: ${theme}`);
}

/**
 * Update theme toggle button appearance
 * @param {string} theme - Current theme
 */
function updateThemeToggle(theme) {
    if (theme === 'dark') {
        // Dark mode is active
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light Mode';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
        themeToggle.title = 'Switch to light mode';
    } else {
        // Light mode is active
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark Mode';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        themeToggle.title = 'Switch to dark mode';
    }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Apply new theme
    applyTheme(newTheme);
    
    // Save preference
    saveTheme(newTheme);
}

/**
 * Initialize theme
 */
function initializeTheme() {
    console.log('Initializing theme...');
    
    // Get current theme
    const currentTheme = getCurrentTheme();
    
    // Apply theme
    applyTheme(currentTheme);
    
    // Add event listener to toggle button
    themeToggle.addEventListener('click', toggleTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listen for changes (only if user hasn't set a preference)
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                const newTheme = e.matches ? 'dark' : 'light';
                applyTheme(newTheme);
                console.log('System theme changed to:', newTheme);
            }
        });
    }
    
    console.log('Theme initialized:', currentTheme);
}

// ===========================================
// QUICK LINKS IMPLEMENTATION
// ===========================================

// ===========================================
// DOM ELEMENTS - QUICK LINKS
// ===========================================
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput = document.getElementById('link-url-input');
const addLinkBtn = document.getElementById('add-link');
const linksGrid = document.getElementById('links-grid');

// ===========================================
// QUICK LINKS VARIABLES
// ===========================================
let quickLinks = [];
const LINKS_STORAGE_KEY = 'lifeDashboard_quickLinks';

// ===========================================
// QUICK LINKS FUNCTIONS
// ===========================================

/**
 * Generate a unique ID for quick links
 * @returns {string} Unique ID
 */
function generateLinkId() {
    return 'link_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new link object
 * @param {string} name - Link name
 * @param {string} url - Link URL
 * @returns {object} Link object
 */
function createLink(name, url) {
    return {
        id: generateLinkId(),
        name: name.trim(),
        url: formatUrl(url.trim()),
        icon: getFaviconFromUrl(url.trim()),
        createdAt: new Date().toISOString()
    };
}

/**
 * Format URL to ensure it has proper protocol
 * @param {string} url - Input URL
 * @returns {string} Formatted URL
 */
function formatUrl(url) {
    // Add https:// if no protocol specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

/**
 * Extract domain from URL for favicon
 * @param {string} url - URL
 * @returns {string} Domain name
 */
function getDomainFromUrl(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch (error) {
        return 'default';
    }
}

/**
 * Get appropriate icon based on domain
 * @param {string} url - URL
 * @returns {string} Font Awesome icon class
 */
function getFaviconFromUrl(url) {
    const domain = getDomainFromUrl(url).toLowerCase();
    
    // Common website icons
    const iconMap = {
        'google.com': 'fab fa-google',
        'youtube.com': 'fab fa-youtube',
        'github.com': 'fab fa-github',
        'facebook.com': 'fab fa-facebook',
        'twitter.com': 'fab fa-twitter',
        'instagram.com': 'fab fa-instagram',
        'linkedin.com': 'fab fa-linkedin',
        'reddit.com': 'fab fa-reddit',
        'discord.com': 'fab fa-discord',
        'twitch.tv': 'fab fa-twitch',
        'spotify.com': 'fab fa-spotify',
        'netflix.com': 'fab fa-netflix',
        'amazon.com': 'fab fa-amazon',
        'microsoft.com': 'fab fa-microsoft',
        'apple.com': 'fab fa-apple',
        'stackoverflow.com': 'fab fa-stack-overflow',
        'wikipedia.org': 'fab fa-wikipedia-w',
        'gmail.com': 'fas fa-envelope',
        'outlook.com': 'fas fa-envelope',
        'yahoo.com': 'fas fa-envelope',
        'notion.so': 'fas fa-sticky-note',
        'trello.com': 'fab fa-trello',
        'slack.com': 'fab fa-slack',
        'zoom.us': 'fas fa-video',
        'meet.google.com': 'fas fa-video',
        'drive.google.com': 'fab fa-google-drive',
        'docs.google.com': 'fas fa-file-alt',
        'sheets.google.com': 'fas fa-table',
        'calendar.google.com': 'fas fa-calendar',
        'mail.google.com': 'fas fa-envelope'
    };
    
    // Check for exact domain match
    if (iconMap[domain]) {
        return iconMap[domain];
    }
    
    // Check for partial matches (subdomains)
    for (const key in iconMap) {
        if (domain.includes(key)) {
            return iconMap[key];
        }
    }
    
    // Default icon
    return 'fas fa-external-link-alt';
}

/**
 * Save quick links to Local Storage
 */
function saveQuickLinks() {
    saveToLocalStorage(LINKS_STORAGE_KEY, quickLinks);
}

/**
 * Load quick links from Local Storage
 */
function loadQuickLinks() {
    const savedLinks = loadFromLocalStorage(LINKS_STORAGE_KEY);
    if (savedLinks && Array.isArray(savedLinks)) {
        quickLinks = savedLinks;
    } else {
        // Add default links if none exist
        quickLinks = [
            createLink('Google', 'https://google.com'),
            createLink('YouTube', 'https://youtube.com'),
            createLink('GitHub', 'https://github.com')
        ];
        saveQuickLinks();
    }
    console.log(`Loaded ${quickLinks.length} quick links from storage`);
}

/**
 * Render quick links
 */
function renderQuickLinks() {
    // Clear current grid
    linksGrid.innerHTML = '';
    
    // Render each link
    if (quickLinks.length === 0) {
        // Show empty state
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-link"></i>
            <p>No quick links yet</p>
            <p class="empty-state-hint">Add your favorite websites above!</p>
        `;
        linksGrid.appendChild(emptyState);
    } else {
        quickLinks.forEach(link => {
            const linkCard = createLinkElement(link);
            linksGrid.appendChild(linkCard);
        });
    }
}

/**
 * Create a link card element from link object
 * @param {object} link - Link object
 * @returns {HTMLElement} Link card element
 */
function createLinkElement(link) {
    const card = document.createElement('div');
    card.className = 'link-card';
    card.dataset.id = link.id;
    
    card.innerHTML = `
        <div class="link-icon">
            <i class="${link.icon}"></i>
        </div>
        <div class="link-info">
            <h3 class="link-title">${escapeHtml(link.name)}</h3>
            <p class="link-url" title="${link.url}">${escapeHtml(link.url)}</p>
        </div>
        <button class="link-action" aria-label="Open ${link.name}" title="Open ${link.name}">
            <i class="fas fa-external-link-alt"></i>
        </button>
    `;
    
    return card;
}

/**
 * Add a new quick link
 */
function addQuickLink() {
    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();
    
    // Validate inputs
    if (!name) {
        showToast('Please enter a link name', 'warning');
        linkNameInput.focus();
        return;
    }
    
    if (!url) {
        showToast('Please enter a URL', 'warning');
        linkUrlInput.focus();
        return;
    }
    
    // Validate URL format
    try {
        const formattedUrl = formatUrl(url);
        new URL(formattedUrl); // This will throw if invalid
    } catch (error) {
        showToast('Please enter a valid URL (e.g., example.com or https://example.com)', 'warning');
        linkUrlInput.focus();
        return;
    }
    
    // Check for duplicates
    const formattedUrl = formatUrl(url);
    const isDuplicate = quickLinks.some(link => 
        link.url === formattedUrl || link.name.toLowerCase() === name.toLowerCase()
    );
    
    if (isDuplicate) {
        showToast('This link already exists', 'warning');
        return;
    }
    
    // Create new link
    const newLink = createLink(name, url);
    quickLinks.unshift(newLink); // Add to beginning
    
    // Save and render
    saveQuickLinks();
    renderQuickLinks();
    
    // Clear inputs
    linkNameInput.value = '';
    linkUrlInput.value = '';
    linkNameInput.focus();
    
    // Show success message
    showToast(`"${name}" added to quick links`, 'success');
    
    console.log('Added quick link:', newLink);
}

/**
 * Delete a quick link
 * @param {string} id - Link ID
 */
function deleteQuickLink(id) {
    const linkIndex = quickLinks.findIndex(link => link.id === id);
    
    if (linkIndex !== -1) {
        const deletedLink = quickLinks.splice(linkIndex, 1)[0];
        
        saveQuickLinks();
        renderQuickLinks();
        
        showToast(`"${deletedLink.name}" removed from quick links`, 'info');
        console.log('Deleted quick link:', deletedLink);
    }
}

/**
 * Edit a quick link
 * @param {string} id - Link ID
 */
function editQuickLink(id) {
    const linkIndex = quickLinks.findIndex(link => link.id === id);
    
    if (linkIndex !== -1) {
        const link = quickLinks[linkIndex];
        
        const newName = prompt('Edit link name:', link.name);
        if (newName === null) return; // User cancelled
        
        const newUrl = prompt('Edit URL:', link.url);
        if (newUrl === null) return; // User cancelled
        
        const name = newName.trim();
        const url = newUrl.trim();
        
        // Validate inputs
        if (!name) {
            showToast('Link name cannot be empty', 'warning');
            return;
        }
        
        if (!url) {
            showToast('URL cannot be empty', 'warning');
            return;
        }
        
        // Validate URL format
        try {
            const formattedUrl = formatUrl(url);
            new URL(formattedUrl);
            link.url = formattedUrl;
        } catch (error) {
            showToast('Please enter a valid URL', 'warning');
            return;
        }
        
        // Update link
        link.name = name;
        link.icon = getFaviconFromUrl(link.url);
        link.createdAt = new Date().toISOString();
        
        saveQuickLinks();
        renderQuickLinks();
        
        showToast('Link updated successfully', 'success');
    }
}

/**
 * Open a quick link in new tab
 * @param {string} url - URL to open
 * @param {string} name - Link name (for logging)
 */
function openQuickLink(url, name) {
    try {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log(`Opened quick link: ${name} (${url})`);
    } catch (error) {
        console.error('Error opening link:', error);
        showToast('Could not open link. Please check if pop-ups are blocked.', 'error');
    }
}

/**
 * Initialize quick links event listeners
 */
function initializeQuickLinksEventListeners() {
    // Add link button click
    addLinkBtn.addEventListener('click', addQuickLink);
    
    // Add link on Enter key in either input
    [linkNameInput, linkUrlInput].forEach(input => {
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                addQuickLink();
            }
        });
    });
    
    // Delegated events for link cards
    linksGrid.addEventListener('click', (event) => {
        const linkCard = event.target.closest('.link-card');
        if (!linkCard) return;
        
        const linkId = linkCard.dataset.id;
        const link = quickLinks.find(l => l.id === linkId);
        
        if (!link) return;
        
        // Open link button
        if (event.target.closest('.link-action')) {
            openQuickLink(link.url, link.name);
        }
        
        // Click on card body (except buttons) to open
        if (event.target.closest('.link-icon') || event.target.closest('.link-info')) {
            openQuickLink(link.url, link.name);
        }
        
        // Right-click or long press for context menu
        linkCard.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showLinkContextMenu(e, linkId);
        });
    });
    
    // Add keyboard shortcuts for link management
    document.addEventListener('keydown', (event) => {
        // Ctrl+Shift+L to focus link name input
        if (event.ctrlKey && event.shiftKey && event.code === 'KeyL') {
            event.preventDefault();
            linkNameInput.focus();
        }
    });
}

/**
 * Show context menu for link management
 * @param {Event} event - Mouse event
 * @param {string} linkId - Link ID
 */
function showLinkContextMenu(event, linkId) {
    const link = quickLinks.find(l => l.id === linkId);
    if (!link) return;
    
    // Remove existing context menu
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.position = 'fixed';
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.style.zIndex = '1001';
    menu.style.background = 'white';
    menu.style.borderRadius = 'var(--radius-md)';
    menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    menu.style.padding = '8px 0';
    menu.style.minWidth = '180px';
    
    menu.innerHTML = `
        <div class="context-menu-item" data-action="open">
            <i class="fas fa-external-link-alt"></i>
            <span>Open "${link.name}"</span>
        </div>
        <div class="context-menu-item" data-action="open-new">
            <i class="fas fa-plus"></i>
            <span>Open in new tab</span>
        </div>
        <hr style="margin: 4px 0; border: none; border-top: 1px solid var(--border-color);">
        <div class="context-menu-item" data-action="edit">
            <i class="fas fa-edit"></i>
            <span>Edit link</span>
        </div>
        <div class="context-menu-item" data-action="delete" style="color: var(--danger-color);">
            <i class="fas fa-trash"></i>
            <span>Delete link</span>
        </div>
        <div class="context-menu-item" data-action="copy">
            <i class="fas fa-copy"></i>
            <span>Copy URL</span>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    if (!document.querySelector('#context-menu-styles')) {
        style.id = 'context-menu-styles';
        style.textContent = `
            .context-menu-item {
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                color: var(--text-primary);
            }
            .context-menu-item:hover {
                background-color: var(--background-color);
            }
            .context-menu-item i {
                width: 16px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(menu);
    
    // Handle menu item clicks
    menu.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.context-menu-item');
        if (!menuItem) return;
        
        const action = menuItem.dataset.action;
        
        switch (action) {
            case 'open':
                openQuickLink(link.url, link.name);
                break;
            case 'open-new':
                window.open(link.url, '_blank', 'noopener,noreferrer');
                break;
            case 'edit':
                editQuickLink(linkId);
                break;
            case 'delete':
                if (confirm(`Delete "${link.name}"?`)) {
                    deleteQuickLink(linkId);
                }
                break;
            case 'copy':
                navigator.clipboard.writeText(link.url).then(() => {
                    showToast('URL copied to clipboard', 'success');
                }).catch(() => {
                    showToast('Failed to copy URL', 'error');
                });
                break;
        }
        
        menu.remove();
    });
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}

/**
 * Initialize quick links
 */
function initializeQuickLinks() {
    console.log('Initializing Quick Links...');
    
    // Load links from storage
    loadQuickLinks();
    
    // Render initial links
    renderQuickLinks();
    
    // Initialize event listeners
    initializeQuickLinksEventListeners();
    
    console.log('Quick Links ready with', quickLinks.length, 'links');
}

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

/**
 * Save data to Local Storage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log(`Saved to Local Storage: ${key}`);
    } catch (error) {
        console.error('Error saving to Local Storage:', error);
    }
}

/**
 * Load data from Local Storage
 * @param {string} key - Storage key
 * @returns {any} Parsed data or null
 */
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading from Local Storage:', error);
        return null;
    }
}

/**
 * Clear data from Local Storage
 * @param {string} key - Storage key
 */
function clearLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        console.log(`Cleared from Local Storage: ${key}`);
    } catch (error) {
        console.error('Error clearing from Local Storage:', error);
    }
}
/**
 * Add context menu for duplicate checking control
 */
function addDuplicateCheckContextMenu() {
    // Add a small settings button next to todo input
    const todoInputContainer = document.querySelector('.todo-input-container');
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'icon-btn settings-btn';
    settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
    settingsBtn.title = 'Task settings';
    settingsBtn.setAttribute('aria-label', 'Task settings');
    
    settingsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        showDuplicateSettingsMenu(event);
    });
    
    todoInputContainer.appendChild(settingsBtn);
}

/**
 * Show duplicate settings context menu
 * @param {Event} event - Mouse event
 */
function showDuplicateSettingsMenu(event) {
    // Remove existing menu
    const existingMenu = document.querySelector('.settings-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create menu
    const menu = document.createElement('div');
    menu.className = 'context-menu settings-context-menu';
    menu.style.position = 'fixed';
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    menu.style.zIndex = '1001';
    menu.style.background = 'white';
    menu.style.borderRadius = 'var(--radius-md)';
    menu.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    menu.style.padding = '8px 0';
    menu.style.minWidth = '220px';
    
    menu.innerHTML = `
        <div class="context-menu-header">
            <span>Task Settings</span>
        </div>
        <div class="context-menu-item ${duplicateCheckEnabled ? 'active' : ''}" data-action="toggle-duplicate-check">
            <i class="fas fa-clone"></i>
            <span>Prevent duplicate tasks</span>
            <i class="fas fa-check ${duplicateCheckEnabled ? '' : 'hidden'}"></i>
        </div>
        <div class="context-menu-item" data-action="find-duplicates">
            <i class="fas fa-search"></i>
            <span>Find all duplicates</span>
        </div>
        <hr style="margin: 4px 0; border: none; border-top: 1px solid var(--border-color);">
        <div class="context-menu-item" data-action="clear-duplicates">
            <i class="fas fa-trash-alt" style="color: var(--danger-color);"></i>
            <span style="color: var(--danger-color);">Remove all duplicates</span>
        </div>
    `;
    
    // Add styles for settings menu
    const style = document.createElement('style');
    if (!document.querySelector('#settings-menu-styles')) {
        style.id = 'settings-menu-styles';
        style.textContent = `
            .settings-btn {
                margin-left: 4px;
            }
            
            .context-menu-header {
                padding: 8px 16px;
                font-weight: 600;
                color: var(--text-primary);
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 4px;
            }
            
            .context-menu-item.active {
                background-color: rgba(79, 70, 229, 0.1);
            }
            
            .context-menu-item .fa-check {
                margin-left: auto;
                color: var(--primary-color);
            }
            
            .context-menu-item .fa-check.hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(menu);
    
    // Handle menu item clicks
    menu.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.context-menu-item');
        if (!menuItem) return;
        
        const action = menuItem.dataset.action;
        
        switch (action) {
            case 'toggle-duplicate-check':
                toggleDuplicateChecking(!duplicateCheckEnabled);
                break;
                
            case 'find-duplicates':
                showAllDuplicates();
                break;
                
            case 'clear-duplicates':
                removeAllDuplicates();
                break;
        }
        
        menu.remove();
    });
    
    // Close menu when clicking outside
    const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}

/**
 * Remove all duplicate tasks (keep only first occurrence)
 */
function removeAllDuplicates() {
    const textMap = new Map();
    const todosToKeep = [];
    const removedTodos = [];
    
    // Process todos in reverse to keep the first occurrence (oldest)
    [...todos].reverse().forEach(todo => {
        const normalizedText = normalizeText(todo.text);
        
        if (textMap.has(normalizedText)) {
            // This is a duplicate, mark for removal
            removedTodos.push(todo);
        } else {
            // First occurrence, keep it
            textMap.set(normalizedText, true);
            todosToKeep.push(todo);
        }
    });
    
    // Reverse back to original order
    todosToKeep.reverse();
    
    if (removedTodos.length === 0) {
        showToast('No duplicate tasks to remove', 'info');
        return;
    }
    
    if (!confirm(`Remove ${removedTodos.length} duplicate task${removedTodos.length > 1 ? 's' : ''}?`)) {
        return;
    }
    
    todos = todosToKeep;
    saveTodos();
    renderTodos();
    
    showToast(`Removed ${removedTodos.length} duplicate task${removedTodos.length > 1 ? 's' : ''}`, 'success');
    
    // Log removed duplicates
    console.log('Removed duplicates:', removedTodos);
}

// Call this function in initializeTodoList
addDuplicateCheckContextMenu();