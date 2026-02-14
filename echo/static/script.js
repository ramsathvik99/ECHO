// Premium SaaS Logic for ECHO
console.log("Background JS Loaded - Romantic Animations Active");

let metricsChart = null;
let historyChart = null;

// Floating Hearts Background System - ALL PAGES
function initFloatingHearts() {
    const heartContainer = document.querySelector(".heart-bg");
    if (!heartContainer) {
        console.error("❌ Heart container not found!");
        return;
    }
    
    console.log("✅ Heart container found, initializing floating hearts...");

    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart");

        // Random positioning and sizing
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = (6 + Math.random() * 6) + "s";
        
        // Set initial opacity inline to override CSS
        const opacity = 0.2 + Math.random() * 0.1; // 0.2-0.3 opacity for better visibility
        heart.style.opacity = opacity;
        
        // Set size inline
        const size = 10 + Math.random() * 4; // 10-14px
        heart.style.width = size + "px";
        heart.style.height = size + "px";

        heartContainer.appendChild(heart);
        
        // Debug: Log heart creation
        console.log(`Heart created: size=${size}px, opacity=${opacity}, left=${heart.style.left}`);

        // Remove heart after animation completes
        setTimeout(() => {
            heart.remove();
        }, 12000);
    }

    // Create hearts every 800ms for consistent flow
    setInterval(createHeart, 800);
}

// Romantic Background System - ALL PAGES
function initRomanticBackground() {
    const romanticContainer = document.querySelector(".romantic-bg");
    if (!romanticContainer) return;
    
    // Clear existing elements
    romanticContainer.innerHTML = '';
    
    // Get current page class
    const bodyClass = document.body.className;
    
    // Add page-specific romantic animations
    if (bodyClass.includes('home-bg')) {
        // HOME: Romantic floating particles
        for (let i = 1; i <= 5; i++) {
            const particle = document.createElement('div');
            particle.className = `romantic-particle romantic-particle-${i}`;
            romanticContainer.appendChild(particle);
        }
    } else if (bodyClass.includes('analyze-bg')) {
        // ANALYZE: Love lines animation
        for (let i = 1; i <= 3; i++) {
            const line = document.createElement('div');
            line.className = `love-line love-line-${i}`;
            romanticContainer.appendChild(line);
        }
    } else if (bodyClass.includes('rewrite-bg')) {
        // REWRITE: Liquid morphing blobs
        for (let i = 1; i <= 2; i++) {
            const blob = document.createElement('div');
            blob.className = `liquid-blob liquid-blob-${i}`;
            romanticContainer.appendChild(blob);
        }
    } else if (bodyClass.includes('strategy-bg')) {
        // STRATEGY: Romantic grid elements
        for (let i = 1; i <= 2; i++) {
            const grid = document.createElement('div');
            grid.className = `romantic-grid romantic-grid-${i}`;
            romanticContainer.appendChild(grid);
        }
    } else if (bodyClass.includes('dating-bg')) {
        // DATING: Enhanced sparkles
        for (let i = 1; i <= 4; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = `sparkle sparkle-${i}`;
            romanticContainer.appendChild(sparkle);
        }
    } else if (bodyClass.includes('professional-bg')) {
        // PROFESSIONAL: Glass overlay effects
        for (let i = 1; i <= 2; i++) {
            const glass = document.createElement('div');
            glass.className = `glass-overlay glass-overlay-${i}`;
            romanticContainer.appendChild(glass);
        }
    } else if (bodyClass.includes('insights-bg')) {
        // INSIGHTS: Romantic stars and connections
        for (let i = 1; i <= 3; i++) {
            const star = document.createElement('div');
            star.className = `romantic-star romantic-star-${i}`;
            romanticContainer.appendChild(star);
        }
        for (let i = 1; i <= 2; i++) {
            const line = document.createElement('div');
            line.className = `connection-line connection-line-${i}`;
            romanticContainer.appendChild(line);
        }
    }
    
    console.log(`Romantic background initialized for: ${bodyClass}`);
}

document.addEventListener('DOMContentLoaded', () => {
    // Debug check for critical elements
    console.log("DOM Loaded. Checking elements...");
    const btn = document.getElementById('analyzeBtn');
    if (btn) console.log("✅ Analyze Button Found");
    else console.error("❌ Analyze Button NOT Found - Check ID in HTML");

    if (window.lucide) lucide.createIcons();
    switchTab('home');
    
    // Initialize romantic systems for ALL pages
    initFloatingHearts();
    initRomanticBackground();

    // Event Listeners for Core Actions
    if (btn) {
        btn.addEventListener('click', (e) => {
            console.log("🖱️ Analyze Button Clicked");
            e.preventDefault();
            analyzeMessage();
        });
    }

    // Rewrite Mode Listener
    const rewriteBtn = document.getElementById('main-rewrite-btn');
    if (rewriteBtn) {
        rewriteBtn.addEventListener('click', () => {
            console.log("🖱️ Rewrite Button Clicked");
            rewrite();
        });
    } else {
        console.error("❌ Rewrite Button (main-rewrite-btn) NOT Found");
    }

    // Strategy Mode Listener
    const strategyBtn = document.getElementById('strategy-btn');
    if (strategyBtn) {
        strategyBtn.addEventListener('click', () => {
            console.log("🖱️ Strategy Button Clicked");
            planStrategy();
        });
    } else {
        console.error("❌ Strategy Button (strategy-btn) NOT Found");
    }

    // Dating Mode Listeners
    const datingBtn = document.getElementById('interest-btn');
    if (datingBtn) {
        datingBtn.addEventListener('click', () => {
            console.log("🖱️ Interest Button Clicked");
            affinityAction('interest');
        });
    }
    const confessBtn = document.getElementById('confess-btn');
    if (confessBtn) {
        confessBtn.addEventListener('click', () => {
            console.log("🖱️ Confess Button Clicked");
            affinityAction('confess');
        });
    }

    // Professional Mode Listeners
    const professionalButtons = [
        { id: 'unpassive-btn', action: 'unpassive' },
        { id: 'assertive-btn', action: 'assertive' },
        { id: 'apology-btn', action: 'apology' }
    ];

    professionalButtons.forEach(btnInfo => {
        const pBtn = document.getElementById(btnInfo.id);
        if (pBtn) {
            pBtn.addEventListener('click', () => {
                console.log(`🖱️ Professional Button (${btnInfo.action}) Clicked`);
                corporateAction(btnInfo.action);
            });
        }
    });

    // Vision Mode Listener
    const visionBtn = document.getElementById('vision-btn');
    if (visionBtn) {
        visionBtn.addEventListener('click', () => {
            console.log("🖱️ Vision Button Clicked");
            handleVisionUpload();
        });
    }

    // Smart Replies Listener
    const repliesBtn = document.getElementById('gen-replies-btn');
    if (repliesBtn) {
        repliesBtn.addEventListener('click', () => {
            console.log("🖱️ Generate Replies Button Clicked");
            generateSmartReplies();
        });
    }

    // Live Tone Indicator Listeners
    document.querySelectorAll('textarea').forEach(area => {
        area.addEventListener('input', (e) => updateLiveTone(e.target));
    });
});

function switchTab(tabId) {
    // 1. Update body class for unique page backgrounds
    const pageClasses = {
        'home': 'home-bg',
        'resonance': 'analyze-bg',
        'rewrite': 'rewrite-bg', 
        'strategy': 'strategy-bg',
        'affinity': 'dating-bg',
        'corporate': 'professional-bg',
        'history': 'insights-bg'
    };
    
    // Remove all page classes and add the current one
    document.body.className = `${pageClasses[tabId]} bg-animate scrollbar-hide`;
    
    // 2. Theme Engine - Apply Mode Class to Body
    document.body.classList.add(`theme-${tabId}`);

    // 3. Reinitialize romantic animations for new page
    initRomanticBackground();

    // 4. Navigation Updates
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick')?.includes(`'${tabId}'`)) btn.classList.add('active');
    });

    // 5. Content Visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.remove('hidden');
            requestAnimationFrame(() => content.classList.remove('opacity-0'));
        } else {
            content.classList.add('opacity-0');
            setTimeout(() => content.classList.add('hidden'), 300);
        }
    });

    if (tabId === 'history') loadHistory();
    if (window.lucide) lucide.createIcons();
}

function updateLiveTone(el) {
    const text = el.value.trim().toLowerCase();
    const container = el.parentElement;
    const indicator = container.querySelector('.tone-indicator');
    const meterContainer = container.querySelector('.reaction-meter-container');
    const meterBar = container.querySelector('.reaction-meter-bar');

    if (!indicator) return;

    if (!text) {
        indicator.style.background = 'var(--accent-primary)';
        indicator.style.boxShadow = '0 0 15px var(--accent-primary)';
        indicator.classList.remove('pulse-glow');
        if (meterContainer) meterContainer.style.opacity = '0';
        return;
    }

    indicator.classList.add('pulse-glow');
    if (meterContainer) meterContainer.style.opacity = '1';

    // Simple Keyword Match for Live Preview (No API call)
    const negative = ['angry', 'bad', 'hate', 'upset', 'worst', 'stupid', 'no', 'dont', 'don\'t', 'kill', 'shut'];
    const positive = ['happy', 'love', 'good', 'best', 'great', 'yes', 'thanks', 'glad', 'appreciate'];
    const corporate = ['approve', 'review', 'request', 'regards', 'kindly', 'attach', 'meeting'];

    let color = 'var(--accent-primary)';
    let intensity = Math.min(100, text.length * 2); // Simple length-based intensity

    if (negative.some(w => text.includes(w))) {
        color = '#ef4444'; // Red
    } else if (positive.some(w => text.includes(w))) {
        color = '#f472b6'; // Pink
    } else if (corporate.some(w => text.includes(w))) {
        color = '#3b82f6'; // Blue
    } else {
        color = '#a855f7'; // Purple (Neutral/Unknown)
    }

    indicator.style.background = color;
    indicator.style.boxShadow = `0 0 20px ${color}`;

    if (meterBar) {
        meterBar.style.width = `${intensity}%`;
        meterBar.style.backgroundColor = color;
        meterBar.style.boxShadow = `0 0 10px ${color}`;
    }
}

// Nova Romantic Particles System
function createNovaParticles() {
    const container = document.getElementById('nova-particles');
    if (!container) return;
    
    // Create romantic hearts (minimal, not cartoonish)
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = 'romantic-heart';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 20 + 's';
        heart.style.animationDuration = (20 + Math.random() * 10) + 's';
        container.appendChild(heart);
    }
    
    // Create fairy dust particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'fairy-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = (25 + Math.random() * 15) + 's';
        container.appendChild(particle);
    }
}

// Add message fade-in animation function
function addMessageFadeIn(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.classList.add('message-fade-in');
        element.style.opacity = '';
        element.style.transform = '';
    }, delay);
}

// Show typing indicator
function showTypingIndicator(container) {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    container.appendChild(indicator);
    return indicator;
}

// Hide typing indicator
function hideTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
        indicator.remove();
    }
}

// Add romantic pulse effect to buttons
function addRomanticPulse(button) {
    button.classList.add('btn-pulse');
    setTimeout(() => {
        button.classList.remove('btn-pulse');
    }, 600);
}

// Add fade-lift animation to results
function addFadeLiftAnimation(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        element.classList.add('fade-lift');
        element.style.opacity = '';
        element.style.transform = '';
    }, delay);
}

async function analyzeMessage() {
    console.log("🚀 Starting analysis...");
    const msgInput = document.getElementById('messageInput');
    const relInput = document.getElementById('relationshipSelect');
    const analyzeBtn = document.getElementById('analyzeBtn');

    if (!msgInput) { console.error("❌ Message Input not found!"); return; }

    const msg = msgInput.value.trim();
    const rel = relInput ? relInput.value : 'Stranger';
    const results = document.getElementById('resonance-results');

    if (!msg) {
        showStatus("Perspective requires a thought. Please type something.");
        return;
    }

    // Add romantic pulse effect
    addRomanticPulse(analyzeBtn);
    
    toggleLoader(true, "Decoding signal...");
    results.classList.add('hidden');

    try {
        console.log("SENDING /analyze:", { message: msg, relationship: rel });
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, relationship: rel })
        });

        const data = await response.json();
        console.log("RECEIVED /analyze:", data);

        if (!response.ok) {
            throw new Error(data.error || "Signal extraction failed.");
        }

        renderPremiumResults(data);
        saveToHistory(data);
    } catch (e) {
        console.error("Analysis Critical Failure:", e);
        showStatus("CRITICAL: " + (e.message || "Connection refused."));
    } finally {
        toggleLoader(false);
    }
}

function renderPremiumResults(data) {
    const results = document.getElementById('resonance-results');
    results.classList.remove('hidden');
    
    // Add fade-lift animation to results container
    addFadeLiftAnimation(results);

    // Primary Metrics - add staggered animations
    const metrics = ['res-emotion', 'res-clarity', 'res-empathy'];
    metrics.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element) {
            addFadeLiftAnimation(element.parentElement, index * 100);
        }
    });
    
    document.getElementById('res-emotion').textContent = data.emotion || 'Unknown';
    document.getElementById('res-clarity').textContent = `${data.intensity || 0}%`;
    document.getElementById('res-empathy').textContent = `${data.empathy || data.structure || 0}%`;

    // Conflict Risk
    const riskLabel = document.getElementById('res-risk');
    const riskBar = document.getElementById('res-risk-bar');
    const riskLevel = (data.conflict_risk || 'Low').toLowerCase();

    riskLabel.textContent = data.conflict_risk || 'Low';
    riskLabel.className = "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest";

    riskBar.style.width = '0%';

    if (riskLevel.includes('high')) {
        riskLabel.classList.add('glow-red');
        riskBar.style.width = '85%';
        riskBar.style.backgroundColor = '#ef4444';
    } else if (riskLevel.includes('med')) {
        riskLabel.classList.add('glow-yellow');
        riskBar.style.width = '45%';
        riskBar.style.backgroundColor = '#f59e0b';
    } else {
        riskLabel.classList.add('glow-green');
        riskBar.style.width = '15%';
        riskBar.style.backgroundColor = '#22c55e';
    }

    // Deep Interpretation
    const interp = document.getElementById('res-interpretation');
    interp.textContent = data.interpretation || data.tone || "No tactical signal detected.";

    // Update Global Stats
    updateStats(data);

    // Trigger Lucide refresh
    if (window.lucide) lucide.createIcons();

    // Render Automatic Rewrites with fade-lift
    const grid = document.getElementById('rewrite-grid');
    if (grid) {
        grid.innerHTML = ''; // Clear previous
        if (data.rewrites) {
            const styles = [
                { key: 'softer', label: 'Softer', color: 'text-pink-400', icon: 'feather' },
                { key: 'assertive', label: 'Assertive', color: 'text-blue-400', icon: 'shield' },
                { key: 'professional', label: 'Professional', color: 'text-slate-400', icon: 'briefcase' },
                { key: 'neutral', label: 'Neutral', color: 'text-gray-400', icon: 'minus' }
            ];

            styles.forEach((style, index) => {
                const text = data.rewrites[style.key];
                if (!text) return;

                const card = document.createElement('div');
                card.className = "glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all group relative";

                card.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <span class="${style.color} text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                            <i data-lucide="${style.icon}" class="w-3 h-3"></i> ${style.label}
                        </span>
                        <button onclick="copyToClipboard('${text.replace(/'/g, "\\'")}', this.parentElement.parentElement)" 
                                class="text-white/20 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                            <i data-lucide="copy" class="w-3 h-3"></i>
                        </button>
                    </div>
                    <p class="text-sm text-white/80 leading-relaxed font-light">${text}</p>
                `;
                grid.appendChild(card);
                
                // Add staggered fade-lift animation
                addFadeLiftAnimation(card, index * 150);
            });
            if (window.lucide) lucide.createIcons();
        }
    }

    document.getElementById('resonance-results').scrollIntoView({ behavior: 'smooth' });
}

function updateStats(data) {
    if (!data) return;
    const countEl = document.getElementById('stat-count');
    countEl.textContent = parseInt(countEl.textContent) + 1;

    if (data.emotion) document.getElementById('stat-emotion').textContent = data.emotion;
    if (data.intensity) document.getElementById('stat-growth').textContent = `${data.intensity}%`;
}

// Removed updateMetricsChart function as per instruction "Remove defunct chart logic"

async function rewrite() {
    const input = document.getElementById('rewrite-input').value.trim();
    const rel = document.getElementById('rewrite-rel').value;
    const style = document.getElementById('rewrite-style').value;
    const resultDiv = document.getElementById('rewrite-result-div');
    const rewriteBtn = document.getElementById('main-rewrite-btn');

    if (!input) {
        showStatus("Transformation requires an original. Please type something.");
        return;
    }

    // Add romantic pulse effect
    addRomanticPulse(rewriteBtn);
    
    toggleLoader(true, "Improving signal clarity...");
    resultDiv.classList.add('hidden');

    try {
        const response = await fetch('/rewrite', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, relationship: rel, style: style })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        resultDiv.classList.remove('hidden');
        // FIX: backend returns 'rewrite' key, not 'rewritten_text'
        document.getElementById('rewrite-output').textContent = data.rewrite || data.fallback_output || data.rewritten_text;
        
        // Add fade-lift animation to result
        addFadeLiftAnimation(resultDiv);
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        showStatus("Rewrite Failed: " + e.message);
    } finally {
        toggleLoader(false);
    }
}

function updateEmotionGlow(emotion) {
    const overlay = document.querySelector('.emotion-overlay');
    overlay.className = 'emotion-overlay'; // reset
    if (emotion.includes('anger') || emotion.includes('frustrat')) overlay.classList.add('glow-angry');
    else if (emotion.includes('love') || emotion.includes('kind') || emotion.includes('passion')) overlay.classList.add('glow-love');
    else if (emotion.includes('sad') || emotion.includes('hurt') || emotion.includes('lonely')) overlay.classList.add('glow-sad');
    else overlay.classList.add('glow-neutral');
}

async function generateSmartReplies() {
    const msg = document.getElementById('reply-input').value.trim();
    const grid = document.getElementById('reply-grid');
    if (!msg) return;

    toggleLoader(true, "Thinking...");
    grid.innerHTML = '';
    grid.classList.add('hidden');

    try {
        console.log("SENDING /generate_replies:", { received_message: msg });
        const response = await fetch('/generate_replies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ received_message: msg })
        });

        const result = await response.json();
        console.log("RECEIVED /generate_replies:", result);

        if (!response.ok) {
            throw new Error(result.error || "Reply generation failed.");
        }

        grid.classList.remove('hidden');
        const types = [
            { k: 'calm', i: 'wind', l: 'Calm' },
            { k: 'confident', i: 'shield-check', l: 'Confident' },
            { k: 'flirty', i: 'sparkles', l: 'Flirty' },
            { k: 'funny', i: 'laugh', l: 'Funny' },
            { k: 'professional', i: 'briefcase', l: 'Professional' },
            { k: 'deep', i: 'heart', l: 'Deep' }
        ];

        types.forEach(t => {
            if (!result[t.k]) return;
            const el = document.createElement('div');
            el.className = 'glass-panel p-6 rounded-3xl hover:border-white/20 transition-all cursor-pointer group fade-up output-card';
            el.onclick = () => copyToClipboard(result[t.k], el);

            const label = document.createElement('div');
            label.className = 'text-saas-label mb-2 opacity-50 flex items-center gap-2';
            label.innerHTML = `<i data-lucide="${t.i}" class="w-3 h-3"></i>${t.l}`;

            const content = document.createElement('p');
            content.className = 'text-sm font-light leading-relaxed output-text';
            content.textContent = result[t.k];

            el.appendChild(label);
            el.appendChild(content);
            grid.appendChild(el);
        });
        lucide.createIcons();
    } catch (e) {
        console.error("Replies Error:", e);
        showStatus("Social battery low (Error 500).");
    } finally {
        toggleLoader(false);
    }
}

async function planStrategy() {
    const goal = document.getElementById('strategy-goal').value.trim();
    const rel = document.getElementById('relationshipSelect')?.value || 'Stranger';
    const strategyBtn = document.getElementById('strategy-btn');
    
    if (!goal) return;

    // Add romantic pulse effect
    addRomanticPulse(strategyBtn);
    
    console.log("STRATEGY REQUEST:", { user_input: goal, relationship_type: rel });
    toggleLoader(true, "Architecting strategy...");
    const resDiv = document.getElementById('strategy-result');
    const stepsDiv = document.getElementById('strategy-steps');
    resDiv.classList.add('hidden');
    stepsDiv.innerHTML = '';

    try {
        console.log("SENDING /strategy:", { user_input: goal, relationship_type: rel });
        const resp = await fetch('/strategy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_input: goal, relationship_type: rel })
        });

        const result = await resp.json();
        console.log("RECEIVED /strategy:", result);

        if (!resp.ok) {
            throw new Error(result.error || "Strategy planning failed.");
        }

        resDiv.classList.remove('hidden');

        // Render exactly 6 steps
        const steps = [
            { label: 'Step 1', val: result.step1 },
            { label: 'Step 2', val: result.step2 },
            { label: 'Step 3', val: result.step3 },
            { label: 'Step 4', val: result.step4 },
            { label: 'Step 5', val: result.step5 },
            { label: 'Step 6', val: result.step6 }
        ];

        const hasAnyStep = steps.some(s => s.val);

        if (hasAnyStep) {
            steps.forEach((step, i) => {
                if (!step.val) return;
                const el = document.createElement('div');
                el.className = 'visual-block';

                const label = document.createElement('span');
                label.className = 'visual-block-label';
                label.textContent = step.label;

                const content = document.createElement('div');
                content.className = 'visual-block-value output-text';
                content.textContent = step.val;

                el.appendChild(label);
                el.appendChild(content);
                stepsDiv.appendChild(el);
                
                // Add staggered fade-lift animation
                addFadeLiftAnimation(el, i * 200);
            });
        } else if (result.fallback_output) {
            const el = document.createElement('div');
            el.className = 'visual-block';
            const content = document.createElement('div');
            content.className = 'visual-block-value output-text';
            content.textContent = result.fallback_output;
            el.appendChild(content);
            stepsDiv.appendChild(el);
            
            // Add fade-lift animation
            addFadeLiftAnimation(el);
        }

        // Hide the old sidebar fields as they are now integrated into the main flow
        const openingEl = document.getElementById('strategy-opening');
        if (openingEl && openingEl.parentElement && openingEl.parentElement.parentElement) {
            openingEl.parentElement.parentElement.classList.add('hidden');
        }

        resDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        console.error("Strategy Error:", e);
        // Display the specific error from the backend or a default message
        const errorMsg = e.message || "Unable to generate strategy. Please try again.";
        showStatus(errorMsg);

        // Also show in the results area for better visibility
        stepsDiv.innerHTML = `<div class="p-4 text-red-400 text-center border border-red-500/30 rounded-lg bg-red-500/10">
            <p class="font-bold">Strategy Failed</p>
            <p class="text-sm opacity-80">${errorMsg}</p>
        </div>`;
        resDiv.classList.remove('hidden');
    } finally {
        toggleLoader(false);
    }
}

async function affinityAction(type) {
    const input = document.getElementById('interest-input').value.trim();
    const resultDiv = document.getElementById('affinity-result');
    const resultText = document.getElementById('affinity-text');

    if (!input) {
        showStatus("Analyzing dating signals requires context. Please type or paste a message.");
        return;
    }

    toggleLoader(true, type === 'interest' ? "Analyzing attraction signals..." : "Crafting confession strategy...");
    resultDiv.classList.add('hidden');

    try {
        const response = await fetch('/affinity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // FIX: backend expects 'action', not 'type'
            body: JSON.stringify({ message: input, action: type })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        resultDiv.classList.remove('hidden');
        // FIX: backend returns 'result' key, not 'analysis'
        resultText.textContent = data.result || data.analysis || data.fallback_output;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        showStatus("Affinity Error: " + e.message);
    } finally {
        toggleLoader(false);
    }
}

async function corporateAction(action) {
    const input = document.getElementById('work-input').value.trim();
    const resultDiv = document.getElementById('corporate-result');
    const resultText = document.getElementById('corporate-text');

    if (!input) {
        showStatus("Professional polish requires a draft. Please type something.");
        return;
    }

    toggleLoader(true, "Applying professional armor...");
    resultDiv.classList.add('hidden');

    try {
        const response = await fetch('/corporate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, action: action })
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error);

        resultDiv.classList.remove('hidden');
        resultText.textContent = data.result || data.fallback_output;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        showStatus("Corporate Error: " + e.message);
    } finally {
        toggleLoader(false);
    }
}

async function handleVisionUpload() {
    const resDiv = document.getElementById('vision-result');
    const extText = document.getElementById('vision-extracted');
    const interText = document.getElementById('vision-interpretation');
    const suggText = document.getElementById('vision-suggestion');

    toggleLoader(true, "Scanning visual cortex...");
    resDiv.classList.add('hidden');
    extText.textContent = "";
    interText.textContent = "";
    suggText.textContent = "";

    // Simulation of upload delay
    setTimeout(async () => {
        try {
            console.log("SENDING /analyze_screenshot (Simulated)");
            const resp = await fetch('/analyze_screenshot', { method: 'POST' });
            const data = await resp.json();
            console.log("RECEIVED /analyze_screenshot:", data);

            if (!resp.ok) {
                throw new Error(data.error || "Scanner malfunction.");
            }

            resDiv.classList.remove('hidden');
            extText.textContent = data.extracted_text || "No text extracted.";

            const analysis = data.analysis || {};
            if (analysis.error || !analysis.emotion) {
                typeText(interText, "Deep scan failed. Raw: " + (analysis.fallback_output || "No data."));
            } else {
                typeText(interText, `${analysis.emotion} / ${analysis.tone}`);
                typeText(suggText, analysis.interpretation || "No specific action needed.");
            }
            resDiv.scrollIntoView({ behavior: 'smooth' });
        } catch (e) {
            console.error("Vision Critical Failure:", e);
            showStatus("CRITICAL: " + (e.message || "Optical sensors offline."));
        } finally {
            toggleLoader(false);
        }
    }, 1000);
}

function showEmergency() {
    const overlay = document.getElementById('emergency-overlay');
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 100);
}

function closeEmergency() {
    const overlay = document.getElementById('emergency-overlay');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 1000);
}

function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('echo_history') || '[]');
    history.push({ emotion: data.emotion, intensity: data.intensity, date: new Date().toISOString() });
    localStorage.setItem('echo_history', JSON.stringify(history.slice(-20)));
}

async function loadHistory() {
    console.log("Loading History...");

    // 1. Fetch from Backend (Verification of Route)
    try {
        console.log("SENDING /insights");
        const response = await fetch('/insights');
        const data = await response.json();
        console.log("RECEIVED /insights:", data);
    } catch (e) {
        console.error("Insights Backend Error:", e);
    }

    // 2. Load Local Data (Existing Logic)
    let history = JSON.parse(localStorage.getItem('echo_history') || '[]');
    if (history.length === 0) return;

    document.getElementById('stat-count').textContent = history.length;
    document.getElementById('stat-emotion').textContent = history[history.length - 1].emotion;
    const avg = history.reduce((a, b) => a + b.intensity, 0) / history.length;
    document.getElementById('stat-growth').textContent = `${Math.round(avg)}%`;
    updateHistoryChart(history);
}

function updateHistoryChart(history) {
    const ctx = document.getElementById('historyChart').getContext('2d');
    if (historyChart) historyChart.destroy();
    historyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: history.map((_, i) => i + 1),
            datasets: [{
                data: history.map(h => h.intensity),
                borderColor: '#3b82f6', tension: 0.4, fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)'
            }]
        },
        options: {
            scales: { y: { display: false }, x: { display: false } },
            plugins: { legend: { display: false } },
            maintainAspectRatio: false
        }
    });
}

function toggleLoader(show, text = "") {
    const loader = document.getElementById('loader-overlay');
    if (show) {
        document.getElementById('loader-text').textContent = text;
        loader.classList.remove('hidden');
        setTimeout(() => loader.classList.remove('opacity-0'), 10);
    } else {
        loader.classList.add('opacity-0');
        setTimeout(() => loader.classList.add('hidden'), 500);
    }
}

function typeText(el, text, i = 0, speed = 10) {
    if (!text) return;
    if (i < text.length) {
        el.textContent += text.charAt(i);
        setTimeout(() => typeText(el, text, i + 1, speed), speed);
    }
}

function copyToClipboard(text, el) {
    navigator.clipboard.writeText(text);
    const orig = el.innerHTML;
    el.innerHTML = '<div class="text-blue-500 font-bold text-[10px] text-center p-4">COPIED</div>';
    setTimeout(() => { el.innerHTML = orig; lucide.createIcons(); }, 1000);
}

function showStatus(msg) {
    // Custom premium status alert
    console.warn("ECHO SYSTEM ALERT:", msg);
    // Use a toast or structured alert in future, but for now alerted message
    if (msg.includes("Unable to generate response")) {
        alert("ECHO: " + msg);
    } else {
        alert(msg);
    }
}
