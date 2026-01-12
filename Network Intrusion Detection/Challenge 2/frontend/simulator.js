// ============================================================================
// LIVE ATTACK SIMULATOR - ADD TO script.js OR INCLUDE AS SEPARATE FILE
// ============================================================================

// Model-specific feature importance (what each model looks at most)
const MODEL_KEY_FEATURES = {
    'neural_network': {
        top3: ['serror_rate', 'dst_host_serror_rate', 'same_srv_rate'],
        hint: 'NN focuses on ERROR RATES (serror ~25%, dst_host_serror ~20%) + connection patterns (~15%). Best for rare U2R attacks!'
    },
    'xgboost': {
        top3: ['dst_host_serror_rate', 'serror_rate', 'count'],
        hint: 'XGBoost balances ERROR RATES (dst_host_serror ~22%, serror ~20%) + CONNECTION COUNT (~15%). Highest overall accuracy (76.69%)!'
    },
    'decision_tree': {
        top3: ['dst_host_serror_rate', 'serror_rate', 'srv_count'],
        hint: 'Decision Tree splits on HOST ERROR RATE (~25%) first, then SYN errors (~18%). Fastest & most explainable!'
    },
    'random_forest': {
        top3: ['dst_host_serror_rate', 'serror_rate', 'same_srv_rate'],
        hint: 'Random Forest aggregates ERROR RATES (dst_host ~20%, serror ~18%) across trees. Failed at U2R (0%) but good for DoS!'
    }
};

// Attack presets (realistic scenarios)
const ATTACK_PRESETS = {
    'normal': {
        protocol_type: 'tcp',
        service: 'http',
        flag: 'SF',
        duration: 15,
        serror_rate: 2,  // Low but not zero (realistic)
        dst_host_serror_rate: 3,
        srv_serror_rate: 2,
        count: 8,  // Normal browsing
        same_srv_rate: 60,
        logged_in: true,  // Normal users authenticate
        root_shell: false,
        su_attempted: false,
        num_failed_logins: 0,
        description: 'Legitimate HTTP browsing - Complete connection (SF), low errors, authenticated',
        reasoning: 'SF flag = normal completion. Low error rates <5%. Authenticated. Duration 15s = human browsing.'
    },
    'dos': {
        protocol_type: 'tcp',
        service: 'private',  // Most attacked service
        flag: 'S0',  // KEY: No response = flooding
        duration: 0,  // Instant = automated
        serror_rate: 85,  // TOP FEATURE: High SYN errors
        dst_host_serror_rate: 88,  // 2nd TOP: Host overwhelmed
        srv_serror_rate: 87,
        count: 420,  // Massive connections
        same_srv_rate: 92,  // Focused on one service
        logged_in: false,  // DoS doesn't authenticate
        root_shell: false,
        su_attempted: false,
        num_failed_logins: 0,
        description: 'SYN flood DoS - S0 flag + 85% errors + 420 connections',
        reasoning: 'S0 flag (69% of DoS). SYN errors 85% (top feature). 420 rapid connections. Private service targeted.'
    },
    'probe': {
        protocol_type: 'tcp',
        service: 'http',  // Scanning common services
        flag: 'REJ',  // KEY: Rejected = scanning
        duration: 2,  // Quick probes
        serror_rate: 18,  // Moderate errors from rejections
        dst_host_serror_rate: 22,
        srv_serror_rate: 20,
        count: 150,  // Many connection attempts
        same_srv_rate: 30,  // Varied services (scanning)
        logged_in: false,  // Probes don't authenticate
        root_shell: false,
        su_attempted: false,
        num_failed_logins: 0,
        description: 'Port scan (Nmap-style) - REJ flag + varied services + 150 attempts',
        reasoning: 'REJ flag (27% of Probe). Moderate errors from rejections. 150 attempts. Low same_srv_rate = varied targets.'
    },
    'u2r': {
        protocol_type: 'tcp',
        service: 'telnet',  // KEY: 60% of U2R use Telnet
        flag: 'SF',  // Normal completion
        duration: 25,  // Longer = exploit execution
        serror_rate: 6,  // Low errors (not DoS)
        dst_host_serror_rate: 8,
        srv_serror_rate: 7,
        count: 5,  // Few connections (targeted)
        same_srv_rate: 80,  // Focused attack
        logged_in: true,  // CRITICAL: Must authenticate first
        root_shell: true,  // CRITICAL: Root access gained!
        su_attempted: true,  // Tried privilege escalation
        num_failed_logins: 0,
        description: 'Privilege escalation (Buffer overflow) - Telnet + authenticated + ROOT SHELL',
        reasoning: 'Telnet (60% of U2R). Logged in required. Root shell = 30% impact! Su_attempted = escalation. Low errors.'
    },
    'r2l': {
        protocol_type: 'tcp',
        service: 'ftp',  // Common R2L target
        flag: 'SF',  // Normal completion
        duration: 12,  // Medium duration
        serror_rate: 10,
        dst_host_serror_rate: 12,
        srv_serror_rate: 11,
        count: 18,  // Multiple login attempts
        same_srv_rate: 85,
        logged_in: false,  // Failed to login (brute force)
        root_shell: false,
        su_attempted: false,
        num_failed_logins: 4,  // KEY: Multiple failed attempts
        description: 'Remote access (FTP brute force) - 4 failed logins',
        reasoning: 'FTP service. 4 failed logins = brute force indicator. Not logged in. Moderate connection count.'
    }
};

// Initialize simulator when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSimulator();
});

function initializeSimulator() {
    // Add event listener for model selection
    const modelSelect = document.getElementById('simulatorModel');
    if (modelSelect) {
        modelSelect.addEventListener('change', updateModelHint);
        updateModelHint(); // Initial hint
    }
    
    // Add event listeners for range sliders
    const ranges = ['serror_rate', 'dst_host_serror_rate', 'srv_serror_rate', 'duration', 'count', 'same_srv_rate', 'num_failed_logins'];
    ranges.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                document.getElementById(id + '_val').textContent = this.value;
            });
        }
    });
    
    // Add event listeners for dropdowns (hints)
    const serviceSelect = document.getElementById('service');
    const flagSelect = document.getElementById('flag');
    
    if (serviceSelect) {
        serviceSelect.addEventListener('change', updateServiceHint);
        updateServiceHint();
    }
    
    if (flagSelect) {
        flagSelect.addEventListener('change', updateFlagHint);
        updateFlagHint();
    }
}

function updateModelHint() {
    const model = document.getElementById('simulatorModel').value;
    const hint = MODEL_KEY_FEATURES[model].hint;
    const hintDiv = document.getElementById('modelHint');
    
    if (hintDiv) {
        hintDiv.innerHTML = `<div class="hint-box">${hint}</div>`;
    }
}

function updateServiceHint() {
    const service = document.getElementById('service').value;
    const hints = {
        'http': '✓ Most common (32% of traffic) - Normal browsing',
        'private': '⚠️ Heavily targeted! 66% of DoS + 43% of Probe attacks',
        'telnet': '🚨 U2R vector! 60% of privilege escalation attacks use Telnet',
        'eco_i': '🔍 Probe indicator! 34% of reconnaissance attacks',
        'ftp': '🔐 R2L vector - often targeted for brute force',
        'ssh': '✓ Secure shell - generally safer',
        'smtp': '✓ Email service',
        'domain_u': '✓ DNS service'
    };
    
    const hintDiv = document.getElementById('serviceHint');
    if (hintDiv && hints[service]) {
        hintDiv.textContent = hints[service];
    }
}

function updateFlagHint() {
    const flag = document.getElementById('flag').value;
    const hints = {
        'SF': '✓ Normal - Complete connection (60% of traffic, 95% of Normal)',
        'S0': '🚨 DoS INDICATOR! No response = flooding (69% of DoS attacks)',
        'REJ': '🔍 Probe INDICATOR! Rejected = scanning (27% of Probe attacks)',
        'RSTO': 'Client reset - Neutral',
        'RSTOS0': '⚠️ Server rejected SYN - Scan indicator',
        'SH': '⚠️ Malformed packet - Attack indicator'
    };
    
    const hintDiv = document.getElementById('flagHint');
    if (hintDiv && hints[flag]) {
        hintDiv.textContent = hints[flag];
    }
}

function loadPreset(type) {
    const preset = ATTACK_PRESETS[type];
    
    // Set all form values
    document.getElementById('protocol_type').value = preset.protocol_type;
    document.getElementById('service').value = preset.service;
    document.getElementById('flag').value = preset.flag;
    document.getElementById('duration').value = preset.duration;
    document.getElementById('serror_rate').value = preset.serror_rate;
    document.getElementById('dst_host_serror_rate').value = preset.dst_host_serror_rate;
    document.getElementById('srv_serror_rate').value = preset.srv_serror_rate;
    document.getElementById('count').value = preset.count;
    document.getElementById('same_srv_rate').value = preset.same_srv_rate;
    document.getElementById('logged_in').checked = preset.logged_in;
    document.getElementById('root_shell').checked = preset.root_shell;
    document.getElementById('su_attempted').checked = preset.su_attempted;
    document.getElementById('num_failed_logins').value = preset.num_failed_logins;
    
    // Update all range displays
    document.getElementById('duration_val').textContent = preset.duration;
    document.getElementById('serror_rate_val').textContent = preset.serror_rate;
    document.getElementById('dst_host_serror_rate_val').textContent = preset.dst_host_serror_rate;
    document.getElementById('srv_serror_rate_val').textContent = preset.srv_serror_rate;
    document.getElementById('count_val').textContent = preset.count;
    document.getElementById('same_srv_rate_val').textContent = preset.same_srv_rate;
    document.getElementById('num_failed_logins_val').textContent = preset.num_failed_logins;
    
    // Update hints
    updateServiceHint();
    updateFlagHint();
    
    // Show notification with reasoning
    showNotification(`Loaded: ${preset.description}\n\nWhy these values?\n${preset.reasoning}`);
}

function classifyTraffic() {
    // Gather all form values
    const traffic = {
        protocol_type: document.getElementById('protocol_type').value,
        service: document.getElementById('service').value,
        flag: document.getElementById('flag').value,
        duration: parseInt(document.getElementById('duration').value),
        serror_rate: parseInt(document.getElementById('serror_rate').value),
        dst_host_serror_rate: parseInt(document.getElementById('dst_host_serror_rate').value),
        srv_serror_rate: parseInt(document.getElementById('srv_serror_rate').value),
        count: parseInt(document.getElementById('count').value),
        same_srv_rate: parseInt(document.getElementById('same_srv_rate').value),
        logged_in: document.getElementById('logged_in').checked ? 1 : 0,
        root_shell: document.getElementById('root_shell').checked ? 1 : 0,
        su_attempted: document.getElementById('su_attempted').checked ? 1 : 0,
        num_failed_logins: parseInt(document.getElementById('num_failed_logins').value)
    };
    
    const selectedModel = document.getElementById('simulatorModel').value;
    
    // Simulate AI classification (rule-based for demo)
    const result = simulateAIClassification(traffic, selectedModel);
    
    // Display results
    displaySimulatorResults(result, traffic, selectedModel);
    
    // Scroll to results
    document.getElementById('simulatorResults').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function simulateAIClassification(traffic, model) {
    // Rule-based simulation (mimics real AI patterns)
    let prediction = 'Normal';
    let confidence = 50;
    let reasoning = [];
    let keyFeatures = [];
    
    // Flag analysis (strongest indicator)
    if (traffic.flag === 'S0') {
        prediction = 'DoS';
        confidence = 85;
        reasoning.push('🚨 S0 flag detected (SYN with no response) - Strong DoS indicator');
        keyFeatures.push({name: 'flag', value: 'S0', impact: '+45%', type: 'attack'});
    } else if (traffic.flag === 'REJ') {
        prediction = 'Probe';
        confidence = 75;
        reasoning.push('🔍 REJ flag detected (Connection rejected) - Scanning behavior');
        keyFeatures.push({name: 'flag', value: 'REJ', impact: '+35%', type: 'attack'});
    }
    
    // Error rate analysis (top features)
    if (traffic.serror_rate > 50) {
        if (prediction === 'Normal') {
            prediction = 'DoS';
            confidence = 90;
        } else {
            confidence = Math.min(95, confidence + 10);
        }
        reasoning.push(`🔴 High SYN error rate (${traffic.serror_rate}%) - Flooding detected`);
        keyFeatures.push({name: 'serror_rate', value: `${traffic.serror_rate}%`, impact: '+' + Math.round(traffic.serror_rate / 2) + '%', type: 'attack'});
    }
    
    if (traffic.dst_host_serror_rate > 50) {
        confidence = Math.min(98, confidence + 5);
        reasoning.push(`🔴 High host error rate (${traffic.dst_host_serror_rate}%) - Target overwhelmed`);
        keyFeatures.push({name: 'dst_host_serror_rate', value: `${traffic.dst_host_serror_rate}%`, impact: '+' + Math.round(traffic.dst_host_serror_rate / 3) + '%', type: 'attack'});
    }
    
    // U2R detection (Neural Network specialty!)
    if (traffic.root_shell === 1) {
        prediction = 'U2R';
        confidence = model === 'neural_network' ? 95 : 70; // NN best at U2R!
        reasoning.push('⚠️ ROOT SHELL ACCESS detected - Privilege escalation confirmed!');
        keyFeatures.push({name: 'root_shell', value: '1 (Yes)', impact: '+50%', type: 'attack'});
    }
    
    if (traffic.su_attempted === 1 && prediction === 'Normal') {
        prediction = 'U2R';
        confidence = model === 'neural_network' ? 80 : 60;
        reasoning.push('⚠️ Privilege escalation attempt (su_attempted)');
        keyFeatures.push({name: 'su_attempted', value: '1 (Yes)', impact: '+30%', type: 'attack'});
    }
    
    // R2L detection
    if (traffic.num_failed_logins >= 3) {
        if (prediction === 'Normal') {
            prediction = 'R2L';
            confidence = 80;
        }
        reasoning.push(`🔐 Multiple failed logins (${traffic.num_failed_logins}) - Brute force attempt`);
        keyFeatures.push({name: 'num_failed_logins', value: traffic.num_failed_logins, impact: '+25%', type: 'attack'});
    }
    
    // Connection count analysis
    if (traffic.count > 200) {
        if (prediction === 'Normal') {
            prediction = 'DoS';
            confidence = 75;
        } else if (prediction === 'DoS') {
            confidence = Math.min(98, confidence + 10);
        }
        reasoning.push(`📊 High connection count (${traffic.count}) - Rapid flooding pattern`);
        keyFeatures.push({name: 'count', value: traffic.count, impact: '+20%', type: 'attack'});
    }
    
    // Service + Flag combination
    if (traffic.service === 'telnet' && traffic.logged_in === 1) {
        if (prediction === 'Normal') {
            prediction = 'U2R';
            confidence = 70;
        }
        reasoning.push('🚨 Telnet with authentication - U2R attack vector (60% of U2R use Telnet)');
    }
    
    if (traffic.service === 'private' && (traffic.flag === 'S0' || traffic.serror_rate > 30)) {
        if (prediction === 'Normal') {
            prediction = 'DoS';
            confidence = 80;
        }
        reasoning.push('⚠️ Private service + errors/S0 flag - Common DoS target');
    }
    
    // Normal traffic indicators
    if (traffic.flag === 'SF' && traffic.serror_rate < 10 && traffic.dst_host_serror_rate < 10 && traffic.count < 50 && traffic.root_shell === 0 && traffic.num_failed_logins === 0) {
        prediction = 'Normal';
        confidence = 85;
        reasoning = ['✅ SF flag (complete connection)', '✅ Low error rates (<10%)', '✅ Normal connection count', '✅ No security violations'];
        keyFeatures.push({name: 'flag', value: 'SF', impact: '-40%', type: 'normal'});
        keyFeatures.push({name: 'serror_rate', value: `${traffic.serror_rate}%`, impact: '-20%', type: 'normal'});
    }
    
    // Model-specific adjustments
    if (model === 'neural_network' && prediction === 'U2R') {
        confidence = Math.min(98, confidence + 10); // NN best at U2R
    }
    
    if (model === 'random_forest' && prediction === 'U2R') {
        confidence = Math.max(5, confidence - 20); // RF terrible at U2R (0%)
        reasoning.push('⚠️ Note: Random Forest struggles with U2R (0% F1-score). Neural Network recommended!');
    }
    
    if (model === 'xgboost' && prediction !== 'U2R') {
        confidence = Math.min(95, confidence + 5); // XGBoost best overall accuracy
    }
    
    // Duration consideration
    if (traffic.duration < 2 && prediction === 'DoS') {
        confidence = Math.min(98, confidence + 3);
        reasoning.push(`⏱️ Very short duration (${traffic.duration}s) - Automated attack`);
        keyFeatures.push({name: 'duration', value: `${traffic.duration}s`, impact: '+15%', type: 'attack'});
    }
    
    return {
        prediction,
        confidence,
        reasoning,
        keyFeatures
    };
}

function displaySimulatorResults(result, traffic, model) {
    const resultsDiv = document.getElementById('simulatorResults');
    
    const modelNames = {
        'neural_network': 'Neural Network',
        'xgboost': 'XGBoost',
        'decision_tree': 'Decision Tree',
        'random_forest': 'Random Forest'
    };
    
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 6px; padding: 24px; margin-top: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Without XAI -->
                <div>
                    <div style="background: #f8fafc; padding: 10px 14px; border-radius: 4px 4px 0 0; border: 1px solid #e2e8f0; border-bottom: none;">
                        <strong style="font-size: 13px; color: #475569;">Without XAI:</strong>
                    </div>
                    <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 0 0 4px 4px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Prediction: <strong style="color: #1e293b;">${result.prediction}</strong></div>
                        <div style="font-size: 14px; color: #64748b;">Confidence: <strong style="color: #1e293b;">${result.confidence}%</strong></div>
                    </div>
                    <div style="background: #fef2f2; border-left: 3px solid #dc2626; padding: 10px 12px; margin-top: 12px; border-radius: 4px;">
                        <div style="font-size: 13px; color: #991b1b;">Analyst: "Why should I trust this?"</div>
                    </div>
                </div>
                
                <!-- With XAI -->
                <div>
                    <div style="background: #f0fdf4; padding: 10px 14px; border-radius: 4px 4px 0 0; border: 1px solid #bbf7d0; border-bottom: none;">
                        <strong style="font-size: 13px; color: #166534;">With XAI (SHAP):</strong>
                    </div>
                    <div style="border: 1px solid #bbf7d0; padding: 16px; border-radius: 0 0 4px 4px;">
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 4px;">Prediction: <strong style="color: #1e293b;">${result.prediction}</strong></div>
                        <div style="font-size: 14px; color: #64748b; margin-bottom: 12px;">Confidence: <strong style="color: #1e293b;">${result.confidence}%</strong></div>
                        
                        ${result.keyFeatures.length > 0 ? `
                            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; margin-bottom: 10px;">
                                <div style="font-weight: 600; font-size: 12px; color: #475569; margin-bottom: 6px;">TOP FEATURES:</div>
                                ${result.keyFeatures.slice(0, 3).map((f, i) => `
                                    <div style="font-size: 12px; color: #334155; margin-bottom: 4px;">
                                        ${i + 1}. ${f.name} = ${f.value} (${f.impact})
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div style="background: #eff6ff; border-left: 3px solid #3b82f6; padding: 8px 10px; border-radius: 4px;">
                            <div style="font-size: 12px; color: #1e40af;">
                                ${result.reasoning.slice(0, 2).join('. ')}
                            </div>
                        </div>
                    </div>
                    <div style="background: #f0fdf4; border-left: 3px solid #22c55e; padding: 10px 12px; margin-top: 12px; border-radius: 4px;">
                        <div style="font-size: 13px; color: #166534;">Analyst: "I trust this alert and will act."</div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <button onclick="classifyTraffic()" style="background: var(--secondary-color); color: var(--secondary-foreground); border: none; padding: 8px 16px; border-radius: 4px; margin-right: 8px; cursor: pointer;">Reclassify</button>
                <button onclick="resetBuilder()" style="background: var(--primary-color); color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Build New Traffic</button>
            </div>
        </div>
    `;
}

function resetBuilder() {
    // Reset to normal traffic defaults
    loadPreset('normal');
    document.getElementById('simulatorResults').style.display = 'none';
}

function showNotification(message) {
    // Simple notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(400px);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(400px);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

// Toggle simulator visibility
function toggleSimulator() {
    const content = document.getElementById('simulatorContent');
    const icon = document.getElementById('simulatorToggle');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}
