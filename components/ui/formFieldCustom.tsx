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
  name: Path<T>;
  label?: string;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}

const FormFieldCustom = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "",
  textarea = false,
  type = "text",
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
              <Input placeholder={placeholder} {...field} type={type} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldCustom;
