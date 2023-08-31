import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();
const BASE_URL = "http://localhost:9000";
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

export function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the cities",
        });
      }
    }
    fetchCities();
  }, []);

  function getCity(id) {
    if (Number(id) === currentCity.id) return;
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city",
        });
      }
    }
    fetchCities();
  }

  function createCity(newCity) {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities`, {
          method: "POST",
          body: JSON.stringify(newCity),
          headers: { "Content-type": "application/json" },
        });
        const data = await response.json();
        dispatch({ type: "cities/created", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "There was an error creating the city",
        });
      }
    }
    fetchCities();
  }

  function deleteCity(id) {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        await fetch(`${BASE_URL}/cities/${id}`, {
          method: "DELETE",
        });
        dispatch({ type: "cities/deleted", payload: id });
      } catch (error) {
        alert("There was an error deleting the city");
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
