import Image from "next/image";

const BeachDetailsFeaturedCard = ({
  name,
  iconUrl,
}: {
  name: string;
  iconUrl: string;
}) => {
  return (
    <div className="rounded-lg bg-primary-800 border-4 border-primary-500 flex flex-col text-white gap-2 p-3 items-center">
      <div>
        <Image src={iconUrl} alt="" className="rounded-lg object-cover" />
      </div>
      <p className="text-sm">{name}</p>
    </div>
  );
};

export default BeachDetailsFeaturedCard;
