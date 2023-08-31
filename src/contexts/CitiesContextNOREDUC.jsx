import { createContext, useContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";

export function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        alert("problem fetching");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  function getCity(id) {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        setCurrentCity(data);
      } catch (error) {
        alert("problem fetching");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }

  function createCity(newCity) {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: { "Content-type": "application/json" },
        });
        const data = await response.json();
        setCities((cities) => [...cities, data]);
      } catch (error) {
        alert("There was an error creating the city");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }

  function deleteCity(id) {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        setCities((cities) => cities.filter((city) => city.id !== id));
      } catch (error) {
        alert("There was an error deleting the city");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext is being accessed from outside");
  return context;
}
