import { MONTH_NAMES } from "./data";
import { toDev, toBS } from "./conversion";
import { parseAdDate, parseBsDate } from "./parsers";
import { zPad } from "./helpers";
import type { AdDateInput, BsDateInput } from "./types";

export type BsDateFormat = "YYYY-MM-DD" | "D MMMM YYYY" | "DD MMMM YYYY";

export function formatBsDate(
  input: BsDateInput,
  format: BsDateFormat = "YYYY-MM-DD",
): string {
  const date = parseBsDate(input);

  if (format === "YYYY-MM-DD") {
    return `${date.year}-${zPad(date.month)}-${zPad(date.day)}`;
  }

  const day = format === "DD MMMM YYYY" ? zPad(date.day) : String(date.day);
  return `${day} ${MONTH_NAMES[date.month - 1]} ${date.year}`;
}

export function formatBsDateNepali(input: BsDateInput): string {
  const date = parseBsDate(input);
  const dev = toDev(date.year, date.month, date.day);
  return `${dev.day} ${dev.month} ${dev.year}`;
}

export function formatAdDate(input: AdDateInput): string {
  const date = parseAdDate(input);
  return `${date.year}-${zPad(date.month)}-${zPad(date.day)}`;
}

export function formatAdAsBsDate(
  input: AdDateInput,
  format: BsDateFormat = "YYYY-MM-DD",
): string {
  return formatBsDate(toBS(input), format);
}

export function formatAdAsBsDateNepali(input: AdDateInput): string {
  return formatBsDateNepali(toBS(input));
}
