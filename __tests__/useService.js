import React from 'react';
import { mount } from 'enzyme';

import { getService, useService } from '../index';

describe('useService', () => {
  it('should instantiate & initialize service instance', () => {
    const app = mount(<TodoApp />);

    const count = app.find('#count');
    expect(count.text()).toBe('0');
  });

  it('add', () => {
    const app = mount(<TodoApp />);
    const todoService = getService(TodoService);

    todoService.add('eat');

    const count = app.find('#count');
    expect(count.text()).toBe('1');
  });

  it('should trigger component update after Array.push()', () => {
    class Service {
      constructor() { this.items = []; }
      exec_push() { this.items.push(1); }
    }
    const Component = () => {
      const service = useService(Service);
      return (
        <div id="value">
          {service.items.length}
        </div>
      );
    };

    const app = mount(<Component />);
    const value = app.find('#value');
    expect(value.text()).toBe('0');

    const service = getService(Service);
    service.exec_push();
    expect(value.text()).toBe('1');
  });

  it('should not trigger component update with `__peek`', () => {
    class Service {
      constructor() { this.v = 0; }
      hit() { this.v += 1; }
    }
    const Component = () => {
      const service = useService(Service);
      return (
        <div id="value">
          {service.__peek(() => service.v)}
        </div>
      );
    };

    const app = mount(<Component />);
    const value = app.find('#value');
    expect(value.text()).toBe('0');

    const service = getService(Service);
    service.hit();
    expect(value.text()).toBe('0');
  });
});

class TodoService {
  constructor() {
    this.tasks = [];
  }

  get length() {
    return this.tasks.length;
  }

  add(task) {
    this.tasks = [...this.tasks, task];
  }
}

const TodoApp = () => {
  const todoService = useService(TodoService);

  return (
    <>
      <div id="count">
        {todoService.length}
      </div>
      <div id="tasks">
        {todoService.tasks.map(x => (
          <div>
            {x}
          </div>
        ))}
      </div>
    </>
  )
};