import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

interface recipeSummary {
  name: string;
  cookTime: number;
  ingredients: requiredItem[];
}

// ==========================================================================
// ==== HTTP Endpoint Implementation ========================================
// ==========================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: Map<string, recipe | ingredient> = new Map();

// Task 1 helper (don't touch)
app.post("/parse", (req: Request, res: Response) => {
  const { input } = req.body;
  const parsed_string = parse_handwriting(input);
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  }
  res.json({ msg: parsed_string });
  return;
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 

const parse_handwriting = (recipeName: string): string | null => {
  if (recipeName == null || recipeName.trim().length === 0) {
    return null;
  }

  let parsedName = recipeName.replace(/[-_]/g, ' ');
  parsedName = parsedName.replace(/[^a-zA-Z\s]/g, '');
  parsedName = parsedName.replace(/\s+/g, ' ').trim();

  if (parsedName.length === 0) {
    return null;
  }
  parsedName = parsedName.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return parsedName;
};

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook

app.post("/entry", (req: Request, res: Response) => {
  const entry = req.body;

  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    return res.status(400).send({ error: "Invalid type" });
  }

  if (cookbook.has(entry.name)) {
    return res.status(400).send({ error: "Entry name must be unique" });
  }

  if (entry.type === "ingredient") {
    if (entry.cookTime < 0) {
      return res.status(400).send({ error: "cookTime must be >= 0" });
    }
    
    cookbook.set(entry.name, entry as ingredient);
  } 
  
  else if (entry.type === "recipe") {
    const recipe = entry as recipe;
    const itemNames = new Set();

    for (const item of recipe.requiredItems) {
      if (itemNames.has(item.name)) {
        return res.status(400).send({ error: "Recipe cannot have duplicates items" });
      }
      itemNames.add(item.name);
    }
    
    cookbook.set(recipe.name, recipe);
  }

  return res.status(200).json({});
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name

app.get("/summary", (req: Request, res: Response) => {
  const recipeName = req.query.name as string;
  
  if (!cookbook.has(recipeName)) {
    return res.status(400).send({ error: "Recipe not found" });
  }
  
  const entry = cookbook.get(recipeName);

  if (entry.type !== "recipe") {
    return res.status(400).send({ error: "Entry is not a recipe" });
  }
  
  try {
    const summary = calculateRecipeSummary(recipeName);
    return res.status(200).json(summary);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});


function calculateRecipeSummary(recipeName: string): recipeSummary {
  const entry = cookbook.get(recipeName);
  
  if (!entry) {
    console.log(`Recipe ${recipeName} not found`);
  }
  
  if (entry.type !== "recipe") {
    console.log(`${recipeName} is not a recipe`);
  }
  
  const recipe = entry as recipe;
  const ingredientMap = new Map();
  let totalCookTime = 0;
  
  for (const requiredItem of recipe.requiredItems) {
    const { name, quantity } = requiredItem;
    const item = cookbook.get(name);
    
    if (!item) {
      console.log(`Requred item ${name} not found.`);
    }
    
    if (item.type === "ingredient") {
      const ingredient = item as ingredient;
      const currentQuantity = ingredientMap.get(name) ;
      ingredientMap.set(name, currentQuantity + quantity);
      
      totalCookTime += ingredient.cookTime * quantity;
    } else {

      const subSummary = calculateRecipeSummary(name);

      totalCookTime += subSummary.cookTime * quantity;

      for (const ingredient of subSummary.ingredients) {
        const currentQuantity = ingredientMap.get(ingredient.name);
        ingredientMap.set(ingredient.name, currentQuantity + (ingredient.quantity * quantity));
      }
    }
  }
  
  const ingredients = Array.from(ingredientMap.entries()).map(([name, quantity]) => ({
    name,
    quantity
  }));
  
  return {
    name: recipeName,
    cookTime: totalCookTime,
    ingredients
  };
}

// ==========================================================================
// ==== DO NOT TOUCH ========================================================
// ==========================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});