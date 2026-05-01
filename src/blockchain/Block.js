import { sha256 } from './hash';

export class Block {
  /**
   * @param {number} index        - Position in the chain
   * @param {string} timestamp    - ISO timestamp
   * @param {object} data         - Payload (action + metadata)
   * @param {string} previousHash - Hash of the preceding block
   */
  constructor(index, timestamp, data, previousHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = '';
  }

  /** Compute SHA-256 over all fields. */
  async calculateHash() {
    const content = [
      this.index,
      this.timestamp,
      JSON.stringify(this.data),
      this.previousHash,
      this.nonce,
    ].join('');
    return sha256(content);
  }

  /**
   * Proof-of-work: increment nonce until hash starts with
   * `difficulty` leading zeros.
   */
  async mine(difficulty) {
    const target = '0'.repeat(difficulty);
    do {
      this.nonce += 1;
      this.hash = await this.calculateHash();
    } while (!this.hash.startsWith(target));
    return this;
  }
}
