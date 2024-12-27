function findMinExceedingBalance(userInput, numbers) {
    let minExceedingBalance = Infinity;
    let bestCombination = null;

    // Generate combinations with replacement
    function combinationsWithReplacement(numbers, maxItems) {
        const results = [];
        const generate = (combo, index) => {
            const total = combo.reduce((sum, num) => sum + num, 0);
            if (combo.length > maxItems || total > userInput + minExceedingBalance) return;

            results.push([...combo]);
            for (let i = index; i < numbers.length; i++) {
                combo.push(numbers[i]);
                generate(combo, i);
                combo.pop();
            }
        };
        generate([], 0);
        return results;
    }

    const combinations = combinationsWithReplacement(numbers, 20);

    combinations.forEach(combo => {
        const total = combo.reduce((sum, num) => sum + num, 0);
        const balance = total - userInput;

        if (balance >= 0 && balance < minExceedingBalance) {
            minExceedingBalance = balance;
            bestCombination = combo;
        }
    });

    return { combination: bestCombination, exceedingBalance: minExceedingBalance };
}

document.getElementById("calculator-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const userInput = parseInt(document.getElementById("target").value);
    const numbers = Array.from(document.querySelectorAll('.checkbox-group img.selected')).map(img => parseInt(img.dataset.value));
    const totalCostDiv = document.getElementById("total-cost");
    const balanceDiv = document.getElementById("balance");
    const cardsNeededDiv = document.querySelector(".count-text");

    // Clear previous results (total cost, balance, and card counts)
    totalCostDiv.textContent = "0";
    balanceDiv.textContent = "0";
    cardsNeededDiv.textContent = "0";

    if (numbers.length === 0) {
        cardsNeededDiv.textContent = "Please select at least one gift card.";
        return;
    }

    // Call the function to calculate the best combination
    const { combination, exceedingBalance } = findMinExceedingBalance(userInput, numbers);

    if (combination) {
        const countNumbers = combination.reduce((count, num) => {
            count[num] = (count[num] || 0) + 1;
            return count;
        }, {});

        // Update Total Cost and Balance containers
        totalCostDiv.textContent = `${combination.reduce((sum, num) => sum + num, 0)} Rs`;
        balanceDiv.textContent = `${exceedingBalance} Rs`;

        // Format the count of cards in the desired format
        const cardCounts = Object.entries(countNumbers)
    .map(([num, count]) => `${num} Rs :- ${count} E-Gift Card(s)`)
    .join("\n");

// Replace newline characters with <br> for HTML display
cardsNeededDiv.innerHTML = cardCounts.replace(/\n/g, "<br>");

    } else {
        cardsNeededDiv.textContent = "No valid cards needed.";
    }
});

// Toggle the selected class when an image is clicked
document.querySelectorAll('.checkbox-group img').forEach(img => {
    img.addEventListener('click', function () {
        img.classList.toggle('selected');
    });
});
