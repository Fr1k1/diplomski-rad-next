import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";
import Image from "next/image";

import { FieldValues, Path, useForm } from "react-hook-form";

interface Option {
  id: string | number;
  name?: string;
  description?: string;
  icon_url?: string;
}

interface SelectFieldCustomProps<T extends FieldValues> {
  form: ReturnType<typeof useForm<T>>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  onValueChange?: (value: string | number) => void;
}

const SelectFieldCustom = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Choose an option",
  options,
  disabled,
  onValueChange,
}: SelectFieldCustomProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onValueChange?.(value); // optional callback
              }}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder}>
                  {options?.length > 0 && field.value
                    ? options?.find(
                        (option) => option?.id.toString() === field.value
                      )?.name || placeholder
                    : placeholder}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {options?.length > 0 ? (
                    options.map((option) => (
                      <SelectItem key={option.id} value={option.id.toString()}>
                        <div className="flex flex-row gap-2">
                          {option.name}

                          {option.description && (
                            <span>{option.description}</span>
                          )}
                          {option.icon_url && option.name && (
                            <div className="bg-primary-500 rounded-lg p-0.5">
                              <Image
                                src={option.icon_url}
                                alt={option?.name}
                                className="w-6 h-6"
                                width={24}
                                height={24}
                              />
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-options" disabled>
                      No options available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SelectFieldCustom;
