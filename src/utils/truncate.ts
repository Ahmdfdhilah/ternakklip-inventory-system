export  const truncate = (str: string, max = 26) =>
  str.length > max ? str.slice(0, max) + '…' : str;