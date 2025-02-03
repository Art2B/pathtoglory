export function formatHash(hash: string): string {
  return (
    hash
      .normalize("NFD")
      // get rid of the diacritics
      .replace(/[\u0300-\u036f]/g, "")
      // Remove punctuation
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .trim()
      .replaceAll(" ", "-")
      .toLowerCase()
  );
}

export function stringToFormData(queryString: string): FormData {
  const formData = new FormData();

  // Parse the query string into an object
  const params = new URLSearchParams(queryString);

  // Append each key-value pair to the FormData object
  for (const [key, value] of params) {
    formData.append(key, value);
  }

  return formData;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-UK", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "shortOffset",
    hour12: false,
  });
}
