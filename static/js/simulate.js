/**
 * Drop Ball Comparative Simulation - Interactive Frontend
 * Handles user input, API calls, and side-by-side visualization rendering
 */

const FAIR_COLOR = '#2E86AB';
const TWEAKED_COLOR = '#A23B72';

let profitChart, hitsChart, cardFreqChart;
let currentSimulationData = null; // Store current simulation data

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('runSimulationBtn').addEventListener('click', runSimulation);
    document.getElementById('useRandomSeed').addEventListener('change', toggleSeedInput);
    toggleSeedInput();
    
    // Add event listener for "View Detailed Results" button
    const viewResultsBtn = document.getElementById('viewDetailedResultsBtn');
    if (viewResultsBtn) {
        viewResultsBtn.addEventListener('click', navigateToResults);
    }
});

function toggleSeedInput() {
    const useRandomSeed = document.getElementById('useRandomSeed').checked;
    const seedInput = document.getElementById('seedValue');
    seedInput.disabled = !useRandomSeed;
    seedInput.style.opacity = useRandomSeed ? '1' : '0.5';
}

async function runSimulation() {
    const numRounds = parseInt(document.getElementById('numSimulations').value);
    const chosenCard = document.getElementById('chosenCard').value;
    const betAmount = parseFloat(document.getElementById('betAmount').value);
    const useRandomSeed = document.getElementById('useRandomSeed').checked;
    const seedValue = useRandomSeed ? parseInt(document.getElementById('seedValue').value) : null;
    
    if (isNaN(betAmount) || betAmount <= 0) {
        alert('Please enter a valid bet amount greater than 0');
        return;
    }
    
    if (useRandomSeed && (isNaN(seedValue) || seedValue < 0)) {
        alert('Please enter a valid seed value (positive integer)');
        return;
    }
    
    document.getElementById('runSimulationBtn').disabled = true;
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('initialMessage').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'none';
    
    try {
        const response = await fetch('/api/run_simulation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chosen_card: chosenCard,
                num_rounds: numRounds,
                bet_amount: betAmount,
                use_random_seed: useRandomSeed,
                seed_value: seedValue
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store data globally and in sessionStorage
            currentSimulationData = data;
            sessionStorage.setItem('dropBallSimulationData', JSON.stringify(data));
            console.log('✓ Simulation data stored successfully');
            
            displayResults(data);
        } else {
            alert('Error: ' + data.error);
        }
    } catch (error) {
        console.error('Simulation error:', error);
        alert('Network error: ' + error.message);
    } finally {
        document.getElementById('runSimulationBtn').disabled = false;
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

function displayResults(data) {
    document.getElementById('resultsContainer').style.display = 'block';

    const fair = data.fair_game;
    const tweaked = data.tweaked_game;
    const comp = data.comparison;

    // Comparison Summary
    const profitDiff = comp.profit_difference;
    const profitColor = profitDiff >= 0 ? '#28a745' : '#dc3545';
    document.getElementById('profitComparison').textContent = `$${Math.abs(profitDiff).toFixed(2)}`;
    document.getElementById('profitComparison').style.color = profitColor;

    document.getElementById('winRateComparison').textContent = `${Math.abs(comp.win_rate_difference).toFixed(2)}%`;
    document.getElementById('houseEdgeComparison').textContent = `${Math.abs(comp.house_edge_difference).toFixed(2)}%`;

    const betterGameText = comp.fair_better ? 'Fair Game' : 'Tweaked Game';
    const betterGameColor = comp.fair_better ? FAIR_COLOR : TWEAKED_COLOR;
    document.getElementById('betterGame').textContent = betterGameText;
    document.getElementById('betterGame').style.color = betterGameColor;

    // Fair Game Stats
    document.getElementById('fairProfit').textContent = `$${fair.results.total_profit.toFixed(2)}`;
    document.getElementById('fairProfit').style.color = fair.results.total_profit >= 0 ? '#28a745' : '#dc3545';
    document.getElementById('fairWinRate').textContent = `${fair.results.win_rate.toFixed(1)}%`;
    document.getElementById('fairAvgReturn').textContent = `$${fair.results.average_return.toFixed(4)}`;
    document.getElementById('fairHouseEdge').textContent = `${fair.theoretical.house_edge.toFixed(2)}%`;
    document.getElementById('fairWinLoss').textContent = `${fair.results.wins} / ${fair.results.losses}`;

    // Tweaked Game Stats
    document.getElementById('tweakedProfit').textContent = `$${tweaked.results.total_profit.toFixed(2)}`;
    document.getElementById('tweakedProfit').style.color = tweaked.results.total_profit >= 0 ? '#28a745' : '#dc3545';
    document.getElementById('tweakedWinRate').textContent = `${tweaked.results.win_rate.toFixed(1)}%`;
    document.getElementById('tweakedAvgReturn').textContent = `$${tweaked.results.average_return.toFixed(4)}`;
    document.getElementById('tweakedHouseEdge').textContent = `${tweaked.theoretical.house_edge.toFixed(2)}%`;
    document.getElementById('tweakedWinLoss').textContent = `${tweaked.results.wins} / ${tweaked.results.losses}`;
    
    // Show success notification
    showSuccessMessage();
}

function navigateToResults() {
    if (currentSimulationData) {
        // Ensure data is stored before navigation
        sessionStorage.setItem('dropBallSimulationData', JSON.stringify(currentSimulationData));
        console.log('✓ Data confirmed in sessionStorage, navigating to results...');
        window.location.href = '/results';
    } else {
        alert('No simulation data available. Please run a simulation first.');
    }
}

function showSuccessMessage() {
    const existingMsg = document.getElementById('successMessage');
    if (existingMsg) existingMsg.remove();
    
    const successMsg = document.createElement('div');
    successMsg.id = 'successMessage';
    successMsg.className = 'alert alert-success alert-dismissible fade show position-fixed';
    successMsg.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    successMsg.innerHTML = `
        <strong>✓ Simulation Complete!</strong>
        <p class="mb-0 mt-1">Results are ready. Click "View Detailed Results" below to see comprehensive analysis.</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        if (successMsg.parentNode) {
            successMsg.remove();
        }
    }, 5000);
}

function renderProfitChart(fairProfit, tweakedProfit) {
    const ctx = document.getElementById('profitChart').getContext('2d');
    if (profitChart) profitChart.destroy();
    
    const labels = Array.from({length: fairProfit.length}, (_, i) => i + 1);
    
    profitChart = new Chart(ctx, {
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
    const ctx = document.getElementById('hitsChart').getContext('2d');
    if (hitsChart) hitsChart.destroy();
    
    const labels = ['0 Hits', '1 Hit', '2 Hits', '3 Hits'];
    
    hitsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Fair Game',
                    data: [fairHits[0], fairHits[1], fairHits[2], fairHits[3]],
                    backgroundColor: FAIR_COLOR,
                    borderWidth: 1
                },
                {
                    label: 'Tweaked Game',
                    data: [tweakedHits[0], tweakedHits[1], tweakedHits[2], tweakedHits[3]],
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
    const ctx = document.getElementById('cardFreqChart').getContext('2d');
    if (cardFreqChart) cardFreqChart.destroy();
    
    const fairCards = Object.keys(fairFreq);
    const tweakedCards = Object.keys(tweakedFreq);
    
    // Use tweaked cards as labels (includes Joker)
    const labels = tweakedCards;
    
    // Fill in missing cards for fair game with 0
    const fairData = labels.map(card => fairFreq[card] || 0);
    const tweakedData = labels.map(card => tweakedFreq[card] || 0);
    
    cardFreqChart = new Chart(ctx, {
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
                            const percentage = ((context.parsed.y / total) * 100).toFixed(2);
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