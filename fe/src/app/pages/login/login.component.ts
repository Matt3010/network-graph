import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {SocialAuthService} from "@abacritt/angularx-social-login";

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
    private authService: AuthService,
    private socialAuthService: SocialAuthService
  ) {
  }

  ngOnInit() {
    localStorage.setItem('network-should-remember-password', 'false');

    this.rememberPassword.valueChanges.subscribe((res) => {
      localStorage.setItem('network-should-remember-password', JSON.stringify(res));
    })
    this.listenForGoogleLogin()
  }


  listenForGoogleLogin() {
    this.socialAuthService.authState.subscribe((user) => {
      console.log(user)
        this.authService.loginWithGoogle({
          email: user.email,
          idToken: user.idToken
        })
    });
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
