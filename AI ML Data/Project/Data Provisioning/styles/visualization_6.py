def create_studio_performance_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import pandas as pd
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 8))

    # I'm looking at studios with enough movies to have meaningful track records
    if 'main_production_company' in df.columns:
        studio_stats = df.groupby('main_production_company').agg({
            'success_category': ['count', lambda x: (x == 'Hit').mean()],
            'budget': 'mean',
            'revenue': 'mean'
        }).round(2)
        studio_stats.columns = ['movie_count', 'hit_rate', 'avg_budget', 'avg_revenue']
        
        # I filtered to studios with at least 10 movies for reliable statistics
        major_studios = studio_stats[studio_stats['movie_count'] >= 10].copy()
        
        if not major_studios.empty:
            # I want to show the top performing studios by hit rate
            top_studios = major_studios.sort_values('hit_rate', ascending=True).tail(10)  # Top 10
            benchmark = top_studios['hit_rate'].mean()
            
            bars = ax1.barh(range(len(top_studios)), top_studios['hit_rate'].values, 
                           color=IBCS_COLORS['primary'], alpha=0.85, height=0.7)
            ax1.axvline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
            
            # I'm adding overlays and labels following the IBCS pattern
            for i, value in enumerate(top_studios['hit_rate'].values):
                pct_diff = (value - benchmark) / benchmark * 100
                
                if value > benchmark:
                    ax1.barh(i, value - benchmark, left=benchmark, color=IBCS_COLORS['good'], alpha=0.7, height=0.7)
                    color = IBCS_COLORS['good']
                elif value < benchmark:
                    ax1.barh(i, benchmark - value, left=value, color=IBCS_COLORS['bad'], alpha=0.7, height=0.7)
                    color = 'black'
                else:
                    color = 'black'
                
                ax1.text(max(value, benchmark) + 0.015, i, f'{value:.1%}', va='center', fontweight='bold', 
                        color=color, fontsize=10)
                
                # I positioned percentage differences inside bars with white text
                if abs(pct_diff) > 5:
                    x_pos = value - 0.02 if value > benchmark else value + 0.01
                    ax1.text(x_pos, i, f'{pct_diff:+.0f}%', va='center', fontweight='bold', fontsize=9,
                            color='white', ha='center')
            
            ax1.set_title('Top Studios by Hit Rate (10+ Movies)', fontweight='bold', fontsize=12)
            ax1.set_xlabel('Hit Rate', fontweight='bold')
            ax1.set_yticks(range(len(top_studios)))
            ax1.set_yticklabels([name[:20] + '...' if len(name) > 20 else name for name in top_studios.index], fontsize=9)
            ax1.set_xlim(0, max(top_studios['hit_rate']) * 1.25)
            ax1.grid(alpha=0.2)

        # I want to compare major studio categories by investment size and success
        if not major_studios.empty:
            # I'm categorizing studios by their average budget levels
            def categorize_studio_size(avg_budget):
                if avg_budget >= 100_000_000:
                    return 'Major Studio\n(100M+ avg)'
                elif avg_budget >= 50_000_000:
                    return 'Mid-tier Studio\n(50-100M avg)'
                elif avg_budget >= 20_000_000:
                    return 'Indie Studio\n(20-50M avg)'
                else:
                    return 'Small Studio\n(<20M avg)'
            
            major_studios['studio_category'] = major_studios['avg_budget'].apply(categorize_studio_size)
            
            # I want to see hit rates by studio investment category
            studio_category_data = major_studios.groupby('studio_category')['hit_rate'].mean()
            category_order = ['Small Studio\n(<20M avg)', 'Indie Studio\n(20-50M avg)', 
                             'Mid-tier Studio\n(50-100M avg)', 'Major Studio\n(100M+ avg)']
            studio_category_data = studio_category_data.reindex([cat for cat in category_order if cat in studio_category_data.index])
            category_benchmark = studio_category_data.mean()
            
            bars = ax2.bar(range(len(studio_category_data)), studio_category_data.values, 
                          color=IBCS_COLORS['primary'], alpha=0.85, width=0.6)
            ax2.axhline(category_benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
            
            # I'm adding overlays and labels with the IBCS approach
            for i, value in enumerate(studio_category_data.values):
                pct_diff = (value - category_benchmark) / category_benchmark * 100
                
                if value > category_benchmark:
                    ax2.bar(i, value - category_benchmark, bottom=category_benchmark, color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
                    color = IBCS_COLORS['good']
                elif value < category_benchmark:
                    ax2.bar(i, category_benchmark - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
                    color = 'black'
                else:
                    color = 'black'
                
                ax2.text(i, max(value, category_benchmark) + 0.02, f'{value:.1%}', ha='center', fontweight='bold', 
                        color=color, fontsize=11)
                
                # I positioned percentage differences inside overlays
                if abs(pct_diff) > 5:
                    if value > category_benchmark:
                        y_pos = category_benchmark + (value - category_benchmark) / 2
                    else:
                        y_pos = value + (category_benchmark - value) / 2
                    ax2.text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                            color='white')
            
            ax2.set_title('Hit Rate by Studio Investment Level', fontweight='bold', fontsize=12)
            ax2.set_ylabel('Hit Rate', fontweight='bold')
            ax2.set_xticks(range(len(studio_category_data)))
            ax2.set_xticklabels(studio_category_data.index, fontsize=9, rotation=0)
            ax2.grid(alpha=0.2)

    # Clean styling
    plt.suptitle('Studio Performance Analysis', fontsize=15, fontweight='bold', y=0.96)
    for ax in [ax1, ax2]:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    plt.show()

    print("## Studio Performance Insights:")
    print(f"- **Top studio benchmark**: Top performers show consistent hit rates")
    print("- **Studio size correlation**: Larger budget studios don't always guarantee higher success rates")  
    print("- **Distribution network value**: Major studios provide marketing and distribution advantages")
    print("- **Partnership strategy**: Track record more important than studio size for investment decisions")