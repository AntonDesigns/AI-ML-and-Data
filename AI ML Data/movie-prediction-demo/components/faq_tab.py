"""
FAQ tab - answering common questions about the model
"""
import streamlit as st

def render_faq_tab():
    """Render the FAQ and limitations tab"""
    
    st.markdown("## ❓ Frequently Asked Questions")
    
    with st.expander("**Why is the accuracy only 49%? Isn't that bad?**"):
        st.markdown("""
        Great question! Here's the context:
        
        **Compared to random guessing (33.3%):** The model is 48% better than random, which shows it learned meaningful patterns.
        
        **Movie prediction is inherently difficult:** Success depends on many factors I can't measure - marketing effectiveness, competing releases, cultural timing, audience mood, critical buzz, star power, etc.
        
        **Class imbalance:** My dataset has 50% Hits, 28% Flops, 22% Break-even. The model is better at predicting Hits (59% F1-score) but struggles with Break-even movies (26% F1-score) because they're ambiguous.
        
        **Real-world comparison:** Even Hollywood studios with huge research teams can't reliably predict box office success. They greenlight many movies knowing some will flop.
        
        **What this model is useful for:** Identifying obviously risky projects (budget too high for expected appeal) and obviously strong projects (great timing + ratings + genre). The middle ground remains uncertain.
        """)
    
    with st.expander("**What are the model's main limitations?**"):
        st.markdown("""
        I want to be transparent about what this model can and cannot do:
        
        **❌ Cannot predict:**
        - Exact revenue numbers (only categories)
        - Impact of marketing campaigns
        - Cultural moments or viral trends
        - Star power beyond historical data
        - Competition from other releases
        - Black swan events (pandemics, strikes, etc.)
        
        **⚠️ Requires assumptions:**
        - You must estimate ratings before release (obviously impossible to know)
        - Genre is simplified to primary genre only
        - Doesn't account for franchise value or IP recognition
        
        **📊 Data limitations:**
        - Trained on 1990-2024 data (may not reflect current trends)
        - Class imbalance toward Hits (affects predictions)
        - Missing data for many indie/international films
        
        **🎯 Best use case:**  
        Early-stage investment screening to flag obviously risky or promising projects. Should be combined with human judgment, not used alone.
        """)
    
    with st.expander("**Why did Iteration 2 perform worse than Iteration 0?**"):
        st.markdown("""
        This was the biggest surprise of my project! Here's what happened:
        
        **Performance across iterations:**
        - Iteration 0 (k-NN, k=20): 53.0% ✅ BEST
        - Iteration 1 (Random Forest): 50.6%
        - Iteration 2 (Optimized k-NN, k=25): 49.2% ⚠️ WORST
        
        **What I expected:** More features + hyperparameter tuning = better accuracy
        
        **What actually happened:** 
        - Random Forest (different algorithm) performed slightly worse than baseline
        - "Optimized" k-NN with 12 features performed worst of all!
        
        **Why this happened (Overfitting):**
        - GridSearchCV found parameters that worked well on training data (CV: 52.7%)
        - But these parameters were too specific to the training set
        - The model memorized training patterns that don't generalize to new movies
        - Gap between CV score (52.7%) and test score (49.2%) = 3.5 points = RED FLAG
        
        **The lesson:** 
        1. More complexity isn't always better
        2. Different algorithms don't guarantee improvement
        3. Simple models (Iteration 0) can outperform complex ones
        4. Overfitting is real and can hurt generalization
        
        **What I would do differently:**
        - Use Iteration 0 for actual deployment (53.0% accuracy)
        - Collect more training data before adding complexity
        - Try regularization to prevent overfitting
        - Use ensemble methods (combine multiple models)
        """)
    
    with st.expander("**Which features are most important?**"):
        st.markdown("""
        Based on my data provisioning analysis:
        
        **Top 3 predictors:**
        1. **Budget (log scale)** - Strong correlation with revenue, but non-linear relationship
        2. **IMDb Rating** - Critical reception drives word-of-mouth
        3. **TMDB Rating** - Audience appeal and viral potential
        
        **Timing factors:**
        - **Summer release:** 45% hit rate vs 30% baseline
        - **Holiday release:** 40% hit rate due to family audiences
        
        **Genre effects:**
        - **Animation/Adventure:** 60%+ hit rates (broad appeal)
        - **Horror:** High success rate (low budgets = low risk)
        - **Drama:** Lowest success rate (oversaturated, hard to stand out)
        
        **What surprised me:**
        - Runtime matters less than I expected (only 15% importance)
        - Genre matters more for budget decisions than direct success prediction
        - Awards potential is a weak predictor (awards come after release!)
        """)
    
    with st.expander("**How did you define 'success'?**"):
        st.markdown("""
        I used industry-standard thresholds based on how movie economics actually work:
        
        **🌟 Hit: Revenue > 2.5× budget**
        - Why 2.5×? Theaters take ~50% of box office
        - Marketing typically costs 50-100% of production budget
        - So a $100M movie needs $250M+ to be profitable
        
        **⚖️ Break-even: Revenue 2-2.5× budget**
        - Covers production + marketing + distribution
        - Minimal profit, but doesn't lose money
        
        **💸 Flop: Revenue < 2× budget**
        - Studio loses money
        - Even at 2×, you're probably losing money after marketing
        
        **Why not use profit directly?**
        - Marketing budgets aren't public
        - Profit is calculated differently by each studio
        - Revenue vs budget is objective and publicly available
        
        **Alternative thresholds I considered:**
        - 2× budget (too lenient - includes many money-losers)
        - 3× budget (too strict - labels profitable movies as failures)
        - Industry consensus: 2.5× is the "true breakeven"
        """)
    
    with st.expander("**Can I use this for real investment decisions?**"):
        st.markdown("""
        **Short answer:** No, not by itself.
        
        **Long answer:** This is an academic project demonstrating machine learning concepts. Real movie investment requires:
        
        ✅ **Use this model for:**
        - Early-stage screening (red flags for obviously bad ideas)
        - Educational understanding of prediction modeling
        - Identifying which factors historically correlate with success
        
        ❌ **Don't use this model for:**
        - Actual financial investment decisions
        - Predicting specific movies without domain expertise
        - Replacing comprehensive market research
        
        **What professional studios have:**
        - Proprietary data on marketing effectiveness
        - Access to test screenings and focus groups
        - Competitive release schedule analysis
        - Historical data on similar IP/franchises
        - Social media sentiment analysis
        - Decades of industry relationships and intuition
        
        **My model is useful as:** One input among many for early-stage feasibility assessment. But it should always be combined with human judgment and industry expertise.
        """)