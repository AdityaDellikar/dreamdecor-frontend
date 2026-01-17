// src/utils/favourites.js

const FAV_KEY = "favourites";

/* Load favourites */
export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

/* Save favourites */
export function saveFavourites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

/* Toggle favourite */
export function toggleFavourite(id) {
  const favs = getFavourites();
  let updated;

  if (favs.includes(id)) {
    updated = favs.filter((fid) => fid !== id);
  } else {
    updated = [...favs, id];
  }

  saveFavourites(updated);
  return updated;
}

/* Check if product is favourite */
export function isFavourite(id) {
  const favs = getFavourites();
  return favs.includes(id);
}