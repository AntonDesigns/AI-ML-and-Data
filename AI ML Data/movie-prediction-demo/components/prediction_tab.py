"""
Prediction tab - main interface for making movie success predictions
"""
import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objects as go

def render_prediction_tab(model, scaler, feature_names):
    """Render the prediction interface"""
    
    st.markdown("## Input Movie Details")
    st.markdown("*Fill in the information below. The model uses these features to predict success.*")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 💰 Budget & Runtime")
        
        budget = st.slider(
            "Production Budget (millions USD)", 
            min_value=1, max_value=300, value=50, step=5,
            help="💡 This is just the production cost, not including marketing. Big-budget movies ($150M+) need huge box office to be profitable."
        )
        st.caption(f"→ You entered: ${budget}M")
        
        runtime = st.slider(
            "Movie Runtime (minutes)", 
            min_value=60, max_value=240, value=120, step=5,
            help="💡 Most successful movies are 90-150 minutes. Very long movies (>180min) can limit daily screenings."
        )
        st.caption(f"→ You entered: {runtime} minutes ({runtime//60}h {runtime%60}m)")
        
        st.markdown("### ⭐ Expected Ratings")
        st.caption("These are your estimates - obviously we don't know actual ratings before release!")
        
        vote_average = st.slider(
            "TMDB Rating Prediction", 
            min_value=1.0, max_value=10.0, value=7.0, step=0.1,
            help="💡 This is audience rating. Most movies fall between 6-8. Below 6 = poorly received, above 8 = very well received."
        )
        
        imdb_rating = st.slider(
            "IMDb Rating Prediction", 
            min_value=1.0, max_value=10.0, value=7.0, step=0.1,
            help="💡 IMDb tends to skew slightly lower than TMDB. Critical acclaim matters!"
        )
    
    with col2:
        st.markdown("### 📅 Release Timing")
        st.caption("When you release matters! Summer = blockbuster season, holidays = family audiences")
        
        release_season = st.radio(
            "Release Season", 
            ["Summer (Jun-Aug)", "Holiday (Nov-Dec)", "Other"],
            help="💡 Summer and holidays have higher success rates due to audience availability"
        )
        
        is_summer = 1 if "Summer" in release_season else 0
        is_holiday = 1 if "Holiday" in release_season else 0
        
        if is_summer:
            st.info("☀️ Summer releases historically have 45% hit rate (vs 30% baseline)")
        elif is_holiday:
            st.info("🎄 Holiday releases have 40% hit rate due to family audiences")
        else:
            st.warning("📆 Off-season releases have lower success rates (~25-30%)")
        
        st.markdown("### 🎬 Additional Info")
        
        # Only show if features exist in the model
        genre_encoded = 0
        has_awards_val = False
        is_us = True
        rt_score = 70
        
        if 'primary_genre_encoded' in feature_names:
            genre = st.selectbox(
                "Primary Genre", 
                ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"],
                help="💡 Animation and Adventure perform best, Drama has lowest success rate"
            )
            genre_encoded = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller"].index(genre)
        
        if 'has_awards' in feature_names:
            has_awards_val = st.checkbox(
                "Award Season Potential", 
                False,
                help="💡 Awards create buzz and extend theatrical runs"
            )
        
        if 'is_us_movie' in feature_names:
            is_us = st.checkbox(
                "US Production", 
                True,
                help="💡 US movies have wider distribution networks"
            )
        
        if 'rotten_tomatoes_score' in feature_names:
            rt_score = st.slider(
                "Rotten Tomatoes Score (Expected)", 
                0, 100, 70, 5,
                help="💡 'Fresh' rating (>60%) helps with marketing"
            )
    
    st.markdown("---")
    
    # Prediction button
    if st.button("🎯 PREDICT SUCCESS", type="primary", use_container_width=True):
        
        # Show what's happening
        with st.spinner("Running prediction algorithm..."):
            
            # Transform budget to log scale
            budget_log = np.log1p(budget * 1_000_000)
            
            # Build feature dictionary
            feature_dict = {
                'budget_log': budget_log,
                'runtime': runtime,
                'vote_average': vote_average,
                'imdb_rating': imdb_rating
            }
            
            # Add optional features
            if 'is_summer_movie' in feature_names:
                feature_dict['is_summer_movie'] = is_summer
            if 'is_holiday_movie' in feature_names:
                feature_dict['is_holiday_movie'] = is_holiday
            if 'has_awards' in feature_names:
                feature_dict['has_awards'] = int(has_awards_val)
            if 'is_us_movie' in feature_names:
                feature_dict['is_us_movie'] = int(is_us)
            if 'rotten_tomatoes_score' in feature_names:
                feature_dict['rotten_tomatoes_score'] = rt_score
            if 'primary_genre_encoded' in feature_names:
                feature_dict['primary_genre_encoded'] = genre_encoded
            if 'budget_category_encoded' in feature_names:
                feature_dict['budget_category_encoded'] = 1 if budget < 50 else 2
            if 'genre_count' in feature_names:
                feature_dict['genre_count'] = 2
            
            # Create feature vector in correct order
            feature_vector = np.array([feature_dict.get(feat, 0) for feat in feature_names]).reshape(1, -1)
            
            # Scale and predict
            feature_vector_scaled = scaler.transform(feature_vector)
            prediction = model.predict(feature_vector_scaled)[0]
            probabilities = model.predict_proba(feature_vector_scaled)[0]
            
            labels = ['Flop', 'Break-even', 'Hit']
            pred_label = labels[prediction]
        
        # Show results
        _display_prediction_results(pred_label, prediction, probabilities, labels, budget)


def _display_prediction_results(pred_label, prediction, probabilities, labels, budget):
    """Display the prediction results in a nice format"""
    
    st.markdown("---")
    st.markdown("## 🎯 Prediction Results")
    
    # Main prediction
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.markdown("### Predicted Category")
        if pred_label == 'Hit':
            st.success(f"# 🌟 {pred_label}")
        elif pred_label == 'Break-even':
            st.warning(f"# ⚖️ {pred_label}")
        else:
            st.error(f"# 💸 {pred_label}")
    
    with col2:
        st.markdown("### Model Confidence")
        confidence = probabilities[prediction] * 100
        st.metric("Confidence Level", f"{confidence:.1f}%")
        
        if confidence > 60:
            st.caption("✅ High confidence")
        elif confidence > 40:
            st.caption("⚠️ Moderate confidence")
        else:
            st.caption("⚠️ Low confidence - close call")
    
    with col3:
        st.markdown("### Investment Risk")
        if pred_label == 'Hit' and confidence > 60:
            st.metric("Risk Level", "LOW", delta="Good investment")
        elif pred_label == 'Flop':
            st.metric("Risk Level", "HIGH", delta="Risky", delta_color="inverse")
        else:
            st.metric("Risk Level", "MEDIUM", delta="Uncertain")
    
    # Probability breakdown chart
    st.markdown("### 📊 Probability Breakdown")
    st.caption("This shows how confident the model is for each category")
    
    prob_df = pd.DataFrame({
        'Category': labels,
        'Probability': probabilities * 100
    })
    
    fig = go.Figure(go.Bar(
        x=prob_df['Probability'],
        y=prob_df['Category'],
        orientation='h',
        marker=dict(color=['#e74c3c', '#f39c12', '#27ae60']),
        text=prob_df['Probability'].apply(lambda x: f'{x:.1f}%'),
        textposition='auto',
    ))
    fig.update_layout(
        xaxis_title="Probability (%)",
        height=250,
        showlegend=False,
        margin=dict(l=0, r=0, t=20, b=0)
    )
    st.plotly_chart(fig, use_container_width=True)
    
    # Financial estimates
    st.markdown("### 💼 Financial Projection")
    st.caption("*These are rough estimates based on the probabilities*")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Budget", f"${budget}M")
    
    with col2:
        # Weighted expected return multiple
        expected_multiple = (probabilities[2] * 3.5 +  # Hit: 3.5x
                           probabilities[1] * 2.2 +   # Break-even: 2.2x
                           probabilities[0] * 0.8)    # Flop: 0.8x
        st.metric("Expected Return", f"{expected_multiple:.2f}×")
    
    with col3:
        expected_revenue = budget * expected_multiple
        profit = expected_revenue - budget
        st.metric("Expected Profit/Loss", f"${profit:.0f}M", 
                 delta=f"${expected_revenue:.0f}M revenue")
    
    # Recommendation
    _display_recommendation(pred_label, confidence, probabilities)


def _display_recommendation(pred_label, confidence, probabilities):
    """Display investment recommendation based on prediction"""
    
    st.markdown("### 💡 My Recommendation")
    
    if pred_label == 'Hit' and confidence > 60:
        st.success("""
        **✅ GREENLIGHT RECOMMENDED**
        
        The model predicts strong profitability with high confidence. Based on the combination of:
        - Budget level
        - Expected ratings
        - Release timing
        - Genre characteristics
        
        This project shows favorable market conditions for success.
        """)
    
    elif pred_label == 'Hit' and confidence > 40:
        st.info("""
        **⚠️ CONDITIONAL APPROVAL**
        
        The model leans toward success but isn't highly confident. Consider:
        - Can we optimize the release date?
        - Is the budget justified by market expectations?
        - How can we improve predicted ratings (better script/cast)?
        
        This could work, but it needs some optimization.
        """)
    
    elif pred_label == 'Break-even':
        st.warning("""
        **⚠️ MARGINAL INVESTMENT**
        
        The model predicts the movie will likely just cover its costs. While not a loss, it won't generate significant profit.
        
        Options to consider:
        - Reduce budget to improve profit margin
        - Delay release to better timing window
        - Enhance commercial appeal elements
        
        From a business perspective, there are probably better investment opportunities.
        """)
    
    else:  # Flop
        st.error("""
        **⛔ HIGH RISK - RECONSIDER**
        
        The model predicts this movie would likely lose money. Key concerns:
        - Budget may be too high for the expected market performance
        - Rating projections suggest limited audience appeal
        - Release timing and genre combination may be unfavorable
        
        Recommendation: Either significantly restructure the project or pass on this investment.
        """)