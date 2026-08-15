interface TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;
  word: string | null;
}

function createNode(): TrieNode {
  return { children: new Map(), isEnd: false, word: null };
}

// Prefix trie over inserted words (titles/authors), used to power instant
// client-side autocomplete suggestions while the debounced API search is in flight.
export class Trie {
  private root: TrieNode = createNode();

  insert(word: string): void {
    const trimmed = word.trim();
    if (!trimmed) return;
    let node = this.root;
    for (const ch of trimmed.toLowerCase()) {
      let next = node.children.get(ch);
      if (!next) {
        next = createNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEnd = true;
    node.word = trimmed;
  }

  private collect(node: TrieNode, limit: number, out: string[]): void {
    if (out.length >= limit) return;
    if (node.isEnd && node.word) out.push(node.word);
    for (const child of node.children.values()) {
      if (out.length >= limit) return;
      this.collect(child, limit, out);
    }
  }

  search(prefix: string, limit = 6): string[] {
    const trimmed = prefix.trim().toLowerCase();
    if (!trimmed) return [];
    let node = this.root;
    for (const ch of trimmed) {
      const next = node.children.get(ch);
      if (!next) return [];
      node = next;
    }
    const out: string[] = [];
    this.collect(node, limit, out);
    return out;
  }
}
