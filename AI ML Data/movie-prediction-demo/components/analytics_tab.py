"""
Analytics tab - showing model development process and performance
"""
import streamlit as st
import pandas as pd
import plotly.graph_objects as go

def render_analytics_tab(metrics):
    """Render the analytics and model development tab"""
    
    st.markdown("## 📊 How I Built This Model")
    st.markdown("*This explains my development process across three iterations*")
    
    # Iteration progression
    st.markdown("### 🔄 Model Evolution")
    
    iterations_df = pd.DataFrame({
        'Iteration': ['Iteration 0\nBaseline k-NN', 'Iteration 1\nRandom Forest', 'Iteration 2\nOptimized k-NN'],
        'Accuracy': [
            metrics['iteration_0']['accuracy']*100,  
            metrics['iteration_1']['accuracy']*100,  
            metrics['iteration_2']['accuracy']*100 
        ],
        'What I Did': [
            '4 features, k=20',
            'Random Forest, same features',
            f'Added {metrics["iteration_2"]["n_features"]-4} features + tuning'
        ]
    })
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(
        x=iterations_df['Iteration'],
        y=iterations_df['Accuracy'],
        mode='lines+markers+text',
        line=dict(color='#3498db', width=3),
        marker=dict(size=15, color='#2980b9'),
        text=iterations_df['Accuracy'].apply(lambda x: f'{x:.1f}%'),
        textposition='top center',
        textfont=dict(size=14, color='#2c3e50')
    ))
    fig.update_layout(
        yaxis_title="Test Accuracy (%)",
        yaxis=dict(range=[0, 70]),
        height=400,
        showlegend=False
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Detailed breakdown
    st.markdown("### 📝 What I Learned From Each Iteration")
    
    with st.expander("**Iteration 0: Baseline Model (k-NN, k=20)**", expanded=True):
        st.markdown("""
        **Goal:** Establish a baseline to beat
        
        **What I did:**
        - Started with k-Nearest Neighbors algorithm
        - Used only 4 features: budget, runtime, TMDB rating, IMDb rating
        - Tested different k values (5, 10, 15, 20, 25, 30)
        - Found k=20 worked best
        
        **Results:**
        - 53.0% accuracy on test set
        - Better than random guessing (33.3%)
        - Model was decent at predicting Hits, but struggled with Break-even movies
        
        **Why k-NN?**  
        It's interpretable - it finds 20 "similar movies" and predicts based on their success. Easy to explain to stakeholders.
        """)
    
    with st.expander("**Iteration 1: Algorithm Comparison (Random Forest)**"):
        st.markdown("""
        **Goal:** Test if a different algorithm performs better
        
        **What I did:**
        - Tested 4 different algorithms: k-NN, Random Forest, Logistic Regression, SVM
        - Used 5-fold cross-validation for reliable comparison
        - Kept the same 4 features to isolate algorithm performance
        - Selected Random Forest as the alternative to showcase
        
        **Results:**
        - Random Forest: 50.6% test accuracy
        - k-NN remained best at 53.0%
        - Random Forest more stable (lower variance) but slightly less accurate
        - Logistic Regression: 49.7% (too simple for non-linear patterns)
        - SVM: 50.6% (slow, no advantage)
        
        **Why Random Forest?**  
        Ensemble learning with 100 decision trees, handles non-linear patterns well, provides feature importance. However, for this dataset, the simple k-NN still won.
        
        **Conclusion:**  
        Random Forest is a solid alternative but doesn't beat the baseline. Shows that algorithm choice matters, but isn't everything.
        """)
    
    with st.expander("**Iteration 2: Optimization (Current Model)**"):
        st.markdown(f"""
        **Goal:** Improve performance through feature engineering and hyperparameter tuning
        
        **What I did:**
        - Expanded from 4 to {metrics['iteration_2']['n_features']} features (added genre, timing, awards, etc.)
        - Used GridSearchCV to test 72 parameter combinations
        - Found optimal settings: {metrics['iteration_2']['params']}
        
        **Results:**
        - Test accuracy: {metrics['iteration_2']['accuracy']*100:.1f}%
        - CV score: {metrics['iteration_2']['cv_score']*100:.1f}%
        
        **What happened:**  
        The model actually performed WORSE on the test set despite better CV scores. This suggests **overfitting** - the model learned the training data too well and doesn't generalize to new movies.
        
        **Learning:**  
        Sometimes "optimization" can backfire. The gap between CV score (52.7%) and test score (49.2%) indicates the model is too complex for this dataset size.
        """)
    
    # Performance metrics
    st.markdown("### 🎯 Performance Summary")
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        improvement = (metrics['iteration_2']['accuracy'] - metrics['iteration_0']['accuracy']) / metrics['iteration_0']['accuracy'] * 100
        st.metric(
            "Total Change", 
            f"{improvement:+.1f}%", 
            f"from {metrics['iteration_0']['accuracy']*100:.1f}%",
            delta_color="off"
        )
        st.caption("Unfortunately went down, not up!")
    
    with col2:
        vs_random = (metrics['iteration_0']['accuracy'] - 0.333) / 0.333 * 100
        st.metric(
            "vs Random Guess", 
            f"+{vs_random:.0f}%"
        )
        st.caption("Best model vs random (33.3%)")
    
    with col3:
        st.metric(
            "Training Data", 
            f"{metrics['total_movies']:,}"
        )
        st.caption("Movies from 1990-2024")
    
    with col4:
        st.metric(
            "Max Features", 
            f"{metrics['iteration_2']['n_features']}"
        )
        st.caption("Used in Iteration 2")
    
    # Feature importance explanation
    st.markdown("### 🎯 Which Features Matter Most?")
    st.caption("*This is a general ranking based on correlation analysis from data provisioning*")
    
    feature_imp = pd.DataFrame({
        'Feature': ['Budget (Log Scale)', 'IMDb Rating', 'TMDB Rating', 'Runtime', 'Summer Release', 
                   'Genre', 'Awards Potential', 'Holiday Release'],
        'Why It Matters': [
            'Higher budgets = bigger marketing, but diminishing returns after $150M',
            'Critical acclaim drives word-of-mouth and repeat viewings',
            'Audience rating indicates broad appeal and viral potential',
            'Sweet spot is 90-150min. Too short looks cheap, too long limits screenings',
            'Peak season = higher attendance, less competition for family dollars',
            'Animation/Adventure outperform Drama (60% vs 30% hit rate)',
            'Awards extend theatrical run and boost prestige/streaming value',
            'Family audiences available, awards season buzz'
        ],
        'Importance': [0.28, 0.22, 0.18, 0.15, 0.10, 0.08, 0.06, 0.05]
    })
    
    for _, row in feature_imp.iterrows():
        with st.expander(f"**{row['Feature']}** ({row['Importance']:.0%} importance)"):
            st.markdown(f"💡 {row['Why It Matters']}")