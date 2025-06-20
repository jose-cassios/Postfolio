# Frontend Documentation

## Project Structure

The `src` directory contains the core source code for the frontend application.

- **`main.tsx`**: The main entry point of the application. It initializes React and renders the root `App` component.
- **`app.tsx`**: Defines the root `App` component, including the main routing structure using `react-router-dom`.
- **`index.css`**: Global stylesheet for the application. It likely contains base styles and Tailwind CSS imports.
- **`vite-env.d.ts`**: TypeScript definitions for Vite environment variables.
- **`components/`**: This directory contains reusable UI components used throughout the application.
  - **`ParticleComponent.tsx`**: A component likely responsible for rendering particle effects.
  - **`projects/`**: Contains components related to displaying projects.
    - **`ProjectCard.tsx`**: A component to display individual project information.
    - **`ProjectCarousel.tsx`**: A component to display multiple projects in a carousel format.
    - **`useProjects.ts`**: A custom hook likely responsible for fetching or managing project data.
- **`hooks/`**: This directory contains custom React hooks that encapsulate reusable logic.
  - **`useUnsplashImage.ts`**: A custom hook likely used to fetch or interact with images from Unsplash.
- **`layouts/`**: This directory contains components that define the overall layout or structure of pages (e.g., headers, footers, sidebars).
  - **`Header.tsx`**: A component for the application's header/navigation bar.
- **`pages/`**: This directory contains the top-level components for different pages or views of the application.
  - **`Home.tsx`**: The component for the home page.
  - **`Login.tsx`**: The component for the login page.

The `public/` directory (outside `src/`) contains static assets that are served directly by the web server.

The `vite.config.ts` file at the root of `src/front-end/` configures the Vite build tool.

## Components

This section describes the reusable UI components found in `src/components/`.

### `ParticleComponent.tsx`

- **Purpose**: Renders an animated particle background using the `@tsparticles/react` library. This component adds a dynamic visual effect to the user interface.
- **Props**: This component does not accept any props.
- **Usage**: It can be included in any page or layout component where a particle background is desired.

  ```tsx
  import ParticleComponent from './components/ParticleComponent';

  // Inside a component's render method:
  <ParticleComponent />
  ```

### `projects/ProjectCard.tsx`

- **Purpose**: Displays information about a single project. It features a card with a front and back view that flips on hover.
  - The front typically shows the project title, user's role, and a relevant image.
  - The back provides more detailed content and a contact button (email).
- **Props**:
  - `title: string`: The title of the project.
  - `role: string`: The role undertaken in the project.
  - `frontImage: string`: URL or path to the image displayed on the front of the card.
  - `backContent: string`: Text content displayed on the back of the card.
  - `portfolioLink: string`: (Currently commented out in the source but defined in props) A URL to the project's portfolio or live version.
  - `emailContact: string`: Email address for contact related to the project.
- **Usage**: This component is primarily used by `ProjectCarousel` to render individual project cards.

  ```tsx
  import ProjectCard from './components/projects/ProjectCard';

  <ProjectCard
    title="My Awesome Project"
    role="Lead Developer"
    frontImage="path/to/image.png"
    backContent="Detailed description of the project and my contributions."
    portfolioLink="https://example.com/portfolio/project"
    emailContact="contact@example.com"
  />
  ```

### `projects/ProjectCarousel.tsx`

- **Purpose**: Displays a collection of projects in a horizontally scrollable carousel format. It utilizes the `keen-slider` library for its functionality, including looping, free-scroll mode, and responsive adjustments for different screen sizes. The carousel also features an autoplay mechanism.
- **Props**:
  - `projects: Project[]`: An array of project objects. Each object should conform to the following type:
    ```typescript
    type Project = {
      title: string;
      role: string;
      frontImage: string;
      backContent: string;
      portfolioLink: string;
      emailContact: string;
    };
    ```
- **Usage**: Used to showcase multiple projects in a visually appealing and interactive manner.

  ```tsx
  import ProjectCarousel from './components/projects/ProjectCarousel';

  const myProjects = [
    // ... array of project objects
  ];

  <ProjectCarousel projects={myProjects} />
  ```

## Pages

This section describes the top-level page components found in `src/pages/`. These components are typically rendered based on the application's routing.

### `Home.tsx`

- **Purpose**: Serves as the main landing page for the "Portfolio Competition" application.
- **Functionality**:
  - Displays a header section (via the `Header` layout component).
  - Incorporates the `ParticleComponent` for an animated background.
  - Provides information about the competition, including its objectives, participant criteria, and evaluation metrics.
  - Features call-to-action buttons like "Veja os competidores" (See Competitors) and "Participe da competição" (Join the Competition).
  - Showcases participant projects using the `ProjectCarousel` component. The data for these projects is currently hardcoded within this page.
- **Route**: `/` (Root path)

### `Login.tsx`

- **Purpose**: Provides the user interface for authentication.
- **Functionality**:
  - Presents a login form with input fields for username and password.
  - Includes a "Forgot my password" link and a "Remember me" checkbox.
  - Features a prominent "Entrar" (Login) button.
  - The page has a distinct visual design with a two-panel layout (a branding panel and a form panel) and uses glassmorphism effects.
  - **Styling**: A significant portion of the styling for this page is self-contained. It's defined within a `PageStyles` sub-component that injects CSS directly into the document's head using a `<style>` tag. This includes custom CSS properties, animations, and layout rules.
  - **Note**: As of the current version, the login form is primarily a UI representation and does not implement actual authentication logic or API integration.
- **Route**: `/login`

## Hooks

This section describes custom React hooks used in the application to encapsulate reusable stateful logic.

### `components/projects/useProjects.ts`

- **Purpose**: This file appears to be an initial attempt at creating a custom hook for fetching or managing project data.
- **Current State**:
  - The primary hook logic within a `useProjects` function is currently commented out.
  - The file exports a hardcoded array of two project objects. This array is not a hook itself and is not currently consumed by other parts of the application (e.g., the `Home` page uses its own local `projects` array).
- **Note**: This hook might be a remnant of earlier development or an incomplete feature.

### `hooks/useUnsplashImage.ts`

- **Purpose**: A custom hook to fetch a random image URL from the Unsplash API based on a provided query.
- **Functionality**:
  - Accepts a `query: string` argument to specify the type of image to search for.
  - Manages state for the fetched image URL.
  - Fetches image data from `https://api.unsplash.com/photos/random` when the component mounts or the `query` changes.
  - Returns the URL of the fetched image (regular size).
  - Includes basic error handling, logging any fetch errors to the console.
- **Parameters**:
  - `query: string`: The search term for the Unsplash API (e.g., "technology", "nature").
- **Returns**:
  - `string | null`: The URL of the fetched Unsplash image, or `null` if the image is not yet loaded or if an error occurred during fetching.
- **Usage**:

  ```tsx
  import useUnsplashImage from './hooks/useUnsplashImage';

  function MyComponent() {
    const imageUrl = useUnsplashImage('nature');

    if (!imageUrl) {
      return <p>Loading image...</p>;
    }

    return <img src={imageUrl} alt="Random Unsplash Nature Image" />;
  }
  ```
- **Important**: This hook contains a hardcoded Unsplash `ACCESS_KEY`. For production environments, API keys should be managed securely, typically through environment variables.

## Styling

The project employs a multi-layered approach to styling, primarily leveraging Tailwind CSS, with global styles and some component-specific CSS.

### 1. Tailwind CSS

- **Primary Framework**: Tailwind CSS is the main styling framework. Utility classes are applied directly within the JSX of components to build up designs.
- **Configuration (`tailwind.config.js`)**:
  - **Content Watching**: Tailwind is configured to scan `index.html` and all `.js`, `.ts`, `.jsx`, and `.tsx` files within the `src/` directory for class names to generate the necessary CSS.
  - **Theme Customization**: The default Tailwind theme is extended with:
    - Custom color palettes: `dark` (pink, black, blue) and `light` (pink, white, blue).
    - A custom background image: `pattern` (defined as `url(/bg.png)`).
    - A default sans-serif font: `Inter`.
    - A custom box shadow style: `shape`.
  - **Plugins**: No external Tailwind CSS plugins are currently in use.

### 2. Global Stylesheet (`src/index.css`)

- **Tailwind Integration**: This file is responsible for importing Tailwind's `base`, `components`, and `utilities` layers.
- **Base Styles**:
  - Sets a global `min-width: 0` for all elements.
  - Ensures `html` and `body` take up at least 100% of the viewport height and enable vertical scrolling.
- **Custom Scrollbar**: Includes custom CSS for styling scrollbars in Webkit-based browsers (e.g., Chrome, Safari), affecting the thumb, track, and hover states.
- **Custom Utility Classes**:
  - Several custom utility classes are defined here to supplement Tailwind, particularly for 3D transform effects used in components like `ProjectCard.tsx`:
    - `.perspective`: Applies `perspective: 1000px;`
    - `.transform-style`: Applies `transform-style: preserve-3d;`
    - `.backface-hidden`: Applies `backface-visibility: hidden;` (Note: This class definition is duplicated in the file).
    - `.rotate-y-180`: Applies `transform: rotateY(180deg);`
  - `.no-scrollbar`: A utility to hide scrollbars on elements.

### 3. Component-Specific Styles (e.g., `Login.tsx`)

- **Encapsulated Styles**: The `Login.tsx` page is a notable example of component-specific styling. It defines its own CSS rules directly within the component file using a `<style>` tag (via a `PageStyles` sub-component).
- **Approach**: This method is used for styles that are unique and complex to that specific page, including CSS custom properties for theming that page, intricate layout rules, and animations (like `moveGradient` and `fadeInUp`). This keeps the highly specialized styling for the login page separate from global styles or Tailwind utilities.

### General Styling Workflow

1.  Utilize Tailwind CSS utility classes for most styling needs directly in components.
2.  For global style overrides, base element styling, or custom utilities that are broadly applicable, modify `src/index.css`.
3.  For complex, component-unique styles that might be cumbersome to achieve with Tailwind alone or need fine-grained control, consider embedded styles as seen in `Login.tsx`, though this should be used judiciously to maintain overall style consistency.
