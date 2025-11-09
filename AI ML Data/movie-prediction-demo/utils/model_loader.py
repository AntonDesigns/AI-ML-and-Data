"""
Model loading utilities - supports multiple model versions
"""
import streamlit as st
import pickle
import json
import os

@st.cache_resource
def load_all_models():
    """Load all three model iterations for comparison"""
    try:
        models = {}
        
        # Load Iteration 0
        with open('models/iteration_0_model.pkl', 'rb') as f:
            models['iteration_0_model'] = pickle.load(f)
        with open('models/iteration_0_scaler.pkl', 'rb') as f:
            models['iteration_0_scaler'] = pickle.load(f)
        with open('models/iteration_0_features.pkl', 'rb') as f:
            models['iteration_0_features'] = pickle.load(f)
        
        # Load Iteration 1
        with open('models/iteration_1_model.pkl', 'rb') as f:
            models['iteration_1_model'] = pickle.load(f)
        with open('models/iteration_1_scaler.pkl', 'rb') as f:
            models['iteration_1_scaler'] = pickle.load(f)
        with open('models/iteration_1_features.pkl', 'rb') as f:
            models['iteration_1_features'] = pickle.load(f)
        
        # Load Iteration 2
        with open('models/iteration_2_model.pkl', 'rb') as f:
            models['iteration_2_model'] = pickle.load(f)
        with open('models/iteration_2_scaler.pkl', 'rb') as f:
            models['iteration_2_scaler'] = pickle.load(f)
        with open('models/iteration_2_features.pkl', 'rb') as f:
            models['iteration_2_features'] = pickle.load(f)
        
        # Load comparison metrics
        with open('data/model_comparison.json', 'r') as f:
            models['metrics'] = json.load(f)
        
        return models
    
    except FileNotFoundError as e:
        st.error(f"⚠️ Missing model files: {str(e)}")
        st.info("💡 Run the notebook export script to generate all model files!")
        return None
    except Exception as e:
        st.error(f"⚠️ Error loading models: {str(e)}")
        return None