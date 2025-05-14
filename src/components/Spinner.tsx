import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

const Spinner = ({ sm, md, lg }: { sm?: boolean; md?: boolean; lg?: boolean }) => {
  const classname = cn("animate-spin text-white-300 fill-white-300 mr-2", {
    "w-4 h-4": sm,
    "w-6 h-6": md,
    "w-8 h-8": lg,
  });

  return (
    <div role="status">
      <Loader2 className={classname} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
