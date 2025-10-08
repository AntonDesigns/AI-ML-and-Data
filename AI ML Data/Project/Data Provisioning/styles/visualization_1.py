def create_investment_factors_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd
    
    # I'm setting IBCS standard colors - black/dark gray for actual values
    IBCS_COLORS['primary'] = '#2C3E50'
    
    # I'm creating a figure with 4 charts (2x2 grid)
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    fig.subplots_adjust(hspace=0.45, wspace=0.3, top=0.92, left=0.08)
    
    # ===== CHART 1: Hit Rate by Budget Category =====
    if 'budget_category' in df.columns:
        # I'm calculating data
        data = df.groupby('budget_category')['success_category'].apply(lambda x: (x == 'Hit').mean())
        data = data.reindex(['Independent', 'Mid-Budget', 'Major Studio', 'Blockbuster'])
        benchmark = data.mean()
        
        # I'm calculating variance
        variances = data.values - benchmark
        variances_pct = ((data.values - benchmark) / benchmark * 100)
        
        # I'm plotting main bars (black/dark gray)
        bars = axes[0,0].bar(range(len(data)), data.values, 
                            color=IBCS_COLORS['primary'], alpha=0.9, width=0.6)
        
        # I'm adding benchmark line with label
        axes[0,0].axhline(benchmark, color=IBCS_COLORS['neutral'], 
                         linestyle='--', linewidth=1.5, alpha=0.7)
        axes[0,0].text(len(data)-0.5, benchmark, 'Benchmark', 
                      fontsize=8, va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(data.values, variances)):
            if var > 0:
                axes[0,0].bar(i, var, bottom=benchmark, 
                            color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
            else:
                axes[0,0].bar(i, -var, bottom=value, 
                            color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
        
        # I'm adding actual percentage values inside bars
        for i, value in enumerate(data.values):
            axes[0,0].text(i, value/2, f'{value:.0%}', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 1:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[0,0].text(i, value + 0.02, f'ΔBM {pct:+.0f}%', 
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm finding the top performers from THIS chart's data
        top_category = data.idxmax()
        top_pct = variances_pct[data.values.argmax()]
        
        # I'm adding chart-specific summary at the TOP
        axes[0,0].text(0.0, 1.15, f'{top_category} films achieve highest hit rate at {top_pct:+.0f}% vs benchmark', 
                      transform=axes[0,0].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[0,0].plot([0, 1], [1.10, 1.10], transform=axes[0,0].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title lower for this chart
        axes[0,0].text(0.0, 0.98, 'ΔBM% | Hit Rate by Investment Level', 
                      transform=axes[0,0].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[0,0].set_xticks(range(len(data)))
        axes[0,0].set_xticklabels(data.index, fontsize=9)
        axes[0,0].set_ylim(0, max(data.values) * 1.25)
        axes[0,0].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y:.0%}'))
        axes[0,0].grid(axis='y', alpha=0.2)
        axes[0,0].spines['top'].set_visible(False)
        axes[0,0].spines['right'].set_visible(False)
    
    # ===== CHART 2: ROI by Budget Category =====
    if 'profit_ratio' in df.columns:
        # I'm calculating data
        data = df.groupby('budget_category')['profit_ratio'].median()
        data = data.reindex(['Independent', 'Mid-Budget', 'Major Studio', 'Blockbuster'])
        threshold = 2.5
        
        # I'm calculating variance
        variances = data.values - threshold
        variances_pct = ((data.values - threshold) / threshold * 100)
        
        # I'm plotting main bars
        bars = axes[0,1].bar(range(len(data)), data.values,
                            color=IBCS_COLORS['primary'], alpha=0.9, width=0.6)
        
        # I'm adding threshold line with label
        axes[0,1].axhline(threshold, color=IBCS_COLORS['neutral'], 
                         linestyle='--', linewidth=1.5, alpha=0.7)
        axes[0,1].text(len(data)-0.5, threshold, 'Threshold (2.5x)', 
                      fontsize=8, va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(data.values, variances)):
            if var > 0:
                axes[0,1].bar(i, var, bottom=threshold, 
                            color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
            else:
                axes[0,1].bar(i, -var, bottom=value, 
                            color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
        
        # I'm adding actual values inside bars
        for i, value in enumerate(data.values):
            axes[0,1].text(i, value/2, f'{value:.1f}x', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 1:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[0,1].text(i, value + 0.15, f'ΔTH {pct:+.0f}%',
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm finding the top performer from THIS chart's data
        top_category = data.idxmax()
        top_value = data.max()
        top_pct = variances_pct[data.values.argmax()]
        
        # I'm adding chart summary at the TOP
        axes[0,1].text(0.0, 1.15, f'{top_category} delivers highest ROI at {top_value:.1f}x ({top_pct:+.0f}% vs 2.5x threshold)', 
                      transform=axes[0,1].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[0,1].plot([0, 1], [1.10, 1.10], transform=axes[0,1].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title below the separator
        axes[0,1].text(0.0, 1.04, 'ΔTH% | Median ROI by Investment Level', 
                      transform=axes[0,1].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[0,1].set_xticks(range(len(data)))
        axes[0,1].set_xticklabels(data.index, fontsize=9)
        axes[0,1].set_ylim(0, max(data.values) * 1.25)
        axes[0,1].grid(axis='y', alpha=0.2)
        axes[0,1].spines['top'].set_visible(False)
        axes[0,1].spines['right'].set_visible(False)
    
    # ===== CHART 3: Hit Rate by Runtime =====
    if 'runtime' in df.columns:
        # I'm calculating data
        runtime_clean = df[df['runtime'].between(60, 300)]
        bins = pd.cut(runtime_clean['runtime'], bins=[60, 90, 120, 150, 300],
                      labels=['Short\n(60-90)', 'Standard\n(90-120)', 'Long\n(120-150)', 'Epic\n(150+)'])
        data = runtime_clean.groupby(bins, observed=False)['success_category'].apply(lambda x: (x == 'Hit').mean())
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
        axes[1,0].text(len(data)-0.5, benchmark, 'Benchmark', 
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
            axes[1,0].text(i, value/2, f'{value:.0%}', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 1:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[1,0].text(i, value + 0.02, f'ΔBM {pct:+.0f}%',
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm finding the top performer from THIS chart's data
        top_category = data.index[data.values.argmax()].replace('\n', ' ')
        top_pct = variances_pct[data.values.argmax()]
        
        # I'm adding chart summary at the TOP
        axes[1,0].text(0.0, 1.15, f'{top_category} films achieve highest hit rate at {top_pct:+.0f}% vs benchmark', 
                      transform=axes[1,0].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[1,0].plot([0, 1], [1.10, 1.10], transform=axes[1,0].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title below the separator
        axes[1,0].text(0.0, 1.04, 'ΔBM% | Hit Rate by Runtime Category', 
                      transform=axes[1,0].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[1,0].set_xticks(range(len(data)))
        axes[1,0].set_xticklabels(data.index, fontsize=9)
        axes[1,0].set_ylim(0, max(data.values) * 1.25)
        axes[1,0].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y:.0%}'))
        axes[1,0].grid(axis='y', alpha=0.2)
        axes[1,0].spines['top'].set_visible(False)
        axes[1,0].spines['right'].set_visible(False)
    
    # ===== CHART 4: Hit Rate by IMDb Rating =====
    if 'imdb_rating' in df.columns:
        # I'm calculating data
        rating_clean = df[df['imdb_rating'].between(1, 10)]
        bins = pd.cut(rating_clean['imdb_rating'], bins=[0, 5.5, 6.5, 7.5, 10],
                      labels=['Poor\n(<5.5)', 'Fair\n(5.5-6.5)', 'Good\n(6.5-7.5)', 'Excellent\n(7.5+)'])
        data = rating_clean.groupby(bins, observed=False)['success_category'].apply(lambda x: (x == 'Hit').mean())
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
        axes[1,1].text(len(data)-0.5, benchmark, 'Benchmark', 
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
            axes[1,1].text(i, value/2, f'{value:.0%}', 
                          ha='center', va='center', fontsize=10, fontweight='bold', color='white')
        
        # I'm adding variance percentage labels above bars
        for i, (value, pct) in enumerate(zip(data.values, variances_pct)):
            if abs(pct) > 3:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                axes[1,1].text(i, value + 0.03, f'ΔBM {pct:+.0f}%',
                              ha='center', va='bottom', fontsize=9, fontweight='bold', color=color)
        
        # I'm finding the top performer from THIS chart's data
        top_category = data.index[data.values.argmax()].replace('\n', ' ')
        top_pct = variances_pct[data.values.argmax()]
        
        # I'm adding chart summary at the TOP
        axes[1,1].text(0.0, 1.15, f'{top_category} ratings achieve highest hit rate at {top_pct:+.0f}% vs benchmark', 
                      transform=axes[1,1].transAxes, fontsize=9, color='gray', va='top')
        
        # I'm adding a separator line below the summary using plot
        axes[1,1].plot([0, 1], [1.10, 1.10], transform=axes[1,1].transAxes, 
                      color='lightgray', linewidth=0.5, clip_on=False)
        
        # I'm positioning the title below the separator
        axes[1,1].text(0.0, 1.04, 'ΔBM% | Hit Rate by IMDb Rating Quality', 
                      transform=axes[1,1].transAxes, fontsize=11, fontweight='bold', va='top')
        
        axes[1,1].set_xticks(range(len(data)))
        axes[1,1].set_xticklabels(data.index, fontsize=9)
        axes[1,1].set_ylim(0, 1.15)
        axes[1,1].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y:.0%}'))
        axes[1,1].grid(axis='y', alpha=0.2)
        axes[1,1].spines['top'].set_visible(False)
        axes[1,1].spines['right'].set_visible(False)
    
    # I'm adding the overall title at TOP
    fig.text(0.08, 0.95, 
             'Movie Investment Success Factors Analysis\nFilm Performance Data, AC and BM comparisons',
             fontsize=11, fontweight='bold', va='top', ha='left')
    
    plt.show()
    
    # I'm providing insights for documentation
    print("\n## Investment Success Insights:")
    print("- Budget level performance: Independent and blockbuster films show highest hit rates")
    print("- ROI efficiency: Mid-budget films often deliver better return ratios")
    print("- Runtime optimization: Epic films (150min+) perform best")
    print("- Quality correlation: Excellent IMDb ratings strongly predict success")