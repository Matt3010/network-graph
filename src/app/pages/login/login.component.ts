import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  shouldShowPass: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  rememberPassword = new FormControl(false);

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    localStorage.setItem('network-should-remember-password', 'false');

    this.rememberPassword.valueChanges.subscribe((res) => {
      localStorage.setItem('network-should-remember-password', JSON.stringify(res));
    })
  }

  togglePassword() {
    if(this.loginForm!.value!.password!.length > 0)
    this.shouldShowPass = !this.shouldShowPass;
  }

  deletePassword() {
    if(this.loginForm!.value!.password!.length > 0)
      this.loginForm!.controls.password.setValue('')
  }

  doLogin() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      token_name: 'login'
    });
  }


}
