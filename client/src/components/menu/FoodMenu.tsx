interface MenuItem {
  name: string;
  description: string;
  price: number;
}

interface MenuCategory {
  title: string;
  items: MenuItem[];
}

const starters: MenuItem[] = [
  {
    name: "Hummus Platter",
    description: "Creamy hummus served with warm pita bread and olive oil",
    price: 10
  },
  {
    name: "Mozzarella Sticks",
    description: "Crispy fried cheese sticks served with marinara sauce",
    price: 12
  },
  {
    name: "Buffalo Wings",
    description: "Spicy chicken wings with blue cheese dipping sauce",
    price: 14
  },
  {
    name: "Nachos Supreme",
    description: "Tortilla chips topped with cheese, jalapeños, guacamole, and sour cream",
    price: 16
  }
];

const burgers: MenuItem[] = [
  {
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, onion, and special sauce",
    price: 18
  },
  {
    name: "Chicken Sandwich",
    description: "Grilled chicken breast with avocado, bacon, and honey mustard",
    price: 16
  },
  {
    name: "Veggie Burger",
    description: "Plant-based patty with roasted peppers and pesto sauce",
    price: 15
  },
  {
    name: "Fish Sandwich",
    description: "Crispy fish fillet with tartar sauce and pickles",
    price: 17
  }
];

const platters: MenuItem[] = [
  {
    name: "Mixed Grill",
    description: "Assortment of grilled meats with rice and vegetables",
    price: 32
  },
  {
    name: "Seafood Platter",
    description: "Grilled fish, shrimp, and calamari with lemon herb sauce",
    price: 36
  },
  {
    name: "Lebanese Mezze",
    description: "Selection of traditional Lebanese appetizers and dips",
    price: 28
  },
  {
    name: "Family Pizza",
    description: "Large pizza with choice of toppings for the whole family",
    price: 24
  }
];

const menuCategories: MenuCategory[] = [
  {
    title: "Appetizers",
    items: starters
  },
  {
    title: "Burgers & Sandwiches",
    items: burgers
  },
  {
    title: "Platters",
    items: platters
  }
];

const FoodMenu = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {menuCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="bg-[#f5f1e9] rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-bold text-[#0a4b78] mb-4 font-montserrat">{category.title}</h3>
          
          {category.items.map((item, itemIndex) => (
            <div 
              key={itemIndex} 
              className={`mb-4 pb-4 ${
                itemIndex < category.items.length - 1 ? 'border-b border-gray-200' : 'mb-0'
              }`}
            >
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-[#0a4b78]">{item.name}</h4>
                <span className="font-bold text-[#6dcf94]">${item.price}</span>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default FoodMenu;
