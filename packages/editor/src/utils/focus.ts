export const focusBracketContent = (e: Event, value: string, inputElement: HTMLInputElement | null) => {
  if (inputElement) {
    const textToSelect = value.match(/\(([^)]+)\)/)?.at(1);
    if (textToSelect) {
      e.preventDefault();
      const startIndex = value.indexOf(textToSelect);
      const endIndex = startIndex + textToSelect.length;
      inputElement.focus();
      inputElement.setSelectionRange(startIndex, endIndex);
    }
  }
};
