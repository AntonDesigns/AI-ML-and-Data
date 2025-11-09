"""
Sidebar component with model performance metrics and categories
"""
import streamlit as st

def render_sidebar(all_models):
    """Render the sidebar with model selector and performance metrics"""
    
    with st.sidebar:
        st.markdown("## 🎛️ Model Selection")
        st.caption("Choose which iteration to use for predictions")
        
        # Model selector
        model_choice = st.selectbox(
            "Select Model Version",
            options=['iteration_0', 'iteration_1', 'iteration_2'],
            format_func=lambda x: {
                'iteration_0': '✅ Iteration 0: k-NN Baseline (53.0% - BEST)',
                'iteration_1': '📊 Iteration 1: Random Forest (50.6%)',
                'iteration_2': '⚠️ Iteration 2: Optimized k-NN (49.2%)'
            }[x],
            index=0,  # Default to Iteration 0 (best)
            help="Iteration 0 is the best! Shows that simple models can outperform complex ones."
        )
        
        # Get selected model info
        metrics = all_models['metrics'][model_choice]
        
        # Show why this model
        if model_choice == 'iteration_0':
            st.success("**✅ Recommended:** Simple and effective baseline model")
        elif model_choice == 'iteration_1':
            st.info("**📊 Alternative Algorithm:** Random Forest with ensemble learning")
        elif model_choice == 'iteration_2':
            st.warning("**⚠️ Overfitted:** Demonstrates that optimization can backfire")
        
        st.markdown("---")
        
        st.markdown("## 📊 Selected Model Performance")
        
        # Test Accuracy
        st.metric("Test Accuracy", f"{metrics['accuracy']*100:.1f}%")
        st.caption(f"{metrics['description']}")
        
        # CV Score (only for Iteration 2)
        if 'cv_score' in metrics:
            st.metric("Cross-Validation Score", f"{metrics['cv_score']*100:.1f}%")
            st.caption("Average across 5 splits. Gap with test = overfitting!")
        
        st.markdown("---")
        
        # Dataset Info
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Algorithm", metrics['algorithm'])
            st.metric("Features", metrics['n_features'])
        with col2:
            if 'n_neighbors' in metrics['params']:
                st.metric("k-value", metrics['params']['n_neighbors'])
            elif 'n_estimators' in metrics['params']:
                st.metric("Trees", metrics['params']['n_estimators'])
            st.metric("Dataset", f"{all_models['metrics']['total_movies']:,}")
        
        st.markdown("---")
        
        st.markdown("## 🎯 Success Categories")
        st.caption("Based on industry-standard profitability thresholds")
        
        st.success("""
        **🌟 Hit** — Revenue > 2.5× Budget  
        *Why 2.5×? Theaters take ~50% of revenue, and marketing costs another ~50% of budget.*
        """)
        
        st.warning("""
        **⚖️ Break-even** — Revenue 2.0-2.5× Budget  
        *Covers production and distribution costs, but minimal profit margin.*
        """)
        
        st.error("""
        **💸 Flop** — Revenue < 2.0× Budget  
        *Financial loss for the studio after marketing and distribution expenses.*
        """)
        
        st.markdown("---")
        
        st.markdown("## 🔧 Technical Parameters")
        
        # Show different params based on algorithm
        if metrics['algorithm'] == 'Random Forest':
            st.info(f"""
            **Trees:** {metrics['params']['n_estimators']}  
            **Class Weight:** {metrics['params']['class_weight']}  
            **Training Data:** {all_models['metrics']['total_movies']:,} movies
            """)
        else:
            st.info(f"""
            **Distance Metric:** {metrics['params'].get('metric', 'euclidean')}  
            **Weights:** {metrics['params'].get('weights', 'uniform')}  
            **Training Data:** {all_models['metrics']['total_movies']:,} movies
            """)
        
        st.markdown("---")
        
        st.markdown("""
        <div style='text-align: center;'>
            <p style='color: #95a5a6; font-size: 0.85rem; margin: 0;'>
                <strong>Anton Horvat</strong><br/>
                Semester 4 ML Project<br/>
                FontysVenlo • 2025
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        return model_choice  