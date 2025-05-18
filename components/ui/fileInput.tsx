"use client";

import { Input } from "@/components/ui/input";

const FileInput = ({
  id,
  onFileChange,
  name,
}: {
  id: string;
  onFileChange: (files: FileList | null) => void;
  name: string;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files);
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Input id={id} type="file" onChange={handleFileChange} name={name} />
    </div>
  );
};

export default FileInput;
