"""
Custom CSS styles for the Streamlit app
"""

def get_custom_css():
    """Returns the custom CSS for the app"""
    return """
    <style>
        .big-title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        .subtitle {
            font-size: 1.1rem;
            color: #7f8c8d;
            margin-bottom: 1.5rem;
        }
        .info-box {
            background-color: #f8f9fa;
            padding: 1rem;
            border-radius: 5px;
            border-left: 4px solid #3498db;
            margin: 1rem 0;
        }
        .metric-explain {
            font-size: 0.85rem;
            color: #7f8c8d;
            font-style: italic;
        }
        .sidebar-section {
            background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
            padding: 1.2rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            border: 1px solid #e0e0e0;
        }
        .section-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 0.8rem;
            display: flex;
            align-items: center;
        }
        .metric-card {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            margin: 0.8rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #667eea;
            margin: 0.3rem 0;
        }
        .metric-label {
            font-size: 0.85rem;
            color: #7f8c8d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }
        .metric-desc {
            font-size: 0.8rem;
            color: #95a5a6;
            margin-top: 0.5rem;
            line-height: 1.4;
        }
        .category-box {
            background: white;
            padding: 0.8rem;
            border-radius: 6px;
            margin: 0.6rem 0;
            border-left: 4px solid;
        }
        .hit-box { border-left-color: #27ae60; }
        .break-box { border-left-color: #f39c12; }
        .flop-box { border-left-color: #e74c3c; }
        .tech-detail {
            background: #f8f9fa;
            padding: 0.4rem 0.8rem;
            border-radius: 4px;
            margin: 0.4rem 0;
            font-size: 0.85rem;
            font-family: 'Courier New', monospace;
        }
    </style>
    """