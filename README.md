# Pokedex

Responsywna aplikacja React wykorzystująca PokeAPI oraz JSON Server. Umożliwia przeglądanie Pokemonów, zarządzanie ulubionymi Pokemonami, przeprowadzanie walk, edycję danych i tworzenie własnych Pokemonów.

## Funkcje

- lista pierwszych 150 Pokemonów z PokeAPI
- wyszukiwanie i filtrowanie według typu
- paginacja po 15 Pokemonów
- dynamiczny widok szczegółów
- rejestracja, logowanie i wylogowanie
- odtwarzanie sesji przez LocalStorage
- chronione trasy
- dodawanie i usuwanie ulubionych
- Arena dla maksymalnie dwóch Pokemonów
- zapis wygranych, przegranych i doświadczenia
- ranking Pokemonów
- edycja istniejących Pokemonów
- tworzenie własnych Pokemonów
- jasny i ciemny motyw
- responsywny interfejs

## Technologie

- React
- Vite
- React Router
- Context API
- React Hook Form
- Zod
- notistack
- styled-components
- Material UI
- PokeAPI
- JSON Server

## Instalacja

npm install

## Uruchomienie

Aplikacja wymaga jednoczesnego uruchomienia Vite oraz JSON Servera.

W pierwszym terminalu:

npm run server

JSON Server będzie dostępny pod adresem:

http://localhost:3000

W drugim terminalu:

npm run dev

Adres aplikacji zostanie wyświetlony przez Vite, domyślnie:

http://localhost:5173

## Konto demonstracyjne

E-mail: demo@pokedex.pl
Hasło: Test123!

Konto służy do testowania funkcjonalności dostępnych dla zalogowanego użytkownika.

## Pozostałe polecenia

npm run build
npm run lint
npm run preview

## Dane

PokeAPI jest źródłem bazowych danych pierwszych 150 Pokemonów.

JSON Server przechowuje:

- `users` - użytkowników i referencje do ulubionych
- `pokemonOverrides` - lokalne zmiany Pokemonów z PokeAPI
- `customPokemons` - pełne dane Pokemonów utworzonych przez użytkownika

`PokemonProvider` łączy dane z PokeAPI, lokalne modyfikacje oraz customowe Pokemony w jedną kolekcję wykorzystywaną przez aplikację.

## Uwierzytelnianie

Autoryzacja jest symulacją opartą na JSON Server. LocalStorage przechowuje wyłącznie ID aktualnie zalogowanego użytkownika.
