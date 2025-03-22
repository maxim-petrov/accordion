export const extractMs = (duration) => {
  if (typeof duration !== 'string') {
    if (typeof duration === 'number') {
      return duration;
    }
    return 500;
  }
  
  const msMatch = duration.match(/(\d+)ms/);
  if (msMatch && msMatch[1]) {
    return parseInt(msMatch[1]);
  }
  
  const secMatch = duration.match(/(\d*\.?\d+)s/);
  if (secMatch && secMatch[1]) {
    return parseFloat(secMatch[1]) * 1000;
  }
  
  if (/^\d+$/.test(duration)) {
    return parseInt(duration);
  }
  
  console.warn(`Couldn't parse duration: ${duration}, using default value`);
  return 500;
}; 