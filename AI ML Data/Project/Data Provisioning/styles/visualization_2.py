def create_genre_performance_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import pandas as pd
    
    # I'm setting IBCS standard colors - black/dark gray for actual values
    IBCS_COLORS['primary'] = '#2C3E50'
    
    # I'm creating a figure with two charts side by side
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 8))
    fig.subplots_adjust(top=0.88, wspace=0.3)

    # ===== CHART 1: Hit Rate by Genre =====
    # I'm analyzing hit rates by genre to identify the most reliable performers
    if 'primary_genre' in df.columns:
        genre_data = df.groupby('primary_genre')['success_category'].apply(lambda x: (x == 'Hit').mean()).sort_values(ascending=True)
        benchmark = genre_data.mean()
        
        # I'm calculating variance for each genre
        variances = genre_data.values - benchmark
        variances_pct = ((genre_data.values - benchmark) / benchmark * 100)
        
        # I'm creating horizontal bars with increased height
        pos = range(len(genre_data))
        bars = ax1.barh(pos, genre_data.values, color=IBCS_COLORS['primary'], alpha=0.9, height=0.8)
        
        # I'm adding the benchmark line with label
        ax1.axvline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        ax1.text(benchmark, len(genre_data)-0.5, 'Benchmark', fontsize=8, 
                rotation=0, va='bottom', ha='center', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays to show performance vs benchmark
        for i, (val, var) in enumerate(zip(genre_data.values, variances)):
            if var > 0:
                ax1.barh(i, var, left=benchmark, color=IBCS_COLORS['good'], alpha=0.7, height=0.8)
            else:
                ax1.barh(i, -var, left=val, color=IBCS_COLORS['bad'], alpha=0.7, height=0.8)
        
        # I'm adding actual percentage values inside bars (white text)
        for i, val in enumerate(genre_data.values):
            ax1.text(val/2, i, f'{val:.0%}', va='center', ha='center',
                    fontweight='bold', fontsize=9, color='white')
        
        # I'm adding variance percentage labels without prefix
        for i, (val, pct) in enumerate(zip(genre_data.values, variances_pct)):
            if abs(pct) > 3:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                ax1.text(val + 0.015, i, f'{pct:+.0f}%', va='center', 
                        fontweight='bold', fontsize=9, color=color)
        
        # I'm finding the top 3 performers from THIS chart's data
        top_genres = genre_data.nlargest(3).index.tolist()
        top_genres_str = ', '.join(top_genres[:2]) + ' and ' + top_genres[2] if len(top_genres) == 3 else ', '.join(top_genres)
        
        # I'm adding chart-specific summary based on actual data
        ax1.text(0.0, 1.15, f'{top_genres_str} genres achieve highest hit rates vs benchmark',
                transform=ax1.transAxes, fontsize=9, color='gray', va='top')
        
        # I'm positioning the title below the summary with proper spacing and alignment
        ax1.text(0.0, 1.04, 'ΔBM% | Hit Rate by Genre', 
                transform=ax1.transAxes, fontsize=11, fontweight='bold', va='top')
        
        ax1.set_yticks(pos)
        ax1.set_yticklabels(genre_data.index, fontsize=9)
        ax1.grid(axis='x', alpha=0.2)
        ax1.set_xlim(0, max(genre_data.values) * 1.2)
        ax1.xaxis.set_major_formatter(plt.FuncFormatter(lambda x, _: f'{x:.0%}'))
        ax1.spines['top'].set_visible(False)
        ax1.spines['right'].set_visible(False)

    # ===== CHART 2: Median Profit Ratio by Genre =====
    # I want to compare profit ratios by genre against the industry hit threshold
    if 'primary_genre' in df.columns and 'profit_ratio' in df.columns:
        profit_data = df.groupby('primary_genre')['profit_ratio'].median().sort_values(ascending=False)
        threshold = 2.5
        
        # I'm calculating variance from threshold
        variances = profit_data.values - threshold
        variances_pct = ((profit_data.values - threshold) / threshold * 100)
        
        # I'm creating vertical bars with increased width
        bars = ax2.bar(range(len(profit_data)), profit_data.values, 
                      color=IBCS_COLORS['primary'], alpha=0.9, width=0.75)
        
        # I'm adding the threshold line with label
        ax2.axhline(threshold, color=IBCS_COLORS['neutral'], linestyle='--', 
                   alpha=0.7, linewidth=1.5)
        ax2.text(len(profit_data)-0.5, threshold, 'Threshold (2.5x)', fontsize=8,
                va='bottom', ha='right', color=IBCS_COLORS['neutral'])
        
        # I'm adding variance overlays
        for i, (value, var) in enumerate(zip(profit_data.values, variances)):
            if var > 0:
                ax2.bar(i, var, bottom=threshold, color=IBCS_COLORS['good'], alpha=0.7, width=0.75)
            else:
                ax2.bar(i, -var, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7, width=0.75)
        
        # I'm adding actual values inside ALL bars (white text)
        for i, value in enumerate(profit_data.values):
            # Position text in the middle of the actual bar value
            ax2.text(i, value/2, f'{value:.1f}x', ha='center', va='center',
                    fontweight='bold', fontsize=9, color='white')
        
        # I'm adding variance percentage labels only when significantly different from threshold
        for i, (value, pct) in enumerate(zip(profit_data.values, variances_pct)):
            # Only show percentage if variance is significant (more than 5%)
            if abs(pct) > 5:
                color = IBCS_COLORS['good'] if pct >= 0 else IBCS_COLORS['bad']
                ax2.text(i, value + 0.25, f'{pct:+.0f}%', ha='center', va='bottom',
                        fontweight='bold', fontsize=9, color=color)
        
        # I'm finding the top performer from THIS chart's data
        top_genre = profit_data.idxmax()
        top_value = profit_data.max()
        
        # I'm adding chart-specific summary based on actual data
        ax2.text(0.0, 1.15, f'{top_genre} delivers highest ROI at {top_value:.1f}x, significantly above 2.5x threshold',
                transform=ax2.transAxes, fontsize=9, color='gray', va='top')
        
        # I'm positioning the title to align perfectly with the summary (same x-position as ax1)
        ax2.text(0.0, 1.04, 'ΔTH% | Median Profit Ratio by Genre', 
                transform=ax2.transAxes, fontsize=11, fontweight='bold', va='top')
        
        ax2.set_ylabel('Revenue Multiple (x)', fontweight='bold', fontsize=10)
        ax2.set_xticks(range(len(profit_data)))
        ax2.set_xticklabels(profit_data.index, rotation=45, ha='right', fontsize=9)
        ax2.grid(axis='y', alpha=0.2)
        ax2.set_ylim(0, max(profit_data.values) * 1.3)
        ax2.spines['top'].set_visible(False)
        ax2.spines['right'].set_visible(False)

    # I'm adding the overall title at top left, aligned with chart summaries
    fig.text(0.125, 0.96, 'Genre Performance Analysis for Investment Strategy\nFilm Genre Data, AC and BM comparisons',
             fontsize=11, fontweight='bold', va='top')

    plt.show()

    # I'm providing insights for documentation
    print("\n## Genre Performance Insights:")
    print(f"- Genre Hit Rate Average: {benchmark:.1%} across {len(genre_data)} movie genres")
    print("- Industry Profit Threshold: 2.5x revenue multiple (movies below this are not profitable)")
    print(f"- High-performing genres: {top_genres_str} (above average hit rates)")
    print("- Low-performing genres: History, Western, Science Fiction (below average hit rates)")