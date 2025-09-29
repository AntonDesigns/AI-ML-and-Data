import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# IBCS Color Schemes
IBCS_COLORS = {
    'primary': '#1f4e79',    # Dark blue
    'good': '#70ad47',       # Green  
    'bad': '#c55a5a',        # Red
    'neutral': '#a5a5a5',    # Grey
    'highlight': '#ffc000'   # Orange
}

DARK_IBCS_COLORS = {
    'primary': '#4A90E2',      # Professional blue
    'good': '#7ED321',         # Bright green  
    'bad': '#D0021B',          # Bright red
    'neutral': '#9B9B9B',      # Light gray
    'highlight': '#F5A623'     # Orange
}

# Theme Functions
def set_light_theme():
    plt.style.use('default')
    plt.rcParams.update({
        'font.family': 'Arial',
        'font.size': 10,
        'axes.spines.top': False,
        'axes.spines.right': False,
        'axes.grid': True,
        'grid.alpha': 0.3,
        'axes.axisbelow': True
    })

def set_dark_theme():
    plt.style.use('dark_background')
    plt.rcParams.update({
        'font.family': 'Arial',
        'font.size': 11,
        'axes.facecolor': '#1e1e1e',
        'figure.facecolor': '#2d2d2d',
        'axes.edgecolor': '#404040',
        'axes.linewidth': 0.8,
        'grid.color': '#404040',
        'grid.alpha': 0.3,
        'text.color': 'white',
        'axes.labelcolor': 'white',
        'xtick.color': 'white',
        'ytick.color': 'white'
    })

# Enhanced IBCS chart function
def ibcs_bars(ax, data, benchmark, title, horizontal=False, use_dark_theme=False):
    colors = DARK_IBCS_COLORS if use_dark_theme else IBCS_COLORS
    pos = range(len(data))
    
    if horizontal:
        bars = ax.barh(pos, data.values, color=colors['primary'], alpha=0.8, height=0.6)
        ax.axvline(benchmark, color=colors['neutral'], linestyle='--', alpha=0.8, linewidth=2)
        
        for i, val in enumerate(data.values):
            diff = (val - benchmark) / benchmark * 100
            if val > benchmark:
                ax.barh(i, val - benchmark, left=benchmark, color=colors['good'], alpha=0.8, height=0.6)
                text_color = colors['good']
            else:
                ax.barh(i, benchmark - val, left=val, color=colors['bad'], alpha=0.8, height=0.6)
                text_color = 'white' if use_dark_theme else 'black'
            
            ax.text(max(val, benchmark) + 0.01, i, f'{val:.1%}', va='center', fontweight='bold', 
                   color=text_color, fontsize=12)
            
            if abs(diff) > 3:
                x_pos = val - 0.02 if val > benchmark else val + 0.01
                ax.text(x_pos, i, f'{diff:+.0f}%', va='center', fontweight='bold', fontsize=10,
                       color='black', ha='center')
        
        ax.set_yticks(pos)
        ax.set_yticklabels(data.index, fontsize=11)
        ax.set_xlim(0, max(data.values) * 1.2)
        
    else:
        bars = ax.bar(pos, data.values, color=colors['primary'], alpha=0.8, width=0.6)
        ax.axhline(benchmark, color=colors['neutral'], linestyle='--', alpha=0.8, linewidth=2)
        
        for i, val in enumerate(data.values):
            diff = (val - benchmark) / benchmark * 100
            if val > benchmark:
                ax.bar(i, val - benchmark, bottom=benchmark, color=colors['good'], alpha=0.8, width=0.6)
                text_color = colors['good']
            else:
                ax.bar(i, benchmark - val, bottom=val, color=colors['bad'], alpha=0.8, width=0.6)
                text_color = 'white' if use_dark_theme else 'black'
            
            ax.text(i, max(val, benchmark) + 0.02, f'{val:.1%}', ha='center', fontweight='bold', 
                   color=text_color, fontsize=12)
            
            if abs(diff) > 3:
                if val > benchmark:
                    y_pos = benchmark + (val - benchmark) / 2
                else:
                    y_pos = val + (benchmark - val) / 2
                ax.text(i, y_pos, f'{diff:+.0f}%', ha='center', fontweight='bold', fontsize=10,
                       color='black')
        
        ax.set_xticks(pos)
        ax.set_xticklabels(data.index, fontsize=11)
    
    title_color = 'white' if use_dark_theme else 'black'
    ax.set_title(title, fontweight='bold', fontsize=14, color=title_color, pad=20)
    ax.grid(True, alpha=0.2)

# Data loading function
def load_movie_data(filepath):
    df = pd.read_csv(filepath)
    
    # Dynamic variables
    N_MOVIES = len(df)
    N_FEATURES = len(df.columns)
    NUMERICAL_FEATURES = ['budget', 'revenue', 'runtime', 'vote_average', 'imdb_rating', 'profit_ratio']
    OPTIMAL_BINS = min(max(15, int(np.sqrt(N_MOVIES))), 25)
    
    print(f"Dataset: {N_MOVIES} movies with {N_FEATURES} features")
    print(f"Success distribution:\n{df['success_category'].value_counts()}")
    
    return df, N_MOVIES, N_FEATURES, NUMERICAL_FEATURES, OPTIMAL_BINS

# Initialize default theme
set_light_theme()