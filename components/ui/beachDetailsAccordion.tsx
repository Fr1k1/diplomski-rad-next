import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const BaechDetailsAccordion = ({
  bestTimeToVisit,
  localWildlife,
  restaurantsAndBars,
}: {
  bestTimeToVisit: string | undefined;
  localWildlife: string | undefined;
  restaurantsAndBars: string | undefined;
}) => {
  return (
    <div className="p-4 mb-4 lg:mb-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Best time to visit?</AccordionTrigger>
          <AccordionContent>{bestTimeToVisit}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Local wildlife?</AccordionTrigger>
          <AccordionContent>{localWildlife}</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Food and drinks nearby?</AccordionTrigger>
          <AccordionContent>{restaurantsAndBars}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default BaechDetailsAccordion;
