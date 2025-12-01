Here's how to bind to an `<input>` in Angular (including Angular 20):

## 1. Two-Way Binding with `[(ngModel)]` (FormsModule)

**app.component.ts:**
```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  username: string = '';
  email: string = '';
}
```

**app.component.html:**
```html
<input type="text" [(ngModel)]="username" placeholder="Enter username">
<p>Username: {{ username }}</p>

<input type="email" [(ngModel)]="email" placeholder="Enter email">
<p>Email: {{ email }}</p>
```

## 2. Two-Way Binding with Signals (Angular 20 - Modern Approach)

**app.component.ts:**
```typescript
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  username = signal('');
  email = signal('');
}
```

**app.component.html:**
```html
<input type="text" [(ngModel)]="username" placeholder="Enter username">
<p>Username: {{ username() }}</p>

<input type="email" [(ngModel)]="email" placeholder="Enter email">
<p>Email: {{ email() }}</p>
```

## 3. One-Way Binding with Event Handler

**app.component.ts:**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  username: string = '';

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.username = target.value;
  }
}
```

**app.component.html:**
```html
<input 
  type="text" 
  [value]="username"
  (input)="onInputChange($event)"
  placeholder="Enter username">
<p>Username: {{ username }}</p>
```

## 4. Reactive Forms (Recommended for Complex Forms)

**app.component.ts:**
```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  userForm = new FormGroup({
    username: new FormControl(''),
    email: new FormControl('')
  });

  onSubmit() {
    console.log(this.userForm.value);
  }
}
```

**app.component.html:**
```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <input type="text" formControlName="username" placeholder="Username">
  <input type="email" formControlName="email" placeholder="Email">
  <button type="submit">Submit</button>
</form>

<p>Username: {{ userForm.get('username')?.value }}</p>
<p>Email: {{ userForm.get('email')?.value }}</p>
```

## 5. Reactive Forms with Signals (Angular 20)

**app.component.ts:**
```typescript
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  username = new FormControl('');
  email = new FormControl('');

  // Create signals that update with form values
  usernameValue = signal('');
  emailValue = signal('');

  ngOnInit() {
    // Subscribe to value changes
    this.username.valueChanges.subscribe(value => {
      this.usernameValue.set(value || '');
    });

    this.email.valueChanges.subscribe(value => {
      this.emailValue.set(value || '');
    });
  }
}
```

**app.component.html:**
```html
<input type="text" [formControl]="username" placeholder="Username">
<input type="email" [formControl]="email" placeholder="Email">

<p>Username: {{ usernameValue() }}</p>
<p>Email: {{ emailValue() }}</p>
```

## 6. Model-based Two-Way Binding (Angular 20 - New!)

**app.component.ts:**
```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent {
  username = model('');
  email = model('');
}
```

**app.component.html:**
```html
<input type="text" [(ngModel)]="username" placeholder="Username">
<input type="email" [(ngModel)]="email" placeholder="Email">

<p>Username: {{ username() }}</p>
<p>Email: {{ email() }}</p>
```

## 7. Complete Example with Validation

**app.component.ts:**
```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent {
  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    age: ['', [Validators.required, Validators.min(18)]]
  });

  constructor(private fb: FormBuilder) {}

  get username() {
    return this.userForm.get('username');
  }

  get email() {
    return this.userForm.get('email');
  }

  get age() {
    return this.userForm.get('age');
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form submitted:', this.userForm.value);
    }
  }
}
```

**app.component.html:**
```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <div>
    <input type="text" formControlName="username" placeholder="Username">
    <div *ngIf="username?.invalid && username?.touched">
      <small *ngIf="username?.errors?.['required']">Username is required</small>
      <small *ngIf="username?.errors?.['minlength']">Min 3 characters</small>
    </div>
  </div>

  <div>
    <input type="email" formControlName="email" placeholder="Email">
    <div *ngIf="email?.invalid && email?.touched">
      <small *ngIf="email?.errors?.['required']">Email is required</small>
      <small *ngIf="email?.errors?.['email']">Invalid email format</small>
    </div>
  </div>

  <div>
    <input type="number" formControlName="age" placeholder="Age">
    <div *ngIf="age?.invalid && age?.touched">
      <small *ngIf="age?.errors?.['required']">Age is required</small>
      <small *ngIf="age?.errors?.['min']">Must be 18 or older</small>
    </div>
  </div>

  <button type="submit" [disabled]="userForm.invalid">Submit</button>
</form>
```

## Quick Comparison

| Approach | Use Case | Pros | Cons |
|----------|----------|------|------|
| `[(ngModel)]` | Simple forms | Easy, two-way binding | Requires FormsModule |
| Signals + ngModel | Modern Angular 20 | Reactive, performant | Newer syntax |
| Event binding | Custom logic | Full control | More verbose |
| Reactive Forms | Complex forms | Validation, testing | More setup |
| `model()` | Angular 20+ | Modern, clean | Very new |

## For Angular 20 - Best Practice:

**Use Signals + Reactive Forms:**
```typescript
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <input type="text" [formControl]="usernameControl">
    <p>Username: {{ username() }}</p>
  `
})
export class AppComponent {
  usernameControl = new FormControl('');
  username = signal('');

  ngOnInit() {
    this.usernameControl.valueChanges.subscribe(value => {
      this.username.set(value || '');
    });
  }
}
```

This combines the power of Reactive Forms (validation, testing) with the performance of Signals (fine-grained reactivity).