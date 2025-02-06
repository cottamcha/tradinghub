import { createSignal, createMemo } from "solid-js";

function LabeledInput(props: any) {
  return (
    <div class="mb-4">
      <label for={props.id} class="block mb-1 text-sm font-medium text-gray-300">
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type || "text"}
        step={props.step}
        value={props.value()}
        onInput={(e) => {
            const parsed = parseFloat(e.target.value);
            props.onChange(isNaN(parsed) ? 0 : parsed);
          }}
        class="w-full border border-gray-600 bg-gray-800 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ease-in-out duration-200"
      />
    </div>
  );
}

function OutputField(props: any) {
  return (
    <p class="text-lg font-mono font-medium text-gray-300 my-2">
      {props.label}: <span class="font-semibold text-blue-400">{props.value.toFixed(2)}{props.lots && " lots"}</span>
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
    <div class="max-w-sm m-auto mb-10 p-10 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl border border-gray-700">
      <h1 class="text-3xl font-bold text-blue-400 mb-4 text-center">Position Calculator</h1>
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
      <h2 class="text-2xl font-semibold text-gray-300 mb-4 text-center">Calculation Results</h2>
      <OutputField label="Risk Amount (£)" value={calculations().riskAmt} />
      <OutputField label="Risk in USD" value={calculations().riskUSD} />
      <OutputField label="Value Per Pip (USD)" value={calculations().pipValue} />
      <OutputField label="Position Size" value={calculations().posSize} lots={true} />
    </div>
  );
}

export default PositionCalculator;
