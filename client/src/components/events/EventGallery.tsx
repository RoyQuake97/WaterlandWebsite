const eventImages = [
  {
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    alt: "Birthday party",
    title: "Birthday Parties"
  },
  {
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80",
    alt: "Corporate event",
    title: "Corporate Events"
  },
  {
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    alt: "Wedding celebration",
    title: "Celebrations"
  },
  {
    image: "https://images.unsplash.com/photo-1559465175-507d50d5a560?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    alt: "Private gathering",
    title: "Private Parties"
  }
];

const EventGallery = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {eventImages.map((image, index) => (
        <div 
          key={index}
          className="relative rounded-lg overflow-hidden h-64 group"
        >
          <img 
            src={image.image} 
            alt={image.alt} 
            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-[#0a4b78] bg-opacity-30 transition duration-300 group-hover:bg-opacity-50 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold font-montserrat">{image.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventGallery;
