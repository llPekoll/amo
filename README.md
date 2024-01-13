# Amo Test

### Technologies

**Vite**: Used for serving with hot reload.
**Three.js**: Employed for building the interface.
**tween.js**: Used for object animation.

I opted for Three.js over using just CSS, as I found it to be more versatile. I didn't utilize frontend frameworks like React or Svelte since all the crucial functionalities were centered around Three.js.

### Installation
Clone the project:

```bash
git clone https://github.com/llPekoll/amo
```
Install dependencies:

```bash

npm install
```
Duplicate the .env.exemple rename it .env and insert your Bing API key:

```bash

VITE_BING_KEY=<YOUR_BING_KEY>
```
Launch the development server:

```bash
npm run dev
```
### App Usage
Scroll functionality is available to navigate both upward and downward.
Hovering over an image will focus on it, bringing it to the forefront.
Press the '**[esc]**' key to return to the normal view.


### Structure
Simple code we do have 1 html file and a js file


### What can be improuved
I think the way of presenting the focus image can be improuved in varrious way, using tweak or really change the way to put the image upfront, many in another scene, some ereasearch need to be done on that regard.
I chose to use
