# Data Model: Physical AI Textbook

## Entity: Textbook
- **name**: Physical AI — AI-Native Textbook
- **description**: Comprehensive textbook for beginners-to-intermediate learners on Physical AI
- **chapters_count**: 8
- **lessons_per_chapter**: 5
- **total_lessons**: 40
- **target_audience**: Beginners-to-intermediate learners
- **approach**: Simulation-first, specification-driven
- **language_level**: Beginner-friendly

## Entity: Chapter
- **id**: String (e.g., "chapter_1", "chapter_2", etc.)
- **title**: String (chapter title)
- **description**: String (1-2 line description)
- **lessons**: Array of Lesson entities
- **order**: Integer (1-8)
- **learning_progression**: String (indicates skill building level)

### Chapter Relationships:
- Contains 5 Lesson entities
- Belongs to 1 Textbook entity

## Entity: Lesson
- **id**: String (e.g., "lesson_1_1", "lesson_2_3", etc.)
- **title**: String (lesson title)
- **sidebar_label**: String (shortened title for navigation)
- **description**: String (2-line summary)
- **learning_objectives**: Array of strings (3-5 objectives)
- **overview**: String (intro paragraph)
- **theory**: String (concept explanation)
- **hands_on_exercise**: String (step-by-step instructions)
- **summary**: Array of strings (key takeaways)
- **references**: Array of strings (optional links/resources)
- **chapter_id**: String (parent chapter)
- **order**: Integer (1-5 within chapter)

### Lesson Relationships:
- Belongs to 1 Chapter entity
- Contains structured content sections

## Entity: ContentSection
- **type**: String (learning_objectives, overview, theory, hands_on_exercise, summary, references)
- **content**: String (section content)
- **lesson_id**: String (parent lesson)
- **required**: Boolean (whether section is mandatory)

### ContentSection Relationships:
- Belongs to 1 Lesson entity

## Entity: Navigation
- **textbook_index**: File path to index.md
- **chapter_paths**: Array of directory paths
- **lesson_paths**: Array of file paths
- **sidebar_structure**: Hierarchical structure for Docusaurus sidebar
- **url_friendly_names**: Array of URL-compatible names

### Navigation Relationships:
- References all Chapter and Lesson entities

## Validation Rules:
1. Each Chapter must have exactly 5 lessons
2. Each Lesson must have all required sections (Learning Objectives through References)
3. All content must use beginner-friendly language
4. Each Lesson must follow simulation-first approach
5. Content must align with Physical AI constitution principles
6. YAML frontmatter must be present in each lesson file
7. File names must be URL-friendly and follow naming convention
8. All lessons must include hands-on exercises with AI agent collaboration

## State Transitions:
- **Draft**: Initial content creation state
- **Reviewed**: Content reviewed for quality and accuracy
- **Validated**: Content validated against constitution and requirements
- **Complete**: Content finalized and ready for deployment