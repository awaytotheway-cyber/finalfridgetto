import type { Recipe } from './types';

const apiKey = (import.meta.env.VITE_GROQ_API_KEY as string | undefined)?.trim();

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey && apiKey.length > 10);
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const TEXT_MODEL = 'llama-3.1-8b-instant';
const VISION_MODEL = 'llama-3.2-90b-vision-preview';

const RECIPE_JSON_SCHEMA = `{
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "title": { "type": "string" },
      "description": { "type": "string" },
      "cuisine": { "type": "string" },
      "prepTimeMinutes": { "type": "integer" },
      "cookTimeMinutes": { "type": "integer" },
      "servings": { "type": "integer" },
      "ingredients": { "type": "array", "items": { "type": "string" } },
      "essentialIngredients": { "type": "array", "items": { "type": "string" } },
      "replaceableIngredients": { "type": "array", "items": { "type": "string" } },
      "substitutions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "original": { "type": "string" },
            "substitute": { "type": "string" }
          }
        }
      },
      "steps": { "type": "array", "items": { "type": "string" } },
      "macros": {
        "type": "object",
        "properties": {
          "protein": { "type": "integer" },
          "carbs": { "type": "integer" },
          "fat": { "type": "integer" },
          "calories": { "type": "integer" }
        }
      }
    },
    "required": ["title", "description", "cuisine", "prepTimeMinutes", "cookTimeMinutes", "servings", "ingredients", "steps", "macros"]
  }
}`;

const SINGLE_RECIPE_SCHEMA = `{
  "type": "object",
  "properties": {
    "title": { "type": "string" },
    "description": { "type": "string" },
    "cuisine": { "type": "string" },
    "prepTimeMinutes": { "type": "integer" },
    "cookTimeMinutes": { "type": "integer" },
    "servings": { "type": "integer" },
    "ingredients": { "type": "array", "items": { "type": "string" } },
    "essentialIngredients": { "type": "array", "items": { "type": "string" } },
    "replaceableIngredients": { "type": "array", "items": { "type": "string" } },
    "substitutions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "original": { "type": "string" },
          "substitute": { "type": "string" }
        }
      }
    },
    "steps": { "type": "array", "items": { "type": "string" } },
    "macros": {
      "type": "object",
      "properties": {
        "protein": { "type": "integer" },
        "carbs": { "type": "integer" },
        "fat": { "type": "integer" },
        "calories": { "type": "integer" }
      }
    }
  },
  "required": ["title", "description", "cuisine", "prepTimeMinutes", "cookTimeMinutes", "servings", "ingredients", "steps", "macros"]
}`;

async function callGroq(messages: Array<Record<string, unknown>>, model: string): Promise<string> {
  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq API.');
  return content;
}

export async function generateRecipes(
  ingredients: string[],
  dietaryFilters: string[]
): Promise<Recipe[]> {
  if (!isGeminiConfigured()) {
    throw new Error('Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const filterText = dietaryFilters.length > 0
    ? `The recipes must strictly follow these dietary restrictions: ${dietaryFilters.join(', ')}.`
    : 'No specific dietary restrictions.';

  const systemPrompt = `You are a world-class culinary AI. You must respond with ONLY valid JSON, no markdown, no explanation. The response must be a JSON object with a "recipes" key containing an array of exactly 3 recipe objects matching this schema: ${RECIPE_JSON_SCHEMA}`;

  const userPrompt = `Generate exactly 3 creative, delicious recipes using these ingredients as the primary base.

Available ingredients: ${ingredients.join(', ')}

${filterText}

For each recipe provide: title, description, cuisine, prepTimeMinutes, cookTimeMinutes, servings, ingredients (including pantry staples), essentialIngredients (core, cannot skip), replaceableIngredients (can substitute or omit), substitutions (array of {original, substitute} pairs), steps (clear instructions), and macros (protein, carbs, fat, calories per serving).

Return a JSON object: {"recipes": [recipe1, recipe2, recipe3]}`;

  const content = await callGroq(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    TEXT_MODEL
  );

  const parsed = JSON.parse(content);
  const recipes = parsed.recipes ?? (Array.isArray(parsed) ? parsed : [parsed]);
  return recipes.map(normalizeRecipe);
}

export async function analyzeDishImage(base64Image: string, mimeType: string): Promise<Recipe> {
  if (!isGeminiConfigured()) {
    throw new Error('Groq API key not configured. Add VITE_GROQ_API_KEY to your .env file.');
  }

  const systemPrompt = `You are a world-class culinary AI with vision capabilities. You must respond with ONLY valid JSON, no markdown, no explanation. The response must be a single recipe JSON object matching this schema: ${SINGLE_RECIPE_SCHEMA}`;

  const userPrompt = `Analyze the dish in the provided image and reverse-engineer a complete recipe.

Provide: title, description, cuisine, prepTimeMinutes, cookTimeMinutes, servings, ingredients, essentialIngredients (core, cannot skip), replaceableIngredients (can substitute or omit), substitutions (array of {original, substitute} pairs), steps, and macros (protein, carbs, fat, calories per serving).

Return a single JSON object matching the schema.`;

  const content = await callGroq(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userPrompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    VISION_MODEL
  );

  const parsed = JSON.parse(content);
  return normalizeRecipe(Array.isArray(parsed) ? parsed[0] : parsed);
}

function normalizeRecipe(raw: Record<string, unknown>): Recipe {
  return {
    title: String(raw.title ?? 'Untitled Recipe'),
    description: String(raw.description ?? ''),
    cuisine: String(raw.cuisine ?? 'Unknown'),
    prepTimeMinutes: Number(raw.prepTimeMinutes ?? 10),
    cookTimeMinutes: Number(raw.cookTimeMinutes ?? 20),
    servings: Number(raw.servings ?? 2),
    ingredients: Array.isArray(raw.ingredients) ? raw.ingredients.map(String) : [],
    essentialIngredients: Array.isArray(raw.essentialIngredients) ? raw.essentialIngredients.map(String) : [],
    replaceableIngredients: Array.isArray(raw.replaceableIngredients) ? raw.replaceableIngredients.map(String) : [],
    substitutions: Array.isArray(raw.substitutions)
      ? raw.substitutions.map((s: Record<string, unknown>) => ({
          original: String(s.original ?? ''),
          substitute: String(s.substitute ?? ''),
        }))
      : [],
    steps: Array.isArray(raw.steps) ? raw.steps.map(String) : [],
    macros: {
      protein: Number((raw.macros as Record<string, unknown>)?.protein ?? 0),
      carbs: Number((raw.macros as Record<string, unknown>)?.carbs ?? 0),
      fat: Number((raw.macros as Record<string, unknown>)?.fat ?? 0),
      calories: Number((raw.macros as Record<string, unknown>)?.calories ?? 0),
    },
  };
}
