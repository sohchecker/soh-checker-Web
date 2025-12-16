// SoH Calculation Logic (from the SoH Checker App)
// Detailed calculation based on consumption trip data

// Debug helper
function showDebug(message) {
    const debugDiv = document.getElementById('debugOutput');
    if (debugDiv) {
        debugDiv.innerHTML += message + '<br>';
        debugDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showDebug('✓ JavaScript loaded successfully');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const deliveryCapacityInput = document.getElementById('deliveryCapacity');
    const tripDistanceInput = document.getElementById('tripDistance');
    const avgConsumptionInput = document.getElementById('avgConsumption');
    const socStartInput = document.getElementById('socStart');
    const socEndInput = document.getElementById('socEnd');
    const resultDiv = document.getElementById('result');
    const sohValueSpan = document.getElementById('sohValue');
    const statusTextDiv = document.getElementById('statusText');
    const currentCapacityDiv = document.getElementById('currentCapacity');

    showDebug('✓ All elements found');

    // Calculate button click handler
    calculateBtn.addEventListener('click', function() {
        showDebug('Button clicked!');
        calculateSoH();
    });
    
    showDebug('✓ Event listener attached');

    // Allow Enter key to trigger calculation
    [deliveryCapacityInput, tripDistanceInput, avgConsumptionInput, socStartInput, socEndInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateSoH();
            }
        });
    });

    function calculateSoH() {
        // Get input values
        const deliveryCapacity = parseFloat(deliveryCapacityInput.value);
        const tripDistance = parseFloat(tripDistanceInput.value);
        const avgConsumption = parseFloat(avgConsumptionInput.value);
        const socStart = parseFloat(socStartInput.value);
        const socEnd = parseFloat(socEndInput.value);

        // Validate inputs
        if (!deliveryCapacity || !tripDistance || !avgConsumption || !socStart || !socEnd) {
            alert('Bitte alle Felder ausfüllen');
            return;
        }

        if (deliveryCapacity <= 0) {
            alert('Auslieferungskapazität muss größer als 0 sein');
            return;
        }

        if (tripDistance <= 0) {
            alert('Fahrtlänge muss größer als 0 sein');
            return;
        }

        if (avgConsumption <= 0) {
            alert('Durchschnittsverbrauch muss größer als 0 sein');
            return;
        }

        if (socStart < 0 || socStart > 100 || socEnd < 0 || socEnd > 100) {
            alert('SoC-Werte müssen zwischen 0 und 100% liegen');
            return;
        }

        if (socStart <= socEnd) {
            alert('SoC Start muss größer sein als SoC Ende');
            return;
        }

        // Calculate SoC difference
        const socDifference = socStart - socEnd;

        // Warn if SoC difference is too small for accurate measurement
        if (socDifference < 20) {
            if (!confirm('Die SoC-Differenz ist kleiner als 20%. Dies kann zu ungenauen Ergebnissen führen. Trotzdem fortfahren?')) {
                return;
            }
        }

        // Step 1: Calculate consumed energy
        // Energy = Distance (km) × Consumption (kWh/100km) / 100
        const consumedEnergy = (tripDistance * avgConsumption) / 100;

        // Step 2: Calculate current capacity
        // Current Capacity = (Consumed Energy / SoC Difference) × 100
        const currentCapacity = (consumedEnergy / socDifference) * 100;

        // Step 3: Calculate SoH
        // SoH = (Current Capacity / Delivery Capacity) × 100
        const soh = (currentCapacity / deliveryCapacity) * 100;

        // Display result
        displayResult(soh, currentCapacity);
    }

    function displayResult(soh, currentCapacity) {
        // Round values
        const sohRounded = Math.round(soh * 10) / 10;
        const capacityRounded = Math.round(currentCapacity * 10) / 10;

        // Update current capacity display
        currentCapacityDiv.textContent = capacityRounded + ' kWh';

        // Update percentage display
        sohValueSpan.textContent = sohRounded + '%';

        // Determine status and color
        let statusText = '';
        let statusClass = '';

        if (soh >= 95) {
            statusText = 'Ausgezeichnet! 🌟';
            statusClass = 'status-excellent';
        } else if (soh >= 85) {
            statusText = 'Sehr gut ✓';
            statusClass = 'status-good';
        } else if (soh >= 75) {
            statusText = 'Akzeptabel ⚠️';
            statusClass = 'status-fair';
        } else {
            statusText = 'Prüfung empfohlen ⚠️';
            statusClass = 'status-poor';
        }

        // Apply color to percentage
        sohValueSpan.className = 'soh-percentage ' + statusClass;
        statusTextDiv.textContent = statusText;
        statusTextDiv.className = 'result-status ' + statusClass;

        // Show result with animation
        resultDiv.classList.remove('hidden');
        
        // Scroll to result on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        }

        // Track calculation (you can add analytics here later)
        trackCalculation(sohRounded, capacityRounded);
    }

    function trackCalculation(soh, capacity) {
        // Placeholder for analytics tracking
        // You can add Google Analytics or similar here
        console.log('SoH calculated:', soh, '%, Current capacity:', capacity, 'kWh');
    }

    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add some visual feedback on input focus
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.parentElement.style.transition = 'transform 0.2s';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.parentElement.style.transform = 'scale(1)';
        });
    });
});
