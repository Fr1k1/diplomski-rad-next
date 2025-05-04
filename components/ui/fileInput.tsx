"use client";

import { Input } from "@/components/ui/input";

const FileInput = ({
  id,
  onFileChange,
}: {
  id: string;
  onFileChange: (files: FileList | null) => void;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files);
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Input id={id} type="file" onChange={handleFileChange} />
    </div>
  );
};

export default FileInput;
