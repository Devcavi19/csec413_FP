/**
 * Drop Ball Results Page - Detailed Analysis Frontend
 * Loads simulation data and displays comprehensive results analysis
 */

const FAIR_COLOR = '#2E86AB';
const TWEAKED_COLOR = '#A23B72';

let profitChart, roiChart, houseEdgeChart, hitsChart, singleBallChart, doubleBallChart, tripleBallChart, cardFreqChart;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Results page loaded, checking for simulation data...');
    loadResultsData();

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});

function loadResultsData() {
    const loadingState = document.getElementById('loadingState');
    const noDataState = document.getElementById('noDataState');
    const resultsContent = document.getElementById('resultsContent');

    loadingState.style.display = 'block';
    noDataState.style.display = 'none';
    resultsContent.style.display = 'none';

    // Load data from sessionStorage
    const simulationData = sessionStorage.getItem('dropBallSimulationData');

    console.log('SessionStorage check:', simulationData ? '✓ Data found' : '✗ No data');

    if (!simulationData) {
        console.warn('No simulation data found in sessionStorage');
        loadingState.style.display = 'none';
        noDataState.style.display = 'block';
        return;
    }

    try {
        const data = JSON.parse(simulationData);
        console.log('✓ Successfully parsed simulation data:', data);
        
        // Validate data structure
        if (!data.fair_game || !data.tweaked_game || !data.comparison) {
            throw new Error('Invalid data structure: missing required game data');
        }
        
        // Validate nested results
        if (!data.fair_game.results || !data.tweaked_game.results) {
            throw new Error('Invalid data structure: missing results data');
        }
        
        displayResults(data);
        loadingState.style.display = 'none';
        resultsContent.style.display = 'block';
        console.log('✓ Results displayed successfully');
        console.log('Data loaded and displayResults called with data:', data);
    } catch (error) {
        console.error('Error parsing simulation data:', error);
        loadingState.style.display = 'none';
        noDataState.style.display = 'block';
        
        // Show detailed error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger mt-3 mx-3';
        errorDiv.innerHTML = `
            <strong>❌ Error loading results:</strong> ${error.message}
            <br><small class="mt-2 d-block">Data structure: ${JSON.stringify(data, null, 2).substring(0, 200)}...</small>
            <br><small>Please try running the simulation again from the <a href="/simulate">Simulate page</a>.</small>
        `;
        noDataState.appendChild(errorDiv);
    }
}

function displayResults(data) {
    console.log('Displaying results for:', data.num_rounds, 'rounds');
    
    try {
        // 1. Simulation Parameters
        populateParameters(data);

        // 2. Game Results
        populateGameResults(data);

        // 3. Impact Analysis
        populateImpactAnalysis(data);

        // 4. Key Insights
        generateInsights(data);

        // 5. Visualizations
        renderCharts(data);
    } catch (error) {
        console.error('Error displaying results:', error);
        alert('Error displaying results: ' + error.message);
    }
}

function populateParameters(data) {
    const safeSet = (id, value, fallback = '-') => {
        const elem = document.getElementById(id);
        if (elem) elem.textContent = value !== undefined && value !== null ? value : fallback;
    };

    safeSet('paramRounds', data.num_rounds ? data.num_rounds.toLocaleString() : '-');
    safeSet('paramCard', data.chosen_card || '-');
    safeSet('paramBetAmount', data.bet_amount ? `$${data.bet_amount.toFixed(2)}` : '$-');
    safeSet('paramSeed', data.seed_used !== null && data.seed_used !== undefined ? data.seed_used : 'Random');
}

function populateGameResults(data) {
    const fair = data.fair_game;
    const tweaked = data.tweaked_game;

    // Helper function to safely get nested values
    const safeGet = (obj, path, fallback = 0) => {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            value = value?.[key];
            if (value === undefined) return fallback;
        }
        return value;
    };

    // Helper to safely set element with color
    const safeSetWithColor = (id, value, colorCondition) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.textContent = value;
            if (colorCondition !== undefined) {
                elem.style.color = colorCondition ? '#28a745' : '#dc3545';
            }
        }
    };

    // Fair Game Results
    const fairWinRate = safeGet(fair, 'results.win_rate', 0);
    const fairTotalProfit = safeGet(fair, 'results.total_profit', 0);
    const fairAvgReturn = safeGet(fair, 'results.average_return', 0);
    const fairROI = safeGet(fair, 'results.roi', 0);
    const fairActualHouseEdge = safeGet(fair, 'results.actual_house_edge', 0);
    const fairTheoreticalHouseEdge = safeGet(fair, 'theoretical.house_edge', 0);

    safeSetWithColor('fairWinRate', `${fairWinRate.toFixed(1)}%`);
    safeSetWithColor('fairTotalProfit', `$${fairTotalProfit.toFixed(2)}`, fairTotalProfit >= 0);
    safeSetWithColor('fairAvgProfit', `$${fairAvgReturn.toFixed(4)}`);
    safeSetWithColor('fairROI', `${fairROI.toFixed(2)}%`);
    safeSetWithColor('fairActualHouseEdge', `${fairActualHouseEdge.toFixed(2)}%`);
    safeSetWithColor('fairTheoreticalHouseEdge', `${fairTheoreticalHouseEdge.toFixed(2)}%`);

    // Tweaked Game Results
    const tweakedWinRate = safeGet(tweaked, 'results.win_rate', 0);
    const tweakedTotalProfit = safeGet(tweaked, 'results.total_profit', 0);
    const tweakedAvgReturn = safeGet(tweaked, 'results.average_return', 0);
    const tweakedROI = safeGet(tweaked, 'results.roi', 0);
    const tweakedActualHouseEdge = safeGet(tweaked, 'results.actual_house_edge', 0);
    const tweakedTheoreticalHouseEdge = safeGet(tweaked, 'theoretical.house_edge', 0);

    safeSetWithColor('tweakedWinRate', `${tweakedWinRate.toFixed(1)}%`);
    safeSetWithColor('tweakedTotalProfit', `$${tweakedTotalProfit.toFixed(2)}`, tweakedTotalProfit >= 0);
    safeSetWithColor('tweakedAvgProfit', `$${tweakedAvgReturn.toFixed(4)}`);
    safeSetWithColor('tweakedROI', `${tweakedROI.toFixed(2)}%`);
    safeSetWithColor('tweakedActualHouseEdge', `${tweakedActualHouseEdge.toFixed(2)}%`);
    safeSetWithColor('tweakedTheoreticalHouseEdge', `${tweakedTheoreticalHouseEdge.toFixed(2)}%`);
}

function populateImpactAnalysis(data) {
    const comp = data.comparison || {};
    console.log('Populating impact analysis with comparison data:', comp);

    const safeSetDiff = (id, value, className) => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.textContent = value;
            elem.className = `comparison-difference ${className}`;
        }
    };

    // Win Rate Difference (Fair - Tweaked)
    const winRateDiff = comp.win_rate_difference || 0;
    safeSetDiff('winRateDiff', 
        `${winRateDiff.toFixed(2)}%`,
        winRateDiff >= 0 ? 'positive-difference' : 'negative-difference'
    );

    // ROI Difference (Fair - Tweaked)
    const roiDiff = comp.roi_difference || 0;
    safeSetDiff('roiDiff',
        `${roiDiff >= 0 ? '+' : ''}${roiDiff.toFixed(2)}%`,
        roiDiff >= 0 ? 'positive-difference' : 'negative-difference'
    );

    // House Edge Increase (Tweaked - Fair)
    const houseEdgeIncrease = comp.house_edge_increase_rate || 0;
    safeSetDiff('houseEdgeIncrease',
        `${Math.abs(houseEdgeIncrease).toFixed(2)}%`,
        'negative-difference'
    );

    // House Profit Increase (Tweaked - Fair)
    const houseProfitIncrease = comp.house_profit_increase || 0;
    safeSetDiff('houseProfitIncrease',
        `${houseProfitIncrease >= 0 ? '+' : ''}$${Math.abs(houseProfitIncrease).toFixed(2)}`,
        houseProfitIncrease >= 0 ? 'negative-difference' : 'positive-difference'
    );
}

function generateInsights(data) {
    const fair = data.fair_game;
    const tweaked = data.tweaked_game;
    const comp = data.comparison;

    let insights = [];

    try {
        const fairWinRate = fair.results.win_rate || 0;
        const tweakedWinRate = tweaked.results.win_rate || 0;
        const winRateDiff = comp.win_rate_difference || 0;

        // Win rate analysis
        if (winRateDiff > 2) {
            insights.push(`The Fair Game shows a significantly higher win rate (${fairWinRate.toFixed(1)}% vs ${tweakedWinRate.toFixed(1)}%), indicating the Joker card substantially reduces player winning chances.`);
        } else if (winRateDiff < -2) {
            insights.push(`Surprisingly, the Tweaked Game shows a higher win rate, suggesting the Joker card may benefit players in some scenarios.`);
        } else {
            insights.push(`Win rates are relatively similar between games (${fairWinRate.toFixed(1)}% vs ${tweakedWinRate.toFixed(1)}%), showing minimal impact from the Joker card.`);
        }

        // ROI analysis
        const fairROI = fair.results.roi || 0;
        const tweakedROI = tweaked.results.roi || 0;
        const roiDiff = comp.roi_difference || 0;

        if (roiDiff > 5) {
            insights.push(`Tweaked Game provides much better ROI (${tweakedROI.toFixed(2)}% vs ${fairROI.toFixed(2)}%), making it significantly more profitable for players.`);
        } else if (roiDiff < -5) {
            insights.push(`Fair Game provides much better ROI (${fairROI.toFixed(2)}% vs ${tweakedROI.toFixed(2)}%), making it significantly more profitable for players.`);
        }

        // House edge analysis
        const houseEdgeIncrease = comp.house_edge_increase_rate || 0;
        if (houseEdgeIncrease > 10) {
            insights.push(`The Joker card dramatically increases the house edge by ${houseEdgeIncrease.toFixed(2)}%, making the Tweaked Game much more profitable for the casino.`);
        } else if (houseEdgeIncrease > 5) {
            insights.push(`The Joker card moderately increases casino profitability with a ${houseEdgeIncrease.toFixed(2)}% higher house edge.`);
        }

        // Profit analysis
        const totalHouseProfitIncrease = comp.house_profit_increase || 0;
        if (Math.abs(totalHouseProfitIncrease) > data.bet_amount * data.num_rounds * 0.1) {
            if (totalHouseProfitIncrease > 0) {
                insights.push(`The casino profits significantly more from the Tweaked Game ($${totalHouseProfitIncrease.toFixed(2)} additional profit), demonstrating the effectiveness of the Joker card strategy.`);
            } else {
                insights.push(`Unexpectedly, the Fair Game resulted in more house profit ($${Math.abs(totalHouseProfitIncrease).toFixed(2)} difference), possibly due to statistical variance.`);
            }
        }

        // Theoretical vs Actual comparison
        const fairDeviation = Math.abs(fair.results.theoretical_vs_actual_deviation || 0);
        const tweakedDeviation = Math.abs(tweaked.results.theoretical_vs_actual_deviation || 0);

        if (fairDeviation > 20 || tweakedDeviation > 20) {
            insights.push(`Large deviations between theoretical predictions and actual results (${fairDeviation.toFixed(1)}% for Fair, ${tweakedDeviation.toFixed(1)}% for Tweaked) suggest the simulation may need more rounds for convergence.`);
        } else {
            insights.push(`Theoretical predictions closely match actual results, validating the mathematical model (${fairDeviation.toFixed(1)}% deviation for Fair, ${tweakedDeviation.toFixed(1)}% for Tweaked).`);
        }

        // Streaks analysis
        if (fair.results.streaks && tweaked.results.streaks) {
            const fairStreaks = fair.results.streaks;
            const tweakedStreaks = tweaked.results.streaks;

            if (fairStreaks.max_loss_streak > 10 || tweakedStreaks.max_loss_streak > 10) {
                insights.push(`Long losing streaks observed (up to ${Math.max(fairStreaks.max_loss_streak, tweakedStreaks.max_loss_streak)} rounds), highlighting the high variance nature of this gambling game.`);
            }
        }

        // If no insights generated, add a default one
        if (insights.length === 0) {
            insights.push('Both games performed as expected based on their theoretical models.');
        }

    } catch (error) {
        console.error('Error generating insights:', error);
        insights = ['Error generating detailed insights. Please review the raw data above.'];
    }

    // Generate HTML
    const insightsHtml = insights.map(insight => `<p class="mb-2">• ${insight}</p>`).join('');
    const insightsElem = document.getElementById('insightsContent');
    if (insightsElem) {
        insightsElem.innerHTML = insightsHtml;
    }
}

function renderCharts(data) {
    try {
        const fair = data.fair_game;
        const tweaked = data.tweaked_game;

        // Safely get visualization data
        const fairViz = fair.visualizations || {};
        const tweakedViz = tweaked.visualizations || {};

        const fairProfit = fairViz.cumulative_profit || [];
        const tweakedProfit = tweakedViz.cumulative_profit || [];

        const fairRoi = fairViz.roi_over_time || [];
        const tweakedRoi = tweakedViz.roi_over_time || [];

        const fairHits = fair.results?.hits_distribution || [0, 0, 0, 0];
        const tweakedHits = tweaked.results?.hits_distribution || [0, 0, 0, 0];

        const fairFreq = fairViz.card_frequencies || {};
        const tweakedFreq = tweakedViz.card_frequencies || {};

        const fairSingle = fairViz.single_hit_cards || {};
        const tweakedSingle = tweakedViz.single_hit_cards || {};

        const fairDouble = fairViz.double_hit_cards || {};
        const tweakedDouble = tweakedViz.double_hit_cards || {};

        const fairTriple = fairViz.triple_hit_cards || {};
        const tweakedTriple = tweakedViz.triple_hit_cards || {};

        const fairTheoreticalHE = fair.theoretical?.house_edge || 0;
        const tweakedTheoreticalHE = tweaked.theoretical?.house_edge || 0;
        const fairActualHE = fair.results?.actual_house_edge || 0;
        const tweakedActualHE = tweaked.results?.actual_house_edge || 0;

        renderProfitChart(fairProfit, tweakedProfit);
        renderRoiChart(fairRoi, tweakedRoi);
        renderHouseEdgeChart(fairTheoreticalHE, tweakedTheoreticalHE, fairActualHE, tweakedActualHE);
        renderHitsChart(fairHits, tweakedHits);
        renderSingleBallChart(fairSingle, tweakedSingle, data.chosen_card);
        renderDoubleBallChart(fairDouble, tweakedDouble, data.chosen_card);
        renderTripleBallChart(fairTriple, tweakedTriple, data.chosen_card);
        renderCardFreqChart(fairFreq, tweakedFreq, data.chosen_card);
    } catch (error) {
        console.error('Error rendering charts:', error);
        alert('Error rendering charts: ' + error.message);
    }
}

function renderProfitChart(fairProfit, tweakedProfit) {
    const ctx = document.getElementById('profitChart');
    if (!ctx) return;
    
    if (profitChart) profitChart.destroy();

    const maxLength = Math.max(fairProfit.length, tweakedProfit.length);
    const labels = Array.from({length: maxLength}, (_, i) => i + 1);

    profitChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: fairProfit,
                    borderColor: FAIR_COLOR,
                    backgroundColor: 'rgba(46, 134, 171, 0.1)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Tweaked Game',
                    data: tweakedProfit,
                    borderColor: TWEAKED_COLOR,
                    backgroundColor: 'rgba(162, 59, 114, 0.1)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { title: { display: true, text: 'Round Number' }, ticks: { maxTicksLimit: 10 } },
                y: { title: { display: true, text: 'Cumulative Profit ($)' }, beginAtZero: false }
            }
        }
    });
}

function renderHitsChart(fairHits, tweakedHits) {
    const ctx = document.getElementById('hitsChart');
    if (!ctx) return;
    
    if (hitsChart) hitsChart.destroy();

    const labels = ['0 Hits', '1 Hit', '2 Hits', '3 Hits'];

    hitsChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: [fairHits[0] || 0, fairHits[1] || 0, fairHits[2] || 0, fairHits[3] || 0],
                    backgroundColor: FAIR_COLOR,
                    borderWidth: 1
                },
                {
                    label: 'Tweaked Game',
                    data: [tweakedHits[0] || 0, tweakedHits[1] || 0, tweakedHits[2] || 0, tweakedHits[3] || 0],
                    backgroundColor: TWEAKED_COLOR,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frequency' } }
            }
        }
    });
}

function renderCardFreqChart(fairFreq, tweakedFreq, chosenCard) {
    const ctx = document.getElementById('cardFreqChart');
    if (!ctx) return;
    
    if (cardFreqChart) cardFreqChart.destroy();

    // Get all unique cards from both games
    const allCards = [...new Set([...Object.keys(fairFreq), ...Object.keys(tweakedFreq)])];
    const labels = allCards.sort();

    // Fill in missing cards with 0
    const fairData = labels.map(card => fairFreq[card] || 0);
    const tweakedData = labels.map(card => tweakedFreq[card] || 0);

    cardFreqChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: fairData,
                    backgroundColor: FAIR_COLOR,
                    borderWidth: 1
                },
                {
                    label: 'Tweaked Game',
                    data: tweakedData,
                    backgroundColor: TWEAKED_COLOR,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed.y / total) * 100).toFixed(2) : '0.00';
                            return `${context.dataset.label}: ${context.parsed.y} (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
                x: { title: { display: true, text: 'Card' } }
            }
        }
    });
}

function renderRoiChart(fairRoi, tweakedRoi) {
    const ctx = document.getElementById('roiChart');
    if (!ctx) return;
    
    if (roiChart) roiChart.destroy();

    const maxLength = Math.max(fairRoi.length, tweakedRoi.length);
    const labels = Array.from({length: maxLength}, (_, i) => i + 1);

    roiChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: fairRoi,
                    borderColor: FAIR_COLOR,
                    backgroundColor: 'rgba(46, 134, 171, 0.1)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Tweaked Game',
                    data: tweakedRoi,
                    borderColor: TWEAKED_COLOR,
                    backgroundColor: 'rgba(162, 59, 114, 0.1)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: { mode: 'index', intersect: false }
            },
            scales: {
                x: { title: { display: true, text: 'Round Number' }, ticks: { maxTicksLimit: 10 } },
                y: { title: { display: true, text: 'ROI (%)' }, beginAtZero: false }
            }
        }
    });
}

function renderHouseEdgeChart(fairTheoretical, tweakedTheoretical, fairActual, tweakedActual) {
    const ctx = document.getElementById('houseEdgeChart');
    if (!ctx) return;
    
    if (houseEdgeChart) houseEdgeChart.destroy();

    const labels = ['Fair Game', 'Tweaked Game'];

    houseEdgeChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Theoretical House Edge',
                    data: [fairTheoretical, tweakedTheoretical],
                    backgroundColor: ['lightblue', 'lightcoral'],
                    borderColor: ['#2E86AB', '#A23B72'],
                    borderWidth: 2
                },
                {
                    label: 'Actual House Edge',
                    data: [fairActual, tweakedActual],
                    backgroundColor: [FAIR_COLOR, TWEAKED_COLOR],
                    borderColor: ['#1a5a73', '#7a2a4a'],
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                        }
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: 'House Edge (%)' },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

function renderSingleBallChart(fairSingle, tweakedSingle, chosenCard) {
    const ctx = document.getElementById('singleBallChart');
    if (!ctx) return;
    
    if (singleBallChart) singleBallChart.destroy();

    // Get all unique cards from both games
    const allCards = [...new Set([...Object.keys(fairSingle), ...Object.keys(tweakedSingle)])];
    const labels = allCards.sort();

    // Fill in missing cards with 0
    const fairData = labels.map(card => fairSingle[card] || 0);
    const tweakedData = labels.map(card => tweakedSingle[card] || 0);

    singleBallChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: fairData,
                    backgroundColor: FAIR_COLOR,
                    borderWidth: 1
                },
                {
                    label: 'Tweaked Game',
                    data: tweakedData,
                    backgroundColor: TWEAKED_COLOR,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} rounds`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
                x: { title: { display: true, text: 'Card' } }
            }
        }
    });
}

function renderDoubleBallChart(fairDouble, tweakedDouble, chosenCard) {
    const ctx = document.getElementById('doubleBallChart');
    if (!ctx) return;
    
    if (doubleBallChart) doubleBallChart.destroy();

    // Get all unique cards from both games
    const allCards = [...new Set([...Object.keys(fairDouble), ...Object.keys(tweakedDouble)])];
    const labels = allCards.sort();

    // Fill in missing cards with 0
    const fairData = labels.map(card => fairDouble[card] || 0);
    const tweakedData = labels.map(card => tweakedDouble[card] || 0);

    doubleBallChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: fairData,
                    backgroundColor: FAIR_COLOR,
                    borderWidth: 1
                },
                {
                    label: 'Tweaked Game',
                    data: tweakedData,
                    backgroundColor: TWEAKED_COLOR,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} rounds`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
                x: { title: { display: true, text: 'Card' } }
            }
        }
    });
}

function renderTripleBallChart(fairTriple, tweakedTriple, chosenCard) {
    const ctx = document.getElementById('tripleBallChart');
    if (!ctx) return;
    
    if (tripleBallChart) tripleBallChart.destroy();

    // Get all unique cards from both games
    const allCards = [...new Set([...Object.keys(fairTriple), ...Object.keys(tweakedTriple)])];
    const labels = allCards.sort();

    // Fill in missing cards with 0
    const fairData = labels.map(card => fairTriple[card] || 0);
    const tweakedData = labels.map(card => tweakedTriple[card] || 0);

    tripleBallChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: fairData,
                    backgroundColor: FAIR_COLOR,
                    borderWidth: 1
                },
                {
                    label: 'Tweaked Game',
                    data: tweakedData,
                    backgroundColor: TWEAKED_COLOR,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: true, position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y} rounds`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Frequency' } },
                x: { title: { display: true, text: 'Card' } }
            }
        }
    });
}