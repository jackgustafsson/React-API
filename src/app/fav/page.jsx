'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

// Function to get favourites from localStorage
const getFromLocalStorage = () => {
  const storedFavourites = localStorage.getItem('favourites');
  return storedFavourites ? JSON.parse(storedFavourites) : [];
};

// Function to save favourites to localStorage
const saveToLocalStorage = (items) => {
  localStorage.setItem('favourites', JSON.stringify(items));
};

export default function Favourites() {
  const { currentUser } = useAuth(); // Access currentUser from context
  const [favourites, setFavourites] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State to store search input

  // Check localStorage for saved session and redirect if not authenticated
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!savedUser) {
      window.location.href = '/login'; // Redirect to login page if no user is found in localStorage
    }
  }, []);

  // useEffect to load favourites from localStorage when the component mounts
  useEffect(() => {
    const savedFavourites = getFromLocalStorage();
    setFavourites(savedFavourites);
  }, []);

  // Function to remove a Pokémon from favourites
  const removeFromFavourites = (pokemonId) => {
    const updatedFavourites = favourites.filter((pokemon) => pokemon.id !== pokemonId);
    setFavourites(updatedFavourites);
    saveToLocalStorage(updatedFavourites);
  };

  const filteredFavourites = favourites.filter((pokemon) =>
    pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div id="favourites-container">
      <h1>Your Favourite Pokémon</h1>
      <input
        type="text"
        placeholder="Search Favourites..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
      />
      {favourites.length === 0 ? (
        <p>No favourite pokemons added</p>
      ) : filteredFavourites.length === 0 ? (
        <p>No favourite Pokémon matching the search.</p>
      ) : (
        filteredFavourites.map((data) => {
          const abilities = data.abilities.map((a) => a.ability.name).join(', ');
          const height = data.height / 10; // Height in meters
          const weight = data.weight / 10; // Weight in kg
          return (
            <div key={data.id} className="pokemon">
              <h2>{data.name}</h2>
              <img src={data.sprites.front_default} alt={data.name} />
              <p>Abilities: {abilities}</p>
              <p>Height: {height} m, Weight: {weight} kg</p>
              <button onClick={() => removeFromFavourites(data.id)}>
                -
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}