import Image from "next/image";

import { placeholderImage } from "@/config/constants";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectCardProps {
  card: {
    id: string;
    img: string;
    pp: string;
    cat: string;
    username: string;
  };
}

export function ProjectCard({ card }: ProjectCardProps) {
  return (
    <Card className="h-[300px] w-[300px] cursor-pointer overflow-hidden rounded-md transition-shadow duration-200 hover:shadow-lg">
      <div className="relative h-[70%] w-full">
        <Image
          src={card.img || placeholderImage}
          alt={card.cat}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={card.pp || placeholderImage} alt={card.username} />
          <AvatarFallback>{card.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-medium text-gray-900">{card.cat}</h2>
          <span className="text-sm text-gray-600">{card.username}</span>
        </div>
      </CardContent>
    </Card>
  );
}
