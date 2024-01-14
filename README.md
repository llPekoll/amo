# Amo Test

## Technologies

- **Vite**: Used for serving with hot reload.
- **Three.js**: Employed for building the interface.
- **tween.js**: Used for object animation.

I opted for Three.js over using just CSS, finding it more versatile. Frontend frameworks like React or Svelte weren't used since all the crucial functionalities centered around Three.js.

## Installation

1. Clone the project:

    ```bash
    git clone https://github.com/llPekoll/amo
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Duplicate the `.env.example`, rename it to `.env`, and insert your Bing API key:

    ```bash
    VITE_BING_KEY=<YOUR_BING_KEY>
    ```

4. Launch the development server:

    ```bash
    npm run dev
    ```

## App Usage

- Scroll functionality is available to navigate both upward and downward.
- Hovering over an image will focus on it, bringing it to the forefront.
- Press the '**[esc]**' key to return to the normal view.
- You can also search for an image using the search bar.

## Project Structure

In the `src` folder:

- **main.ts**: Core of the app.
- **threeSetup.ts**: Setup of Three.js.
- **animations.ts**: File for animations.
- **postprocessingSetup.ts**: Postprocessing to add an outline effect.

## Areas for Improvement

I believe the presentation of the focused image can be improved over time. Some potential enhancements include:

- Finding a correct way to display only fetchable images.
- Tweaking the camera, image animations and the layout for row and column for responsivness.
- Consider splitting `main.ts` further (e.g., separating `drawWall` and event listeners into distinct files).

This is what I could achieve within the 8-hour timeframe.
