import { ParsedRates } from "./types.js";

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

function normalizeInput(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ") // non-breaking spaces
    .replace(/[*_~`]/g, "") // remove markdown formatting
    .replace(/[ \t]+/g, " ") // collapse spaces/tabs
    .trim();
}

export function parseRateMessage(text: string): ParsedRates {
  const normalized = normalizeInput(text);

  // Extract date
  const dateMatch = normalized.match(/As on\s+(.+?)\s*-\s*Time/i);
  if (!dateMatch) {
    throw new ParseError(
      'Could not find date. Expected format: "As on March 30th, 2026 - Time"'
    );
  }
  const date = dateMatch[1].trim();

  // Extract time
  const timeMatch = normalized.match(/Time\s+(\d{1,2}\.\d{2})\s*Hrs/i);
  if (!timeMatch) {
    throw new ParseError(
      'Could not find time. Expected format: "Time 18.37 Hrs"'
    );
  }
  const time = timeMatch[1];

  // Gold Sale Rate section
  const goldSaleMatch = normalized.match(
    /Gold Sale Rate\s*([\s\S]+?)\s*Gold Purchase Rate/i
  );
  if (!goldSaleMatch) {
    throw new ParseError("Could not find Gold Sale Rate section");
  }

  const goldSection = goldSaleMatch[1];

  const goldStandardMatch = goldSection.match(/([\d,]+)\s*:\s*Standard/i);
  const gold22kMatch = goldSection.match(/([\d,]+)\s*:\s*22K/i);
  const gold18kMatch = goldSection.match(/([\d,]+)\s*:\s*18K/i);
  const gold14kMatch = goldSection.match(/([\d,]+)\s*:\s*14K/i);

  if (!goldStandardMatch) {
    throw new ParseError("Could not find Standard gold rate");
  }

  if (!gold22kMatch) {
    throw new ParseError("Could not find 22K gold rate");
  }

  if (!gold18kMatch) {
    throw new ParseError("Could not find 18K gold rate");
  }

  if (!gold14kMatch) {
    throw new ParseError("Could not find 14K gold rate");
  }

  // Silver Sale Rate section
  const silverSaleMatch = normalized.match(
    /Silver Sale Rate\s*([\s\S]+?)\s*(?:Silver Purchase Rate|Platinum)/i
  );

  if (!silverSaleMatch) {
    throw new ParseError("Could not find Silver Sale Rate section");
  }

  const silverSection = silverSaleMatch[1];

  const silverMatch = silverSection.match(/([\d,]+)\s*:\s*for Bullion/i);

  if (!silverMatch) {
    throw new ParseError("Could not find Bullion silver rate");
  }

  return {
    date,
    time,
    goldStandard: goldStandardMatch[1],
    gold22k: gold22kMatch[1],
    gold18k: gold18kMatch[1],
    gold14k: gold14kMatch[1],
    silverPure: silverMatch[1],
  };
}
