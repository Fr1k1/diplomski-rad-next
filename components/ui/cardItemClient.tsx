"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rating } from "react-simple-star-rating";
import { Button } from "./button";
import Link from "next/link";
import Image from "next/image";

type CardItemClientProps = {
  id: number;
  name: string;
  image: string;
  rating: number;
  cityName?: string;
  countryName?: string;
};

const CardItemClient = ({
  id,
  name,
  image,
  rating,
  cityName,
  countryName,
}: CardItemClientProps) => {
  const imageUrl = image || "/no_image_placeholder.png";
  return (
    <div>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{name}</CardTitle>
              <div className="flex items-center gap-2">
                <Rating
                  size={25}
                  transition
                  allowFraction
                  initialValue={rating}
                />
                {cityName && countryName && (
                  <h4>
                    {cityName}, {countryName}
                  </h4>
                )}
              </div>
            </div>
            <div>
              <Link href={`/beach/${id}`}>
                <Button underlined variant={"darker"}>
                  More
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="w-full h-72 overflow-hidden">
            <Image
              src={imageUrl}
              alt={`Image of ${name}`}
              className="w-full h-full object-cover"
              width={500}
              height={300}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardItemClient;
