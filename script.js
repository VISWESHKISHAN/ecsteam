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
    const resultDiv = document.getElementById("result");
    const totalCostDiv = document.getElementById("total-cost");
    const balanceDiv = document.getElementById("balance");

    // Clear previous results (total cost, balance, and counts)
    totalCostDiv.textContent = "0";
    balanceDiv.textContent = "0";

    // Clear any previously displayed counts below the images
    document.querySelectorAll('.checkbox-group img').forEach(img => {
        const countText = img.parentElement.querySelector('.count-text');
        if (countText) {
            countText.remove();
        }
    });

    // Call the function to calculate the best combination
    const { combination, exceedingBalance } = findMinExceedingBalance(userInput, numbers);

    if (combination) {
        const countNumbers = combination.reduce((count, num) => {
            count[num] = (count[num] || 0) + 1;
            return count;
        }, {});

        // Update Total Cost and Balance containers
        totalCostDiv.textContent = combination.reduce((sum, num) => sum + num, 0);
        balanceDiv.textContent = exceedingBalance;

        // Update the result below the respective numbers
        combination.forEach(num => {
            const img = document.querySelector(`.checkbox-group img[data-value='${num}']`);
            const count = countNumbers[num];
        
            // Add count next to the selected image (if not already added)
            let countText = img.parentElement.querySelector('.count-text');
            if (!countText) {
                countText = document.createElement('div');
                countText.classList.add('count-text');
                img.parentElement.appendChild(countText);
            }
            countText.textContent = `${count} E-Gift Card(s)`;
        });        

        resultDiv.innerHTML = `
            <div class="result">
                <h3>Results</h3>
                <p>Combination: ${combination.join(", ")}</p>
                <p>Exceeding Balance: ${exceedingBalance}</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = "<div class='result'><p>No combination found to exceed the target number.</p></div>";
    }
});

// Toggle the selected class when an image is clicked
document.querySelectorAll('.checkbox-group img').forEach(img => {
    img.addEventListener('click', function () {
        img.classList.toggle('selected');
    });
});
