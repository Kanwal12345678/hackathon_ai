# Textbook Chapters Component

A responsive, animated component for displaying textbook chapters with a futuristic Physical AI theme.

## Features

- 🎨 Dark glassmorphism design with pink/purple gradient accents
- 📱 Fully responsive layout (mobile, tablet, desktop)
- ✨ Hover animations with glow effects
- 🎯 Gradient text and subtle shadows
- 🔄 Smooth transitions and interactive elements

## Usage

### In Docusaurus Pages

```jsx
import TextbookChapters from '@site/src/components/TextbookChapters/TextbookChapters';

function MyPage() {
  return (
    <div>
      <TextbookChapters />
    </div>
  );
}
```

### In Markdown Files

```md
import TextbookChapters from '@site/src/components/TextbookChapters/TextbookChapters';

<TextbookChapters />
```

## Design Elements

- **Main Heading**: "Textbook Chapters" with pink → purple gradient text and subtle glow
- **Sub-heading**: "8 comprehensive modules covering Physical AI & AI Native" in muted color
- **Cards**: Dark glassmorphism style with rounded corners and gradient borders
- **Hover Effects**: Cards lift up, glow intensifies, and subtle scale animation
- **Icons**: Emoji icons for visual appeal
- **Buttons**: Gradient "Read Chapter →" buttons with hover effects

## Responsive Grid

- 1 column on mobile
- 2 columns on tablet
- 2 columns on small desktop
- 4 columns on large desktop

## Dependencies

- React
- Tailwind CSS (with proper configuration in Docusaurus)