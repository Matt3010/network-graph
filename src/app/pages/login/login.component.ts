import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  rememberPassword = new FormControl(false);

  ngOnInit() {
    localStorage.setItem('network-should-remember-password', 'false');

    this.rememberPassword.valueChanges.subscribe((res) => {
      localStorage.setItem('network-should-remember-password', JSON.stringify(res));
    })
  }

}
