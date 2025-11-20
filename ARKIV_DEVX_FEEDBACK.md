# Arkiv DevX Feedback - MusiciUS Project

## 📊 Arkiv Features Used

### ✅ Implemented (2+ Features)
1. **CRUD Operations**
   - `createEntity()` - Store song metadata with TTL
   - `getEntity()` - Retrieve metadata by entityKey
   - Used in: Song creation flow, detail pages

2. **Advanced Queries**
   - `buildQuery()` with `eq()` filters
   - Filter by `type: 'song-metadata'`
   - Filter by artist name
   - Used in: `/api/songs/list`, artist pages

3. **TTL Management**
   - 6-month expiration (`expiresIn: 15778800`)
   - `expiresAt` tracking in metadata
   - UX countdown display (implemented in model)

4. **Attributes System**
   - Custom attributes: songTitle, artist, nftContract, tokenId, agreementHash
   - Enables cross-entity queries
   - Indexing for fast lookups

### 🔧 Integration Points
- **JSON-RPC** via `@arkiv-network/sdk` v0.4.5
- **Mendoza Testnet** - Production-ready stability
- **Wallet Client** - Transaction signing for entity creation
- **Public Client** - Read operations for queries

---

## 🎯 What Worked Well

### Developer Experience Wins

1. **SDK Simplicity**
   ```typescript
   const { entityKey, txHash } = await walletClient.createEntity({
     payload: jsonToPayload(metadata),
     contentType: 'application/json',
     attributes: [...],
     expiresIn: sixMonthsInSeconds
   });
   ```
   - Clean API, predictable behavior
   - TypeScript support excellent
   - No hidden complexity

2. **Query Builder Pattern**
   ```typescript
   const results = await publicClient.buildQuery()
     .where(eq('type', 'song-metadata'))
     .withPayload(true)
     .fetch();
   ```
   - Intuitive chaining
   - Flexible filtering
   - Great for complex queries

3. **TTL System**
   - Set-and-forget expiration
   - Perfect for temporary collaborative agreements
   - Clear `expiresAt` timestamp returned

4. **Documentation**
   - Examples were helpful
   - Types made discovery easy
   - Migration from v0.3.x to v0.4.x straightforward

---

## 🐛 Pain Points & Issues

### Critical Issues

#### 1. ENS Resolution Breaking Contract Calls
**Severity:** HIGH  
**Impact:** Blocked factory contract integration for 2+ hours

**Problem:**
```typescript
// This fails with ENS errors on Scroll Sepolia:
const provider = new JsonRpcProvider("https://sepolia-rpc.scroll.io/");
const factory = new Contract(FACTORY_ADDRESS, abi, wallet);
await factory.createSong(...); // ❌ Error: ENS name not configured
```

**Root Cause:** ethers v6 enables ENS by default, but Scroll Sepolia doesn't support it.

**Workaround:**
```typescript
const provider = new JsonRpcProvider("https://sepolia-rpc.scroll.io/", {
  chainId: 534351,
  name: 'scroll-sepolia',
  ensAddress: null // Disable ENS
});
```

**Recommendation:**
- Document this in "Using Arkiv with Smart Contracts"
- Provide chainId-specific config examples
- Warn about ENS on non-mainnet networks

**Reproducible Steps:**
1. Install `@arkiv-network/sdk` + `ethers` v6
2. Try to call ANY smart contract on Scroll Sepolia
3. Contract calls fail with ENS errors
4. Solution: Explicitly disable ENS in provider config

---

#### 2. Event Parsing - Inconsistent Parameter Names
**Severity:** MEDIUM  
**Impact:** Wasted 30 minutes debugging "undefined" addresses

**Problem:**
```typescript
// Documentation/examples suggest:
const parsed = factory.interface.parseLog(log);
console.log(parsed.args.nft); // ❌ undefined
console.log(parsed.args.splitter); // ❌ undefined

// Actual ABI names:
console.log(parsed.args.nftAddress); // ✅ works
console.log(parsed.args.splitterAddress); // ✅ works
```

**Root Cause:** ABI parameter names != documented/expected names

**Recommendation:**
- Show full `parseLog` output structure in docs
- Example: "Check your ABI for actual parameter names"
- Debugging tip: `console.log(parsed.args)` to inspect

---

#### 3. Basis Points Not Obvious
**Severity:** LOW (Documentation)  
**Impact:** Smart contract rejected percentages, unclear error

**Problem:**
```typescript
// Tried this first (fails):
percentages: [50, 30, 20] // Contract expects 10000 = 100%

// Needed this:
percentages: [5000, 3000, 2000] // 100 = 1%
```

**Error Message:** `"execution reverted: must sum 100%"` (confusing - it DID sum to 100)

**Recommendation:**
- Clarify in docs: "Revenue percentages use basis points (1% = 100)"
- Better error: `"must sum 10000 (100% in basis points)"`

---

### Minor Friction Points

#### 4. No Built-in "List All" Query
**Workaround:**
```typescript
// Have to filter by custom attribute:
const query = publicClient.buildQuery()
  .where(eq('type', 'song-metadata'))
  .fetch();
```

**Suggestion:** Add `.fetchAll()` for "give me everything I own"

---

#### 5. Payload Encoding Not Auto-detected
**Current:**
```typescript
const payloadBytes = Array.isArray(entity.payload) 
  ? new Uint8Array(entity.payload)
  : entity.payload;
const payloadStr = new TextDecoder().decode(payloadBytes);
const metadata = JSON.parse(payloadStr);
```

**Suggestion:** 
```typescript
// Auto-detect contentType and parse:
const metadata = entity.getPayload(); // returns parsed JSON if contentType is application/json
```

---

## 💡 Suggestions for Improvement

### High Priority

1. **Chain-specific Setup Guides**
   - One-page guides for: Scroll, Base, Arbitrum, etc.
   - Include provider config, common pitfalls, testnet faucets
   - Example: "Arkiv + Scroll Sepolia Complete Setup"

2. **Event Parsing Helper**
   ```typescript
   // Built-in utility:
   import { parseContractEvent } from '@arkiv-network/sdk/helpers';
   
   const { nftAddress, splitterAddress } = parseContractEvent(
     receipt,
     factoryABI,
     'SongCreated'
   );
   ```

3. **Better Error Messages**
   - "Entity not found" → "Entity 0x123... not found or expired (check TTL)"
   - "must sum 100%" → Include expected unit (wei, basis points, etc.)

### Medium Priority

4. **TTL Utilities**
   ```typescript
   import { TTL } from '@arkiv-network/sdk/utils';
   
   expiresIn: TTL.months(6), // instead of manual seconds calc
   expiresIn: TTL.days(30),
   expiresIn: TTL.years(1),
   ```

5. **Query Pagination**
   - Current: All results returned (fine for now)
   - Future: `.limit(20).offset(40)` for large datasets

6. **Subscription Examples**
   - Real-time updates are mentioned but no clear examples
   - Show: "Watch for new entities matching query"

---

## 📈 Overall Assessment

### What We Loved ❤️
- **Stability** - Mendoza testnet never went down
- **Speed** - Entity creation ~2-3 seconds, queries <1 second
- **TypeScript** - First-class support, great DX
- **Simplicity** - Core API is small and learnable
- **TTL** - Killer feature for temporary data

### Complexity Score
- **Initial setup:** 2/10 (very easy)
- **Basic CRUD:** 3/10 (straightforward)
- **Advanced queries:** 5/10 (takes learning)
- **Contract integration:** 7/10 (ENS issue was blocker)

### Would We Use Again?
**YES** - Arkiv is perfect for decentralized metadata that needs:
- Temporary storage (TTL)
- Complex queries (filters, attributes)
- On-chain verification (hashes)
- Cross-chain compatibility

**Use Cases:**
- NFT metadata (our case)
- Event ticketing
- Collaborative documents
- Temporary escrows/agreements

---

## 🔗 Resources

- **Deployed Contracts:**
  - Factory: `0xE76920eaB8C76d6aa6191E3413DeF78073Fa0c66`
  - Song #1 NFT: `0xf0882543F2275f5C12565C13Ac495f5cE8E356d0`
  - Song #1 Splitter: `0xf4d12491d450952F422A8FDFF1c0321A91F5E510`

- **Arkiv Entities:**
  - Total created: 16 entities
  - All with 6-month TTL
  - Explorer: https://explorer.arkiv.network/

- **GitHub:**
  - Repo: https://github.com/leitocam/BA-Hackathon
  - Branch: `trigo`

---

## 📝 Summary

Arkiv delivered on its promise of **permanent decentralized storage with TTL**. The SDK is polished, the network is stable, and the developer experience is solid. 

The main friction came from **integrating with smart contracts on Scroll** (ENS issue), not from Arkiv itself. Once that was resolved, development was smooth.

**Rating: 8/10** - Would be 10/10 with better chain-specific docs and error messages.

---

*Built during Hackathon Tierra de Builders 2025*
