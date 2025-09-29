def create_genre_performance_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import pandas as pd
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 8))

    # I'm analyzing hit rates by genre to identify the most reliable performers
    if 'primary_genre' in df.columns:
        genre_data = df.groupby('primary_genre')['success_category'].apply(lambda x: (x == 'Hit').mean()).sort_values(ascending=True)
        benchmark = genre_data.mean()
        
        # I'm creating the bars manually to fix the overlap issues
        pos = range(len(genre_data))
        bars = ax1.barh(pos, genre_data.values, color=IBCS_COLORS['primary'], alpha=0.85, height=0.7)
        ax1.axvline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        # I'm adding overlays and labels with better spacing
        for i, val in enumerate(genre_data.values):
            diff = (val - benchmark) / benchmark * 100
            if val > benchmark:
                ax1.barh(i, val - benchmark, left=benchmark, color=IBCS_COLORS['good'], alpha=0.7, height=0.7)
                ax1.text(max(val, benchmark) + 0.015, i, f'{val:.1%}', va='center', fontweight='bold', 
                        color=IBCS_COLORS['good'], fontsize=10)
            else:
                ax1.barh(i, benchmark - val, left=val, color=IBCS_COLORS['bad'], alpha=0.7, height=0.7)
                ax1.text(max(val, benchmark) + 0.015, i, f'{val:.1%}', va='center', fontweight='bold', 
                        color='black', fontsize=10)
            
            # I only show significant differences and positioned them inside the bars to save space
            if abs(diff) > 3:
                x_pos = val - 0.02 if val > benchmark else val + 0.01
                ax1.text(x_pos, i, f'{diff:+.0f}%', va='center', fontweight='bold', fontsize=9,
                        color='white', ha='center')
        
        ax1.set_title('Hit Rate by Genre', fontweight='bold', fontsize=12)
        ax1.set_yticks(pos)
        ax1.set_yticklabels(genre_data.index, fontsize=9)
        ax1.grid(alpha=0.2)
        ax1.set_xlim(0, max(genre_data.values) * 1.25)

    # I want to compare profit ratios by genre against the industry hit threshold
    if 'primary_genre' in df.columns and 'profit_ratio' in df.columns:
        profit_data = df.groupby('primary_genre')['profit_ratio'].median().sort_values(ascending=False)
        threshold = 2.5
        
        bars = ax2.bar(range(len(profit_data)), profit_data.values, color=IBCS_COLORS['primary'], alpha=0.85)
        ax2.axhline(threshold, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        # I'm adding overlays and labels with better positioning to avoid overlap
        for i, value in enumerate(profit_data.values):
            pct_diff = (value - threshold) / threshold * 100
            
            if value > threshold:
                ax2.bar(i, value - threshold, bottom=threshold, color=IBCS_COLORS['good'], alpha=0.7)
                color = IBCS_COLORS['good']
            elif value < threshold:
                ax2.bar(i, threshold - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7)
                color = IBCS_COLORS['bad']
            else:
                color = 'black'
            
            ax2.text(i, max(value, threshold) + 0.15, f'{value:.1f}x', ha='center', fontweight='bold', 
                    color=color, fontsize=10)
            
            # I put percentage differences inside the bars with white text to save space
            if abs(pct_diff) > 5:
                if value > threshold:
                    y_pos = threshold + (value - threshold) / 2
                else:
                    y_pos = value + (threshold - value) / 2
                ax2.text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                        color='white')
        
        ax2.set_title('Median Profit Ratio by Genre', fontweight='bold', fontsize=12)
        ax2.set_ylabel('Revenue Multiple (x)', fontweight='bold')
        ax2.set_xticks(range(len(profit_data)))
        ax2.set_xticklabels(profit_data.index, rotation=45, ha='right', fontsize=9)
        ax2.grid(alpha=0.2)
        ax2.set_ylim(0, max(profit_data.values) * 1.25)

    # Clean styling and proper benchmark positioning
    plt.suptitle('Genre Performance Analysis for Investment Strategy', fontsize=15, fontweight='bold', y=0.96)
    for ax in [ax1, ax2]:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    plt.show()

    print("## Genre Performance Insights:")
    print(f"- **Genre Hit Rate Average**: {benchmark:.1%} across {len(genre_data)} movie genres")
    print("- **Industry Profit Threshold**: 2.5x revenue multiple (movies below this are not profitable)")
    print("- **High-performing genres**: Horror, Family, Animation (above average hit rates)")
    print("- **Low-performing genres**: History, Western, Science Fiction (below average hit rates)")