interface DrinkIngredient {
  name: string;
}

interface Drink {
  name: string;
  ingredients: DrinkIngredient[];
  description: string;
  image: string;
}

const cocktails: Drink[] = [
  {
    name: "Blue Lagoon",
    ingredients: [
      { name: "Vodka" },
      { name: "Blue Curaçao" },
      { name: "Lemonade" }
    ],
    description: "Refreshing blue cocktail perfect for poolside sipping",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1157&q=80"
  },
  {
    name: "Classic Mojito",
    ingredients: [
      { name: "White Rum" },
      { name: "Mint" },
      { name: "Lime" }
    ],
    description: "Refreshing mint and lime classic with a rum kick",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  },
  {
    name: "Piña Colada",
    ingredients: [
      { name: "White Rum" },
      { name: "Coconut Cream" },
      { name: "Pineapple Juice" }
    ],
    description: "Tropical blend of rum, coconut, and pineapple",
    image: "https://images.unsplash.com/photo-1607446045710-d5a8fd0f13ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
  },
  {
    name: "Mango Daiquiri",
    ingredients: [
      { name: "White Rum" },
      { name: "Mango Puree" },
      { name: "Lime Juice" }
    ],
    description: "Sweet and tangy frozen rum cocktail with fresh mango",
    image: "https://images.unsplash.com/photo-1620091990682-526649770532?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
  }
];

const mocktails: Drink[] = [
  {
    name: "Virgin Colada",
    ingredients: [
      { name: "Pineapple" },
      { name: "Coconut" },
      { name: "Cream" }
    ],
    description: "Tropical non-alcoholic twist on the classic piña colada",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  },
  {
    name: "Berry Splash",
    ingredients: [
      { name: "Mixed Berries" },
      { name: "Mint" },
      { name: "Soda" }
    ],
    description: "Refreshing blend of fresh berries with mint and sparkling water",
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
  },
  {
    name: "Cucumber Fizz",
    ingredients: [
      { name: "Cucumber" },
      { name: "Lime" },
      { name: "Mint" }
    ],
    description: "Cool and refreshing cucumber drink with a hint of mint",
    image: "https://images.unsplash.com/photo-1570696516188-ade861b84a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
  },
  {
    name: "Tropical Sunrise",
    ingredients: [
      { name: "Orange Juice" },
      { name: "Pineapple Juice" },
      { name: "Grenadine" }
    ],
    description: "Vibrant and fruity sunrise-colored alcohol-free delight",
    image: "https://images.unsplash.com/photo-1539573196710-5d64bb05ad8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80"
  }
];

const DrinkMenu = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Cocktails */}
      <div>
        <h3 className="text-2xl font-bold text-[#0a4b78] mb-6 font-montserrat">Cocktails</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cocktails.map((drink, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105"
            >
              <img 
                src={drink.image} 
                alt={drink.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-[#0a4b78] mb-2">{drink.name}</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {drink.ingredients.map((ingredient, i) => (
                    <span 
                      key={i} 
                      className="inline-block bg-[#00c6ff] bg-opacity-10 text-[#00c6ff] px-2 py-1 rounded-full text-xs"
                    >
                      {ingredient.name}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{drink.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mocktails */}
      <div>
        <h3 className="text-2xl font-bold text-[#0a4b78] mb-6 font-montserrat">Mocktails</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {mocktails.map((drink, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 transform hover:scale-105"
            >
              <img 
                src={drink.image} 
                alt={drink.name} 
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-lg font-bold text-[#0a4b78] mb-2">{drink.name}</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {drink.ingredients.map((ingredient, i) => (
                    <span 
                      key={i} 
                      className="inline-block bg-[#6dcf94] bg-opacity-10 text-[#6dcf94] px-2 py-1 rounded-full text-xs"
                    >
                      {ingredient.name}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{drink.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrinkMenu;
