import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './login-signup.html',
  styleUrl: './login-signup.scss'
})
export class LoginSignup {
  @Input({required: true}) title: string = "";
  @Output() onFormSubmit: EventEmitter<any> = new EventEmitter();

  submitForm(event: any): void {
    event.preventDefault();
    this.onFormSubmit.emit();
  }


}
