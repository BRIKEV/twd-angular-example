import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { fetchTodos, createTodo, deleteTodo, type Todo } from '../../api/todos';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todos.component.html',
})
export class TodosComponent implements OnInit {
  protected todos = signal<Todo[]>([]);
  protected isLoading = signal(false);
  protected newTodo = signal({
    title: '',
    description: '',
    date: '',
  });

  async ngOnInit() {
    await this.loadTodos();
  }

  async loadTodos() {
    this.isLoading.set(true);
    try {
      const data = await fetchTodos();
      this.todos.set(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async handleCreateTodo() {
    const todo = this.newTodo();
    if (!todo.title || !todo.description || !todo.date) {
      return;
    }

    try {
      await createTodo({
        title: todo.title,
        description: todo.description,
        date: todo.date,
      });
      this.newTodo.set({
        title: '',
        description: '',
        date: '',
      });
      await this.loadTodos();
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  }

  async handleDeleteTodo(id: string) {
    try {
      await deleteTodo(id);
      await this.loadTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }

  updateTitle(value: string) {
    this.newTodo.update(todo => ({ ...todo, title: value }));
  }

  updateDescription(value: string) {
    this.newTodo.update(todo => ({ ...todo, description: value }));
  }

  updateDate(value: string) {
    this.newTodo.update(todo => ({ ...todo, date: value }));
  }
}
