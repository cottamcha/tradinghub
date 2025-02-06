import { createSignal, createMemo } from "solid-js";

function LabeledInput(props: any) {
  return (
    <div class="mb-4">
      <label for={props.id} class="block mb-1 text-sm font-medium text-gray-700">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type || "text"}
        step={props.step}
        value={props.value()}
        onInput={(e) => props.onChange(parseFloat(e.target.value))}
        class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function OutputField(props: any) {
  return (
    <p class="text-lg font-medium text-gray-800 my-2">
      {props.label}: <span class="font-semibold">{props.value.toFixed(2)}</span>
    </p>
  );
}

function PositionCalculator() {
  const [balance, setBalance] = createSignal(300);
  const [riskPercentage, setRiskPercentage] = createSignal(1);
  const [stopLossPips, setStopLossPips] = createSignal(5);
  const [gbpUsdExchangeRate, setGbpUsdExchangeRate] = createSignal(1.25);

  // Compute all calculations in one memo.
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
    <div class="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Position Calculator</h1>
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
      <hr class="my-6 border-gray-300" />
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Calculation Results</h2>
      <OutputField label="Risk Amount (£)" value={calculations().riskAmt} />
      <OutputField label="Risk in USD" value={calculations().riskUSD} />
      <OutputField label="Value Per Pip (USD)" value={calculations().pipValue} />
      <OutputField label="Position Size" value={calculations().posSize} />
    </div>
  );
}

export default PositionCalculator;
