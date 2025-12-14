"""
Drop Ball Game Web Application
==============================
A Flask web application for simulating the Filipino Drop Ball gambling game.
Provides interactive simulations, visualizations, and statistical analysis.

Features:
- Fair Game vs Tweaked Game comparison
- Monte Carlo simulations
- Real-time visualizations
- Statistical analysis dashboard
"""

from flask import Flask, render_template, request, jsonify
import drop_ball
import json
from datetime import datetime
import os

app = Flask(__name__)

# Production Configuration
# Generate a secret key with: python -c 'import secrets; print(secrets.token_hex(32))'
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-please-change-in-production')
app.config['JSON_SORT_KEYS'] = False

# Game constants
FAIR_COLOR = '#2E86AB'      # Blue for Fair Game
TWEAKED_COLOR = '#A23B72'   # Red/Magenta for Tweaked Game

def calculate_additional_metrics(results, bet_amount, num_rounds, theoretical_ev):
    """Calculate additional metrics for results analysis."""
    total_investment = num_rounds * bet_amount

    # ROI (Return on Investment)
    roi = (results['total_profit'] / total_investment) * 100 if total_investment > 0 else 0

    # Actual House Edge (empirical)
    actual_house_edge = -(results['average_return_per_play'] / bet_amount) * 100

    # Theoretical vs Actual deviation
    theoretical_return = theoretical_ev['total_ev']
    actual_return = results['average_return_per_play']
    deviation_pct = ((actual_return - theoretical_return) / abs(theoretical_return)) * 100 if theoretical_return != 0 else 0

    # Calculate streaks if detailed data available
    streaks = {}
    if 'detailed_data' in results and 'per_round_payouts' in results['detailed_data']:
        payouts = results['detailed_data']['per_round_payouts']
        streaks = calculate_streaks(payouts)

    return {
        'roi': round(roi, 2),
        'actual_house_edge': round(actual_house_edge, 2),
        'theoretical_vs_actual_deviation': round(deviation_pct, 2),
        'streaks': streaks
    }

def calculate_streaks(payouts):
    """Calculate winning and losing streaks from payout data."""
    if not payouts:
        return {'max_win_streak': 0, 'max_loss_streak': 0, 'current_streak': 0}

    max_win_streak = max_loss_streak = current_streak = 0
    current_win_streak = current_loss_streak = 0

    for payout in payouts:
        if payout > 0:  # Win
            current_win_streak += 1
            current_loss_streak = 0
            max_win_streak = max(max_win_streak, current_win_streak)
            current_streak = current_win_streak
        elif payout < 0:  # Loss
            current_loss_streak += 1
            current_win_streak = 0
            max_loss_streak = max(max_loss_streak, current_loss_streak)
            current_streak = -current_loss_streak
        else:  # Push (rare)
            current_win_streak = current_loss_streak = 0
            current_streak = 0

    return {
        'max_win_streak': max_win_streak,
        'max_loss_streak': max_loss_streak,
        'current_streak': current_streak
    }

@app.route('/')
def index():
    """Home page with game overview, payout structure, and theoretical comparison."""
    # Calculate theoretical values for display
    fair_game = drop_ball.FairDropBall(drop_ball.cards)
    tweaked_game = drop_ball.TweakedDropBall(drop_ball.cards_with_joker)

    fair_ev = drop_ball.calculate_theoretical_ev(fair_game)
    tweaked_ev = drop_ball.calculate_theoretical_ev(tweaked_game)

    # Prepare data for template
    theoretical_data = {
        'fair': {
            'house_edge': round(-fair_ev['total_ev'] * 100, 2),
            'cards': len(fair_game.cards),
            'probability': round(1/len(fair_game.cards) * 100, 1),
            'ev': round(fair_ev['total_ev'], 4)
        },
        'tweaked': {
            'house_edge': round(-tweaked_ev['total_ev'] * 100, 2),
            'cards': len(tweaked_game.cards),
            'probability': round(1/len(tweaked_game.cards) * 100, 1),
            'ev': round(tweaked_ev['total_ev'], 4)
        }
    }

    # Payout structure
    payout_structure = fair_game.payout_structure

    return render_template('index.html',
                         theoretical_data=theoretical_data,
                         payout_structure=payout_structure,
                         fair_color=FAIR_COLOR,
                         tweaked_color=TWEAKED_COLOR)

@app.route('/simulate', methods=['POST'])
def simulate():
    """Run simulation and return results for visualization."""
    try:
        data = request.get_json()
        game_type = data.get('game_type', 'fair')
        chosen_card = data.get('chosen_card', '10')
        num_rounds = int(data.get('num_rounds', 1000))

        # Initialize appropriate game
        if game_type == 'fair':
            game = drop_ball.FairDropBall(drop_ball.cards)
        else:
            game = drop_ball.TweakedDropBall(drop_ball.cards_with_joker)

        # Run simulation with detailed data
        results = drop_ball.PlayDropBallGame(
            game, chosen_card, num_rounds,
            seed=None, verbose=False, detailed=True
        )

        # Calculate theoretical EV
        ev_data = drop_ball.calculate_theoretical_ev(game)

        # Prepare response data
        response_data = {
            'game_type': game_type,
            'chosen_card': chosen_card,
            'num_rounds': num_rounds,
            'results': results,
            'theoretical_ev': ev_data,
            'timestamp': datetime.now().isoformat()
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/simulate')
def simulate_page():
    """Interactive simulation page with parameter controls and visualizations."""
    # Get available cards (use fair_cards since both games share the same bettable cards)
    available_cards = drop_ball.cards

    # Default simulation parameters
    default_params = {
        'num_simulations': 10000,
        'bet_amount': 1.0,
        'chosen_card': '10',
        'random_seed': True,
        'seed_value': 42
    }

    # Simulation options
    simulation_options = [1000, 5000, 10000, 25000, 50000, 100000]

    return render_template('simulate.html',
                         available_cards=available_cards,
                         default_params=default_params,
                         simulation_options=simulation_options,
                         fair_color=FAIR_COLOR,
                         tweaked_color=TWEAKED_COLOR)

@app.route('/api/run_simulation', methods=['POST'])
def run_simulation():
    """Run comparative simulation for both Fair and Tweaked games simultaneously."""
    try:
        data = request.get_json()

        # Extract parameters
        chosen_card = data.get('chosen_card', '10')
        num_rounds = int(data.get('num_rounds', 10000))
        bet_amount = float(data.get('bet_amount', 1.0))
        use_random_seed = data.get('use_random_seed', True)
        seed_value = int(data.get('seed_value', 42)) if use_random_seed else None

        # Update bet amount in drop_ball module
        original_bet = drop_ball.bet
        drop_ball.bet = bet_amount

        # Initialize both games
        fair_game = drop_ball.FairDropBall(drop_ball.cards)
        tweaked_game = drop_ball.TweakedDropBall(drop_ball.cards_with_joker)

        # Run simulations for both games with same seed for fair comparison
        fair_results = drop_ball.PlayDropBallGame(
            fair_game, chosen_card, num_rounds,
            seed=seed_value, verbose=False, detailed=True
        )

        tweaked_results = drop_ball.PlayDropBallGame(
            tweaked_game, chosen_card, num_rounds,
            seed=seed_value, verbose=False, detailed=True
        )

        # Restore original bet
        drop_ball.bet = original_bet

        # Calculate theoretical EVs
        fair_ev = drop_ball.calculate_theoretical_ev(fair_game, bet_amount)
        tweaked_ev = drop_ball.calculate_theoretical_ev(tweaked_game, bet_amount)

        # Calculate additional metrics for both games
        fair_metrics = calculate_additional_metrics(fair_results, bet_amount, num_rounds, fair_ev)
        tweaked_metrics = calculate_additional_metrics(tweaked_results, bet_amount, num_rounds, tweaked_ev)

        # Prepare visualization data for both games
        fair_viz = prepare_visualization_data(fair_results, 'fair', chosen_card)
        tweaked_viz = prepare_visualization_data(tweaked_results, 'tweaked', chosen_card)

        # Calculate comparative metrics
        profit_difference = fair_results['total_profit'] - tweaked_results['total_profit']
        win_rate_difference = fair_results['win_rate'] - tweaked_results['win_rate']
        house_edge_difference = tweaked_metrics['actual_house_edge'] - fair_metrics['actual_house_edge']

        # Calculate impact analysis metrics
        roi_difference = tweaked_metrics['roi'] - fair_metrics['roi']
        house_profit_increase = tweaked_results['total_profit'] - fair_results['total_profit']  # Negative means more profit for house
        house_edge_increase_rate = house_edge_difference  # Already calculated

        response = {
            'success': True,
            'chosen_card': chosen_card,
            'num_rounds': num_rounds,
            'bet_amount': bet_amount,
            'seed_used': seed_value,
            'fair_game': {
                'results': {
                    'total_profit': round(fair_results['total_profit'], 2),
                    'average_return': round(fair_results['average_return_per_play'], 4),
                    'win_rate': round(fair_results['win_rate'] * 100, 2),
                    'wins': fair_results['wins'],
                    'losses': fair_results['losses'],
                    'hits_distribution': fair_results['hits_distribution'],
                    'roi': fair_metrics['roi'],
                    'actual_house_edge': fair_metrics['actual_house_edge'],
                    'theoretical_vs_actual_deviation': fair_metrics['theoretical_vs_actual_deviation'],
                    'streaks': fair_metrics['streaks']
                },
                'theoretical': {
                    'expected_value': round(fair_ev['total_ev'], 4),
                    'house_edge': round(-fair_ev['total_ev'] * 100, 2)
                },
                'visualizations': fair_viz
            },
            'tweaked_game': {
                'results': {
                    'total_profit': round(tweaked_results['total_profit'], 2),
                    'average_return': round(tweaked_results['average_return_per_play'], 4),
                    'win_rate': round(tweaked_results['win_rate'] * 100, 2),
                    'wins': tweaked_results['wins'],
                    'losses': tweaked_results['losses'],
                    'hits_distribution': tweaked_results['hits_distribution'],
                    'roi': tweaked_metrics['roi'],
                    'actual_house_edge': tweaked_metrics['actual_house_edge'],
                    'theoretical_vs_actual_deviation': tweaked_metrics['theoretical_vs_actual_deviation'],
                    'streaks': tweaked_metrics['streaks']
                },
                'theoretical': {
                    'expected_value': round(tweaked_ev['total_ev'], 4),
                    'house_edge': round(-tweaked_ev['total_ev'] * 100, 2)
                },
                'visualizations': tweaked_viz
            },
            'comparison': {
                'profit_difference': round(profit_difference, 2),
                'win_rate_difference': round(win_rate_difference * 100, 2),
                'house_edge_difference': round(house_edge_difference, 2),
                'roi_difference': round(roi_difference, 2),
                'house_profit_increase': round(house_profit_increase, 2),
                'house_edge_increase_rate': round(house_edge_increase_rate, 2),
                'fair_better': profit_difference > 0
            },
            'timestamp': datetime.now().isoformat()
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def prepare_visualization_data(results, game_type, chosen_card):
    """Prepare data for charts and visualizations."""
    detailed = results.get('detailed_data', {})

    # Calculate ROI over time
    cumulative_profit = detailed.get('cumulative_profit', [])
    roi_over_time = []
    if cumulative_profit:
        for i, profit in enumerate(cumulative_profit):
            rounds = i + 1
            total_investment = rounds * drop_ball.bet
            roi = (profit / total_investment) * 100 if total_investment > 0 else 0
            roi_over_time.append(round(roi, 2))

    return {
        'cumulative_profit': detailed.get('cumulative_profit', []),
        'card_frequencies': detailed.get('card_frequencies', {}),
        'single_hit_cards': detailed.get('single_hit_cards', {}),
        'double_hit_cards': detailed.get('double_hit_cards', {}),
        'triple_hit_cards': detailed.get('triple_hit_cards', {}),
        'per_round_payouts': detailed.get('per_round_payouts', []),
        'hits_distribution': results['hits_distribution'],
        'roi_over_time': roi_over_time
    }

@app.route('/api/theoretical')
def get_theoretical():
    """Get theoretical calculations for both games."""
    fair_game = drop_ball.FairDropBall(drop_ball.cards)
    tweaked_game = drop_ball.TweakedDropBall(drop_ball.cards_with_joker)

    fair_ev = drop_ball.calculate_theoretical_ev(fair_game)
    tweaked_ev = drop_ball.calculate_theoretical_ev(tweaked_game)

    return jsonify({
        'fair': fair_ev,
        'tweaked': tweaked_ev
    })

@app.route('/api/cards')
def get_cards():
    """Get available cards for each game type."""
    return jsonify({
        'fair': drop_ball.cards,
        'tweaked': drop_ball.cards_with_joker
    })

@app.route('/results')
def results():
    """Results page displaying detailed simulation analysis and visualizations."""
    return render_template('results.html',
                         fair_color=FAIR_COLOR,
                         tweaked_color=TWEAKED_COLOR)

@app.route('/about')
def about():
    """About page with project context, methodology, and technology stack."""

    # Prepare methodology data
    methodology_steps = [
        {
            'title': 'Model Definition',
            'description': 'Defined two probabilistic models: Fair Game (equal 1/6 probability) and Tweaked Game (1/7 probability with Joker card)',
            'icon': '📊'
        },
        {
            'title': 'Monte Carlo Simulation',
            'description': 'Implemented Monte Carlo methods to simulate thousands of game rounds, collecting statistical data on outcomes',
            'icon': '🎲'
        },
        {
            'title': 'Exploratory Data Analysis',
            'description': 'Analyzed hit distributions, cumulative profits, card frequencies, and payout patterns',
            'icon': '🔍'
        },
        {
            'title': 'Statistical Analysis',
            'description': 'Calculated Expected Values (EV), house edge, win rates, and theoretical vs empirical comparisons',
            'icon': '📈'
        }
    ]

    # Technology stack
    tech_stack = {
        'backend': [
            {'name': 'Python 3.x', 'purpose': 'Core simulation logic'},
            {'name': 'Flask', 'purpose': 'Web framework'},
            {'name': 'NumPy', 'purpose': 'Numerical computations'},
            {'name': 'Pandas', 'purpose': 'Data analysis'}
        ],
        'frontend': [
            {'name': 'HTML5/CSS3', 'purpose': 'Structure and styling'},
            {'name': 'JavaScript (ES6+)', 'purpose': 'Interactive functionality'},
            {'name': 'Bootstrap', 'purpose': 'Responsive design'}
        ],
        'visualization': [
            {'name': 'Chart.js', 'purpose': 'Interactive charts'},
            {'name': 'Plotly', 'purpose': 'Advanced visualizations'},
            {'name': 'Matplotlib', 'purpose': 'Statistical plots'}
        ]
    }

    return render_template('about.html',
                         methodology_steps=methodology_steps,
                         tech_stack=tech_stack,
                         fair_color=FAIR_COLOR,
                         tweaked_color=TWEAKED_COLOR)

if __name__ == '__main__':
    # Local development only - not used in production WSGI deployment
    app.run(debug=False, host='127.0.0.1', port=5000)