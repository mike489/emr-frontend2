import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Africa/Nairobi';

export const useLiveClock = (formatStr: string = 'PPP – p (z)') => {
  const [now, setNow] = useState(() => toZonedTime(new Date(), TIMEZONE));

  useEffect(() => {
    const id = setInterval(() => {
      setNow(toZonedTime(new Date(), TIMEZONE));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return format(now, formatStr);
};
