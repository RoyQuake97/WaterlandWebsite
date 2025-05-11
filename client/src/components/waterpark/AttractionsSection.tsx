import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AttractionProps {
  title: string;
  description: string;
  hours: string;
  price: string;
  features: string[];
  image: string;
}

const attractions: AttractionProps[] = [
  {
    title: "Waterpark & Slides",
    description: "Thrilling slides, splash zones, and colorful attractions for all ages.",
    hours: "10:00 AM – 7:00 PM",
    price: "$20 per person, all ages",
    features: [
      "Multiple thrilling water slides",
      "Lifeguards always present",
      "Shaded seating areas available",
      "Safety features throughout"
    ],
    image: "/images/waterpark-slides.svg"
  },
  {
    title: "Kids Splash Zone",
    description: "A magical, safe water world designed just for little adventurers.",
    hours: "10:00 AM – 7:00 PM",
    price: "Included in general admission",
    features: [
      "Ideal for children under 10",
      "Shallow water and soft flooring",
      "Mini slides and tipping bucket",
      "Shaded seating for parents"
    ],
    image: "/images/kids-splash.svg"
  },
  {
    title: "VIP Pool & Pool Bar",
    description: "A serene, adults-preferred zone with towel service and premium comfort.",
    hours: "10:00 AM – 7:00 PM",
    price: "$25 per person (includes towel)",
    features: [
      "First come, first served basis",
      "Cocktail/mocktail bar",
      "Towel service included",
      "Limited capacity for privacy"
    ],
    image: "/images/vip-pool.svg"
  },
  {
    title: "The Harbor Restaurant",
    description: "A relaxing indoor dining area with a variety of Lebanese & international dishes.",
    hours: "11:00 AM – 6:00 PM",
    price: "Menu prices vary",
    features: [
      "Lebanese & international cuisine",
      "Covered seating with views",
      "Dine-in and takeaway options",
      "Family-friendly menu"
    ],
    image: "/images/restaurant.svg"
  },
  {
    title: "Dessert & Snack Bar",
    description: "Craving a sweet treat or a quick snack? We've got you covered.",
    hours: "12:00 PM – 6:30 PM",
    price: "Menu prices vary",
    features: [
      "Waffles, churros, crepes, ice cream",
      "Smoothies and cold drinks",
      "Seasonal specials available",
      "Conveniently located"
    ],
    image: "/images/dessert-bar.svg"
  },
  {
    title: "Boutique Shop",
    description: "Grab your summer essentials, souvenirs, or Waterland merch.",
    hours: "10:30 AM – 6:00 PM",
    price: "Various prices",
    features: [
      "Swimwear and accessories",
      "Waterland branded merchandise",
      "Summer essentials and sunblock",
      "Toys and floaties available"
    ],
    image: "/images/boutique.svg"
  }
];

const AttractionCard: React.FC<AttractionProps> = ({ 
  title, description, hours, price, features, image 
}) => {
  return (
    <Card className="h-full transition-all hover:shadow-lg hover:translate-y-[-2px]">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <Badge className="bg-[#0A4C8B]">{hours}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="text-[#0A4C8B]">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="font-semibold text-sm text-[#F86AA0]">Price:</p>
          <p>{price}</p>
        </div>
        <p className="font-semibold text-sm mb-2 text-[#0A4C8B]">Features:</p>
        <ul className="text-sm space-y-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <span className="text-[#FFD447] mr-2">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full hover:bg-[#0A4C8B] hover:text-white">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

const AttractionsSection: React.FC = () => {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A4C8B] mb-4 font-montserrat">
          Explore Our Attractions
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Discover the many exciting attractions and amenities that make Waterland the perfect 
          destination for a day of fun and relaxation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attractions.map((attraction, index) => (
          <AttractionCard key={index} {...attraction} />
        ))}
      </div>
    </div>
  );
};

export default AttractionsSection;