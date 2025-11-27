import { ethers } from "ethers";

// =====================
// CONFIG (from GitHub secrets)
// =====================
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const REGISTRY = process.env.REGISTRY_ADDRESS;

// =====================
// ABI (only what we need)
// =====================
const registryABI = [
  "function checker() external view returns (bool, bytes)",
  "function executeBatch(address[] calldata list, uint256 nextIndex) external"
];

// =====================
// MAIN LOGIC
// =====================
async function main() {
  console.log("=== Running Lisk Vault Automation ===");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const registry = new ethers.Contract(REGISTRY, registryABI, wallet);

  // ---- Step 1: call checker() ----
  const [canExec, payload] = await registry.checker();

  if (!canExec) {
    console.log("No vaults to process.");
    return;
  }

  // ---- Step 2: decode execPayload ----
  // payload = abi.encode(address[], uint256)
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  const [list, nextIndex] = abiCoder.decode(
    ["address[]", "uint256"],
    payload
  );

  console.log("Ready vaults:", list);
  console.log("Next index:", Number(nextIndex));

  if (list.length === 0) {
    console.log("List is empty. Nothing to execute.");
    return;
  }

  // ---- Step 3: executeBatch() ----
  const tx = await registry.executeBatch(list, nextIndex);
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("Execution complete.");
}

main().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
