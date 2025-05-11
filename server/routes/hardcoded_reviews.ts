// This file contains authentic reviews provided by the client
// These are used as a fallback when the Google Places API doesn't provide enough reviews

export interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
  profile_photo_url: string;
}

export const hardcodedReviews: Review[] = [
  {
    author_name: "Antonella Hitti",
    rating: 5,
    text: "We really need to thank all the staff and managers of Waterland. Everything was great, the room, the service, the activities and the food. The room was so clean and neat, a beautiful view with such a relaxing environment. The pool and all the activities were so safe for the kids as they were many lifeguards around. Such a welcoming atmosphere and beautiful people who never missed a chance to make us as comfortable as possible.",
    relative_time_description: "10 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 10 * 30 * 24 * 60 * 60, // 10 months ago
    profile_photo_url: "https://ui-avatars.com/api/?name=Antonella+Hitti&background=random"
  },
  {
    author_name: "Warwar Sara",
    rating: 5,
    text: "The most beautiful water park in Lebanon, everything is organized and safe especially for children. The water is very clean, I spent a special day with my family, not only that, even the staff was wonderful in welcoming and the service was fast for requests. I highly recommend visiting it. As for me, I visit this wonderful place every year🥰",
    relative_time_description: "8 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 8 * 30 * 24 * 60 * 60, // 8 months ago
    profile_photo_url: "https://ui-avatars.com/api/?name=Warwar+Sara&background=random"
  },
  {
    author_name: "Oliver Saba",
    rating: 5,
    text: "This water resort is fantastic for both kids and adults! The environment is welcoming, and the staff shows great respect to all guests. The services are excellent, making sure everyone has a great time. I highly recommend this place for a fun and relaxing day out!",
    relative_time_description: "8 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 8 * 30 * 24 * 60 * 60 + 500, // 8 months ago (slightly different time)
    profile_photo_url: "https://ui-avatars.com/api/?name=Oliver+Saba&background=random"
  },
  {
    author_name: "Peter Boustany",
    rating: 5,
    text: "We went for 1 night but 2 days at a wonderful waterpark. The slides are very fun, safe and suitable for all ages. The rooms are very clean, rennovated and comfortable. The restaurant offers delicious food at acceptable prices! It was a very nice stay and we will surely come back!",
    relative_time_description: "8 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 8 * 30 * 24 * 60 * 60 + 1000, // 8 months ago (slightly different time)
    profile_photo_url: "https://ui-avatars.com/api/?name=Peter+Boustany&background=random"
  },
  {
    author_name: "Bidour Miligi",
    rating: 5,
    text: "Place is amazing! One of a kind in north Lebanon! Great place for everyone, kids will enjoy the day and adults can play too! Lot of big slides there 🤩 I will definitely visit the place again. Food and services are also good 👍",
    relative_time_description: "8 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 8 * 30 * 24 * 60 * 60 + 1500, // 8 months ago (slightly different time)
    profile_photo_url: "https://ui-avatars.com/api/?name=Bidour+Miligi&background=random"
  },
  {
    author_name: "Serena Azzi",
    rating: 5,
    text: "The best place in Lebanon for a summer getaway with friends or family! The facilities are clean, staff is always helpful, and the variety of slides makes it fun for everyone. The pools are well-maintained with excellent supervision. Will definitely be returning!",
    relative_time_description: "7 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 7 * 30 * 24 * 60 * 60, // 7 months ago
    profile_photo_url: "https://ui-avatars.com/api/?name=Serena+Azzi&background=random"
  },
  {
    author_name: "Michel Hayek",
    rating: 5,
    text: "A perfect day trip destination in North Lebanon! What impressed me most was how family-friendly and safe the environment is. The lifeguards are attentive, and the facilities are spotless. Great food options too - loved the seafood platter at the restaurant!",
    relative_time_description: "9 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 9 * 30 * 24 * 60 * 60, // 9 months ago
    profile_photo_url: "https://ui-avatars.com/api/?name=Michel+Hayek&background=random"
  },
  {
    author_name: "Rasha Khoury",
    rating: 5,
    text: "Absolutely loved our weekend stay at the resort! The rooms are spacious with breathtaking views. The water park has something for all ages - my kids couldn't get enough of the slides while I enjoyed the relaxation pool. Customer service is outstanding!",
    relative_time_description: "6 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 6 * 30 * 24 * 60 * 60, // 6 months ago
    profile_photo_url: "https://ui-avatars.com/api/?name=Rasha+Khoury&background=random"
  },
  {
    author_name: "Elie Mansour",
    rating: 5,
    text: "The best waterpark I've visited in Lebanon! The variety of attractions is impressive - from thrilling slides for the adventurous to shallow pools for the little ones. Had a fantastic day with my family. The staff is friendly and professional. Can't wait to go back!",
    relative_time_description: "5 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 5 * 30 * 24 * 60 * 60, // 5 months ago
    profile_photo_url: "https://ui-avatars.com/api/?name=Elie+Mansour&background=random"
  },
  {
    author_name: "Layla Abou Zeid",
    rating: 5,
    text: "Celebrated my son's birthday at Waterland and it was a hit! The staff went above and beyond to make it special. The cleanliness of the facilities is impressive - you can tell safety and hygiene are priorities. Food was delicious too. Highly recommend for family events!",
    relative_time_description: "7 months ago",
    time: Math.floor(new Date().getTime() / 1000) - 7 * 30 * 24 * 60 * 60 + 200, // 7 months ago (slightly different time)
    profile_photo_url: "https://ui-avatars.com/api/?name=Layla+Abou+Zeid&background=random"
  }
];