const isDigit = (value: string) => /\d/.test(value);

export const countDigits = (value: string): number =>
  Array.from(value).reduce((count, character) => count + (isDigit(character) ? 1 : 0), 0);

export const caretAfterDigitCount = (value: string, digitCount: number): number => {
  if (digitCount <= 0) return 0;

  let seenDigits = 0;
  for (let index = 0; index < value.length; index += 1) {
    if (!isDigit(value[index])) continue;
    seenDigits += 1;
    if (seenDigits !== digitCount) continue;

    let caret = index + 1;
    while (caret < value.length && !isDigit(value[caret])) caret += 1;
    return caret;
  }

  return value.length;
};

export const formatIsoDateInput = (rawValue: string): string => {
  const digits = rawValue.replace(/\D/g, '').slice(0, 8);
  if (digits.length < 4) return digits;
  if (digits.length === 4) return `${digits}-`;
  if (digits.length < 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  if (digits.length === 6) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}-`;
  }

  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
};

export const formatTimeInput = (rawValue: string): string => {
  const allDigits = rawValue.replace(/\D/g, '');
  if (!allDigits) return '';

  const hourLength = Number(allDigits[0]) > 2 ? 1 : 2;
  const digits = allDigits.slice(0, hourLength + 2);

  if (digits.length < hourLength) return digits;

  const hour = digits.slice(0, hourLength);
  if (digits.length === hourLength) return `${hour}:`;

  const minute = digits.slice(hourLength);
  if (minute.length < 2) return `${hour}:${minute}`;

  return `${hour.padStart(2, '0')}:${minute}`;
};

export const moveCaretAcrossSeparator = (
  event: InputEvent,
  separators: string
): boolean => {
  const input = event.currentTarget as HTMLInputElement | null;
  if (!input || event.isComposing) return false;

  const start = input.selectionStart;
  const end = input.selectionEnd;
  if (start === null || end === null || start !== end) return false;

  if (
    event.inputType === 'deleteContentBackward' &&
    start > 0 &&
    separators.includes(input.value[start - 1])
  ) {
    event.preventDefault();
    input.setSelectionRange(start - 1, start - 1);
    return true;
  }

  if (
    event.inputType === 'deleteContentForward' &&
    start < input.value.length &&
    separators.includes(input.value[start])
  ) {
    event.preventDefault();
    input.setSelectionRange(start + 1, start + 1);
    return true;
  }

  return false;
};
