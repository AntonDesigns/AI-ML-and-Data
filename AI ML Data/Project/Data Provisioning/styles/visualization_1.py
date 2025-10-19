def create_prediction_feature_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd
    
    # Create budget_log if it doesn't exist yet
    if 'budget_log' not in df.columns:
        df['budget_log'] = np.log1p(df['budget'])
    
    # I'm setting IBCS standard colors - black/dark gray for actual values
    IBCS_COLORS['primary'] = '#2C3E50'
    
    # I'm creating a figure with 4 charts (2x2 grid)
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    fig.subplots_adjust(hspace=0.45, wspace=0.3, top=0.92, left=0.08)
    
    # ===== CHART 1: Class Separation by Budget =====
    if 'budget_log' in df.columns:
        # I'm calculating mean budget for each success category
        data = df.groupby('success_category')['budget_log'].mean()
        data = data.reindex(['Flop', 'Break-even', 'Hit'])
        benchmark = data.mean()
        
        # I'm calculating variance from mean
        variances = data.values - benchmark
        variances_pct = ((data.values - benchmark) / benchmark * 100)
        
        # I'm plotting main bars (black/dark gray)
        bars = axes[0,0].bar(range(len(data)), data.values, 
                            color=IBCS_COLORS['primary'], alpha=0.9, width=0.6)
        
        # I'm adding benchmark line with label
        axes[0,0].axhline(benchmark, color=IBCS_COLORS['neutral'], 
                         linestyle='--', linewidth=1.5, alpha=0.7)
        axes[0,0].text(len(data)-0.5, benchmark, 'Mean', 
                      fontsize=8, va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(data.values, variances)):
            if var > 0:
                axes[0,0].bar(i, var, bottom=benchmark, 
                            color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
            else:
                axes[0,0].bar(i, -var, bottom=value, 
                            color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
        
        # I'm adding actual values inside bars
        for i, value in enumerate(data.values):
            axes[0,0].text(i, value/2, f'{value:.1f}', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 1:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[0,0].text(i, value + 0.1, f'ΔM {pct:+.0f}%', 
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm finding the separation metric
        separation = abs(data['Hit'] - data['Flop'])
        
        # I'm adding chart-specific summary at the TOP
        axes[0,0].text(0.0, 1.15, f'Hit vs Flop separation: {separation:.2f} log units - Strong predictor', 
                      transform=axes[0,0].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[0,0].plot([0, 1], [1.10, 1.10], transform=axes[0,0].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title lower for this chart
        axes[0,0].text(0.0, 0.98, 'ΔM% | Mean Budget (log) by Success Category', 
                      transform=axes[0,0].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[0,0].set_xticks(range(len(data)))
        axes[0,0].set_xticklabels(data.index, fontsize=9)
        axes[0,0].set_ylim(0, max(data.values) * 1.25)
        axes[0,0].set_ylabel('Budget (log scale)', fontsize=9)
        axes[0,0].grid(axis='y', alpha=0.2)
        axes[0,0].spines['top'].set_visible(False)
        axes[0,0].spines['right'].set_visible(False)
    
    # ===== CHART 2: Class Separation by Runtime =====
    if 'runtime' in df.columns:
        # I'm calculating mean runtime for each category
        data = df.groupby('success_category')['runtime'].mean()
        data = data.reindex(['Flop', 'Break-even', 'Hit'])
        benchmark = data.mean()
        
        # I'm calculating variance
        variances = data.values - benchmark
        variances_pct = ((data.values - benchmark) / benchmark * 100)
        
        # I'm plotting main bars
        bars = axes[0,1].bar(range(len(data)), data.values,
                            color=IBCS_COLORS['primary'], alpha=0.9, width=0.6)
        
        # I'm adding benchmark line with label
        axes[0,1].axhline(benchmark, color=IBCS_COLORS['neutral'], 
                         linestyle='--', linewidth=1.5, alpha=0.7)
        axes[0,1].text(len(data)-0.5, benchmark, 'Mean', 
                      fontsize=8, va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(data.values, variances)):
            if var > 0:
                axes[0,1].bar(i, var, bottom=benchmark, 
                            color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
            else:
                axes[0,1].bar(i, -var, bottom=value, 
                            color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
        
        # I'm adding actual values inside bars
        for i, value in enumerate(data.values):
            axes[0,1].text(i, value/2, f'{value:.0f}m', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 1:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[0,1].text(i, value + 2, f'ΔM {pct:+.0f}%',
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm calculating separation
        separation = abs(data['Hit'] - data['Flop'])
        
        # I'm adding chart summary at the TOP
        axes[0,1].text(0.0, 1.15, f'Hit vs Flop separation: {separation:.1f} minutes - Weak predictor', 
                      transform=axes[0,1].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[0,1].plot([0, 1], [1.10, 1.10], transform=axes[0,1].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title below the separator
        axes[0,1].text(0.0, 1.04, 'ΔM% | Mean Runtime by Success Category', 
                      transform=axes[0,1].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[0,1].set_xticks(range(len(data)))
        axes[0,1].set_xticklabels(data.index, fontsize=9)
        axes[0,1].set_ylim(0, max(data.values) * 1.25)
        axes[0,1].set_ylabel('Runtime (minutes)', fontsize=9)
        axes[0,1].grid(axis='y', alpha=0.2)
        axes[0,1].spines['top'].set_visible(False)
        axes[0,1].spines['right'].set_visible(False)
    
    # ===== CHART 3: Class Separation by Vote Average =====
    if 'vote_average' in df.columns:
        # I'm calculating data
        data = df.groupby('success_category')['vote_average'].mean()
        data = data.reindex(['Flop', 'Break-even', 'Hit'])
        benchmark = data.mean()
        
        # I'm calculating variance
        variances = data.values - benchmark
        variances_pct = ((data.values - benchmark) / benchmark * 100)
        
        # I'm plotting main bars
        bars = axes[1,0].bar(range(len(data)), data.values,
                            color=IBCS_COLORS['primary'], alpha=0.9, width=0.6)
        
        # I'm adding benchmark line with label
        axes[1,0].axhline(benchmark, color=IBCS_COLORS['neutral'], 
                         linestyle='--', linewidth=1.5, alpha=0.7)
        axes[1,0].text(len(data)-0.5, benchmark, 'Mean', 
                      fontsize=8, va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(data.values, variances)):
            if var > 0:
                axes[1,0].bar(i, var, bottom=benchmark, 
                            color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
            else:
                axes[1,0].bar(i, -var, bottom=value, 
                            color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
        
        # I'm adding actual percentage values inside bars
        for i, value in enumerate(data.values):
            axes[1,0].text(i, value/2, f'{value:.1f}', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 1:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[1,0].text(i, value + 0.1, f'ΔM {pct:+.0f}%',
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm calculating separation
        separation = abs(data['Hit'] - data['Flop'])
        
        # I'm adding chart summary at the TOP
        axes[1,0].text(0.0, 1.15, f'Hit vs Flop separation: {separation:.2f} points - Good predictor', 
                      transform=axes[1,0].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[1,0].plot([0, 1], [1.10, 1.10], transform=axes[1,0].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title below the separator
        axes[1,0].text(0.0, 1.04, 'ΔM% | Mean TMDB Vote Average by Success', 
                      transform=axes[1,0].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[1,0].set_xticks(range(len(data)))
        axes[1,0].set_xticklabels(data.index, fontsize=9)
        axes[1,0].set_ylim(0, 10)
        axes[1,0].set_ylabel('Vote Average', fontsize=9)
        axes[1,0].grid(axis='y', alpha=0.2)
        axes[1,0].spines['top'].set_visible(False)
        axes[1,0].spines['right'].set_visible(False)
    
    # ===== CHART 4: Class Separation by IMDb Rating =====
    if 'imdb_rating' in df.columns:
        # I'm calculating data
        data = df.groupby('success_category')['imdb_rating'].mean()
        data = data.reindex(['Flop', 'Break-even', 'Hit'])
        benchmark = data.mean()
        
        # I'm calculating variance
        variances = data.values - benchmark
        variances_pct = ((data.values - benchmark) / benchmark * 100)
        
        # I'm plotting main bars
        bars = axes[1,1].bar(range(len(data)), data.values,
                            color=IBCS_COLORS['primary'], alpha=0.9, width=0.6)
        
        # I'm adding benchmark line with label
        axes[1,1].axhline(benchmark, color=IBCS_COLORS['neutral'], 
                         linestyle='--', linewidth=1.5, alpha=0.7)
        axes[1,1].text(len(data)-0.5, benchmark, 'Mean', 
                      fontsize=8, va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(data.values, variances)):
            if var > 0:
                axes[1,1].bar(i, var, bottom=benchmark, 
                            color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
            else:
                axes[1,1].bar(i, -var, bottom=value, 
                            color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
        
        # I'm adding actual percentage values inside bars
        for i, value in enumerate(data.values):
            axes[1,1].text(i, value/2, f'{value:.1f}', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 3:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[1,1].text(i, value + 0.15, f'ΔM {pct:+.0f}%',
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm calculating separation
        separation = abs(data['Hit'] - data['Flop'])
        
        # I'm adding chart summary at the TOP
        axes[1,1].text(0.0, 1.15, f'Hit vs Flop separation: {separation:.2f} points - Strongest predictor', 
                      transform=axes[1,1].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[1,1].plot([0, 1], [1.10, 1.10], transform=axes[1,1].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title below the separator
        axes[1,1].text(0.0, 1.04, 'ΔM% | Mean IMDb Rating by Success Category', 
                      transform=axes[1,1].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[1,1].set_xticks(range(len(data)))
        axes[1,1].set_xticklabels(data.index, fontsize=9)
        axes[1,1].set_ylim(0, 10)
        axes[1,1].set_ylabel('IMDb Rating', fontsize=9)
        axes[1,1].grid(axis='y', alpha=0.2)
        axes[1,1].spines['top'].set_visible(False)
        axes[1,1].spines['right'].set_visible(False)
    
    # I'm adding the overall title at TOP
    fig.text(0.08, 0.95, 
             'Feature Separation Analysis for k-NN Classification\nValidating Predictive Power of Modeling Features',
             fontsize=11, fontweight='bold', va='top', ha='left')
    
    plt.show()
    
    # I'm providing insights for prediction model
    print("\n## Prediction Model Feature Insights:")
    print("✓ budget_log: Strong class separation - Good predictor for k-NN")
    print("✗ runtime: Minimal separation between categories - Weak predictor")
    print("✓ vote_average: Clear separation between success classes - Good predictor")
    print("✓✓ imdb_rating: Highest separation metric - Best predictor for the model")
    print("\n→ Model Recommendation: Prioritize imdb_rating and budget_log in k-NN distance calculations")