window.onload = function() {
    // ADD EVENT ON ELEMENT(S)
    const addEventOnElem = function (elem, type, callback) {
        if (elem.length > 1) {
            for (let i = 0; i < elem.length; i++) {
                elem[i].addEventListener(type, callback);
            }
        } else {
            elem.addEventListener(type, callback);
        }
    };

    // CHANGE COLOR
    const changeColor = (value) => {
        // Sets the value of variable --third-color to another value   
        if (value == 0) {
            root.style.setProperty('--third-color', 'hsl(0, 0%, 0%)');
        } else if (value > 0) {
            root.style.setProperty('--third-color', 'hsl(120, 100%, 32%)');
        } else {
            root.style.setProperty('--third-color', 'hsl(0, 100%, 32%)');
        }
    }

    // RESETS ALL CALCULATED VALUES BACK TO ZERO
    const resetCalculatedValues = () => {
        // Resets the calculated stake & payouts for all bet
        for (div of [...stakeDivs, ...payoutDivs]) {
            div.innerText = '';
        }

        // Resets finalCalculation values
        payout.innerText = '₦‎0.00'
        profit.innerText = '₦‎0.00'
        roi.innerText = '0.00%'
    };

    const updateVariables = () => {
        // REUPDATES VARIABLES
        inputBoxes = document.querySelectorAll(".inputBox");
        stakeDivs = document.querySelectorAll(".stake");
        payoutDivs = document.querySelectorAll(".payout");

        addEventOnElem(inputBoxes, "input", calculateOdds);
        resetCalculatedValues();
    }
    
    const calculateOdds = () => {
        const oddValues = []
        const oddPercs = []
        for (box of inputBoxes) {
            let odd = (box.value == null || box.value == "") ? 0 : box.valueAsNumber;
            oddValues.push((isNaN(odd)) ? 0 : odd)
            oddPercs.push((isNaN(1 / odd)) ? 0 : (1 / odd));
        }
        
        const stakeValue = (stake.value == null || stake.value == "") ? 0 : stake.valueAsNumber;
        const arbPerc = oddPercs.reduce((a, b) => a + b, 0); // Arbitrage Percentage

        for (let i = 0; i < oddPercs.length; i++) {
            let value = (stakeValue * oddPercs[i]) / arbPerc; // Stake for each odd
            stakeDivs[i].innerText = (isNaN(value)) ? '0.00' : value.toFixed(2);
            let newVal = (value * oddValues[i]).toFixed(2);
            payoutDivs[i].innerText = (isNaN(newVal)) ? '0.00' : newVal;
        }

        // makes calculationsDiv empty if none value is inputted
        if (oddValues.every((value) => value == 0)) {
            for (let i = 0; i < oddValues.length; i++) {
                stakeDivs[i].innerText = '';
                payoutDivs[i].innerText = '';
            }
        }
        
        const totalPayout = (stakeValue / arbPerc).toFixed(2);
        const totalProfit = ((stakeValue / arbPerc) - stakeValue).toFixed(2);
        const totalROI = (totalProfit / stakeValue * 100).toFixed(2);

        payout.innerText = (isNaN(totalPayout)) ? '₦‎0.00' : '₦‎' + totalPayout;
        profit.innerText = (isNaN(totalProfit)) ? '₦‎0.00' : '₦‎' + totalProfit;
        roi.innerText = (isNaN(totalROI)) ? '0.00%' : totalROI + '%';

        changeColor(totalProfit);
    }


    const root = document.querySelector(':root'); //Get the root element
    const insertBeforeDiv = document.querySelector('.insertBefore');
    var fieldCount = 2; // keeps track of input box added
    
    var inputBoxes = document.querySelectorAll(".inputBox");
    var stakeDivs = document.querySelectorAll(".stake");
    var payoutDivs = document.querySelectorAll(".payout");
    const stake = document.getElementById("stake-input");
    
    // const calcValues = document.querySelectorAll(".calculatedValue");
    let payout = document.getElementById("totalPayout");
    let profit = document.getElementById("totalProfit");
    let roi = document.getElementById("roi");
    
    addEventOnElem([...inputBoxes, stake], "input", calculateOdds);

  //   odd1.oninput = function() {
  //   odd2.value = 100
  // };

    const resetBtn = document.getElementById("resetBtn");
    addEventOnElem(resetBtn, 'click', () => {
        // Resets all input boxes
        for (box of [...inputBoxes, stake]) {
            box.value = '';
        }

        resetCalculatedValues();

        // Resets the calculated values color
        changeColor(0);

        // Removes the added input boxes
        nodes = Array.prototype.slice.call(inputBoxes , 2); 
        nodes.forEach((node) => {
            let count = 0;
            while ( count < 3 ) {
                node = node.parentNode;
                count++
             }
            node.parentNode.removeChild(node);
        });

        fieldCount = 2; // sets it back to zero

        updateVariables();
    })


    // ADDS MORE INPUT BOX
    const moreBetBtn = document.getElementById("moreBetBtn");
    
    addEventOnElem(moreBetBtn, 'click', () => {
        const count = inputBoxes.length; // initlal input box count
        console.log('count', count);
        
        if (count < 4) {
            fieldCount++; // increments input box count

            const newDiv = `<div>
                    <div class="singleBet">
                        <div class="betInput">
                            <div class="betInputInner">
                                <p>Bet ${fieldCount}</p>
                                <input type="number" class="inputBox" placeholder="Please Enter Bet ${fieldCount} Odds" />
                            </div>
                        </div>
                        <div class="calculationsDiv">
                            <p>Bet ${fieldCount} stake:</p>
                            <p class="calculatedValue stake"></p>
                        </div>
                        <div class="calculationsDiv">
                            <p>Bet ${fieldCount} payout:</p>
                            <p class="calculatedValue colorChange payout"></p>
                        </div>
                    </div>
                </div>`
            insertBeforeDiv.insertAdjacentHTML('beforebegin', newDiv);
        };

        updateVariables();
        // Resets the calculated values color
        changeColor(0);
    });
}