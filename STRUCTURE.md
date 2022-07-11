# Folder structure

# src

All source files are to be contained within this folder. This includes images/static files

## common
Reusable code that isn't in a module (see below for more details)

### components
Reusable, single components such as the navbar, footer, etc.

### hooks
React functional hooks

### types
Typescript typings not related to a module, used throughout

### utilities
General utilities

## modules
Specific modules that do something are grouped here with all their types, etc

### auth (example module)
Stuff related to authentication

**types**

Types for this module

**components**

Components for this module

## pages
NextJS pages folder

### api
NextJS api folder

## public
NextJS public folder

## styles
Use tailwind, don't use this