import { useForm, FieldValues, Path } from "react-hook-form";
import Subtitle from "./subtitle";
import FormFieldCustom from "./formFieldCustom";

interface BeachTipsProps<T extends FieldValues> {
  form: ReturnType<typeof useForm<T>>;
}

const BeachTips = <T extends FieldValues>({ form }: BeachTipsProps<T>) => {
  return (
    <div className=" flex flex-col gap-6 ">
      <Subtitle>Beach tips</Subtitle>
      <div className="grid grid-cols-2 items-center">
        <h3>Best time to visit?</h3>
        <FormFieldCustom
          form={form}
          name={"best_time_to_visit" as Path<T>}
          placeholder="Enter best time to visit"
          textarea
        />
      </div>
      <div className="grid grid-cols-2 items-center">
        <h3>Local wildlife?</h3>
        <FormFieldCustom
          form={form}
          name={"local_wildlife" as Path<T>}
          placeholder="Many fish and crabs"
          textarea
        />
      </div>

      <div className="grid grid-cols-2 items-center">
        <h3>Restarunts and bars nearby?</h3>
        <FormFieldCustom
          form={form}
          name={"restaurants_and_bars_nearby" as Path<T>}
          placeholder="A very good restaurant nearby"
          textarea
        />
      </div>
    </div>
  );
};

export default BeachTips;
