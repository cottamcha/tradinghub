import { createSignal, createMemo } from "solid-js";

function LabeledInput(props: any) {
  return (
    <div class="mb-4">
      <label for={props.id} class="block text-lg font-medium text-white">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type || "text"}
        step={props.step}
        value={props.value()}
        onInput={(e) => props.onChange(parseFloat(e.target.value))}
        class="mt-2 w-full rounded-md border border-gray-300 bg-white bg-opacity-90 py-2 px-3 text-gray-900 shadow focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

function OutputField(props: any) {
  return (
    <p class="text-lg text-white my-2">
      <span class="font-semibold">{props.label}:</span> {props.value.toFixed(2)}
    </p>
  );
}

function PositionCalculator() {
  const [balance, setBalance] = createSignal(2500);
  const [riskPercentage, setRiskPercentage] = createSignal(1);
  const [stopLossPips, setStopLossPips] = createSignal(5);
  const [gbpUsdExchangeRate, setGbpUsdExchangeRate] = createSignal(1.25);

  const calculations = createMemo(() => {
    const bal = balance();
    const riskFrac = riskPercentage() / 100;
    const riskAmt = bal * riskFrac;
    const riskUSD = riskAmt * gbpUsdExchangeRate();
    const pipValue = riskUSD / stopLossPips();
    const posSize = pipValue / 10;
    return { riskAmt, riskUSD, pipValue, posSize };
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 p-4">
      {/* Wrap the card in a container with perspective for a subtle 3D effect */}
      <div style={{ perspective: "1000px" }}>
        <div class="w-full max-w-lg p-8 bg-black bg-opacity-80 rounded-lg shadow-2xl transform transition duration-700 hover:scale-105">
          <h1 class="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-300">
            Position Calculator
          </h1>
          <form>
            <LabeledInput
              id="balance"
              label="Balance (£)"
              value={balance}
              onChange={setBalance}
            />
            <LabeledInput
              id="riskPercentage"
              label="Risk (%)"
              step="0.01"
              value={riskPercentage}
              onChange={setRiskPercentage}
            />
            <LabeledInput
              id="stopLossPips"
              label="Stop Loss (pips)"
              value={stopLossPips}
              onChange={setStopLossPips}
            />
            <LabeledInput
              id="gbpUsdExchangeRate"
              label="GBP/USD Exchange Rate"
              step="0.01"
              value={gbpUsdExchangeRate}
              onChange={setGbpUsdExchangeRate}
            />
          </form>
          <hr class="my-6 border-gray-600" />
          <h2 class="text-2xl font-semibold mb-4 text-white">
            Calculation Results
          </h2>
          <OutputField label="Risk Amount (£)" value={calculations().riskAmt} />
          <OutputField label="Risk in USD" value={calculations().riskUSD} />
          <OutputField label="Value Per Pip (USD)" value={calculations().pipValue} />
          <OutputField label="Position Size" value={calculations().posSize} />
        </div>
      </div>
    </div>
  );
}

export default PositionCalculator;
