import * as fs from "node:fs";
import * as path from "node:path";

// Competition rule: the entry is a single sentence of 1-200 characters
// (per the bounty gate on make.fun). Code points are counted with the
// spread operator so astral-plane characters count once, not twice.
// Why this line should win: it is a real voice recalling a real moment —
// a mother counting coins at the kitchen table on rent night — and the
// advice she gives there ("never borrow tomorrow's peace to pay for
// today's pride") is specific and earned in that scene, yet true far
// beyond it: about debt, ego, burnout, any trade of future calm for
// present pride. No slogan, no fortune cookie, one breath, and the last
// words leave something to keep.

const LINE =
  "My mother, counting coins at the kitchen table the night the rent was due, told me never to borrow tomorrow's peace to pay for today's pride.";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR && process.env.MAKEFUN_OUTPUT_DIR.trim() !== ""
    ? process.env.MAKEFUN_OUTPUT_DIR
    : path.join(process.cwd(), "output");

fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, LINE, "utf8");

const readBack = fs.readFileSync(outPath, "utf8");
const codePoints = [...readBack].length;

if (readBack !== LINE) {
  console.error("Validation failed: entry.txt is not byte-identical to the line.");
  process.exit(1);
}
if (codePoints < 1 || codePoints > 200) {
  console.error(`Validation failed: ${codePoints} code points, must be 1-200.`);
  process.exit(1);
}
if (readBack.trim().length === 0) {
  console.error("Validation failed: line is only whitespace.");
  process.exit(1);
}
const terminators = (readBack.match(/[.!?]/g) || []).length;
if (terminators !== 1 || !readBack.endsWith(".")) {
  console.error(
    `Validation failed: expected exactly one sentence (one terminal period), found ${terminators} sentence terminator(s).`
  );
  process.exit(1);
}

console.log(`Wrote ${codePoints} code points to ${outPath}:`);
console.log(readBack);
console.log("Validation passed: byte-identical, 1-200 code points, not only whitespace, exactly one sentence.");
