"""
Movie Success Predictor - Main Application
Demonstrates iterative model development with comparison
"""

import streamlit as st

# Import utilities
from utils.styles import get_custom_css
from utils.model_loader import load_all_models

# Import components
from components.sidebar import render_sidebar
from components.prediction_tab import render_prediction_tab
from components.analytics_tab import render_analytics_tab
from components.faq_tab import render_faq_tab

# Page configuration
st.set_page_config(
    page_title="Movie Success Predictor - Model Comparison",
    page_icon="🎬",
    layout="wide"
)

# Apply custom CSS
st.markdown(get_custom_css(), unsafe_allow_html=True)

# Load ALL models
all_models = load_all_models()

# Stop if models didn't load
if all_models is None:
    st.stop()

# Header
st.markdown('<p class="big-title">🎬 Movie Success Predictor</p>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Comparing 3 iterations: k-NN baseline vs Random Forest vs Optimized k-NN</p>', unsafe_allow_html=True)
# Render sidebar and get selected model
selected_iteration = render_sidebar(all_models)

# Get the selected model components
model = all_models[f'{selected_iteration}_model']
scaler = all_models[f'{selected_iteration}_scaler']
feature_names = all_models[f'{selected_iteration}_features']
metrics = all_models['metrics']

# Main content tabs
tab1, tab2, tab3 = st.tabs(["🎯 Try the Predictor", "📊 How I Built This", "❓ FAQ & Limitations"])

with tab1:
    # Show which model is being used
    st.info(f"**Currently using:** {metrics[selected_iteration]['name']} ({metrics[selected_iteration]['accuracy']*100:.1f}% accuracy)")
    render_prediction_tab(model, scaler, feature_names)

with tab2:
    render_analytics_tab(metrics)

with tab3:
    render_faq_tab()

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #95a5a6; padding: 1.5rem; font-size: 0.9rem;'>
    <p><strong>Movie Success Predictor</strong> • Anton Horvat • Semester 4 AI/ML Project • 2025</p>
    <p>Built with Python, scikit-learn, Plotly, and Streamlit</p>
    <p style='margin-top: 1rem; font-size: 0.85rem;'>
        📧 Questions? Feedback? Contact me through FontysVenlo email
    </p>
</div>
""", unsafe_allow_html=True)