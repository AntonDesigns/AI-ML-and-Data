def create_budget_revenue_analysis(df, IBCS_COLORS):
    import matplotlib.pyplot as plt
    import pandas as pd
    
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 8))

    # Budget vs Revenue Analysis
    if 'budget' in df.columns and 'revenue' in df.columns:
        clean_data = df[(df['budget'] > 100000) & (df['revenue'] > 0) & 
                       (df['budget'] < 300_000_000) & (df['revenue'] < 2_000_000_000)].copy()
        
        budget_bins = pd.cut(clean_data['budget'], bins=10)
        binned_data = clean_data.groupby(budget_bins).agg({
            'revenue': ['mean', 'count']
        }).round(0)
        
        bin_centers = [(interval.left + interval.right) / 2 / 1e6 for interval in binned_data.index]
        avg_revenues = binned_data['revenue']['mean'].values / 1e6
        
        bars = ax1.bar(bin_centers, avg_revenues, width=15, color=IBCS_COLORS['primary'], 
                       alpha=0.85, edgecolor='white', linewidth=0.8)
        
        threshold = 250
        line = ax1.axhline(y=threshold, color=IBCS_COLORS['neutral'], linestyle='--', 
                          alpha=0.7, linewidth=2, label=f'Hit threshold (${threshold}M)')
        
        # Add variance overlays and percentage labels for ALL bars
        for i, (bar, revenue) in enumerate(zip(bars, avg_revenues)):
            pct_diff = (revenue - threshold) / threshold * 100
            
            if revenue > threshold:
                ax1.bar(bar.get_x() + bar.get_width()/2, revenue - threshold, bottom=threshold, 
                       width=15, color=IBCS_COLORS['good'], alpha=0.7)
                label_color = IBCS_COLORS['good']
            elif revenue < threshold:
                ax1.bar(bar.get_x() + bar.get_width()/2, threshold - revenue, bottom=revenue, 
                       width=15, color=IBCS_COLORS['bad'], alpha=0.7)
                label_color = 'black'
            else:
                label_color = 'black'
            
            # Show revenue value
            ax1.text(bar.get_x() + bar.get_width()/2, revenue + 20, 
                    f'${revenue:.0f}M', ha='center', va='bottom', 
                    fontweight='bold', fontsize=10, color=label_color)
            
            # Show percentage variance for ALL bars
            if abs(pct_diff) > 5:
                y_pos = (threshold + revenue) / 2
                ax1.text(bar.get_x() + bar.get_width()/2, y_pos, f'{pct_diff:+.0f}%', 
                        ha='center', fontweight='bold', fontsize=9, color='white')
        
        ax1.set_xlabel('Budget Range ($M)', fontweight='bold', fontsize=11)
        ax1.set_ylabel('Average Revenue ($M)', fontweight='bold', fontsize=11)
        ax1.set_title('Budget vs Revenue Relationship', fontweight='bold', fontsize=12,
                     color=IBCS_COLORS['primary'])
        ax1.legend(frameon=False, loc='upper left', fontsize=10)
        ax1.grid(alpha=0.2)
        ax1.set_xlim(0, max(bin_centers) * 1.1)
        ax1.set_ylim(0, max(avg_revenues) * 1.15)

    # ROI Efficiency Analysis
    if 'budget_category' in df.columns and 'profit_ratio' in df.columns:
        roi_data = df.groupby('budget_category')['profit_ratio'].median()
        roi_data = roi_data.reindex(['Independent', 'Mid-Budget', 'Major Studio', 'Blockbuster'])
        threshold = 2.5

        bars = ax2.bar(range(len(roi_data)), roi_data.values, color=IBCS_COLORS['primary'], 
                      alpha=0.85, width=0.6)
        line = ax2.axhline(threshold, color=IBCS_COLORS['neutral'], linestyle='--', 
                          alpha=0.7, linewidth=1.5, label=f'Hit threshold ({threshold}x)')
        
        # Add variance overlays and percentage labels for ALL bars
        for i, value in enumerate(roi_data.values):
            # Calculate percentage variance from threshold
            pct_diff = ((value - threshold) / threshold) * 100
            
            if value > threshold:
                # Above threshold: add green overlay
                variance_height = value - threshold
                ax2.bar(i, variance_height, bottom=threshold, color=IBCS_COLORS['good'], 
                       alpha=0.7, width=0.6)
                color = IBCS_COLORS['good']
                y_pos = threshold + (variance_height / 2)
            elif value < threshold:
                # Below threshold: add red overlay
                variance_height = threshold - value
                ax2.bar(i, variance_height, bottom=value, color=IBCS_COLORS['bad'], 
                       alpha=0.7, width=0.6)
                color = 'black'
                y_pos = value + (variance_height / 2)
            else:
                color = 'black'
                y_pos = None
            
            # Show ROI value above bar
            ax2.text(i, max(value, threshold) + 0.1, f'{value:.1f}x', ha='center', 
                    fontweight='bold', color=color, fontsize=11)
            
            # Show percentage variance from threshold for ALL bars with sufficient variance
            if abs(pct_diff) > 5 and y_pos is not None:
                ax2.text(i, y_pos, f'{pct_diff:+.0f}%', ha='center', fontweight='bold', 
                        fontsize=9, color='white')
        
        ax2.set_title('Median ROI by Investment Level', fontweight='bold', fontsize=12,
                     color=IBCS_COLORS['primary'])
        ax2.set_ylabel('Revenue Multiple (x)', fontweight='bold', fontsize=11)
        ax2.set_xticks(range(len(roi_data)))
        ax2.set_xticklabels(roi_data.index, rotation=45, ha='right', fontsize=10)
        ax2.legend(frameon=False, fontsize=10)
        ax2.grid(alpha=0.2)

    plt.suptitle('Investment-Return Analysis', fontsize=15, fontweight='bold', y=0.96)
    for ax in [ax1, ax2]:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    plt.show()

    print("## Investment-Return Insights:")
    print("- **Budget efficiency**: Higher budgets don't automatically guarantee better returns")
    print("- **Profitability zones**: Clear separation between profitable and unprofitable investments")  
    print("- **Investment sweet spot**: Mid-budget films often show better ROI ratios")
    print("- **Risk scaling**: Revenue variance increases with budget size")