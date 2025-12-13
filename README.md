<div style="background-color: white; padding: 20px;">
 
<p align="center">
 <img height=200px src="./static/css/images/header.png" alt="Drop Ball Game Simulator">
</p>

<h2 align="center">Drop Ball Game Simulator - Modeling and Simulation Final Project</h2>

<div align="center">

[![Python version](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/release/python-3100/)
[![Flask version](https://img.shields.io/badge/flask-2.3.3-red.svg)](https://flask.palletsprojects.com/)
[![NumPy version](https://img.shields.io/badge/numpy-1.24.3-green.svg)](https://numpy.org/)
[![Pandas version](https://img.shields.io/badge/pandas-2.0.3-orange.svg)](https://pandas.pydata.org/)

<h4>This repository is intended for academic purposes only, specifically for the Modeling and Simulation course. This application provides a comprehensive Monte Carlo simulation of a traditional Filipino carnival game to demonstrate probability theory, expected value calculations, and statistical analysis.</h4>

</div>

-----------------------------------------

### Project Overview

* This application simulates the traditional Filipino "Drop Ball" game commonly found in "Perya" (carnival/fair) events. Using Monte Carlo simulation methods, the application demonstrates probability theory, expected value calculations, and house edge analysis through two game models: a **Fair Game** with equal probabilities and a **Tweaked Game** with a house advantage. The interactive web interface allows users to run thousands of simulations, visualize statistical outcomes, and compare theoretical predictions against empirical results.

### Project Author:
- **Herald Carl Avila** - [GitHub: Devcavi19](https://github.com/Devcavi19)

------------------------------------------
### Features

#### Fair Game Model

* **Equal Probability Distribution** - Each card (9, 10, J, Q, K, A) has an equal 1/6 chance of being selected
* **Zero House Edge** - Expected Value (EV) is approximately 0, making it a fair game
* **Pure Probability** - Demonstrates theoretical fairness in gambling scenarios
* **6 Cards Total** - Standard deck subset with no advantage to house

#### Tweaked Game Model

* **House Edge Mechanism** - Introduces a "Joker" card that creates a 1/7 probability distribution
* **Negative Expected Value** - EV ≈ -$0.29 per $1 bet, favoring the house
* **Realistic Casino Simulation** - Models real-world gambling scenarios where the house has an advantage
* **7 Cards Total** - Includes Joker as a "dead ball" that doesn't count as a hit

<br>

------------------------------------------

#### Monte Carlo Simulation Engine

* **Configurable Parameters** - Adjust number of rounds (1,000 to 100,000+), bet amount, selected card, and random seed
* **Reproducible Results** - Random seed control ensures identical results for verification and testing
* **Real-time Execution** - Simulations run instantly with comprehensive data tracking
* **Side-by-Side Comparison** - Run both Fair and Tweaked games simultaneously to compare outcomes
* **Detailed Tracking** - Records every round's outcome including hits, payouts, and running totals

<br>

------------------------------------------

#### Statistical Analysis Dashboard

* **Expected Value (EV) Calculations** - Compare theoretical EV against empirical results from simulations
* **House Edge Analysis** - Calculate and visualize the advantage the house holds in each game model
* **Win/Loss Tracking** - Monitor winning rounds, losing rounds, and overall win rate percentage
* **Return on Investment (ROI)** - Track cumulative ROI over thousands of rounds
* **Hit Distribution Analysis** - Visualize frequency of 0, 1, 2, and 3 hit outcomes (follows binomial distribution)
* **Card Frequency Distribution** - See which cards are selected most often across simulations
* **Streak Tracking** - Identify longest winning and losing streaks during simulation runs
* **Profit/Loss Charts** - Cumulative profit visualization showing convergence to expected value

<br>

------------------------------------------

#### Interactive Visualizations

* **Chart.js Integration** - Professional, interactive charts with hover tooltips and zoom capabilities
* **Cumulative Profit Charts** - Line graphs showing profit/loss progression over rounds
* **Hit Distribution Bar Charts** - Visual representation of 0, 1, 2, 3 hit frequencies
* **Card Frequency Heatmaps** - Color-coded visualization of card selection patterns
* **ROI Progression Graphs** - Track return on investment trends over time
* **Comparative Overlays** - Side-by-side visualization of Fair vs Tweaked game outcomes
* **Responsive Design** - Charts adapt to screen size for optimal viewing on any device

<br>

------------------------------------------

### Game Mechanics

#### Payout Structure

| Hits | Payout Multiplier | Example ($1 bet) |
|------|------------------|------------------|
| 0 hits | Lose bet (0x) | -$1.00 |
| 1 hit | 2x bet | +$2.00 ($1 profit) |
| 2 hits | 4x bet | +$4.00 ($3 profit) |
| 3 hits | 6x bet | +$6.00 ($5 profit) |

#### How It Works

1. **Player selects one card** from available options (9, 10, J, Q, K, A)
2. **Three balls drop sequentially** onto the card board
3. **Each ball lands on one card** according to the probability distribution
4. **Hits are counted** - Each ball that lands on the player's selected card counts as a "hit"
5. **Payout is determined** based on the number of hits (0, 1, 2, or 3)
6. **Simulation repeats** for the specified number of rounds

#### Probability Breakdown

**Fair Game:**
- Probability per ball: $P(\text{hit}) = \frac{1}{6} \approx 0.1667$
- Expected hits per round: $E[\text{hits}] = 3 \times \frac{1}{6} = 0.5$
- Expected Value: $EV \approx \$0.00$ (fair game)

**Tweaked Game (with Joker):**
- Probability per ball: $P(\text{hit}) = \frac{1}{7} \approx 0.1429$
- Expected hits per round: $E[\text{hits}] = 3 \times \frac{1}{7} \approx 0.429$
- Expected Value: $EV \approx -\$0.29$ (house advantage)

The number of hits follows a **binomial distribution**: $X \sim B(n=3, p)$ where $p = \frac{1}{6}$ (Fair) or $p = \frac{1}{7}$ (Tweaked).

------------------------------------------

### Implementation Details

This repository demonstrates advanced statistical modeling and web application development using Python and modern web technologies:

1. **Flask Framework** - Flask is a lightweight WSGI web application framework in Python. It provides the routing, templating, and server functionality for this application. The project uses Flask to serve HTML pages, handle API endpoints, and manage session data. - [Flask Documentation](https://flask.palletsprojects.com/)

2. **NumPy for Numerical Computing** - NumPy provides support for large, multi-dimensional arrays and matrices, along with mathematical functions. This project uses NumPy for probability distribution modeling, random number generation (with seed control), and efficient numerical calculations during Monte Carlo simulations. - [NumPy Documentation](https://numpy.org/doc/)

3. **Pandas for Data Analysis** - Pandas offers data structures and operations for manipulating numerical tables and time series. The application uses Pandas DataFrames to organize simulation results, calculate statistics, and prepare data for visualization. - [Pandas Documentation](https://pandas.pydata.org/docs/)

4. **Matplotlib & Seaborn** - These libraries provide statistical data visualization capabilities. While the web interface uses Chart.js, these libraries can generate additional analysis plots for research purposes. - [Matplotlib](https://matplotlib.org/) | [Seaborn](https://seaborn.pydata.org/)

5. **Bootstrap 5** - Bootstrap provides responsive design components and utilities. The application uses Bootstrap for layout grid system, navigation, cards, buttons, and mobile-responsive design. - [Bootstrap Documentation](https://getbootstrap.com/)

6. **Chart.js** - Chart.js is a JavaScript library for creating interactive charts. This project uses it to render cumulative profit charts, hit distribution bar charts, and comparative visualizations with smooth animations. - [Chart.js Documentation](https://www.chartjs.org/)

7. **Monte Carlo Methodology** - The simulation engine runs thousands of trials to approximate expected outcomes. By leveraging the Law of Large Numbers, empirical results converge to theoretical expected values as the number of simulations increases.

8. **Custom Algorithm Implementations** - Core game logic is implemented from scratch in `drop_ball.py` to demonstrate:
   - Binomial probability calculations for hit distributions
   - Expected value formulas for gambling scenarios
   - House edge computation and ROI tracking
   - Statistical convergence over large sample sizes

------------------------------------------

### Prerequisites

1. [Python 3.10+](https://www.python.org/downloads/)
2. pip package manager (included with Python)
3. Virtual environment (recommended)
4. Modern web browser (Chrome, Firefox, Safari, Edge)

------------------------------------------
### Installation

* **Step I: Clone the Repository**
```sh
$ git clone https://github.com/Devcavi19/csec413_FP.git
```

* **Step II: Navigate to the project directory**
```sh
$ cd csec413_FP
```

* **Step III: Create and activate a virtual environment** (recommended)
```sh
# Create virtual environment
$ python3 -m venv env

# Activate virtual environment
# On Linux/Mac:
$ source env/bin/activate

# On Windows:
$ env\Scripts\activate
```

* **Step IV: Install required packages**
```sh
$ pip install -r requirements.txt
```

* **Step V: Run the Flask application**
```sh
$ python app.py
```

* **Step VI: Open your browser**
```
Navigate to: http://localhost:5000
```

The application will be running on port 5000. You should see the home page with game overview and theoretical analysis.

------------------------------------------
### Usage

#### Running a Simulation

1. **Navigate to the "Simulate" page** from the navigation menu
2. **Configure simulation parameters:**
   - Number of rounds (1,000 - 100,000)
   - Bet amount per round (default: $1)
   - Selected card (9, 10, J, Q, K, or A)
   - Random seed for reproducibility (default: 42)
3. **Choose game type:**
   - Fair Game only
   - Tweaked Game only
   - Both games (side-by-side comparison)
4. **Click "Run Simulation"** button
5. **View results** on the Results page with detailed statistics and visualizations

#### Interpreting Results

- **Expected Value (EV):** Average profit/loss per round. Negative EV means house advantage.
- **House Edge:** Percentage advantage the house holds (higher = worse for player)
- **Win Rate:** Percentage of rounds where you won money (got 1, 2, or 3 hits)
- **ROI:** Return on investment - total profit divided by total amount wagered
- **Hit Distribution:** Should approximate binomial distribution with peaks at expected values
- **Cumulative Profit:** Should trend toward (EV × number of rounds) as simulations increase

------------------------------------------
### File Structure

```
csec413_FP/
├── app.py                      # Flask application entry point (routes, API endpoints)
├── drop_ball.py                # Core simulation engine and game logic classes
│                               # - FairDropBall: Fair game model (1/6 probability)
│                               # - TweakedDropBall: Tweaked game with Joker (1/7)
│                               # - run_simulation(): Monte Carlo simulation engine
│                               # - compare_games(): Side-by-side comparison runner
├── requirements.txt            # Python dependencies (Flask, NumPy, Pandas, etc.)
├── README.md                   # This file - comprehensive project documentation
├── templates/                  # Jinja2 HTML templates for Flask
│   ├── index.html              # Home page: game overview, payout structure, theory
│   ├── simulate.html           # Interactive simulation interface with parameters
│   ├── results.html            # Detailed results dashboard with charts
│   └── about.html              # Project information, methodology, tech stack
├── static/                     # Frontend assets (CSS, JavaScript, images)
│   ├── css/
│   │   ├── style.css           # Main stylesheet (827 lines) with custom animations
│   │   └── images/
│   │       └── header.png      # Project header image
│   └── js/
│       ├── main.js             # Core JavaScript utilities and helper functions
│       ├── simulate.js         # Simulation page logic and form handling
│       └── results.js          # Results page visualization with Chart.js
└── env/                        # Virtual environment (not included in git)
    └── lib/python3.10/site-packages/  # Installed Python packages
```

------------------------------------------
### Methodology

This project follows a systematic approach to statistical modeling and simulation:

#### 1. Model Definition
- **Fair Game Model:** Defined with equal probability distribution ($p = \frac{1}{6}$) across 6 cards
- **Tweaked Game Model:** Defined with Joker card creating unfavorable distribution ($p = \frac{1}{7}$)
- **Payout Structure:** Mathematically designed to create specific expected values
- **Theoretical Calculations:** Used probability theory to predict long-run outcomes

#### 2. Monte Carlo Simulation
- **Random Sampling:** Used NumPy's random number generator with controllable seed
- **Large Sample Sizes:** Ran thousands to hundreds of thousands of trials
- **Data Collection:** Tracked every outcome including hits, payouts, profits, streaks
- **Convergence Analysis:** Observed how empirical results approach theoretical values

#### 3. Statistical Analysis
- **Descriptive Statistics:** Calculated mean, median, standard deviation of outcomes
- **Expected Value:** Compared theoretical EV against empirical average payout
- **House Edge:** Quantified the percentage advantage in the Tweaked Game
- **Distribution Analysis:** Verified hit frequencies follow binomial distribution
- **Confidence Intervals:** Assessed variability and statistical significance

#### 4. Data Visualization
- **Time Series Charts:** Cumulative profit over rounds showing convergence
- **Distribution Plots:** Bar charts of hit frequencies and card selections
- **Comparative Analysis:** Side-by-side visualization of Fair vs Tweaked outcomes
- **Interactive Features:** Hover tooltips, zoom, responsive design for data exploration

#### 5. Web Application Development
- **Backend Development:** Flask routes, API endpoints, session management
- **Frontend Development:** HTML/CSS/JavaScript with Bootstrap and Chart.js
- **User Experience:** Intuitive interface with clear parameter controls and result interpretation
- **Performance Optimization:** Efficient algorithms to handle 100,000+ simulations smoothly

------------------------------------------
### Technology Stack

#### Backend Technologies
- **Python 3.10+** - Core programming language
- **Flask 2.3.3** - Web framework for routing and templating
- **NumPy 1.24.3** - Numerical computing and probability distributions
- **Pandas 2.0.3** - Data manipulation and analysis
- **Matplotlib 3.7.2** - Statistical plotting capabilities
- **Seaborn 0.12.2** - Advanced statistical visualizations

#### Frontend Technologies
- **HTML5/CSS3** - Modern web standards with semantic markup
- **JavaScript (ES6+)** - Client-side interactivity and dynamic content
- **Bootstrap 5.3.0** - Responsive design framework and UI components
- **Font Awesome 6.0.0** - Professional icon library
- **Chart.js** - Interactive data visualization library

#### Core Algorithms
- **Binomial Distribution** - Models the number of hits (successes) in 3 trials
- **Expected Value Calculation** - $EV = \sum_{i=0}^{3} P(i \text{ hits}) \times \text{Payout}(i)$
- **House Edge Formula** - $\text{House Edge} = -\frac{EV}{\text{Bet Amount}} \times 100\%$
- **Monte Carlo Sampling** - Repeated random sampling to approximate expected outcomes
- **Statistical Convergence** - Law of Large Numbers ensuring empirical mean → theoretical EV

------------------------------------------
### Educational Value

This project demonstrates key concepts in:

- **Probability Theory:** Binomial distributions, expected value, law of large numbers
- **Statistical Modeling:** Monte Carlo methods, sampling distributions, convergence
- **Gambling Mathematics:** House edge, ROI, risk analysis, long-run expectations
- **Data Analysis:** Descriptive statistics, visualization, interpretation
- **Software Engineering:** Web development, API design, user experience, code organization
- **Algorithm Design:** Simulation engines, random number generation, performance optimization

Students can use this application to:
- Visualize abstract probability concepts with concrete examples
- Understand why "the house always wins" in gambling scenarios
- Explore how sample size affects statistical accuracy
- Learn Monte Carlo simulation techniques applicable to many fields
- Develop full-stack web applications with modern technologies

------------------------------------------
### Technical Highlights

- **Performance:** Handles 100,000+ simulations with detailed tracking in seconds
- **Reproducibility:** Random seed control ensures identical results for verification
- **Scalability:** Efficient algorithms using NumPy vectorization where possible
- **User Experience:** Smooth animations, responsive design, intuitive interface
- **Code Quality:** Clean separation of concerns (game logic, routes, frontend)
- **Documentation:** Comprehensive code comments and docstrings throughout

------------------------------------------
### Future Enhancements

Potential improvements and extensions:

- **Additional Game Variants:** Implement other carnival games for comparison
- **Advanced Statistics:** Add confidence intervals, hypothesis testing, chi-square tests
- **Historical Tracking:** Save simulation results to database for long-term analysis
- **Multiplayer Mode:** Allow multiple users to compete in simulated games
- **Mobile App:** Native iOS/Android application with offline capabilities
- **Machine Learning:** Train models to predict optimal betting strategies
- **Export Features:** Download results as CSV, PDF reports, or JSON data

------------------------------------------
### License

This project is for academic purposes as part of a Modeling and Simulation course. All rights reserved.

------------------------------------------
### Acknowledgments

- **Course Instructor** - For guidance on Monte Carlo simulation methodology
- **Filipino Cultural Heritage** - The traditional "Drop Ball" game from Perya carnivals
- **Open Source Community** - Flask, NumPy, Pandas, and all other libraries used
- **Bootstrap & Chart.js Teams** - For excellent frontend frameworks

------------------------------------------
### Contact

**Herald Carl Avila**  
GitHub: [@Devcavi19](https://github.com/Devcavi19)  
Repository: [csec413_FP](https://github.com/Devcavi19/csec413_FP)

For questions, issues, or suggestions, please open an issue on the GitHub repository.

------------------------------------------
</div>
