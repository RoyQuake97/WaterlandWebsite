import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
// Import dessert bar image directly
import DessertBarImage from '../attractions/DessertBarImage';

interface AttractionProps {
  title: string;
  shortDescription: string;
  longDescription?: string;
  hours: string;
  price: string;
  features: string[];
  image: string;
  comingSoon?: boolean;
  actionLink?: {
    text: string;
    href: string;
  };
}

const attractions: AttractionProps[] = [
  {
    title: "Waterpark & Slides",
    shortDescription: "Thrilling slides and splash attractions for all ages.",
    longDescription: "Our thrilling slides provide endless fun for visitors of all ages. With safety as our priority, all slides include splash zone landings rather than deep pools.",
    hours: "10 AM – 7 PM",
    price: "$20 per person (all ages)",
    features: [
      "Some high slides not suitable for kids under 8",
      "Slides operate continuously from 11:30 AM to 5:00 PM",
      "No water depth (slides land into splash zones, not pools)",
      "Shaded and sunny seating available"
    ],
    image: "/images/waterpark-slides-new.svg"
  },
  {
    title: "Kids Waterhouse",
    shortDescription: "A sea-themed wonderland built just for little ones.",
    longDescription: "Our Kids Waterhouse is a magical world designed specifically for younger children, featuring gentle water activities in a safe, supervised environment.",
    hours: "10 AM – 7 PM",
    price: "Included in general admission",
    features: [
      "Ideal for children under 12",
      "Features: tipping bucket, mini slides, water cannons",
      "Shallow padded splash zones",
      "Constant lifeguard supervision",
      "Comfortable seating for parents nearby"
    ],
    image: "/images/kids-waterhouse.svg"
  },
  {
    title: "VIP Pool & Pool Bar",
    shortDescription: "An exclusive escape with in-water bar service.",
    longDescription: "Enjoy a premium experience at our VIP Pool area with its exclusive in-water bar service. The perfect place to relax and enjoy premium drinks in a sophisticated atmosphere.",
    hours: "10 AM – 7 PM",
    price: "$25 per person",
    features: [
      "First-come, first-served access (no bookings taken)",
      "Includes towel service and quick food/drink service",
      "In-water cocktail/mocktail bar",
      "Limited capacity for a premium atmosphere"
    ],
    image: "/images/vip-pool-new.svg"
  },
  {
    title: "Resort Hotel",
    shortDescription: "Stay overnight with resort benefits included.",
    longDescription: "Make the most of your visit by staying in our beautiful resort hotel. All rooms include 2-day waterpark access and complimentary breakfast.",
    hours: "Check-in: 3 PM, Check-out: 12 PM",
    price: "$250–$350 per night",
    features: [
      "Room types: Junior, Twin, Ambassador",
      "All stays include 2-day waterpark access and breakfast",
      "Room suggestion logic based on guest count and ages"
    ],
    image: "/images/resort-hotel.svg",
    actionLink: {
      text: "Make Reservation",
      href: "/hotel"
    }
  },
  {
    title: "The Harbor Restaurant",
    shortDescription: "International cuisine served with a view.",
    longDescription: "Enjoy a variety of international dishes in our spacious restaurant overlooking the waterpark. Perfect for a relaxing meal break during your day of fun.",
    hours: "10 AM – 5 PM",
    price: "Menu prices vary",
    features: [
      "No Lebanese dishes offered",
      "Waterpark-view seating with relaxing ambiance"
    ],
    image: "/images/restaurant-new.svg",
    actionLink: {
      text: "View Menu",
      href: "/menu"
    }
  },
  {
    title: "Boutique Shop",
    shortDescription: "Essentials and souvenirs, just steps away.",
    longDescription: "Our on-site shop offers everything you might need during your visit, from swimwear to sunscreen, plus Waterland branded souvenirs to remember your day.",
    hours: "10 AM – 7 PM",
    price: "Various prices",
    features: [
      "Products: flip-flops, sunscreen, swimwear, branded items",
      "Cash only (no card payments accepted)"
    ],
    image: "/images/boutique-new.svg"
  },
  {
    title: "Dessert & Snack Bar",
    shortDescription: "A cool-down stop for sweet treats.",
    longDescription: "Coming soon! Our dessert bar will offer a variety of sweet treats and refreshing drinks including crepes, protein shakes, frozen yogurt, and more.",
    hours: "12 PM – 6:30 PM",
    price: "Menu prices vary",
    features: [
      "Items: crepes, protein shakes, frozen yogurt, iced coffees, soft cream"
    ],
    image: DessertBarImage(),
    comingSoon: true
  }
];

const AttractionCard: React.FC<AttractionProps> = ({ 
  title, shortDescription, hours, price, features, image, comingSoon, actionLink, longDescription
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          whileHover={{ y: -5, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="cursor-pointer relative"
        >
          <Card className={`h-full overflow-hidden transition-all border-2 hover:border-[#00A8E8] ${comingSoon ? 'opacity-80' : ''}`}>
            <div className="relative">
              <div 
                className="h-48 w-full bg-cover bg-center" 
                style={{ 
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
                <Badge className="bg-[#0A4C8B] text-white">{hours}</Badge>
              </div>
              {comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <Badge className="bg-[#F86AA0] text-white text-lg py-2 px-4">COMING SOON</Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[#0A4C8B] text-xl">{title}</CardTitle>
              <CardDescription className="text-gray-600">
                {shortDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-[#F86AA0] font-semibold text-sm">
                {price}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-[#0A4C8B]">{title}</DialogTitle>
            <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-slate-100">
              <X className="h-4 w-4" />
            </DialogClose>
          </div>
          <DialogDescription className="text-base text-gray-700">
            {longDescription || shortDescription}
          </DialogDescription>
        </DialogHeader>
        <div>
          <div className="mb-3 flex justify-between items-center">
            <Badge variant="outline" className="px-3 py-1 border-[#0A4C8B] text-[#0A4C8B]">
              {hours}
            </Badge>
            <p className="font-semibold text-[#F86AA0]">{price}</p>
          </div>
          <div className="mb-4">
            <h4 className="font-semibold text-[#0A4C8B] mb-2">Features:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-[#FFD447] mr-2 font-bold">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          {actionLink && (
            <Button 
              className="w-full mt-2 bg-[#0A4C8B] hover:bg-[#083c70]"
              onClick={() => window.location.href = actionLink.href}
            >
              {actionLink.text}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const NewAttractionsSection: React.FC = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-white to-[#f0f8ff]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A4C8B] mb-4 font-montserrat">
            Explore Our Attractions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Click on any attraction below to learn more about what makes Waterland the perfect 
            destination for a day of fun and relaxation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {attractions.map((attraction, index) => (
            <AttractionCard key={index} {...attraction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewAttractionsSection;