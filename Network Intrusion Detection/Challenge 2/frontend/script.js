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
                This demonstrates that algorithm complexity doesn't guarantee better performance—data quality and problem fit matter more.
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
                <p><strong>76.69% accuracy</strong> — Best overall performance across all attack types</p>
                <p>Use for general-purpose intrusion detection systems</p>
            </div>
            
            <div class="rec-box rec-secondary">
                <div class="rec-header">
                    <span class="rec-label">Alternative</span>
                    <span class="rec-model">Decision Tree</span>
                </div>
                <p><strong>75.84% accuracy</strong> — 50x faster training, fully explainable</p>
                <p>Use when explainability and audit trails are required</p>
            </div>
            
            <div class="rec-box rec-specialist">
                <div class="rec-header">
                    <span class="rec-label">Specialist Only</span>
                    <span class="rec-model">Neural Network</span>
                </div>
                <p><strong>43.18% U2R F1</strong> — Nearly 2x better than Decision Tree</p>
                <p>Reserve for U2R-specialized systems where privilege escalation detection is critical</p>
            </div>
            
            <div class="bottom-line">
                <p><strong>Bottom Line:</strong> Start with XGBoost for production deployment. Reserve Neural Network for specialized U2R detection. Always address class imbalance before comparing complex models.</p>
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
    
    // Check if SHAP is available
    const hasShap = modelKey === 'neural_network' && pred.shap_explanation && 
                    pred.shap_explanation.some(s => Math.abs(s.shap_value) > 0.001);

    return `
        <div class="modal-section detail-section">
            <!-- Simple Prediction Box -->
            <div class="simple-prediction-box">
                <div class="prediction-header-row">
                    <div>
                        <div class="model-label">${modelNames[modelKey]}</div>
                        <div class="prediction-value-large">${pred.prediction}</div>
                        ${!isCorrect ? `<div class="actual-note">Actually: <strong>${trueLabel}</strong></div>` : ''}
                    </div>
                    <div class="result-badge ${isCorrect ? 'badge-correct' : 'badge-incorrect'}">
                        ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                </div>
                
                <div class="confidence-row">
                    <span class="conf-label">Confidence</span>
                    <span class="conf-value">${pred.confidence.toFixed(1)}%</span>
                    <div class="conf-bar-track">
                        <div class="conf-bar-fill" style="width: ${pred.confidence}%"></div>
                    </div>
                </div>
            </div>

            <!-- SHAP or Model Explanation -->
            ${hasShap ? `
                <div class="shap-section-clean">
                    <h3 class="subsection-title">Feature Analysis</h3>
                    ${renderSHAPClean(pred.shap_explanation, pred.prediction)}
                </div>
            ` : `
                <div class="model-explanation-clean">
                    <h3 class="subsection-title">How ${modelNames[modelKey]} Works</h3>
                    <p>${getModelExplanationSimple(modelKey, pred.confidence, isCorrect)}</p>
                </div>
            `}
        </div>
    `;
}

// Simple model explanations
function getModelExplanationSimple(modelKey, confidence, isCorrect) {
    const explanations = {
        'decision_tree': `Makes predictions using yes/no questions about network features. Confidence of ${confidence.toFixed(0)}% based on learned rules. ${isCorrect ? 'Correctly identified this pattern.' : 'Rules led to incorrect classification.'}`,
        
        'random_forest': `Combines multiple decision trees and votes. ${confidence.toFixed(0)}% confidence shows agreement level. ${isCorrect ? 'Forest correctly identified the pattern.' : 'Majority vote was incorrect.'}`,
        
        'xgboost': `Builds trees sequentially, each correcting previous mistakes. ${confidence.toFixed(0)}% confidence from combined prediction. ${isCorrect ? 'Advanced learning captured this correctly.' : 'Misclassified despite sophistication.'}`
    };
    
    return explanations[modelKey] || 'Analyzes network traffic patterns to make predictions.';
}

// Clean, simple SHAP rendering with comprehensive explanations
function renderSHAPClean(shapFeatures, prediction) {
    if (!shapFeatures || shapFeatures.length === 0) {
        return '<p class="no-shap">No SHAP data available</p>';
    }

    // Filter and sort
    const meaningfulShap = shapFeatures
        .filter(f => Math.abs(f.shap_value) > 0.001)
        .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))
        .slice(0, 8);

    if (meaningfulShap.length === 0) {
        return '<p class="no-shap">No significant features found</p>';
    }

    // Generate AI reasoning summary - WHY it predicted this
    const topFeatures = meaningfulShap.slice(0, 3);
    const topFeature = topFeatures[0];
    const topExplanation = getFeatureExplanation(topFeature.feature);
    
    let aiReasoningText = '';
    let confidenceExplanation = '';
    
    if (prediction === 'DoS') {
        aiReasoningText = `The Neural Network detected this as a <strong>DoS (Denial of Service) attack</strong> because the pattern of features matches what it learned from thousands of real DoS attacks during training. The strongest indicators were:`;
        confidenceExplanation = `The model reached high confidence by identifying <strong>${topExplanation.name.toLowerCase()}</strong> combined with other attack patterns. DoS attacks typically flood networks with requests, causing high error rates and connection counts—exactly what the model found here.`;
    } else if (prediction === 'Probe') {
        aiReasoningText = `The Neural Network detected this as a <strong>Probe/Scanning attack</strong> because the traffic pattern matches reconnaissance behavior it learned during training. The key indicators were:`;
        confidenceExplanation = `The model's confidence comes from recognizing <strong>${topExplanation.name.toLowerCase()}</strong> patterns typical of attackers scanning networks for vulnerabilities. Port scans create many failed connections and unusual port usage—signature patterns the model learned to identify.`;
    } else if (prediction === 'U2R') {
        aiReasoningText = `The Neural Network detected this as a <strong>U2R (User-to-Root) privilege escalation attack</strong> because it found patterns indicating attempts to gain administrator access. Critical indicators were:`;
        confidenceExplanation = `The model achieved high confidence by detecting <strong>${topExplanation.name.toLowerCase()}</strong> and other privilege escalation signatures. U2R attacks involve gaining root/admin access through exploits—the model learned these patterns are the strongest indicators of system compromise.`;
    } else if (prediction === 'R2L') {
        aiReasoningText = `The Neural Network detected this as an <strong>R2L (Remote-to-Local) attack</strong> because the pattern suggests unauthorized remote access attempts. Key indicators were:`;
        confidenceExplanation = `The model's confidence stems from identifying <strong>${topExplanation.name.toLowerCase()}</strong> combined with access attempt patterns. R2L attacks involve gaining unauthorized access from remote locations—typically through password attacks or exploits the model learned to recognize.`;
    } else {
        aiReasoningText = `The Neural Network classified this as <strong>normal/legitimate traffic</strong> because the feature patterns match benign network behavior from its training data. The key indicators were:`;
        confidenceExplanation = `The model is confident this is legitimate traffic because <strong>${topExplanation.name.toLowerCase()}</strong> and other features show normal patterns. The low error rates, proper authentication, and natural service usage are hallmarks of genuine users the model learned during training.`;
    }

    // Build feature list for reasoning
    let featureListHTML = '<ul style="margin: 8px 0 0 20px; padding: 0; list-style: disc;">';
    topFeatures.forEach(feature => {
        const explanation = getFeatureExplanation(feature.feature);
        const value = formatFeatureValue(feature.value);
        const direction = feature.shap_value > 0 ? 'attack' : 'normal';
        featureListHTML += `<li style="margin-bottom: 4px;"><strong>${explanation.name}:</strong> ${value} (pushed toward ${direction})</li>`;
    });
    featureListHTML += '</ul>';

    return `
        <div class="explanation-box collapsible-box">
            <div class="box-header-clickable" onclick="toggleExplanation('why-predicted')">
                <div class="box-title">Why the Neural Network Predicted "${prediction}"</div>
                <div class="expand-icon" id="icon-why-predicted">▼</div>
            </div>
            <div class="box-content collapsible-content" id="content-why-predicted" style="display: none;">
                <p style="margin: 0 0 12px 0;">${aiReasoningText}</p>
                ${featureListHTML}
                <div class="confidence-explanation-box">
                    <strong>How it reached its confidence level:</strong><br>
                    ${confidenceExplanation}
                </div>
            </div>
        </div>

        <div class="explanation-box collapsible-box">
            <div class="box-header-clickable" onclick="toggleExplanation('impact-scores')">
                <div class="box-title">Understanding the Impact Scores</div>
                <div class="expand-icon" id="icon-impact-scores">▼</div>
            </div>
            <div class="box-content collapsible-content" id="content-impact-scores" style="display: none;">
                <div class="legend-grid">
                    <div class="legend-item">
                        <span class="legend-badge legend-badge-attack">Attack +0.045</span>
                        <span class="legend-text"><strong>Red badges with +:</strong> This feature increased the model's belief it's an attack</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-badge legend-badge-normal">Normal -0.019</span>
                        <span class="legend-text"><strong>Blue badges with -:</strong> This feature decreased the model's belief it's an attack</span>
                    </div>
                </div>
                <div class="numbers-explanation">
                    <strong>The signs match:</strong> When a feature pushes toward attack (red), both the Value and Impact show positive (+). When it pushes toward normal (blue), Impact shows negative (-). Larger absolute values (like ±0.045) mean stronger influence.
                </div>
            </div>
        </div>

        <div class="explanation-box collapsible-box">
            <div class="box-header-clickable" onclick="toggleExplanation('table-explanation')">
                <div class="box-title">What the Table Shows</div>
                <div class="expand-icon" id="icon-table-explanation">▼</div>
            </div>
            <div class="box-content collapsible-content" id="content-table-explanation" style="display: none;">
                <p style="margin: 0;">Each row below shows a network traffic feature the Neural Network analyzed. The <strong>Value</strong> column shows what was measured (+ means pushing toward attack). The <strong>Impact</strong> column shows how much that value influenced the prediction.</p>
            </div>
        </div>
        
        <div class="features-table">
            <div class="table-header">
                <div>Feature</div>
                <div>Value</div>
                <div>Impact</div>
            </div>
            ${meaningfulShap.map(feature => {
                const isPositive = feature.shap_value > 0;
                const explanation = getFeatureExplanation(feature.feature);
                const value = formatFeatureValue(feature.value);
                const impact = feature.shap_value > 0 ? 'Attack' : 'Normal';
                const impactClass = isPositive ? 'impact-attack' : 'impact-normal';
                const impactValue = Math.abs(feature.shap_value).toFixed(3);
                
                return `
                    <div class="table-row">
                        <div class="feature-name-col">
                            <div class="feat-name">${explanation.name}</div>
                            <div class="feat-desc">${explanation.explanation}</div>
                        </div>
                        <div class="value-col">${isPositive ? '+' : ''}${value.replace('-', '')}</div>
                        <div class="impact-col">
                            <span class="impact-badge ${impactClass}">
                                ${impact} ${feature.shap_value > 0 ? '+' : ''}${impactValue}
                            </span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
        
        <div class="bottom-note">
            <strong>Note:</strong> The Neural Network doesn't look at features in isolation—it analyzes how they work together as a pattern. Even if one feature value seems normal by itself, the combination can reveal an attack signature the model learned during training.
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

function renderSHAPImproved(shapFeatures, prediction = 'unknown') {
    // Filter out near-zero values
    const meaningfulShap = shapFeatures.filter(f => Math.abs(f.shap_value) > 0.001);
    
    if (meaningfulShap.length === 0) {
        return '<p class="no-data">No significant feature influences detected</p>';
    }

    const maxAbs = Math.max(...meaningfulShap.map(f => Math.abs(f.shap_value)));

    // Generate sample-specific AI reasoning summary
    const aiReasoningSummary = generateAIReasoning(shapExplanation, prediction);
    
    return `
        <div class="shap-intro-box" style="background: linear-gradient(135deg, ${prediction === 'DoS' || prediction === 'Probe' ? '#fee2e2' : prediction === 'U2R' || prediction === 'R2L' ? '#fef3c7' : '#dcfce7'} 0%, ${prediction === 'DoS' || prediction === 'Probe' ? '#fecaca' : prediction === 'U2R' || prediction === 'R2L' ? '#fed7aa' : '#bbf7d0'} 100%); border: 2px solid ${prediction === 'DoS' || prediction === 'Probe' ? '#ef4444' : prediction === 'U2R' || prediction === 'R2L' ? '#f59e0b' : '#22c55e'}; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <div style="display: flex; align-items: start; gap: 16px;">
                <div style="font-size: 32px; flex-shrink: 0;">🔍</div>
                <div style="flex: 1;">
                    <div style="font-size: 16px; font-weight: 700; color: ${prediction === 'DoS' || prediction === 'Probe' ? '#991b1b' : prediction === 'U2R' || prediction === 'R2L' ? '#92400e' : '#166534'}; margin-bottom: 12px;">Why the AI Detected This as ${prediction}</div>
                    <div style="font-size: 14px; color: ${prediction === 'DoS' || prediction === 'Probe' ? '#7f1d1d' : prediction === 'U2R' || prediction === 'R2L' ? '#78350f' : '#14532d'}; line-height: 1.6;">
                        ${aiReasoningSummary}
                    </div>
                </div>
            </div>
        </div>
        <div class="shap-guide-box" style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <div style="font-size: 13px; color: #374151; line-height: 1.5;">
                <strong>📊 How to read the features below:</strong>
                <ul style="margin: 8px 0 0 20px; padding: 0;">
                    <li><strong>Detected Value</strong> = The actual measurement (like -11.0% or 50%)</li>
                    <li><strong>Impact Score</strong> = How much this pushed the AI's decision (+/- number)</li>
                    <li><strong>Red bars (→ Attack Signal)</strong> = Increased confidence it's an attack</li>
                    <li><strong>Blue bars (→ Normal Signal)</strong> = Decreased confidence it's an attack</li>
                </ul>
            </div>
        </div>
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

// Generate sample-specific explanation of why AI made this prediction
function generateAIReasoning(shapExplanation, prediction) {
    if (!shapExplanation || shapExplanation.length === 0) {
        return `<p style="margin: 0;">The AI classified this as <strong>${prediction}</strong> based on pattern recognition from training data.</p>`;
    }
    
    // Get top positive (attack) and negative (normal) features
    const positiveFeatures = shapExplanation
        .filter(f => f.shap_value > 0.001)
        .sort((a, b) => b.shap_value - a.shap_value)
        .slice(0, 3);
    
    const negativeFeatures = shapExplanation
        .filter(f => f.shap_value < -0.001)
        .sort((a, b) => a.shap_value - b.shap_value)
        .slice(0, 2);
    
    let reasoning = '';
    
    // Build the reasoning based on the prediction type
    if (prediction === 'DoS') {
        reasoning = '<p style="margin: 0 0 12px 0;"><strong>The AI detected a Denial of Service (DoS) attack pattern because:</strong></p><ul style="margin: 0 0 12px 20px; padding: 0;">';
        
        if (positiveFeatures.length > 0) {
            positiveFeatures.forEach(feature => {
                const explanation = getFeatureExplanation(feature.feature);
                const value = formatFeatureValue(feature.value);
                
                if (feature.feature.includes('error') || feature.feature.includes('serror')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — High error rates are the signature of DoS floods overwhelming the target</li>`;
                } else if (feature.feature.includes('count')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Massive connection counts indicate flooding behavior</li>`;
                } else if (feature.feature.includes('same_srv') || feature.feature.includes('srv_count')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Repeatedly hammering the same service is typical DoS behavior</li>`;
                } else {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — This pattern matches DoS attacks the AI learned from training</li>`;
                }
            });
        }
        reasoning += '</ul>';
        
        if (negativeFeatures.length > 0) {
            reasoning += '<p style="margin: 0; font-size: 13px; color: #6b7280;">Some features suggested it might be normal traffic, but the DoS indicators above were much stronger.</p>';
        }
        
    } else if (prediction === 'Probe') {
        reasoning = '<p style="margin: 0 0 12px 0;"><strong>The AI detected a Probe/Scanning attack because:</strong></p><ul style="margin: 0 0 12px 20px; padding: 0;">';
        
        if (positiveFeatures.length > 0) {
            positiveFeatures.forEach(feature => {
                const explanation = getFeatureExplanation(feature.feature);
                const value = formatFeatureValue(feature.value);
                
                if (feature.feature.includes('error') || feature.feature.includes('serror')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — High errors from trying many ports/services that don't exist</li>`;
                } else if (feature.feature.includes('same_src_port') || feature.feature.includes('dst_host')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Systematic scanning pattern across multiple targets</li>`;
                } else if (feature.feature.includes('count')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Rapid connection attempts typical of port/service scanning</li>`;
                } else {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Matches reconnaissance attack patterns</li>`;
                }
            });
        }
        reasoning += '</ul>';
        
    } else if (prediction === 'U2R') {
        reasoning = '<p style="margin: 0 0 12px 0;"><strong>The AI detected a User-to-Root (U2R) privilege escalation attack because:</strong></p><ul style="margin: 0 0 12px 20px; padding: 0;">';
        
        if (positiveFeatures.length > 0) {
            positiveFeatures.forEach(feature => {
                const explanation = getFeatureExplanation(feature.feature);
                const value = formatFeatureValue(feature.value);
                
                if (feature.feature.includes('root_shell')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>🚨 ${explanation.name}: ${value}</strong> — ROOT SHELL ACCESS is the strongest possible U2R indicator!</li>`;
                } else if (feature.feature.includes('num_root') || feature.feature.includes('su_attempted')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Attempting to gain administrator privileges</li>`;
                } else if (feature.feature.includes('hot') || feature.feature.includes('num_file_creations')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Accessing sensitive files or creating backdoors</li>`;
                } else if (feature.feature.includes('num_shells')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Gaining shell access to escalate privileges</li>`;
                } else {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Suspicious privilege escalation behavior</li>`;
                }
            });
        }
        reasoning += '</ul>';
        reasoning += '<p style="margin: 0; font-size: 13px; background: #fef3c7; padding: 8px; border-radius: 4px;"><strong>⚠️ U2R attacks are CRITICAL:</strong> The attacker is trying to gain root/admin access to fully compromise the system.</p>';
        
    } else if (prediction === 'R2L') {
        reasoning = '<p style="margin: 0 0 12px 0;"><strong>The AI detected a Remote-to-Local (R2L) attack because:</strong></p><ul style="margin: 0 0 12px 20px; padding: 0;">';
        
        if (positiveFeatures.length > 0) {
            positiveFeatures.forEach(feature => {
                const explanation = getFeatureExplanation(feature.feature);
                const value = formatFeatureValue(feature.value);
                
                if (feature.feature.includes('failed_login') || feature.feature.includes('num_failed')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Multiple failed logins indicate brute-force password attacks</li>`;
                } else if (feature.feature.includes('logged_in')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — ${feature.value > 0 ? 'Successful unauthorized access after attempts' : 'Attempting to gain unauthorized access'}</li>`;
                } else if (feature.feature.includes('hot') || feature.feature.includes('num_compromised')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Signs of system compromise or sensitive file access</li>`;
                } else {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Unauthorized remote access pattern</li>`;
                }
            });
        }
        reasoning += '</ul>';
        
    } else if (prediction === 'normal') {
        reasoning = '<p style="margin: 0 0 12px 0;"><strong>The AI determined this is legitimate traffic because:</strong></p><ul style="margin: 0 0 12px 20px; padding: 0;">';
        
        if (negativeFeatures.length > 0) {
            negativeFeatures.forEach(feature => {
                const explanation = getFeatureExplanation(feature.feature);
                const value = formatFeatureValue(feature.value);
                
                if (feature.feature.includes('error')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Low error rates indicate clean, successful connections</li>`;
                } else if (feature.feature.includes('logged_in')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Proper authentication suggests legitimate user</li>`;
                } else if (feature.feature.includes('same_srv') || feature.feature.includes('diff_srv')) {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Natural service usage patterns, not automated attacks</li>`;
                } else {
                    reasoning += `<li style="margin-bottom: 6px;"><strong>${explanation.name}: ${value}</strong> — Matches normal traffic behavior</li>`;
                }
            });
        }
        reasoning += '</ul>';
        
        if (positiveFeatures.length > 0) {
            reasoning += '<p style="margin: 0; font-size: 13px; color: #6b7280;">A few features looked slightly suspicious, but overall the traffic pattern is clearly legitimate.</p>';
        }
    }
    
    // Add pattern explanation
    reasoning += `<div style="margin-top: 12px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 6px; font-size: 13px;">
        <strong>💡 Key Point:</strong> The AI doesn't just look at individual values—it analyzes <strong>the entire pattern</strong> of features together. 
        Even if one value seems "normal" by itself, the combination reveals the ${prediction === 'normal' ? 'legitimate' : 'attack'} signature.
    </div>`;
    
    return reasoning;
}

function formatFeatureValue(value) {
    if (value >= -1 && value <= 1) {
        // Normalized value (0-1 or -1 to 1)
        return (value * 100).toFixed(1) + '%';
    } else {
        return value.toFixed(2);
    }
}

// Analyze what the feature value means and WHY it impacts the AI's decision
function analyzeFeatureValue(featureName, value, pushesAttack) {
    // Convert normalized value to percentage for easier understanding
    const normalizedPercent = (value * 100).toFixed(0);
    
    const analyses = {
        'duration': value => {
            if (pushesAttack && Math.abs(value) > 0.5) {
                return `The AI learned that connection times like this (${normalizedPercent}%) are <strong>unusual for normal traffic</strong>. ${value > 0 ? 'Very long connections can indicate DoS attacks trying to hold resources.' : 'Very short connections combined with other features suggest scanning behavior.'}`;
            } else if (pushesAttack) {
                return `While the duration (${normalizedPercent}%) seems normal by itself, <strong>the AI found it increases attack probability</strong> when combined with this specific pattern of other features.`;
            } else {
                return `The duration (${normalizedPercent}%) <strong>fits the pattern of legitimate traffic</strong> the AI has seen during training.`;
            }
        },
        
        'src_bytes': value => {
            if (pushesAttack && Math.abs(value) > 0.3) {
                return `The AI identified that data volume like this (${normalizedPercent}%) <strong>matches attack patterns</strong> it learned from training. ${value > 0 ? 'High volumes often indicate DoS floods.' : 'Low volumes with other suspicious features suggest scanning.'}`;
            } else if (pushesAttack) {
                return `Even though ${normalizedPercent}% seems moderate, <strong>this specific data pattern increased the AI's suspicion</strong> based on how it correlates with attacks in training data.`;
            } else {
                return `Data volume (${normalizedPercent}%) <strong>matches legitimate traffic patterns</strong> the AI learned, making an attack less likely.`;
            }
        },
        
        'dst_bytes': value => {
            if (pushesAttack) {
                return `The AI learned that receiving ${normalizedPercent}% of data in this scenario <strong>is unusual for normal behavior</strong>. ${Math.abs(value) > 0.5 ? 'This could indicate data exfiltration or attack responses.' : 'Combined with other features, this pattern looks suspicious.'}`;
            } else {
                return `Received data (${normalizedPercent}%) <strong>fits normal traffic distribution</strong> patterns, reducing attack probability.`;
            }
        },
        
        'count': value => {
            if (pushesAttack && value > 0.5) {
                return `The AI flagged this connection count (${normalizedPercent}%) as <strong>significantly higher than normal traffic</strong>. Attackers create many connections for scanning or flooding.`;
            } else if (pushesAttack) {
                return `The connection count (${normalizedPercent}%) <strong>increases attack probability</strong> when seen with this combination of other features.`;
            } else if (value < -0.3) {
                return `Low connection count (${normalizedPercent}%) <strong>matches normal single-request behavior</strong> patterns.`;
            } else {
                return `Connection count (${normalizedPercent}%) <strong>aligns with legitimate usage</strong> the AI has seen.`;
            }
        },
        
        'srv_count': value => {
            if (pushesAttack && value > 0.5) {
                return `The AI noticed ${normalizedPercent}% same-service connections is <strong>unusually high and attack-like</strong>. Attackers focus on specific targets.`;
            } else {
                return `Service connection rate (${normalizedPercent}%) ${pushesAttack ? 'contributed to attack suspicion in this pattern' : 'is consistent with normal behavior'}.`;
            }
        },
        
        'same_srv_rate': value => {
            if (pushesAttack && value > 0.7) {
                return `<strong>${normalizedPercent}% of connections targeting one service</strong> is extreme focus that the AI associates with automated attacks or scanning.`;
            } else if (!pushesAttack && value < 0.3) {
                return `Diverse service usage (only ${normalizedPercent}% to same service) <strong>is typical of human browsing</strong> behavior.`;
            } else {
                return `Same service rate (${normalizedPercent}%) ${pushesAttack ? 'seems high for normal use in this context' : 'is reasonable for legitimate activity'}.`;
            }
        },
        
        'diff_srv_rate': value => {
            if (pushesAttack && value < -0.5) {
                return `Very low service diversity (${normalizedPercent}%) <strong>suggests automated tools</strong> rather than human behavior.`;
            } else if (!pushesAttack && value > 0.5) {
                return `Good service variety (${normalizedPercent}%) <strong>matches natural human browsing</strong> patterns.`;
            } else {
                return `Service diversity (${normalizedPercent}%) ${pushesAttack ? 'is suspiciously low' : 'is acceptable'}.`;
            }
        },
        
        'serror_rate': value => {
            if (pushesAttack && value > 0.5) {
                return `<strong>${normalizedPercent}% error rate is extremely high!</strong> The AI strongly associates this with port scanning attacks where most connection attempts fail.`;
            } else if (!pushesAttack && value < -0.5) {
                return `Very low error rate (${normalizedPercent}%) <strong>indicates clean, legitimate connections</strong> that the AI recognizes as normal.`;
            } else {
                return `Error rate (${normalizedPercent}%) ${pushesAttack ? 'is elevated above what the AI expects for normal traffic' : 'is within typical ranges'}.`;
            }
        },
        
        'dst_host_serror_rate': value => {
            if (pushesAttack && value > 0.6) {
                return `<strong>${normalizedPercent}% error rate at the destination host</strong> is what the AI flagged. This pattern strongly indicates the host is being scanned or attacked.`;
            } else {
                return `Destination error rate (${normalizedPercent}%) ${pushesAttack ? 'contributes to attack suspicion' : 'indicates stable connections'}.`;
            }
        },
        
        'logged_in': value => {
            if (value > 0) {
                return `Successful authentication (logged_in=1) ${pushesAttack ? 'is interesting because attackers can authenticate before escalating privileges' : 'is a normal indicator of legitimate access'}.`;
            } else {
                return `No successful login ${pushesAttack ? 'combined with other patterns suggests unauthorized access attempts' : 'might be normal for certain service types'}.`;
            }
        },
        
        'num_failed_logins': value => {
            if (pushesAttack && value > 0.3) {
                return `Multiple failed login attempts (${normalizedPercent}%) is a <strong>classic brute-force attack signature</strong> that the AI learned to recognize.`;
            } else {
                return `Failed login count (${normalizedPercent}%) ${pushesAttack ? 'adds to suspicion' : 'is not concerning'}.`;
            }
        },
        
        'root_shell': value => {
            if (value > 0) {
                return `<strong>ROOT SHELL ACCESS DETECTED!</strong> The AI flags any root shell access as the strongest U2R (privilege escalation) indicator—this is the ultimate goal of these attacks.`;
            } else {
                return `No root shell access detected in this connection.`;
            }
        },
        
        'num_root': value => {
            if (pushesAttack && value > 0.5) {
                return `Multiple root operations (${normalizedPercent}%) is what the AI associates with <strong>privilege escalation or system compromise</strong>.`;
            } else {
                return `Root operations (${normalizedPercent}%) ${pushesAttack ? 'contributed to the overall attack pattern' : 'is minimal'}.`;
            }
        },
        
        'num_file_creations': value => {
            if (pushesAttack && value > 0.4) {
                return `High file creation activity (${normalizedPercent}%) is a pattern the AI links to <strong>malware installation or attackers establishing persistence</strong>.`;
            } else {
                return `File creation (${normalizedPercent}%) ${pushesAttack ? 'is part of the suspicious pattern' : 'is normal activity'}.`;
            }
        },
        
        'hot': value => {
            if (pushesAttack && value > 0.3) {
                return `Accessing sensitive files (${normalizedPercent}%) is what the AI flags. Attackers typically access security-critical files (like /etc/passwd) to <strong>escalate privileges</strong>.`;
            } else {
                return `Sensitive file access (${normalizedPercent}%) ${pushesAttack ? 'adds to the attack pattern' : 'is minimal'}.`;
            }
        },
        
        'num_shells': value => {
            if (pushesAttack && value > 0.2) {
                return `Shell access obtained (${normalizedPercent}%) is a <strong>major attack success indicator</strong> that the AI learned to recognize.`;
            } else {
                return `Shell access indicators at ${normalizedPercent}%.`;
            }
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

// ============================================================================
// COLLAPSIBLE EXPLANATION BOXES
// ============================================================================

function toggleExplanation(boxId) {
    const content = document.getElementById(`content-${boxId}`);
    const icon = document.getElementById(`icon-${boxId}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}
