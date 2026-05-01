import { Block } from './Block';
import { sha256 } from './hash';

const STORAGE_KEY = 'bc-todos-chain';
const DIFFICULTY = 2; // leading zeros required

/**
 * Blockchain that persists its chain to localStorage and derives the current
 * todo list by replaying all recorded actions.
 *
 * Block data payloads:
 *   { action: 'GENESIS' }
 *   { action: 'ADD_TODO',    todoId, text }
 *   { action: 'TOGGLE_TODO', todoId }
 *   { action: 'DELETE_TODO', todoId }
 */
export class Blockchain {
  constructor(chain) {
    this.chain = chain;
    this.difficulty = DIFFICULTY;
  }

  /** Load from localStorage, or bootstrap with a genesis block. */
  static async create() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const chain = JSON.parse(saved);
        if (Array.isArray(chain) && chain.length > 0) {
          return new Blockchain(chain);
        }
      } catch {
        // Corrupted storage — start fresh
      }
    }
    return Blockchain._bootstrap();
  }

  static async _bootstrap() {
    const genesis = new Block(
      0,
      new Date().toISOString(),
      { action: 'GENESIS', message: 'The beginning of your immutable todo ledger.' },
      '0000000000000000000000000000000000000000000000000000000000000000'
    );
    genesis.hash = await genesis.calculateHash();
    const bc = new Blockchain([genesis]);
    bc.save();
    return bc;
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.chain));
  }

  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /** Mine a new block with the given data, append it, and persist. */
  async addBlock(data) {
    const prev = this.getLatestBlock();
    const block = new Block(
      this.chain.length,
      new Date().toISOString(),
      data,
      prev.hash
    );
    await block.mine(this.difficulty);
    this.chain = [...this.chain, block];
    this.save();
    return this.chain;
  }

  /** Re-hash every block to verify chain integrity. */
  async validate() {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];
      if (curr.previousHash !== prev.hash) return false;
      const recalculated = await sha256(
        [curr.index, curr.timestamp, JSON.stringify(curr.data), curr.previousHash, curr.nonce].join('')
      );
      if (curr.hash !== recalculated) return false;
    }
    return true;
  }

  /**
   * Replay the chain to derive current todo state.
   * Returns an array of todo objects: { id, text, completed, blockIndex }.
   */
  getTodos() {
    const map = {};
    for (const block of this.chain) {
      const { action, todoId, text } = block.data;
      if (action === 'ADD_TODO') {
        map[todoId] = { id: todoId, text, completed: false, blockIndex: block.index };
      } else if (action === 'TOGGLE_TODO' && map[todoId]) {
        map[todoId] = { ...map[todoId], completed: !map[todoId].completed };
      } else if (action === 'DELETE_TODO') {
        delete map[todoId];
      }
    }
    return Object.values(map);
  }

  exportLedger() {
    return JSON.stringify(this.chain, null, 2);
  }
}
