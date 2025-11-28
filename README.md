# Natecin Vault Automation

This repository automatically runs the `executeBatch()` function on the `VaultRegistry` contract deployed on **Lisk Sepolia** using GitHub Actions (cron).

## 🔐 GitHub Secrets Required

Add these secrets in:

**Settings → Secrets and variables → Actions → New repository secret**

### `RPC_URL`
Lisk Sepolia RPC endpoint.

Example:
```
https://rpc.sepolia-api.lisk.com
```

### `PRIVATE_KEY`
Private key of the executor wallet.  
Must start with `0x` and contain LSK for gas.

Example:
```
0xabc123...
```

### `REGISTRY_ADDRESS`
Address of your deployed `VaultRegistry` contract.

Example:
```
0xYourRegistryAddress
```

---

## ▶️ How It Works
- A GitHub Action runs `cron.js` on a schedule.
- The script calls `checker()` on the registry.
- If executables exist, it calls:
```
executeBatch(list, nextIndex)
```
- Distribution happens on-chain.

---

## ▶️ Manual Run
Go to **Actions → Lisk Vault Automation → Run workflow**.

---

## 🛑 Stop Automation
- Comment out `schedule:` in `.github/workflows/automation.yml`, or  
- Disable the workflow in GitHub Actions UI.

---

## Files
```
.github/workflows/automation.yml  → cron workflow
cron.js                           → automation script
package.json                      → dependencies
README.md                         → documentation
```
