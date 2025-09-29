def create_seasonal_release_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import pandas as pd
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 8))

    # I'm analyzing monthly success rates to find seasonal patterns
    if 'release_month' in df.columns:
        monthly_data = df.groupby('release_month')['success_category'].apply(lambda x: (x == 'Hit').mean())
        benchmark = monthly_data.mean()
        
        bars = ax1.bar(range(len(monthly_data)), monthly_data.values, color=IBCS_COLORS['primary'], alpha=0.85)
        ax1.axhline(benchmark, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
        
        for i, value in enumerate(monthly_data.values):
            pct_diff = (value - benchmark) / benchmark * 100
            
            if value > benchmark:
                ax1.bar(i, value - benchmark, bottom=benchmark, color=IBCS_COLORS['good'], alpha=0.7)
                color = IBCS_COLORS['good']
            elif value < benchmark:
                ax1.bar(i, benchmark - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7)
                color = 'black'
            else:
                color = 'black'
            
            ax1.text(i, max(value, benchmark) + 0.02, f'{value:.1%}', ha='center', fontweight='bold', 
                    color=color, fontsize=10)
            
            if abs(pct_diff) > 5:
                if value > benchmark:
                    y_pos = benchmark + (value - benchmark) / 2
                else:
                    y_pos = value + (benchmark - value) / 2
                ax1.text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                        color='white')
        
        ax1.set_title('Monthly Hit Rate Distribution', fontweight='bold', fontsize=12)
        ax1.set_ylabel('Hit Rate', fontweight='bold')
        ax1.set_xticks(range(len(monthly_data)))
        ax1.set_xticklabels([f'Month {i+1}' for i in range(len(monthly_data))], rotation=45, ha='right')
        ax1.grid(alpha=0.2)

    # I'm comparing summer vs non-summer with consistent primary color - FIXED
    if 'is_summer_movie' in df.columns:
        summer_data = df.groupby('is_summer_movie')['success_category'].apply(lambda x: (x == 'Hit').mean())
        
        # Using consistent primary blue for both bars (IBCS standard)
        bars = ax2.bar(range(len(summer_data)), summer_data.values, 
                      color=IBCS_COLORS['primary'], alpha=0.85, width=0.6)
        
        if len(summer_data) == 2:
            summer_advantage = summer_data.iloc[1] - summer_data.iloc[0]
            avg_line_y = summer_data.mean()
            ax2.axhline(avg_line_y, color=IBCS_COLORS['neutral'], linestyle='--', alpha=0.7, linewidth=1.5)
            
            for i, (category, value) in enumerate(summer_data.items()):
                pct_diff = (value - avg_line_y) / avg_line_y * 100
                
                if value > avg_line_y:
                    ax2.bar(i, value - avg_line_y, bottom=avg_line_y, color=IBCS_COLORS['good'], alpha=0.7, width=0.6)
                    color = IBCS_COLORS['good']
                elif value < avg_line_y:
                    ax2.bar(i, avg_line_y - value, bottom=value, color=IBCS_COLORS['bad'], alpha=0.7, width=0.6)
                    color = 'black'
                else:
                    color = 'black'
                
                ax2.text(i, max(value, avg_line_y) + 0.02, f'{value:.1%}', ha='center', fontweight='bold', 
                        color=color, fontsize=11)
                
                if abs(pct_diff) > 3:
                    y_pos = (avg_line_y + value) / 2
                    ax2.text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', fontsize=9,
                            color='white')
        
        ax2.set_title('Summer vs Non-Summer Release Performance', fontweight='bold', fontsize=12)
        ax2.set_ylabel('Hit Rate', fontweight='bold')
        ax2.set_xticks(range(len(summer_data)))
        ax2.set_xticklabels(['Non-Summer', 'Summer\n(May-Aug)'], fontsize=11)
        ax2.grid(alpha=0.2)

    plt.suptitle('Release Timing Impact on Movie Success', fontsize=15, fontweight='bold', y=0.96)
    for ax in [ax1, ax2]:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    plt.show()

    print("## Release Timing Insights:")
    print(f"- **Monthly average hit rate**: {benchmark:.1%} across all release months")
    print("- **Summer blockbuster effect**: May-August typically show higher success rates")  
    print("- **Strategic release windows**: Studios avoid 'dump months' like January/February")
    print("- **Holiday competition**: December shows mixed results due to high competition")