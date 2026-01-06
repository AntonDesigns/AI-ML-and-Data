// ============================================================================
// CLEAN PROFESSIONAL JS - Network IDS
// ============================================================================

let data = null;
let currentFilter = 'all';

// ============================================================================
// FEATURE EXPLANATIONS FOR NON-TECHNICAL USERS
// ============================================================================

const FEATURE_EXPLANATIONS = {
    'duration': { name: 'Connection Duration', explanation: 'How long the network connection lasted', example: 'Attacks often have very short or very long connection times' },
    'src_bytes': { name: 'Data Sent', explanation: 'Amount of data sent from source', example: 'Large amounts may indicate data exfiltration' },
    'dst_bytes': { name: 'Data Received', explanation: 'Amount of data received', example: 'Unusual patterns can indicate suspicious activity' },
    'count': { name: 'Connection Count', explanation: 'Number of connections in time window', example: 'Many rapid connections often indicate scanning' },
    'srv_count': { name: 'Service Connections', explanation: 'Connections to same service', example: 'High count may show automated attacks' },
    'same_srv_rate': { name: 'Same Service Rate', explanation: 'Percentage to same service', example: 'Attackers often target one service' },
    'diff_srv_rate': { name: 'Different Service Rate', explanation: 'Percentage to different services', example: 'Low variety can indicate focused attack' },
    'serror_rate': { name: 'SYN Error Rate', explanation: 'Connection errors percentage', example: 'High rate often indicates port scanning' },
    'dst_host_serror_rate': { name: 'Host Error Rate', explanation: 'Errors for this destination', example: 'Shows if host is being scanned' },
    'protocol_type_encoded': { name: 'Protocol Type', explanation: 'Network protocol (TCP/UDP/ICMP)', example: 'Certain protocols common in attacks' },
    'service_encoded': { name: 'Network Service', explanation: 'Service accessed (HTTP, FTP, etc.)', example: 'Attackers target vulnerable services' },
    'flag_encoded': { name: 'Connection Status', explanation: 'Connection completion status', example: 'Shows normal or error completion' },
    'hot': { name: 'Hot Indicators', explanation: 'Sensitive file access count', example: 'Access to important system files' },
    'num_failed_logins': { name: 'Failed Logins', explanation: 'Unsuccessful login attempts', example: 'Multiple failures suggest brute force' },
    'logged_in': { name: 'Login Success', explanation: 'Whether login succeeded', example: 'Success after failures is suspicious' },
    'num_compromised': { name: 'Compromised Signs', explanation: 'Indicators of breach', example: 'Signs system may be compromised' },
    'root_shell': { name: 'Root Access', explanation: 'Administrator shell obtained', example: 'Strongest sign of privilege escalation' },
    'su_attempted': { name: 'Admin Attempt', explanation: 'Tried to become admin', example: 'Attempting to gain higher privileges' },
    'num_root': { name: 'Root Operations', explanation: 'Administrator-level actions', example: 'Multiple root accesses are suspicious' },
    'num_file_creations': { name: 'Files Created', explanation: 'New files made', example: 'May indicate malware installation' },
    'num_shells': { name: 'Shell Access', explanation: 'Command line access gained', example: 'Key indicator of successful breach' },
    'num_access_files': { name: 'Permission Files', explanation: 'Access control file touches', example: 'Attackers modify for more access' },
    'dst_host_count': { name: 'Host Connections', explanation: 'Connections to destination', example: 'Too many may indicate attack' },
    'dst_host_same_srv_rate': { name: 'Host Service Focus', explanation: 'Rate to same service on host', example: 'Consistent targeting pattern' },
    'dst_host_diff_srv_rate': { name: 'Host Service Variety', explanation: 'Rate to different services', example: 'Service scanning behavior' },
    'dst_host_same_src_port_rate': { name: 'Port Consistency', explanation: 'Same source port usage', example: 'Unusual port patterns' },
    'land': { name: 'Land Attack', explanation: 'Source equals destination', example: 'Classic denial-of-service' },
    'wrong_fragment': { name: 'Bad Packets', explanation: 'Malformed packet fragments', example: 'Often used in attacks' },
    'urgent': { name: 'Urgent Flags', explanation: 'Urgent packet count', example: 'Abnormal flags may indicate attack' }
};

function getFeatureExplanation(featureName) {
    return FEATURE_EXPLANATIONS[featureName] || {
        name: featureName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        explanation: 'Network traffic characteristic',
        example: 'Used by the AI to detect patterns'
    };
}

// ============================================================================
// MODEL INSIGHTS & ANALYSIS
// ============================================================================

function renderInsights(tab) {
    const content = document.getElementById('insightContent');
    
    const insights = {
        'overview': `
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Accuracy</th>
                            <th>U2R F1-Score</th>
                            <th>Training Time</th>
                            <th>Best For</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="highlight-row">
                            <td><strong>XGBoost</strong></td>
                            <td>76.69%</td>
                            <td>10.96%</td>
                            <td>-</td>
                            <td>General purpose deployment</td>
                        </tr>
                        <tr>
                            <td><strong>Decision Tree</strong></td>
                            <td>75.84%</td>
                            <td>24.39%</td>
                            <td>0.41s</td>
                            <td>Explainability & speed</td>
                        </tr>
                        <tr>
                            <td><strong>Random Forest</strong></td>
                            <td>74.66%</td>
                            <td>0.0%</td>
                            <td>-</td>
                            <td>Ensemble robustness</td>
                        </tr>
                        <tr>
                            <td><strong>Neural Network</strong></td>
                            <td>74.94%</td>
                            <td>43.18%</td>
                            <td>20.47s</td>
                            <td>Rare attack detection (U2R)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="key-insight">
                <strong>Key Finding:</strong> Neural Network achieved lower overall accuracy but significantly better U2R detection (43.18% vs 24.39%). 
                This demonstrates that algorithm complexity doesn't guarantee better performance data quality and problem fit matter more.
            </div>
        `,
        
        'neural-network': `
            <h3>Why Neural Network Didn't Outperform Simpler Models</h3>
            
            <div class="reason-box">
                <div class="reason-title">1. Severe Class Imbalance</div>
                <p>Only 52 U2R training samples (0.04% of dataset). Neural networks need substantial data to learn patterns effectively.</p>
            </div>
            
            <div class="reason-box">
                <div class="reason-title">2. Tabular Data Nature</div>
                <p>Decision trees naturally excel at structured features with clear thresholds. Neural networks shine with unstructured data (images, text).</p>
            </div>
            
            <div class="reason-box">
                <div class="reason-title">3. Training Cost vs Benefit</div>
                <p>50x slower training (20.47s vs 0.41s) for -0.9% accuracy. Not worth the computational cost for general deployment.</p>
            </div>
            
            <div class="reason-box">
                <div class="reason-title">4. Lost Explainability</div>
                <p>Decision trees provide extractable rules. Neural networks are black boxes requiring SHAP analysis.</p>
            </div>
            
            <h3 style="margin-top: 2rem;">When to Use Neural Network</h3>
            <ul class="simple-list">
                <li><strong>U2R-specific systems:</strong> If privilege escalation detection is critical (43.18% F1 vs 24.39%)</li>
                <li><strong>Complex patterns:</strong> When attacks have subtle, non-linear signatures</li>
                <li><strong>Balanced datasets:</strong> With sufficient rare attack samples for proper training</li>
            </ul>
            
            <h3 style="margin-top: 2rem;">How to Improve Neural Network</h3>
            <ol class="simple-list">
                <li>Address class imbalance first (SMOTE, class weighting)</li>
                <li>Hyperparameter tuning (layer sizes, learning rate, epochs)</li>
                <li>Ensemble approach (combine NN for U2R with XGBoost for general detection)</li>
                <li>Collect more real-world rare attack samples</li>
            </ol>
        `,
        
        'recommendations': `
            <h3>Production Deployment Recommendation</h3>
            
            <div class="rec-box rec-primary">
                <div class="rec-header">
                    <span class="rec-label">Recommended</span>
                    <span class="rec-model">XGBoost</span>
                </div>
                <p><strong>76.69% accuracy</strong> Best overall performance across all attack types</p>
                <p>Use for general-purpose intrusion detection systems</p>
            </div>
            
            <div class="rec-box rec-secondary">
                <div class="rec-header">
                    <span class="rec-label">Alternative</span>
                    <span class="rec-model">Decision Tree</span>
                </div>
                <p><strong>75.84% accuracy</strong> 50x faster training, fully explainable</p>
                <p>Use when explainability and audit trails are required</p>
            </div>
            
            <div class="rec-box rec-specialist">
                <div class="rec-header">
                    <span class="rec-label">Specialist Only</span>
                    <span class="rec-model">Neural Network</span>
                </div>
                <p><strong>43.18% U2R F1</strong> Nearly 2x better than Decision Tree</p>
                <p>Reserve for U2R-specialized systems where privilege escalation detection is critical</p>
            </div>
        `
    };
    
    content.innerHTML = insights[tab] || insights['overview'];
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    if (data) {
        renderPerformanceCards();
        renderInsights('overview'); // Add insights section
        renderSamples();
        renderFeatureImportance('neural_network_shap');
        setupEventListeners();
    }
});

async function loadData() {
    try {
        const response = await fetch('frontend_data.json');
        data = await response.json();
        console.log('✅ Data loaded:', data);
    } catch (error) {
        console.error('❌ Error loading data:', error);
        alert('Error loading data. Make sure frontend_data.json is available.');
    }
}

// ============================================================================
// PERFORMANCE CARDS
// ============================================================================

function renderPerformanceCards() {
    const grid = document.getElementById('performanceGrid');
    
    const models = [
        { key: 'decision_tree', name: 'Decision Tree' },
        { key: 'random_forest', name: 'Random Forest' },
        { key: 'neural_network', name: 'Neural Network' },
        { key: 'xgboost', name: 'XGBoost' }
    ];

    grid.innerHTML = models.map(model => {
        const perf = data.performance[model.key];
        return `
            <div class="stat-card">
                <h3>${model.name}</h3>
                <div class="stat-value">${(perf.accuracy * 100).toFixed(1)}%</div>
                <div class="stat-label">Overall Accuracy</div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// SAMPLE CARDS
// ============================================================================

function renderSamples() {
    const grid = document.getElementById('samplesGrid');
    
    // Filter samples
    const filteredSamples = currentFilter === 'all' 
        ? data.samples 
        : data.samples.filter(s => s.true_label === currentFilter);
    
    if (filteredSamples.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--gray-600);">No samples found</p>';
        return;
    }

    grid.innerHTML = filteredSamples.map((sample, idx) => {
        // Count correct predictions
        const models = ['decision_tree', 'random_forest', 'neural_network', 'xgboost'];
        const correctCount = models.filter(m => 
            sample.models[m].prediction === sample.true_label
        ).length;

        // Get Neural Network prediction for highlight
        const nnPred = sample.models.neural_network;
        const nnCorrect = nnPred.prediction === sample.true_label;

        return `
            <div class="sample-card" data-sample-id="${sample.sample_id}">
                <div class="sample-header">
                    <span class="sample-id">Sample #${sample.sample_id}</span>
                    <span class="attack-badge ${sample.true_label}">${sample.true_label}</span>
                </div>
                <div class="sample-body">
                    <div class="accuracy-display">
                        <div class="accuracy-label">Model Accuracy</div>
                        <div class="accuracy-value">${correctCount}/4 models correct</div>
                    </div>
                    <div class="nn-highlight">
                        <div class="nn-label">Neural Network detected as:</div>
                        <div class="nn-prediction ${nnCorrect ? 'nn-correct' : 'nn-incorrect'}">
                            ${nnPred.prediction}
                            <span class="nn-confidence">${nnPred.confidence.toFixed(0)}%</span>
                        </div>
                    </div>
                    <button class="details-btn">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 4V12M4 8H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        View All Model Predictions
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function formatModelName(key) {
    const names = {
        'decision_tree': 'DT',
        'random_forest': 'RF',
        'neural_network': 'NN',
        'xgboost': 'XGB'
    };
    return names[key] || key;
}

// ============================================================================
// MODAL
// ============================================================================

function showSampleDetail(sampleId) {
    const sample = data.samples.find(s => s.sample_id === sampleId);
    if (!sample) return;

    const modal = document.getElementById('sampleModal');
    const modalBody = document.getElementById('modalBody');

    const models = ['decision_tree', 'random_forest', 'neural_network', 'xgboost'];
    const modelNames = {
        'decision_tree': 'Decision Tree',
        'random_forest': 'Random Forest',
        'neural_network': 'Neural Network',
        'xgboost': 'XGBoost'
    };

    // Count correct predictions
    const correctCount = models.filter(m => sample.models[m].prediction === sample.true_label).length;

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-title-section">
                <h2 class="modal-title">Sample #${sample.sample_id}</h2>
                <div class="modal-meta">
                    <span class="meta-label">Actual Traffic Type:</span>
                    <span class="attack-badge ${sample.true_label}">${sample.true_label}</span>
                    <span class="meta-divider">•</span>
                    <span class="meta-label">${correctCount} of 4 models correct</span>
                </div>
            </div>
        </div>

        <div class="modal-section">
            <h3 class="section-title">Select a Model to See Detailed Analysis</h3>
            <div class="model-tabs-detailed" id="modelTabsDetailed">
                ${models.map(m => {
                    const pred = sample.models[m];
                    const isCorrect = pred.prediction === sample.true_label;
                    return `
                        <button class="model-tab-btn ${m === 'neural_network' ? 'active' : ''}" data-model="${m}">
                            <div class="tab-model-name">${modelNames[m]}</div>
                            <div class="tab-model-result ${isCorrect ? 'tab-correct' : 'tab-incorrect'}">
                                ${isCorrect ? '✓' : '✗'} ${pred.prediction}
                            </div>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>

        <div id="modelDetailView">
            ${renderModelDetail(sample, 'neural_network', sample.true_label)}
        </div>
    `;

    // Add event listeners for model tabs
    modalBody.querySelectorAll('.model-tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active state
            modalBody.querySelectorAll('.model-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Render detail for selected model
            const modelKey = btn.dataset.model;
            const detailView = modalBody.querySelector('#modelDetailView');
            detailView.innerHTML = renderModelDetail(sample, modelKey, sample.true_label);
        });
    });

    modal.classList.add('active');
}

function renderModelDetail(sample, modelKey, trueLabel) {
    const modelNames = {
        'decision_tree': 'Decision Tree',
        'random_forest': 'Random Forest',
        'neural_network': 'Neural Network',
        'xgboost': 'XGBoost'
    };
    
    const pred = sample.models[modelKey];
    const isCorrect = pred.prediction === trueLabel;
    
    // Check if this is a high-confidence error (the paradox case)
    const isHighConfidenceError = !isCorrect && pred.confidence >= 90;
    
    // Get confidence explanation
    const confidenceExplanation = explainConfidence(pred.confidence, isCorrect);
    
    // Check if SHAP is available
    const hasShap = modelKey === 'neural_network' && pred.shap_explanation && 
                    pred.shap_explanation.some(s => Math.abs(s.shap_value) > 0.001);

    return `
        <div class="modal-section detail-section">
            ${isHighConfidenceError ? `
                <div class="confidence-paradox-banner">
                    <div class="paradox-icon">⚠️</div>
                    <div class="paradox-content">
                        <div class="paradox-title">High Confidence, Wrong Prediction - Why?</div>
                        <div class="paradox-text">
                            This is an important case study! The AI was ${pred.confidence.toFixed(0)}% sure, but wrong. 
                            This demonstrates why cybersecurity systems <strong>never rely on a single model</strong> and 
                            always include human analysis. See below for what fooled the AI.
                        </div>
                    </div>
                </div>
            ` : ''}
            
            <div class="prediction-result-card ${isCorrect ? 'result-correct' : 'result-incorrect'}">
                <div class="result-header">
                    <div>
                        <div class="result-label">${modelNames[modelKey]} Prediction</div>
                        <div class="result-value">${pred.prediction}</div>
                        ${!isCorrect ? `
                            <div class="actual-label-display">
                                Actually was: <span class="actual-value">${trueLabel}</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="result-status ${isCorrect ? 'status-correct' : 'status-incorrect'}">
                        ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                </div>
                
                <div class="confidence-detail">
                    <div class="confidence-header-large">
                        <span class="confidence-label-large">Confidence Level</span>
                        <span class="confidence-value-large">${pred.confidence.toFixed(1)}%</span>
                    </div>
                    <div class="confidence-bar-extra-large">
                        <div class="confidence-fill-extra-large ${!isCorrect ? 'confidence-error' : ''}" style="width: ${pred.confidence}%"></div>
                    </div>
                    <div class="confidence-explanation">
                        <strong>What this means:</strong> ${confidenceExplanation}
                    </div>
                </div>
            </div>

            ${hasShap ? `
                <div class="shap-section-detailed">
                    <h3 class="section-title">${isHighConfidenceError ? 'What Fooled the AI?' : `Why ${pred.confidence.toFixed(0)}% Confidence?`}</h3>
                    <p class="section-description">
                        ${isHighConfidenceError 
                            ? `Despite being wrong, the AI was ${pred.confidence.toFixed(0)}% confident because these features <strong>looked like ${pred.prediction} traffic</strong> patterns the AI learned during training. This shows how attackers can disguise ${trueLabel} attacks to appear as ${pred.prediction} traffic.`
                            : `The AI analyzed these network traffic characteristics to reach ${pred.confidence.toFixed(0)}% confidence that this is <strong>${pred.prediction}</strong> traffic. Each feature either increased (red) or decreased (blue) the AI's certainty.`
                        }
                    </p>
                    ${renderSHAPImproved(pred.shap_explanation)}
                </div>
            ` : `
                <div class="model-explanation-box">
                    <h3 class="section-title">How ${modelNames[modelKey]} Works</h3>
                    <p class="explanation-text">${getModelExplanation(modelKey, pred.confidence, isCorrect)}</p>
                    ${modelKey !== 'neural_network' ? `
                        <div class="feature-note">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8.8 12H7.2V7.2H8.8V12ZM8.8 5.6H7.2V4H8.8V5.6Z" fill="currentColor"/>
                            </svg>
                            <span>Detailed feature-level explanations are only available for the Neural Network model using SHAP analysis.</span>
                        </div>
                    ` : ''}
                </div>
            `}
        </div>
    `;
}

function explainConfidence(confidence, isCorrect) {
    if (confidence >= 95) {
        if (!isCorrect) {
            return `The model is extremely confident (${confidence.toFixed(0)}%) in this prediction, but it was <strong>wrong</strong>. This happens when:
            <ul style="margin: 0.5rem 0 0 1.25rem; line-height: 1.8;">
                <li><strong>Sophisticated attacks mimic normal traffic</strong> - Advanced attackers deliberately make their malicious traffic look legitimate</li>
                <li><strong>The training data had similar patterns</strong> - The AI learned from examples that looked like this, so it's confident, but this case is different</li>
                <li><strong>Edge cases exist</strong> - This traffic has a rare combination of features the AI hasn't seen enough times to recognize as exceptional</li>
                <li><strong>Feature overlap</strong> - Some attacks and normal traffic share similar characteristics, fooling the model</li>
            </ul>
            <div style="margin-top: 0.75rem; padding: 0.75rem; background: #fef2f2; border-left: 3px solid #dc2626; border-radius: 4px;">
                <strong>⚠️ Key Lesson:</strong> High confidence ≠ Always correct. This is why security systems use multiple models and human oversight!
            </div>`;
        } else {
            return `The model is extremely confident (${confidence.toFixed(0)}%) and <strong>correct</strong>. This high confidence comes from:
            <ul style="margin: 0.5rem 0 0 1.25rem; line-height: 1.8;">
                <li><strong>Clear, unambiguous patterns</strong> - The traffic features match known attack signatures very closely</li>
                <li><strong>Multiple strong indicators</strong> - Several features all point in the same direction</li>
                <li><strong>Well-represented in training</strong> - The AI has seen many similar examples during training</li>
            </ul>`;
        }
    } else if (confidence >= 80) {
        return `The model is quite confident (${confidence.toFixed(0)}%) in this prediction. ${isCorrect ? 'This strong confidence was correct.' : 'However, this confident prediction turned out to be wrong - the model was misled by deceptive patterns.'}`;
    } else if (confidence >= 60) {
        return `The model has moderate confidence (${confidence.toFixed(0)}%). ${isCorrect ? 'Even with moderate certainty, it made the right call.' : 'This uncertainty led to an incorrect prediction - the features were ambiguous.'}`;
    } else {
        return `The model has low confidence (${confidence.toFixed(0)}%), meaning it was very uncertain. ${isCorrect ? 'Despite the uncertainty, it happened to be correct.' : 'This low confidence reflects the difficulty in classifying this sample - it has characteristics of both attack and normal traffic.'}`;
    }
}

function getModelExplanation(modelKey, confidence, isCorrect) {
    const explanations = {
        'decision_tree': `Decision Trees work by asking a series of yes/no questions about the network traffic features. Each question splits the data until reaching a final classification. The ${confidence.toFixed(0)}% confidence comes from the proportion of training samples that had the same label in the final leaf node. ${isCorrect ? 'The tree\'s learned rules correctly identified this traffic pattern.' : 'The tree\'s rules led to an incorrect classification, suggesting this sample has unusual characteristics.'}`,
        
        'random_forest': `Random Forest combines predictions from multiple decision trees (a "forest" of trees). Each tree votes on the classification, and the ${confidence.toFixed(0)}% confidence represents how many trees agreed on this prediction. ${isCorrect ? 'The majority of trees in the forest correctly identified this pattern.' : 'The forest\'s consensus was wrong, indicating that even multiple perspectives can be misled by this traffic pattern.'}`,
        
        'xgboost': `XGBoost is an advanced ensemble method that builds trees sequentially, where each new tree corrects the mistakes of previous ones. The ${confidence.toFixed(0)}% confidence reflects the combined strength of all trees' predictions. ${isCorrect ? 'XGBoost\'s iterative learning process successfully captured this traffic pattern.' : 'Despite its sophisticated learning process, XGBoost misclassified this sample.'}`
    };
    
    return explanations[modelKey] || 'This model analyzes network traffic patterns to make predictions.';
}

function renderSHAPImproved(shapFeatures) {
    // Filter out near-zero values
    const meaningfulShap = shapFeatures.filter(f => Math.abs(f.shap_value) > 0.001);
    
    if (meaningfulShap.length === 0) {
        return '<p class="no-data">No significant feature influences detected</p>';
    }

    const maxAbs = Math.max(...meaningfulShap.map(f => Math.abs(f.shap_value)));

    return `
        <div class="shap-explainer">
            <div class="shap-legend">
                <div class="legend-item">
                    <div class="legend-color legend-attack"></div>
                    <div class="legend-text">
                        <strong>Positive values (red)</strong> = This feature made the AI think it's an attack
                    </div>
                </div>
                <div class="legend-item">
                    <div class="legend-color legend-normal"></div>
                    <div class="legend-text">
                        <strong>Negative values (blue)</strong> = This feature made the AI think it's normal traffic
                    </div>
                </div>
                <div class="legend-note">
                    💡 <strong>Bigger bars = Stronger influence</strong> on the AI's decision
                </div>
            </div>
        </div>
        <div class="shap-container">
            ${meaningfulShap.map(feature => {
                const isPositive = feature.shap_value > 0;
                const percentage = (Math.abs(feature.shap_value) / maxAbs) * 100;
                const explanation = getFeatureExplanation(feature.feature);
                
                // Create a more intuitive strength label
                let strengthLabel = '';
                if (percentage > 80) strengthLabel = 'Very Strong';
                else if (percentage > 50) strengthLabel = 'Strong';
                else if (percentage > 25) strengthLabel = 'Moderate';
                else strengthLabel = 'Weak';
                
                // Get the value analysis - WHY this value indicates attack/normal
                const valueAnalysis = analyzeFeatureValue(feature.feature, feature.value, isPositive);
                
                return `
                    <div class="shap-feature-card">
                        <div class="shap-feature-header">
                            <div class="shap-feature-info">
                                <div class="shap-feature-name">${explanation.name}</div>
                                <div class="shap-feature-desc">${explanation.explanation}</div>
                            </div>
                            <div class="shap-impact-badge">
                                <div class="impact-strength">${strengthLabel} Influence</div>
                                <div class="shap-impact ${isPositive ? 'impact-attack' : 'impact-normal'}">
                                    ${isPositive ? '→ Attack Signal' : '→ Normal Signal'}
                                </div>
                            </div>
                        </div>
                        
                        <div class="feature-value-analysis">
                            <div class="value-display">
                                <span class="value-label">Detected Value:</span>
                                <span class="value-number">${formatFeatureValue(feature.value)}</span>
                            </div>
                            <div class="value-interpretation">
                                ${valueAnalysis}
                            </div>
                        </div>
                        
                        <div class="shap-bar-wrapper">
                            <div class="shap-bar-track">
                                <div class="shap-bar-center"></div>
                                <div class="shap-bar-fill ${isPositive ? 'fill-attack' : 'fill-normal'}" 
                                     style="width: ${percentage/2}%; ${isPositive ? 'left' : 'right'}: 50%"></div>
                            </div>
                            <div class="shap-value-display">
                                <div class="shap-number">${feature.shap_value > 0 ? '+' : ''}${feature.shap_value.toFixed(4)}</div>
                                <div class="shap-number-label">Impact Score</div>
                            </div>
                        </div>
                        <div class="shap-feature-example">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 0C3.13 0 0 3.13 0 7C0 10.87 3.13 14 7 14C10.87 14 14 10.87 14 7C14 3.13 10.87 0 7 0ZM7.7 10.5H6.3V6.3H7.7V10.5ZM7.7 4.9H6.3V3.5H7.7V4.9Z" fill="currentColor"/>
                            </svg>
                            <strong>Why this matters:</strong> ${explanation.example}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Format feature value for display
function formatFeatureValue(value) {
    if (value >= -1 && value <= 1) {
        // Normalized value (0-1 or -1 to 1)
        return (value * 100).toFixed(1) + '%';
    } else {
        return value.toFixed(2);
    }
}

// Analyze what the feature value means and WHY it indicates attack/normal
function analyzeFeatureValue(featureName, value, pushesAttack) {
    // Convert normalized value to percentage for easier understanding
    const normalizedPercent = (value * 100).toFixed(0);
    
    const analyses = {
        'duration': value => {
            if (value > 0.5) return `⚠️ This connection lasted <strong>much longer than typical</strong> (${normalizedPercent}% of maximum). Attacks like DoS often keep connections open for extended periods to exhaust server resources.`;
            else if (value < -0.5) return `✓ This connection was <strong>extremely brief</strong> (${normalizedPercent}%). While very short connections can indicate port scanning, this specific timing pattern suggests normal quick requests.`;
            else return `This connection duration is in the normal range (${normalizedPercent}%).`;
        },
        
        'src_bytes': value => {
            if (pushesAttack && value > 0.3) return `⚠️ <strong>Large amount of data sent</strong> from source (${normalizedPercent}%). This volume is ${value > 0.7 ? 'extremely high and' : ''} typical of DoS attacks that flood the network with data packets.`;
            else if (!pushesAttack && value < -0.3) return `✓ <strong>Minimal data sent</strong> (${normalizedPercent}%). This low volume is consistent with normal legitimate requests that don't send much data.`;
            else if (pushesAttack) return `⚠️ The data volume pattern (${normalizedPercent}%) combined with other factors suggests malicious intent rather than normal usage.`;
            else return `✓ This data volume (${normalizedPercent}%) fits normal traffic patterns when considered with other characteristics.`;
        },
        
        'dst_bytes': value => {
            if (pushesAttack && value > 0.3) return `⚠️ <strong>Large amount of data received</strong> (${normalizedPercent}%). Unusual for typical attacks but may indicate data exfiltration or response to attack probes.`;
            else if (!pushesAttack && Math.abs(value) < 0.2) return `✓ <strong>Balanced data flow</strong> (${normalizedPercent}%). Normal traffic typically has similar amounts of data in both directions.`;
            else return `The data received (${normalizedPercent}%) ${pushesAttack ? 'shows anomalous patterns' : 'aligns with normal traffic behavior'}.`;
        },
        
        'count': value => {
            if (value > 0.5) return `⚠️ <strong>Very high connection count</strong> (${normalizedPercent}%). Normal users make few connections, but attackers often create ${value > 0.8 ? 'hundreds or thousands' : 'many rapid'} connections (like in port scanning or DoS).`;
            else if (value < -0.3) return `✓ <strong>Few connections</strong> (${normalizedPercent}%). This low activity level is characteristic of normal single-purpose requests.`;
            else return `Connection count (${normalizedPercent}%) is in a range that requires other factors to determine if it's malicious.`;
        },
        
        'srv_count': value => {
            if (value > 0.5) return `⚠️ <strong>High same-service connection rate</strong> (${normalizedPercent}%). Attackers often repeatedly target the same service, while normal users vary their activity.`;
            else return `Service connection rate (${normalizedPercent}%) ${pushesAttack ? 'combined with other factors suggests attack' : 'is within normal bounds'}.`;
        },
        
        'same_srv_rate': value => {
            if (value > 0.7) return `⚠️ <strong>${normalizedPercent}% of connections</strong> went to the same service. This extreme focus on one service is typical of targeted attacks or automated scanning.`;
            else if (value < 0.3) return `✓ <strong>Diverse service usage</strong> (only ${normalizedPercent}% to same service). Normal users naturally vary between different services.`;
            else return `Same service rate of ${normalizedPercent}% ${pushesAttack ? 'appears suspicious in this context' : 'is acceptable for normal usage'}.`;
        },
        
        'diff_srv_rate': value => {
            if (value < -0.5) return `⚠️ <strong>Very low service diversity</strong> (${normalizedPercent}%). The lack of variety suggests automated attack tools focused on specific targets.`;
            else if (value > 0.5) return `✓ <strong>Good service variety</strong> (${normalizedPercent}%). Normal human behavior involves accessing different services naturally.`;
            else return `Service diversity (${normalizedPercent}%) ${pushesAttack ? 'is lower than expected for legitimate use' : 'is reasonable'}.`;
        },
        
        'serror_rate': value => {
            if (value > 0.5) return `⚠️ <strong>${normalizedPercent}% error rate</strong> - extremely high! This many SYN errors strongly indicates port scanning, where attackers probe for open ports.`;
            else if (value < -0.5) return `✓ <strong>Very low error rate</strong> (${normalizedPercent}%). Clean connections with few errors indicate legitimate established communication.`;
            else return `Error rate of ${normalizedPercent}% ${pushesAttack ? 'is elevated above normal' : 'is within acceptable range'}.`;
        },
        
        'dst_host_serror_rate': value => {
            if (value > 0.6) return `⚠️ <strong>Host experiencing ${normalizedPercent}% errors</strong>. When a host has this many connection errors, it's usually being scanned or probed by attackers.`;
            else return `Host error rate (${normalizedPercent}%) ${pushesAttack ? 'suggests the host is under attack' : 'indicates stable connections'}.`;
        },
        
        'logged_in': value => {
            if (value > 0) return `✓ <strong>User successfully logged in</strong>. Successful authentication is a positive sign of legitimate access.`;
            else return `⚠️ <strong>No successful login</strong>. Connection without authentication can indicate automated attacks or unauthorized access attempts.`;
        },
        
        'num_failed_logins': value => {
            if (value > 0.3) return `⚠️ <strong>Multiple failed login attempts</strong> detected (${normalizedPercent}%). This is a classic sign of brute-force password attacks.`;
            else return `${pushesAttack ? '⚠️' : '✓'} Failed login indicator at ${normalizedPercent}%.`;
        },
        
        'root_shell': value => {
            if (value > 0) return `⚠️ <strong>ROOT SHELL ACCESS DETECTED!</strong> Getting root shell access is the ultimate goal of privilege escalation attacks (U2R). This is the strongest indicator of a successful system compromise.`;
            else return `No root shell access detected.`;
        },
        
        'num_root': value => {
            if (value > 0.5) return `⚠️ <strong>Multiple root-level operations</strong> (${normalizedPercent}%). This many administrator-level actions strongly suggests privilege escalation or system compromise.`;
            else return `Root operations at ${normalizedPercent}% ${pushesAttack ? 'is suspicious' : 'is minimal'}.`;
        },
        
        'num_file_creations': value => {
            if (value > 0.4) return `⚠️ <strong>Unusual file creation activity</strong> (${normalizedPercent}%). High file creation rates can indicate malware installation or attackers establishing persistence.`;
            else return `File creation (${normalizedPercent}%) ${pushesAttack ? 'combined with other factors is concerning' : 'is normal'}.`;
        },
        
        'hot': value => {
            if (value > 0.3) return `⚠️ <strong>Accessing sensitive system files</strong> (hot indicator: ${normalizedPercent}%). Attackers typically access security-critical files to escalate privileges or steal data.`;
            else return `Sensitive file access (${normalizedPercent}%) ${pushesAttack ? 'is noted' : 'is minimal'}.`;
        },
        
        'num_shells': value => {
            if (value > 0.2) return `⚠️ <strong>Shell access obtained</strong> (${normalizedPercent}%). Getting command-line access is a major step in successful attacks.`;
            else return `Shell access indicators at ${normalizedPercent}%.`;
        },
        
        'wrong_fragment': value => {
            if (value > 0.2) return `⚠️ <strong>Malformed packet fragments detected</strong> (${normalizedPercent}%). Attackers deliberately create bad packets to exploit vulnerabilities or evade detection.`;
            else return `Packet integrity (${normalizedPercent}%) ${pushesAttack ? 'shows some anomalies' : 'is good'}.`;
        },
        
        'urgent': value => {
            if (value > 0.3) return `⚠️ <strong>Abnormal urgent flags</strong> (${normalizedPercent}%). Excessive urgent packets are rarely used legitimately and often indicate attacks.`;
            else return `Urgent flag usage (${normalizedPercent}%) ${pushesAttack ? 'is slightly elevated' : 'is normal'}.`;
        },
        
        'land': value => {
            if (value > 0) return `⚠️ <strong>LAND ATTACK DETECTED!</strong> Source and destination IPs are identical. This is a classic denial-of-service technique.`;
            else return `No LAND attack pattern detected.`;
        }
    };
    
    // Get specific analysis or generic one
    const analyzerFunc = analyses[featureName];
    if (analyzerFunc) {
        return analyzerFunc(value);
    }
    
    // Generic analysis for features without specific logic
    if (pushesAttack) {
        return `⚠️ This feature's value (${normalizedPercent}%) is ${value > 0 ? 'higher' : 'lower'} than typical for normal traffic, pushing the AI toward detecting an attack.`;
    } else {
        return `✓ This feature's value (${normalizedPercent}%) is ${value > 0 ? 'higher' : 'lower'} than attack patterns, pushing the AI toward classifying this as normal traffic.`;
    }
}

// Keep old function for backwards compatibility
function renderSHAP(shapFeatures) {
    return renderSHAPImproved(shapFeatures);
}

// ============================================================================
// FEATURE IMPORTANCE
// ============================================================================

function renderFeatureImportance(modelKey) {
    const chart = document.getElementById('importanceChart');
    const importance = data.feature_importance[modelKey];

    if (!importance) {
        chart.innerHTML = '<p>No data available</p>';
        return;
    }

    const maxValue = Math.max(...importance.importance);

    chart.innerHTML = importance.features.map((feature, idx) => {
        const value = importance.importance[idx];
        const percentage = (value / maxValue) * 100;

        return `
            <div class="importance-row">
                <div class="importance-label">${feature}</div>
                <div class="importance-bar-container">
                    <div class="importance-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="importance-value">${value.toFixed(4)}</div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function setupEventListeners() {
    // Insight tabs
    const insightTabs = document.querySelectorAll('.insight-tab');
    if (insightTabs.length > 0) {
        insightTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const insightType = btn.dataset.insight;
                document.querySelectorAll('.insight-tab').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderInsights(insightType);
            });
        });
    }

    // Attack type filter
    document.getElementById('attackTypeFilter').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');

            // Update filter and re-render
            currentFilter = e.target.dataset.type;
            renderSamples();
        }
    });

    // Sample card click
    document.getElementById('samplesGrid').addEventListener('click', (e) => {
        const card = e.target.closest('.sample-card');
        if (card) {
            const sampleId = parseInt(card.dataset.sampleId);
            showSampleDetail(sampleId);
        }
    });

    // Modal close
    const modal = document.getElementById('sampleModal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Feature importance model selector
    document.getElementById('importanceModelSelect').addEventListener('change', (e) => {
        renderFeatureImportance(e.target.value);
    });
}
