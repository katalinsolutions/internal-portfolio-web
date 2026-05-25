import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  content: React.ReactNode | string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export default function AppTooltip({ children, content, side = 'bottom', delay = 300 }: Props) {
  return (
    <Tooltip delayDuration={delay}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}
