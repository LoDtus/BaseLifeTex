export const cvDate = (isoDateStr) => {
    if (!isoDateStr) return "";
    return new Date(isoDateStr).toISOString().split("T")[0];
  };
  