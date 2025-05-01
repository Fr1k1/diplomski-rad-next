import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import { useForm, FieldValues, Path } from "react-hook-form";
import { Textarea } from "./textarea";

interface FormFieldCustomProps<T extends FieldValues> {
  form: ReturnType<typeof useForm<T>>;
  name: Path<T>; //for type safety
  label?: string;
  placeholder?: string;
  textarea?: boolean;
}

const FormFieldCustom = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "",
  textarea = false,
}: FormFieldCustomProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {textarea ? (
              <Textarea placeholder={placeholder} {...field} />
            ) : (
              <Input placeholder={placeholder} {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldCustom;
