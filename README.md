# Sample Python Application

A beautiful and modern Flask TODO web application with an attractive user interface.

## Features

- ✨ **Modern & Attractive UI** - Beautiful gradient design with smooth animations
- ✅ **Full CRUD Operations** - Create, read, update, and delete TODO items
- 🎨 **Interactive Web Interface** - Clean, responsive HTML/CSS/JavaScript frontend
- 📊 **Statistics Dashboard** - View total, active, and completed tasks
- 🔍 **Filter Functionality** - Filter todos by All, Active, or Completed
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- ⚡ **Real-time Updates** - Instant UI updates with smooth animations
- 🎯 **RESTful API** - Clean API design for backend integration
- 💾 **In-memory storage** (for demo purposes - easy to integrate with database)

## Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python app.py
```

The web application will be available at `http://localhost:5000`

Simply open your browser and navigate to the URL to start using the TODO app!

## Screenshots

The application features:
- **Gradient Background** - Beautiful purple gradient background
- **Card-based Design** - Modern card UI with shadows and hover effects
- **Smooth Animations** - Elegant transitions and animations throughout
- **Color-coded Status** - Visual indicators for task completion
- **Statistics Bar** - Real-time statistics showing total, active, and completed tasks
- **Filter Buttons** - Easy filtering between all, active, and completed tasks
- **Edit & Delete Actions** - Intuitive buttons for managing tasks

## Web Interface

The application provides a full-featured web interface where you can:
- Add new tasks with title and description
- Mark tasks as complete/incomplete
- Edit existing tasks
- Delete tasks
- Filter tasks by status
- View statistics

## API Endpoints

The backend also provides a RESTful API:

### Web Interface
- **GET** `/` - Serves the main web application

### TODO Operations
- **GET** `/todos` - Get all todos
- **POST** `/todos` - Create a new todo
  ```json
  {
    "title": "Sample task",
    "description": "Optional description"
  }
  ```
- **GET** `/todos/<id>` - Get a specific todo
- **PUT** `/todos/<id>` - Update a todo
  ```json
  {
    "title": "Updated title",
    "completed": true
  }
  ```
- **DELETE** `/todos/<id>` - Delete a todo

## Example Usage

### Create a TODO
```bash
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Python", "description": "Complete Python tutorial"}'
```

### Get all TODOs
```bash
curl http://localhost:5000/todos
```

### Update a TODO
```bash
curl -X PUT http://localhost:5000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

### Delete a TODO
```bash
curl -X DELETE http://localhost:5000/todos/1
```

## Notes

- This is a sample application using in-memory storage
- Data will be lost when the server restarts
- For production use, integrate with a database (PostgreSQL, MongoDB, etc.)
