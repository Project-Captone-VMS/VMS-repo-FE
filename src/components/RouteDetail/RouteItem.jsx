import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "../ui/TimeLine";

const RouteItem = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="bg-white border-2 px-2 rounded-lg hover:border-blue-400 cursor-pointer hover:bg-slate-100"
      >
        <AccordionTrigger>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className=" text-[1.2vw]">Đà Nẵng - Huê</p>
              <p className="text-blue-600 font-extrabold text-[0.8vw]"> ON</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-500 text-[0.8vw] text-start">
                <p className=" "> 2 point</p>
                <p className=""> 20/8/2024</p>
              </div>
              <button className="text-[0.6vw] px-2 py-1 bg-blue-200 rounded-lg text-blue-700 font-bold">
                Build time
              </button>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Timeline>
            <TimelineItem>
              <TimelineHeader>
                <TimelineTitle>Start - Point_1</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>NIceeeeeeee</TimelineDescription>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineTitle>Point_1 - Point_2</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>NIceeeeeeee</TimelineDescription>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineTitle>Point_2 - End</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>NIceeeeeeee</TimelineDescription>
            </TimelineItem>
          </Timeline>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="item-2"
        className="bg-white border-2 px-2 mt-2 rounded-lg hover:border-blue-400 cursor-pointer hover:bg-slate-100"
      >
        <AccordionTrigger>
          <div className="flex flex-col w-full">
            <div className="flex justify-between items-center">
              <p className=" text-[1.2vw]">Đà Nẵng - Huê</p>
              <p className="text-blue-600 font-extrabold text-[0.8vw]"> ON</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-500 text-[0.8vw] ">
                <p className=" "> 5 point</p>
                <p className=""> 20/8/2024</p>
              </div>
              <button className="text-[0.6vw] px-2 py-1 bg-blue-200 rounded-lg text-blue-700 font-bold">
                Build time
              </button>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Timeline>
            <TimelineItem>
              <TimelineHeader>
                <TimelineTitle>Hello mother fucker</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>NIceeeeeeee</TimelineDescription>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineTitle>Hello mother fucker</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>NIceeeeeeee</TimelineDescription>
            </TimelineItem>
            <TimelineItem>
              <TimelineHeader>
                <TimelineTitle>Hello mother fucker</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription>NIceeeeeeee</TimelineDescription>
            </TimelineItem>
          </Timeline>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RouteItem;
