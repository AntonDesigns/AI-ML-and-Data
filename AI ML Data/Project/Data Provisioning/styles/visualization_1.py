def create_investment_factors_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import numpy as np
    import pandas as pd
    
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))

    # I'm looking at hit rates across different budget categories to understand investment patterns
    if 'budget_category' in df.columns:
        data = df.groupby('budget_category')['success_category'].apply(lambda x: (x == 'Hit').mean())
        data = data.reindex(['Independent', 'Mid-Budget', 'Major Studio', 'Blockbuster'])
        benchmark = data.mean()
        
        # I'm creating horizontal bars to better display category names
        pos = range(len(data))
        bars = axes[0,0].barh(pos, data.values, color=IBCS_COLORS['primary'], alpha=0.85, height=0.7)
        axes[0,0].axvline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        # I'm adding performance overlays and positioning labels outside bars to avoid overlap
        for i, value in enumerate(data.values):
            pct_diff = (value - benchmark) / benchmark * 100
            
            if value > benchmark:
                axes[0,0].barh(i, value - benchmark, left=benchmark, color=IBCS_COLORS['good'], alpha=0.7, height=0.7)
                axes[0,0].text(max(value, benchmark) + 0.015, i, f'{value:.1%}', va='center', fontweight='bold', 
                              color=IBCS_COLORS['good'], fontsize=11)
            else:
                axes[0,0].barh(i, benchmark - value, left=value, color=IBCS_COLORS['bad'], alpha=0.7, height=0.7)
                axes[0,0].text(max(value, benchmark) + 0.015, i, f'{value:.1%}', va='center', fontweight='bold', 
                              color='black', fontsize=11)
            
            # I positioned percentage differences inside bars with white text
            if abs(pct_diff) > 3:
                x_pos = value - 0.02 if value > benchmark else value + 0.01
                axes[0,0].text(x_pos, i, f'{pct_diff:+.0f}%', va='center', fontweight='bold', fontsize=9,
                              color='white', ha='center')
        
        axes[0,0].set_title('Hit Rate by Investment Level', fontweight='bold', fontsize=12)
        axes[0,0].set_yticks(pos)
        axes[0,0].set_yticklabels(data.index)
        axes[0,0].set_xlim(0, max(data.values) * 1.25)
        axes[0,0].grid(alpha=0.2)

    # I want to see how different investment levels perform against the industry hit threshold
    if 'profit_ratio' in df.columns:
        data = df.groupby('budget_category')['profit_ratio'].median()
        data = data.reindex(['Independent', 'Mid-Budget', 'Major Studio', 'Blockbuster'])
        threshold = 2.5
        
        bars = axes[0,1].bar(range(len(data)), data.values, color=IBCS_COLORS['primary'], alpha=0.85)
        axes[0,1].axhline(threshold, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        # I'm adding overlays and positioning labels to avoid overlap
        for i, value in enumerate(data.values):
            pct_diff = (value - threshold) / threshold * 100
            
            if value > threshold:
                axes[0,1].bar(i, value - threshold, bottom=threshold, color=IBCS_COLORS['good'], alpha=0.7)
                color = IBCS_COLORS['good']
            elif value < threshold:
                axes[0,1].bar(i, threshold - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7)
                color = IBCS_COLORS['bad']
            else:
                color = 'black'
                
            axes[0,1].text(i, max(value, threshold) + 0.15, f'{value:.1f}x', ha='center', fontweight='bold', 
                          color=color, fontsize=11)
            
            # I put percentage differences inside the overlays with white text
            if abs(pct_diff) > 5:
                if value > threshold:
                    y_pos = threshold + (value - threshold) / 2
                else:
                    y_pos = value + (threshold - value) / 2
                axes[0,1].text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                              color='white')
        
        axes[0,1].set_title('Median ROI by Investment Level', fontweight='bold', fontsize=12)
        axes[0,1].set_xticks(range(len(data)))
        axes[0,1].set_xticklabels(data.index)
        axes[0,1].set_ylim(0, max(data.values) * 1.25)
        axes[0,1].grid(alpha=0.2)

    # I'm checking if runtime affects hit rates to optimize audience engagement
    if 'runtime' in df.columns:
        runtime_clean = df[df['runtime'].between(60, 300)]
        bins = pd.cut(runtime_clean['runtime'], bins=[60, 90, 120, 150, 300], 
                      labels=['Short\n(60-90min)', 'Standard\n(90-120min)', 'Long\n(120-150min)', 'Epic\n(150min+)'])
        data = runtime_clean.groupby(bins, observed=False)['success_category'].apply(lambda x: (x == 'Hit').mean())
        benchmark = data.mean()
        
        bars = axes[1,0].bar(range(len(data)), data.values, color=IBCS_COLORS['primary'], alpha=0.85)
        axes[1,0].axhline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        # I'm adding overlays and positioning labels outside bars
        for i, value in enumerate(data.values):
            pct_diff = (value - benchmark) / benchmark * 100
            
            if value > benchmark:
                axes[1,0].bar(i, value - benchmark, bottom=benchmark, color=IBCS_COLORS['good'], alpha=0.7)
                color = IBCS_COLORS['good']
            elif value < benchmark:
                axes[1,0].bar(i, benchmark - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7)
                color = 'black'
            else:
                color = 'black'
            
            axes[1,0].text(i, max(value, benchmark) + 0.02, f'{value:.1%}', ha='center', fontweight='bold', 
                          color=color, fontsize=11)
            
            # I put percentage differences inside overlays with white text
            if abs(pct_diff) > 3:
                if value > benchmark:
                    y_pos = benchmark + (value - benchmark) / 2
                else:
                    y_pos = value + (benchmark - value) / 2
                axes[1,0].text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                              color='white')
        
        axes[1,0].set_title('Hit Rate by Runtime Category', fontweight='bold', fontsize=12)
        axes[1,0].set_xticks(range(len(data)))
        axes[1,0].set_xticklabels(data.index, fontsize=10)
        axes[1,0].set_ylim(0, max(max(data.values), benchmark) * 1.2)
        axes[1,0].grid(alpha=0.2)

    # I want to see if IMDb ratings correlate with commercial success
    if 'imdb_rating' in df.columns:
        rating_clean = df[df['imdb_rating'].between(1, 10)]
        bins = pd.cut(rating_clean['imdb_rating'], bins=[0, 5.5, 6.5, 7.5, 10], 
                      labels=['Poor\n(<5.5)', 'Fair\n(5.5-6.5)', 'Good\n(6.5-7.5)', 'Excellent\n(7.5+)'])
        data = rating_clean.groupby(bins, observed=False)['success_category'].apply(lambda x: (x == 'Hit').mean())
        benchmark = data.mean()
        
        bars = axes[1,1].bar(range(len(data)), data.values, color=IBCS_COLORS['primary'], alpha=0.85)
        axes[1,1].axhline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        # I'm adding overlays and labels with proper spacing
        for i, value in enumerate(data.values):
            pct_diff = (value - benchmark) / benchmark * 100
            
            if value > benchmark:
                axes[1,1].bar(i, value - benchmark, bottom=benchmark, color=IBCS_COLORS['good'], alpha=0.7)
                color = IBCS_COLORS['good']
            elif value < benchmark:
                axes[1,1].bar(i, benchmark - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7)
                color = 'black'
            else:
                color = 'black'
            
            axes[1,1].text(i, max(value, benchmark) + 0.02, f'{value:.1%}', ha='center', fontweight='bold', 
                          color=color, fontsize=11)
            
            # I positioned percentage differences inside overlays with white text
            if abs(pct_diff) > 3:
                if value > benchmark:
                    y_pos = benchmark + (value - benchmark) / 2
                else:
                    y_pos = value + (benchmark - value) / 2
                axes[1,1].text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                              color='white')
        
        axes[1,1].set_title('Hit Rate by IMDb Rating Quality', fontweight='bold', fontsize=12)
        axes[1,1].set_xticks(range(len(data)))
        axes[1,1].set_xticklabels(data.index, fontsize=10)
        axes[1,1].set_ylim(0, 1)
        axes[1,1].set_yticks(np.arange(0, 1.1, 0.1))
        axes[1,1].yaxis.set_major_formatter(plt.FuncFormatter(lambda y, _: f'{y:.0%}'))
        axes[1,1].grid(alpha=0.2)

    # Professional title and clean styling
    plt.suptitle('Movie Investment Success Factors Analysis', fontsize=15, fontweight='bold', y=0.96)
    for ax in axes.flat:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    plt.show()

    # I'm providing insights for markdown documentation
    print("## Investment Success Insights:")
    print("- **Budget level performance**: Independent and blockbuster films show highest hit rates")
    print("- **ROI efficiency**: Mid-budget films often deliver better return ratios than blockbusters")  
    print("- **Runtime optimization**: Epic films (150min+) perform best, short films struggle")
    print("- **Quality correlation**: Excellent IMDb ratings strongly predict commercial success")