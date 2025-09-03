# **Technical Round: Build DeFi Dashboard using DeFiLlama APIs**

## **Overview**

Build a **DeFi dashboard** that displays different categories of pools ( investment products ). There are **three main categories**: Lending, Liquid Staking, and Yield Aggregator, with **three pools in each category**. Pool data should be fetched from the **DeFiLlama Pools API**.

The **Yield Aggregator** category should be **locked or blurred by default** and should only unlock once the user **connects a crypto wallet or logs in**.

---

## **Dashboard Flow (UX)**

1. User lands directly on the **Pools Table or Cards (Module 1)**.
2. Table rows or cards should show **pool data**.
3. Users can **filter between Lending, Liquid Staking, and Yield Aggregator** pool categories.
4. When the user clicks on a specific pool, it opens the **Pool View (Module 2)**, which shows:
    - Pool details again (same fields as in table/cards).
    - **Historical APY line chart** (last 12 months, pick **1st day of each month** to plot points).
5. **Yield Aggregator** pools should stay **locked** until:
    - (Preferred) The user connects a crypto wallet (e.g., MetaMask), OR
    - If wallet connection is not implemented or user logs in

---

## **Data Sources (2)**

- **Pools API Endpoint: Returns**

    👉 `https://yields.llama.fi/pools`

- **Test Pools API  here:**

    https://api-docs.defillama.com/#tag/yields/get/pools

- **Historical APY Chart Endpoint:**

    👉 `https://yields.llama.fi/chart/{pool_id}`

- **Test Historical APY API  here:**
https://api-docs.defillama.com/#tag/yields/get/yields/poolsOld

---

## **List these pools from different category**

Check the Pool API and you will get an understanding how the pool data in structured. Endpoint has 1000s of pool, you have to fetch the following ones:

| **Category** | **Chain** | **Project** | **Pool ID** |
| --- | --- | --- | --- |
| **Lending** | Ethereum | aave-v3 | db678df9-3281-4bc2-a8bb-01160ffd6d48 |
|  | Ethereum | compound-v3 | c1ca08e4-d618-415e-ad63-fcec58705469 |
|  | Ethereum | maple | 8edfdf02-cdbb-43f7-bca6-954e5fe56813 |
| **Liquid Staking** | Ethereum | lido | 747c1d2a-c668-4682-b9f9-296708a3dd90 |
|  | Ethereum | binance-staked-eth | 80b8bf92-b953-4c20-98ea-c9653ef2bb98 |
|  | Ethereum | stader | 90bfb3c2-5d35-4959-a275-ba5085b08aa3 |
| **Yield Aggregator** | Ethereum | cian-yield-layer | 107fb915-ab29-475b-b526-d0ed0d3e6110 |
|  | Ethereum | yearn-finance | 05a3d186-2d42-4e21-b1f0-68c079d22677 |
|  | Ethereum | beefy | 1977885c-d5ae-4c9e-b4df-863b7e1578e6 |

---

## **Modules**

### **Module 1: Pools Table or Cards**

1. Show pools for the each category in table view or cards view.
2. Each row/card should display following data:
    - **project**
    - category
    - **symbol**
    - **tvlUsd** (Total Value Locked in USD)
    - **apy** (current APY %)
    - **prediction** (future yield estimate if available)
    - **sigma** (risk/volatility score if available)
    - **apyMean30d** (30-day average APY)
3. Add a filter on the basis of category

UI ideas for reference

![Screenshot 2025-08-26 at 9.42.25 PM.png](attachment:dcd76fed-31c3-4e19-b689-c06d0e40cee9:1705adf6-e12f-4150-b98a-977f534d675c.png)

![Screenshot 2025-08-26 at 9.42.41 PM.png](attachment:e951216c-303b-4e01-b984-ef7b0e72c218:Screenshot_2025-08-26_at_9.42.41_PM.png)

---

### **Module 2: Pool View with Historical APY Chart**

When the user clicks on a pool from Module 1 it open a new page:

1. Show **pool details again** (same fields as Module 1)
2. Display a **line chart of APY history** using data from `https://yields.llama.fi/chart/{pool_id}`:
    - Once you run this API, you will see APY values of each day(unix datatype), just extract the **APY on 1st day of each month** (1st jan, 1st feb, 1st march …..) for the last 12 months.
    - Plot them in a line chart under the pool details.

UI idea for reference

![Screenshot 2025-08-26 at 9.42.01 PM.png](attachment:46589f42-7b4f-4ec0-9b3e-e1f0c1c37633:Screenshot_2025-08-26_at_9.42.01_PM.png)

---

### **Module 3: Wallet Connection & Unlock**

Pools in **Yield Aggregator** category should stay locked in module 1, once the user perform either one of the below options, they should get unlocked.

- Recommended: Integrate with any Web3 wallet connection SDK (connect to **MetaMask**).
- If developer is not comfortable with Web3 wallet integration, they can mock a user login; email and password to simulate a login that unlocks **Yield Aggregator** category pools.

![Screenshot 2025-08-26 at 9.49.29 PM.png](attachment:bde92906-2932-440b-a0a1-35deeb23c1be:42e81421-768d-4df0-98fc-ab4ce4bea0cd.png)

---

## **UI Theme & Components**

- Use **shadcn UI components, Use either blue/voilet/green themes**
- Theme reference: [shadcn themes](https://ui.shadcn.com/themes)
- Developers are free to choose any component/layout style within the theme to present data in a **clean, organized, and user-friendly way**.

---

## Important Notes:

- The UI should be designed like a **dashboard**, with clear organization of **data and views** (table, pool view, charts).
- Developers are free to choose appropriate **shadcn UI components** to present data effectively.
- Handle **API errors gracefully.**
- Developers may use AI agents for assistance, but **do not blindly copy code** — you should understand, debug, and explain your implementation.
- Code must be **well-organized** and include meaningful **comments** for readability.
