import { differenceInBusinessDays } from "date-fns";
import { memo } from "react";

export interface DurationTimeProps {
  laterDate: Date | string;
  earlierDate: Date | string;
}

function DurationTime({ laterDate, earlierDate }: DurationTimeProps) {
  const difference = differenceInBusinessDays(
    new Date(laterDate),
    new Date(earlierDate)
  );

  const text = (() => {
    switch (difference) {
      case 0:
        return "Complete within the day";
      case 1:
        return "Complete in a day";
      default:
        return `Complete in ${difference} working days`;
    }
  })();

  return <p className="font-medium">{text}</p>;
}

export default memo(DurationTime);
